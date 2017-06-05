import BadLanguageFilter from 'bad-language-filter';

var karaOK = {};

karaOK.apikey = '12b27a829caf5c2fbc15751c5a1609d1';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBAP55s9YMfd4ue2H8JIctue4KVHRMaEno",
  authDomain: "kara-ok-c94d8.firebaseapp.com",
  databaseURL: "https://kara-ok-c94d8.firebaseio.com",
  projectId: "kara-ok-c94d8",
  storageBucket: "kara-ok-c94d8.appspot.com",
  messagingSenderId: "1012112286204"
};
firebase.initializeApp(config);

const playlistRef = firebase.database().ref('/playlist');

//bad language filter
var filter = new BadLanguageFilter();

const iconArray = ['fa-bell', 'fa-headphones', 'fa-rocket', 'fa-tree', 'fa-trophy', 'fa-volume-up', 'fa-hand-spock-o']

karaOK.init = function() {
	karaOK.eventHandlers();
	karaOK.fullPage();
}

karaOK.fullPage = function() {
	$('#fullpage').fullpage({
		
	});
		$.fn.fullpage.setMouseWheelScrolling(false);
		$.fn.fullpage.setAllowScrolling(false);
}

karaOK.eventHandlers = function () {
	// BUTTONS
	// user clicks downward chevron to move through page
	$('#scrollDownToForm').on('click', function(){
		$.fn.fullpage.moveTo(2);
	})

	// on KARA NO-K (Explicit content) user clicks to return to search
	$('#backToSearch').on('click', function(){
		$.fn.fullpage.moveTo(2);
		$(".modalNo").removeClass("modalDisplay");
		$(".trackName").val("");
		$(".artistName").val("");
		$(".lyricsName").val("");
	})	

	// 1. Receive user input.
	$('form').on('submit', function(event) {

		event.preventDefault();
		$('.songGallery').html('');
		var userTrackName = $('.trackName').val();
		var userArtistName = $('.artistName').val();
		var userLyricsName = $('.lyricsName').val();

		karaOK.getSongInfo(userTrackName, userArtistName, userLyricsName);
	});

	// 5. Receive user selection.
	$('.songGallery').on('click', '.galleryUnit', function (){
		$.fn.fullpage.moveTo(4);
		var trackID = $(this).data('track-id');

		karaOK.selectedAlbumName = $(this).find(".alName").text();
		karaOK.selectedArtistName = $(this).find(".arName").text();
		karaOK.selectedTrackName = $(this).find(".trName").text();

		karaOK.getLyrics(trackID);
	});

	$("#addToPlaylist").on("click", function(){
		$(".modalYes").removeClass("modalDisplay");
		// Move the li add to DOM section to for loop so list is created from firebase
		var safeListItem = {
			safeListAlbum: karaOK.selectedAlbumName,
			safelistArtist: karaOK.selectedArtistName,
			safeListTrack: karaOK.selectedTrackName
		};

		// 10. Allow user to save song to playlist
		playlistRef.push(safeListItem);

		playlistRef.on('value', function(firebaseData) {
			
			var playlist = firebaseData.val();
			$('.safePlayList').empty();
			//creates playlist
			for (let key in playlist) {

				var playListIcon = $("<i>").addClass("fa").addClass("fa-music");
				// Is this the right way to add the icon if we also put the var name down in the playListItem? I tried and it didn't work
				var playlistAlbum = $("<p>").text(playlist[key].safeListAlbum).addClass('alName');
				var playlistArtist = $("<p>").text(playlist[key].safelistArtist).addClass('arName'); 
				var playlistTrack = $("<p>").text(playlist[key].safeListTrack).addClass('trName');
				var removePlaylistItem = $("<button>").addClass('removeButton').text('x');

				var playListItem = $("<li>").append(playListIcon, playlistTrack, playlistArtist, playlistAlbum, removePlaylistItem).addClass('playListItem');
				
				playListItem = playListItem.data('firebaseId', key);
				$(".safePlayList").append(playListItem);
			}
			//when user clicks on Add To Playlist, move down to playlist
			$.fn.fullpage.moveTo(5);
		});
	});

	$('.safePlayList').on('click', '.removeButton', function() {
		var safeListRemoveData = $(this).parent('.playListItem').data('firebaseId');
		const playlistEntry = firebase.database().ref(`/playlist/${safeListRemoveData}`);
		playlistEntry.remove();
	});

	$("#backToSearchFromPL").on('click', function(){
		$.fn.fullpage.moveTo(2);
		$(".trackName").val("");
		$(".artistName").val("");
		$(".lyricsName").val("");
	});
}
// 2. Use user input to make API request/AJAX request.
// 3. Filter the results (ie search by lyrics only, language, format etc)
karaOK.getSongInfo = function (track, artist, lyrics) {
	$.ajax({
		url: 'http://api.musixmatch.com/ws/1.1/track.search',
		method: 'GET',
		dataType: 'jsonp',
		data: {
			apikey: karaOK.apikey,
			q_track: track,
			q_artist: artist,
			q_lyrics: lyrics,
			f_has_lyrics: '',
			f_lyrics_language: 'en',
			format: 'jsonp',
			page_size: 10
		}
	}).then(function (result){
		// 4. Display API request results on screen
		var trackList = result.message.body.track_list

		if (trackList.length === 0) {
			alert("That's not a valid song choice. Please try again.");
		} else {
		trackList.forEach(function(track) {
				$.fn.fullpage.moveTo(3);

				var galleryUnit = $('<li>').addClass('galleryUnit');

				var randomIconClass = karaOK.pickRandomIcon();
				var randomIcon = $('<i>').addClass('fa').addClass(randomIconClass);
				// var coverArt = $('<img>').attr('src', track.track.album_coverart_100x100);
				var albumNameContent = track.track.album_name.substring(0,22);
				var albumName = $('<p>').text(albumNameContent).addClass('alName');
				var artistName = $('<p>').text(track.track.artist_name).addClass('arName');
				var trackNameContent = track.track.track_name.substring(0, 55);
				var trackName = $('<p>').text(trackNameContent).addClass('trName');
				var trackId = track.track.track_id;

				galleryUnit.data('track-id', trackId);
				galleryUnit.append(randomIcon, trackName, artistName, albumName);
				$('.songGallery').append(galleryUnit);
			});
		}
	});
}

