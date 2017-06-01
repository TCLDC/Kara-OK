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
		console.log(result);
		var lyrics = result.message.body.lyrics.lyrics_body;
		console.log(lyrics);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLFNBQVMsRUFBYjs7QUFFQSxPQUFPLE1BQVAsR0FBZ0Isa0NBQWhCOztBQUVFOztBQUVGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFRTs7QUFFRixPQUFPLElBQVAsR0FBYyxZQUFXO0FBQ3hCLFFBQU8sYUFBUDtBQUNBLFFBQU8sUUFBUDtBQUNBLENBSEQ7O0FBS0EsT0FBTyxRQUFQLEdBQWtCLFlBQVc7QUFDNUIsR0FBRSxXQUFGLEVBQWUsUUFBZjtBQUNBLENBRkQ7O0FBSUEsT0FBTyxhQUFQLEdBQXVCLFlBQVk7O0FBRWxDO0FBQ0EsR0FBRSxNQUFGLEVBQVUsRUFBVixDQUFhLFFBQWIsRUFBdUIsVUFBUyxLQUFULEVBQWdCOztBQUV0QyxRQUFNLGNBQU47QUFDQSxNQUFJLGdCQUFnQixFQUFFLFlBQUYsRUFBZ0IsR0FBaEIsRUFBcEI7QUFDQSxNQUFJLGlCQUFpQixFQUFFLGFBQUYsRUFBaUIsR0FBakIsRUFBckI7QUFDQSxNQUFJLGlCQUFpQixFQUFFLGFBQUYsRUFBaUIsR0FBakIsRUFBckI7O0FBRUEsU0FBTyxXQUFQLENBQW1CLGFBQW5CLEVBQWtDLGNBQWxDLEVBQWtELGNBQWxEOztBQUVBLFVBQVEsR0FBUixDQUFZLGNBQVo7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBCYWRMYW5ndWFnZUZpbHRlciBmcm9tICdiYWQtbGFuZ3VhZ2UtZmlsdGVyJztcblxuLy8gNy4gVXNlIGphdmFzY3JpcHQgZmlsdGVyIHRvIHNjYW4gdGhlIGx5cmljcyBmb3IgcHJvZmFuaXR5LlxuLy8gOC4gSUYgdGhlcmUgaXMgcHJvZmFuaXR5IGRpc3BsYXkgcmVkICsgZmVlZGJhY2tcbi8vIDkuIElGIEVMU0UgZGlzcGxheSBncmVlbiArIGZlZWRiYWNrXG4vLyAxMC4gQWxsb3cgdXNlciB0byBzYXZlIHNvbmcgdG8gcGxheWxpc3RcblxudmFyIGthcmFPSyA9IHt9O1xuXG5rYXJhT0suYXBpa2V5ID0gJzEyYjI3YTgyOWNhZjVjMmZiYzE1NzUxYzVhMTYwOWQxJztcblxuXHRcdC8vIDw9PT09PT09PT0gRklMVEVSIEJBRCBXT1JEUyA9PT09PT09PT09PlxuXG4vLyB2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuLy8gdmFyIGJhZHdvcmRzID0gcmVxdWlyZSgnLi9iYWR3b3Jkcy5qc29uJykuYmFkd29yZHM7XG4vLyB2YXIgVGV4dEZpbmRlciA9IHJlcXVpcmUoJy4vdGV4dGZpbmRlcicpO1xuXG4vLyAvLyBDb25zdHJ1Y3RvclxuLy8gZnVuY3Rpb24gQmFkTGFuZ3VhZ2VGaWx0ZXIoKSB7XG4vLyBcdHRoaXMudGV4dGZpbmRlciA9IG5ldyBUZXh0RmluZGVyKGJhZHdvcmRzKTtcbi8vIH1cblxuLy8gLy8gQ2hlY2sgaWYgYW55IGJhZCB3b3JkcyBpcyBjb250YWluZWQgaW4gY29udGVudFxuLy8gQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGVudCkge1xuLy8gXHRyZXR1cm4gdGhpcy50ZXh0ZmluZGVyLmNvbnRhaW5zKGNvbnRlbnQpO1xuLy8gfTtcblxuXHRcdC8vIDw9PT09PT09PT0gRklMVEVSIEJBRCBXT1JEUyA9PT09PT09PT09PlxuXG5rYXJhT0suaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHRrYXJhT0suZXZlbnRIYW5kbGVycygpO1xuXHRrYXJhT0suZnVsbFBhZ2UoKTtcbn1cblxua2FyYU9LLmZ1bGxQYWdlID0gZnVuY3Rpb24oKSB7XG5cdCQoJyNmdWxscGFnZScpLmZ1bGxwYWdlKCk7XG59XG5cbmthcmFPSy5ldmVudEhhbmRsZXJzID0gZnVuY3Rpb24gKCkge1xuXG5cdC8vIDEuIFJlY2VpdmUgdXNlciBpbnB1dC5cblx0JCgnZm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgdXNlclRyYWNrTmFtZSA9ICQoJy50cmFja05hbWUnKS52YWwoKTtcblx0XHR2YXIgdXNlckFydGlzdE5hbWUgPSAkKCcuYXJ0aXN0TmFtZScpLnZhbCgpO1xuXHRcdHZhciB1c2VyTHlyaWNzTmFtZSA9ICQoJy5seXJpY3NOYW1lJykudmFsKCk7XG5cblx0XHRrYXJhT0suZ2V0U29uZ0luZm8odXNlclRyYWNrTmFtZSwgdXNlckFydGlzdE5hbWUsIHVzZXJMeXJpY3NOYW1lKTtcblxuXHRcdGNvbnNvbGUubG9nKHVzZXJBcnRpc3ROYW1lKTtcblx0fSk7XG5cblx0Ly8gNS4gUmVjZWl2ZSB1c2VyIHNlbGVjdGlvbi5cblx0JCgnLnNvbmdHYWxsZXJ5Jykub24oJ2NsaWNrJywgJy5nYWxsZXJ5VW5pdCcsIGZ1bmN0aW9uICgpe1xuXG5cdFx0dmFyIHRyYWNrSUQgPSAkKHRoaXMpLmRhdGEoJ3RyYWNrLWlkJyk7XG5cdFx0a2FyYU9LLmdldEx5cmljcyh0cmFja0lEKTtcblxuXHR9KVxuXG59XG5cbi8vIDIuIFVzZSB1c2VyIGlucHV0IHRvIG1ha2UgQVBJIHJlcXVlc3QvQUpBWCByZXF1ZXN0LlxuLy8gMy4gRmlsdGVyIHRoZSByZXN1bHRzIChpZSBzZWFyY2ggYnkgbHlyaWNzIG9ubHksIGxhbmd1YWdlLCBmb3JtYXQgZXRjKVxua2FyYU9LLmdldFNvbmdJbmZvID0gZnVuY3Rpb24gKHRyYWNrLCBhcnRpc3QsIGx5cmljcykge1xuXHQkLmFqYXgoe1xuXHRcdHVybDogJ2h0dHA6Ly9hcGkubXVzaXhtYXRjaC5jb20vd3MvMS4xL3RyYWNrLnNlYXJjaCcsXG5cdFx0bWV0aG9kOiAnR0VUJyxcblx0XHRkYXRhVHlwZTogJ2pzb25wJyxcblx0XHRkYXRhOiB7XG5cdFx0XHRhcGlrZXk6IGthcmFPSy5hcGlrZXksXG5cdFx0XHRxX3RyYWNrOiB0cmFjayxcblx0XHRcdHFfYXJ0aXN0OiBhcnRpc3QsXG5cdFx0XHRxX2x5cmljczogbHlyaWNzLFxuXHRcdFx0Zl9oYXNfbHlyaWNzOiAnJyxcblx0XHRcdGZfbHlyaWNzX2xhbmd1YWdlOiAnZW4nLFxuXHRcdFx0Zm9ybWF0OiAnanNvbnAnLFxuXHRcdFx0cGFnZV9zaXplOiAxMDBcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCl7XG5cdFx0Ly8gNC4gRGlzcGxheSBBUEkgcmVxdWVzdCByZXN1bHRzIG9uIHNjcmVlblxuXHRcdC8vIFx0KHRyYWNrX2lkLCB0cmFja19uYW1lLCBleHBsaWNpdCwgYWxidW1fbmFtZSwgYXJ0aXN0X25hbWUsIGFsYnVtX2NvdmVyYXJ0XzEwMHgxMDAsIHRyYWNrX3NoYXJlX3VybClcblx0XHR2YXIgdHJhY2tMaXN0ID0gcmVzdWx0Lm1lc3NhZ2UuYm9keS50cmFja19saXN0XG5cblx0XHR0cmFja0xpc3QuZm9yRWFjaChmdW5jdGlvbih0cmFjaykge1xuXG5cdFx0XHR2YXIgZ2FsbGVyeVVuaXQgPSAkKCc8bGk+JykuYWRkQ2xhc3MoJ2dhbGxlcnlVbml0Jyk7XG5cblx0XHRcdHZhciBjb3ZlckFydCA9ICQoJzxpbWc+JykuYXR0cignc3JjJywgdHJhY2sudHJhY2suYWxidW1fY292ZXJhcnRfMTAweDEwMCk7XG5cdFx0XHR2YXIgYWxidW1OYW1lID0gJCgnPGgzPicpLnRleHQodHJhY2sudHJhY2suYWxidW1fbmFtZSk7XG5cdFx0XHR2YXIgYXJ0aXN0TmFtZSA9ICQoJzxoMz4nKS50ZXh0KHRyYWNrLnRyYWNrLmFydGlzdF9uYW1lKTtcblx0XHRcdHZhciB0cmFja05hbWUgPSAkKCc8aDI+JykudGV4dCh0cmFjay50cmFjay50cmFja19uYW1lKTtcblxuXHRcdFx0dmFyIHRyYWNrSWQgPSB0cmFjay50cmFjay50cmFja19pZDtcblxuXHRcdFx0Z2FsbGVyeVVuaXQuZGF0YSgndHJhY2staWQnLCB0cmFja0lkKTtcblx0XHRcdGdhbGxlcnlVbml0LmFwcGVuZChjb3ZlckFydCwgdHJhY2tOYW1lLCBhcnRpc3ROYW1lLCBhbGJ1bU5hbWUpO1xuXG5cdFx0XHQkKCcuc29uZ0dhbGxlcnknKS5hcHBlbmQoZ2FsbGVyeVVuaXQpO1xuXG5cdFx0fSk7XG5cblx0fSk7XG59XG5cbi8vIDYuIE1ha2UgQVBJIHJlcXVlc3QgdG8gdHJhY2subHlyaWNzLmdldCwgXG5rYXJhT0suZ2V0THlyaWNzID0gZnVuY3Rpb24gKHRyYWNrSWQpIHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwOi8vYXBpLm11c2l4bWF0Y2guY29tL3dzLzEuMS90cmFjay5seXJpY3MuZ2V0Jyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFwaWtleToga2FyYU9LLmFwaWtleSxcblx0XHRcdHRyYWNrX2lkOiB0cmFja0lkLFxuXHRcdFx0Zm9ybWF0OiAnanNvbnAnXG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG5cdFx0Y29uc29sZS5sb2cocmVzdWx0KTtcblx0XHR2YXIgbHlyaWNzID0gcmVzdWx0Lm1lc3NhZ2UuYm9keS5seXJpY3MubHlyaWNzX2JvZHk7XG5cdFx0Y29uc29sZS5sb2cobHlyaWNzKTtcblx0fSk7XHRcblxufVxuXG4kKGZ1bmN0aW9uKCl7XG5cdGthcmFPSy5pbml0KCk7XG59KTtcblxuIiwibW9kdWxlLmV4cG9ydHM9e1wiYmFkd29yZHNcIiA6IFtcIjRyNWVcIixcclxuIFwiNWgxdFwiLFxyXG4gXCI1aGl0XCIsXHJcbiBcImE1NVwiLFxyXG4gXCJhbmFsXCIsXHJcbiAgXCJhbnVzXCIsXHJcbiAgXCJhcjVlXCIsXHJcbiAgXCJhcnJzZVwiLFxyXG4gIFwiYXJzZVwiLFxyXG4gIFwiYXNzXCIsXHJcbiAgXCJhc3MtZnVja2VyXCIsXHJcbiAgXCJhc3Nlc1wiLFxyXG4gIFwiYXNzZnVja2VyXCIsXHJcbiAgXCJhc3NmdWtrYVwiLFxyXG4gIFwiYXNzaG9sZVwiLFxyXG4gIFwiYXNzaG9sZXNcIixcclxuICBcImFzc3dob2xlXCIsXHJcbiAgXCJhX3Nfc1wiLFxyXG4gIFwiYiF0Y2hcIixcclxuICBcImIwMGJzXCIsXHJcbiAgXCJiMTdjaFwiLFxyXG4gIFwiYjF0Y2hcIixcclxuICBcImJhbGxiYWdcIixcclxuICBcImJhbGxzXCIsXHJcbiAgXCJiYWxsc2Fja1wiLFxyXG4gIFwiYmFzdGFyZFwiLFxyXG4gIFwiYmVhc3RpYWxcIixcclxuICBcImJlYXN0aWFsaXR5XCIsXHJcbiAgXCJiZWxsZW5kXCIsXHJcbiAgXCJiZXN0aWFsXCIsXHJcbiAgXCJiZXN0aWFsaXR5XCIsXHJcbiAgXCJiaStjaFwiLFxyXG4gIFwiYmlhdGNoXCIsXHJcbiAgXCJiaXRjaFwiLFxyXG4gIFwiYml0Y2hlclwiLFxyXG4gIFwiYml0Y2hlcnNcIixcclxuICBcImJpdGNoZXNcIixcclxuICBcImJpdGNoaW5cIixcclxuICBcImJpdGNoaW5nXCIsXHJcbiAgXCJibG9vZHlcIixcclxuICBcImJsb3cgam9iXCIsXHJcbiAgXCJibG93am9iXCIsXHJcbiAgXCJibG93am9ic1wiLFxyXG4gIFwiYm9pb2xhc1wiLFxyXG4gIFwiYm9sbG9ja1wiLFxyXG4gIFwiYm9sbG9rXCIsXHJcbiAgXCJib25lclwiLFxyXG4gIFwiYm9vYlwiLFxyXG4gIFwiYm9vYnNcIixcclxuICBcImJvb29ic1wiLFxyXG4gIFwiYm9vb29ic1wiLFxyXG4gIFwiYm9vb29vYnNcIixcclxuICBcImJvb29vb29vYnNcIixcclxuICBcImJyZWFzdHNcIixcclxuICBcImJ1Y2V0YVwiLFxyXG4gIFwiYnVnZ2VyXCIsXHJcbiAgXCJidW1cIixcclxuICBcImJ1bm55IGZ1Y2tlclwiLFxyXG4gIFwiYnV0dFwiLFxyXG4gIFwiYnV0dGhvbGVcIixcclxuICBcImJ1dHRtdWNoXCIsXHJcbiAgXCJidXR0cGx1Z1wiLFxyXG4gIFwiYzBja1wiLFxyXG4gIFwiYzBja3N1Y2tlclwiLFxyXG4gIFwiY2FycGV0IG11bmNoZXJcIixcclxuICBcImNhd2tcIixcclxuICBcImNoaW5rXCIsXHJcbiAgXCJjaXBhXCIsXHJcbiAgXCJjbDF0XCIsXHJcbiAgXCJjbGl0XCIsXHJcbiAgXCJjbGl0b3Jpc1wiLFxyXG4gIFwiY2xpdHNcIixcclxuICBcImNudXRcIixcclxuICBcImNvY2tcIixcclxuICBcImNvY2stc3Vja2VyXCIsXHJcbiAgXCJjb2NrZmFjZVwiLFxyXG4gIFwiY29ja2hlYWRcIixcclxuICBcImNvY2ttdW5jaFwiLFxyXG4gIFwiY29ja211bmNoZXJcIixcclxuICBcImNvY2tzXCIsXHJcbiAgXCJjb2Nrc3Vja1wiLFxyXG4gIFwiY29ja3N1Y2tlZFwiLFxyXG4gIFwiY29ja3N1Y2tlclwiLFxyXG4gIFwiY29ja3N1Y2tpbmdcIixcclxuICBcImNvY2tzdWNrc1wiLFxyXG4gIFwiY29ja3N1a2FcIixcclxuICBcImNvY2tzdWtrYVwiLFxyXG4gIFwiY29rXCIsXHJcbiAgXCJjb2ttdW5jaGVyXCIsXHJcbiAgXCJjb2tzdWNrYVwiLFxyXG4gIFwiY29vblwiLFxyXG4gIFwiY294XCIsXHJcbiAgXCJjcmFwXCIsXHJcbiAgXCJjdW1cIixcclxuICBcImN1bW1lclwiLFxyXG4gIFwiY3VtbWluZ1wiLFxyXG4gIFwiY3Vtc1wiLFxyXG4gIFwiY3Vtc2hvdFwiLFxyXG4gIFwiY3VuaWxpbmd1c1wiLFxyXG4gIFwiY3VuaWxsaW5ndXNcIixcclxuICBcImN1bm5pbGluZ3VzXCIsXHJcbiAgXCJjdW50XCIsXHJcbiAgXCJjdW50bGlja1wiLFxyXG4gIFwiY3VudGxpY2tlclwiLFxyXG4gIFwiY3VudGxpY2tpbmdcIixcclxuICBcImN1bnRzXCIsXHJcbiAgXCJjeWFsaXNcIixcclxuICBcImN5YmVyZnVjXCIsXHJcbiAgXCJjeWJlcmZ1Y2tcIixcclxuICBcImN5YmVyZnVja2VkXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlclwiLFxyXG4gIFwiY3liZXJmdWNrZXJzXCIsXHJcbiAgXCJjeWJlcmZ1Y2tpbmdcIixcclxuICBcImQxY2tcIixcclxuICBcImRhbW5cIixcclxuICBcImRpY2tcIixcclxuICBcImRpY2toZWFkXCIsXHJcbiAgXCJkaWxkb1wiLFxyXG4gIFwiZGlsZG9zXCIsXHJcbiAgXCJkaW5rXCIsXHJcbiAgXCJkaW5rc1wiLFxyXG4gIFwiZGlyc2FcIixcclxuICBcImRsY2tcIixcclxuICBcImRvZy1mdWNrZXJcIixcclxuICBcImRvZ2dpblwiLFxyXG4gIFwiZG9nZ2luZ1wiLFxyXG4gIFwiZG9ua2V5cmliYmVyXCIsXHJcbiAgXCJkb29zaFwiLFxyXG4gIFwiZHVjaGVcIixcclxuICBcImR5a2VcIixcclxuICBcImVqYWN1bGF0ZVwiLFxyXG4gIFwiZWphY3VsYXRlZFwiLFxyXG4gIFwiZWphY3VsYXRlc1wiLFxyXG4gIFwiZWphY3VsYXRpbmdcIixcclxuICBcImVqYWN1bGF0aW5nc1wiLFxyXG4gIFwiZWphY3VsYXRpb25cIixcclxuICBcImVqYWt1bGF0ZVwiLFxyXG4gIFwiZiB1IGMga1wiLFxyXG4gIFwiZiB1IGMgayBlIHJcIixcclxuICBcImY0bm55XCIsXHJcbiAgXCJmYWdcIixcclxuICBcImZhZ2dpbmdcIixcclxuICBcImZhZ2dpdHRcIixcclxuICBcImZhZ2dvdFwiLFxyXG4gIFwiZmFnZ3NcIixcclxuICBcImZhZ290XCIsXHJcbiAgXCJmYWdvdHNcIixcclxuICBcImZhZ3NcIixcclxuICBcImZhbm55XCIsXHJcbiAgXCJmYW5ueWZsYXBzXCIsXHJcbiAgXCJmYW5ueWZ1Y2tlclwiLFxyXG4gIFwiZmFueXlcIixcclxuICBcImZhdGFzc1wiLFxyXG4gIFwiZmN1a1wiLFxyXG4gIFwiZmN1a2VyXCIsXHJcbiAgXCJmY3VraW5nXCIsXHJcbiAgXCJmZWNrXCIsXHJcbiAgXCJmZWNrZXJcIixcclxuICBcImZlbGNoaW5nXCIsXHJcbiAgXCJmZWxsYXRlXCIsXHJcbiAgXCJmZWxsYXRpb1wiLFxyXG4gIFwiZmluZ2VyZnVja1wiLFxyXG4gIFwiZmluZ2VyZnVja2VkXCIsXHJcbiAgXCJmaW5nZXJmdWNrZXJcIixcclxuICBcImZpbmdlcmZ1Y2tlcnNcIixcclxuICBcImZpbmdlcmZ1Y2tpbmdcIixcclxuICBcImZpbmdlcmZ1Y2tzXCIsXHJcbiAgXCJmaXN0ZnVja1wiLFxyXG4gIFwiZmlzdGZ1Y2tlZFwiLFxyXG4gIFwiZmlzdGZ1Y2tlclwiLFxyXG4gIFwiZmlzdGZ1Y2tlcnNcIixcclxuICBcImZpc3RmdWNraW5nXCIsXHJcbiAgXCJmaXN0ZnVja2luZ3NcIixcclxuICBcImZpc3RmdWNrc1wiLFxyXG4gIFwiZmxhbmdlXCIsXHJcbiAgXCJmb29rXCIsXHJcbiAgXCJmb29rZXJcIixcclxuICBcImZ1Y2tcIixcclxuICBcImZ1Y2thXCIsXHJcbiAgXCJmdWNrZWRcIixcclxuICBcImZ1Y2tlclwiLFxyXG4gIFwiZnVja2Vyc1wiLFxyXG4gIFwiZnVja2hlYWRcIixcclxuICBcImZ1Y2toZWFkc1wiLFxyXG4gIFwiZnVja2luXCIsXHJcbiAgXCJmdWNraW5nXCIsXHJcbiAgXCJmdWNraW5nc1wiLFxyXG4gIFwiZnVja2luZ3NoaXRtb3RoZXJmdWNrZXJcIixcclxuICBcImZ1Y2ttZVwiLFxyXG4gIFwiZnVja3NcIixcclxuICBcImZ1Y2t3aGl0XCIsXHJcbiAgXCJmdWNrd2l0XCIsXHJcbiAgXCJmdWRnZSBwYWNrZXJcIixcclxuICBcImZ1ZGdlcGFja2VyXCIsXHJcbiAgXCJmdWtcIixcclxuICBcImZ1a2VyXCIsXHJcbiAgXCJmdWtrZXJcIixcclxuICBcImZ1a2tpblwiLFxyXG4gIFwiZnVrc1wiLFxyXG4gIFwiZnVrd2hpdFwiLFxyXG4gIFwiZnVrd2l0XCIsXHJcbiAgXCJmdXhcIixcclxuICBcImZ1eDByXCIsXHJcbiAgXCJmX3VfY19rXCIsXHJcbiAgXCJnYW5nYmFuZ1wiLFxyXG4gIFwiZ2FuZ2JhbmdlZFwiLFxyXG4gIFwiZ2FuZ2JhbmdzXCIsXHJcbiAgXCJnYXlsb3JkXCIsXHJcbiAgXCJnYXlzZXhcIixcclxuICBcImdvYXRzZVwiLFxyXG4gIFwiR29kXCIsXHJcbiAgXCJnb2QtZGFtXCIsXHJcbiAgXCJnb2QtZGFtbmVkXCIsXHJcbiAgXCJnb2RkYW1uXCIsXHJcbiAgXCJnb2RkYW1uZWRcIixcclxuICBcImhhcmRjb3Jlc2V4XCIsXHJcbiAgXCJoZWxsXCIsXHJcbiAgXCJoZXNoZVwiLFxyXG4gIFwiaG9hclwiLFxyXG4gIFwiaG9hcmVcIixcclxuICBcImhvZXJcIixcclxuICBcImhvbW9cIixcclxuICBcImhvcmVcIixcclxuICBcImhvcm5pZXN0XCIsXHJcbiAgXCJob3JueVwiLFxyXG4gIFwiaG90c2V4XCIsXHJcbiAgXCJqYWNrLW9mZlwiLFxyXG4gIFwiamFja29mZlwiLFxyXG4gIFwiamFwXCIsXHJcbiAgXCJqZXJrLW9mZlwiLFxyXG4gIFwiamlzbVwiLFxyXG4gIFwiaml6XCIsXHJcbiAgXCJqaXptXCIsXHJcbiAgXCJqaXp6XCIsXHJcbiAgXCJrYXdrXCIsXHJcbiAgXCJrbm9iXCIsXHJcbiAgXCJrbm9iZWFkXCIsXHJcbiAgXCJrbm9iZWRcIixcclxuICBcImtub2JlbmRcIixcclxuICBcImtub2JoZWFkXCIsXHJcbiAgXCJrbm9iam9ja3lcIixcclxuICBcImtub2Jqb2tleVwiLFxyXG4gIFwia29ja1wiLFxyXG4gIFwia29uZHVtXCIsXHJcbiAgXCJrb25kdW1zXCIsXHJcbiAgXCJrdW1cIixcclxuICBcImt1bW1lclwiLFxyXG4gIFwia3VtbWluZ1wiLFxyXG4gIFwia3Vtc1wiLFxyXG4gIFwia3VuaWxpbmd1c1wiLFxyXG4gIFwibDNpK2NoXCIsXHJcbiAgXCJsM2l0Y2hcIixcclxuICBcImxhYmlhXCIsXHJcbiAgXCJsbWZhb1wiLFxyXG4gIFwibHVzdFwiLFxyXG4gIFwibHVzdGluZ1wiLFxyXG4gIFwibTBmMFwiLFxyXG4gIFwibTBmb1wiLFxyXG4gIFwibTQ1dGVyYmF0ZVwiLFxyXG4gIFwibWE1dGVyYjhcIixcclxuICBcIm1hNXRlcmJhdGVcIixcclxuICBcIm1hc29jaGlzdFwiLFxyXG4gIFwibWFzdGVyLWJhdGVcIixcclxuICBcIm1hc3RlcmI4XCIsXHJcbiAgXCJtYXN0ZXJiYXQqXCIsXHJcbiAgXCJtYXN0ZXJiYXQzXCIsXHJcbiAgXCJtYXN0ZXJiYXRlXCIsXHJcbiAgXCJtYXN0ZXJiYXRpb25cIixcclxuICBcIm1hc3RlcmJhdGlvbnNcIixcclxuICBcIm1hc3R1cmJhdGVcIixcclxuICBcIm1vLWZvXCIsXHJcbiAgXCJtb2YwXCIsXHJcbiAgXCJtb2ZvXCIsXHJcbiAgXCJtb3RoYWZ1Y2tcIixcclxuICBcIm1vdGhhZnVja2FcIixcclxuICBcIm1vdGhhZnVja2FzXCIsXHJcbiAgXCJtb3RoYWZ1Y2thelwiLFxyXG4gIFwibW90aGFmdWNrZWRcIixcclxuICBcIm1vdGhhZnVja2VyXCIsXHJcbiAgXCJtb3RoYWZ1Y2tlcnNcIixcclxuICBcIm1vdGhhZnVja2luXCIsXHJcbiAgXCJtb3RoYWZ1Y2tpbmdcIixcclxuICBcIm1vdGhhZnVja2luZ3NcIixcclxuICBcIm1vdGhhZnVja3NcIixcclxuICBcIm1vdGhlciBmdWNrZXJcIixcclxuICBcIm1vdGhlcmZ1Y2tcIixcclxuICBcIm1vdGhlcmZ1Y2tlZFwiLFxyXG4gIFwibW90aGVyZnVja2VyXCIsXHJcbiAgXCJtb3RoZXJmdWNrZXJzXCIsXHJcbiAgXCJtb3RoZXJmdWNraW5cIixcclxuICBcIm1vdGhlcmZ1Y2tpbmdcIixcclxuICBcIm1vdGhlcmZ1Y2tpbmdzXCIsXHJcbiAgXCJtb3RoZXJmdWNra2FcIixcclxuICBcIm1vdGhlcmZ1Y2tzXCIsXHJcbiAgXCJtdWZmXCIsXHJcbiAgXCJtdXRoYVwiLFxyXG4gIFwibXV0aGFmZWNrZXJcIixcclxuICBcIm11dGhhZnVja2tlclwiLFxyXG4gIFwibXV0aGVyXCIsXHJcbiAgXCJtdXRoZXJmdWNrZXJcIixcclxuICBcIm4xZ2dhXCIsXHJcbiAgXCJuMWdnZXJcIixcclxuICBcIm5hemlcIixcclxuICBcIm5pZ2czclwiLFxyXG4gIFwibmlnZzRoXCIsXHJcbiAgXCJuaWdnYVwiLFxyXG4gIFwibmlnZ2FoXCIsXHJcbiAgXCJuaWdnYXNcIixcclxuICBcIm5pZ2dhelwiLFxyXG4gIFwibmlnZ2VyXCIsXHJcbiAgXCJuaWdnZXJzXCIsXHJcbiAgXCJub2JcIixcclxuICBcIm5vYiBqb2tleVwiLFxyXG4gIFwibm9iaGVhZFwiLFxyXG4gIFwibm9iam9ja3lcIixcclxuICBcIm5vYmpva2V5XCIsXHJcbiAgXCJudW1ibnV0c1wiLFxyXG4gIFwibnV0c2Fja1wiLFxyXG4gIFwib3JnYXNpbVwiLFxyXG4gIFwib3JnYXNpbXNcIixcclxuICBcIm9yZ2FzbVwiLFxyXG4gIFwib3JnYXNtc1wiLFxyXG4gIFwicDByblwiLFxyXG4gIFwicGF3blwiLFxyXG4gIFwicGVja2VyXCIsXHJcbiAgXCJwZW5pc1wiLFxyXG4gIFwicGVuaXNmdWNrZXJcIixcclxuICBcInBob25lc2V4XCIsXHJcbiAgXCJwaHVja1wiLFxyXG4gIFwicGh1a1wiLFxyXG4gIFwicGh1a2VkXCIsXHJcbiAgXCJwaHVraW5nXCIsXHJcbiAgXCJwaHVra2VkXCIsXHJcbiAgXCJwaHVra2luZ1wiLFxyXG4gIFwicGh1a3NcIixcclxuICBcInBodXFcIixcclxuICBcInBpZ2Z1Y2tlclwiLFxyXG4gIFwicGltcGlzXCIsXHJcbiAgXCJwaXNzXCIsXHJcbiAgXCJwaXNzZWRcIixcclxuICBcInBpc3NlclwiLFxyXG4gIFwicGlzc2Vyc1wiLFxyXG4gIFwicGlzc2VzXCIsXHJcbiAgXCJwaXNzZmxhcHNcIixcclxuICBcInBpc3NpblwiLFxyXG4gIFwicGlzc2luZ1wiLFxyXG4gIFwicGlzc29mZlwiLFxyXG4gIFwicG9vcFwiLFxyXG4gIFwicG9yblwiLFxyXG4gIFwicG9ybm9cIixcclxuICBcInBvcm5vZ3JhcGh5XCIsXHJcbiAgXCJwb3Jub3NcIixcclxuICBcInByaWNrXCIsXHJcbiAgXCJwcmlja3NcIixcclxuICBcInByb25cIixcclxuICBcInB1YmVcIixcclxuICBcInB1c3NlXCIsXHJcbiAgXCJwdXNzaVwiLFxyXG4gIFwicHVzc2llc1wiLFxyXG4gIFwicHVzc3lcIixcclxuICBcInB1c3N5c1wiLFxyXG4gIFwicmVjdHVtXCIsXHJcbiAgXCJyZXRhcmRcIixcclxuICBcInJpbWphd1wiLFxyXG4gIFwicmltbWluZ1wiLFxyXG4gIFwicyBoaXRcIixcclxuICBcInMuby5iLlwiLFxyXG4gIFwic2FkaXN0XCIsXHJcbiAgXCJzY2hsb25nXCIsXHJcbiAgXCJzY3Jld2luZ1wiLFxyXG4gIFwic2Nyb2F0XCIsXHJcbiAgXCJzY3JvdGVcIixcclxuICBcInNjcm90dW1cIixcclxuICBcInNlbWVuXCIsXHJcbiAgXCJzZXhcIixcclxuICBcInNoIStcIixcclxuICBcInNoIXRcIixcclxuICBcInNoMXRcIixcclxuICBcInNoYWdcIixcclxuICBcInNoYWdnZXJcIixcclxuICBcInNoYWdnaW5cIixcclxuICBcInNoYWdnaW5nXCIsXHJcbiAgXCJzaGVtYWxlXCIsXHJcbiAgXCJzaGkrXCIsXHJcbiAgXCJzaGl0XCIsXHJcbiAgXCJzaGl0ZGlja1wiLFxyXG4gIFwic2hpdGVcIixcclxuICBcInNoaXRlZFwiLFxyXG4gIFwic2hpdGV5XCIsXHJcbiAgXCJzaGl0ZnVja1wiLFxyXG4gIFwic2hpdGZ1bGxcIixcclxuICBcInNoaXRoZWFkXCIsXHJcbiAgXCJzaGl0aW5nXCIsXHJcbiAgXCJzaGl0aW5nc1wiLFxyXG4gIFwic2hpdHNcIixcclxuICBcInNoaXR0ZWRcIixcclxuICBcInNoaXR0ZXJcIixcclxuICBcInNoaXR0ZXJzXCIsXHJcbiAgXCJzaGl0dGluZ1wiLFxyXG4gIFwic2hpdHRpbmdzXCIsXHJcbiAgXCJzaGl0dHlcIixcclxuICBcInNrYW5rXCIsXHJcbiAgXCJzbHV0XCIsXHJcbiAgXCJzbHV0c1wiLFxyXG4gIFwic21lZ21hXCIsXHJcbiAgXCJzbXV0XCIsXHJcbiAgXCJzbmF0Y2hcIixcclxuICBcInNvbi1vZi1hLWJpdGNoXCIsXHJcbiAgXCJzcGFjXCIsXHJcbiAgXCJzcHVua1wiLFxyXG4gIFwic19oX2lfdFwiLFxyXG4gIFwidDF0dDFlNVwiLFxyXG4gIFwidDF0dGllc1wiLFxyXG4gIFwidGVldHNcIixcclxuICBcInRlZXpcIixcclxuICBcInRlc3RpY2FsXCIsXHJcbiAgXCJ0ZXN0aWNsZVwiLFxyXG4gIFwidGl0XCIsXHJcbiAgXCJ0aXRmdWNrXCIsXHJcbiAgXCJ0aXRzXCIsXHJcbiAgXCJ0aXR0XCIsXHJcbiAgXCJ0aXR0aWU1XCIsXHJcbiAgXCJ0aXR0aWVmdWNrZXJcIixcclxuICBcInRpdHRpZXNcIixcclxuICBcInRpdHR5ZnVja1wiLFxyXG4gIFwidGl0dHl3YW5rXCIsXHJcbiAgXCJ0aXR3YW5rXCIsXHJcbiAgXCJ0b3NzZXJcIixcclxuICBcInR1cmRcIixcclxuICBcInR3NHRcIixcclxuICBcInR3YXRcIixcclxuICBcInR3YXRoZWFkXCIsXHJcbiAgXCJ0d2F0dHlcIixcclxuICBcInR3dW50XCIsXHJcbiAgXCJ0d3VudGVyXCIsXHJcbiAgXCJ2MTRncmFcIixcclxuICBcInYxZ3JhXCIsXHJcbiAgXCJ2YWdpbmFcIixcclxuICBcInZpYWdyYVwiLFxyXG4gIFwidnVsdmFcIixcclxuICBcIncwMHNlXCIsXHJcbiAgXCJ3YW5nXCIsXHJcbiAgXCJ3YW5rXCIsXHJcbiAgXCJ3YW5rZXJcIixcclxuICBcIndhbmt5XCIsXHJcbiAgXCJ3aG9hclwiLFxyXG4gIFwid2hvcmVcIixcclxuICBcIndpbGxpZXNcIixcclxuICBcIndpbGx5XCIsXHJcbiAgXCJ4cmF0ZWRcIixcclxuICBcInh4eFwiXHJcbl19IiwidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxudmFyIGJhZHdvcmRzID0gcmVxdWlyZSgnLi9iYWR3b3Jkcy5qc29uJykuYmFkd29yZHM7XHJcbnZhciBUZXh0RmluZGVyID0gcmVxdWlyZSgnLi90ZXh0ZmluZGVyJyk7XHJcblxyXG4vLyBDb25zdHJ1Y3RvclxyXG5mdW5jdGlvbiBCYWRMYW5ndWFnZUZpbHRlcigpIHtcclxuXHR0aGlzLnRleHRmaW5kZXIgPSBuZXcgVGV4dEZpbmRlcihiYWR3b3Jkcyk7XHJcbn1cclxuXHJcbi8vIENoZWNrIGlmIGFueSBiYWQgd29yZHMgaXMgY29udGFpbmVkIGluIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGVudCkge1xyXG5cdHJldHVybiB0aGlzLnRleHRmaW5kZXIuY29udGFpbnMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBDaGVjayBpZiBhbnkgYmFkIHdvcmRzIGlzIGNvbnRhaW5lZCBpbiBjb250ZW50IGFuZCByZXR1cm5zIGFycmF5IG9mIHdvcmRzXHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5tYXRjaGVzKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gUmVtb3ZlIGJhZCB3b3JkcyBmcm9tIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLnJlbW92ZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5yZW1vdmVXb3Jkcyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIFJlcGxhY2UgYmFkIHdvcmRzIGZyb20gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUucmVwbGFjZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCwgcmVwbGFjZXN0cikge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5yZXBsYWNlV29yZHMoY29udGVudCwgcmVwbGFjZXN0cik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhZExhbmd1YWdlRmlsdGVyOyIsIi8vIENvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIFRleHRGaW5kZXIod29yZExpc3QpIHtcclxuICB0aGlzLndvcmRsaXN0ID0gd29yZExpc3Q7XHJcbiAgdGhpcy5zZWFyY2hzdHJpbmcgPSBuZXcgUmVnRXhwKHdvcmRMaXN0LmpvaW4oXCIgfFwiKS5yZXBsYWNlKC9bXlxcd1xcc158XS9naSwgJycpLCAnaScpO1xyXG4gIHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nID0gbmV3IFJlZ0V4cCh3b3JkTGlzdC5qb2luKFwiIHxcIikucmVwbGFjZSgvW15cXHdcXHNefF0vZ2ksICcnKSwgJ2dpJyk7XHJcblxyXG59XHJcbi8vIGNsYXNzIG1ldGhvZHNcclxuVGV4dEZpbmRlci5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcblx0cmV0dXJuIHRoaXMuc2VhcmNoc3RyaW5nLnRlc3QoY29udGVudCk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIGNvbnRlbnQubWF0Y2godGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcpO1xyXG59O1xyXG5cclxuVGV4dEZpbmRlci5wcm90b3R5cGUucmVtb3ZlV29yZHMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nLCAnJyk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5yZXBsYWNlV29yZHMgPSBmdW5jdGlvbihjb250ZW50LCByZXBsYWNlc3RyKSB7XHJcbiAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nLCByZXBsYWNlc3RyKTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGaW5kZXI7IiwiIl19
