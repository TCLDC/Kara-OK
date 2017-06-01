import BadLanguageFilter from 'bad-language-filter';

// 7. Use javascript filter to scan the lyrics for profanity.
// 8. IF there is profanity display red + feedback
// 9. IF ELSE display green + feedback
// 10. Allow user to save song to playlist

var karaOK = {};

karaOK.apikey = '12b27a829caf5c2fbc15751c5a1609d1';

		// <========= FILTER BAD WORDS ==========>

// var fs = require('fs');
// var badwords = require('./badwords.json').badwords;
// var TextFinder = require('./textfinder');

// // Constructor
// function BadLanguageFilter() {
// 	this.textfinder = new TextFinder(badwords);
// }

// // Check if any bad words is contained in content
// BadLanguageFilter.prototype.contains = function(content) {
// 	return this.textfinder.contains(content);
// };

		// <========= FILTER BAD WORDS ==========>

karaOK.init = function() {
	karaOK.eventHandlers();
}

karaOK.eventHandlers = function () {

	// 1. Receive user input.
	$('form').on('submit', function(event) {

		event.preventDefault();
		var userTrackName = $('.trackName').val();
		var userArtistName = $('.artistName').val();
		var userLyricsName = $('.lyricsName').val();

		karaOK.getSongInfo(userTrackName, userArtistName, userLyricsName);

		console.log(userArtistName);
	});

	// 5. Receive user selection.
	$('.songGallery').on('click', '.galleryUnit', function (){

		var trackID = $(this).data('track-id');
		karaOK.getLyrics(trackID);

	})

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
			page_size: 100
		}
	}).then(function (result){
		// 4. Display API request results on screen
		// 	(track_id, track_name, explicit, album_name, artist_name, album_coverart_100x100, track_share_url)
		var trackList = result.message.body.track_list

		trackList.forEach(function(track) {

			var galleryUnit = $('<li>').addClass('galleryUnit');

			var coverArt = $('<img>').attr('src', track.track.album_coverart_100x100);
			var albumName = $('<h3>').text(track.track.album_name);
			var artistName = $('<h3>').text(track.track.artist_name);
			var trackName = $('<h2>').text(track.track.track_name);

			var trackId = track.track.track_id;

			galleryUnit.data('track-id', trackId);
			galleryUnit.append(coverArt, trackName, artistName, albumName);

			$('.songGallery').append(galleryUnit);

		});

	});
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
		console.log(result);
		var lyrics = result.message.body.lyrics.lyrics_body;
		console.log(lyrics);
	});	

}

$(function(){
	karaOK.init();
});

