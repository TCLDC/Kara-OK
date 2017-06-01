(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _badLanguageFilter = require('bad-language-filter');

var _badLanguageFilter2 = _interopRequireDefault(_badLanguageFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

karaOK.init = function () {
	karaOK.eventHandlers();
	karaOK.fullPage();
};

karaOK.fullPage = function () {
	$('#fullpage').fullpage();
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
		karaOK.getLyrics(trackID);
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
			var albumName = $('<h3>').text(track.track.album_name);
			var artistName = $('<h3>').text(track.track.artist_name);
			var trackName = $('<h2>').text(track.track.track_name);

			var trackId = track.track.track_id;

			galleryUnit.data('track-id', trackId);
			galleryUnit.append(coverArt, trackName, artistName, albumName);

			$('.songGallery').append(galleryUnit);
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
<<<<<<< HEAD
		var lyrics = result;
=======
		console.log(result);
		var lyrics = result.message.body.lyrics.lyrics_body;
		console.log(lyrics);
>>>>>>> 93650d1c2ca8f9febbb5472ab44122fa944f0758
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLFNBQVMsRUFBYjs7QUFFQSxPQUFPLE1BQVAsR0FBZ0Isa0NBQWhCOztBQUVFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFRTs7QUFFRixPQUFPLElBQVAsR0FBYyxZQUFXO0FBQ3hCLFFBQU8sYUFBUDtBQUNBLENBRkQ7O0FBSUEsT0FBTyxhQUFQLEdBQXVCLFlBQVk7O0FBRWxDO0FBQ0EsR0FBRSxNQUFGLEVBQVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsVUFBUyxLQUFULEVBQWdCOztBQUV0QyxRQUFNLGNBQU47QUFDQSxNQUFJLGdCQUFnQixFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsRUFBcEI7QUFDQSxNQUFJLGlCQUFpQixFQUFFLGFBQUYsRUFBaUIsR0FBakIsRUFBckI7QUFDQSxNQUFJLGlCQUFpQixFQUFFLGFBQUYsRUFBaUIsR0FBakIsRUFBckI7O0FBRUEsU0FBTyxXQUFQLENBQW1CLGFBQW5CLEVBQWtDLGNBQWxDLEVBQWtELGNBQWxEOztBQUVBLFVBQVEsR0FBUixDQUFZLGNBQVo7QUFDQSxFQVZEOztBQVlBO0FBQ0EsR0FBRSxjQUFGLEVBQWtCLEVBQWxCLENBQXFCLE9BQXJCLEVBQThCLGNBQTlCLEVBQThDLFlBQVc7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBCYWRMYW5ndWFnZUZpbHRlciBmcm9tICdiYWQtbGFuZ3VhZ2UtZmlsdGVyJztcblxuLy8gNy4gVXNlIGphdmFzY3JpcHQgZmlsdGVyIHRvIHNjYW4gdGhlIGx5cmljcyBmb3IgcHJvZmFuaXR5LlxuLy8gOC4gSUYgdGhlcmUgaXMgcHJvZmFuaXR5IGRpc3BsYXkgcmVkICsgZmVlZGJhY2tcbi8vIDkuIElGIEVMU0UgZGlzcGxheSBncmVlbiArIGZlZWRiYWNrXG4vLyAxMC4gQWxsb3cgdXNlciB0byBzYXZlIHNvbmcgdG8gcGxheWxpc3RcblxudmFyIGthcmFPSyA9IHt9O1xuXG5rYXJhT0suYXBpa2V5ID0gJzEyYjI3YTgyOWNhZjVjMmZiYzE1NzUxYzVhMTYwOWQxJztcblxuXHRcdC8vIDw9PT09PT09PT0gRklMVEVSIEJBRCBXT1JEUyA9PT09PT09PT09PlxuXG4vLyB2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuLy8gdmFyIGJhZHdvcmRzID0gcmVxdWlyZSgnLi9iYWR3b3Jkcy5qc29uJykuYmFkd29yZHM7XG4vLyB2YXIgVGV4dEZpbmRlciA9IHJlcXVpcmUoJy4vdGV4dGZpbmRlcicpO1xuXG4vLyAvLyBDb25zdHJ1Y3RvclxuLy8gZnVuY3Rpb24gQmFkTGFuZ3VhZ2VGaWx0ZXIoKSB7XG4vLyBcdHRoaXMudGV4dGZpbmRlciA9IG5ldyBUZXh0RmluZGVyKGJhZHdvcmRzKTtcbi8vIH1cblxuLy8gLy8gQ2hlY2sgaWYgYW55IGJhZCB3b3JkcyBpcyBjb250YWluZWQgaW4gY29udGVudFxuLy8gQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGVudCkge1xuLy8gXHRyZXR1cm4gdGhpcy50ZXh0ZmluZGVyLmNvbnRhaW5zKGNvbnRlbnQpO1xuLy8gfTtcblxuXHRcdC8vIDw9PT09PT09PT0gRklMVEVSIEJBRCBXT1JEUyA9PT09PT09PT09PlxuXG5rYXJhT0suaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRrYXJhT0suZXZlbnRIYW5kbGVycygpO1xufVxuXG5rYXJhT0suZXZlbnRIYW5kbGVycyA9IGZ1bmN0aW9uICgpIHtcblxuXHQvLyAxLiBSZWNlaXZlIHVzZXIgaW5wdXQuXG5cdCQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIHVzZXJUcmFja05hbWUgPSAkKCcudHJhY2tOYW1lJykudmFsKCk7XG5cdFx0dmFyIHVzZXJBcnRpc3ROYW1lID0gJCgnLmFydGlzdE5hbWUnKS52YWwoKTtcblx0XHR2YXIgdXNlckx5cmljc05hbWUgPSAkKCcubHlyaWNzTmFtZScpLnZhbCgpO1xuXG5cdFx0a2FyYU9LLmdldFNvbmdJbmZvKHVzZXJUcmFja05hbWUsIHVzZXJBcnRpc3ROYW1lLCB1c2VyTHlyaWNzTmFtZSk7XG5cblx0XHRjb25zb2xlLmxvZyh1c2VyQXJ0aXN0TmFtZSk7XG5cdH0pO1xuXG5cdC8vIDUuIFJlY2VpdmUgdXNlciBzZWxlY3Rpb24uXG5cdCQoJy5zb25nR2FsbGVyeScpLm9uKCdjbGljaycsICcuZ2FsbGVyeVVuaXQnLCBmdW5jdGlvbiAoKXtcblxuXHRcdHZhciB0cmFja0lEID0gJCh0aGlzKS5kYXRhKCd0cmFjay1pZCcpO1xuXHRcdGthcmFPSy5nZXRMeXJpY3ModHJhY2tJRCk7XG5cblx0fSlcblxufVxuXG4vLyAyLiBVc2UgdXNlciBpbnB1dCB0byBtYWtlIEFQSSByZXF1ZXN0L0FKQVggcmVxdWVzdC5cbi8vIDMuIEZpbHRlciB0aGUgcmVzdWx0cyAoaWUgc2VhcmNoIGJ5IGx5cmljcyBvbmx5LCBsYW5ndWFnZSwgZm9ybWF0IGV0YylcbmthcmFPSy5nZXRTb25nSW5mbyA9IGZ1bmN0aW9uICh0cmFjaywgYXJ0aXN0LCBseXJpY3MpIHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwOi8vYXBpLm11c2l4bWF0Y2guY29tL3dzLzEuMS90cmFjay5zZWFyY2gnLFxuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YXBpa2V5OiBrYXJhT0suYXBpa2V5LFxuXHRcdFx0cV90cmFjazogdHJhY2ssXG5cdFx0XHRxX2FydGlzdDogYXJ0aXN0LFxuXHRcdFx0cV9seXJpY3M6IGx5cmljcyxcblx0XHRcdGZfaGFzX2x5cmljczogJycsXG5cdFx0XHRmX2x5cmljc19sYW5ndWFnZTogJ2VuJyxcblx0XHRcdGZvcm1hdDogJ2pzb25wJyxcblx0XHRcdHBhZ2Vfc2l6ZTogMTAwXG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpe1xuXHRcdC8vIDQuIERpc3BsYXkgQVBJIHJlcXVlc3QgcmVzdWx0cyBvbiBzY3JlZW5cblx0XHQvLyBcdCh0cmFja19pZCwgdHJhY2tfbmFtZSwgZXhwbGljaXQsIGFsYnVtX25hbWUsIGFydGlzdF9uYW1lLCBhbGJ1bV9jb3ZlcmFydF8xMDB4MTAwLCB0cmFja19zaGFyZV91cmwpXG5cdFx0dmFyIHRyYWNrTGlzdCA9IHJlc3VsdC5tZXNzYWdlLmJvZHkudHJhY2tfbGlzdFxuXG5cdFx0dHJhY2tMaXN0LmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcblxuXHRcdFx0dmFyIGdhbGxlcnlVbml0ID0gJCgnPGxpPicpLmFkZENsYXNzKCdnYWxsZXJ5VW5pdCcpO1xuXG5cdFx0XHR2YXIgY292ZXJBcnQgPSAkKCc8aW1nPicpLmF0dHIoJ3NyYycsIHRyYWNrLnRyYWNrLmFsYnVtX2NvdmVyYXJ0XzEwMHgxMDApO1xuXHRcdFx0dmFyIGFsYnVtTmFtZSA9ICQoJzxoMz4nKS50ZXh0KHRyYWNrLnRyYWNrLmFsYnVtX25hbWUpO1xuXHRcdFx0dmFyIGFydGlzdE5hbWUgPSAkKCc8aDM+JykudGV4dCh0cmFjay50cmFjay5hcnRpc3RfbmFtZSk7XG5cdFx0XHR2YXIgdHJhY2tOYW1lID0gJCgnPGgyPicpLnRleHQodHJhY2sudHJhY2sudHJhY2tfbmFtZSk7XG5cblx0XHRcdHZhciB0cmFja0lkID0gdHJhY2sudHJhY2sudHJhY2tfaWQ7XG5cblx0XHRcdGdhbGxlcnlVbml0LmRhdGEoJ3RyYWNrLWlkJywgdHJhY2tJZCk7XG5cdFx0XHRnYWxsZXJ5VW5pdC5hcHBlbmQoY292ZXJBcnQsIHRyYWNrTmFtZSwgYXJ0aXN0TmFtZSwgYWxidW1OYW1lKTtcblxuXHRcdFx0JCgnLnNvbmdHYWxsZXJ5JykuYXBwZW5kKGdhbGxlcnlVbml0KTtcblxuXHRcdH0pO1xuXG5cdH0pO1xufVxuXG4vLyA2LiBNYWtlIEFQSSByZXF1ZXN0IHRvIHRyYWNrLmx5cmljcy5nZXQsIFxua2FyYU9LLmdldEx5cmljcyA9IGZ1bmN0aW9uICh0cmFja0lkKSB7XG5cdCQuYWpheCh7XG5cdFx0dXJsOiAnaHR0cDovL2FwaS5tdXNpeG1hdGNoLmNvbS93cy8xLjEvdHJhY2subHlyaWNzLmdldCcsXG5cdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRkYXRhVHlwZTogJ2pzb25wJyxcblx0XHRkYXRhOiB7XG5cdFx0XHRhcGlrZXk6IGthcmFPSy5hcGlrZXksXG5cdFx0XHR0cmFja19pZDogdHJhY2tJZCxcblx0XHRcdGZvcm1hdDogJ2pzb25wJ1xuXHRcdH1cblx0fSkudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuXHRcdGNvbnNvbGUubG9nKHJlc3VsdCk7XG5cdFx0dmFyIGx5cmljcyA9IHJlc3VsdC5tZXNzYWdlLmJvZHkubHlyaWNzLmx5cmljc19ib2R5O1xuXHRcdGNvbnNvbGUubG9nKGx5cmljcyk7XG5cdH0pO1x0XG5cbn1cblxuJChmdW5jdGlvbigpe1xuXHRrYXJhT0suaW5pdCgpO1xufSk7XG5cbiIsIm1vZHVsZS5leHBvcnRzPXtcImJhZHdvcmRzXCIgOiBbXCI0cjVlXCIsXHJcbiBcIjVoMXRcIixcclxuIFwiNWhpdFwiLFxyXG4gXCJhNTVcIixcclxuIFwiYW5hbFwiLFxyXG4gIFwiYW51c1wiLFxyXG4gIFwiYXI1ZVwiLFxyXG4gIFwiYXJyc2VcIixcclxuICBcImFyc2VcIixcclxuICBcImFzc1wiLFxyXG4gIFwiYXNzLWZ1Y2tlclwiLFxyXG4gIFwiYXNzZXNcIixcclxuICBcImFzc2Z1Y2tlclwiLFxyXG4gIFwiYXNzZnVra2FcIixcclxuICBcImFzc2hvbGVcIixcclxuICBcImFzc2hvbGVzXCIsXHJcbiAgXCJhc3N3aG9sZVwiLFxyXG4gIFwiYV9zX3NcIixcclxuICBcImIhdGNoXCIsXHJcbiAgXCJiMDBic1wiLFxyXG4gIFwiYjE3Y2hcIixcclxuICBcImIxdGNoXCIsXHJcbiAgXCJiYWxsYmFnXCIsXHJcbiAgXCJiYWxsc1wiLFxyXG4gIFwiYmFsbHNhY2tcIixcclxuICBcImJhc3RhcmRcIixcclxuICBcImJlYXN0aWFsXCIsXHJcbiAgXCJiZWFzdGlhbGl0eVwiLFxyXG4gIFwiYmVsbGVuZFwiLFxyXG4gIFwiYmVzdGlhbFwiLFxyXG4gIFwiYmVzdGlhbGl0eVwiLFxyXG4gIFwiYmkrY2hcIixcclxuICBcImJpYXRjaFwiLFxyXG4gIFwiYml0Y2hcIixcclxuICBcImJpdGNoZXJcIixcclxuICBcImJpdGNoZXJzXCIsXHJcbiAgXCJiaXRjaGVzXCIsXHJcbiAgXCJiaXRjaGluXCIsXHJcbiAgXCJiaXRjaGluZ1wiLFxyXG4gIFwiYmxvb2R5XCIsXHJcbiAgXCJibG93IGpvYlwiLFxyXG4gIFwiYmxvd2pvYlwiLFxyXG4gIFwiYmxvd2pvYnNcIixcclxuICBcImJvaW9sYXNcIixcclxuICBcImJvbGxvY2tcIixcclxuICBcImJvbGxva1wiLFxyXG4gIFwiYm9uZXJcIixcclxuICBcImJvb2JcIixcclxuICBcImJvb2JzXCIsXHJcbiAgXCJib29vYnNcIixcclxuICBcImJvb29vYnNcIixcclxuICBcImJvb29vb2JzXCIsXHJcbiAgXCJib29vb29vb2JzXCIsXHJcbiAgXCJicmVhc3RzXCIsXHJcbiAgXCJidWNldGFcIixcclxuICBcImJ1Z2dlclwiLFxyXG4gIFwiYnVtXCIsXHJcbiAgXCJidW5ueSBmdWNrZXJcIixcclxuICBcImJ1dHRcIixcclxuICBcImJ1dHRob2xlXCIsXHJcbiAgXCJidXR0bXVjaFwiLFxyXG4gIFwiYnV0dHBsdWdcIixcclxuICBcImMwY2tcIixcclxuICBcImMwY2tzdWNrZXJcIixcclxuICBcImNhcnBldCBtdW5jaGVyXCIsXHJcbiAgXCJjYXdrXCIsXHJcbiAgXCJjaGlua1wiLFxyXG4gIFwiY2lwYVwiLFxyXG4gIFwiY2wxdFwiLFxyXG4gIFwiY2xpdFwiLFxyXG4gIFwiY2xpdG9yaXNcIixcclxuICBcImNsaXRzXCIsXHJcbiAgXCJjbnV0XCIsXHJcbiAgXCJjb2NrXCIsXHJcbiAgXCJjb2NrLXN1Y2tlclwiLFxyXG4gIFwiY29ja2ZhY2VcIixcclxuICBcImNvY2toZWFkXCIsXHJcbiAgXCJjb2NrbXVuY2hcIixcclxuICBcImNvY2ttdW5jaGVyXCIsXHJcbiAgXCJjb2Nrc1wiLFxyXG4gIFwiY29ja3N1Y2tcIixcclxuICBcImNvY2tzdWNrZWRcIixcclxuICBcImNvY2tzdWNrZXJcIixcclxuICBcImNvY2tzdWNraW5nXCIsXHJcbiAgXCJjb2Nrc3Vja3NcIixcclxuICBcImNvY2tzdWthXCIsXHJcbiAgXCJjb2Nrc3Vra2FcIixcclxuICBcImNva1wiLFxyXG4gIFwiY29rbXVuY2hlclwiLFxyXG4gIFwiY29rc3Vja2FcIixcclxuICBcImNvb25cIixcclxuICBcImNveFwiLFxyXG4gIFwiY3JhcFwiLFxyXG4gIFwiY3VtXCIsXHJcbiAgXCJjdW1tZXJcIixcclxuICBcImN1bW1pbmdcIixcclxuICBcImN1bXNcIixcclxuICBcImN1bXNob3RcIixcclxuICBcImN1bmlsaW5ndXNcIixcclxuICBcImN1bmlsbGluZ3VzXCIsXHJcbiAgXCJjdW5uaWxpbmd1c1wiLFxyXG4gIFwiY3VudFwiLFxyXG4gIFwiY3VudGxpY2tcIixcclxuICBcImN1bnRsaWNrZXJcIixcclxuICBcImN1bnRsaWNraW5nXCIsXHJcbiAgXCJjdW50c1wiLFxyXG4gIFwiY3lhbGlzXCIsXHJcbiAgXCJjeWJlcmZ1Y1wiLFxyXG4gIFwiY3liZXJmdWNrXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlZFwiLFxyXG4gIFwiY3liZXJmdWNrZXJcIixcclxuICBcImN5YmVyZnVja2Vyc1wiLFxyXG4gIFwiY3liZXJmdWNraW5nXCIsXHJcbiAgXCJkMWNrXCIsXHJcbiAgXCJkYW1uXCIsXHJcbiAgXCJkaWNrXCIsXHJcbiAgXCJkaWNraGVhZFwiLFxyXG4gIFwiZGlsZG9cIixcclxuICBcImRpbGRvc1wiLFxyXG4gIFwiZGlua1wiLFxyXG4gIFwiZGlua3NcIixcclxuICBcImRpcnNhXCIsXHJcbiAgXCJkbGNrXCIsXHJcbiAgXCJkb2ctZnVja2VyXCIsXHJcbiAgXCJkb2dnaW5cIixcclxuICBcImRvZ2dpbmdcIixcclxuICBcImRvbmtleXJpYmJlclwiLFxyXG4gIFwiZG9vc2hcIixcclxuICBcImR1Y2hlXCIsXHJcbiAgXCJkeWtlXCIsXHJcbiAgXCJlamFjdWxhdGVcIixcclxuICBcImVqYWN1bGF0ZWRcIixcclxuICBcImVqYWN1bGF0ZXNcIixcclxuICBcImVqYWN1bGF0aW5nXCIsXHJcbiAgXCJlamFjdWxhdGluZ3NcIixcclxuICBcImVqYWN1bGF0aW9uXCIsXHJcbiAgXCJlamFrdWxhdGVcIixcclxuICBcImYgdSBjIGtcIixcclxuICBcImYgdSBjIGsgZSByXCIsXHJcbiAgXCJmNG5ueVwiLFxyXG4gIFwiZmFnXCIsXHJcbiAgXCJmYWdnaW5nXCIsXHJcbiAgXCJmYWdnaXR0XCIsXHJcbiAgXCJmYWdnb3RcIixcclxuICBcImZhZ2dzXCIsXHJcbiAgXCJmYWdvdFwiLFxyXG4gIFwiZmFnb3RzXCIsXHJcbiAgXCJmYWdzXCIsXHJcbiAgXCJmYW5ueVwiLFxyXG4gIFwiZmFubnlmbGFwc1wiLFxyXG4gIFwiZmFubnlmdWNrZXJcIixcclxuICBcImZhbnl5XCIsXHJcbiAgXCJmYXRhc3NcIixcclxuICBcImZjdWtcIixcclxuICBcImZjdWtlclwiLFxyXG4gIFwiZmN1a2luZ1wiLFxyXG4gIFwiZmVja1wiLFxyXG4gIFwiZmVja2VyXCIsXHJcbiAgXCJmZWxjaGluZ1wiLFxyXG4gIFwiZmVsbGF0ZVwiLFxyXG4gIFwiZmVsbGF0aW9cIixcclxuICBcImZpbmdlcmZ1Y2tcIixcclxuICBcImZpbmdlcmZ1Y2tlZFwiLFxyXG4gIFwiZmluZ2VyZnVja2VyXCIsXHJcbiAgXCJmaW5nZXJmdWNrZXJzXCIsXHJcbiAgXCJmaW5nZXJmdWNraW5nXCIsXHJcbiAgXCJmaW5nZXJmdWNrc1wiLFxyXG4gIFwiZmlzdGZ1Y2tcIixcclxuICBcImZpc3RmdWNrZWRcIixcclxuICBcImZpc3RmdWNrZXJcIixcclxuICBcImZpc3RmdWNrZXJzXCIsXHJcbiAgXCJmaXN0ZnVja2luZ1wiLFxyXG4gIFwiZmlzdGZ1Y2tpbmdzXCIsXHJcbiAgXCJmaXN0ZnVja3NcIixcclxuICBcImZsYW5nZVwiLFxyXG4gIFwiZm9va1wiLFxyXG4gIFwiZm9va2VyXCIsXHJcbiAgXCJmdWNrXCIsXHJcbiAgXCJmdWNrYVwiLFxyXG4gIFwiZnVja2VkXCIsXHJcbiAgXCJmdWNrZXJcIixcclxuICBcImZ1Y2tlcnNcIixcclxuICBcImZ1Y2toZWFkXCIsXHJcbiAgXCJmdWNraGVhZHNcIixcclxuICBcImZ1Y2tpblwiLFxyXG4gIFwiZnVja2luZ1wiLFxyXG4gIFwiZnVja2luZ3NcIixcclxuICBcImZ1Y2tpbmdzaGl0bW90aGVyZnVja2VyXCIsXHJcbiAgXCJmdWNrbWVcIixcclxuICBcImZ1Y2tzXCIsXHJcbiAgXCJmdWNrd2hpdFwiLFxyXG4gIFwiZnVja3dpdFwiLFxyXG4gIFwiZnVkZ2UgcGFja2VyXCIsXHJcbiAgXCJmdWRnZXBhY2tlclwiLFxyXG4gIFwiZnVrXCIsXHJcbiAgXCJmdWtlclwiLFxyXG4gIFwiZnVra2VyXCIsXHJcbiAgXCJmdWtraW5cIixcclxuICBcImZ1a3NcIixcclxuICBcImZ1a3doaXRcIixcclxuICBcImZ1a3dpdFwiLFxyXG4gIFwiZnV4XCIsXHJcbiAgXCJmdXgwclwiLFxyXG4gIFwiZl91X2Nfa1wiLFxyXG4gIFwiZ2FuZ2JhbmdcIixcclxuICBcImdhbmdiYW5nZWRcIixcclxuICBcImdhbmdiYW5nc1wiLFxyXG4gIFwiZ2F5bG9yZFwiLFxyXG4gIFwiZ2F5c2V4XCIsXHJcbiAgXCJnb2F0c2VcIixcclxuICBcIkdvZFwiLFxyXG4gIFwiZ29kLWRhbVwiLFxyXG4gIFwiZ29kLWRhbW5lZFwiLFxyXG4gIFwiZ29kZGFtblwiLFxyXG4gIFwiZ29kZGFtbmVkXCIsXHJcbiAgXCJoYXJkY29yZXNleFwiLFxyXG4gIFwiaGVsbFwiLFxyXG4gIFwiaGVzaGVcIixcclxuICBcImhvYXJcIixcclxuICBcImhvYXJlXCIsXHJcbiAgXCJob2VyXCIsXHJcbiAgXCJob21vXCIsXHJcbiAgXCJob3JlXCIsXHJcbiAgXCJob3JuaWVzdFwiLFxyXG4gIFwiaG9ybnlcIixcclxuICBcImhvdHNleFwiLFxyXG4gIFwiamFjay1vZmZcIixcclxuICBcImphY2tvZmZcIixcclxuICBcImphcFwiLFxyXG4gIFwiamVyay1vZmZcIixcclxuICBcImppc21cIixcclxuICBcImppelwiLFxyXG4gIFwiaml6bVwiLFxyXG4gIFwiaml6elwiLFxyXG4gIFwia2F3a1wiLFxyXG4gIFwia25vYlwiLFxyXG4gIFwia25vYmVhZFwiLFxyXG4gIFwia25vYmVkXCIsXHJcbiAgXCJrbm9iZW5kXCIsXHJcbiAgXCJrbm9iaGVhZFwiLFxyXG4gIFwia25vYmpvY2t5XCIsXHJcbiAgXCJrbm9iam9rZXlcIixcclxuICBcImtvY2tcIixcclxuICBcImtvbmR1bVwiLFxyXG4gIFwia29uZHVtc1wiLFxyXG4gIFwia3VtXCIsXHJcbiAgXCJrdW1tZXJcIixcclxuICBcImt1bW1pbmdcIixcclxuICBcImt1bXNcIixcclxuICBcImt1bmlsaW5ndXNcIixcclxuICBcImwzaStjaFwiLFxyXG4gIFwibDNpdGNoXCIsXHJcbiAgXCJsYWJpYVwiLFxyXG4gIFwibG1mYW9cIixcclxuICBcImx1c3RcIixcclxuICBcImx1c3RpbmdcIixcclxuICBcIm0wZjBcIixcclxuICBcIm0wZm9cIixcclxuICBcIm00NXRlcmJhdGVcIixcclxuICBcIm1hNXRlcmI4XCIsXHJcbiAgXCJtYTV0ZXJiYXRlXCIsXHJcbiAgXCJtYXNvY2hpc3RcIixcclxuICBcIm1hc3Rlci1iYXRlXCIsXHJcbiAgXCJtYXN0ZXJiOFwiLFxyXG4gIFwibWFzdGVyYmF0KlwiLFxyXG4gIFwibWFzdGVyYmF0M1wiLFxyXG4gIFwibWFzdGVyYmF0ZVwiLFxyXG4gIFwibWFzdGVyYmF0aW9uXCIsXHJcbiAgXCJtYXN0ZXJiYXRpb25zXCIsXHJcbiAgXCJtYXN0dXJiYXRlXCIsXHJcbiAgXCJtby1mb1wiLFxyXG4gIFwibW9mMFwiLFxyXG4gIFwibW9mb1wiLFxyXG4gIFwibW90aGFmdWNrXCIsXHJcbiAgXCJtb3RoYWZ1Y2thXCIsXHJcbiAgXCJtb3RoYWZ1Y2thc1wiLFxyXG4gIFwibW90aGFmdWNrYXpcIixcclxuICBcIm1vdGhhZnVja2VkXCIsXHJcbiAgXCJtb3RoYWZ1Y2tlclwiLFxyXG4gIFwibW90aGFmdWNrZXJzXCIsXHJcbiAgXCJtb3RoYWZ1Y2tpblwiLFxyXG4gIFwibW90aGFmdWNraW5nXCIsXHJcbiAgXCJtb3RoYWZ1Y2tpbmdzXCIsXHJcbiAgXCJtb3RoYWZ1Y2tzXCIsXHJcbiAgXCJtb3RoZXIgZnVja2VyXCIsXHJcbiAgXCJtb3RoZXJmdWNrXCIsXHJcbiAgXCJtb3RoZXJmdWNrZWRcIixcclxuICBcIm1vdGhlcmZ1Y2tlclwiLFxyXG4gIFwibW90aGVyZnVja2Vyc1wiLFxyXG4gIFwibW90aGVyZnVja2luXCIsXHJcbiAgXCJtb3RoZXJmdWNraW5nXCIsXHJcbiAgXCJtb3RoZXJmdWNraW5nc1wiLFxyXG4gIFwibW90aGVyZnVja2thXCIsXHJcbiAgXCJtb3RoZXJmdWNrc1wiLFxyXG4gIFwibXVmZlwiLFxyXG4gIFwibXV0aGFcIixcclxuICBcIm11dGhhZmVja2VyXCIsXHJcbiAgXCJtdXRoYWZ1Y2trZXJcIixcclxuICBcIm11dGhlclwiLFxyXG4gIFwibXV0aGVyZnVja2VyXCIsXHJcbiAgXCJuMWdnYVwiLFxyXG4gIFwibjFnZ2VyXCIsXHJcbiAgXCJuYXppXCIsXHJcbiAgXCJuaWdnM3JcIixcclxuICBcIm5pZ2c0aFwiLFxyXG4gIFwibmlnZ2FcIixcclxuICBcIm5pZ2dhaFwiLFxyXG4gIFwibmlnZ2FzXCIsXHJcbiAgXCJuaWdnYXpcIixcclxuICBcIm5pZ2dlclwiLFxyXG4gIFwibmlnZ2Vyc1wiLFxyXG4gIFwibm9iXCIsXHJcbiAgXCJub2Igam9rZXlcIixcclxuICBcIm5vYmhlYWRcIixcclxuICBcIm5vYmpvY2t5XCIsXHJcbiAgXCJub2Jqb2tleVwiLFxyXG4gIFwibnVtYm51dHNcIixcclxuICBcIm51dHNhY2tcIixcclxuICBcIm9yZ2FzaW1cIixcclxuICBcIm9yZ2FzaW1zXCIsXHJcbiAgXCJvcmdhc21cIixcclxuICBcIm9yZ2FzbXNcIixcclxuICBcInAwcm5cIixcclxuICBcInBhd25cIixcclxuICBcInBlY2tlclwiLFxyXG4gIFwicGVuaXNcIixcclxuICBcInBlbmlzZnVja2VyXCIsXHJcbiAgXCJwaG9uZXNleFwiLFxyXG4gIFwicGh1Y2tcIixcclxuICBcInBodWtcIixcclxuICBcInBodWtlZFwiLFxyXG4gIFwicGh1a2luZ1wiLFxyXG4gIFwicGh1a2tlZFwiLFxyXG4gIFwicGh1a2tpbmdcIixcclxuICBcInBodWtzXCIsXHJcbiAgXCJwaHVxXCIsXHJcbiAgXCJwaWdmdWNrZXJcIixcclxuICBcInBpbXBpc1wiLFxyXG4gIFwicGlzc1wiLFxyXG4gIFwicGlzc2VkXCIsXHJcbiAgXCJwaXNzZXJcIixcclxuICBcInBpc3NlcnNcIixcclxuICBcInBpc3Nlc1wiLFxyXG4gIFwicGlzc2ZsYXBzXCIsXHJcbiAgXCJwaXNzaW5cIixcclxuICBcInBpc3NpbmdcIixcclxuICBcInBpc3NvZmZcIixcclxuICBcInBvb3BcIixcclxuICBcInBvcm5cIixcclxuICBcInBvcm5vXCIsXHJcbiAgXCJwb3Jub2dyYXBoeVwiLFxyXG4gIFwicG9ybm9zXCIsXHJcbiAgXCJwcmlja1wiLFxyXG4gIFwicHJpY2tzXCIsXHJcbiAgXCJwcm9uXCIsXHJcbiAgXCJwdWJlXCIsXHJcbiAgXCJwdXNzZVwiLFxyXG4gIFwicHVzc2lcIixcclxuICBcInB1c3NpZXNcIixcclxuICBcInB1c3N5XCIsXHJcbiAgXCJwdXNzeXNcIixcclxuICBcInJlY3R1bVwiLFxyXG4gIFwicmV0YXJkXCIsXHJcbiAgXCJyaW1qYXdcIixcclxuICBcInJpbW1pbmdcIixcclxuICBcInMgaGl0XCIsXHJcbiAgXCJzLm8uYi5cIixcclxuICBcInNhZGlzdFwiLFxyXG4gIFwic2NobG9uZ1wiLFxyXG4gIFwic2NyZXdpbmdcIixcclxuICBcInNjcm9hdFwiLFxyXG4gIFwic2Nyb3RlXCIsXHJcbiAgXCJzY3JvdHVtXCIsXHJcbiAgXCJzZW1lblwiLFxyXG4gIFwic2V4XCIsXHJcbiAgXCJzaCErXCIsXHJcbiAgXCJzaCF0XCIsXHJcbiAgXCJzaDF0XCIsXHJcbiAgXCJzaGFnXCIsXHJcbiAgXCJzaGFnZ2VyXCIsXHJcbiAgXCJzaGFnZ2luXCIsXHJcbiAgXCJzaGFnZ2luZ1wiLFxyXG4gIFwic2hlbWFsZVwiLFxyXG4gIFwic2hpK1wiLFxyXG4gIFwic2hpdFwiLFxyXG4gIFwic2hpdGRpY2tcIixcclxuICBcInNoaXRlXCIsXHJcbiAgXCJzaGl0ZWRcIixcclxuICBcInNoaXRleVwiLFxyXG4gIFwic2hpdGZ1Y2tcIixcclxuICBcInNoaXRmdWxsXCIsXHJcbiAgXCJzaGl0aGVhZFwiLFxyXG4gIFwic2hpdGluZ1wiLFxyXG4gIFwic2hpdGluZ3NcIixcclxuICBcInNoaXRzXCIsXHJcbiAgXCJzaGl0dGVkXCIsXHJcbiAgXCJzaGl0dGVyXCIsXHJcbiAgXCJzaGl0dGVyc1wiLFxyXG4gIFwic2hpdHRpbmdcIixcclxuICBcInNoaXR0aW5nc1wiLFxyXG4gIFwic2hpdHR5XCIsXHJcbiAgXCJza2Fua1wiLFxyXG4gIFwic2x1dFwiLFxyXG4gIFwic2x1dHNcIixcclxuICBcInNtZWdtYVwiLFxyXG4gIFwic211dFwiLFxyXG4gIFwic25hdGNoXCIsXHJcbiAgXCJzb24tb2YtYS1iaXRjaFwiLFxyXG4gIFwic3BhY1wiLFxyXG4gIFwic3B1bmtcIixcclxuICBcInNfaF9pX3RcIixcclxuICBcInQxdHQxZTVcIixcclxuICBcInQxdHRpZXNcIixcclxuICBcInRlZXRzXCIsXHJcbiAgXCJ0ZWV6XCIsXHJcbiAgXCJ0ZXN0aWNhbFwiLFxyXG4gIFwidGVzdGljbGVcIixcclxuICBcInRpdFwiLFxyXG4gIFwidGl0ZnVja1wiLFxyXG4gIFwidGl0c1wiLFxyXG4gIFwidGl0dFwiLFxyXG4gIFwidGl0dGllNVwiLFxyXG4gIFwidGl0dGllZnVja2VyXCIsXHJcbiAgXCJ0aXR0aWVzXCIsXHJcbiAgXCJ0aXR0eWZ1Y2tcIixcclxuICBcInRpdHR5d2Fua1wiLFxyXG4gIFwidGl0d2Fua1wiLFxyXG4gIFwidG9zc2VyXCIsXHJcbiAgXCJ0dXJkXCIsXHJcbiAgXCJ0dzR0XCIsXHJcbiAgXCJ0d2F0XCIsXHJcbiAgXCJ0d2F0aGVhZFwiLFxyXG4gIFwidHdhdHR5XCIsXHJcbiAgXCJ0d3VudFwiLFxyXG4gIFwidHd1bnRlclwiLFxyXG4gIFwidjE0Z3JhXCIsXHJcbiAgXCJ2MWdyYVwiLFxyXG4gIFwidmFnaW5hXCIsXHJcbiAgXCJ2aWFncmFcIixcclxuICBcInZ1bHZhXCIsXHJcbiAgXCJ3MDBzZVwiLFxyXG4gIFwid2FuZ1wiLFxyXG4gIFwid2Fua1wiLFxyXG4gIFwid2Fua2VyXCIsXHJcbiAgXCJ3YW5reVwiLFxyXG4gIFwid2hvYXJcIixcclxuICBcIndob3JlXCIsXHJcbiAgXCJ3aWxsaWVzXCIsXHJcbiAgXCJ3aWxseVwiLFxyXG4gIFwieHJhdGVkXCIsXHJcbiAgXCJ4eHhcIlxyXG5dfSIsInZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbnZhciBiYWR3b3JkcyA9IHJlcXVpcmUoJy4vYmFkd29yZHMuanNvbicpLmJhZHdvcmRzO1xyXG52YXIgVGV4dEZpbmRlciA9IHJlcXVpcmUoJy4vdGV4dGZpbmRlcicpO1xyXG5cclxuLy8gQ29uc3RydWN0b3JcclxuZnVuY3Rpb24gQmFkTGFuZ3VhZ2VGaWx0ZXIoKSB7XHJcblx0dGhpcy50ZXh0ZmluZGVyID0gbmV3IFRleHRGaW5kZXIoYmFkd29yZHMpO1xyXG59XHJcblxyXG4vLyBDaGVjayBpZiBhbnkgYmFkIHdvcmRzIGlzIGNvbnRhaW5lZCBpbiBjb250ZW50XHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuXHRyZXR1cm4gdGhpcy50ZXh0ZmluZGVyLmNvbnRhaW5zKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gQ2hlY2sgaWYgYW55IGJhZCB3b3JkcyBpcyBjb250YWluZWQgaW4gY29udGVudCBhbmQgcmV0dXJucyBhcnJheSBvZiB3b3Jkc1xyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiB0aGlzLnRleHRmaW5kZXIubWF0Y2hlcyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIFJlbW92ZSBiYWQgd29yZHMgZnJvbSBjb250ZW50XHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5yZW1vdmVXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiB0aGlzLnRleHRmaW5kZXIucmVtb3ZlV29yZHMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBSZXBsYWNlIGJhZCB3b3JkcyBmcm9tIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLnJlcGxhY2VXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIHJlcGxhY2VzdHIpIHtcclxuICAgIHJldHVybiB0aGlzLnRleHRmaW5kZXIucmVwbGFjZVdvcmRzKGNvbnRlbnQsIHJlcGxhY2VzdHIpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYWRMYW5ndWFnZUZpbHRlcjsiLCIvLyBDb25zdHJ1Y3RvclxyXG5mdW5jdGlvbiBUZXh0RmluZGVyKHdvcmRMaXN0KSB7XHJcbiAgdGhpcy53b3JkbGlzdCA9IHdvcmRMaXN0O1xyXG4gIHRoaXMuc2VhcmNoc3RyaW5nID0gbmV3IFJlZ0V4cCh3b3JkTGlzdC5qb2luKFwiIHxcIikucmVwbGFjZSgvW15cXHdcXHNefF0vZ2ksICcnKSwgJ2knKTtcclxuICB0aGlzLmdsb2JhbHNlYXJjaHN0cmluZyA9IG5ldyBSZWdFeHAod29yZExpc3Quam9pbihcIiB8XCIpLnJlcGxhY2UoL1teXFx3XFxzXnxdL2dpLCAnJyksICdnaScpO1xyXG5cclxufVxyXG4vLyBjbGFzcyBtZXRob2RzXHJcblRleHRGaW5kZXIucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGVudCkge1xyXG5cdHJldHVybiB0aGlzLnNlYXJjaHN0cmluZy50ZXN0KGNvbnRlbnQpO1xyXG59O1xyXG5cclxuVGV4dEZpbmRlci5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiBjb250ZW50Lm1hdGNoKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nKTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLnJlbW92ZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSh0aGlzLmdsb2JhbHNlYXJjaHN0cmluZywgJycpO1xyXG59O1xyXG5cclxuVGV4dEZpbmRlci5wcm90b3R5cGUucmVwbGFjZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCwgcmVwbGFjZXN0cikge1xyXG4gICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSh0aGlzLmdsb2JhbHNlYXJjaHN0cmluZywgcmVwbGFjZXN0cik7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0RmluZGVyOyIsIiJdfQ==
