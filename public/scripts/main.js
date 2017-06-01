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

		// 7. Use javascript filter to scan the lyrics for profanity.
		var filterSwear = '';
		var filterSwear = filter.contains(lyrics);
		console.log(filterSwear);

		if (filterSwear === true) {
			$('.modalYes').addClass('modalDisplay');
		} else if (filterSwear === false) {
			$('.modalNo').addClass('modalDisplay');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFHQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxTQUFTLEVBQWI7O0FBRUEsT0FBTyxNQUFQLEdBQWdCLGtDQUFoQjs7QUFFQSxJQUFJLFNBQVMsaUNBQWI7O0FBRUEsT0FBTyxJQUFQLEdBQWMsWUFBVztBQUN4QixRQUFPLGFBQVA7QUFDQSxRQUFPLFFBQVA7QUFDQSxDQUhEOztBQUtBLE9BQU8sUUFBUCxHQUFrQixZQUFXO0FBQzVCLEdBQUUsV0FBRixFQUFlLFFBQWYsQ0FBd0I7QUFDdkIsaUJBQWUsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixTQUF2QixFQUFrQyxTQUFsQztBQURRLEVBQXhCO0FBR0EsQ0FKRDs7QUFNQSxPQUFPLGFBQVAsR0FBdUIsWUFBWTs7QUFFbEM7QUFDQSxHQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixVQUFTLEtBQVQsRUFBZ0I7O0FBRXRDLFFBQU0sY0FBTjtBQUNBLE1BQUksZ0JBQWdCLEVBQUUsWUFBRixFQUFnQixHQUFoQixFQUFwQjtBQUNBLE1BQUksaUJBQWlCLEVBQUUsYUFBRixFQUFpQixHQUFqQixFQUFyQjtBQUNBLE1BQUksaUJBQWlCLEVBQUUsYUFBRixFQUFpQixHQUFqQixFQUFyQjs7QUFFQSxTQUFPLFdBQVAsQ0FBbUIsYUFBbkIsRUFBa0MsY0FBbEMsRUFBa0QsY0FBbEQ7O0FBRUEsVUFBUSxHQUFSLENBQVksY0FBWjtBQUNBLEVBVkQ7O0FBWUE7QUFDQSxHQUFFLGNBQUYsRUFBa0IsRUFBbEIsQ0FBcUIsT0FBckIsRUFBOEIsY0FBOUIsRUFBOEMsWUFBVzs7QUFFeEQsTUFBSSxVQUFVLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxVQUFiLENBQWQ7QUFDQSxTQUFPLFNBQVAsQ0FBaUIsT0FBakI7QUFFQSxFQUxEO0FBT0EsQ0F2QkQ7O0FBeUJBO0FBQ0E7QUFDQSxPQUFPLFdBQVAsR0FBcUIsVUFBVSxLQUFWLEVBQWlCLE1BQWpCLEVBQXlCLE1BQXpCLEVBQWlDO0FBQ3JELEdBQUUsSUFBRixDQUFPO0FBQ04sT0FBSywrQ0FEQztBQUVOLFVBQVEsS0FGRjtBQUdOLFlBQVUsT0FISjtBQUlOLFFBQU07QUFDTCxXQUFRLE9BQU8sTUFEVjtBQUVMLFlBQVMsS0FGSjtBQUdMLGFBQVUsTUFITDtBQUlMLGFBQVUsTUFKTDtBQUtMLGlCQUFjLEVBTFQ7QUFNTCxzQkFBbUIsSUFOZDtBQU9MLFdBQVEsT0FQSDtBQVFMLGNBQVc7QUFSTjtBQUpBLEVBQVAsRUFjRyxJQWRILENBY1EsVUFBVSxNQUFWLEVBQWlCO0FBQ3hCO0FBQ0E7QUFDQSxNQUFJLFlBQVksT0FBTyxPQUFQLENBQWUsSUFBZixDQUFvQixVQUFwQzs7QUFFQSxZQUFVLE9BQVYsQ0FBa0IsVUFBUyxLQUFULEVBQWdCOztBQUVqQyxPQUFJLGNBQWMsRUFBRSxNQUFGLEVBQVUsUUFBVixDQUFtQixhQUFuQixDQUFsQjs7QUFFQSxPQUFJLFdBQVcsRUFBRSxPQUFGLEVBQVcsSUFBWCxDQUFnQixLQUFoQixFQUF1QixNQUFNLEtBQU4sQ0FBWSxzQkFBbkMsQ0FBZjtBQUNBLE9BQUksWUFBWSxFQUFFLE1BQUYsRUFBVSxJQUFWLENBQWUsTUFBTSxLQUFOLENBQVksVUFBM0IsQ0FBaEI7QUFDQSxPQUFJLGFBQWEsRUFBRSxNQUFGLEVBQVUsSUFBVixDQUFlLE1BQU0sS0FBTixDQUFZLFdBQTNCLENBQWpCO0FBQ0EsT0FBSSxZQUFZLEVBQUUsTUFBRixFQUFVLElBQVYsQ0FBZSxNQUFNLEtBQU4sQ0FBWSxVQUEzQixDQUFoQjs7QUFFQSxPQUFJLFVBQVUsTUFBTSxLQUFOLENBQVksUUFBMUI7O0FBRUEsZUFBWSxJQUFaLENBQWlCLFVBQWpCLEVBQTZCLE9BQTdCO0FBQ0EsZUFBWSxNQUFaLENBQW1CLFFBQW5CLEVBQTZCLFNBQTdCLEVBQXdDLFVBQXhDLEVBQW9ELFNBQXBEOztBQUVBLEtBQUUsY0FBRixFQUFrQixNQUFsQixDQUF5QixXQUF6QjtBQUVBLEdBaEJEO0FBa0JBLEVBckNEO0FBc0NBLENBdkNEOztBQXlDQTtBQUNBLE9BQU8sU0FBUCxHQUFtQixVQUFVLE9BQVYsRUFBbUI7QUFDckMsR0FBRSxJQUFGLENBQU87QUFDTixPQUFLLG1EQURDO0FBRU4sVUFBUSxLQUZGO0FBR04sWUFBVSxPQUhKO0FBSU4sUUFBTTtBQUNMLFdBQVEsT0FBTyxNQURWO0FBRUwsYUFBVSxPQUZMO0FBR0wsV0FBUTtBQUhIO0FBSkEsRUFBUCxFQVNHLElBVEgsQ0FTUSxVQUFTLE1BQVQsRUFBZ0I7QUFDdkIsVUFBUSxHQUFSLENBQVksTUFBWjtBQUNBLE1BQUksU0FBUyxPQUFPLE9BQVAsQ0FBZSxJQUFmLENBQW9CLE1BQXBCLENBQTJCLFdBQXhDO0FBQ0EsVUFBUSxHQUFSLENBQVksTUFBWjs7QUFFQTtBQUNBLE1BQUksY0FBYyxFQUFsQjtBQUNBLE1BQUksY0FBYyxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsQ0FBbEI7QUFDQSxVQUFRLEdBQVIsQ0FBWSxXQUFaOztBQUVBLE1BQUksZ0JBQWdCLElBQXBCLEVBQTBCO0FBQ3pCLEtBQUUsV0FBRixFQUFlLFFBQWYsQ0FBd0IsY0FBeEI7QUFDQSxHQUZELE1BRU8sSUFBSSxnQkFBZ0IsS0FBcEIsRUFBMkI7QUFDakMsS0FBRSxVQUFGLEVBQWMsUUFBZCxDQUF1QixjQUF2QjtBQUNBO0FBQ0QsRUF4QkQ7QUEwQkEsQ0EzQkQ7O0FBNkJBLEVBQUUsWUFBVTtBQUNYLFFBQU8sSUFBUDtBQUNBLENBRkQ7OztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBCYWRMYW5ndWFnZUZpbHRlciBmcm9tICdiYWQtbGFuZ3VhZ2UtZmlsdGVyJztcblxuXG4vLyA4LiBJRiB0aGVyZSBpcyBwcm9mYW5pdHkgZGlzcGxheSByZWQgKyBmZWVkYmFja1xuLy8gOS4gSUYgRUxTRSBkaXNwbGF5IGdyZWVuICsgZmVlZGJhY2tcbi8vIDEwLiBBbGxvdyB1c2VyIHRvIHNhdmUgc29uZyB0byBwbGF5bGlzdFxuXG52YXIga2FyYU9LID0ge307XG5cbmthcmFPSy5hcGlrZXkgPSAnMTJiMjdhODI5Y2FmNWMyZmJjMTU3NTFjNWExNjA5ZDEnO1xuXG52YXIgZmlsdGVyID0gbmV3IEJhZExhbmd1YWdlRmlsdGVyKCk7XG5cbmthcmFPSy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGthcmFPSy5ldmVudEhhbmRsZXJzKCk7XG5cdGthcmFPSy5mdWxsUGFnZSgpO1xufVxuXG5rYXJhT0suZnVsbFBhZ2UgPSBmdW5jdGlvbigpIHtcblx0JCgnI2Z1bGxwYWdlJykuZnVsbHBhZ2Uoe1xuXHRcdHNlY3Rpb25zQ29sb3I6IFsnIzY1QzVERicsICcjMDA0RTdCJywgJyM2NUM1REYnLCAnIzAwNEU3QiddLFxuXHR9KTtcbn1cblxua2FyYU9LLmV2ZW50SGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG5cblx0Ly8gMS4gUmVjZWl2ZSB1c2VyIGlucHV0LlxuXHQkKCdmb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciB1c2VyVHJhY2tOYW1lID0gJCgnLnRyYWNrTmFtZScpLnZhbCgpO1xuXHRcdHZhciB1c2VyQXJ0aXN0TmFtZSA9ICQoJy5hcnRpc3ROYW1lJykudmFsKCk7XG5cdFx0dmFyIHVzZXJMeXJpY3NOYW1lID0gJCgnLmx5cmljc05hbWUnKS52YWwoKTtcblxuXHRcdGthcmFPSy5nZXRTb25nSW5mbyh1c2VyVHJhY2tOYW1lLCB1c2VyQXJ0aXN0TmFtZSwgdXNlckx5cmljc05hbWUpO1xuXG5cdFx0Y29uc29sZS5sb2codXNlckFydGlzdE5hbWUpO1xuXHR9KTtcblxuXHQvLyA1LiBSZWNlaXZlIHVzZXIgc2VsZWN0aW9uLlxuXHQkKCcuc29uZ0dhbGxlcnknKS5vbignY2xpY2snLCAnLmdhbGxlcnlVbml0JywgZnVuY3Rpb24gKCl7XG5cblx0XHR2YXIgdHJhY2tJRCA9ICQodGhpcykuZGF0YSgndHJhY2staWQnKTtcblx0XHRrYXJhT0suZ2V0THlyaWNzKHRyYWNrSUQpO1xuXG5cdH0pXG5cbn1cblxuLy8gMi4gVXNlIHVzZXIgaW5wdXQgdG8gbWFrZSBBUEkgcmVxdWVzdC9BSkFYIHJlcXVlc3QuXG4vLyAzLiBGaWx0ZXIgdGhlIHJlc3VsdHMgKGllIHNlYXJjaCBieSBseXJpY3Mgb25seSwgbGFuZ3VhZ2UsIGZvcm1hdCBldGMpXG5rYXJhT0suZ2V0U29uZ0luZm8gPSBmdW5jdGlvbiAodHJhY2ssIGFydGlzdCwgbHlyaWNzKSB7XG5cdCQuYWpheCh7XG5cdFx0dXJsOiAnaHR0cDovL2FwaS5tdXNpeG1hdGNoLmNvbS93cy8xLjEvdHJhY2suc2VhcmNoJyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFwaWtleToga2FyYU9LLmFwaWtleSxcblx0XHRcdHFfdHJhY2s6IHRyYWNrLFxuXHRcdFx0cV9hcnRpc3Q6IGFydGlzdCxcblx0XHRcdHFfbHlyaWNzOiBseXJpY3MsXG5cdFx0XHRmX2hhc19seXJpY3M6ICcnLFxuXHRcdFx0Zl9seXJpY3NfbGFuZ3VhZ2U6ICdlbicsXG5cdFx0XHRmb3JtYXQ6ICdqc29ucCcsXG5cdFx0XHRwYWdlX3NpemU6IDEwMFxuXHRcdH1cblx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0KXtcblx0XHQvLyA0LiBEaXNwbGF5IEFQSSByZXF1ZXN0IHJlc3VsdHMgb24gc2NyZWVuXG5cdFx0Ly8gXHQodHJhY2tfaWQsIHRyYWNrX25hbWUsIGV4cGxpY2l0LCBhbGJ1bV9uYW1lLCBhcnRpc3RfbmFtZSwgYWxidW1fY292ZXJhcnRfMTAweDEwMCwgdHJhY2tfc2hhcmVfdXJsKVxuXHRcdHZhciB0cmFja0xpc3QgPSByZXN1bHQubWVzc2FnZS5ib2R5LnRyYWNrX2xpc3RcblxuXHRcdHRyYWNrTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHRyYWNrKSB7XG5cblx0XHRcdHZhciBnYWxsZXJ5VW5pdCA9ICQoJzxsaT4nKS5hZGRDbGFzcygnZ2FsbGVyeVVuaXQnKTtcblxuXHRcdFx0dmFyIGNvdmVyQXJ0ID0gJCgnPGltZz4nKS5hdHRyKCdzcmMnLCB0cmFjay50cmFjay5hbGJ1bV9jb3ZlcmFydF8xMDB4MTAwKTtcblx0XHRcdHZhciBhbGJ1bU5hbWUgPSAkKCc8aDM+JykudGV4dCh0cmFjay50cmFjay5hbGJ1bV9uYW1lKTtcblx0XHRcdHZhciBhcnRpc3ROYW1lID0gJCgnPGgzPicpLnRleHQodHJhY2sudHJhY2suYXJ0aXN0X25hbWUpO1xuXHRcdFx0dmFyIHRyYWNrTmFtZSA9ICQoJzxoMj4nKS50ZXh0KHRyYWNrLnRyYWNrLnRyYWNrX25hbWUpO1xuXG5cdFx0XHR2YXIgdHJhY2tJZCA9IHRyYWNrLnRyYWNrLnRyYWNrX2lkO1xuXG5cdFx0XHRnYWxsZXJ5VW5pdC5kYXRhKCd0cmFjay1pZCcsIHRyYWNrSWQpO1xuXHRcdFx0Z2FsbGVyeVVuaXQuYXBwZW5kKGNvdmVyQXJ0LCB0cmFja05hbWUsIGFydGlzdE5hbWUsIGFsYnVtTmFtZSk7XG5cblx0XHRcdCQoJy5zb25nR2FsbGVyeScpLmFwcGVuZChnYWxsZXJ5VW5pdCk7XG5cblx0XHR9KTtcblxuXHR9KTtcbn1cblxuLy8gNi4gTWFrZSBBUEkgcmVxdWVzdCB0byB0cmFjay5seXJpY3MuZ2V0LCBcbmthcmFPSy5nZXRMeXJpY3MgPSBmdW5jdGlvbiAodHJhY2tJZCkge1xuXHQkLmFqYXgoe1xuXHRcdHVybDogJ2h0dHA6Ly9hcGkubXVzaXhtYXRjaC5jb20vd3MvMS4xL3RyYWNrLmx5cmljcy5nZXQnLFxuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0ZGF0YVR5cGU6ICdqc29ucCcsXG5cdFx0ZGF0YToge1xuXHRcdFx0YXBpa2V5OiBrYXJhT0suYXBpa2V5LFxuXHRcdFx0dHJhY2tfaWQ6IHRyYWNrSWQsXG5cdFx0XHRmb3JtYXQ6ICdqc29ucCdcblx0XHR9XG5cdH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcblx0XHRjb25zb2xlLmxvZyhyZXN1bHQpO1xuXHRcdHZhciBseXJpY3MgPSByZXN1bHQubWVzc2FnZS5ib2R5Lmx5cmljcy5seXJpY3NfYm9keTtcblx0XHRjb25zb2xlLmxvZyhseXJpY3MpO1xuXG5cdFx0Ly8gNy4gVXNlIGphdmFzY3JpcHQgZmlsdGVyIHRvIHNjYW4gdGhlIGx5cmljcyBmb3IgcHJvZmFuaXR5LlxuXHRcdHZhciBmaWx0ZXJTd2VhciA9ICcnO1xuXHRcdHZhciBmaWx0ZXJTd2VhciA9IGZpbHRlci5jb250YWlucyhseXJpY3MpO1xuXHRcdGNvbnNvbGUubG9nKGZpbHRlclN3ZWFyKTtcblxuXHRcdGlmIChmaWx0ZXJTd2VhciA9PT0gdHJ1ZSkge1xuXHRcdFx0JCgnLm1vZGFsWWVzJykuYWRkQ2xhc3MoJ21vZGFsRGlzcGxheScpO1xuXHRcdH0gZWxzZSBpZiAoZmlsdGVyU3dlYXIgPT09IGZhbHNlKSB7XG5cdFx0XHQkKCcubW9kYWxObycpLmFkZENsYXNzKCdtb2RhbERpc3BsYXknKTtcblx0XHR9XG5cdH0pO1x0XG5cbn1cblxuJChmdW5jdGlvbigpe1xuXHRrYXJhT0suaW5pdCgpO1xufSk7XG5cbiIsIm1vZHVsZS5leHBvcnRzPXtcImJhZHdvcmRzXCIgOiBbXCI0cjVlXCIsXHJcbiBcIjVoMXRcIixcclxuIFwiNWhpdFwiLFxyXG4gXCJhNTVcIixcclxuIFwiYW5hbFwiLFxyXG4gIFwiYW51c1wiLFxyXG4gIFwiYXI1ZVwiLFxyXG4gIFwiYXJyc2VcIixcclxuICBcImFyc2VcIixcclxuICBcImFzc1wiLFxyXG4gIFwiYXNzLWZ1Y2tlclwiLFxyXG4gIFwiYXNzZXNcIixcclxuICBcImFzc2Z1Y2tlclwiLFxyXG4gIFwiYXNzZnVra2FcIixcclxuICBcImFzc2hvbGVcIixcclxuICBcImFzc2hvbGVzXCIsXHJcbiAgXCJhc3N3aG9sZVwiLFxyXG4gIFwiYV9zX3NcIixcclxuICBcImIhdGNoXCIsXHJcbiAgXCJiMDBic1wiLFxyXG4gIFwiYjE3Y2hcIixcclxuICBcImIxdGNoXCIsXHJcbiAgXCJiYWxsYmFnXCIsXHJcbiAgXCJiYWxsc1wiLFxyXG4gIFwiYmFsbHNhY2tcIixcclxuICBcImJhc3RhcmRcIixcclxuICBcImJlYXN0aWFsXCIsXHJcbiAgXCJiZWFzdGlhbGl0eVwiLFxyXG4gIFwiYmVsbGVuZFwiLFxyXG4gIFwiYmVzdGlhbFwiLFxyXG4gIFwiYmVzdGlhbGl0eVwiLFxyXG4gIFwiYmkrY2hcIixcclxuICBcImJpYXRjaFwiLFxyXG4gIFwiYml0Y2hcIixcclxuICBcImJpdGNoZXJcIixcclxuICBcImJpdGNoZXJzXCIsXHJcbiAgXCJiaXRjaGVzXCIsXHJcbiAgXCJiaXRjaGluXCIsXHJcbiAgXCJiaXRjaGluZ1wiLFxyXG4gIFwiYmxvb2R5XCIsXHJcbiAgXCJibG93IGpvYlwiLFxyXG4gIFwiYmxvd2pvYlwiLFxyXG4gIFwiYmxvd2pvYnNcIixcclxuICBcImJvaW9sYXNcIixcclxuICBcImJvbGxvY2tcIixcclxuICBcImJvbGxva1wiLFxyXG4gIFwiYm9uZXJcIixcclxuICBcImJvb2JcIixcclxuICBcImJvb2JzXCIsXHJcbiAgXCJib29vYnNcIixcclxuICBcImJvb29vYnNcIixcclxuICBcImJvb29vb2JzXCIsXHJcbiAgXCJib29vb29vb2JzXCIsXHJcbiAgXCJicmVhc3RzXCIsXHJcbiAgXCJidWNldGFcIixcclxuICBcImJ1Z2dlclwiLFxyXG4gIFwiYnVtXCIsXHJcbiAgXCJidW5ueSBmdWNrZXJcIixcclxuICBcImJ1dHRcIixcclxuICBcImJ1dHRob2xlXCIsXHJcbiAgXCJidXR0bXVjaFwiLFxyXG4gIFwiYnV0dHBsdWdcIixcclxuICBcImMwY2tcIixcclxuICBcImMwY2tzdWNrZXJcIixcclxuICBcImNhcnBldCBtdW5jaGVyXCIsXHJcbiAgXCJjYXdrXCIsXHJcbiAgXCJjaGlua1wiLFxyXG4gIFwiY2lwYVwiLFxyXG4gIFwiY2wxdFwiLFxyXG4gIFwiY2xpdFwiLFxyXG4gIFwiY2xpdG9yaXNcIixcclxuICBcImNsaXRzXCIsXHJcbiAgXCJjbnV0XCIsXHJcbiAgXCJjb2NrXCIsXHJcbiAgXCJjb2NrLXN1Y2tlclwiLFxyXG4gIFwiY29ja2ZhY2VcIixcclxuICBcImNvY2toZWFkXCIsXHJcbiAgXCJjb2NrbXVuY2hcIixcclxuICBcImNvY2ttdW5jaGVyXCIsXHJcbiAgXCJjb2Nrc1wiLFxyXG4gIFwiY29ja3N1Y2tcIixcclxuICBcImNvY2tzdWNrZWRcIixcclxuICBcImNvY2tzdWNrZXJcIixcclxuICBcImNvY2tzdWNraW5nXCIsXHJcbiAgXCJjb2Nrc3Vja3NcIixcclxuICBcImNvY2tzdWthXCIsXHJcbiAgXCJjb2Nrc3Vra2FcIixcclxuICBcImNva1wiLFxyXG4gIFwiY29rbXVuY2hlclwiLFxyXG4gIFwiY29rc3Vja2FcIixcclxuICBcImNvb25cIixcclxuICBcImNveFwiLFxyXG4gIFwiY3JhcFwiLFxyXG4gIFwiY3VtXCIsXHJcbiAgXCJjdW1tZXJcIixcclxuICBcImN1bW1pbmdcIixcclxuICBcImN1bXNcIixcclxuICBcImN1bXNob3RcIixcclxuICBcImN1bmlsaW5ndXNcIixcclxuICBcImN1bmlsbGluZ3VzXCIsXHJcbiAgXCJjdW5uaWxpbmd1c1wiLFxyXG4gIFwiY3VudFwiLFxyXG4gIFwiY3VudGxpY2tcIixcclxuICBcImN1bnRsaWNrZXJcIixcclxuICBcImN1bnRsaWNraW5nXCIsXHJcbiAgXCJjdW50c1wiLFxyXG4gIFwiY3lhbGlzXCIsXHJcbiAgXCJjeWJlcmZ1Y1wiLFxyXG4gIFwiY3liZXJmdWNrXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlZFwiLFxyXG4gIFwiY3liZXJmdWNrZXJcIixcclxuICBcImN5YmVyZnVja2Vyc1wiLFxyXG4gIFwiY3liZXJmdWNraW5nXCIsXHJcbiAgXCJkMWNrXCIsXHJcbiAgXCJkYW1uXCIsXHJcbiAgXCJkaWNrXCIsXHJcbiAgXCJkaWNraGVhZFwiLFxyXG4gIFwiZGlsZG9cIixcclxuICBcImRpbGRvc1wiLFxyXG4gIFwiZGlua1wiLFxyXG4gIFwiZGlua3NcIixcclxuICBcImRpcnNhXCIsXHJcbiAgXCJkbGNrXCIsXHJcbiAgXCJkb2ctZnVja2VyXCIsXHJcbiAgXCJkb2dnaW5cIixcclxuICBcImRvZ2dpbmdcIixcclxuICBcImRvbmtleXJpYmJlclwiLFxyXG4gIFwiZG9vc2hcIixcclxuICBcImR1Y2hlXCIsXHJcbiAgXCJkeWtlXCIsXHJcbiAgXCJlamFjdWxhdGVcIixcclxuICBcImVqYWN1bGF0ZWRcIixcclxuICBcImVqYWN1bGF0ZXNcIixcclxuICBcImVqYWN1bGF0aW5nXCIsXHJcbiAgXCJlamFjdWxhdGluZ3NcIixcclxuICBcImVqYWN1bGF0aW9uXCIsXHJcbiAgXCJlamFrdWxhdGVcIixcclxuICBcImYgdSBjIGtcIixcclxuICBcImYgdSBjIGsgZSByXCIsXHJcbiAgXCJmNG5ueVwiLFxyXG4gIFwiZmFnXCIsXHJcbiAgXCJmYWdnaW5nXCIsXHJcbiAgXCJmYWdnaXR0XCIsXHJcbiAgXCJmYWdnb3RcIixcclxuICBcImZhZ2dzXCIsXHJcbiAgXCJmYWdvdFwiLFxyXG4gIFwiZmFnb3RzXCIsXHJcbiAgXCJmYWdzXCIsXHJcbiAgXCJmYW5ueVwiLFxyXG4gIFwiZmFubnlmbGFwc1wiLFxyXG4gIFwiZmFubnlmdWNrZXJcIixcclxuICBcImZhbnl5XCIsXHJcbiAgXCJmYXRhc3NcIixcclxuICBcImZjdWtcIixcclxuICBcImZjdWtlclwiLFxyXG4gIFwiZmN1a2luZ1wiLFxyXG4gIFwiZmVja1wiLFxyXG4gIFwiZmVja2VyXCIsXHJcbiAgXCJmZWxjaGluZ1wiLFxyXG4gIFwiZmVsbGF0ZVwiLFxyXG4gIFwiZmVsbGF0aW9cIixcclxuICBcImZpbmdlcmZ1Y2tcIixcclxuICBcImZpbmdlcmZ1Y2tlZFwiLFxyXG4gIFwiZmluZ2VyZnVja2VyXCIsXHJcbiAgXCJmaW5nZXJmdWNrZXJzXCIsXHJcbiAgXCJmaW5nZXJmdWNraW5nXCIsXHJcbiAgXCJmaW5nZXJmdWNrc1wiLFxyXG4gIFwiZmlzdGZ1Y2tcIixcclxuICBcImZpc3RmdWNrZWRcIixcclxuICBcImZpc3RmdWNrZXJcIixcclxuICBcImZpc3RmdWNrZXJzXCIsXHJcbiAgXCJmaXN0ZnVja2luZ1wiLFxyXG4gIFwiZmlzdGZ1Y2tpbmdzXCIsXHJcbiAgXCJmaXN0ZnVja3NcIixcclxuICBcImZsYW5nZVwiLFxyXG4gIFwiZm9va1wiLFxyXG4gIFwiZm9va2VyXCIsXHJcbiAgXCJmdWNrXCIsXHJcbiAgXCJmdWNrYVwiLFxyXG4gIFwiZnVja2VkXCIsXHJcbiAgXCJmdWNrZXJcIixcclxuICBcImZ1Y2tlcnNcIixcclxuICBcImZ1Y2toZWFkXCIsXHJcbiAgXCJmdWNraGVhZHNcIixcclxuICBcImZ1Y2tpblwiLFxyXG4gIFwiZnVja2luZ1wiLFxyXG4gIFwiZnVja2luZ3NcIixcclxuICBcImZ1Y2tpbmdzaGl0bW90aGVyZnVja2VyXCIsXHJcbiAgXCJmdWNrbWVcIixcclxuICBcImZ1Y2tzXCIsXHJcbiAgXCJmdWNrd2hpdFwiLFxyXG4gIFwiZnVja3dpdFwiLFxyXG4gIFwiZnVkZ2UgcGFja2VyXCIsXHJcbiAgXCJmdWRnZXBhY2tlclwiLFxyXG4gIFwiZnVrXCIsXHJcbiAgXCJmdWtlclwiLFxyXG4gIFwiZnVra2VyXCIsXHJcbiAgXCJmdWtraW5cIixcclxuICBcImZ1a3NcIixcclxuICBcImZ1a3doaXRcIixcclxuICBcImZ1a3dpdFwiLFxyXG4gIFwiZnV4XCIsXHJcbiAgXCJmdXgwclwiLFxyXG4gIFwiZl91X2Nfa1wiLFxyXG4gIFwiZ2FuZ2JhbmdcIixcclxuICBcImdhbmdiYW5nZWRcIixcclxuICBcImdhbmdiYW5nc1wiLFxyXG4gIFwiZ2F5bG9yZFwiLFxyXG4gIFwiZ2F5c2V4XCIsXHJcbiAgXCJnb2F0c2VcIixcclxuICBcIkdvZFwiLFxyXG4gIFwiZ29kLWRhbVwiLFxyXG4gIFwiZ29kLWRhbW5lZFwiLFxyXG4gIFwiZ29kZGFtblwiLFxyXG4gIFwiZ29kZGFtbmVkXCIsXHJcbiAgXCJoYXJkY29yZXNleFwiLFxyXG4gIFwiaGVsbFwiLFxyXG4gIFwiaGVzaGVcIixcclxuICBcImhvYXJcIixcclxuICBcImhvYXJlXCIsXHJcbiAgXCJob2VyXCIsXHJcbiAgXCJob21vXCIsXHJcbiAgXCJob3JlXCIsXHJcbiAgXCJob3JuaWVzdFwiLFxyXG4gIFwiaG9ybnlcIixcclxuICBcImhvdHNleFwiLFxyXG4gIFwiamFjay1vZmZcIixcclxuICBcImphY2tvZmZcIixcclxuICBcImphcFwiLFxyXG4gIFwiamVyay1vZmZcIixcclxuICBcImppc21cIixcclxuICBcImppelwiLFxyXG4gIFwiaml6bVwiLFxyXG4gIFwiaml6elwiLFxyXG4gIFwia2F3a1wiLFxyXG4gIFwia25vYlwiLFxyXG4gIFwia25vYmVhZFwiLFxyXG4gIFwia25vYmVkXCIsXHJcbiAgXCJrbm9iZW5kXCIsXHJcbiAgXCJrbm9iaGVhZFwiLFxyXG4gIFwia25vYmpvY2t5XCIsXHJcbiAgXCJrbm9iam9rZXlcIixcclxuICBcImtvY2tcIixcclxuICBcImtvbmR1bVwiLFxyXG4gIFwia29uZHVtc1wiLFxyXG4gIFwia3VtXCIsXHJcbiAgXCJrdW1tZXJcIixcclxuICBcImt1bW1pbmdcIixcclxuICBcImt1bXNcIixcclxuICBcImt1bmlsaW5ndXNcIixcclxuICBcImwzaStjaFwiLFxyXG4gIFwibDNpdGNoXCIsXHJcbiAgXCJsYWJpYVwiLFxyXG4gIFwibG1mYW9cIixcclxuICBcImx1c3RcIixcclxuICBcImx1c3RpbmdcIixcclxuICBcIm0wZjBcIixcclxuICBcIm0wZm9cIixcclxuICBcIm00NXRlcmJhdGVcIixcclxuICBcIm1hNXRlcmI4XCIsXHJcbiAgXCJtYTV0ZXJiYXRlXCIsXHJcbiAgXCJtYXNvY2hpc3RcIixcclxuICBcIm1hc3Rlci1iYXRlXCIsXHJcbiAgXCJtYXN0ZXJiOFwiLFxyXG4gIFwibWFzdGVyYmF0KlwiLFxyXG4gIFwibWFzdGVyYmF0M1wiLFxyXG4gIFwibWFzdGVyYmF0ZVwiLFxyXG4gIFwibWFzdGVyYmF0aW9uXCIsXHJcbiAgXCJtYXN0ZXJiYXRpb25zXCIsXHJcbiAgXCJtYXN0dXJiYXRlXCIsXHJcbiAgXCJtby1mb1wiLFxyXG4gIFwibW9mMFwiLFxyXG4gIFwibW9mb1wiLFxyXG4gIFwibW90aGFmdWNrXCIsXHJcbiAgXCJtb3RoYWZ1Y2thXCIsXHJcbiAgXCJtb3RoYWZ1Y2thc1wiLFxyXG4gIFwibW90aGFmdWNrYXpcIixcclxuICBcIm1vdGhhZnVja2VkXCIsXHJcbiAgXCJtb3RoYWZ1Y2tlclwiLFxyXG4gIFwibW90aGFmdWNrZXJzXCIsXHJcbiAgXCJtb3RoYWZ1Y2tpblwiLFxyXG4gIFwibW90aGFmdWNraW5nXCIsXHJcbiAgXCJtb3RoYWZ1Y2tpbmdzXCIsXHJcbiAgXCJtb3RoYWZ1Y2tzXCIsXHJcbiAgXCJtb3RoZXIgZnVja2VyXCIsXHJcbiAgXCJtb3RoZXJmdWNrXCIsXHJcbiAgXCJtb3RoZXJmdWNrZWRcIixcclxuICBcIm1vdGhlcmZ1Y2tlclwiLFxyXG4gIFwibW90aGVyZnVja2Vyc1wiLFxyXG4gIFwibW90aGVyZnVja2luXCIsXHJcbiAgXCJtb3RoZXJmdWNraW5nXCIsXHJcbiAgXCJtb3RoZXJmdWNraW5nc1wiLFxyXG4gIFwibW90aGVyZnVja2thXCIsXHJcbiAgXCJtb3RoZXJmdWNrc1wiLFxyXG4gIFwibXVmZlwiLFxyXG4gIFwibXV0aGFcIixcclxuICBcIm11dGhhZmVja2VyXCIsXHJcbiAgXCJtdXRoYWZ1Y2trZXJcIixcclxuICBcIm11dGhlclwiLFxyXG4gIFwibXV0aGVyZnVja2VyXCIsXHJcbiAgXCJuMWdnYVwiLFxyXG4gIFwibjFnZ2VyXCIsXHJcbiAgXCJuYXppXCIsXHJcbiAgXCJuaWdnM3JcIixcclxuICBcIm5pZ2c0aFwiLFxyXG4gIFwibmlnZ2FcIixcclxuICBcIm5pZ2dhaFwiLFxyXG4gIFwibmlnZ2FzXCIsXHJcbiAgXCJuaWdnYXpcIixcclxuICBcIm5pZ2dlclwiLFxyXG4gIFwibmlnZ2Vyc1wiLFxyXG4gIFwibm9iXCIsXHJcbiAgXCJub2Igam9rZXlcIixcclxuICBcIm5vYmhlYWRcIixcclxuICBcIm5vYmpvY2t5XCIsXHJcbiAgXCJub2Jqb2tleVwiLFxyXG4gIFwibnVtYm51dHNcIixcclxuICBcIm51dHNhY2tcIixcclxuICBcIm9yZ2FzaW1cIixcclxuICBcIm9yZ2FzaW1zXCIsXHJcbiAgXCJvcmdhc21cIixcclxuICBcIm9yZ2FzbXNcIixcclxuICBcInAwcm5cIixcclxuICBcInBhd25cIixcclxuICBcInBlY2tlclwiLFxyXG4gIFwicGVuaXNcIixcclxuICBcInBlbmlzZnVja2VyXCIsXHJcbiAgXCJwaG9uZXNleFwiLFxyXG4gIFwicGh1Y2tcIixcclxuICBcInBodWtcIixcclxuICBcInBodWtlZFwiLFxyXG4gIFwicGh1a2luZ1wiLFxyXG4gIFwicGh1a2tlZFwiLFxyXG4gIFwicGh1a2tpbmdcIixcclxuICBcInBodWtzXCIsXHJcbiAgXCJwaHVxXCIsXHJcbiAgXCJwaWdmdWNrZXJcIixcclxuICBcInBpbXBpc1wiLFxyXG4gIFwicGlzc1wiLFxyXG4gIFwicGlzc2VkXCIsXHJcbiAgXCJwaXNzZXJcIixcclxuICBcInBpc3NlcnNcIixcclxuICBcInBpc3Nlc1wiLFxyXG4gIFwicGlzc2ZsYXBzXCIsXHJcbiAgXCJwaXNzaW5cIixcclxuICBcInBpc3NpbmdcIixcclxuICBcInBpc3NvZmZcIixcclxuICBcInBvb3BcIixcclxuICBcInBvcm5cIixcclxuICBcInBvcm5vXCIsXHJcbiAgXCJwb3Jub2dyYXBoeVwiLFxyXG4gIFwicG9ybm9zXCIsXHJcbiAgXCJwcmlja1wiLFxyXG4gIFwicHJpY2tzXCIsXHJcbiAgXCJwcm9uXCIsXHJcbiAgXCJwdWJlXCIsXHJcbiAgXCJwdXNzZVwiLFxyXG4gIFwicHVzc2lcIixcclxuICBcInB1c3NpZXNcIixcclxuICBcInB1c3N5XCIsXHJcbiAgXCJwdXNzeXNcIixcclxuICBcInJlY3R1bVwiLFxyXG4gIFwicmV0YXJkXCIsXHJcbiAgXCJyaW1qYXdcIixcclxuICBcInJpbW1pbmdcIixcclxuICBcInMgaGl0XCIsXHJcbiAgXCJzLm8uYi5cIixcclxuICBcInNhZGlzdFwiLFxyXG4gIFwic2NobG9uZ1wiLFxyXG4gIFwic2NyZXdpbmdcIixcclxuICBcInNjcm9hdFwiLFxyXG4gIFwic2Nyb3RlXCIsXHJcbiAgXCJzY3JvdHVtXCIsXHJcbiAgXCJzZW1lblwiLFxyXG4gIFwic2V4XCIsXHJcbiAgXCJzaCErXCIsXHJcbiAgXCJzaCF0XCIsXHJcbiAgXCJzaDF0XCIsXHJcbiAgXCJzaGFnXCIsXHJcbiAgXCJzaGFnZ2VyXCIsXHJcbiAgXCJzaGFnZ2luXCIsXHJcbiAgXCJzaGFnZ2luZ1wiLFxyXG4gIFwic2hlbWFsZVwiLFxyXG4gIFwic2hpK1wiLFxyXG4gIFwic2hpdFwiLFxyXG4gIFwic2hpdGRpY2tcIixcclxuICBcInNoaXRlXCIsXHJcbiAgXCJzaGl0ZWRcIixcclxuICBcInNoaXRleVwiLFxyXG4gIFwic2hpdGZ1Y2tcIixcclxuICBcInNoaXRmdWxsXCIsXHJcbiAgXCJzaGl0aGVhZFwiLFxyXG4gIFwic2hpdGluZ1wiLFxyXG4gIFwic2hpdGluZ3NcIixcclxuICBcInNoaXRzXCIsXHJcbiAgXCJzaGl0dGVkXCIsXHJcbiAgXCJzaGl0dGVyXCIsXHJcbiAgXCJzaGl0dGVyc1wiLFxyXG4gIFwic2hpdHRpbmdcIixcclxuICBcInNoaXR0aW5nc1wiLFxyXG4gIFwic2hpdHR5XCIsXHJcbiAgXCJza2Fua1wiLFxyXG4gIFwic2x1dFwiLFxyXG4gIFwic2x1dHNcIixcclxuICBcInNtZWdtYVwiLFxyXG4gIFwic211dFwiLFxyXG4gIFwic25hdGNoXCIsXHJcbiAgXCJzb24tb2YtYS1iaXRjaFwiLFxyXG4gIFwic3BhY1wiLFxyXG4gIFwic3B1bmtcIixcclxuICBcInNfaF9pX3RcIixcclxuICBcInQxdHQxZTVcIixcclxuICBcInQxdHRpZXNcIixcclxuICBcInRlZXRzXCIsXHJcbiAgXCJ0ZWV6XCIsXHJcbiAgXCJ0ZXN0aWNhbFwiLFxyXG4gIFwidGVzdGljbGVcIixcclxuICBcInRpdFwiLFxyXG4gIFwidGl0ZnVja1wiLFxyXG4gIFwidGl0c1wiLFxyXG4gIFwidGl0dFwiLFxyXG4gIFwidGl0dGllNVwiLFxyXG4gIFwidGl0dGllZnVja2VyXCIsXHJcbiAgXCJ0aXR0aWVzXCIsXHJcbiAgXCJ0aXR0eWZ1Y2tcIixcclxuICBcInRpdHR5d2Fua1wiLFxyXG4gIFwidGl0d2Fua1wiLFxyXG4gIFwidG9zc2VyXCIsXHJcbiAgXCJ0dXJkXCIsXHJcbiAgXCJ0dzR0XCIsXHJcbiAgXCJ0d2F0XCIsXHJcbiAgXCJ0d2F0aGVhZFwiLFxyXG4gIFwidHdhdHR5XCIsXHJcbiAgXCJ0d3VudFwiLFxyXG4gIFwidHd1bnRlclwiLFxyXG4gIFwidjE0Z3JhXCIsXHJcbiAgXCJ2MWdyYVwiLFxyXG4gIFwidmFnaW5hXCIsXHJcbiAgXCJ2aWFncmFcIixcclxuICBcInZ1bHZhXCIsXHJcbiAgXCJ3MDBzZVwiLFxyXG4gIFwid2FuZ1wiLFxyXG4gIFwid2Fua1wiLFxyXG4gIFwid2Fua2VyXCIsXHJcbiAgXCJ3YW5reVwiLFxyXG4gIFwid2hvYXJcIixcclxuICBcIndob3JlXCIsXHJcbiAgXCJ3aWxsaWVzXCIsXHJcbiAgXCJ3aWxseVwiLFxyXG4gIFwieHJhdGVkXCIsXHJcbiAgXCJ4eHhcIlxyXG5dfSIsInZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcbnZhciBiYWR3b3JkcyA9IHJlcXVpcmUoJy4vYmFkd29yZHMuanNvbicpLmJhZHdvcmRzO1xyXG52YXIgVGV4dEZpbmRlciA9IHJlcXVpcmUoJy4vdGV4dGZpbmRlcicpO1xyXG5cclxuLy8gQ29uc3RydWN0b3JcclxuZnVuY3Rpb24gQmFkTGFuZ3VhZ2VGaWx0ZXIoKSB7XHJcblx0dGhpcy50ZXh0ZmluZGVyID0gbmV3IFRleHRGaW5kZXIoYmFkd29yZHMpO1xyXG59XHJcblxyXG4vLyBDaGVjayBpZiBhbnkgYmFkIHdvcmRzIGlzIGNvbnRhaW5lZCBpbiBjb250ZW50XHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuXHRyZXR1cm4gdGhpcy50ZXh0ZmluZGVyLmNvbnRhaW5zKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gQ2hlY2sgaWYgYW55IGJhZCB3b3JkcyBpcyBjb250YWluZWQgaW4gY29udGVudCBhbmQgcmV0dXJucyBhcnJheSBvZiB3b3Jkc1xyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiB0aGlzLnRleHRmaW5kZXIubWF0Y2hlcyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIFJlbW92ZSBiYWQgd29yZHMgZnJvbSBjb250ZW50XHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5yZW1vdmVXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiB0aGlzLnRleHRmaW5kZXIucmVtb3ZlV29yZHMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBSZXBsYWNlIGJhZCB3b3JkcyBmcm9tIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLnJlcGxhY2VXb3JkcyA9IGZ1bmN0aW9uKGNvbnRlbnQsIHJlcGxhY2VzdHIpIHtcclxuICAgIHJldHVybiB0aGlzLnRleHRmaW5kZXIucmVwbGFjZVdvcmRzKGNvbnRlbnQsIHJlcGxhY2VzdHIpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYWRMYW5ndWFnZUZpbHRlcjsiLCIvLyBDb25zdHJ1Y3RvclxyXG5mdW5jdGlvbiBUZXh0RmluZGVyKHdvcmRMaXN0KSB7XHJcbiAgdGhpcy53b3JkbGlzdCA9IHdvcmRMaXN0O1xyXG4gIHRoaXMuc2VhcmNoc3RyaW5nID0gbmV3IFJlZ0V4cCh3b3JkTGlzdC5qb2luKFwiIHxcIikucmVwbGFjZSgvW15cXHdcXHNefF0vZ2ksICcnKSwgJ2knKTtcclxuICB0aGlzLmdsb2JhbHNlYXJjaHN0cmluZyA9IG5ldyBSZWdFeHAod29yZExpc3Quam9pbihcIiB8XCIpLnJlcGxhY2UoL1teXFx3XFxzXnxdL2dpLCAnJyksICdnaScpO1xyXG5cclxufVxyXG4vLyBjbGFzcyBtZXRob2RzXHJcblRleHRGaW5kZXIucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGVudCkge1xyXG5cdHJldHVybiB0aGlzLnNlYXJjaHN0cmluZy50ZXN0KGNvbnRlbnQpO1xyXG59O1xyXG5cclxuVGV4dEZpbmRlci5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgIHJldHVybiBjb250ZW50Lm1hdGNoKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nKTtcclxufTtcclxuXHJcblRleHRGaW5kZXIucHJvdG90eXBlLnJlbW92ZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSh0aGlzLmdsb2JhbHNlYXJjaHN0cmluZywgJycpO1xyXG59O1xyXG5cclxuVGV4dEZpbmRlci5wcm90b3R5cGUucmVwbGFjZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCwgcmVwbGFjZXN0cikge1xyXG4gICAgcmV0dXJuIGNvbnRlbnQucmVwbGFjZSh0aGlzLmdsb2JhbHNlYXJjaHN0cmluZywgcmVwbGFjZXN0cik7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0RmluZGVyOyIsIiJdfQ==
