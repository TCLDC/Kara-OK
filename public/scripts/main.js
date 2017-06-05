(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _badLanguageFilter = require('bad-language-filter');

var _badLanguageFilter2 = _interopRequireDefault(_badLanguageFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var playlistRef = firebase.database().ref('/playlist');

//bad language filter
var filter = new _badLanguageFilter2.default();

var iconArray = ['fa-bell', 'fa-headphones', 'fa-rocket', 'fa-tree', 'fa-trophy', 'fa-volume-up', 'fa-hand-spock-o'];

karaOK.init = function () {
	karaOK.eventHandlers();
	karaOK.fullPage();
};

karaOK.fullPage = function () {
	$('#fullpage').fullpage({});
	$.fn.fullpage.setMouseWheelScrolling(false);
	$.fn.fullpage.setAllowScrolling(false);
};

karaOK.eventHandlers = function () {
	// BUTTONS
	// user clicks downward chevron to move through page
	$('#scrollDownToForm').on('click', function () {
		$.fn.fullpage.moveTo(2);
	});

	// on KARA NO-K (Explicit content) user clicks to return to search
	$('#backToSearch').on('click', function () {
		$.fn.fullpage.moveTo(2);
		$(".modalNo").removeClass("modalDisplay");
		$(".trackName").val("");
		$(".artistName").val("");
		$(".lyricsName").val("");
	});

	// 1. Receive user input.
	$('form').on('submit', function (event) {

		event.preventDefault();
		$('.songGallery').html('');
		var userTrackName = $('.trackName').val();
		var userArtistName = $('.artistName').val();
		var userLyricsName = $('.lyricsName').val();

		karaOK.getSongInfo(userTrackName, userArtistName, userLyricsName);
	});

	// 5. Receive user selection.
	$('.songGallery').on('click', '.galleryUnit', function () {
		$.fn.fullpage.moveTo(4);
		var trackID = $(this).data('track-id');

		karaOK.selectedAlbumName = $(this).find(".alName").text();
		karaOK.selectedArtistName = $(this).find(".arName").text();
		karaOK.selectedTrackName = $(this).find(".trName").text();

		karaOK.getLyrics(trackID);
	});

	$("#addToPlaylist").on("click", function () {
		$(".modalYes").removeClass("modalDisplay");
		// Move the li add to DOM section to for loop so list is created from firebase
		var safeListItem = {
			safeListAlbum: karaOK.selectedAlbumName,
			safelistArtist: karaOK.selectedArtistName,
			safeListTrack: karaOK.selectedTrackName
		};

		// 10. Allow user to save song to playlist
		playlistRef.push(safeListItem);

		playlistRef.on('value', function (firebaseData) {

			var playlist = firebaseData.val();
			$('.safePlayList').empty();
			//creates playlist
			for (var key in playlist) {

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

	$('.safePlayList').on('click', '.removeButton', function () {
		var safeListRemoveData = $(this).parent('.playListItem').data('firebaseId');
		var playlistEntry = firebase.database().ref('/playlist/' + safeListRemoveData);
		playlistEntry.remove();
	});

	$("#backToSearchFromPL").on('click', function () {
		$.fn.fullpage.moveTo(2);
		$(".trackName").val("");
		$(".artistName").val("");
		$(".lyricsName").val("");
	});
};
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
	}).then(function (result) {
		// 4. Display API request results on screen
		var trackList = result.message.body.track_list;

		if (trackList.length === 0) {
			alert("That's not a valid song choice. Please try again.");
		} else {
			trackList.forEach(function (track) {
				$.fn.fullpage.moveTo(3);

				var galleryUnit = $('<li>').addClass('galleryUnit');

				var randomIconClass = karaOK.pickRandomIcon();
				var randomIcon = $('<i>').addClass('fa').addClass(randomIconClass);
				// var coverArt = $('<img>').attr('src', track.track.album_coverart_100x100);
				var albumNameContent = track.track.album_name.substring(0, 22);
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
};

karaOK.pickRandomIcon = function () {
	var randIndex = Math.floor(Math.random() * iconArray.length);
	return iconArray[randIndex];
};

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
	}).then(function (result) {
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
};

$(function () {
	karaOK.init();
});

},{"bad-language-filter":3}],2:[function(require,module,exports){
module.exports={"badwords" : ["4r5e",
 "5h1t",
 "5hit",
 "a55",
 "anal",
  "anus",
  "ar5e",
  "arrse",
  "arse",
  "ass",
  "ass-fucker",
  "asses",
  "assfucker",
  "assfukka",
  "asshole",
  "assholes",
  "asswhole",
  "a_s_s",
  "b!tch",
  "b00bs",
  "b17ch",
  "b1tch",
  "ballbag",
  "balls",
  "ballsack",
  "bastard",
  "beastial",
  "beastiality",
  "bellend",
  "bestial",
  "bestiality",
  "bi+ch",
  "biatch",
  "bitch",
  "bitcher",
  "bitchers",
  "bitches",
  "bitchin",
  "bitching",
  "bloody",
  "blow job",
  "blowjob",
  "blowjobs",
  "boiolas",
  "bollock",
  "bollok",
  "boner",
  "boob",
  "boobs",
  "booobs",
  "boooobs",
  "booooobs",
  "booooooobs",
  "breasts",
  "buceta",
  "bugger",
  "bum",
  "bunny fucker",
  "butt",
  "butthole",
  "buttmuch",
  "buttplug",
  "c0ck",
  "c0cksucker",
  "carpet muncher",
  "cawk",
  "chink",
  "cipa",
  "cl1t",
  "clit",
  "clitoris",
  "clits",
  "cnut",
  "cock",
  "cock-sucker",
  "cockface",
  "cockhead",
  "cockmunch",
  "cockmuncher",
  "cocks",
  "cocksuck",
  "cocksucked",
  "cocksucker",
  "cocksucking",
  "cocksucks",
  "cocksuka",
  "cocksukka",
  "cok",
  "cokmuncher",
  "coksucka",
  "coon",
  "cox",
  "crap",
  "cum",
  "cummer",
  "cumming",
  "cums",
  "cumshot",
  "cunilingus",
  "cunillingus",
  "cunnilingus",
  "cunt",
  "cuntlick",
  "cuntlicker",
  "cuntlicking",
  "cunts",
  "cyalis",
  "cyberfuc",
  "cyberfuck",
  "cyberfucked",
  "cyberfucker",
  "cyberfuckers",
  "cyberfucking",
  "d1ck",
  "damn",
  "dick",
  "dickhead",
  "dildo",
  "dildos",
  "dink",
  "dinks",
  "dirsa",
  "dlck",
  "dog-fucker",
  "doggin",
  "dogging",
  "donkeyribber",
  "doosh",
  "duche",
  "dyke",
  "ejaculate",
  "ejaculated",
  "ejaculates",
  "ejaculating",
  "ejaculatings",
  "ejaculation",
  "ejakulate",
  "f u c k",
  "f u c k e r",
  "f4nny",
  "fag",
  "fagging",
  "faggitt",
  "faggot",
  "faggs",
  "fagot",
  "fagots",
  "fags",
  "fanny",
  "fannyflaps",
  "fannyfucker",
  "fanyy",
  "fatass",
  "fcuk",
  "fcuker",
  "fcuking",
  "feck",
  "fecker",
  "felching",
  "fellate",
  "fellatio",
  "fingerfuck",
  "fingerfucked",
  "fingerfucker",
  "fingerfuckers",
  "fingerfucking",
  "fingerfucks",
  "fistfuck",
  "fistfucked",
  "fistfucker",
  "fistfuckers",
  "fistfucking",
  "fistfuckings",
  "fistfucks",
  "flange",
  "fook",
  "fooker",
  "fuck",
  "fucka",
  "fucked",
  "fucker",
  "fuckers",
  "fuckhead",
  "fuckheads",
  "fuckin",
  "fucking",
  "fuckings",
  "fuckingshitmotherfucker",
  "fuckme",
  "fucks",
  "fuckwhit",
  "fuckwit",
  "fudge packer",
  "fudgepacker",
  "fuk",
  "fuker",
  "fukker",
  "fukkin",
  "fuks",
  "fukwhit",
  "fukwit",
  "fux",
  "fux0r",
  "f_u_c_k",
  "gangbang",
  "gangbanged",
  "gangbangs",
  "gaylord",
  "gaysex",
  "goatse",
  "God",
  "god-dam",
  "god-damned",
  "goddamn",
  "goddamned",
  "hardcoresex",
  "hell",
  "heshe",
  "hoar",
  "hoare",
  "hoer",
  "homo",
  "hore",
  "horniest",
  "horny",
  "hotsex",
  "jack-off",
  "jackoff",
  "jap",
  "jerk-off",
  "jism",
  "jiz",
  "jizm",
  "jizz",
  "kawk",
  "knob",
  "knobead",
  "knobed",
  "knobend",
  "knobhead",
  "knobjocky",
  "knobjokey",
  "kock",
  "kondum",
  "kondums",
  "kum",
  "kummer",
  "kumming",
  "kums",
  "kunilingus",
  "l3i+ch",
  "l3itch",
  "labia",
  "lmfao",
  "lust",
  "lusting",
  "m0f0",
  "m0fo",
  "m45terbate",
  "ma5terb8",
  "ma5terbate",
  "masochist",
  "master-bate",
  "masterb8",
  "masterbat*",
  "masterbat3",
  "masterbate",
  "masterbation",
  "masterbations",
  "masturbate",
  "mo-fo",
  "mof0",
  "mofo",
  "mothafuck",
  "mothafucka",
  "mothafuckas",
  "mothafuckaz",
  "mothafucked",
  "mothafucker",
  "mothafuckers",
  "mothafuckin",
  "mothafucking",
  "mothafuckings",
  "mothafucks",
  "mother fucker",
  "motherfuck",
  "motherfucked",
  "motherfucker",
  "motherfuckers",
  "motherfuckin",
  "motherfucking",
  "motherfuckings",
  "motherfuckka",
  "motherfucks",
  "muff",
  "mutha",
  "muthafecker",
  "muthafuckker",
  "muther",
  "mutherfucker",
  "n1gga",
  "n1gger",
  "nazi",
  "nigg3r",
  "nigg4h",
  "nigga",
  "niggah",
  "niggas",
  "niggaz",
  "nigger",
  "niggers",
  "nob",
  "nob jokey",
  "nobhead",
  "nobjocky",
  "nobjokey",
  "numbnuts",
  "nutsack",
  "orgasim",
  "orgasims",
  "orgasm",
  "orgasms",
  "p0rn",
  "pawn",
  "pecker",
  "penis",
  "penisfucker",
  "phonesex",
  "phuck",
  "phuk",
  "phuked",
  "phuking",
  "phukked",
  "phukking",
  "phuks",
  "phuq",
  "pigfucker",
  "pimpis",
  "piss",
  "pissed",
  "pisser",
  "pissers",
  "pisses",
  "pissflaps",
  "pissin",
  "pissing",
  "pissoff",
  "poop",
  "porn",
  "porno",
  "pornography",
  "pornos",
  "prick",
  "pricks",
  "pron",
  "pube",
  "pusse",
  "pussi",
  "pussies",
  "pussy",
  "pussys",
  "rectum",
  "retard",
  "rimjaw",
  "rimming",
  "s hit",
  "s.o.b.",
  "sadist",
  "schlong",
  "screwing",
  "scroat",
  "scrote",
  "scrotum",
  "semen",
  "sex",
  "sh!+",
  "sh!t",
  "sh1t",
  "shag",
  "shagger",
  "shaggin",
  "shagging",
  "shemale",
  "shi+",
  "shit",
  "shitdick",
  "shite",
  "shited",
  "shitey",
  "shitfuck",
  "shitfull",
  "shithead",
  "shiting",
  "shitings",
  "shits",
  "shitted",
  "shitter",
  "shitters",
  "shitting",
  "shittings",
  "shitty",
  "skank",
  "slut",
  "sluts",
  "smegma",
  "smut",
  "snatch",
  "son-of-a-bitch",
  "spac",
  "spunk",
  "s_h_i_t",
  "t1tt1e5",
  "t1tties",
  "teets",
  "teez",
  "testical",
  "testicle",
  "tit",
  "titfuck",
  "tits",
  "titt",
  "tittie5",
  "tittiefucker",
  "titties",
  "tittyfuck",
  "tittywank",
  "titwank",
  "tosser",
  "turd",
  "tw4t",
  "twat",
  "twathead",
  "twatty",
  "twunt",
  "twunter",
  "v14gra",
  "v1gra",
  "vagina",
  "viagra",
  "vulva",
  "w00se",
  "wang",
  "wank",
  "wanker",
  "wanky",
  "whoar",
  "whore",
  "willies",
  "willy",
  "xrated",
  "xxx"
]}
},{}],3:[function(require,module,exports){
var fs = require('fs');
var badwords = require('./badwords.json').badwords;
var TextFinder = require('./textfinder');

// Constructor
function BadLanguageFilter() {
	this.textfinder = new TextFinder(badwords);
}

// Check if any bad words is contained in content
BadLanguageFilter.prototype.contains = function(content) {
	return this.textfinder.contains(content);
};

// Check if any bad words is contained in content and returns array of words
BadLanguageFilter.prototype.matches = function(content) {
    return this.textfinder.matches(content);
};

// Remove bad words from content
BadLanguageFilter.prototype.removeWords = function(content) {
    return this.textfinder.removeWords(content);
};

// Replace bad words from content
BadLanguageFilter.prototype.replaceWords = function(content, replacestr) {
    return this.textfinder.replaceWords(content, replacestr);
};

module.exports = BadLanguageFilter;
},{"./badwords.json":2,"./textfinder":4,"fs":5}],4:[function(require,module,exports){
// Constructor
function TextFinder(wordList) {
  this.wordlist = wordList;
  this.searchstring = new RegExp(wordList.join(" |").replace(/[^\w\s^|]/gi, ''), 'i');
  this.globalsearchstring = new RegExp(wordList.join(" |").replace(/[^\w\s^|]/gi, ''), 'gi');

}
// class methods
TextFinder.prototype.contains = function(content) {
	return this.searchstring.test(content);
};

TextFinder.prototype.matches = function(content) {
    return content.match(this.globalsearchstring);
};

TextFinder.prototype.removeWords = function(content) {
    return content.replace(this.globalsearchstring, '');
};

TextFinder.prototype.replaceWords = function(content, replacestr) {
    return content.replace(this.globalsearchstring, replacestr);
};


module.exports = TextFinder;
},{}],5:[function(require,module,exports){

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFJLFNBQVMsRUFBYjs7QUFFQSxPQUFPLE1BQVAsR0FBZ0Isa0NBQWhCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsU0FBUSx5Q0FERztBQUVYLGFBQVksK0JBRkQ7QUFHWCxjQUFhLHNDQUhGO0FBSVgsWUFBVyxlQUpBO0FBS1gsZ0JBQWUsMkJBTEo7QUFNWCxvQkFBbUI7QUFOUixDQUFiO0FBUUEsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBLElBQU0sY0FBYyxTQUFTLFFBQVQsR0FBb0IsR0FBcEIsQ0FBd0IsV0FBeEIsQ0FBcEI7O0FBRUE7QUFDQSxJQUFJLFNBQVMsaUNBQWI7O0FBRUEsSUFBTSxZQUFZLENBQUMsU0FBRCxFQUFZLGVBQVosRUFBNkIsV0FBN0IsRUFBMEMsU0FBMUMsRUFBcUQsV0FBckQsRUFBa0UsY0FBbEUsRUFBa0YsaUJBQWxGLENBQWxCOztBQUVBLE9BQU8sSUFBUCxHQUFjLFlBQVc7QUFDeEIsUUFBTyxhQUFQO0FBQ0EsUUFBTyxRQUFQO0FBQ0EsQ0FIRDs7QUFLQSxPQUFPLFFBQVAsR0FBa0IsWUFBVztBQUM1QixHQUFFLFdBQUYsRUFBZSxRQUFmLENBQXdCLEVBQXhCO0FBR0MsR0FBRSxFQUFGLENBQUssUUFBTCxDQUFjLHNCQUFkLENBQXFDLEtBQXJDO0FBQ0EsR0FBRSxFQUFGLENBQUssUUFBTCxD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQmFkTGFuZ3VhZ2VGaWx0ZXIgZnJvbSAnYmFkLWxhbmd1YWdlLWZpbHRlcic7XG5cbnZhciBrYXJhT0sgPSB7fTtcblxua2FyYU9LLmFwaWtleSA9ICcxMmIyN2E4MjljYWY1YzJmYmMxNTc1MWM1YTE2MDlkMSc7XG5cbi8vIEluaXRpYWxpemUgRmlyZWJhc2VcbnZhciBjb25maWcgPSB7XG4gIGFwaUtleTogXCJBSXphU3lCQVA1NXM5WU1mZDR1ZTJIOEpJY3R1ZTRLVkhSTWFFbm9cIixcbiAgYXV0aERvbWFpbjogXCJrYXJhLW9rLWM5NGQ4LmZpcmViYXNlYXBwLmNvbVwiLFxuICBkYXRhYmFzZVVSTDogXCJodHRwczovL2thcmEtb2stYzk0ZDguZmlyZWJhc2Vpby5jb21cIixcbiAgcHJvamVjdElkOiBcImthcmEtb2stYzk0ZDhcIixcbiAgc3RvcmFnZUJ1Y2tldDogXCJrYXJhLW9rLWM5NGQ4LmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjEwMTIxMTIyODYyMDRcIlxufTtcbmZpcmViYXNlLmluaXRpYWxpemVBcHAoY29uZmlnKTtcblxuY29uc3QgcGxheWxpc3RSZWYgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZignL3BsYXlsaXN0Jyk7XG5cbi8vYmFkIGxhbmd1YWdlIGZpbHRlclxudmFyIGZpbHRlciA9IG5ldyBCYWRMYW5ndWFnZUZpbHRlcigpO1xuXG5jb25zdCBpY29uQXJyYXkgPSBbJ2ZhLWJlbGwnLCAnZmEtaGVhZHBob25lcycsICdmYS1yb2NrZXQnLCAnZmEtdHJlZScsICdmYS10cm9waHknLCAnZmEtdm9sdW1lLXVwJywgJ2ZhLWhhbmQtc3BvY2stbyddXG5cbmthcmFPSy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGthcmFPSy5ldmVudEhhbmRsZXJzKCk7XG5cdGthcmFPSy5mdWxsUGFnZSgpO1xufVxuXG5rYXJhT0suZnVsbFBhZ2UgPSBmdW5jdGlvbigpIHtcblx0JCgnI2Z1bGxwYWdlJykuZnVsbHBhZ2Uoe1xuXHRcdFxuXHR9KTtcblx0XHQkLmZuLmZ1bGxwYWdlLnNldE1vdXNlV2hlZWxTY3JvbGxpbmcoZmFsc2UpO1xuXHRcdCQuZm4uZnVsbHBhZ2Uuc2V0QWxsb3dTY3JvbGxpbmcoZmFsc2UpO1xufVxuXG5rYXJhT0suZXZlbnRIYW5kbGVycyA9IGZ1bmN0aW9uICgpIHtcblx0Ly8gQlVUVE9OU1xuXHQvLyB1c2VyIGNsaWNrcyBkb3dud2FyZCBjaGV2cm9uIHRvIG1vdmUgdGhyb3VnaCBwYWdlXG5cdCQoJyNzY3JvbGxEb3duVG9Gb3JtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHQkLmZuLmZ1bGxwYWdlLm1vdmVUbygyKTtcblx0fSlcblxuXHQvLyBvbiBLQVJBIE5PLUsgKEV4cGxpY2l0IGNvbnRlbnQpIHVzZXIgY2xpY2tzIHRvIHJldHVybiB0byBzZWFyY2hcblx0JCgnI2JhY2tUb1NlYXJjaCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0JC5mbi5mdWxscGFnZS5tb3ZlVG8oMik7XG5cdFx0JChcIi5tb2RhbE5vXCIpLnJlbW92ZUNsYXNzKFwibW9kYWxEaXNwbGF5XCIpO1xuXHRcdCQoXCIudHJhY2tOYW1lXCIpLnZhbChcIlwiKTtcblx0XHQkKFwiLmFydGlzdE5hbWVcIikudmFsKFwiXCIpO1xuXHRcdCQoXCIubHlyaWNzTmFtZVwiKS52YWwoXCJcIik7XG5cdH0pXHRcblxuXHQvLyAxLiBSZWNlaXZlIHVzZXIgaW5wdXQuXG5cdCQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0JCgnLnNvbmdHYWxsZXJ5JykuaHRtbCgnJyk7XG5cdFx0dmFyIHVzZXJUcmFja05hbWUgPSAkKCcudHJhY2tOYW1lJykudmFsKCk7XG5cdFx0dmFyIHVzZXJBcnRpc3ROYW1lID0gJCgnLmFydGlzdE5hbWUnKS52YWwoKTtcblx0XHR2YXIgdXNlckx5cmljc05hbWUgPSAkKCcubHlyaWNzTmFtZScpLnZhbCgpO1xuXG5cdFx0a2FyYU9LLmdldFNvbmdJbmZvKHVzZXJUcmFja05hbWUsIHVzZXJBcnRpc3ROYW1lLCB1c2VyTHlyaWNzTmFtZSk7XG5cdH0pO1xuXG5cdC8vIDUuIFJlY2VpdmUgdXNlciBzZWxlY3Rpb24uXG5cdCQoJy5zb25nR2FsbGVyeScpLm9uKCdjbGljaycsICcuZ2FsbGVyeVVuaXQnLCBmdW5jdGlvbiAoKXtcblx0XHQkLmZuLmZ1bGxwYWdlLm1vdmVUbyg0KTtcblx0XHR2YXIgdHJhY2tJRCA9ICQodGhpcykuZGF0YSgndHJhY2staWQnKTtcblxuXHRcdGthcmFPSy5zZWxlY3RlZEFsYnVtTmFtZSA9ICQodGhpcykuZmluZChcIi5hbE5hbWVcIikudGV4dCgpO1xuXHRcdGthcmFPSy5zZWxlY3RlZEFydGlzdE5hbWUgPSAkKHRoaXMpLmZpbmQoXCIuYXJOYW1lXCIpLnRleHQoKTtcblx0XHRrYXJhT0suc2VsZWN0ZWRUcmFja05hbWUgPSAkKHRoaXMpLmZpbmQoXCIudHJOYW1lXCIpLnRleHQoKTtcblxuXHRcdGthcmFPSy5nZXRMeXJpY3ModHJhY2tJRCk7XG5cdH0pO1xuXG5cdCQoXCIjYWRkVG9QbGF5bGlzdFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cdFx0JChcIi5tb2RhbFllc1wiKS5yZW1vdmVDbGFzcyhcIm1vZGFsRGlzcGxheVwiKTtcblx0XHQvLyBNb3ZlIHRoZSBsaSBhZGQgdG8gRE9NIHNlY3Rpb24gdG8gZm9yIGxvb3Agc28gbGlzdCBpcyBjcmVhdGVkIGZyb20gZmlyZWJhc2Vcblx0XHR2YXIgc2FmZUxpc3RJdGVtID0ge1xuXHRcdFx0c2FmZUxpc3RBbGJ1bToga2FyYU9LLnNlbGVjdGVkQWxidW1OYW1lLFxuXHRcdFx0c2FmZWxpc3RBcnRpc3Q6IGthcmFPSy5zZWxlY3RlZEFydGlzdE5hbWUsXG5cdFx0XHRzYWZlTGlzdFRyYWNrOiBrYXJhT0suc2VsZWN0ZWRUcmFja05hbWVcblx0XHR9O1xuXG5cdFx0Ly8gMTAuIEFsbG93IHVzZXIgdG8gc2F2ZSBzb25nIHRvIHBsYXlsaXN0XG5cdFx0cGxheWxpc3RSZWYucHVzaChzYWZlTGlzdEl0ZW0pO1xuXG5cdFx0cGxheWxpc3RSZWYub24oJ3ZhbHVlJywgZnVuY3Rpb24oZmlyZWJhc2VEYXRhKSB7XG5cdFx0XHRcblx0XHRcdHZhciBwbGF5bGlzdCA9IGZpcmViYXNlRGF0YS52YWwoKTtcblx0XHRcdCQoJy5zYWZlUGxheUxpc3QnKS5lbXB0eSgpO1xuXHRcdFx0Ly9jcmVhdGVzIHBsYXlsaXN0XG5cdFx0XHRmb3IgKGxldCBrZXkgaW4gcGxheWxpc3QpIHtcblxuXHRcdFx0XHR2YXIgcGxheUxpc3RJY29uID0gJChcIjxpPlwiKS5hZGRDbGFzcyhcImZhXCIpLmFkZENsYXNzKFwiZmEtbXVzaWNcIik7XG5cdFx0XHRcdC8vIElzIHRoaXMgdGhlIHJpZ2h0IHdheSB0byBhZGQgdGhlIGljb24gaWYgd2UgYWxzbyBwdXQgdGhlIHZhciBuYW1lIGRvd24gaW4gdGhlIHBsYXlMaXN0SXRlbT8gSSB0cmllZCBhbmQgaXQgZGlkbid0IHdvcmtcblx0XHRcdFx0dmFyIHBsYXlsaXN0QWxidW0gPSAkKFwiPHA+XCIpLnRleHQocGxheWxpc3Rba2V5XS5zYWZlTGlzdEFsYnVtKS5hZGRDbGFzcygnYWxOYW1lJyk7XG5cdFx0XHRcdHZhciBwbGF5bGlzdEFydGlzdCA9ICQoXCI8cD5cIikudGV4dChwbGF5bGlzdFtrZXldLnNhZmVsaXN0QXJ0aXN0KS5hZGRDbGFzcygnYXJOYW1lJyk7IFxuXHRcdFx0XHR2YXIgcGxheWxpc3RUcmFjayA9ICQoXCI8cD5cIikudGV4dChwbGF5bGlzdFtrZXldLnNhZmVMaXN0VHJhY2spLmFkZENsYXNzKCd0ck5hbWUnKTtcblx0XHRcdFx0dmFyIHJlbW92ZVBsYXlsaXN0SXRlbSA9ICQoXCI8YnV0dG9uPlwiKS5hZGRDbGFzcygncmVtb3ZlQnV0dG9uJykudGV4dCgneCcpO1xuXG5cdFx0XHRcdHZhciBwbGF5TGlzdEl0ZW0gPSAkKFwiPGxpPlwiKS5hcHBlbmQocGxheUxpc3RJY29uLCBwbGF5bGlzdFRyYWNrLCBwbGF5bGlzdEFydGlzdCwgcGxheWxpc3RBbGJ1bSwgcmVtb3ZlUGxheWxpc3RJdGVtKS5hZGRDbGFzcygncGxheUxpc3RJdGVtJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRwbGF5TGlzdEl0ZW0gPSBwbGF5TGlzdEl0ZW0uZGF0YSgnZmlyZWJhc2VJZCcsIGtleSk7XG5cdFx0XHRcdCQoXCIuc2FmZVBsYXlMaXN0XCIpLmFwcGVuZChwbGF5TGlzdEl0ZW0pO1xuXHRcdFx0fVxuXHRcdFx0Ly93aGVuIHVzZXIgY2xpY2tzIG9uIEFkZCBUbyBQbGF5bGlzdCwgbW92ZSBkb3duIHRvIHBsYXlsaXN0XG5cdFx0XHQkLmZuLmZ1bGxwYWdlLm1vdmVUbyg1KTtcblx0XHR9KTtcblx0fSk7XG5cblx0JCgnLnNhZmVQbGF5TGlzdCcpLm9uKCdjbGljaycsICcucmVtb3ZlQnV0dG9uJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNhZmVMaXN0UmVtb3ZlRGF0YSA9ICQodGhpcykucGFyZW50KCcucGxheUxpc3RJdGVtJykuZGF0YSgnZmlyZWJhc2VJZCcpO1xuXHRcdGNvbnN0IHBsYXlsaXN0RW50cnkgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihgL3BsYXlsaXN0LyR7c2FmZUxpc3RSZW1vdmVEYXRhfWApO1xuXHRcdHBsYXlsaXN0RW50cnkucmVtb3ZlKCk7XG5cdH0pO1xuXG5cdCQoXCIjYmFja1RvU2VhcmNoRnJvbVBMXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0JC5mbi5mdWxscGFnZS5tb3ZlVG8oMik7XG5cdFx0JChcIi50cmFja05hbWVcIikudmFsKFwiXCIpO1xuXHRcdCQoXCIuYXJ0aXN0TmFtZVwiKS52YWwoXCJcIik7XG5cdFx0JChcIi5seXJpY3NOYW1lXCIpLnZhbChcIlwiKTtcblx0fSk7XG59XG4vLyAyLiBVc2UgdXNlciBpbnB1dCB0byBtYWtlIEFQSSByZXF1ZXN0L0FKQVggcmVxdWVzdC5cbi8vIDMuIEZpbHRlciB0aGUgcmVzdWx0cyAoaWUgc2VhcmNoIGJ5IGx5cmljcyBvbmx5LCBsYW5ndWFnZSwgZm9ybWF0IGV0YylcbmthcmFPSy5nZXRTb25nSW5mbyA9IGZ1bmN0aW9uICh0cmFjaywgYXJ0aXN0LCBseXJpY3MpIHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwOi8vYXBpLm11c2l4bWF0Y2guY29tL3dzLzEuMS90cmFjay5zZWFyY2gnLFxuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YXBpa2V5OiBrYXJhT0suYXBpa2V5LFxuXHRcdFx0cV90cmFjazogdHJhY2ssXG5cdFx0XHRxX2FydGlzdDogYXJ0aXN0LFxuXHRcdFx0cV9seXJpY3M6IGx5cmljcyxcblx0XHRcdGZfaGFzX2x5cmljczogJycsXG5cdFx0XHRmX2x5cmljc19sYW5ndWFnZTogJ2VuJyxcblx0XHRcdGZvcm1hdDogJ2pzb25wJyxcblx0XHRcdHBhZ2Vfc2l6ZTogMTBcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCl7XG5cdFx0Ly8gNC4gRGlzcGxheSBBUEkgcmVxdWVzdCByZXN1bHRzIG9uIHNjcmVlblxuXHRcdHZhciB0cmFja0xpc3QgPSByZXN1bHQubWVzc2FnZS5ib2R5LnRyYWNrX2xpc3RcblxuXHRcdGlmICh0cmFja0xpc3QubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRhbGVydChcIlRoYXQncyBub3QgYSB2YWxpZCBzb25nIGNob2ljZS4gUGxlYXNlIHRyeSBhZ2Fpbi5cIik7XG5cdFx0fSBlbHNlIHtcblx0XHR0cmFja0xpc3QuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuXHRcdFx0XHQkLmZuLmZ1bGxwYWdlLm1vdmVUbygzKTtcblxuXHRcdFx0XHR2YXIgZ2FsbGVyeVVuaXQgPSAkKCc8bGk+JykuYWRkQ2xhc3MoJ2dhbGxlcnlVbml0Jyk7XG5cblx0XHRcdFx0dmFyIHJhbmRvbUljb25DbGFzcyA9IGthcmFPSy5waWNrUmFuZG9tSWNvbigpO1xuXHRcdFx0XHR2YXIgcmFuZG9tSWNvbiA9ICQoJzxpPicpLmFkZENsYXNzKCdmYScpLmFkZENsYXNzKHJhbmRvbUljb25DbGFzcyk7XG5cdFx0XHRcdC8vIHZhciBjb3ZlckFydCA9ICQoJzxpbWc+JykuYXR0cignc3JjJywgdHJhY2sudHJhY2suYWxidW1fY292ZXJhcnRfMTAweDEwMCk7XG5cdFx0XHRcdHZhciBhbGJ1bU5hbWVDb250ZW50ID0gdHJhY2sudHJhY2suYWxidW1fbmFtZS5zdWJzdHJpbmcoMCwyMik7XG5cdFx0XHRcdHZhciBhbGJ1bU5hbWUgPSAkKCc8cD4nKS50ZXh0KGFsYnVtTmFtZUNvbnRlbnQpLmFkZENsYXNzKCdhbE5hbWUnKTtcblx0XHRcdFx0dmFyIGFydGlzdE5hbWUgPSAkKCc8cD4nKS50ZXh0KHRyYWNrLnRyYWNrLmFydGlzdF9uYW1lKS5hZGRDbGFzcygnYXJOYW1lJyk7XG5cdFx0XHRcdHZhciB0cmFja05hbWVDb250ZW50ID0gdHJhY2sudHJhY2sudHJhY2tfbmFtZS5zdWJzdHJpbmcoMCwgNTUpO1xuXHRcdFx0XHR2YXIgdHJhY2tOYW1lID0gJCgnPHA+JykudGV4dCh0cmFja05hbWVDb250ZW50KS5hZGRDbGFzcygndHJOYW1lJyk7XG5cdFx0XHRcdHZhciB0cmFja0lkID0gdHJhY2sudHJhY2sudHJhY2tfaWQ7XG5cblx0XHRcdFx0Z2FsbGVyeVVuaXQuZGF0YSgndHJhY2staWQnLCB0cmFja0lkKTtcblx0XHRcdFx0Z2FsbGVyeVVuaXQuYXBwZW5kKHJhbmRvbUljb24sIHRyYWNrTmFtZSwgYXJ0aXN0TmFtZSwgYWxidW1OYW1lKTtcblx0XHRcdFx0JCgnLnNvbmdHYWxsZXJ5JykuYXBwZW5kKGdhbGxlcnlVbml0KTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59XG5cbmthcmFPSy5waWNrUmFuZG9tSWNvbiA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHJhbmRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGljb25BcnJheS5sZW5ndGgpO1xuXHRyZXR1cm4gaWNvbkFycmF5W3JhbmRJbmRleF07XG59XG5cbi8vIDYuIE1ha2UgQVBJIHJlcXVlc3QgdG8gdHJhY2subHlyaWNzLmdldCwgXG5rYXJhT0suZ2V0THlyaWNzID0gZnVuY3Rpb24gKHRyYWNrSWQpIHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwOi8vYXBpLm11c2l4bWF0Y2guY29tL3dzLzEuMS90cmFjay5seXJpY3MuZ2V0Jyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFwaWtleToga2FyYU9LLmFwaWtleSxcblx0XHRcdHRyYWNrX2lkOiB0cmFja0lkLFxuXHRcdFx0Zm9ybWF0OiAnanNvbnAnXG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG5cdFx0Ly8gNy4gVXNlIGphdmFzY3JpcHQgZmlsdGVyIHRvIHNjYW4gdGhlIGx5cmljcyBmb3IgcHJvZmFuaXR5LlxuXHRcdC8vIDdhLiBHZXQgbHlyaWNzIGZyb20gdGhlIE11c2l4bWF0Y2ggQVBJXG5cdFx0dmFyIGx5cmljcyA9IHJlc3VsdC5tZXNzYWdlLmJvZHkubHlyaWNzLmx5cmljc19ib2R5O1xuXG5cdFx0Ly8gN2IuIEFQSSBvbmx5IHJldHVybnMgMzAlIG9mIGx5cmljcyBlcmdvIHdlIG5lZWQgdG8gdXNlIHRoZSBleHBsaWNpdCBudW1iZXIgdG8gZGV0ZXJtaW5lIGlmIHNvbmcgaXMgZXhwbGljaXQgKGRvdWJsZSB2ZXJpZmljYXRpb24pXG5cdFx0dmFyIGV4cGxpY2l0UmF0aW5nID0gcmVzdWx0Lm1lc3NhZ2UuYm9keS5seXJpY3MuZXhwbGljaXQ7XG5cdFx0XG5cdFx0dmFyIGZpbHRlclN3ZWFyID0gJyc7XG5cdFx0dmFyIGZpbHRlclN3ZWFyID0gZmlsdGVyLmNvbnRhaW5zKGx5cmljcyk7XG5cblx0XHQvLyA4LiBJRiB0aGVyZSBpcyBwcm9mYW5pdHkgT1IgZXhwbGljaXQgcmF0aW5nIGlzIDEgdGhlbiBkaXNwbGF5IG5lZ2F0aXZlICsgZmVlZGJhY2tcblx0XHRpZiAoZmlsdGVyU3dlYXIgPT09IHRydWUgfHwgZXhwbGljaXRSYXRpbmcgPT09IDEpIHtcblx0XHRcdCQoJy5tb2RhbE5vJykuYWRkQ2xhc3MoJ21vZGFsRGlzcGxheScpO1xuXHRcdC8vIDkuIElGIEVMU0UgZGlzcGxheSBncmVlbiArIGZlZWRiYWNrXG5cdFx0fSBlbHNlIGlmIChmaWx0ZXJTd2VhciA9PT0gZmFsc2UpIHtcblx0XHRcdCQoJy5tb2RhbFllcycpLmFkZENsYXNzKCdtb2RhbERpc3BsYXknKTtcblx0XHR9XG5cdH0pO1x0XG59XG5cbiQoZnVuY3Rpb24oKXtcblx0a2FyYU9LLmluaXQoKTtcbn0pO1xuXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJiYWR3b3Jkc1wiIDogW1wiNHI1ZVwiLFxyXG4gXCI1aDF0XCIsXHJcbiBcIjVoaXRcIixcclxuIFwiYTU1XCIsXHJcbiBcImFuYWxcIixcclxuICBcImFudXNcIixcclxuICBcImFyNWVcIixcclxuICBcImFycnNlXCIsXHJcbiAgXCJhcnNlXCIsXHJcbiAgXCJhc3NcIixcclxuICBcImFzcy1mdWNrZXJcIixcclxuICBcImFzc2VzXCIsXHJcbiAgXCJhc3NmdWNrZXJcIixcclxuICBcImFzc2Z1a2thXCIsXHJcbiAgXCJhc3Nob2xlXCIsXHJcbiAgXCJhc3Nob2xlc1wiLFxyXG4gIFwiYXNzd2hvbGVcIixcclxuICBcImFfc19zXCIsXHJcbiAgXCJiIXRjaFwiLFxyXG4gIFwiYjAwYnNcIixcclxuICBcImIxN2NoXCIsXHJcbiAgXCJiMXRjaFwiLFxyXG4gIFwiYmFsbGJhZ1wiLFxyXG4gIFwiYmFsbHNcIixcclxuICBcImJhbGxzYWNrXCIsXHJcbiAgXCJiYXN0YXJkXCIsXHJcbiAgXCJiZWFzdGlhbFwiLFxyXG4gIFwiYmVhc3RpYWxpdHlcIixcclxuICBcImJlbGxlbmRcIixcclxuICBcImJlc3RpYWxcIixcclxuICBcImJlc3RpYWxpdHlcIixcclxuICBcImJpK2NoXCIsXHJcbiAgXCJiaWF0Y2hcIixcclxuICBcImJpdGNoXCIsXHJcbiAgXCJiaXRjaGVyXCIsXHJcbiAgXCJiaXRjaGVyc1wiLFxyXG4gIFwiYml0Y2hlc1wiLFxyXG4gIFwiYml0Y2hpblwiLFxyXG4gIFwiYml0Y2hpbmdcIixcclxuICBcImJsb29keVwiLFxyXG4gIFwiYmxvdyBqb2JcIixcclxuICBcImJsb3dqb2JcIixcclxuICBcImJsb3dqb2JzXCIsXHJcbiAgXCJib2lvbGFzXCIsXHJcbiAgXCJib2xsb2NrXCIsXHJcbiAgXCJib2xsb2tcIixcclxuICBcImJvbmVyXCIsXHJcbiAgXCJib29iXCIsXHJcbiAgXCJib29ic1wiLFxyXG4gIFwiYm9vb2JzXCIsXHJcbiAgXCJib29vb2JzXCIsXHJcbiAgXCJib29vb29ic1wiLFxyXG4gIFwiYm9vb29vb29ic1wiLFxyXG4gIFwiYnJlYXN0c1wiLFxyXG4gIFwiYnVjZXRhXCIsXHJcbiAgXCJidWdnZXJcIixcclxuICBcImJ1bVwiLFxyXG4gIFwiYnVubnkgZnVja2VyXCIsXHJcbiAgXCJidXR0XCIsXHJcbiAgXCJidXR0aG9sZVwiLFxyXG4gIFwiYnV0dG11Y2hcIixcclxuICBcImJ1dHRwbHVnXCIsXHJcbiAgXCJjMGNrXCIsXHJcbiAgXCJjMGNrc3Vja2VyXCIsXHJcbiAgXCJjYXJwZXQgbXVuY2hlclwiLFxyXG4gIFwiY2F3a1wiLFxyXG4gIFwiY2hpbmtcIixcclxuICBcImNpcGFcIixcclxuICBcImNsMXRcIixcclxuICBcImNsaXRcIixcclxuICBcImNsaXRvcmlzXCIsXHJcbiAgXCJjbGl0c1wiLFxyXG4gIFwiY251dFwiLFxyXG4gIFwiY29ja1wiLFxyXG4gIFwiY29jay1zdWNrZXJcIixcclxuICBcImNvY2tmYWNlXCIsXHJcbiAgXCJjb2NraGVhZFwiLFxyXG4gIFwiY29ja211bmNoXCIsXHJcbiAgXCJjb2NrbXVuY2hlclwiLFxyXG4gIFwiY29ja3NcIixcclxuICBcImNvY2tzdWNrXCIsXHJcbiAgXCJjb2Nrc3Vja2VkXCIsXHJcbiAgXCJjb2Nrc3Vja2VyXCIsXHJcbiAgXCJjb2Nrc3Vja2luZ1wiLFxyXG4gIFwiY29ja3N1Y2tzXCIsXHJcbiAgXCJjb2Nrc3VrYVwiLFxyXG4gIFwiY29ja3N1a2thXCIsXHJcbiAgXCJjb2tcIixcclxuICBcImNva211bmNoZXJcIixcclxuICBcImNva3N1Y2thXCIsXHJcbiAgXCJjb29uXCIsXHJcbiAgXCJjb3hcIixcclxuICBcImNyYXBcIixcclxuICBcImN1bVwiLFxyXG4gIFwiY3VtbWVyXCIsXHJcbiAgXCJjdW1taW5nXCIsXHJcbiAgXCJjdW1zXCIsXHJcbiAgXCJjdW1zaG90XCIsXHJcbiAgXCJjdW5pbGluZ3VzXCIsXHJcbiAgXCJjdW5pbGxpbmd1c1wiLFxyXG4gIFwiY3VubmlsaW5ndXNcIixcclxuICBcImN1bnRcIixcclxuICBcImN1bnRsaWNrXCIsXHJcbiAgXCJjdW50bGlja2VyXCIsXHJcbiAgXCJjdW50bGlja2luZ1wiLFxyXG4gIFwiY3VudHNcIixcclxuICBcImN5YWxpc1wiLFxyXG4gIFwiY3liZXJmdWNcIixcclxuICBcImN5YmVyZnVja1wiLFxyXG4gIFwiY3liZXJmdWNrZWRcIixcclxuICBcImN5YmVyZnVja2VyXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlcnNcIixcclxuICBcImN5YmVyZnVja2luZ1wiLFxyXG4gIFwiZDFja1wiLFxyXG4gIFwiZGFtblwiLFxyXG4gIFwiZGlja1wiLFxyXG4gIFwiZGlja2hlYWRcIixcclxuICBcImRpbGRvXCIsXHJcbiAgXCJkaWxkb3NcIixcclxuICBcImRpbmtcIixcclxuICBcImRpbmtzXCIsXHJcbiAgXCJkaXJzYVwiLFxyXG4gIFwiZGxja1wiLFxyXG4gIFwiZG9nLWZ1Y2tlclwiLFxyXG4gIFwiZG9nZ2luXCIsXHJcbiAgXCJkb2dnaW5nXCIsXHJcbiAgXCJkb25rZXlyaWJiZXJcIixcclxuICBcImRvb3NoXCIsXHJcbiAgXCJkdWNoZVwiLFxyXG4gIFwiZHlrZVwiLFxyXG4gIFwiZWphY3VsYXRlXCIsXHJcbiAgXCJlamFjdWxhdGVkXCIsXHJcbiAgXCJlamFjdWxhdGVzXCIsXHJcbiAgXCJlamFjdWxhdGluZ1wiLFxyXG4gIFwiZWphY3VsYXRpbmdzXCIsXHJcbiAgXCJlamFjdWxhdGlvblwiLFxyXG4gIFwiZWpha3VsYXRlXCIsXHJcbiAgXCJmIHUgYyBrXCIsXHJcbiAgXCJmIHUgYyBrIGUgclwiLFxyXG4gIFwiZjRubnlcIixcclxuICBcImZhZ1wiLFxyXG4gIFwiZmFnZ2luZ1wiLFxyXG4gIFwiZmFnZ2l0dFwiLFxyXG4gIFwiZmFnZ290XCIsXHJcbiAgXCJmYWdnc1wiLFxyXG4gIFwiZmFnb3RcIixcclxuICBcImZhZ290c1wiLFxyXG4gIFwiZmFnc1wiLFxyXG4gIFwiZmFubnlcIixcclxuICBcImZhbm55ZmxhcHNcIixcclxuICBcImZhbm55ZnVja2VyXCIsXHJcbiAgXCJmYW55eVwiLFxyXG4gIFwiZmF0YXNzXCIsXHJcbiAgXCJmY3VrXCIsXHJcbiAgXCJmY3VrZXJcIixcclxuICBcImZjdWtpbmdcIixcclxuICBcImZlY2tcIixcclxuICBcImZlY2tlclwiLFxyXG4gIFwiZmVsY2hpbmdcIixcclxuICBcImZlbGxhdGVcIixcclxuICBcImZlbGxhdGlvXCIsXHJcbiAgXCJmaW5nZXJmdWNrXCIsXHJcbiAgXCJmaW5nZXJmdWNrZWRcIixcclxuICBcImZpbmdlcmZ1Y2tlclwiLFxyXG4gIFwiZmluZ2VyZnVja2Vyc1wiLFxyXG4gIFwiZmluZ2VyZnVja2luZ1wiLFxyXG4gIFwiZmluZ2VyZnVja3NcIixcclxuICBcImZpc3RmdWNrXCIsXHJcbiAgXCJmaXN0ZnVja2VkXCIsXHJcbiAgXCJmaXN0ZnVja2VyXCIsXHJcbiAgXCJmaXN0ZnVja2Vyc1wiLFxyXG4gIFwiZmlzdGZ1Y2tpbmdcIixcclxuICBcImZpc3RmdWNraW5nc1wiLFxyXG4gIFwiZmlzdGZ1Y2tzXCIsXHJcbiAgXCJmbGFuZ2VcIixcclxuICBcImZvb2tcIixcclxuICBcImZvb2tlclwiLFxyXG4gIFwiZnVja1wiLFxyXG4gIFwiZnVja2FcIixcclxuICBcImZ1Y2tlZFwiLFxyXG4gIFwiZnVja2VyXCIsXHJcbiAgXCJmdWNrZXJzXCIsXHJcbiAgXCJmdWNraGVhZFwiLFxyXG4gIFwiZnVja2hlYWRzXCIsXHJcbiAgXCJmdWNraW5cIixcclxuICBcImZ1Y2tpbmdcIixcclxuICBcImZ1Y2tpbmdzXCIsXHJcbiAgXCJmdWNraW5nc2hpdG1vdGhlcmZ1Y2tlclwiLFxyXG4gIFwiZnVja21lXCIsXHJcbiAgXCJmdWNrc1wiLFxyXG4gIFwiZnVja3doaXRcIixcclxuICBcImZ1Y2t3aXRcIixcclxuICBcImZ1ZGdlIHBhY2tlclwiLFxyXG4gIFwiZnVkZ2VwYWNrZXJcIixcclxuICBcImZ1a1wiLFxyXG4gIFwiZnVrZXJcIixcclxuICBcImZ1a2tlclwiLFxyXG4gIFwiZnVra2luXCIsXHJcbiAgXCJmdWtzXCIsXHJcbiAgXCJmdWt3aGl0XCIsXHJcbiAgXCJmdWt3aXRcIixcclxuICBcImZ1eFwiLFxyXG4gIFwiZnV4MHJcIixcclxuICBcImZfdV9jX2tcIixcclxuICBcImdhbmdiYW5nXCIsXHJcbiAgXCJnYW5nYmFuZ2VkXCIsXHJcbiAgXCJnYW5nYmFuZ3NcIixcclxuICBcImdheWxvcmRcIixcclxuICBcImdheXNleFwiLFxyXG4gIFwiZ29hdHNlXCIsXHJcbiAgXCJHb2RcIixcclxuICBcImdvZC1kYW1cIixcclxuICBcImdvZC1kYW1uZWRcIixcclxuICBcImdvZGRhbW5cIixcclxuICBcImdvZGRhbW5lZFwiLFxyXG4gIFwiaGFyZGNvcmVzZXhcIixcclxuICBcImhlbGxcIixcclxuICBcImhlc2hlXCIsXHJcbiAgXCJob2FyXCIsXHJcbiAgXCJob2FyZVwiLFxyXG4gIFwiaG9lclwiLFxyXG4gIFwiaG9tb1wiLFxyXG4gIFwiaG9yZVwiLFxyXG4gIFwiaG9ybmllc3RcIixcclxuICBcImhvcm55XCIsXHJcbiAgXCJob3RzZXhcIixcclxuICBcImphY2stb2ZmXCIsXHJcbiAgXCJqYWNrb2ZmXCIsXHJcbiAgXCJqYXBcIixcclxuICBcImplcmstb2ZmXCIsXHJcbiAgXCJqaXNtXCIsXHJcbiAgXCJqaXpcIixcclxuICBcImppem1cIixcclxuICBcImppenpcIixcclxuICBcImthd2tcIixcclxuICBcImtub2JcIixcclxuICBcImtub2JlYWRcIixcclxuICBcImtub2JlZFwiLFxyXG4gIFwia25vYmVuZFwiLFxyXG4gIFwia25vYmhlYWRcIixcclxuICBcImtub2Jqb2NreVwiLFxyXG4gIFwia25vYmpva2V5XCIsXHJcbiAgXCJrb2NrXCIsXHJcbiAgXCJrb25kdW1cIixcclxuICBcImtvbmR1bXNcIixcclxuICBcImt1bVwiLFxyXG4gIFwia3VtbWVyXCIsXHJcbiAgXCJrdW1taW5nXCIsXHJcbiAgXCJrdW1zXCIsXHJcbiAgXCJrdW5pbGluZ3VzXCIsXHJcbiAgXCJsM2krY2hcIixcclxuICBcImwzaXRjaFwiLFxyXG4gIFwibGFiaWFcIixcclxuICBcImxtZmFvXCIsXHJcbiAgXCJsdXN0XCIsXHJcbiAgXCJsdXN0aW5nXCIsXHJcbiAgXCJtMGYwXCIsXHJcbiAgXCJtMGZvXCIsXHJcbiAgXCJtNDV0ZXJiYXRlXCIsXHJcbiAgXCJtYTV0ZXJiOFwiLFxyXG4gIFwibWE1dGVyYmF0ZVwiLFxyXG4gIFwibWFzb2NoaXN0XCIsXHJcbiAgXCJtYXN0ZXItYmF0ZVwiLFxyXG4gIFwibWFzdGVyYjhcIixcclxuICBcIm1hc3RlcmJhdCpcIixcclxuICBcIm1hc3RlcmJhdDNcIixcclxuICBcIm1hc3RlcmJhdGVcIixcclxuICBcIm1hc3RlcmJhdGlvblwiLFxyXG4gIFwibWFzdGVyYmF0aW9uc1wiLFxyXG4gIFwibWFzdHVyYmF0ZVwiLFxyXG4gIFwibW8tZm9cIixcclxuICBcIm1vZjBcIixcclxuICBcIm1vZm9cIixcclxuICBcIm1vdGhhZnVja1wiLFxyXG4gIFwibW90aGFmdWNrYVwiLFxyXG4gIFwibW90aGFmdWNrYXNcIixcclxuICBcIm1vdGhhZnVja2F6XCIsXHJcbiAgXCJtb3RoYWZ1Y2tlZFwiLFxyXG4gIFwibW90aGFmdWNrZXJcIixcclxuICBcIm1vdGhhZnVja2Vyc1wiLFxyXG4gIFwibW90aGFmdWNraW5cIixcclxuICBcIm1vdGhhZnVja2luZ1wiLFxyXG4gIFwibW90aGFmdWNraW5nc1wiLFxyXG4gIFwibW90aGFmdWNrc1wiLFxyXG4gIFwibW90aGVyIGZ1Y2tlclwiLFxyXG4gIFwibW90aGVyZnVja1wiLFxyXG4gIFwibW90aGVyZnVja2VkXCIsXHJcbiAgXCJtb3RoZXJmdWNrZXJcIixcclxuICBcIm1vdGhlcmZ1Y2tlcnNcIixcclxuICBcIm1vdGhlcmZ1Y2tpblwiLFxyXG4gIFwibW90aGVyZnVja2luZ1wiLFxyXG4gIFwibW90aGVyZnVja2luZ3NcIixcclxuICBcIm1vdGhlcmZ1Y2trYVwiLFxyXG4gIFwibW90aGVyZnVja3NcIixcclxuICBcIm11ZmZcIixcclxuICBcIm11dGhhXCIsXHJcbiAgXCJtdXRoYWZlY2tlclwiLFxyXG4gIFwibXV0aGFmdWNra2VyXCIsXHJcbiAgXCJtdXRoZXJcIixcclxuICBcIm11dGhlcmZ1Y2tlclwiLFxyXG4gIFwibjFnZ2FcIixcclxuICBcIm4xZ2dlclwiLFxyXG4gIFwibmF6aVwiLFxyXG4gIFwibmlnZzNyXCIsXHJcbiAgXCJuaWdnNGhcIixcclxuICBcIm5pZ2dhXCIsXHJcbiAgXCJuaWdnYWhcIixcclxuICBcIm5pZ2dhc1wiLFxyXG4gIFwibmlnZ2F6XCIsXHJcbiAgXCJuaWdnZXJcIixcclxuICBcIm5pZ2dlcnNcIixcclxuICBcIm5vYlwiLFxyXG4gIFwibm9iIGpva2V5XCIsXHJcbiAgXCJub2JoZWFkXCIsXHJcbiAgXCJub2Jqb2NreVwiLFxyXG4gIFwibm9iam9rZXlcIixcclxuICBcIm51bWJudXRzXCIsXHJcbiAgXCJudXRzYWNrXCIsXHJcbiAgXCJvcmdhc2ltXCIsXHJcbiAgXCJvcmdhc2ltc1wiLFxyXG4gIFwib3JnYXNtXCIsXHJcbiAgXCJvcmdhc21zXCIsXHJcbiAgXCJwMHJuXCIsXHJcbiAgXCJwYXduXCIsXHJcbiAgXCJwZWNrZXJcIixcclxuICBcInBlbmlzXCIsXHJcbiAgXCJwZW5pc2Z1Y2tlclwiLFxyXG4gIFwicGhvbmVzZXhcIixcclxuICBcInBodWNrXCIsXHJcbiAgXCJwaHVrXCIsXHJcbiAgXCJwaHVrZWRcIixcclxuICBcInBodWtpbmdcIixcclxuICBcInBodWtrZWRcIixcclxuICBcInBodWtraW5nXCIsXHJcbiAgXCJwaHVrc1wiLFxyXG4gIFwicGh1cVwiLFxyXG4gIFwicGlnZnVja2VyXCIsXHJcbiAgXCJwaW1waXNcIixcclxuICBcInBpc3NcIixcclxuICBcInBpc3NlZFwiLFxyXG4gIFwicGlzc2VyXCIsXHJcbiAgXCJwaXNzZXJzXCIsXHJcbiAgXCJwaXNzZXNcIixcclxuICBcInBpc3NmbGFwc1wiLFxyXG4gIFwicGlzc2luXCIsXHJcbiAgXCJwaXNzaW5nXCIsXHJcbiAgXCJwaXNzb2ZmXCIsXHJcbiAgXCJwb29wXCIsXHJcbiAgXCJwb3JuXCIsXHJcbiAgXCJwb3Jub1wiLFxyXG4gIFwicG9ybm9ncmFwaHlcIixcclxuICBcInBvcm5vc1wiLFxyXG4gIFwicHJpY2tcIixcclxuICBcInByaWNrc1wiLFxyXG4gIFwicHJvblwiLFxyXG4gIFwicHViZVwiLFxyXG4gIFwicHVzc2VcIixcclxuICBcInB1c3NpXCIsXHJcbiAgXCJwdXNzaWVzXCIsXHJcbiAgXCJwdXNzeVwiLFxyXG4gIFwicHVzc3lzXCIsXHJcbiAgXCJyZWN0dW1cIixcclxuICBcInJldGFyZFwiLFxyXG4gIFwicmltamF3XCIsXHJcbiAgXCJyaW1taW5nXCIsXHJcbiAgXCJzIGhpdFwiLFxyXG4gIFwicy5vLmIuXCIsXHJcbiAgXCJzYWRpc3RcIixcclxuICBcInNjaGxvbmdcIixcclxuICBcInNjcmV3aW5nXCIsXHJcbiAgXCJzY3JvYXRcIixcclxuICBcInNjcm90ZVwiLFxyXG4gIFwic2Nyb3R1bVwiLFxyXG4gIFwic2VtZW5cIixcclxuICBcInNleFwiLFxyXG4gIFwic2ghK1wiLFxyXG4gIFwic2ghdFwiLFxyXG4gIFwic2gxdFwiLFxyXG4gIFwic2hhZ1wiLFxyXG4gIFwic2hhZ2dlclwiLFxyXG4gIFwic2hhZ2dpblwiLFxyXG4gIFwic2hhZ2dpbmdcIixcclxuICBcInNoZW1hbGVcIixcclxuICBcInNoaStcIixcclxuICBcInNoaXRcIixcclxuICBcInNoaXRkaWNrXCIsXHJcbiAgXCJzaGl0ZVwiLFxyXG4gIFwic2hpdGVkXCIsXHJcbiAgXCJzaGl0ZXlcIixcclxuICBcInNoaXRmdWNrXCIsXHJcbiAgXCJzaGl0ZnVsbFwiLFxyXG4gIFwic2hpdGhlYWRcIixcclxuICBcInNoaXRpbmdcIixcclxuICBcInNoaXRpbmdzXCIsXHJcbiAgXCJzaGl0c1wiLFxyXG4gIFwic2hpdHRlZFwiLFxyXG4gIFwic2hpdHRlclwiLFxyXG4gIFwic2hpdHRlcnNcIixcclxuICBcInNoaXR0aW5nXCIsXHJcbiAgXCJzaGl0dGluZ3NcIixcclxuICBcInNoaXR0eVwiLFxyXG4gIFwic2thbmtcIixcclxuICBcInNsdXRcIixcclxuICBcInNsdXRzXCIsXHJcbiAgXCJzbWVnbWFcIixcclxuICBcInNtdXRcIixcclxuICBcInNuYXRjaFwiLFxyXG4gIFwic29uLW9mLWEtYml0Y2hcIixcclxuICBcInNwYWNcIixcclxuICBcInNwdW5rXCIsXHJcbiAgXCJzX2hfaV90XCIsXHJcbiAgXCJ0MXR0MWU1XCIsXHJcbiAgXCJ0MXR0aWVzXCIsXHJcbiAgXCJ0ZWV0c1wiLFxyXG4gIFwidGVlelwiLFxyXG4gIFwidGVzdGljYWxcIixcclxuICBcInRlc3RpY2xlXCIsXHJcbiAgXCJ0aXRcIixcclxuICBcInRpdGZ1Y2tcIixcclxuICBcInRpdHNcIixcclxuICBcInRpdHRcIixcclxuICBcInRpdHRpZTVcIixcclxuICBcInRpdHRpZWZ1Y2tlclwiLFxyXG4gIFwidGl0dGllc1wiLFxyXG4gIFwidGl0dHlmdWNrXCIsXHJcbiAgXCJ0aXR0eXdhbmtcIixcclxuICBcInRpdHdhbmtcIixcclxuICBcInRvc3NlclwiLFxyXG4gIFwidHVyZFwiLFxyXG4gIFwidHc0dFwiLFxyXG4gIFwidHdhdFwiLFxyXG4gIFwidHdhdGhlYWRcIixcclxuICBcInR3YXR0eVwiLFxyXG4gIFwidHd1bnRcIixcclxuICBcInR3dW50ZXJcIixcclxuICBcInYxNGdyYVwiLFxyXG4gIFwidjFncmFcIixcclxuICBcInZhZ2luYVwiLFxyXG4gIFwidmlhZ3JhXCIsXHJcbiAgXCJ2dWx2YVwiLFxyXG4gIFwidzAwc2VcIixcclxuICBcIndhbmdcIixcclxuICBcIndhbmtcIixcclxuICBcIndhbmtlclwiLFxyXG4gIFwid2Fua3lcIixcclxuICBcIndob2FyXCIsXHJcbiAgXCJ3aG9yZVwiLFxyXG4gIFwid2lsbGllc1wiLFxyXG4gIFwid2lsbHlcIixcclxuICBcInhyYXRlZFwiLFxyXG4gIFwieHh4XCJcclxuXX0iLCJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xyXG52YXIgYmFkd29yZHMgPSByZXF1aXJlKCcuL2JhZHdvcmRzLmpzb24nKS5iYWR3b3JkcztcclxudmFyIFRleHRGaW5kZXIgPSByZXF1aXJlKCcuL3RleHRmaW5kZXInKTtcclxuXHJcbi8vIENvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIEJhZExhbmd1YWdlRmlsdGVyKCkge1xyXG5cdHRoaXMudGV4dGZpbmRlciA9IG5ldyBUZXh0RmluZGVyKGJhZHdvcmRzKTtcclxufVxyXG5cclxuLy8gQ2hlY2sgaWYgYW55IGJhZCB3b3JkcyBpcyBjb250YWluZWQgaW4gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcblx0cmV0dXJuIHRoaXMudGV4dGZpbmRlci5jb250YWlucyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIENoZWNrIGlmIGFueSBiYWQgd29yZHMgaXMgY29udGFpbmVkIGluIGNvbnRlbnQgYW5kIHJldHVybnMgYXJyYXkgb2Ygd29yZHNcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLm1hdGNoZXMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBSZW1vdmUgYmFkIHdvcmRzIGZyb20gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUucmVtb3ZlV29yZHMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLnJlbW92ZVdvcmRzKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gUmVwbGFjZSBiYWQgd29yZHMgZnJvbSBjb250ZW50XHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5yZXBsYWNlV29yZHMgPSBmdW5jdGlvbihjb250ZW50LCByZXBsYWNlc3RyKSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLnJlcGxhY2VXb3Jkcyhjb250ZW50LCByZXBsYWNlc3RyKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFkTGFuZ3VhZ2VGaWx0ZXI7IiwiLy8gQ29uc3RydWN0b3JcclxuZnVuY3Rpb24gVGV4dEZpbmRlcih3b3JkTGlzdCkge1xyXG4gIHRoaXMud29yZGxpc3QgPSB3b3JkTGlzdDtcclxuICB0aGlzLnNlYXJjaHN0cmluZyA9IG5ldyBSZWdFeHAod29yZExpc3Quam9pbihcIiB8XCIpLnJlcGxhY2UoL1teXFx3XFxzXnxdL2dpLCAnJyksICdpJyk7XHJcbiAgdGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcgPSBuZXcgUmVnRXhwKHdvcmRMaXN0LmpvaW4oXCIgfFwiKS5yZXBsYWNlKC9bXlxcd1xcc158XS9naSwgJycpLCAnZ2knKTtcclxuXHJcbn1cclxuLy8gY2xhc3MgbWV0aG9kc1xyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuXHRyZXR1cm4gdGhpcy5zZWFyY2hzdHJpbmcudGVzdChjb250ZW50KTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gY29udGVudC5tYXRjaCh0aGlzLmdsb2JhbHNlYXJjaHN0cmluZyk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5yZW1vdmVXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UodGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcsICcnKTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLnJlcGxhY2VXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIHJlcGxhY2VzdHIpIHtcclxuICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UodGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcsIHJlcGxhY2VzdHIpO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dEZpbmRlcjsiLCIiXX0=
