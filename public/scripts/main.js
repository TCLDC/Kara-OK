(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _badLanguageFilter = require('bad-language-filter');

var _badLanguageFilter2 = _interopRequireDefault(_badLanguageFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 8. IF there is profanity display red + feedback
// 9. IF ELSE display green + feedback
// 10. Allow user to save song to playlist

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

//bad language filter
var filter = new _badLanguageFilter2.default();

karaOK.init = function () {
	karaOK.eventHandlers();
	karaOK.fullPage();
};

karaOK.fullPage = function () {
	$('#fullpage').fullpage({
		sectionsColor: ['#65C5DF', '#004E7B', '#65C5DF', '#004E7B']
	});
};

karaOK.eventHandlers = function () {

	// 1. Receive user input.
	$('form').on('submit', function (event) {

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

		karaOK.selectedAlbumName = $(this).find("h4").text();
		karaOK.selectedArtistName = $(this).find("h3").text();
		karaOK.selectedTrackName = $(this).find("h2").text();
		// console.log(this);
		// console.log(selectedAlbumName, selectedArtistName, selectedTrackName);

		karaOK.getLyrics(trackID);
	});

	$("#addToPlaylist").on("click", function () {
		var playlistAlbum = $("<h4>").text(karaOK.selectedAlbumName);
		var playlistArtist = $("<h3>").text(karaOK.selectedArtistName);
		var playlistTrack = $("<h2>").text(karaOK.selectedTrackName);

		var playListItem = $("<li>").append(playlistTrack, playlistArtist, playlistAlbum);

		$(".safePlayList").append(playListItem);

		console.log(playListItem);
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
			page_size: 100
		}
	}).then(function (result) {
		// 4. Display API request results on screen
		// 	(track_id, track_name, explicit, album_name, artist_name, album_coverart_100x100, track_share_url)
		var trackList = result.message.body.track_list;

		trackList.forEach(function (track) {

			var galleryUnit = $('<li>').addClass('galleryUnit');

			var coverArt = $('<img>').attr('src', track.track.album_coverart_100x100);
			var albumName = $('<h4>').text(track.track.album_name);
			var artistName = $('<h3>').text(track.track.artist_name);
			var trackName = $('<h2>').text(track.track.track_name);

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

		if (filterSwear === true) {
			$('.modalNo').addClass('modalDisplay');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFHQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxTQUFTLEVBQWI7O0FBRUEsT0FBTyxNQUFQLEdBQWdCLGtDQUFoQjs7QUFFQTtBQUNBLElBQUksU0FBUztBQUNYLFNBQVEseUNBREc7QUFFWCxhQUFZLCtCQUZEO0FBR1gsY0FBYSxzQ0FIRjtBQUlYLFlBQVcsZUFKQTtBQUtYLGdCQUFlLDJCQUxKO0FBTVgsb0JBQW1CO0FBTlIsQ0FBYjtBQVFBLFNBQVMsYUFBVCxDQUF1QixNQUF2Qjs7QUFFQTtBQUNBLElBQUksU0FBUyxpQ0FBYjs7QUFFQSxPQUFPLElBQVAsR0FBYyxZQUFXO0FBQ3hCLFFBQU8sYUFBUDtBQUNBLFFBQU8sUUFBUDtBQUNBLENBSEQ7O0FBS0EsT0FBTyxRQUFQLEdBQWtCLFlBQVc7QUFDNUIsR0FBRSxXQUFGLEVBQWUsUUFBZixDQUF3QjtBQUN2QixpQkFBZSxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDLFNBQWxDO0FBRFEsRUFBeEI7QUFHQSxDQUpEOztBQU1BLE9BQU8sYUFBUCxHQUF1QixZQUFZOztBQUVsQztBQUNBLEdBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsS0FBVCxFQUFnQjs7QUFFdEMsUUFBTSxjQUFOO0FBQ0EsTUFBSSxnQkFBZ0IsRUFBRSxZQUFGLEVBQWdCLEdBQWhC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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEJhZExhbmd1YWdlRmlsdGVyIGZyb20gJ2JhZC1sYW5ndWFnZS1maWx0ZXInO1xuXG5cbi8vIDguIElGIHRoZXJlIGlzIHByb2Zhbml0eSBkaXNwbGF5IHJlZCArIGZlZWRiYWNrXG4vLyA5LiBJRiBFTFNFIGRpc3BsYXkgZ3JlZW4gKyBmZWVkYmFja1xuLy8gMTAuIEFsbG93IHVzZXIgdG8gc2F2ZSBzb25nIHRvIHBsYXlsaXN0XG5cbnZhciBrYXJhT0sgPSB7fTtcblxua2FyYU9LLmFwaWtleSA9ICcxMmIyN2E4MjljYWY1YzJmYmMxNTc1MWM1YTE2MDlkMSc7XG5cbi8vIEluaXRpYWxpemUgRmlyZWJhc2VcbnZhciBjb25maWcgPSB7XG4gIGFwaUtleTogXCJBSXphU3lCQVA1NXM5WU1mZDR1ZTJIOEpJY3R1ZTRLVkhSTWFFbm9cIixcbiAgYXV0aERvbWFpbjogXCJrYXJhLW9rLWM5NGQ4LmZpcmViYXNlYXBwLmNvbVwiLFxuICBkYXRhYmFzZVVSTDogXCJodHRwczovL2thcmEtb2stYzk0ZDguZmlyZWJhc2Vpby5jb21cIixcbiAgcHJvamVjdElkOiBcImthcmEtb2stYzk0ZDhcIixcbiAgc3RvcmFnZUJ1Y2tldDogXCJrYXJhLW9rLWM5NGQ4LmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjEwMTIxMTIyODYyMDRcIlxufTtcbmZpcmViYXNlLmluaXRpYWxpemVBcHAoY29uZmlnKTtcblxuLy9iYWQgbGFuZ3VhZ2UgZmlsdGVyXG52YXIgZmlsdGVyID0gbmV3IEJhZExhbmd1YWdlRmlsdGVyKCk7XG5cbmthcmFPSy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGthcmFPSy5ldmVudEhhbmRsZXJzKCk7XG5cdGthcmFPSy5mdWxsUGFnZSgpO1xufVxuXG5rYXJhT0suZnVsbFBhZ2UgPSBmdW5jdGlvbigpIHtcblx0JCgnI2Z1bGxwYWdlJykuZnVsbHBhZ2Uoe1xuXHRcdHNlY3Rpb25zQ29sb3I6IFsnIzY1QzVERicsICcjMDA0RTdCJywgJyM2NUM1REYnLCAnIzAwNEU3QiddLFxuXHR9KTtcbn1cblxua2FyYU9LLmV2ZW50SGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG5cblx0Ly8gMS4gUmVjZWl2ZSB1c2VyIGlucHV0LlxuXHQkKCdmb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciB1c2VyVHJhY2tOYW1lID0gJCgnLnRyYWNrTmFtZScpLnZhbCgpO1xuXHRcdHZhciB1c2VyQXJ0aXN0TmFtZSA9ICQoJy5hcnRpc3ROYW1lJykudmFsKCk7XG5cdFx0dmFyIHVzZXJMeXJpY3NOYW1lID0gJCgnLmx5cmljc05hbWUnKS52YWwoKTtcblxuXHRcdGthcmFPSy5nZXRTb25nSW5mbyh1c2VyVHJhY2tOYW1lLCB1c2VyQXJ0aXN0TmFtZSwgdXNlckx5cmljc05hbWUpO1xuXG5cdFx0Y29uc29sZS5sb2codXNlckFydGlzdE5hbWUpO1xuXHR9KTtcblxuXHQvLyA1LiBSZWNlaXZlIHVzZXIgc2VsZWN0aW9uLlxuXHQkKCcuc29uZ0dhbGxlcnknKS5vbignY2xpY2snLCAnLmdhbGxlcnlVbml0JywgZnVuY3Rpb24gKCl7XG5cblx0XHR2YXIgdHJhY2tJRCA9ICQodGhpcykuZGF0YSgndHJhY2staWQnKTtcblxuXHRcdGthcmFPSy5zZWxlY3RlZEFsYnVtTmFtZSA9ICQodGhpcykuZmluZChcImg0XCIpLnRleHQoKTtcblx0XHRrYXJhT0suc2VsZWN0ZWRBcnRpc3ROYW1lID0gJCh0aGlzKS5maW5kKFwiaDNcIikudGV4dCgpO1xuXHRcdGthcmFPSy5zZWxlY3RlZFRyYWNrTmFtZSA9ICQodGhpcykuZmluZChcImgyXCIpLnRleHQoKTtcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzKTtcblx0XHQvLyBjb25zb2xlLmxvZyhzZWxlY3RlZEFsYnVtTmFtZSwgc2VsZWN0ZWRBcnRpc3ROYW1lLCBzZWxlY3RlZFRyYWNrTmFtZSk7XG5cblx0XHRrYXJhT0suZ2V0THlyaWNzKHRyYWNrSUQpO1xuXG5cblx0fSk7XG5cblx0JChcIiNhZGRUb1BsYXlsaXN0XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblx0XHR2YXIgcGxheWxpc3RBbGJ1bSA9ICQoXCI8aDQ+XCIpLnRleHQoa2FyYU9LLnNlbGVjdGVkQWxidW1OYW1lKTtcblx0XHR2YXIgcGxheWxpc3RBcnRpc3QgPSAkKFwiPGgzPlwiKS50ZXh0KGthcmFPSy5zZWxlY3RlZEFydGlzdE5hbWUpOyBcblx0XHR2YXIgcGxheWxpc3RUcmFjayA9ICQoXCI8aDI+XCIpLnRleHQoa2FyYU9LLnNlbGVjdGVkVHJhY2tOYW1lKTtcblxuXHRcdHZhciBwbGF5TGlzdEl0ZW0gPSAkKFwiPGxpPlwiKS5hcHBlbmQocGxheWxpc3RUcmFjaywgcGxheWxpc3RBcnRpc3QsIHBsYXlsaXN0QWxidW0pO1xuXG5cdFx0JChcIi5zYWZlUGxheUxpc3RcIikuYXBwZW5kKHBsYXlMaXN0SXRlbSk7XG5cblx0XHRjb25zb2xlLmxvZyhwbGF5TGlzdEl0ZW0pO1xuXHR9KVxuXG59XG5cbi8vIDIuIFVzZSB1c2VyIGlucHV0IHRvIG1ha2UgQVBJIHJlcXVlc3QvQUpBWCByZXF1ZXN0LlxuLy8gMy4gRmlsdGVyIHRoZSByZXN1bHRzIChpZSBzZWFyY2ggYnkgbHlyaWNzIG9ubHksIGxhbmd1YWdlLCBmb3JtYXQgZXRjKVxua2FyYU9LLmdldFNvbmdJbmZvID0gZnVuY3Rpb24gKHRyYWNrLCBhcnRpc3QsIGx5cmljcykge1xuXHQkLmFqYXgoe1xuXHRcdHVybDogJ2h0dHA6Ly9hcGkubXVzaXhtYXRjaC5jb20vd3MvMS4xL3RyYWNrLnNlYXJjaCcsXG5cdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRkYXRhVHlwZTogJ2pzb25wJyxcblx0XHRkYXRhOiB7XG5cdFx0XHRhcGlrZXk6IGthcmFPSy5hcGlrZXksXG5cdFx0XHRxX3RyYWNrOiB0cmFjayxcblx0XHRcdHFfYXJ0aXN0OiBhcnRpc3QsXG5cdFx0XHRxX2x5cmljczogbHlyaWNzLFxuXHRcdFx0Zl9oYXNfbHlyaWNzOiAnJyxcblx0XHRcdGZfbHlyaWNzX2xhbmd1YWdlOiAnZW4nLFxuXHRcdFx0Zm9ybWF0OiAnanNvbnAnLFxuXHRcdFx0cGFnZV9zaXplOiAxMDBcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCl7XG5cdFx0Ly8gNC4gRGlzcGxheSBBUEkgcmVxdWVzdCByZXN1bHRzIG9uIHNjcmVlblxuXHRcdC8vIFx0KHRyYWNrX2lkLCB0cmFja19uYW1lLCBleHBsaWNpdCwgYWxidW1fbmFtZSwgYXJ0aXN0X25hbWUsIGFsYnVtX2NvdmVyYXJ0XzEwMHgxMDAsIHRyYWNrX3NoYXJlX3VybClcblx0XHR2YXIgdHJhY2tMaXN0ID0gcmVzdWx0Lm1lc3NhZ2UuYm9keS50cmFja19saXN0XG5cblx0XHR0cmFja0xpc3QuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuXG5cdFx0XHR2YXIgZ2FsbGVyeVVuaXQgPSAkKCc8bGk+JykuYWRkQ2xhc3MoJ2dhbGxlcnlVbml0Jyk7XG5cblx0XHRcdHZhciBjb3ZlckFydCA9ICQoJzxpbWc+JykuYXR0cignc3JjJywgdHJhY2sudHJhY2suYWxidW1fY292ZXJhcnRfMTAweDEwMCk7XG5cdFx0XHR2YXIgYWxidW1OYW1lID0gJCgnPGg0PicpLnRleHQodHJhY2sudHJhY2suYWxidW1fbmFtZSk7XG5cdFx0XHR2YXIgYXJ0aXN0TmFtZSA9ICQoJzxoMz4nKS50ZXh0KHRyYWNrLnRyYWNrLmFydGlzdF9uYW1lKTtcblx0XHRcdHZhciB0cmFja05hbWUgPSAkKCc8aDI+JykudGV4dCh0cmFjay50cmFjay50cmFja19uYW1lKTtcblxuXHRcdFx0dmFyIHRyYWNrSWQgPSB0cmFjay50cmFjay50cmFja19pZDtcblxuXHRcdFx0Z2FsbGVyeVVuaXQuZGF0YSgndHJhY2staWQnLCB0cmFja0lkKTtcblx0XHRcdGdhbGxlcnlVbml0LmFwcGVuZChjb3ZlckFydCwgdHJhY2tOYW1lLCBhcnRpc3ROYW1lLCBhbGJ1bU5hbWUpO1xuXHRcdFx0Ly8gdmFyIGdhbGxlcnlVbml0RmluYWwgPSBnYWxsZXJ5VW5pdC5hcHBlbmQoY292ZXJBcnQsIHRyYWNrTmFtZSwgYXJ0aXN0TmFtZSwgYWxidW1OYW1lKTtcblx0XHRcdCQoJy5zb25nR2FsbGVyeScpLmFwcGVuZChnYWxsZXJ5VW5pdCk7XG5cdFx0XHQvLyAkKCcuc29uZ0dhbGxlcnknKS5hcHBlbmQoZ2FsbGVyeVVuaXRGaW5hbCk7XG5cblx0XHR9KTtcblxuXHR9KTtcbn1cblxuLy8gNi4gTWFrZSBBUEkgcmVxdWVzdCB0byB0cmFjay5seXJpY3MuZ2V0LCBcbmthcmFPSy5nZXRMeXJpY3MgPSBmdW5jdGlvbiAodHJhY2tJZCkge1xuXHQkLmFqYXgoe1xuXHRcdHVybDogJ2h0dHA6Ly9hcGkubXVzaXhtYXRjaC5jb20vd3MvMS4xL3RyYWNrLmx5cmljcy5nZXQnLFxuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YXBpa2V5OiBrYXJhT0suYXBpa2V5LFxuXHRcdFx0dHJhY2tfaWQ6IHRyYWNrSWQsXG5cdFx0XHRmb3JtYXQ6ICdqc29ucCdcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcblx0XHQvLyBjb25zb2xlLmxvZyhyZXN1bHQpO1xuXHRcdHZhciBseXJpY3MgPSByZXN1bHQubWVzc2FnZS5ib2R5Lmx5cmljcy5seXJpY3NfYm9keTtcblx0XHRjb25zb2xlLmxvZyhseXJpY3MpO1xuXG5cdFx0Ly8gNy4gVXNlIGphdmFzY3JpcHQgZmlsdGVyIHRvIHNjYW4gdGhlIGx5cmljcyBmb3IgcHJvZmFuaXR5LlxuXHRcdHZhciBmaWx0ZXJTd2VhciA9ICcnO1xuXHRcdHZhciBmaWx0ZXJTd2VhciA9IGZpbHRlci5jb250YWlucyhseXJpY3MpO1xuXHRcdGNvbnNvbGUubG9nKGZpbHRlclN3ZWFyKTtcblxuXHRcdGlmIChmaWx0ZXJTd2VhciA9PT0gdHJ1ZSkge1xuXHRcdFx0JCgnLm1vZGFsTm8nKS5hZGRDbGFzcygnbW9kYWxEaXNwbGF5Jyk7XG5cdFx0fSBlbHNlIGlmIChmaWx0ZXJTd2VhciA9PT0gZmFsc2UpIHtcblx0XHRcdCQoJy5tb2RhbFllcycpLmFkZENsYXNzKCdtb2RhbERpc3BsYXknKTtcblx0XHR9XG5cblx0XHRcblxuXHR9KTtcdFxufVxuXG5rYXJhT0suYWRkVG9QbGF5bGlzdCA9IGZ1bmN0aW9uKCl7XG5cbn07XG5cbiQoZnVuY3Rpb24oKXtcblx0a2FyYU9LLmluaXQoKTtcbn0pO1xuXG4iLCJtb2R1bGUuZXhwb3J0cz17XCJiYWR3b3Jkc1wiIDogW1wiNHI1ZVwiLFxyXG4gXCI1aDF0XCIsXHJcbiBcIjVoaXRcIixcclxuIFwiYTU1XCIsXHJcbiBcImFuYWxcIixcclxuICBcImFudXNcIixcclxuICBcImFyNWVcIixcclxuICBcImFycnNlXCIsXHJcbiAgXCJhcnNlXCIsXHJcbiAgXCJhc3NcIixcclxuICBcImFzcy1mdWNrZXJcIixcclxuICBcImFzc2VzXCIsXHJcbiAgXCJhc3NmdWNrZXJcIixcclxuICBcImFzc2Z1a2thXCIsXHJcbiAgXCJhc3Nob2xlXCIsXHJcbiAgXCJhc3Nob2xlc1wiLFxyXG4gIFwiYXNzd2hvbGVcIixcclxuICBcImFfc19zXCIsXHJcbiAgXCJiIXRjaFwiLFxyXG4gIFwiYjAwYnNcIixcclxuICBcImIxN2NoXCIsXHJcbiAgXCJiMXRjaFwiLFxyXG4gIFwiYmFsbGJhZ1wiLFxyXG4gIFwiYmFsbHNcIixcclxuICBcImJhbGxzYWNrXCIsXHJcbiAgXCJiYXN0YXJkXCIsXHJcbiAgXCJiZWFzdGlhbFwiLFxyXG4gIFwiYmVhc3RpYWxpdHlcIixcclxuICBcImJlbGxlbmRcIixcclxuICBcImJlc3RpYWxcIixcclxuICBcImJlc3RpYWxpdHlcIixcclxuICBcImJpK2NoXCIsXHJcbiAgXCJiaWF0Y2hcIixcclxuICBcImJpdGNoXCIsXHJcbiAgXCJiaXRjaGVyXCIsXHJcbiAgXCJiaXRjaGVyc1wiLFxyXG4gIFwiYml0Y2hlc1wiLFxyXG4gIFwiYml0Y2hpblwiLFxyXG4gIFwiYml0Y2hpbmdcIixcclxuICBcImJsb29keVwiLFxyXG4gIFwiYmxvdyBqb2JcIixcclxuICBcImJsb3dqb2JcIixcclxuICBcImJsb3dqb2JzXCIsXHJcbiAgXCJib2lvbGFzXCIsXHJcbiAgXCJib2xsb2NrXCIsXHJcbiAgXCJib2xsb2tcIixcclxuICBcImJvbmVyXCIsXHJcbiAgXCJib29iXCIsXHJcbiAgXCJib29ic1wiLFxyXG4gIFwiYm9vb2JzXCIsXHJcbiAgXCJib29vb2JzXCIsXHJcbiAgXCJib29vb29ic1wiLFxyXG4gIFwiYm9vb29vb29ic1wiLFxyXG4gIFwiYnJlYXN0c1wiLFxyXG4gIFwiYnVjZXRhXCIsXHJcbiAgXCJidWdnZXJcIixcclxuICBcImJ1bVwiLFxyXG4gIFwiYnVubnkgZnVja2VyXCIsXHJcbiAgXCJidXR0XCIsXHJcbiAgXCJidXR0aG9sZVwiLFxyXG4gIFwiYnV0dG11Y2hcIixcclxuICBcImJ1dHRwbHVnXCIsXHJcbiAgXCJjMGNrXCIsXHJcbiAgXCJjMGNrc3Vja2VyXCIsXHJcbiAgXCJjYXJwZXQgbXVuY2hlclwiLFxyXG4gIFwiY2F3a1wiLFxyXG4gIFwiY2hpbmtcIixcclxuICBcImNpcGFcIixcclxuICBcImNsMXRcIixcclxuICBcImNsaXRcIixcclxuICBcImNsaXRvcmlzXCIsXHJcbiAgXCJjbGl0c1wiLFxyXG4gIFwiY251dFwiLFxyXG4gIFwiY29ja1wiLFxyXG4gIFwiY29jay1zdWNrZXJcIixcclxuICBcImNvY2tmYWNlXCIsXHJcbiAgXCJjb2NraGVhZFwiLFxyXG4gIFwiY29ja211bmNoXCIsXHJcbiAgXCJjb2NrbXVuY2hlclwiLFxyXG4gIFwiY29ja3NcIixcclxuICBcImNvY2tzdWNrXCIsXHJcbiAgXCJjb2Nrc3Vja2VkXCIsXHJcbiAgXCJjb2Nrc3Vja2VyXCIsXHJcbiAgXCJjb2Nrc3Vja2luZ1wiLFxyXG4gIFwiY29ja3N1Y2tzXCIsXHJcbiAgXCJjb2Nrc3VrYVwiLFxyXG4gIFwiY29ja3N1a2thXCIsXHJcbiAgXCJjb2tcIixcclxuICBcImNva211bmNoZXJcIixcclxuICBcImNva3N1Y2thXCIsXHJcbiAgXCJjb29uXCIsXHJcbiAgXCJjb3hcIixcclxuICBcImNyYXBcIixcclxuICBcImN1bVwiLFxyXG4gIFwiY3VtbWVyXCIsXHJcbiAgXCJjdW1taW5nXCIsXHJcbiAgXCJjdW1zXCIsXHJcbiAgXCJjdW1zaG90XCIsXHJcbiAgXCJjdW5pbGluZ3VzXCIsXHJcbiAgXCJjdW5pbGxpbmd1c1wiLFxyXG4gIFwiY3VubmlsaW5ndXNcIixcclxuICBcImN1bnRcIixcclxuICBcImN1bnRsaWNrXCIsXHJcbiAgXCJjdW50bGlja2VyXCIsXHJcbiAgXCJjdW50bGlja2luZ1wiLFxyXG4gIFwiY3VudHNcIixcclxuICBcImN5YWxpc1wiLFxyXG4gIFwiY3liZXJmdWNcIixcclxuICBcImN5YmVyZnVja1wiLFxyXG4gIFwiY3liZXJmdWNrZWRcIixcclxuICBcImN5YmVyZnVja2VyXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlcnNcIixcclxuICBcImN5YmVyZnVja2luZ1wiLFxyXG4gIFwiZDFja1wiLFxyXG4gIFwiZGFtblwiLFxyXG4gIFwiZGlja1wiLFxyXG4gIFwiZGlja2hlYWRcIixcclxuICBcImRpbGRvXCIsXHJcbiAgXCJkaWxkb3NcIixcclxuICBcImRpbmtcIixcclxuICBcImRpbmtzXCIsXHJcbiAgXCJkaXJzYVwiLFxyXG4gIFwiZGxja1wiLFxyXG4gIFwiZG9nLWZ1Y2tlclwiLFxyXG4gIFwiZG9nZ2luXCIsXHJcbiAgXCJkb2dnaW5nXCIsXHJcbiAgXCJkb25rZXlyaWJiZXJcIixcclxuICBcImRvb3NoXCIsXHJcbiAgXCJkdWNoZVwiLFxyXG4gIFwiZHlrZVwiLFxyXG4gIFwiZWphY3VsYXRlXCIsXHJcbiAgXCJlamFjdWxhdGVkXCIsXHJcbiAgXCJlamFjdWxhdGVzXCIsXHJcbiAgXCJlamFjdWxhdGluZ1wiLFxyXG4gIFwiZWphY3VsYXRpbmdzXCIsXHJcbiAgXCJlamFjdWxhdGlvblwiLFxyXG4gIFwiZWpha3VsYXRlXCIsXHJcbiAgXCJmIHUgYyBrXCIsXHJcbiAgXCJmIHUgYyBrIGUgclwiLFxyXG4gIFwiZjRubnlcIixcclxuICBcImZhZ1wiLFxyXG4gIFwiZmFnZ2luZ1wiLFxyXG4gIFwiZmFnZ2l0dFwiLFxyXG4gIFwiZmFnZ290XCIsXHJcbiAgXCJmYWdnc1wiLFxyXG4gIFwiZmFnb3RcIixcclxuICBcImZhZ290c1wiLFxyXG4gIFwiZmFnc1wiLFxyXG4gIFwiZmFubnlcIixcclxuICBcImZhbm55ZmxhcHNcIixcclxuICBcImZhbm55ZnVja2VyXCIsXHJcbiAgXCJmYW55eVwiLFxyXG4gIFwiZmF0YXNzXCIsXHJcbiAgXCJmY3VrXCIsXHJcbiAgXCJmY3VrZXJcIixcclxuICBcImZjdWtpbmdcIixcclxuICBcImZlY2tcIixcclxuICBcImZlY2tlclwiLFxyXG4gIFwiZmVsY2hpbmdcIixcclxuICBcImZlbGxhdGVcIixcclxuICBcImZlbGxhdGlvXCIsXHJcbiAgXCJmaW5nZXJmdWNrXCIsXHJcbiAgXCJmaW5nZXJmdWNrZWRcIixcclxuICBcImZpbmdlcmZ1Y2tlclwiLFxyXG4gIFwiZmluZ2VyZnVja2Vyc1wiLFxyXG4gIFwiZmluZ2VyZnVja2luZ1wiLFxyXG4gIFwiZmluZ2VyZnVja3NcIixcclxuICBcImZpc3RmdWNrXCIsXHJcbiAgXCJmaXN0ZnVja2VkXCIsXHJcbiAgXCJmaXN0ZnVja2VyXCIsXHJcbiAgXCJmaXN0ZnVja2Vyc1wiLFxyXG4gIFwiZmlzdGZ1Y2tpbmdcIixcclxuICBcImZpc3RmdWNraW5nc1wiLFxyXG4gIFwiZmlzdGZ1Y2tzXCIsXHJcbiAgXCJmbGFuZ2VcIixcclxuICBcImZvb2tcIixcclxuICBcImZvb2tlclwiLFxyXG4gIFwiZnVja1wiLFxyXG4gIFwiZnVja2FcIixcclxuICBcImZ1Y2tlZFwiLFxyXG4gIFwiZnVja2VyXCIsXHJcbiAgXCJmdWNrZXJzXCIsXHJcbiAgXCJmdWNraGVhZFwiLFxyXG4gIFwiZnVja2hlYWRzXCIsXHJcbiAgXCJmdWNraW5cIixcclxuICBcImZ1Y2tpbmdcIixcclxuICBcImZ1Y2tpbmdzXCIsXHJcbiAgXCJmdWNraW5nc2hpdG1vdGhlcmZ1Y2tlclwiLFxyXG4gIFwiZnVja21lXCIsXHJcbiAgXCJmdWNrc1wiLFxyXG4gIFwiZnVja3doaXRcIixcclxuICBcImZ1Y2t3aXRcIixcclxuICBcImZ1ZGdlIHBhY2tlclwiLFxyXG4gIFwiZnVkZ2VwYWNrZXJcIixcclxuICBcImZ1a1wiLFxyXG4gIFwiZnVrZXJcIixcclxuICBcImZ1a2tlclwiLFxyXG4gIFwiZnVra2luXCIsXHJcbiAgXCJmdWtzXCIsXHJcbiAgXCJmdWt3aGl0XCIsXHJcbiAgXCJmdWt3aXRcIixcclxuICBcImZ1eFwiLFxyXG4gIFwiZnV4MHJcIixcclxuICBcImZfdV9jX2tcIixcclxuICBcImdhbmdiYW5nXCIsXHJcbiAgXCJnYW5nYmFuZ2VkXCIsXHJcbiAgXCJnYW5nYmFuZ3NcIixcclxuICBcImdheWxvcmRcIixcclxuICBcImdheXNleFwiLFxyXG4gIFwiZ29hdHNlXCIsXHJcbiAgXCJHb2RcIixcclxuICBcImdvZC1kYW1cIixcclxuICBcImdvZC1kYW1uZWRcIixcclxuICBcImdvZGRhbW5cIixcclxuICBcImdvZGRhbW5lZFwiLFxyXG4gIFwiaGFyZGNvcmVzZXhcIixcclxuICBcImhlbGxcIixcclxuICBcImhlc2hlXCIsXHJcbiAgXCJob2FyXCIsXHJcbiAgXCJob2FyZVwiLFxyXG4gIFwiaG9lclwiLFxyXG4gIFwiaG9tb1wiLFxyXG4gIFwiaG9yZVwiLFxyXG4gIFwiaG9ybmllc3RcIixcclxuICBcImhvcm55XCIsXHJcbiAgXCJob3RzZXhcIixcclxuICBcImphY2stb2ZmXCIsXHJcbiAgXCJqYWNrb2ZmXCIsXHJcbiAgXCJqYXBcIixcclxuICBcImplcmstb2ZmXCIsXHJcbiAgXCJqaXNtXCIsXHJcbiAgXCJqaXpcIixcclxuICBcImppem1cIixcclxuICBcImppenpcIixcclxuICBcImthd2tcIixcclxuICBcImtub2JcIixcclxuICBcImtub2JlYWRcIixcclxuICBcImtub2JlZFwiLFxyXG4gIFwia25vYmVuZFwiLFxyXG4gIFwia25vYmhlYWRcIixcclxuICBcImtub2Jqb2NreVwiLFxyXG4gIFwia25vYmpva2V5XCIsXHJcbiAgXCJrb2NrXCIsXHJcbiAgXCJrb25kdW1cIixcclxuICBcImtvbmR1bXNcIixcclxuICBcImt1bVwiLFxyXG4gIFwia3VtbWVyXCIsXHJcbiAgXCJrdW1taW5nXCIsXHJcbiAgXCJrdW1zXCIsXHJcbiAgXCJrdW5pbGluZ3VzXCIsXHJcbiAgXCJsM2krY2hcIixcclxuICBcImwzaXRjaFwiLFxyXG4gIFwibGFiaWFcIixcclxuICBcImxtZmFvXCIsXHJcbiAgXCJsdXN0XCIsXHJcbiAgXCJsdXN0aW5nXCIsXHJcbiAgXCJtMGYwXCIsXHJcbiAgXCJtMGZvXCIsXHJcbiAgXCJtNDV0ZXJiYXRlXCIsXHJcbiAgXCJtYTV0ZXJiOFwiLFxyXG4gIFwibWE1dGVyYmF0ZVwiLFxyXG4gIFwibWFzb2NoaXN0XCIsXHJcbiAgXCJtYXN0ZXItYmF0ZVwiLFxyXG4gIFwibWFzdGVyYjhcIixcclxuICBcIm1hc3RlcmJhdCpcIixcclxuICBcIm1hc3RlcmJhdDNcIixcclxuICBcIm1hc3RlcmJhdGVcIixcclxuICBcIm1hc3RlcmJhdGlvblwiLFxyXG4gIFwibWFzdGVyYmF0aW9uc1wiLFxyXG4gIFwibWFzdHVyYmF0ZVwiLFxyXG4gIFwibW8tZm9cIixcclxuICBcIm1vZjBcIixcclxuICBcIm1vZm9cIixcclxuICBcIm1vdGhhZnVja1wiLFxyXG4gIFwibW90aGFmdWNrYVwiLFxyXG4gIFwibW90aGFmdWNrYXNcIixcclxuICBcIm1vdGhhZnVja2F6XCIsXHJcbiAgXCJtb3RoYWZ1Y2tlZFwiLFxyXG4gIFwibW90aGFmdWNrZXJcIixcclxuICBcIm1vdGhhZnVja2Vyc1wiLFxyXG4gIFwibW90aGFmdWNraW5cIixcclxuICBcIm1vdGhhZnVja2luZ1wiLFxyXG4gIFwibW90aGFmdWNraW5nc1wiLFxyXG4gIFwibW90aGFmdWNrc1wiLFxyXG4gIFwibW90aGVyIGZ1Y2tlclwiLFxyXG4gIFwibW90aGVyZnVja1wiLFxyXG4gIFwibW90aGVyZnVja2VkXCIsXHJcbiAgXCJtb3RoZXJmdWNrZXJcIixcclxuICBcIm1vdGhlcmZ1Y2tlcnNcIixcclxuICBcIm1vdGhlcmZ1Y2tpblwiLFxyXG4gIFwibW90aGVyZnVja2luZ1wiLFxyXG4gIFwibW90aGVyZnVja2luZ3NcIixcclxuICBcIm1vdGhlcmZ1Y2trYVwiLFxyXG4gIFwibW90aGVyZnVja3NcIixcclxuICBcIm11ZmZcIixcclxuICBcIm11dGhhXCIsXHJcbiAgXCJtdXRoYWZlY2tlclwiLFxyXG4gIFwibXV0aGFmdWNra2VyXCIsXHJcbiAgXCJtdXRoZXJcIixcclxuICBcIm11dGhlcmZ1Y2tlclwiLFxyXG4gIFwibjFnZ2FcIixcclxuICBcIm4xZ2dlclwiLFxyXG4gIFwibmF6aVwiLFxyXG4gIFwibmlnZzNyXCIsXHJcbiAgXCJuaWdnNGhcIixcclxuICBcIm5pZ2dhXCIsXHJcbiAgXCJuaWdnYWhcIixcclxuICBcIm5pZ2dhc1wiLFxyXG4gIFwibmlnZ2F6XCIsXHJcbiAgXCJuaWdnZXJcIixcclxuICBcIm5pZ2dlcnNcIixcclxuICBcIm5vYlwiLFxyXG4gIFwibm9iIGpva2V5XCIsXHJcbiAgXCJub2JoZWFkXCIsXHJcbiAgXCJub2Jqb2NreVwiLFxyXG4gIFwibm9iam9rZXlcIixcclxuICBcIm51bWJudXRzXCIsXHJcbiAgXCJudXRzYWNrXCIsXHJcbiAgXCJvcmdhc2ltXCIsXHJcbiAgXCJvcmdhc2ltc1wiLFxyXG4gIFwib3JnYXNtXCIsXHJcbiAgXCJvcmdhc21zXCIsXHJcbiAgXCJwMHJuXCIsXHJcbiAgXCJwYXduXCIsXHJcbiAgXCJwZWNrZXJcIixcclxuICBcInBlbmlzXCIsXHJcbiAgXCJwZW5pc2Z1Y2tlclwiLFxyXG4gIFwicGhvbmVzZXhcIixcclxuICBcInBodWNrXCIsXHJcbiAgXCJwaHVrXCIsXHJcbiAgXCJwaHVrZWRcIixcclxuICBcInBodWtpbmdcIixcclxuICBcInBodWtrZWRcIixcclxuICBcInBodWtraW5nXCIsXHJcbiAgXCJwaHVrc1wiLFxyXG4gIFwicGh1cVwiLFxyXG4gIFwicGlnZnVja2VyXCIsXHJcbiAgXCJwaW1waXNcIixcclxuICBcInBpc3NcIixcclxuICBcInBpc3NlZFwiLFxyXG4gIFwicGlzc2VyXCIsXHJcbiAgXCJwaXNzZXJzXCIsXHJcbiAgXCJwaXNzZXNcIixcclxuICBcInBpc3NmbGFwc1wiLFxyXG4gIFwicGlzc2luXCIsXHJcbiAgXCJwaXNzaW5nXCIsXHJcbiAgXCJwaXNzb2ZmXCIsXHJcbiAgXCJwb29wXCIsXHJcbiAgXCJwb3JuXCIsXHJcbiAgXCJwb3Jub1wiLFxyXG4gIFwicG9ybm9ncmFwaHlcIixcclxuICBcInBvcm5vc1wiLFxyXG4gIFwicHJpY2tcIixcclxuICBcInByaWNrc1wiLFxyXG4gIFwicHJvblwiLFxyXG4gIFwicHViZVwiLFxyXG4gIFwicHVzc2VcIixcclxuICBcInB1c3NpXCIsXHJcbiAgXCJwdXNzaWVzXCIsXHJcbiAgXCJwdXNzeVwiLFxyXG4gIFwicHVzc3lzXCIsXHJcbiAgXCJyZWN0dW1cIixcclxuICBcInJldGFyZFwiLFxyXG4gIFwicmltamF3XCIsXHJcbiAgXCJyaW1taW5nXCIsXHJcbiAgXCJzIGhpdFwiLFxyXG4gIFwicy5vLmIuXCIsXHJcbiAgXCJzYWRpc3RcIixcclxuICBcInNjaGxvbmdcIixcclxuICBcInNjcmV3aW5nXCIsXHJcbiAgXCJzY3JvYXRcIixcclxuICBcInNjcm90ZVwiLFxyXG4gIFwic2Nyb3R1bVwiLFxyXG4gIFwic2VtZW5cIixcclxuICBcInNleFwiLFxyXG4gIFwic2ghK1wiLFxyXG4gIFwic2ghdFwiLFxyXG4gIFwic2gxdFwiLFxyXG4gIFwic2hhZ1wiLFxyXG4gIFwic2hhZ2dlclwiLFxyXG4gIFwic2hhZ2dpblwiLFxyXG4gIFwic2hhZ2dpbmdcIixcclxuICBcInNoZW1hbGVcIixcclxuICBcInNoaStcIixcclxuICBcInNoaXRcIixcclxuICBcInNoaXRkaWNrXCIsXHJcbiAgXCJzaGl0ZVwiLFxyXG4gIFwic2hpdGVkXCIsXHJcbiAgXCJzaGl0ZXlcIixcclxuICBcInNoaXRmdWNrXCIsXHJcbiAgXCJzaGl0ZnVsbFwiLFxyXG4gIFwic2hpdGhlYWRcIixcclxuICBcInNoaXRpbmdcIixcclxuICBcInNoaXRpbmdzXCIsXHJcbiAgXCJzaGl0c1wiLFxyXG4gIFwic2hpdHRlZFwiLFxyXG4gIFwic2hpdHRlclwiLFxyXG4gIFwic2hpdHRlcnNcIixcclxuICBcInNoaXR0aW5nXCIsXHJcbiAgXCJzaGl0dGluZ3NcIixcclxuICBcInNoaXR0eVwiLFxyXG4gIFwic2thbmtcIixcclxuICBcInNsdXRcIixcclxuICBcInNsdXRzXCIsXHJcbiAgXCJzbWVnbWFcIixcclxuICBcInNtdXRcIixcclxuICBcInNuYXRjaFwiLFxyXG4gIFwic29uLW9mLWEtYml0Y2hcIixcclxuICBcInNwYWNcIixcclxuICBcInNwdW5rXCIsXHJcbiAgXCJzX2hfaV90XCIsXHJcbiAgXCJ0MXR0MWU1XCIsXHJcbiAgXCJ0MXR0aWVzXCIsXHJcbiAgXCJ0ZWV0c1wiLFxyXG4gIFwidGVlelwiLFxyXG4gIFwidGVzdGljYWxcIixcclxuICBcInRlc3RpY2xlXCIsXHJcbiAgXCJ0aXRcIixcclxuICBcInRpdGZ1Y2tcIixcclxuICBcInRpdHNcIixcclxuICBcInRpdHRcIixcclxuICBcInRpdHRpZTVcIixcclxuICBcInRpdHRpZWZ1Y2tlclwiLFxyXG4gIFwidGl0dGllc1wiLFxyXG4gIFwidGl0dHlmdWNrXCIsXHJcbiAgXCJ0aXR0eXdhbmtcIixcclxuICBcInRpdHdhbmtcIixcclxuICBcInRvc3NlclwiLFxyXG4gIFwidHVyZFwiLFxyXG4gIFwidHc0dFwiLFxyXG4gIFwidHdhdFwiLFxyXG4gIFwidHdhdGhlYWRcIixcclxuICBcInR3YXR0eVwiLFxyXG4gIFwidHd1bnRcIixcclxuICBcInR3dW50ZXJcIixcclxuICBcInYxNGdyYVwiLFxyXG4gIFwidjFncmFcIixcclxuICBcInZhZ2luYVwiLFxyXG4gIFwidmlhZ3JhXCIsXHJcbiAgXCJ2dWx2YVwiLFxyXG4gIFwidzAwc2VcIixcclxuICBcIndhbmdcIixcclxuICBcIndhbmtcIixcclxuICBcIndhbmtlclwiLFxyXG4gIFwid2Fua3lcIixcclxuICBcIndob2FyXCIsXHJcbiAgXCJ3aG9yZVwiLFxyXG4gIFwid2lsbGllc1wiLFxyXG4gIFwid2lsbHlcIixcclxuICBcInhyYXRlZFwiLFxyXG4gIFwieHh4XCJcclxuXX0iLCJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xyXG52YXIgYmFkd29yZHMgPSByZXF1aXJlKCcuL2JhZHdvcmRzLmpzb24nKS5iYWR3b3JkcztcclxudmFyIFRleHRGaW5kZXIgPSByZXF1aXJlKCcuL3RleHRmaW5kZXInKTtcclxuXHJcbi8vIENvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIEJhZExhbmd1YWdlRmlsdGVyKCkge1xyXG5cdHRoaXMudGV4dGZpbmRlciA9IG5ldyBUZXh0RmluZGVyKGJhZHdvcmRzKTtcclxufVxyXG5cclxuLy8gQ2hlY2sgaWYgYW55IGJhZCB3b3JkcyBpcyBjb250YWluZWQgaW4gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcblx0cmV0dXJuIHRoaXMudGV4dGZpbmRlci5jb250YWlucyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIENoZWNrIGlmIGFueSBiYWQgd29yZHMgaXMgY29udGFpbmVkIGluIGNvbnRlbnQgYW5kIHJldHVybnMgYXJyYXkgb2Ygd29yZHNcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLm1hdGNoZXMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBSZW1vdmUgYmFkIHdvcmRzIGZyb20gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUucmVtb3ZlV29yZHMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLnJlbW92ZVdvcmRzKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gUmVwbGFjZSBiYWQgd29yZHMgZnJvbSBjb250ZW50XHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5yZXBsYWNlV29yZHMgPSBmdW5jdGlvbihjb250ZW50LCByZXBsYWNlc3RyKSB7XHJcbiAgICByZXR1cm4gdGhpcy50ZXh0ZmluZGVyLnJlcGxhY2VXb3Jkcyhjb250ZW50LCByZXBsYWNlc3RyKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFkTGFuZ3VhZ2VGaWx0ZXI7IiwiLy8gQ29uc3RydWN0b3JcclxuZnVuY3Rpb24gVGV4dEZpbmRlcih3b3JkTGlzdCkge1xyXG4gIHRoaXMud29yZGxpc3QgPSB3b3JkTGlzdDtcclxuICB0aGlzLnNlYXJjaHN0cmluZyA9IG5ldyBSZWdFeHAod29yZExpc3Quam9pbihcIiB8XCIpLnJlcGxhY2UoL1teXFx3XFxzXnxdL2dpLCAnJyksICdpJyk7XHJcbiAgdGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcgPSBuZXcgUmVnRXhwKHdvcmRMaXN0LmpvaW4oXCIgfFwiKS5yZXBsYWNlKC9bXlxcd1xcc158XS9naSwgJycpLCAnZ2knKTtcclxuXHJcbn1cclxuLy8gY2xhc3MgbWV0aG9kc1xyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuXHRyZXR1cm4gdGhpcy5zZWFyY2hzdHJpbmcudGVzdChjb250ZW50KTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gY29udGVudC5tYXRjaCh0aGlzLmdsb2JhbHNlYXJjaHN0cmluZyk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5yZW1vdmVXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UodGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcsICcnKTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLnJlcGxhY2VXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIHJlcGxhY2VzdHIpIHtcclxuICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UodGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcsIHJlcGxhY2VzdHIpO1xyXG59O1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGV4dEZpbmRlcjsiLCIiXX0=
