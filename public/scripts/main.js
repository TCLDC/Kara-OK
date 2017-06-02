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

		karaOK.getLyrics(trackID);
	});

	$("#addToPlaylist").on("click", function () {

		// Move the li add to DOM section to for loop so list is created from firebase
		var playlistAlbum = $("<h4>").text(karaOK.selectedAlbumName);
		var playlistArtist = $("<h3>").text(karaOK.selectedArtistName);
		var playlistTrack = $("<h2>").text(karaOK.selectedTrackName);
		var removePlaylistItem = $("<button>").addClass('removeButton').text('-');

		var playListItem = $("<li >").append(playlistTrack, playlistArtist, playlistAlbum, removePlaylistItem).addClass(playListItem);
		var safeListItem = {
			safeListAlbum: karaOK.selectedAlbumName,
			safelistArtist: karaOK.selectedArtistName,
			safeListTrack: karaOK.selectedTrackName
		};

		// 10. Allow user to save song to playlist
		console.log(playListItem);

		playlistRef.push(safeListItem);
		console.log("adding list", safeListItem);
		playlistRef.on('value', function (firebaseData) {
			var playlistData = firebaseData;
			var musicList = firebaseData.val();
			// console.log(musicList)
			for (var key in musicList) {
				console.log(key);
				console.log(musicList[key]);
				playListItem.data('firebaseId');
			}

			// console.log(firebaseData.val());
		});

		$(".safePlayList").append(playListItem);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFJLFNBQVMsRUFBYjs7QUFFQSxPQUFPLE1BQVAsR0FBZ0Isa0NBQWhCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsU0FBUSx5Q0FERztBQUVYLGFBQVksK0JBRkQ7QUFHWCxjQUFhLHNDQUhGO0FBSVgsWUFBVyxlQUpBO0FBS1gsZ0JBQWUsMkJBTEo7QUFNWCxvQkFBbUI7QUFOUixDQUFiO0FBUUEsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBLElBQU0sY0FBYyxTQUFTLFFBQVQsR0FBb0IsR0FBcEIsQ0FBd0IsV0FBeEIsQ0FBcEI7O0FBRUE7QUFDQSxJQUFJLFNBQVMsaUNBQWI7O0FBRUEsT0FBTyxJQUFQLEdBQWMsWUFBVztBQUN4QixRQUFPLGFBQVA7QUFDQSxRQUFPLFFBQVA7QUFDQSxDQUhEOztBQUtBLE9BQU8sUUFBUCxHQUFrQixZQUFXO0FBQzVCLEdBQUUsV0FBRixFQUFlLFFBQWYsQ0FBd0I7QUFDdkIsaUJBQWUsQ0FBQyxTQUFELEVBQVksU0FBWixFQUF1QixTQUF2QixFQUFrQyxTQUFsQztBQURRLEVBQXhCO0FBR0EsQ0FKRDs7QUFNQSxPQUFPLGFBQVAsR0FBdUIsWUFBWTs7QUFFbEM7QUFDQSxHQUFFLE1BQUYsRUFBVSxFQUFWLENBQWEsUUFBYixFQUF1QixVQUFTLEtBQVQsRUFBZ0I7O0FBRXRDLFFBQU0sY0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEJhZExhbmd1YWdlRmlsdGVyIGZyb20gJ2JhZC1sYW5ndWFnZS1maWx0ZXInO1xuXG52YXIga2FyYU9LID0ge307XG5cbmthcmFPSy5hcGlrZXkgPSAnMTJiMjdhODI5Y2FmNWMyZmJjMTU3NTFjNWExNjA5ZDEnO1xuXG4vLyBJbml0aWFsaXplIEZpcmViYXNlXG52YXIgY29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5QkFQNTVzOVlNZmQ0dWUySDhKSWN0dWU0S1ZIUk1hRW5vXCIsXG4gIGF1dGhEb21haW46IFwia2FyYS1vay1jOTRkOC5maXJlYmFzZWFwcC5jb21cIixcbiAgZGF0YWJhc2VVUkw6IFwiaHR0cHM6Ly9rYXJhLW9rLWM5NGQ4LmZpcmViYXNlaW8uY29tXCIsXG4gIHByb2plY3RJZDogXCJrYXJhLW9rLWM5NGQ4XCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwia2FyYS1vay1jOTRkOC5hcHBzcG90LmNvbVwiLFxuICBtZXNzYWdpbmdTZW5kZXJJZDogXCIxMDEyMTEyMjg2MjA0XCJcbn07XG5maXJlYmFzZS5pbml0aWFsaXplQXBwKGNvbmZpZyk7XG5cbmNvbnN0IHBsYXlsaXN0UmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoJy9wbGF5bGlzdCcpO1xuXG4vL2JhZCBsYW5ndWFnZSBmaWx0ZXJcbnZhciBmaWx0ZXIgPSBuZXcgQmFkTGFuZ3VhZ2VGaWx0ZXIoKTtcblxua2FyYU9LLmluaXQgPSBmdW5jdGlvbigpIHtcblx0a2FyYU9LLmV2ZW50SGFuZGxlcnMoKTtcblx0a2FyYU9LLmZ1bGxQYWdlKCk7XG59XG5cbmthcmFPSy5mdWxsUGFnZSA9IGZ1bmN0aW9uKCkge1xuXHQkKCcjZnVsbHBhZ2UnKS5mdWxscGFnZSh7XG5cdFx0c2VjdGlvbnNDb2xvcjogWycjNjVDNURGJywgJyMwMDRFN0InLCAnIzY1QzVERicsICcjMDA0RTdCJ10sXG5cdH0pO1xufVxuXG5rYXJhT0suZXZlbnRIYW5kbGVycyA9IGZ1bmN0aW9uICgpIHtcblxuXHQvLyAxLiBSZWNlaXZlIHVzZXIgaW5wdXQuXG5cdCQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyIHVzZXJUcmFja05hbWUgPSAkKCcudHJhY2tOYW1lJykudmFsKCk7XG5cdFx0dmFyIHVzZXJBcnRpc3ROYW1lID0gJCgnLmFydGlzdE5hbWUnKS52YWwoKTtcblx0XHR2YXIgdXNlckx5cmljc05hbWUgPSAkKCcubHlyaWNzTmFtZScpLnZhbCgpO1xuXG5cdFx0a2FyYU9LLmdldFNvbmdJbmZvKHVzZXJUcmFja05hbWUsIHVzZXJBcnRpc3ROYW1lLCB1c2VyTHlyaWNzTmFtZSk7XG5cblx0XHRjb25zb2xlLmxvZyh1c2VyQXJ0aXN0TmFtZSk7XG5cdH0pO1xuXG5cdC8vIDUuIFJlY2VpdmUgdXNlciBzZWxlY3Rpb24uXG5cdCQoJy5zb25nR2FsbGVyeScpLm9uKCdjbGljaycsICcuZ2FsbGVyeVVuaXQnLCBmdW5jdGlvbiAoKXtcblxuXHRcdHZhciB0cmFja0lEID0gJCh0aGlzKS5kYXRhKCd0cmFjay1pZCcpO1xuXG5cdFx0a2FyYU9LLnNlbGVjdGVkQWxidW1OYW1lID0gJCh0aGlzKS5maW5kKFwiaDRcIikudGV4dCgpO1xuXHRcdGthcmFPSy5zZWxlY3RlZEFydGlzdE5hbWUgPSAkKHRoaXMpLmZpbmQoXCJoM1wiKS50ZXh0KCk7XG5cdFx0a2FyYU9LLnNlbGVjdGVkVHJhY2tOYW1lID0gJCh0aGlzKS5maW5kKFwiaDJcIikudGV4dCgpO1xuXG5cdFx0a2FyYU9LLmdldEx5cmljcyh0cmFja0lEKTtcblxuXG5cdH0pO1xuXG5cdCQoXCIjYWRkVG9QbGF5bGlzdFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7XG5cdFx0XG5cdFx0Ly8gTW92ZSB0aGUgbGkgYWRkIHRvIERPTSBzZWN0aW9uIHRvIGZvciBsb29wIHNvIGxpc3QgaXMgY3JlYXRlZCBmcm9tIGZpcmViYXNlXG5cdFx0dmFyIHBsYXlsaXN0QWxidW0gPSAkKFwiPGg0PlwiKS50ZXh0KGthcmFPSy5zZWxlY3RlZEFsYnVtTmFtZSk7XG5cdFx0dmFyIHBsYXlsaXN0QXJ0aXN0ID0gJChcIjxoMz5cIikudGV4dChrYXJhT0suc2VsZWN0ZWRBcnRpc3ROYW1lKTsgXG5cdFx0dmFyIHBsYXlsaXN0VHJhY2sgPSAkKFwiPGgyPlwiKS50ZXh0KGthcmFPSy5zZWxlY3RlZFRyYWNrTmFtZSk7XG5cdFx0dmFyIHJlbW92ZVBsYXlsaXN0SXRlbSA9ICQoXCI8YnV0dG9uPlwiKS5hZGRDbGFzcygncmVtb3ZlQnV0dG9uJykudGV4dCgnLScpO1xuXG5cdFx0dmFyIHBsYXlMaXN0SXRlbSA9ICQoXCI8bGkgPlwiKS5hcHBlbmQocGxheWxpc3RUcmFjaywgcGxheWxpc3RBcnRpc3QsIHBsYXlsaXN0QWxidW0sIHJlbW92ZVBsYXlsaXN0SXRlbSlcblx0XHRcdC5hZGRDbGFzcyhwbGF5TGlzdEl0ZW0pO1xuXHRcdHZhciBzYWZlTGlzdEl0ZW0gPSB7XG5cdFx0XHRzYWZlTGlzdEFsYnVtOiBrYXJhT0suc2VsZWN0ZWRBbGJ1bU5hbWUsXG5cdFx0XHRzYWZlbGlzdEFydGlzdDoga2FyYU9LLnNlbGVjdGVkQXJ0aXN0TmFtZSxcblx0XHRcdHNhZmVMaXN0VHJhY2s6IGthcmFPSy5zZWxlY3RlZFRyYWNrTmFtZVxuXHRcdH07XG5cblx0XHQvLyAxMC4gQWxsb3cgdXNlciB0byBzYXZlIHNvbmcgdG8gcGxheWxpc3Rcblx0XHRjb25zb2xlLmxvZyhwbGF5TGlzdEl0ZW0pO1xuXG5cdFx0cGxheWxpc3RSZWYucHVzaChzYWZlTGlzdEl0ZW0pO1xuXHRcdGNvbnNvbGUubG9nKFwiYWRkaW5nIGxpc3RcIiwgc2FmZUxpc3RJdGVtKVxuXHRcdHBsYXlsaXN0UmVmLm9uKCd2YWx1ZScsIGZ1bmN0aW9uKGZpcmViYXNlRGF0YSkge1xuXHRcdFx0dmFyIHBsYXlsaXN0RGF0YSA9IGZpcmViYXNlRGF0YTtcblx0XHRcdHZhciBtdXNpY0xpc3QgPSBmaXJlYmFzZURhdGEudmFsKCk7XG5cdFx0XHQvLyBjb25zb2xlLmxvZyhtdXNpY0xpc3QpXG5cdFx0XHRmb3IgKGxldCBrZXkgaW4gbXVzaWNMaXN0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGtleSlcblx0XHRcdFx0Y29uc29sZS5sb2cobXVzaWNMaXN0W2tleV0pXG5cdFx0XHRcdHBsYXlMaXN0SXRlbS5kYXRhKCdmaXJlYmFzZUlkJywgKTtcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhmaXJlYmFzZURhdGEudmFsKCkpO1xuXHRcdH0pO1xuXG5cdFx0JChcIi5zYWZlUGxheUxpc3RcIikuYXBwZW5kKHBsYXlMaXN0SXRlbSk7XG5cdH0pO1xuXG5cdCQoJy5zb25nR2FsbGVyeScpLm9uKCdjbGljaycsICcucmVtb3ZlQnV0dG9uJywgZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNhZmVMaXN0UmVtb3ZlRGF0YSA9ICQodGhpcykuZGF0YSgnZmlyZWJhc2VJZCcpXG5cdFx0Y29uc3QgdG9kb1JlZiA9IGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGAvcGxheWxpc3QvJHtzYWZlTGlzdFJlbW92ZURhdGF9YCk7XG5cdFx0dG9kb1JlZi5yZW1vdmUoKTtcblx0fSk7XG5cbn1cblxuLy8gMi4gVXNlIHVzZXIgaW5wdXQgdG8gbWFrZSBBUEkgcmVxdWVzdC9BSkFYIHJlcXVlc3QuXG4vLyAzLiBGaWx0ZXIgdGhlIHJlc3VsdHMgKGllIHNlYXJjaCBieSBseXJpY3Mgb25seSwgbGFuZ3VhZ2UsIGZvcm1hdCBldGMpXG5rYXJhT0suZ2V0U29uZ0luZm8gPSBmdW5jdGlvbiAodHJhY2ssIGFydGlzdCwgbHlyaWNzKSB7XG5cdCQuYWpheCh7XG5cdFx0dXJsOiAnaHR0cDovL2FwaS5tdXNpeG1hdGNoLmNvbS93cy8xLjEvdHJhY2suc2VhcmNoJyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFwaWtleToga2FyYU9LLmFwaWtleSxcblx0XHRcdHFfdHJhY2s6IHRyYWNrLFxuXHRcdFx0cV9hcnRpc3Q6IGFydGlzdCxcblx0XHRcdHFfbHlyaWNzOiBseXJpY3MsXG5cdFx0XHRmX2hhc19seXJpY3M6ICcnLFxuXHRcdFx0Zl9seXJpY3NfbGFuZ3VhZ2U6ICdlbicsXG5cdFx0XHRmb3JtYXQ6ICdqc29ucCcsXG5cdFx0XHRwYWdlX3NpemU6IDEwXG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpe1xuXHRcdC8vIDQuIERpc3BsYXkgQVBJIHJlcXVlc3QgcmVzdWx0cyBvbiBzY3JlZW5cblx0XHQvLyBcdCh0cmFja19pZCwgdHJhY2tfbmFtZSwgZXhwbGljaXQsIGFsYnVtX25hbWUsIGFydGlzdF9uYW1lLCBhbGJ1bV9jb3ZlcmFydF8xMDB4MTAwLCB0cmFja19zaGFyZV91cmwpXG5cdFx0dmFyIHRyYWNrTGlzdCA9IHJlc3VsdC5tZXNzYWdlLmJvZHkudHJhY2tfbGlzdFxuXG5cdFx0dHJhY2tMaXN0LmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcblxuXHRcdFx0dmFyIGdhbGxlcnlVbml0ID0gJCgnPGxpPicpLmFkZENsYXNzKCdnYWxsZXJ5VW5pdCcpO1xuXG5cdFx0XHR2YXIgY292ZXJBcnQgPSAkKCc8aW1nPicpLmF0dHIoJ3NyYycsIHRyYWNrLnRyYWNrLmFsYnVtX2NvdmVyYXJ0XzEwMHgxMDApO1xuXHRcdFx0dmFyIGFsYnVtTmFtZSA9ICQoJzxoND4nKS50ZXh0KHRyYWNrLnRyYWNrLmFsYnVtX25hbWUpO1xuXHRcdFx0dmFyIGFydGlzdE5hbWUgPSAkKCc8aDM+JykudGV4dCh0cmFjay50cmFjay5hcnRpc3RfbmFtZSk7XG5cdFx0XHR2YXIgdHJhY2tOYW1lID0gJCgnPGgyPicpLnRleHQodHJhY2sudHJhY2sudHJhY2tfbmFtZSk7XG5cblx0XHRcdHZhciB0cmFja0lkID0gdHJhY2sudHJhY2sudHJhY2tfaWQ7XG5cblx0XHRcdGdhbGxlcnlVbml0LmRhdGEoJ3RyYWNrLWlkJywgdHJhY2tJZCk7XG5cdFx0XHRnYWxsZXJ5VW5pdC5hcHBlbmQoY292ZXJBcnQsIHRyYWNrTmFtZSwgYXJ0aXN0TmFtZSwgYWxidW1OYW1lKTtcblx0XHRcdC8vIHZhciBnYWxsZXJ5VW5pdEZpbmFsID0gZ2FsbGVyeVVuaXQuYXBwZW5kKGNvdmVyQXJ0LCB0cmFja05hbWUsIGFydGlzdE5hbWUsIGFsYnVtTmFtZSk7XG5cdFx0XHQkKCcuc29uZ0dhbGxlcnknKS5hcHBlbmQoZ2FsbGVyeVVuaXQpO1xuXHRcdFx0Ly8gJCgnLnNvbmdHYWxsZXJ5JykuYXBwZW5kKGdhbGxlcnlVbml0RmluYWwpO1xuXG5cdFx0fSk7XG5cblx0fSk7XG59XG5cbi8vIDYuIE1ha2UgQVBJIHJlcXVlc3QgdG8gdHJhY2subHlyaWNzLmdldCwgXG5rYXJhT0suZ2V0THlyaWNzID0gZnVuY3Rpb24gKHRyYWNrSWQpIHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwOi8vYXBpLm11c2l4bWF0Y2guY29tL3dzLzEuMS90cmFjay5seXJpY3MuZ2V0Jyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFwaWtleToga2FyYU9LLmFwaWtleSxcblx0XHRcdHRyYWNrX2lkOiB0cmFja0lkLFxuXHRcdFx0Zm9ybWF0OiAnanNvbnAnXG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG5cdFx0Ly8gY29uc29sZS5sb2cocmVzdWx0KTtcblx0XHR2YXIgbHlyaWNzID0gcmVzdWx0Lm1lc3NhZ2UuYm9keS5seXJpY3MubHlyaWNzX2JvZHk7XG5cdFx0Y29uc29sZS5sb2cobHlyaWNzKTtcblxuXHRcdC8vIDcuIFVzZSBqYXZhc2NyaXB0IGZpbHRlciB0byBzY2FuIHRoZSBseXJpY3MgZm9yIHByb2Zhbml0eS5cblx0XHR2YXIgZmlsdGVyU3dlYXIgPSAnJztcblx0XHR2YXIgZmlsdGVyU3dlYXIgPSBmaWx0ZXIuY29udGFpbnMobHlyaWNzKTtcblx0XHRjb25zb2xlLmxvZyhmaWx0ZXJTd2Vhcik7XG5cblx0XHQvLyA4LiBJRiB0aGVyZSBpcyBwcm9mYW5pdHkgZGlzcGxheSByZWQgKyBmZWVkYmFja1xuXHRcdGlmIChmaWx0ZXJTd2VhciA9PT0gdHJ1ZSkge1xuXHRcdFx0JCgnLm1vZGFsTm8nKS5hZGRDbGFzcygnbW9kYWxEaXNwbGF5Jyk7XG5cdFx0Ly8gOS4gSUYgRUxTRSBkaXNwbGF5IGdyZWVuICsgZmVlZGJhY2tcblx0XHR9IGVsc2UgaWYgKGZpbHRlclN3ZWFyID09PSBmYWxzZSkge1xuXHRcdFx0JCgnLm1vZGFsWWVzJykuYWRkQ2xhc3MoJ21vZGFsRGlzcGxheScpO1xuXHRcdH1cblx0fSk7XHRcbn1cblxua2FyYU9LLmFkZFRvUGxheWxpc3QgPSBmdW5jdGlvbigpe1xuXG59O1xuXG4kKGZ1bmN0aW9uKCl7XG5cdGthcmFPSy5pbml0KCk7XG59KTtcblxuIiwibW9kdWxlLmV4cG9ydHM9e1wiYmFkd29yZHNcIiA6IFtcIjRyNWVcIixcclxuIFwiNWgxdFwiLFxyXG4gXCI1aGl0XCIsXHJcbiBcImE1NVwiLFxyXG4gXCJhbmFsXCIsXHJcbiAgXCJhbnVzXCIsXHJcbiAgXCJhcjVlXCIsXHJcbiAgXCJhcnJzZVwiLFxyXG4gIFwiYXJzZVwiLFxyXG4gIFwiYXNzXCIsXHJcbiAgXCJhc3MtZnVja2VyXCIsXHJcbiAgXCJhc3Nlc1wiLFxyXG4gIFwiYXNzZnVja2VyXCIsXHJcbiAgXCJhc3NmdWtrYVwiLFxyXG4gIFwiYXNzaG9sZVwiLFxyXG4gIFwiYXNzaG9sZXNcIixcclxuICBcImFzc3dob2xlXCIsXHJcbiAgXCJhX3Nfc1wiLFxyXG4gIFwiYiF0Y2hcIixcclxuICBcImIwMGJzXCIsXHJcbiAgXCJiMTdjaFwiLFxyXG4gIFwiYjF0Y2hcIixcclxuICBcImJhbGxiYWdcIixcclxuICBcImJhbGxzXCIsXHJcbiAgXCJiYWxsc2Fja1wiLFxyXG4gIFwiYmFzdGFyZFwiLFxyXG4gIFwiYmVhc3RpYWxcIixcclxuICBcImJlYXN0aWFsaXR5XCIsXHJcbiAgXCJiZWxsZW5kXCIsXHJcbiAgXCJiZXN0aWFsXCIsXHJcbiAgXCJiZXN0aWFsaXR5XCIsXHJcbiAgXCJiaStjaFwiLFxyXG4gIFwiYmlhdGNoXCIsXHJcbiAgXCJiaXRjaFwiLFxyXG4gIFwiYml0Y2hlclwiLFxyXG4gIFwiYml0Y2hlcnNcIixcclxuICBcImJpdGNoZXNcIixcclxuICBcImJpdGNoaW5cIixcclxuICBcImJpdGNoaW5nXCIsXHJcbiAgXCJibG9vZHlcIixcclxuICBcImJsb3cgam9iXCIsXHJcbiAgXCJibG93am9iXCIsXHJcbiAgXCJibG93am9ic1wiLFxyXG4gIFwiYm9pb2xhc1wiLFxyXG4gIFwiYm9sbG9ja1wiLFxyXG4gIFwiYm9sbG9rXCIsXHJcbiAgXCJib25lclwiLFxyXG4gIFwiYm9vYlwiLFxyXG4gIFwiYm9vYnNcIixcclxuICBcImJvb29ic1wiLFxyXG4gIFwiYm9vb29ic1wiLFxyXG4gIFwiYm9vb29vYnNcIixcclxuICBcImJvb29vb29vYnNcIixcclxuICBcImJyZWFzdHNcIixcclxuICBcImJ1Y2V0YVwiLFxyXG4gIFwiYnVnZ2VyXCIsXHJcbiAgXCJidW1cIixcclxuICBcImJ1bm55IGZ1Y2tlclwiLFxyXG4gIFwiYnV0dFwiLFxyXG4gIFwiYnV0dGhvbGVcIixcclxuICBcImJ1dHRtdWNoXCIsXHJcbiAgXCJidXR0cGx1Z1wiLFxyXG4gIFwiYzBja1wiLFxyXG4gIFwiYzBja3N1Y2tlclwiLFxyXG4gIFwiY2FycGV0IG11bmNoZXJcIixcclxuICBcImNhd2tcIixcclxuICBcImNoaW5rXCIsXHJcbiAgXCJjaXBhXCIsXHJcbiAgXCJjbDF0XCIsXHJcbiAgXCJjbGl0XCIsXHJcbiAgXCJjbGl0b3Jpc1wiLFxyXG4gIFwiY2xpdHNcIixcclxuICBcImNudXRcIixcclxuICBcImNvY2tcIixcclxuICBcImNvY2stc3Vja2VyXCIsXHJcbiAgXCJjb2NrZmFjZVwiLFxyXG4gIFwiY29ja2hlYWRcIixcclxuICBcImNvY2ttdW5jaFwiLFxyXG4gIFwiY29ja211bmNoZXJcIixcclxuICBcImNvY2tzXCIsXHJcbiAgXCJjb2Nrc3Vja1wiLFxyXG4gIFwiY29ja3N1Y2tlZFwiLFxyXG4gIFwiY29ja3N1Y2tlclwiLFxyXG4gIFwiY29ja3N1Y2tpbmdcIixcclxuICBcImNvY2tzdWNrc1wiLFxyXG4gIFwiY29ja3N1a2FcIixcclxuICBcImNvY2tzdWtrYVwiLFxyXG4gIFwiY29rXCIsXHJcbiAgXCJjb2ttdW5jaGVyXCIsXHJcbiAgXCJjb2tzdWNrYVwiLFxyXG4gIFwiY29vblwiLFxyXG4gIFwiY294XCIsXHJcbiAgXCJjcmFwXCIsXHJcbiAgXCJjdW1cIixcclxuICBcImN1bW1lclwiLFxyXG4gIFwiY3VtbWluZ1wiLFxyXG4gIFwiY3Vtc1wiLFxyXG4gIFwiY3Vtc2hvdFwiLFxyXG4gIFwiY3VuaWxpbmd1c1wiLFxyXG4gIFwiY3VuaWxsaW5ndXNcIixcclxuICBcImN1bm5pbGluZ3VzXCIsXHJcbiAgXCJjdW50XCIsXHJcbiAgXCJjdW50bGlja1wiLFxyXG4gIFwiY3VudGxpY2tlclwiLFxyXG4gIFwiY3VudGxpY2tpbmdcIixcclxuICBcImN1bnRzXCIsXHJcbiAgXCJjeWFsaXNcIixcclxuICBcImN5YmVyZnVjXCIsXHJcbiAgXCJjeWJlcmZ1Y2tcIixcclxuICBcImN5YmVyZnVja2VkXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlclwiLFxyXG4gIFwiY3liZXJmdWNrZXJzXCIsXHJcbiAgXCJjeWJlcmZ1Y2tpbmdcIixcclxuICBcImQxY2tcIixcclxuICBcImRhbW5cIixcclxuICBcImRpY2tcIixcclxuICBcImRpY2toZWFkXCIsXHJcbiAgXCJkaWxkb1wiLFxyXG4gIFwiZGlsZG9zXCIsXHJcbiAgXCJkaW5rXCIsXHJcbiAgXCJkaW5rc1wiLFxyXG4gIFwiZGlyc2FcIixcclxuICBcImRsY2tcIixcclxuICBcImRvZy1mdWNrZXJcIixcclxuICBcImRvZ2dpblwiLFxyXG4gIFwiZG9nZ2luZ1wiLFxyXG4gIFwiZG9ua2V5cmliYmVyXCIsXHJcbiAgXCJkb29zaFwiLFxyXG4gIFwiZHVjaGVcIixcclxuICBcImR5a2VcIixcclxuICBcImVqYWN1bGF0ZVwiLFxyXG4gIFwiZWphY3VsYXRlZFwiLFxyXG4gIFwiZWphY3VsYXRlc1wiLFxyXG4gIFwiZWphY3VsYXRpbmdcIixcclxuICBcImVqYWN1bGF0aW5nc1wiLFxyXG4gIFwiZWphY3VsYXRpb25cIixcclxuICBcImVqYWt1bGF0ZVwiLFxyXG4gIFwiZiB1IGMga1wiLFxyXG4gIFwiZiB1IGMgayBlIHJcIixcclxuICBcImY0bm55XCIsXHJcbiAgXCJmYWdcIixcclxuICBcImZhZ2dpbmdcIixcclxuICBcImZhZ2dpdHRcIixcclxuICBcImZhZ2dvdFwiLFxyXG4gIFwiZmFnZ3NcIixcclxuICBcImZhZ290XCIsXHJcbiAgXCJmYWdvdHNcIixcclxuICBcImZhZ3NcIixcclxuICBcImZhbm55XCIsXHJcbiAgXCJmYW5ueWZsYXBzXCIsXHJcbiAgXCJmYW5ueWZ1Y2tlclwiLFxyXG4gIFwiZmFueXlcIixcclxuICBcImZhdGFzc1wiLFxyXG4gIFwiZmN1a1wiLFxyXG4gIFwiZmN1a2VyXCIsXHJcbiAgXCJmY3VraW5nXCIsXHJcbiAgXCJmZWNrXCIsXHJcbiAgXCJmZWNrZXJcIixcclxuICBcImZlbGNoaW5nXCIsXHJcbiAgXCJmZWxsYXRlXCIsXHJcbiAgXCJmZWxsYXRpb1wiLFxyXG4gIFwiZmluZ2VyZnVja1wiLFxyXG4gIFwiZmluZ2VyZnVja2VkXCIsXHJcbiAgXCJmaW5nZXJmdWNrZXJcIixcclxuICBcImZpbmdlcmZ1Y2tlcnNcIixcclxuICBcImZpbmdlcmZ1Y2tpbmdcIixcclxuICBcImZpbmdlcmZ1Y2tzXCIsXHJcbiAgXCJmaXN0ZnVja1wiLFxyXG4gIFwiZmlzdGZ1Y2tlZFwiLFxyXG4gIFwiZmlzdGZ1Y2tlclwiLFxyXG4gIFwiZmlzdGZ1Y2tlcnNcIixcclxuICBcImZpc3RmdWNraW5nXCIsXHJcbiAgXCJmaXN0ZnVja2luZ3NcIixcclxuICBcImZpc3RmdWNrc1wiLFxyXG4gIFwiZmxhbmdlXCIsXHJcbiAgXCJmb29rXCIsXHJcbiAgXCJmb29rZXJcIixcclxuICBcImZ1Y2tcIixcclxuICBcImZ1Y2thXCIsXHJcbiAgXCJmdWNrZWRcIixcclxuICBcImZ1Y2tlclwiLFxyXG4gIFwiZnVja2Vyc1wiLFxyXG4gIFwiZnVja2hlYWRcIixcclxuICBcImZ1Y2toZWFkc1wiLFxyXG4gIFwiZnVja2luXCIsXHJcbiAgXCJmdWNraW5nXCIsXHJcbiAgXCJmdWNraW5nc1wiLFxyXG4gIFwiZnVja2luZ3NoaXRtb3RoZXJmdWNrZXJcIixcclxuICBcImZ1Y2ttZVwiLFxyXG4gIFwiZnVja3NcIixcclxuICBcImZ1Y2t3aGl0XCIsXHJcbiAgXCJmdWNrd2l0XCIsXHJcbiAgXCJmdWRnZSBwYWNrZXJcIixcclxuICBcImZ1ZGdlcGFja2VyXCIsXHJcbiAgXCJmdWtcIixcclxuICBcImZ1a2VyXCIsXHJcbiAgXCJmdWtrZXJcIixcclxuICBcImZ1a2tpblwiLFxyXG4gIFwiZnVrc1wiLFxyXG4gIFwiZnVrd2hpdFwiLFxyXG4gIFwiZnVrd2l0XCIsXHJcbiAgXCJmdXhcIixcclxuICBcImZ1eDByXCIsXHJcbiAgXCJmX3VfY19rXCIsXHJcbiAgXCJnYW5nYmFuZ1wiLFxyXG4gIFwiZ2FuZ2JhbmdlZFwiLFxyXG4gIFwiZ2FuZ2JhbmdzXCIsXHJcbiAgXCJnYXlsb3JkXCIsXHJcbiAgXCJnYXlzZXhcIixcclxuICBcImdvYXRzZVwiLFxyXG4gIFwiR29kXCIsXHJcbiAgXCJnb2QtZGFtXCIsXHJcbiAgXCJnb2QtZGFtbmVkXCIsXHJcbiAgXCJnb2RkYW1uXCIsXHJcbiAgXCJnb2RkYW1uZWRcIixcclxuICBcImhhcmRjb3Jlc2V4XCIsXHJcbiAgXCJoZWxsXCIsXHJcbiAgXCJoZXNoZVwiLFxyXG4gIFwiaG9hclwiLFxyXG4gIFwiaG9hcmVcIixcclxuICBcImhvZXJcIixcclxuICBcImhvbW9cIixcclxuICBcImhvcmVcIixcclxuICBcImhvcm5pZXN0XCIsXHJcbiAgXCJob3JueVwiLFxyXG4gIFwiaG90c2V4XCIsXHJcbiAgXCJqYWNrLW9mZlwiLFxyXG4gIFwiamFja29mZlwiLFxyXG4gIFwiamFwXCIsXHJcbiAgXCJqZXJrLW9mZlwiLFxyXG4gIFwiamlzbVwiLFxyXG4gIFwiaml6XCIsXHJcbiAgXCJqaXptXCIsXHJcbiAgXCJqaXp6XCIsXHJcbiAgXCJrYXdrXCIsXHJcbiAgXCJrbm9iXCIsXHJcbiAgXCJrbm9iZWFkXCIsXHJcbiAgXCJrbm9iZWRcIixcclxuICBcImtub2JlbmRcIixcclxuICBcImtub2JoZWFkXCIsXHJcbiAgXCJrbm9iam9ja3lcIixcclxuICBcImtub2Jqb2tleVwiLFxyXG4gIFwia29ja1wiLFxyXG4gIFwia29uZHVtXCIsXHJcbiAgXCJrb25kdW1zXCIsXHJcbiAgXCJrdW1cIixcclxuICBcImt1bW1lclwiLFxyXG4gIFwia3VtbWluZ1wiLFxyXG4gIFwia3Vtc1wiLFxyXG4gIFwia3VuaWxpbmd1c1wiLFxyXG4gIFwibDNpK2NoXCIsXHJcbiAgXCJsM2l0Y2hcIixcclxuICBcImxhYmlhXCIsXHJcbiAgXCJsbWZhb1wiLFxyXG4gIFwibHVzdFwiLFxyXG4gIFwibHVzdGluZ1wiLFxyXG4gIFwibTBmMFwiLFxyXG4gIFwibTBmb1wiLFxyXG4gIFwibTQ1dGVyYmF0ZVwiLFxyXG4gIFwibWE1dGVyYjhcIixcclxuICBcIm1hNXRlcmJhdGVcIixcclxuICBcIm1hc29jaGlzdFwiLFxyXG4gIFwibWFzdGVyLWJhdGVcIixcclxuICBcIm1hc3RlcmI4XCIsXHJcbiAgXCJtYXN0ZXJiYXQqXCIsXHJcbiAgXCJtYXN0ZXJiYXQzXCIsXHJcbiAgXCJtYXN0ZXJiYXRlXCIsXHJcbiAgXCJtYXN0ZXJiYXRpb25cIixcclxuICBcIm1hc3RlcmJhdGlvbnNcIixcclxuICBcIm1hc3R1cmJhdGVcIixcclxuICBcIm1vLWZvXCIsXHJcbiAgXCJtb2YwXCIsXHJcbiAgXCJtb2ZvXCIsXHJcbiAgXCJtb3RoYWZ1Y2tcIixcclxuICBcIm1vdGhhZnVja2FcIixcclxuICBcIm1vdGhhZnVja2FzXCIsXHJcbiAgXCJtb3RoYWZ1Y2thelwiLFxyXG4gIFwibW90aGFmdWNrZWRcIixcclxuICBcIm1vdGhhZnVja2VyXCIsXHJcbiAgXCJtb3RoYWZ1Y2tlcnNcIixcclxuICBcIm1vdGhhZnVja2luXCIsXHJcbiAgXCJtb3RoYWZ1Y2tpbmdcIixcclxuICBcIm1vdGhhZnVja2luZ3NcIixcclxuICBcIm1vdGhhZnVja3NcIixcclxuICBcIm1vdGhlciBmdWNrZXJcIixcclxuICBcIm1vdGhlcmZ1Y2tcIixcclxuICBcIm1vdGhlcmZ1Y2tlZFwiLFxyXG4gIFwibW90aGVyZnVja2VyXCIsXHJcbiAgXCJtb3RoZXJmdWNrZXJzXCIsXHJcbiAgXCJtb3RoZXJmdWNraW5cIixcclxuICBcIm1vdGhlcmZ1Y2tpbmdcIixcclxuICBcIm1vdGhlcmZ1Y2tpbmdzXCIsXHJcbiAgXCJtb3RoZXJmdWNra2FcIixcclxuICBcIm1vdGhlcmZ1Y2tzXCIsXHJcbiAgXCJtdWZmXCIsXHJcbiAgXCJtdXRoYVwiLFxyXG4gIFwibXV0aGFmZWNrZXJcIixcclxuICBcIm11dGhhZnVja2tlclwiLFxyXG4gIFwibXV0aGVyXCIsXHJcbiAgXCJtdXRoZXJmdWNrZXJcIixcclxuICBcIm4xZ2dhXCIsXHJcbiAgXCJuMWdnZXJcIixcclxuICBcIm5hemlcIixcclxuICBcIm5pZ2czclwiLFxyXG4gIFwibmlnZzRoXCIsXHJcbiAgXCJuaWdnYVwiLFxyXG4gIFwibmlnZ2FoXCIsXHJcbiAgXCJuaWdnYXNcIixcclxuICBcIm5pZ2dhelwiLFxyXG4gIFwibmlnZ2VyXCIsXHJcbiAgXCJuaWdnZXJzXCIsXHJcbiAgXCJub2JcIixcclxuICBcIm5vYiBqb2tleVwiLFxyXG4gIFwibm9iaGVhZFwiLFxyXG4gIFwibm9iam9ja3lcIixcclxuICBcIm5vYmpva2V5XCIsXHJcbiAgXCJudW1ibnV0c1wiLFxyXG4gIFwibnV0c2Fja1wiLFxyXG4gIFwib3JnYXNpbVwiLFxyXG4gIFwib3JnYXNpbXNcIixcclxuICBcIm9yZ2FzbVwiLFxyXG4gIFwib3JnYXNtc1wiLFxyXG4gIFwicDByblwiLFxyXG4gIFwicGF3blwiLFxyXG4gIFwicGVja2VyXCIsXHJcbiAgXCJwZW5pc1wiLFxyXG4gIFwicGVuaXNmdWNrZXJcIixcclxuICBcInBob25lc2V4XCIsXHJcbiAgXCJwaHVja1wiLFxyXG4gIFwicGh1a1wiLFxyXG4gIFwicGh1a2VkXCIsXHJcbiAgXCJwaHVraW5nXCIsXHJcbiAgXCJwaHVra2VkXCIsXHJcbiAgXCJwaHVra2luZ1wiLFxyXG4gIFwicGh1a3NcIixcclxuICBcInBodXFcIixcclxuICBcInBpZ2Z1Y2tlclwiLFxyXG4gIFwicGltcGlzXCIsXHJcbiAgXCJwaXNzXCIsXHJcbiAgXCJwaXNzZWRcIixcclxuICBcInBpc3NlclwiLFxyXG4gIFwicGlzc2Vyc1wiLFxyXG4gIFwicGlzc2VzXCIsXHJcbiAgXCJwaXNzZmxhcHNcIixcclxuICBcInBpc3NpblwiLFxyXG4gIFwicGlzc2luZ1wiLFxyXG4gIFwicGlzc29mZlwiLFxyXG4gIFwicG9vcFwiLFxyXG4gIFwicG9yblwiLFxyXG4gIFwicG9ybm9cIixcclxuICBcInBvcm5vZ3JhcGh5XCIsXHJcbiAgXCJwb3Jub3NcIixcclxuICBcInByaWNrXCIsXHJcbiAgXCJwcmlja3NcIixcclxuICBcInByb25cIixcclxuICBcInB1YmVcIixcclxuICBcInB1c3NlXCIsXHJcbiAgXCJwdXNzaVwiLFxyXG4gIFwicHVzc2llc1wiLFxyXG4gIFwicHVzc3lcIixcclxuICBcInB1c3N5c1wiLFxyXG4gIFwicmVjdHVtXCIsXHJcbiAgXCJyZXRhcmRcIixcclxuICBcInJpbWphd1wiLFxyXG4gIFwicmltbWluZ1wiLFxyXG4gIFwicyBoaXRcIixcclxuICBcInMuby5iLlwiLFxyXG4gIFwic2FkaXN0XCIsXHJcbiAgXCJzY2hsb25nXCIsXHJcbiAgXCJzY3Jld2luZ1wiLFxyXG4gIFwic2Nyb2F0XCIsXHJcbiAgXCJzY3JvdGVcIixcclxuICBcInNjcm90dW1cIixcclxuICBcInNlbWVuXCIsXHJcbiAgXCJzZXhcIixcclxuICBcInNoIStcIixcclxuICBcInNoIXRcIixcclxuICBcInNoMXRcIixcclxuICBcInNoYWdcIixcclxuICBcInNoYWdnZXJcIixcclxuICBcInNoYWdnaW5cIixcclxuICBcInNoYWdnaW5nXCIsXHJcbiAgXCJzaGVtYWxlXCIsXHJcbiAgXCJzaGkrXCIsXHJcbiAgXCJzaGl0XCIsXHJcbiAgXCJzaGl0ZGlja1wiLFxyXG4gIFwic2hpdGVcIixcclxuICBcInNoaXRlZFwiLFxyXG4gIFwic2hpdGV5XCIsXHJcbiAgXCJzaGl0ZnVja1wiLFxyXG4gIFwic2hpdGZ1bGxcIixcclxuICBcInNoaXRoZWFkXCIsXHJcbiAgXCJzaGl0aW5nXCIsXHJcbiAgXCJzaGl0aW5nc1wiLFxyXG4gIFwic2hpdHNcIixcclxuICBcInNoaXR0ZWRcIixcclxuICBcInNoaXR0ZXJcIixcclxuICBcInNoaXR0ZXJzXCIsXHJcbiAgXCJzaGl0dGluZ1wiLFxyXG4gIFwic2hpdHRpbmdzXCIsXHJcbiAgXCJzaGl0dHlcIixcclxuICBcInNrYW5rXCIsXHJcbiAgXCJzbHV0XCIsXHJcbiAgXCJzbHV0c1wiLFxyXG4gIFwic21lZ21hXCIsXHJcbiAgXCJzbXV0XCIsXHJcbiAgXCJzbmF0Y2hcIixcclxuICBcInNvbi1vZi1hLWJpdGNoXCIsXHJcbiAgXCJzcGFjXCIsXHJcbiAgXCJzcHVua1wiLFxyXG4gIFwic19oX2lfdFwiLFxyXG4gIFwidDF0dDFlNVwiLFxyXG4gIFwidDF0dGllc1wiLFxyXG4gIFwidGVldHNcIixcclxuICBcInRlZXpcIixcclxuICBcInRlc3RpY2FsXCIsXHJcbiAgXCJ0ZXN0aWNsZVwiLFxyXG4gIFwidGl0XCIsXHJcbiAgXCJ0aXRmdWNrXCIsXHJcbiAgXCJ0aXRzXCIsXHJcbiAgXCJ0aXR0XCIsXHJcbiAgXCJ0aXR0aWU1XCIsXHJcbiAgXCJ0aXR0aWVmdWNrZXJcIixcclxuICBcInRpdHRpZXNcIixcclxuICBcInRpdHR5ZnVja1wiLFxyXG4gIFwidGl0dHl3YW5rXCIsXHJcbiAgXCJ0aXR3YW5rXCIsXHJcbiAgXCJ0b3NzZXJcIixcclxuICBcInR1cmRcIixcclxuICBcInR3NHRcIixcclxuICBcInR3YXRcIixcclxuICBcInR3YXRoZWFkXCIsXHJcbiAgXCJ0d2F0dHlcIixcclxuICBcInR3dW50XCIsXHJcbiAgXCJ0d3VudGVyXCIsXHJcbiAgXCJ2MTRncmFcIixcclxuICBcInYxZ3JhXCIsXHJcbiAgXCJ2YWdpbmFcIixcclxuICBcInZpYWdyYVwiLFxyXG4gIFwidnVsdmFcIixcclxuICBcIncwMHNlXCIsXHJcbiAgXCJ3YW5nXCIsXHJcbiAgXCJ3YW5rXCIsXHJcbiAgXCJ3YW5rZXJcIixcclxuICBcIndhbmt5XCIsXHJcbiAgXCJ3aG9hclwiLFxyXG4gIFwid2hvcmVcIixcclxuICBcIndpbGxpZXNcIixcclxuICBcIndpbGx5XCIsXHJcbiAgXCJ4cmF0ZWRcIixcclxuICBcInh4eFwiXHJcbl19IiwidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxudmFyIGJhZHdvcmRzID0gcmVxdWlyZSgnLi9iYWR3b3Jkcy5qc29uJykuYmFkd29yZHM7XHJcbnZhciBUZXh0RmluZGVyID0gcmVxdWlyZSgnLi90ZXh0ZmluZGVyJyk7XHJcblxyXG4vLyBDb25zdHJ1Y3RvclxyXG5mdW5jdGlvbiBCYWRMYW5ndWFnZUZpbHRlcigpIHtcclxuXHR0aGlzLnRleHRmaW5kZXIgPSBuZXcgVGV4dEZpbmRlcihiYWR3b3Jkcyk7XHJcbn1cclxuXHJcbi8vIENoZWNrIGlmIGFueSBiYWQgd29yZHMgaXMgY29udGFpbmVkIGluIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGVudCkge1xyXG5cdHJldHVybiB0aGlzLnRleHRmaW5kZXIuY29udGFpbnMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBDaGVjayBpZiBhbnkgYmFkIHdvcmRzIGlzIGNvbnRhaW5lZCBpbiBjb250ZW50IGFuZCByZXR1cm5zIGFycmF5IG9mIHdvcmRzXHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5tYXRjaGVzKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gUmVtb3ZlIGJhZCB3b3JkcyBmcm9tIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLnJlbW92ZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5yZW1vdmVXb3Jkcyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIFJlcGxhY2UgYmFkIHdvcmRzIGZyb20gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUucmVwbGFjZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCwgcmVwbGFjZXN0cikge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5yZXBsYWNlV29yZHMoY29udGVudCwgcmVwbGFjZXN0cik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhZExhbmd1YWdlRmlsdGVyOyIsIi8vIENvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIFRleHRGaW5kZXIod29yZExpc3QpIHtcclxuICB0aGlzLndvcmRsaXN0ID0gd29yZExpc3Q7XHJcbiAgdGhpcy5zZWFyY2hzdHJpbmcgPSBuZXcgUmVnRXhwKHdvcmRMaXN0LmpvaW4oXCIgfFwiKS5yZXBsYWNlKC9bXlxcd1xcc158XS9naSwgJycpLCAnaScpO1xyXG4gIHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nID0gbmV3IFJlZ0V4cCh3b3JkTGlzdC5qb2luKFwiIHxcIikucmVwbGFjZSgvW15cXHdcXHNefF0vZ2ksICcnKSwgJ2dpJyk7XHJcblxyXG59XHJcbi8vIGNsYXNzIG1ldGhvZHNcclxuVGV4dEZpbmRlci5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcblx0cmV0dXJuIHRoaXMuc2VhcmNoc3RyaW5nLnRlc3QoY29udGVudCk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIGNvbnRlbnQubWF0Y2godGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcpO1xyXG59O1xyXG5cclxuVGV4dEZpbmRlci5wcm90b3R5cGUucmVtb3ZlV29yZHMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nLCAnJyk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5yZXBsYWNlV29yZHMgPSBmdW5jdGlvbihjb250ZW50LCByZXBsYWNlc3RyKSB7XHJcbiAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nLCByZXBsYWNlc3RyKTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGaW5kZXI7IiwiIl19

