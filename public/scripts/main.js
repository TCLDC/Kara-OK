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

karaOK.init = function () {
	karaOK.eventHandlers();
	karaOK.fullPage();
};

karaOK.fullPage = function () {
	$('#fullpage').fullpage({});
};

karaOK.eventHandlers = function () {

	// 1. Receive user input.
	$('form').on('submit', function (event) {
		$.fn.fullpage.moveTo(3);
		event.preventDefault();
		var userTrackName = $('.trackName').val();
		var userArtistName = $('.artistName').val();
		var userLyricsName = $('.lyricsName').val();

		karaOK.getSongInfo(userTrackName, userArtistName, userLyricsName);

		console.log(userArtistName);
	});

	// 5. Receive user selection.
	$('.songGallery').on('click', '.galleryUnit', function () {

		var trackID = $(this).data('track-id');

		karaOK.selectedAlbumName = $(this).find(".alName").text();
		karaOK.selectedArtistName = $(this).find(".arName").text();
		karaOK.selectedTrackName = $(this).find(".trName").text();

		karaOK.getLyrics(trackID);
	});

	$("#addToPlaylist").on("click", function () {

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

			for (var key in playlist) {
				console.log(key);
				console.log(playlist[key]);

				var playlistAlbum = $("<p>").text(playlist[key].safeListAlbum).addClass('alName');
				var playlistArtist = $("<p>").text(playlist[key].safelistArtist).addClass('arName');
				var playlistTrack = $("<p>").text(playlist[key].safeListTrack).addClass('trName');
				var removePlaylistItem = $("<button>").addClass('removeButton').text('-');

				var playListItem = $("<li >").append(playlistTrack, playlistArtist, playlistAlbum, removePlaylistItem).addClass(playListItem).data('firebaseId', playlist[key]);

				$(".safePlayList").append(playListItem);
			}
		});
	});

	$('.songGallery').on('click', '.removeButton', function () {
		var safeListRemoveData = $(this).data('firebaseId');
		var todoRef = firebase.database().ref('/playlist/' + safeListRemoveData);
		todoRef.remove();
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
		// 	(track_id, track_name, explicit, album_name, artist_name, album_coverart_100x100, track_share_url)
		var trackList = result.message.body.track_list;

		trackList.forEach(function (track) {

			var galleryUnit = $('<li>').addClass('galleryUnit');

			var coverArt = $('<img>').attr('src', track.track.album_coverart_100x100);
			var albumName = $('<p>').text(track.track.album_name).addClass('alName');
			var artistName = $('<p>').text(track.track.artist_name).addClass('arName');
			var trackName = $('<p>').text(track.track.track_name).addClass('trName');

			var trackId = track.track.track_id;

			galleryUnit.data('track-id', trackId);
			galleryUnit.append(coverArt, trackName, artistName, albumName);
			// var galleryUnitFinal = galleryUnit.append(coverArt, trackName, artistName, albumName);
			$('.songGallery').append(galleryUnit);
			// $('.songGallery').append(galleryUnitFinal);
		});
	});
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
		// console.log(result);
		var lyrics = result.message.body.lyrics.lyrics_body;
		console.log(lyrics);

		// 7. Use javascript filter to scan the lyrics for profanity.
		var filterSwear = '';
		var filterSwear = filter.contains(lyrics);
		console.log(filterSwear);

		// 8. IF there is profanity display red + feedback
		if (filterSwear === true) {
			$('.modalNo').addClass('modalDisplay');
			// 9. IF ELSE display green + feedback
		} else if (filterSwear === false) {
			$('.modalYes').addClass('modalDisplay');
		}
	});
};