karaOK.pickRandomIcon = function () {
	var randIndex = Math.floor(Math.random() * iconArray.length);
	return iconArray[randIndex];
}

// 6. Make API request to track.lyrics.get, 
karaOK.getLyrics = function (trackId) {
	$.ajax({
		url: 'http://api.musixmatch.com/ws/1.1/track.lyrics.get',
		method: 'GET',
		dataType: 'jsonp',
		data: {
			apikey: karaOK.apikey,
			track_id: trackId,
			format: 'jsonp'
		}
	}).then(function(result){
		// 7. Use javascript filter to scan the lyrics for profanity.
		// 7a. Get lyrics from the Musixmatch API
		var lyrics = result.message.body.lyrics.lyrics_body;

		// 7b. API only returns 30% of lyrics ergo we need to use the explicit number to determine if song is explicit (double verification)
		var explicitRating = result.message.body.lyrics.explicit;
		
		var filterSwear = '';
		var filterSwear = filter.contains(lyrics);

		// 8. IF there is profanity OR explicit rating is 1 then display negative + feedback
		if (filterSwear === true || explicitRating === 1) {
			$('.modalNo').addClass('modalDisplay');
		// 9. IF ELSE display green + feedback
		} else if (filterSwear === false) {
			$('.modalYes').addClass('modalDisplay');
		}
	});	
}

$(function(){
	karaOK.init();
});