karaOK.addToPlaylist = function () {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFJLFNBQVMsRUFBYjs7QUFFQSxPQUFPLE1BQVAsR0FBZ0Isa0NBQWhCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsU0FBUSx5Q0FERztBQUVYLGFBQVksK0JBRkQ7QUFHWCxjQUFhLHNDQUhGO0FBSVgsWUFBVyxlQUpBO0FBS1gsZ0JBQWUsMkJBTEo7QUFNWCxvQkFBbUI7QUFOUixDQUFiO0FBUUEsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBLElBQU0sY0FBYyxTQUFTLFFBQVQsR0FBb0IsR0FBcEIsQ0FBd0IsV0FBeEIsQ0FBcEI7O0FBRUE7QUFDQSxJQUFJLFNBQVMsaUNBQWI7O0FBRUEsT0FBTyxJQUFQLEdBQWMsWUFBVztBQUN4QixRQUFPLGFBQVA7QUFDQSxRQUFPLFFBQVA7QUFDQSxDQUhEOztBQUtBLE9BQU8sUUFBUCxHQUFrQixZQUFXO0FBQzVCLEdBQUUsV0FBRixFQUFlLFFBQWYsQ0FBd0IsRUFBeEI7QUFFQSxDQUhEOztBQUtBLE9BQU8sYUFBUCxHQUF1QixZQUFZOztBQUVsQztBQUNDLEdBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsS0FBVCxFQUFnQjtBQUN2QyxJQUFFLEVBQUYsQ0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixDQUFyQjtBQUNBLFFBQU0sY0FBTjtBQUNBLE1BQUksZ0JB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEJhZExhbmd1YWdlRmlsdGVyIGZyb20gJ2JhZC1sYW5ndWFnZS1maWx0ZXInO1xuXG52YXIga2FyYU9LID0ge307XG5cbmthcmFPSy5hcGlrZXkgPSAnMTJiMjdhODI5Y2FmNWMyZmJjMTU3NTFjNWExNjA5ZDEnO1xuXG4vLyBJbml0aWFsaXplIEZpcmViYXNlXG52YXIgY29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5QkFQNTVzOVlNZmQ0dWUySDhKSWN0dWU0S1ZIUk1hRW5vXCIsXG4gIGF1dGhEb21haW46IFwia2FyYS1vay1jOTRkOC5maXJlYmFzZWFwcC5jb21cIixcbiAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9rYXJhLW9rLWM5NGQ4LmZpcmViYXNlaW8uY29tXCIsXG4gIHByb2plY3RJZDogXCJrYXJhLW9rLWM5NGQ4XCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwia2FyYS1vay1jOTRkOC5hcHBzcG90LmNvbVwiLFxuICBtZXNzYWdpbmdTZW5kZXJJZDogXCIxMDEyMTEyMjg2MjA0XCJcbn07XG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbmNvbnN0IHBsYXlsaXN0UmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoJy9wbGF5bGlzdCcpO1xuXG4vL2JhZCBsYW5ndWFnZSBmaWx0ZXJcbnZhciBmaWx0ZXIgPSBuZXcgQmFkTGFuZ3VhZ2VGaWx0ZXIoKTtcblxua2FyYU9LLmluaXQgPSBmdW5jdGlvbigpIHtcblx0a2FyYU9LLmV2ZW50SGFuZGxlcnMoKTtcblx0a2FyYU9LLmZ1bGxQYWdlKCk7XG59XG5cbmthcmFPSy5mdWxsUGFnZSA9IGZ1bmN0aW9uKCkge1xuXHQkKCcjZnVsbHBhZ2UnKS5mdWxscGFnZSh7XG5cdH0pO1xufVxuXG5rYXJhT0suZXZlbnRIYW5kbGVycyA9IGZ1bmN0aW9uICgpIHtcblxuXHQvLyAxLiBSZWNlaXZlIHVzZXIgaW5wdXQuXG5cdFx0JCgnZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuXHRcdCQuZm4uZnVsbHBhZ2UubW92ZVRvKDMpO1xuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIHVzZXJUcmFja05hbWUgPSAkKCcudHJhY2tOYW1lJykudmFsKCk7XG5cdFx0dmFyIHVzZXJBcnRpc3ROYW1lID0gJCgnLmFydGlzdE5hbWUnKS52YWwoKTtcblx0XHR2YXIgdXNlckx5cmljc05hbWUgPSAkKCcubHlyaWNzTmFtZScpLnZhbCgpO1xuXG5cdFx0a2FyYU9LLmdldFNvbmdJbmZvKHVzZXJUcmFja05hbWUsIHVzZXJBcnRpc3ROYW1lLCB1c2VyTHlyaWNzTmFtZSk7XG5cblxuXHRcdCAgXG5cblxuXHRcdFx0XG5cdFx0Y29uc29sZS5sb2codXNlckFydGlzdE5hbWUpO1xuXHR9KTtcblxuXHQvLyA1LiBSZWNlaXZlIHVzZXIgc2VsZWN0aW9uLlxuXHQkKCcuc29uZ0dhbGxlcnknKS5vbignY2xpY2snLCAnLmdhbGxlcnlVbml0JywgZnVuY3Rpb24gKCl7XG5cblx0XHR2YXIgdHJhY2tJRCA9ICQodGhpcykuZGF0YSgndHJhY2staWQnKTtcblxuXHRcdGthcmFPSy5zZWxlY3RlZEFsYnVtTmFtZSA9ICQodGhpcykuZmluZChcIi5hbE5hbWVcIikudGV4dCgpO1xuXHRcdGthcmFPSy5zZWxlY3RlZEFydGlzdE5hbWUgPSAkKHRoaXMpLmZpbmQoXCIuYXJOYW1lXCIpLnRleHQoKTtcblx0XHRrYXJhT0suc2VsZWN0ZWRUcmFja05hbWUgPSAkKHRoaXMpLmZpbmQoXCIudHJOYW1lXCIpLnRleHQoKTtcblxuXHRcdGthcmFPSy5nZXRMeXJpY3ModHJhY2tJRCk7XG5cblxuXHR9KTtcblxuXHQkKFwiI2FkZFRvUGxheWxpc3RcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdC8vIE1vdmUgdGhlIGxpIGFkZCB0byBET00gc2VjdGlvbiB0byBmb3IgbG9vcCBzbyBsaXN0IGlzIGNyZWF0ZWQgZnJvbSBmaXJlYmFzZVxuXHRcdHZhciBzYWZlTGlzdEl0ZW0gPSB7XG5cdFx0XHRzYWZlTGlzdEFsYnVtOiBrYXJhT0suc2VsZWN0ZWRBbGJ1bU5hbWUsXG5cdFx0XHRzYWZlbGlzdEFydGlzdDoga2FyYU9LLnNlbGVjdGVkQXJ0aXN0TmFtZSxcblx0XHRcdHNhZmVMaXN0VHJhY2s6IGthcmFPSy5zZWxlY3RlZFRyYWNrTmFtZVxuXHRcdH07XG5cblx0XHQvLyAxMC4gQWxsb3cgdXNlciB0byBzYXZlIHNvbmcgdG8gcGxheWxpc3Rcblx0XHRwbGF5bGlzdFJlZi5wdXNoKHNhZmVMaXN0SXRlbSk7XG5cblx0XHRwbGF5bGlzdFJlZi5vbigndmFsdWUnLCBmdW5jdGlvbihmaXJlYmFzZURhdGEpIHtcblx0XHRcdFxuXHRcdFx0dmFyIHBsYXlsaXN0ID0gZmlyZWJhc2VEYXRhLnZhbCgpO1xuXHRcdFx0XG5cdFx0XHRmb3IgKGxldCBrZXkgaW4gcGxheWxpc3QpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coa2V5KVxuXHRcdFx0XHRjb25zb2xlLmxvZyhwbGF5bGlzdFtrZXldKVxuXG5cdFx0XHRcdHZhciBwbGF5bGlzdEFsYnVtID0gJChcIjxwPlwiKS50ZXh0KHBsYXlsaXN0W2tleV0uc2FmZUxpc3RBbGJ1bSkuYWRkQ2xhc3MoJ2FsTmFtZScpO1xuXHRcdFx0XHR2YXIgcGxheWxpc3RBcnRpc3QgPSAkKFwiPHA+XCIpLnRleHQocGxheWxpc3Rba2V5XS5zYWZlbGlzdEFydGlzdCkuYWRkQ2xhc3MoJ2FyTmFtZScpOyBcblx0XHRcdFx0dmFyIHBsYXlsaXN0VHJhY2sgPSAkKFwiPHA+XCIpLnRleHQocGxheWxpc3Rba2V5XS5zYWZlTGlzdFRyYWNrKS5hZGRDbGFzcygndHJOYW1lJyk7XG5cdFx0XHRcdHZhciByZW1vdmVQbGF5bGlzdEl0ZW0gPSAkKFwiPGJ1dHRvbj5cIikuYWRkQ2xhc3MoJ3JlbW92ZUJ1dHRvbicpLnRleHQoJy0nKTtcblxuXHRcdFx0XHR2YXIgcGxheUxpc3RJdGVtID0gJChcIjxsaSA+XCIpLmFwcGVuZChwbGF5bGlzdFRyYWNrLCBwbGF5bGlzdEFydGlzdCwgcGxheWxpc3RBbGJ1bSwgcmVtb3ZlUGxheWxpc3RJdGVtKVxuXHRcdFx0XHRcdC5hZGRDbGFzcyhwbGF5TGlzdEl0ZW0pLmRhdGEoJ2ZpcmViYXNlSWQnLCBwbGF5bGlzdFtrZXldKTtcblx0XHRcdFx0XG5cdFx0XHRcdCQoXCIuc2FmZVBsYXlMaXN0XCIpLmFwcGVuZChwbGF5TGlzdEl0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0fSk7XG5cblx0JCgnLnNvbmdHYWxsZXJ5Jykub24oJ2NsaWNrJywgJy5yZW1vdmVCdXR0b24nLCBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2FmZUxpc3RSZW1vdmVEYXRhID0gJCh0aGlzKS5kYXRhKCdmaXJlYmFzZUlkJylcblx0XHRjb25zdCB0b2RvUmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoYC9wbGF5bGlzdC8ke3NhZmVMaXN0UmVtb3ZlRGF0YX1gKTtcblx0XHR0b2RvUmVmLnJlbW92ZSgpO1xuXHR9KTtcblxufVxuXG4vLyAyLiBVc2UgdXNlciBpbnB1dCB0byBtYWtlIEFQSSByZXF1ZXN0L0FKQVggcmVxdWVzdC5cbi8vIDMuIEZpbHRlciB0aGUgcmVzdWx0cyAoaWUgc2VhcmNoIGJ5IGx5cmljcyBvbmx5LCBsYW5ndWFnZSwgZm9ybWF0IGV0YylcbmthcmFPSy5nZXRTb25nSW5mbyA9IGZ1bmN0aW9uICh0cmFjaywgYXJ0aXN0LCBseXJpY3MpIHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwOi8vYXBpLm11c2l4bWF0Y2guY29tL3dzLzEuMS90cmFjay5zZWFyY2gnLFxuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YXBpa2V5OiBrYXJhT0suYXBpa2V5LFxuXHRcdFx0cV90cmFjazogdHJhY2ssXG5cdFx0XHRxX2FydGlzdDogYXJ0aXN0LFxuXHRcdFx0cV9seXJpY3M6IGx5cmljcyxcblx0XHRcdGZfaGFzX2x5cmljczogJycsXG5cdFx0XHRmX2x5cmljc19sYW5ndWFnZTogJ2VuJyxcblx0XHRcdGZvcm1hdDogJ2pzb25wJyxcblx0XHRcdHBhZ2Vfc2l6ZTogMTBcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCl7XG5cdFx0Ly8gNC4gRGlzcGxheSBBUEkgcmVxdWVzdCByZXN1bHRzIG9uIHNjcmVlblxuXHRcdC8vIFx0KHRyYWNrX2lkLCB0cmFja19uYW1lLCBleHBsaWNpdCwgYWxidW1fbmFtZSwgYXJ0aXN0X25hbWUsIGFsYnVtX2NvdmVyYXJ0XzEwMHgxMDAsIHRyYWNrX3NoYXJlX3VybClcblx0XHR2YXIgdHJhY2tMaXN0ID0gcmVzdWx0Lm1lc3NhZ2UuYm9keS50cmFja19saXN0XG5cblx0XHR0cmFja0xpc3QuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuXG5cdFx0XHR2YXIgZ2FsbGVyeVVuaXQgPSAkKCc8bGk+JykuYWRkQ2xhc3MoJ2dhbGxlcnlVbml0Jyk7XG5cblx0XHRcdHZhciBjb3ZlckFydCA9ICQoJzxpbWc+JykuYXR0cignc3JjJywgdHJhY2sudHJhY2suYWxidW1fY292ZXJhcnRfMTAweDEwMCk7XG5cdFx0XHR2YXIgYWxidW1OYW1lID0gJCgnPHA+JykudGV4dCh0cmFjay50cmFjay5hbGJ1bV9uYW1lKS5hZGRDbGFzcygnYWxOYW1lJyk7XG5cdFx0XHR2YXIgYXJ0aXN0TmFtZSA9ICQoJzxwPicpLnRleHQodHJhY2sudHJhY2suYXJ0aXN0X25hbWUpLmFkZENsYXNzKCdhck5hbWUnKTtcblx0XHRcdHZhciB0cmFja05hbWUgPSAkKCc8cD4nKS50ZXh0KHRyYWNrLnRyYWNrLnRyYWNrX25hbWUpLmFkZENsYXNzKCd0ck5hbWUnKTtcblxuXHRcdFx0dmFyIHRyYWNrSWQgPSB0cmFjay50cmFjay50cmFja19pZDtcblxuXHRcdFx0Z2FsbGVyeVVuaXQuZGF0YSgndHJhY2staWQnLCB0cmFja0lkKTtcblx0XHRcdGdhbGxlcnlVbml0LmFwcGVuZChjb3ZlckFydCwgdHJhY2tOYW1lLCBhcnRpc3ROYW1lLCBhbGJ1bU5hbWUpO1xuXHRcdFx0Ly8gdmFyIGdhbGxlcnlVbml0RmluYWwgPSBnYWxsZXJ5VW5pdC5hcHBlbmQoY292ZXJBcnQsIHRyYWNrTmFtZSwgYXJ0aXN0TmFtZSwgYWxidW1OYW1lKTtcblx0XHRcdCQoJy5zb25nR2FsbGVyeScpLmFwcGVuZChnYWxsZXJ5VW5pdCk7XG5cdFx0XHQvLyAkKCcuc29uZ0dhbGxlcnknKS5hcHBlbmQoZ2FsbGVyeVVuaXRGaW5hbCk7XG5cblx0XHR9KTtcblxuXHR9KTtcbn1cblxuLy8gNi4gTWFrZSBBUEkgcmVxdWVzdCB0byB0cmFjay5seXJpY3MuZ2V0LCBcbmthcmFPSy5nZXRMeXJpY3MgPSBmdW5jdGlvbiAodHJhY2tJZCkge1xuXHQkLmFqYXgoe1xuXHRcdHVybDogJ2h0dHA6Ly9hcGkubXVzaXhtYXRjaC5jb20vd3MvMS4xL3RyYWNrLmx5cmljcy5nZXQnLFxuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YXBpa2V5OiBrYXJhT0suYXBpa2V5LFxuXHRcdFx0dHJhY2tfaWQ6IHRyYWNrSWQsXG5cdFx0XHRmb3JtYXQ6ICdqc29ucCdcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcblx0XHQvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXHRcdHZhciBseXJpY3MgPSByZXN1bHQubWVzc2FnZS5ib2R5Lmx5cmljcy5seXJpY3NfYm9keTtcblx0XHRjb25zb2xlLmxvZyhseXJpY3MpO1xuXG5cdFx0Ly8gNy4gVXNlIGphdmFzY3JpcHQgZmlsdGVyIHRvIHNjYW4gdGhlIGx5cmljcyBmb3IgcHJvZmFuaXR5LlxuXHRcdHZhciBmaWx0ZXJTd2VhciA9ICcnO1xuXHRcdHZhciBmaWx0ZXJTd2VhciA9IGZpbHRlci5jb250YWlucyhseXJpY3MpO1xuXHRcdGNvbnNvbGUubG9nKGZpbHRlclN3ZWFyKTtcblxuXHRcdC8vIDguIElGIHRoZXJlIGlzIHByb2Zhbml0eSBkaXNwbGF5IHJlZCArIGZlZWRiYWNrXG5cdFx0aWYgKGZpbHRlclN3ZWFyID09PSB0cnVlKSB7XG5cdFx0XHQkKCcubW9kYWxObycpLmFkZENsYXNzKCdtb2RhbERpc3BsYXknKTtcblx0XHQvLyA5LiBJRiBFTFNFIGRpc3BsYXkgZ3JlZW4gKyBmZWVkYmFja1xuXHRcdH0gZWxzZSBpZiAoZmlsdGVyU3dlYXIgPT09IGZhbHNlKSB7XG5cdFx0XHQkKCcubW9kYWxZZXMnKS5hZGRDbGFzcygnbW9kYWxEaXNwbGF5Jyk7XG5cdFx0fVxuXHR9KTtcdFxufVxuXG5rYXJhT0suYWRkVG9QbGF5bGlzdCA9IGZ1bmN0aW9uKCl7XG5cbn07XG5cbiQoZnVuY3Rpb24oKXtcblx0a2FyYU9LLmluaXQoKTtcbn0pO1xuXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJiYWR3b3Jkc1wiIDogW1wiNHI1ZVwiLFxyXG4gXCI1aDF0XCIsXHJcbiBcIjVoaXRcIixcclxuIFwiYTU1XCIsXHJcbiBcImFuYWxcIixcclxuICBcImFudXNcIixcclxuICBcImFyNWVcIixcclxuICBcImFycnNlXCIsXHJcbiAgXCJhcnNlXCIsXHJcbiAgXCJhc3NcIixcclxuICBcImFzcy1mdWNrZXJcIixcclxuICBcImFzc2VzXCIsXHJcbiAgXCJhc3NmdWNrZXJcIixcclxuICBcImFzc2Z1a2thXCIsXHJcbiAgXCJhc3Nob2xlXCIsXHJcbiAgXCJhc3Nob2xlc1wiLFxyXG4gIFwiYXNzd2hvbGVcIixcclxuICBcImFfc19zXCIsXHJcbiAgXCJiIXRjaFwiLFxyXG4gIFwiYjAwYnNcIixcclxuICBcImIxN2NoXCIsXHJcbiAgXCJiMXRjaFwiLFxyXG4gIFwiYmFsbGJhZ1wiLFxyXG4gIFwiYmFsbHNcIixcclxuICBcImJhbGxzYWNrXCIsXHJcbiAgXCJiYXN0YXJkXCIsXHJcbiAgXCJiZWFzdGlhbFwiLFxyXG4gIFwiYmVhc3RpYWxpdHlcIixcclxuICBcImJlbGxlbmRcIixcclxuICBcImJlc3RpYWxcIixcclxuICBcImJlc3RpYWxpdHlcIixcclxuICBcImJpK2NoXCIsXHJcbiAgXCJiaWF0Y2hcIixcclxuICBcImJpdGNoXCIsXHJcbiAgXCJiaXRjaGVyXCIsXHJcbiAgXCJiaXRjaGVyc1wiLFxyXG4gIFwiYml0Y2hlc1wiLFxyXG4gIFwiYml0Y2hpblwiLFxyXG4gIFwiYml0Y2hpbmdcIixcclxuICBcImJsb29keVwiLFxyXG4gIFwiYmxvdyBqb2JcIixcclxuICBcImJsb3dqb2JcIixcclxuICBcImJsb3dqb2JzXCIsXHJcbiAgXCJib2lvbGFzXCIsXHJcbiAgXCJib2xsb2NrXCIsXHJcbiAgXCJib2xsb2tcIixcclxuICBcImJvbmVyXCIsXHJcbiAgXCJib29iXCIsXHJcbiAgXCJib29ic1wiLFxyXG4gIFwiYm9vb2JzXCIsXHJcbiAgXCJib29vb2JzXCIsXHJcbiAgXCJib29vb29ic1wiLFxyXG4gIFwiYm9vb29vb29ic1wiLFxyXG4gIFwiYnJlYXN0c1wiLFxyXG4gIFwiYnVjZXRhXCIsXHJcbiAgXCJidWdnZXJcIixcclxuICBcImJ1bVwiLFxyXG4gIFwiYnVubnkgZnVja2VyXCIsXHJcbiAgXCJidXR0XCIsXHJcbiAgXCJidXR0aG9sZVwiLFxyXG4gIFwiYnV0dG11Y2hcIixcclxuICBcImJ1dHRwbHVnXCIsXHJcbiAgXCJjMGNrXCIsXHJcbiAgXCJjMGNrc3Vja2VyXCIsXHJcbiAgXCJjYXJwZXQgbXVuY2hlclwiLFxyXG4gIFwiY2F3a1wiLFxyXG4gIFwiY2hpbmtcIixcclxuICBcImNpcGFcIixcclxuICBcImNsMXRcIixcclxuICBcImNsaXRcIixcclxuICBcImNsaXRvcmlzXCIsXHJcbiAgXCJjbGl0c1wiLFxyXG4gIFwiY251dFwiLFxyXG4gIFwiY29ja1wiLFxyXG4gIFwiY29jay1zdWNrZXJcIixcclxuICBcImNvY2tmYWNlXCIsXHJcbiAgXCJjb2NraGVhZFwiLFxyXG4gIFwiY29ja211bmNoXCIsXHJcbiAgXCJjb2NrbXVuY2hlclwiLFxyXG4gIFwiY29ja3NcIixcclxuICBcImNvY2tzdWNrXCIsXHJcbiAgXCJjb2Nrc3Vja2VkXCIsXHJcbiAgXCJjb2Nrc3Vja2VyXCIsXHJcbiAgXCJjb2Nrc3Vja2luZ1wiLFxyXG4gIFwiY29ja3N1Y2tzXCIsXHJcbiAgXCJjb2Nrc3VrYVwiLFxyXG4gIFwiY29ja3N1a2thXCIsXHJcbiAgXCJjb2tcIixcclxuICBcImNva211bmNoZXJcIixcclxuICBcImNva3N1Y2thXCIsXHJcbiAgXCJjb29uXCIsXHJcbiAgXCJjb3hcIixcclxuICBcImNyYXBcIixcclxuICBcImN1bVwiLFxyXG4gIFwiY3VtbWVyXCIsXHJcbiAgXCJjdW1taW5nXCIsXHJcbiAgXCJjdW1zXCIsXHJcbiAgXCJjdW1zaG90XCIsXHJcbiAgXCJjdW5pbGluZ3VzXCIsXHJcbiAgXCJjdW5pbGxpbmd1c1wiLFxyXG4gIFwiY3VubmlsaW5ndXNcIixcclxuICBcImN1bnRcIixcclxuICBcImN1bnRsaWNrXCIsXHJcbiAgXCJjdW50bGlja2VyXCIsXHJcbiAgXCJjdW50bGlja2luZ1wiLFxyXG4gIFwiY3VudHNcIixcclxuICBcImN5YWxpc1wiLFxyXG4gIFwiY3liZXJmdWNcIixcclxuICBcImN5YmVyZnVja1wiLFxyXG4gIFwiY3liZXJmdWNrZWRcIixcclxuICBcImN5YmVyZnVja2VyXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlcnNcIixcclxuICBcImN5YmVyZnVja2luZ1wiLFxyXG4gIFwiZDFja1wiLFxyXG4gIFwiZGFtblwiLFxyXG4gIFwiZGlja1wiLFxyXG4gIFwiZGlja2hlYWRcIixcclxuICBcImRpbGRvXCIsXHJcbiAgXCJkaWxkb3NcIixcclxuICBcImRpbmtcIixcclxuICBcImRpbmtzXCIsXHJcbiAgXCJkaXJzYVwiLFxyXG4gIFwiZGxja1wiLFxyXG4gIFwiZG9nLWZ1Y2tlclwiLFxyXG4gIFwiZG9nZ2luXCIsXHJcbiAgXCJkb2dnaW5nXCIsXHJcbiAgXCJkb25rZXlyaWJiZXJcIixcclxuICBcImRvb3NoXCIsXHJcbiAgXCJkdWNoZVwiLFxyXG4gIFwiZHlrZVwiLFxyXG4gIFwiZWphY3VsYXRlXCIsXHJcbiAgXCJlamFjdWxhdGVkXCIsXHJcbiAgXCJlamFjdWxhdGVzXCIsXHJcbiAgXCJlamFjdWxhdGluZ1wiLFxyXG4gIFwiZWphY3VsYXRpbmdzXCIsXHJcbiAgXCJlamFjdWxhdGlvblwiLFxyXG4gIFwiZWpha3VsYXRlXCIsXHJcbiAgXCJmIHUgYyBrXCIsXHJcbiAgXCJmIHUgYyBrIGUgclwiLFxyXG4gIFwiZjRubnlcIixcclxuICBcImZhZ1wiLFxyXG4gIFwiZmFnZ2luZ1wiLFxyXG4gIFwiZmFnZ2l0dFwiLFxyXG4gIFwiZmFnZ290XCIsXHJcbiAgXCJmYWdnc1wiLFxyXG4gIFwiZmFnb3RcIixcclxuICBcImZhZ290c1wiLFxyXG4gIFwiZmFnc1wiLFxyXG4gIFwiZmFubnlcIixcclxuICBcImZhbm55ZmxhcHNcIixcclxuICBcImZhbm55ZnVja2VyXCIsXHJcbiAgXCJmYW55eVwiLFxyXG4gIFwiZmF0YXNzXCIsXHJcbiAgXCJmY3VrXCIsXHJcbiAgXCJmY3VrZXJcIixcclxuICBcImZjdWtpbmdcIixcclxuICBcImZlY2tcIixcclxuICBcImZlY2tlclwiLFxyXG4gIFwiZmVsY2hpbmdcIixcclxuICBcImZlbGxhdGVcIixcclxuICBcImZlbGxhdGlvXCIsXHJcbiAgXCJmaW5nZXJmdWNrXCIsXHJcbiAgXCJmaW5nZXJmdWNrZWRcIixcclxuICBcImZpbmdlcmZ1Y2tlclwiLFxyXG4gIFwiZmluZ2VyZnVja2Vyc1wiLFxyXG4gIFwiZmluZ2VyZnVja2luZ1wiLFxyXG4gIFwiZmluZ2VyZnVja3NcIixcclxuICBcImZpc3RmdWNrXCIsXHJcbiAgXCJmaXN0ZnVja2VkXCIsXHJcbiAgXCJmaXN0ZnVja2VyXCIsXHJcbiAgXCJmaXN0ZnVja2Vyc1wiLFxyXG4gIFwiZmlzdGZ1Y2tpbmdcIixcclxuICBcImZpc3RmdWNraW5nc1wiLFxyXG4gIFwiZmlzdGZ1Y2tzXCIsXHJcbiAgXCJmbGFuZ2VcIixcclxuICBcImZvb2tcIixcclxuICBcImZvb2tlclwiLFxyXG4gIFwiZnVja1wiLFxyXG4gIFwiZnVja2FcIixcclxuICBcImZ1Y2tlZFwiLFxyXG4gIFwiZnVja2VyXCIsXHJcbiAgXCJmdWNrZXJzXCIsXHJcbiAgXCJmdWNraGVhZFwiLFxyXG4gIFwiZnVja2hlYWRzXCIsXHJcbiAgXCJmdWNraW5cIixcclxuICBcImZ1Y2tpbmdcIixcclxuICBcImZ1Y2tpbmdzXCIsXHJcbiAgXCJmdWNraW5nc2hpdG1vdGhlcmZ1Y2tlclwiLFxyXG4gIFwiZnVja21lXCIsXHJcbiAgXCJmdWNrc1wiLFxyXG4gIFwiZnVja3doaXRcIixcclxuICBcImZ1Y2t3aXRcIixcclxuICBcImZ1ZGdlIHBhY2tlclwiLFxyXG4gIFwiZnVkZ2VwYWNrZXJcIixcclxuICBcImZ1a1wiLFxyXG4gIFwiZnVrZXJcIixcclxuICBcImZ1a2tlclwiLFxyXG4gIFwiZnVra2luXCIsXHJcbiAgXCJmdWtzXCIsXHJcbiAgXCJmdWt3aGl0XCIsXHJcbiAgXCJmdWt3aXRcIixcclxuICBcImZ1eFwiLFxyXG4gIFwiZnV4MHJcIixcclxuICBcImZfdV9jX2tcIixcclxuICBcImdhbmdiYW5nXCIsXHJcbiAgXCJnYW5nYmFuZ2VkXCIsXHJcbiAgXCJnYW5nYmFuZ3NcIixcclxuICBcImdheWxvcmRcIixcclxuICBcImdheXNleFwiLFxyXG4gIFwiZ29hdHNlXCIsXHJcbiAgXCJHb2RcIixcclxuICBcImdvZC1kYW1cIixcclxuICBcImdvZC1kYW1uZWRcIixcclxuICBcImdvZGRhbW5cIixcclxuICBcImdvZGRhbW5lZFwiLFxyXG4gIFwiaGFyZGNvcmVzZXhcIixcclxuICBcImhlbGxcIixcclxuICBcImhlc2hlXCIsXHJcbiAgXCJob2FyXCIsXHJcbiAgXCJob2FyZVwiLFxyXG4gIFwiaG9lclwiLFxyXG4gIFwiaG9tb1wiLFxyXG4gIFwiaG9yZVwiLFxyXG4gIFwiaG9ybmllc3RcIixcclxuICBcImhvcm55XCIsXHJcbiAgXCJob3RzZXhcIixcclxuICBcImphY2stb2ZmXCIsXHJcbiAgXCJqYWNrb2ZmXCIsXHJcbiAgXCJqYXBcIixcclxuICBcImplcmstb2ZmXCIsXHJcbiAgXCJqaXNtXCIsXHJcbiAgXCJqaXpcIixcclxuICBcImppem1cIixcclxuICBcImppenpcIixcclxuICBcImthd2tcIixcclxuICBcImtub2JcIixcclxuICBcImtub2JlYWRcIixcclxuICBcImtub2JlZFwiLFxyXG4gIFwia25vYmVuZFwiLFxyXG4gIFwia25vYmhlYWRcIixcclxuICBcImtub2Jqb2NreVwiLFxyXG4gIFwia25vYmpva2V5XCIsXHJcbiAgXCJrb2NrXCIsXHJcbiAgXCJrb25kdW1cIixcclxuICBcImtvbmR1bXNcIixcclxuICBcImt1bVwiLFxyXG4gIFwia3VtbWVyXCIsXHJcbiAgXCJrdW1taW5nXCIsXHJcbiAgXCJrdW1zXCIsXHJcbiAgXCJrdW5pbGluZ3VzXCIsXHJcbiAgXCJsM2krY2hcIixcclxuICBcImwzaXRjaFwiLFxyXG4gIFwibGFiaWFcIixcclxuICBcImxtZmFvXCIsXHJcbiAgXCJsdXN0XCIsXHJcbiAgXCJsdXN0aW5nXCIsXHJcbiAgXCJtMGYwXCIsXHJcbiAgXCJtMGZvXCIsXHJcbiAgXCJtNDV0ZXJiYXRlXCIsXHJcbiAgXCJtYTV0ZXJiOFwiLFxyXG4gIFwibWE1dGVyYmF0ZVwiLFxyXG4gIFwibWFzb2NoaXN0XCIsXHJcbiAgXCJtYXN0ZXItYmF0ZVwiLFxyXG4gIFwibWFzdGVyYjhcIixcclxuICBcIm1hc3RlcmJhdCpcIixcclxuICBcIm1hc3RlcmJhdDNcIixcclxuICBcIm1hc3RlcmJhdGVcIixcclxuICBcIm1hc3RlcmJhdGlvblwiLFxyXG4gIFwibWFzdGVyYmF0aW9uc1wiLFxyXG4gIFwibWFzdHVyYmF0ZVwiLFxyXG4gIFwibW8tZm9cIixcclxuICBcIm1vZjBcIixcclxuICBcIm1vZm9cIixcclxuICBcIm1vdGhhZnVja1wiLFxyXG4gIFwibW90aGFmdWNrYVwiLFxyXG4gIFwibW90aGFmdWNrYXNcIixcclxuICBcIm1vdGhhZnVja2F6XCIsXHJcbiAgXCJtb3RoYWZ1Y2tlZFwiLFxyXG4gIFwibW90aGFmdWNrZXJcIixcclxuICBcIm1vdGhhZnVja2Vyc1wiLFxyXG4gIFwibW90aGFmdWNraW5cIixcclxuICBcIm1vdGhhZnVja2luZ1wiLFxyXG4gIFwibW90aGFmdWNraW5nc1wiLFxyXG4gIFwibW90aGFmdWNrc1wiLFxyXG4gIFwibW90aGVyIGZ1Y2tlclwiLFxyXG4gIFwibW90aGVyZnVja1wiLFxyXG4gIFwibW90aGVyZnVja2VkXCIsXHJcbiAgXCJtb3RoZXJmdWNrZXJcIixcclxuICBcIm1vdGhlcmZ1Y2tlcnNcIixcclxuICBcIm1vdGhlcmZ1Y2tpblwiLFxyXG4gIFwibW90aGVyZnVja2luZ1wiLFxyXG4gIFwibW90aGVyZnVja2luZ3NcIixcclxuICBcIm1vdGhlcmZ1Y2trYVwiLFxyXG4gIFwibW90aGVyZnVja3NcIixcclxuICBcIm11ZmZcIixcclxuICBcIm11dGhhXCIsXHJcbiAgXCJtdXRoYWZlY2tlclwiLFxyXG4gIFwibXV0aGFmdWNra2VyXCIsXHJcbiAgXCJtdXRoZXJcIixcclxuICBcIm11dGhlcmZ1Y2tlclwiLFxyXG4gIFwibjFnZ2FcIixcclxuICBcIm4xZ2dlclwiLFxyXG4gIFwibmF6aVwiLFxyXG4gIFwibmlnZzNyXCIsXHJcbiAgXCJuaWdnNGhcIixcclxuICBcIm5pZ2dhXCIsXHJcbiAgXCJuaWdnYWhcIixcclxuICBcIm5pZ2dhc1wiLFxyXG4gIFwibmlnZ2F6XCIsXHJcbiAgXCJuaWdnZXJcIixcclxuICBcIm5pZ2dlcnNcIixcclxuICBcIm5vYlwiLFxyXG4gIFwibm9iIGpva2V5XCIsXHJcbiAgXCJub2JoZWFkXCIsXHJcbiAgXCJub2Jqb2NreVwiLFxyXG4gIFwibm9iam9rZXlcIixcclxuICBcIm51bWJudXRzXCIsXHJcbiAgXCJudXRzYWNrXCIsXHJcbiAgXCJvcmdhc2ltXCIsXHJcbiAgXCJvcmdhc2ltc1wiLFxyXG4gIFwib3JnYXNtXCIsXHJcbiAgXCJvcmdhc21zXCIsXHJcbiAgXCJwMHJuXCIsXHJcbiAgXCJwYXduXCIsXHJcbiAgXCJwZWNrZXJcIixcclxuICBcInBlbmlzXCIsXHJcbiAgXCJwZW5pc2Z1Y2tlclwiLFxyXG4gIFwicGhvbmVzZXhcIixcclxuICBcInBodWNrXCIsXHJcbiAgXCJwaHVrXCIsXHJcbiAgXCJwaHVrZWRcIixcclxuICBcInBodWtpbmdcIixcclxuICBcInBodWtrZWRcIixcclxuICBcInBodWtraW5nXCIsXHJcbiAgXCJwaHVrc1wiLFxyXG4gIFwicGh1cVwiLFxyXG4gIFwicGlnZnVja2VyXCIsXHJcbiAgXCJwaW1waXNcIixcclxuICBcInBpc3NcIixcclxuICBcInBpc3NlZFwiLFxyXG4gIFwicGlzc2VyXCIsXHJcbiAgXCJwaXNzZXJzXCIsXHJcbiAgXCJwaXNzZXNcIixcclxuICBcInBpc3NmbGFwc1wiLFxyXG4gIFwicGlzc2luXCIsXHJcbiAgXCJwaXNzaW5nXCIsXHJcbiAgXCJwaXNzb2ZmXCIsXHJcbiAgXCJwb29wXCIsXHJcbiAgXCJwb3JuXCIsXHJcbiAgXCJwb3Jub1wiLFxyXG4gIFwicG9ybm9ncmFwaHlcIixcclxuICBcInBvcm5vc1wiLFxyXG4gIFwicHJpY2tcIixcclxuICBcInByaWNrc1wiLFxyXG4gIFwicHJvblwiLFxyXG4gIFwicHViZVwiLFxyXG4gIFwicHVzc2VcIixcclxuICBcInB1c3NpXCIsXHJcbiAgXCJwdXNzaWVzXCIsXHJcbiAgXCJwdXNzeVwiLFxyXG4gIFwicHVzc3lzXCIsXHJcbiAgXCJyZWN0dW1cIixcclxuICBcInJldGFyZFwiLFxyXG4gIFwicmltamF3XCIsXHJcbiAgXCJyaW1taW5nXCIsXHJcbiAgXCJzIGhpdFwiLFxyXG4gIFwicy5vLmIuXCIsXHJcbiAgXCJzYWRpc3RcIixcclxuICBcInNjaGxvbmdcIixcclxuICBcInNjcmV3aW5nXCIsXHJcbiAgXCJzY3JvYXRcIixcclxuICBcInNjcm90ZVwiLFxyXG4gIFwic2Nyb3R1bVwiLFxyXG4gIFwic2VtZW5cIixcclxuICBcInNleFwiLFxyXG4gIFwic2ghK1wiLFxyXG4gIFwic2ghdFwiLFxyXG4gIFwic2gxdFwiLFxyXG4gIFwic2hhZ1wiLFxyXG4gIFwic2hhZ2dlclwiLFxyXG4gIFwic2hhZ2dpblwiLFxyXG4gIFwic2hhZ2dpbmdcIixcclxuICBcInNoZW1hbGVcIixcclxuICBcInNoaStcIixcclxuICBcInNoaXRcIixcclxuICBcInNoaXRkaWNrXCIsXHJcbiAgXCJzaGl0ZVwiLFxyXG4gIFwic2hpdGVkXCIsXHJcbiAgXCJzaGl0ZXlcIixcclxuICBcInNoaXRmdWNrXCIsXHJcbiAgXCJzaGl0ZnVsbFwiLFxyXG4gIFwic2hpdGhlYWRcIixcclxuICBcInNoaXRpbmdcIixcclxuICBcInNoaXRpbmdzXCIsXHJcbiAgXCJzaGl0c1wiLFxyXG4gIFwic2hpdHRlZFwiLFxyXG4gIFwic2hpdHRlclwiLFxyXG4gIFwic2hpdHRlcnNcIixcclxuICBcInNoaXR0aW5nXCIsXHJcbiAgXCJzaGl0dGluZ3NcIixcclxuICBcInNoaXR0eVwiLFxyXG4gIFwic2thbmtcIixcclxuICBcInNsdXRcIixcclxuICBcInNsdXRzXCIsXHJcbiAgXCJzbWVnbWFcIixcclxuICBcInNtdXRcIixcclxuICBcInNuYXRjaFwiLFxyXG4gIFwic29uLW9mLWEtYml0Y2hcIixcclxuICBcInNwYWNcIixcclxuICBcInNwdW5rXCIsXHJcbiAgXCJzX2hfaV90XCIsXHJcbiAgXCJ0MXR0MWU1XCIsXHJcbiAgXCJ0MXR0aWVzXCIsXHJcbiAgXCJ0ZWV0c1wiLFxyXG4gIFwidGVlelwiLFxyXG4gIFwidGVzdGljYWxcIixcclxuICBcInRlc3RpY2xlXCIsXHJcbiAgXCJ0aXRcIixcclxuICBcInRpdGZ1Y2tcIixcclxuICBcInRpdHNcIixcclxuICBcInRpdHRcIixcclxuICBcInRpdHRpZTVcIixcclxuICBcInRpdHRpZWZ1Y2tlclwiLFxyXG4gIFwidGl0dGllc1wiLFxyXG4gIFwidGl0dHlmdWNrXCIsXHJcbiAgXCJ0aXR0eXdhbmtcIixcclxuICBcInRpdHdhbmtcIixcclxuICBcInRvc3NlclwiLFxyXG4gIFwidHVyZFwiLFxyXG4gIFwidHc0dFwiLFxyXG4gIFwidHdhdFwiLFxyXG4gIFwidHdhdGhlYWRcIixcclxuICBcInR3YXR0eVwiLFxyXG4gIFwidHd1bnRcIixcclxuICBcInR3dW50ZXJcIixcclxuICBcInYxNGdyYVwiLFxyXG4gIFwidjFncmFcIixcclxuICBcInZhZ2luYVwiLFxyXG4gIFwidmlhZ3JhXCIsXHJcbiAgXCJ2dWx2YVwiLFxyXG4gIFwidzAwc2VcIixcclxuICBcIndhbmdcIixcclxuICBcIndhbmtcIixcclxuICBcIndhbmtlclwiLFxyXG4gIFwid2Fua3lcIixcclxuICBcIndob2FyXCIsXHJcbiAgXCJ3aG9yZVwiLFxyXG4gIFwid2lsbGllc1wiLFxyXG4gIFwid2lsbHlcIixcclxuICBcInhyYXRlZFwiLFxyXG4gIFwieHh4XCJcclxuXX0iLCJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xyXG52YXIgYmFkd29yZHMgPSByZXF1aXJlKCcuL2JhZHdvcmRzLmpzb24nKS5iYWR3b3JkcztcclxudmFyIFRleHRGaW5kZXIgPSByZXF1aXJlKCcuL3RleHRmaW5kZXInKTtcclxuXHJcbi8vIENvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIEJhZExhbmd1YWdlRmlsdGVyKCkge1xyXG5cdHRoaXMudGV4dGZpbmRlciA9IG5ldyBUZXh0RmluZGVyKGJhZHdvcmRzKTtcclxufVxyXG5cclxuLy8gQ2hlY2sgaWYgYW55IGJhZCB3b3JkcyBpcyBjb250YWluZWQgaW4gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcblx0cmV0dXJuIHRoaXMudGV4dGZpbmRlci5jb250YWlucyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIENoZWNrIGlmIGFueSBiYWQgd29yZHMgaXMgY29udGFpbmVkIGluIGNvbnRlbnQgYW5kIHJldHVybnMgYXJyYXkgb2Ygd29yZHNcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLm1hdGNoZXMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBSZW1vdmUgYmFkIHdvcmRzIGZyb20gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUucmVtb3ZlV29yZHMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLnJlbW92ZVdvcmRzKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gUmVwbGFjZSBiYWQgd29yZHMgZnJvbSBjb250ZW50XHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5yZXBsYWNlV29yZHMgPSBmdW5jdGlvbihjb250ZW50LCByZXBsYWNlc3RyKSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLnJlcGxhY2VXb3Jkcyhjb250ZW50LCByZXBsYWNlc3RyKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFkTGFuZ3VhZ2VGaWx0ZXI7IiwiLy8gQ29uc3RydWN0b3JcclxuZnVuY3Rpb24gVGV4dEZpbmRlcih3b3JkTGlzdCkge1xyXG4gIHRoaXMud29yZGxpc3QgPSB3b3JkTGlzdDtcclxuICB0aGlzLnNlYXJjaHN0cmluZyA9IG5ldyBSZWdFeHAod29yZExpc3Quam9pbihcIiB8XCIpLnJlcGxhY2UoL1teXFx3XFxzXnxdL2dpLCAnJyksICdpJyk7XHJcbiAgdGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcgPSBuZXcgUmVnRXhwKHdvcmRMaXN0LmpvaW4oXCIgfFwiKS5yZXBsYWNlKC9bXlxcd1xcc158XS9naSwgJycpLCAnZ2knKTtcclxuXHJcbn1cclxuLy8gY2xhc3MgbWV0aG9kc1xyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuXHRyZXR1cm4gdGhpcy5zZWFyY2hzdHJpbmcudGVzdChjb250ZW50KTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gY29udGVudC5tYXRjaCh0aGlzLmdsb2JhbHNlYXJjaHN0cmluZyk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5yZW1vdmVXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UodGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcsICcnKTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLnJlcGxhY2VXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIHJlcGxhY2VzdHIpIHtcclxuICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UodGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcsIHJlcGxhY2VzdHIpO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dEZpbmRlcjsiLCIiXX0=
