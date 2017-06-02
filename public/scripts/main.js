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

				var playListItem = $("<li>").append(playlistTrack, playlistArtist, playlistAlbum, removePlaylistItem).addClass('playListItem');

				playListItem = playListItem.data('firebaseId', key);
				$(".safePlayList").append(playListItem);
			}
		});
	});

	$('.safePlayList').on('click', '.removeButton', function () {
		console.log('clicked!');
		var safeListRemoveData = $(this).parent('.playListItem').data('firebaseId');
		console.log(safeListRemoveData);
		var playlistEntry = firebase.database().ref('/playlist/' + safeListRemoveData);
		playlistEntry.remove();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZXYvc2NyaXB0cy9tYWluLmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvYmFkd29yZHMuanNvbiIsIm5vZGVfbW9kdWxlcy9iYWQtbGFuZ3VhZ2UtZmlsdGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhZC1sYW5ndWFnZS1maWx0ZXIvdGV4dGZpbmRlci5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L2xpYi9fZW1wdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7Ozs7QUFFQSxJQUFJLFNBQVMsRUFBYjs7QUFFQSxPQUFPLE1BQVAsR0FBZ0Isa0NBQWhCOztBQUVBO0FBQ0EsSUFBSSxTQUFTO0FBQ1gsU0FBUSx5Q0FERztBQUVYLGFBQVksK0JBRkQ7QUFHWCxjQUFhLHNDQUhGO0FBSVgsWUFBVyxlQUpBO0FBS1gsZ0JBQWUsMkJBTEo7QUFNWCxvQkFBbUI7QUFOUixDQUFiO0FBUUEsU0FBUyxhQUFULENBQXVCLE1BQXZCOztBQUVBLElBQU0sY0FBYyxTQUFTLFFBQVQsR0FBb0IsR0FBcEIsQ0FBd0IsV0FBeEIsQ0FBcEI7O0FBRUE7QUFDQSxJQUFJLFNBQVMsaUNBQWI7O0FBRUEsT0FBTyxJQUFQLEdBQWMsWUFBVztBQUN4QixRQUFPLGFBQVA7QUFDQSxRQUFPLFFBQVA7QUFDQSxDQUhEOztBQUtBLE9BQU8sUUFBUCxHQUFrQixZQUFXO0FBQzVCLEdBQUUsV0FBRixFQUFlLFFBQWYsQ0FBd0IsRUFBeEI7QUFFQSxDQUhEOztBQUtBLE9BQU8sYUFBUCxHQUF1QixZQUFZOztBQUVsQztBQUNDLEdBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsS0FBVCxFQUFnQjtBQUN2QyxJQUFFLEVBQUYsQ0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixDQUFyQjtBQUNBLFFBQU0sY0FBTjtBQUNBLE1BQUksZ0JB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25jQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBCYWRMYW5ndWFnZUZpbHRlciBmcm9tICdiYWQtbGFuZ3VhZ2UtZmlsdGVyJztcblxudmFyIGthcmFPSyA9IHt9O1xuXG5rYXJhT0suYXBpa2V5ID0gJzEyYjI3YTgyOWNhZjVjMmZiYzE1NzUxYzVhMTYwOWQxJztcblxuLy8gSW5pdGlhbGl6ZSBGaXJlYmFzZVxudmFyIGNvbmZpZyA9IHtcbiAgYXBpS2V5OiBcIkFJemFTeUJBUDU1czlZTWZkNHVlMkg4SkljdHVlNEtWSFJNYUVub1wiLFxuICBhdXRoRG9tYWluOiBcImthcmEtb2stYzk0ZDguZmlyZWJhc2VhcHAuY29tXCIsXG4gIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8va2FyYS1vay1jOTRkOC5maXJlYmFzZWlvLmNvbVwiLFxuICBwcm9qZWN0SWQ6IFwia2FyYS1vay1jOTRkOFwiLFxuICBzdG9yYWdlQnVja2V0OiBcImthcmEtb2stYzk0ZDguYXBwc3BvdC5jb21cIixcbiAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiMTAxMjExMjI4NjIwNFwiXG59O1xuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChjb25maWcpO1xuXG5jb25zdCBwbGF5bGlzdFJlZiA9IGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKCcvcGxheWxpc3QnKTtcblxuLy9iYWQgbGFuZ3VhZ2UgZmlsdGVyXG52YXIgZmlsdGVyID0gbmV3IEJhZExhbmd1YWdlRmlsdGVyKCk7XG5cbmthcmFPSy5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGthcmFPSy5ldmVudEhhbmRsZXJzKCk7XG5cdGthcmFPSy5mdWxsUGFnZSgpO1xufVxuXG5rYXJhT0suZnVsbFBhZ2UgPSBmdW5jdGlvbigpIHtcblx0JCgnI2Z1bGxwYWdlJykuZnVsbHBhZ2Uoe1xuXHR9KTtcbn1cblxua2FyYU9LLmV2ZW50SGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG5cblx0Ly8gMS4gUmVjZWl2ZSB1c2VyIGlucHV0LlxuXHRcdCQoJ2Zvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZXZlbnQpIHtcblx0XHQkLmZuLmZ1bGxwYWdlLm1vdmVUbygzKTtcblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdHZhciB1c2VyVHJhY2tOYW1lID0gJCgnLnRyYWNrTmFtZScpLnZhbCgpO1xuXHRcdHZhciB1c2VyQXJ0aXN0TmFtZSA9ICQoJy5hcnRpc3ROYW1lJykudmFsKCk7XG5cdFx0dmFyIHVzZXJMeXJpY3NOYW1lID0gJCgnLmx5cmljc05hbWUnKS52YWwoKTtcblxuXHRcdGthcmFPSy5nZXRTb25nSW5mbyh1c2VyVHJhY2tOYW1lLCB1c2VyQXJ0aXN0TmFtZSwgdXNlckx5cmljc05hbWUpO1xuXG5cblx0XHQgIFxuXG5cblx0XHRcdFxuXHRcdGNvbnNvbGUubG9nKHVzZXJBcnRpc3ROYW1lKTtcblx0fSk7XG5cblx0Ly8gNS4gUmVjZWl2ZSB1c2VyIHNlbGVjdGlvbi5cblx0JCgnLnNvbmdHYWxsZXJ5Jykub24oJ2NsaWNrJywgJy5nYWxsZXJ5VW5pdCcsIGZ1bmN0aW9uICgpe1xuXG5cdFx0dmFyIHRyYWNrSUQgPSAkKHRoaXMpLmRhdGEoJ3RyYWNrLWlkJyk7XG5cblx0XHRrYXJhT0suc2VsZWN0ZWRBbGJ1bU5hbWUgPSAkKHRoaXMpLmZpbmQoXCIuYWxOYW1lXCIpLnRleHQoKTtcblx0XHRrYXJhT0suc2VsZWN0ZWRBcnRpc3ROYW1lID0gJCh0aGlzKS5maW5kKFwiLmFyTmFtZVwiKS50ZXh0KCk7XG5cdFx0a2FyYU9LLnNlbGVjdGVkVHJhY2tOYW1lID0gJCh0aGlzKS5maW5kKFwiLnRyTmFtZVwiKS50ZXh0KCk7XG5cblx0XHRrYXJhT0suZ2V0THlyaWNzKHRyYWNrSUQpO1xuXG5cblx0fSk7XG5cblx0JChcIiNhZGRUb1BsYXlsaXN0XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXtcblx0XHRcblx0XHQvLyBNb3ZlIHRoZSBsaSBhZGQgdG8gRE9NIHNlY3Rpb24gdG8gZm9yIGxvb3Agc28gbGlzdCBpcyBjcmVhdGVkIGZyb20gZmlyZWJhc2Vcblx0XHR2YXIgc2FmZUxpc3RJdGVtID0ge1xuXHRcdFx0c2FmZUxpc3RBbGJ1bToga2FyYU9LLnNlbGVjdGVkQWxidW1OYW1lLFxuXHRcdFx0c2FmZWxpc3RBcnRpc3Q6IGthcmFPSy5zZWxlY3RlZEFydGlzdE5hbWUsXG5cdFx0XHRzYWZlTGlzdFRyYWNrOiBrYXJhT0suc2VsZWN0ZWRUcmFja05hbWVcblx0XHR9O1xuXG5cdFx0Ly8gMTAuIEFsbG93IHVzZXIgdG8gc2F2ZSBzb25nIHRvIHBsYXlsaXN0XG5cdFx0cGxheWxpc3RSZWYucHVzaChzYWZlTGlzdEl0ZW0pO1xuXG5cdFx0cGxheWxpc3RSZWYub24oJ3ZhbHVlJywgZnVuY3Rpb24oZmlyZWJhc2VEYXRhKSB7XG5cdFx0XHRcblx0XHRcdHZhciBwbGF5bGlzdCA9IGZpcmViYXNlRGF0YS52YWwoKTtcblx0XHRcdFxuXHRcdFx0Zm9yIChsZXQga2V5IGluIHBsYXlsaXN0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKGtleSlcblx0XHRcdFx0Y29uc29sZS5sb2cocGxheWxpc3Rba2V5XSlcblxuXHRcdFx0XHR2YXIgcGxheWxpc3RBbGJ1bSA9ICQoXCI8cD5cIikudGV4dChwbGF5bGlzdFtrZXldLnNhZmVMaXN0QWxidW0pLmFkZENsYXNzKCdhbE5hbWUnKTtcblx0XHRcdFx0dmFyIHBsYXlsaXN0QXJ0aXN0ID0gJChcIjxwPlwiKS50ZXh0KHBsYXlsaXN0W2tleV0uc2FmZWxpc3RBcnRpc3QpLmFkZENsYXNzKCdhck5hbWUnKTsgXG5cdFx0XHRcdHZhciBwbGF5bGlzdFRyYWNrID0gJChcIjxwPlwiKS50ZXh0KHBsYXlsaXN0W2tleV0uc2FmZUxpc3RUcmFjaykuYWRkQ2xhc3MoJ3RyTmFtZScpO1xuXHRcdFx0XHR2YXIgcmVtb3ZlUGxheWxpc3RJdGVtID0gJChcIjxidXR0b24+XCIpLmFkZENsYXNzKCdyZW1vdmVCdXR0b24nKS50ZXh0KCctJyk7XG5cblx0XHRcdFx0dmFyIHBsYXlMaXN0SXRlbSA9ICQoXCI8bGk+XCIpLmFwcGVuZChwbGF5bGlzdFRyYWNrLCBwbGF5bGlzdEFydGlzdCwgcGxheWxpc3RBbGJ1bSwgcmVtb3ZlUGxheWxpc3RJdGVtKS5hZGRDbGFzcygncGxheUxpc3RJdGVtJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRwbGF5TGlzdEl0ZW0gPSBwbGF5TGlzdEl0ZW0uZGF0YSgnZmlyZWJhc2VJZCcsIGtleSk7XG5cdFx0XHRcdCQoXCIuc2FmZVBsYXlMaXN0XCIpLmFwcGVuZChwbGF5TGlzdEl0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0fSk7XG5cblx0fSk7XG5cblx0JCgnLnNhZmVQbGF5TGlzdCcpLm9uKCdjbGljaycsICcucmVtb3ZlQnV0dG9uJywgZnVuY3Rpb24oKSB7XG5cdFx0Y29uc29sZS5sb2coJ2NsaWNrZWQhJyk7XG5cdFx0dmFyIHNhZmVMaXN0UmVtb3ZlRGF0YSA9ICQodGhpcykucGFyZW50KCcucGxheUxpc3RJdGVtJykuZGF0YSgnZmlyZWJhc2VJZCcpO1xuXHRcdGNvbnNvbGUubG9nKHNhZmVMaXN0UmVtb3ZlRGF0YSk7XG5cdFx0Y29uc3QgcGxheWxpc3RFbnRyeSA9IGZpcmViYXNlLmRhdGFiYXNlKCkucmVmKGAvcGxheWxpc3QvJHtzYWZlTGlzdFJlbW92ZURhdGF9YCk7XG5cdFx0cGxheWxpc3RFbnRyeS5yZW1vdmUoKTtcblx0fSk7XG5cbn1cblxuLy8gMi4gVXNlIHVzZXIgaW5wdXQgdG8gbWFrZSBBUEkgcmVxdWVzdC9BSkFYIHJlcXVlc3QuXG4vLyAzLiBGaWx0ZXIgdGhlIHJlc3VsdHMgKGllIHNlYXJjaCBieSBseXJpY3Mgb25seSwgbGFuZ3VhZ2UsIGZvcm1hdCBldGMpXG5rYXJhT0suZ2V0U29uZ0luZm8gPSBmdW5jdGlvbiAodHJhY2ssIGFydGlzdCwgbHlyaWNzKSB7XG5cdCQuYWpheCh7XG5cdFx0dXJsOiAnaHR0cDovL2FwaS5tdXNpeG1hdGNoLmNvbS93cy8xLjEvdHJhY2suc2VhcmNoJyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFwaWtleToga2FyYU9LLmFwaWtleSxcblx0XHRcdHFfdHJhY2s6IHRyYWNrLFxuXHRcdFx0cV9hcnRpc3Q6IGFydGlzdCxcblx0XHRcdHFfbHlyaWNzOiBseXJpY3MsXG5cdFx0XHRmX2hhc19seXJpY3M6ICcnLFxuXHRcdFx0Zl9seXJpY3NfbGFuZ3VhZ2U6ICdlbicsXG5cdFx0XHRmb3JtYXQ6ICdqc29ucCcsXG5cdFx0XHRwYWdlX3NpemU6IDEwXG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpe1xuXHRcdC8vIDQuIERpc3BsYXkgQVBJIHJlcXVlc3QgcmVzdWx0cyBvbiBzY3JlZW5cblx0XHQvLyBcdCh0cmFja19pZCwgdHJhY2tfbmFtZSwgZXhwbGljaXQsIGFsYnVtX25hbWUsIGFydGlzdF9uYW1lLCBhbGJ1bV9jb3ZlcmFydF8xMDB4MTAwLCB0cmFja19zaGFyZV91cmwpXG5cdFx0dmFyIHRyYWNrTGlzdCA9IHJlc3VsdC5tZXNzYWdlLmJvZHkudHJhY2tfbGlzdFxuXG5cdFx0dHJhY2tMaXN0LmZvckVhY2goZnVuY3Rpb24odHJhY2spIHtcblxuXHRcdFx0dmFyIGdhbGxlcnlVbml0ID0gJCgnPGxpPicpLmFkZENsYXNzKCdnYWxsZXJ5VW5pdCcpO1xuXG5cdFx0XHR2YXIgY292ZXJBcnQgPSAkKCc8aW1nPicpLmF0dHIoJ3NyYycsIHRyYWNrLnRyYWNrLmFsYnVtX2NvdmVyYXJ0XzEwMHgxMDApO1xuXHRcdFx0dmFyIGFsYnVtTmFtZSA9ICQoJzxwPicpLnRleHQodHJhY2sudHJhY2suYWxidW1fbmFtZSkuYWRkQ2xhc3MoJ2FsTmFtZScpO1xuXHRcdFx0dmFyIGFydGlzdE5hbWUgPSAkKCc8cD4nKS50ZXh0KHRyYWNrLnRyYWNrLmFydGlzdF9uYW1lKS5hZGRDbGFzcygnYXJOYW1lJyk7XG5cdFx0XHR2YXIgdHJhY2tOYW1lID0gJCgnPHA+JykudGV4dCh0cmFjay50cmFjay50cmFja19uYW1lKS5hZGRDbGFzcygndHJOYW1lJyk7XG5cblx0XHRcdHZhciB0cmFja0lkID0gdHJhY2sudHJhY2sudHJhY2tfaWQ7XG5cblx0XHRcdGdhbGxlcnlVbml0LmRhdGEoJ3RyYWNrLWlkJywgdHJhY2tJZCk7XG5cdFx0XHRnYWxsZXJ5VW5pdC5hcHBlbmQoY292ZXJBcnQsIHRyYWNrTmFtZSwgYXJ0aXN0TmFtZSwgYWxidW1OYW1lKTtcblx0XHRcdC8vIHZhciBnYWxsZXJ5VW5pdEZpbmFsID0gZ2FsbGVyeVVuaXQuYXBwZW5kKGNvdmVyQXJ0LCB0cmFja05hbWUsIGFydGlzdE5hbWUsIGFsYnVtTmFtZSk7XG5cdFx0XHQkKCcuc29uZ0dhbGxlcnknKS5hcHBlbmQoZ2FsbGVyeVVuaXQpO1xuXHRcdFx0Ly8gJCgnLnNvbmdHYWxsZXJ5JykuYXBwZW5kKGdhbGxlcnlVbml0RmluYWwpO1xuXG5cdFx0fSk7XG5cblx0fSk7XG59XG5cbi8vIDYuIE1ha2UgQVBJIHJlcXVlc3QgdG8gdHJhY2subHlyaWNzLmdldCwgXG5rYXJhT0suZ2V0THlyaWNzID0gZnVuY3Rpb24gKHRyYWNrSWQpIHtcblx0JC5hamF4KHtcblx0XHR1cmw6ICdodHRwOi8vYXBpLm11c2l4bWF0Y2guY29tL3dzLzEuMS90cmFjay5seXJpY3MuZ2V0Jyxcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdGRhdGFUeXBlOiAnanNvbnAnLFxuXHRcdGRhdGE6IHtcblx0XHRcdGFwaWtleToga2FyYU9LLmFwaWtleSxcblx0XHRcdHRyYWNrX2lkOiB0cmFja0lkLFxuXHRcdFx0Zm9ybWF0OiAnanNvbnAnXG5cdFx0fVxuXHR9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdCl7XG5cdFx0Ly8gY29uc29sZS5sb2cocmVzdWx0KTtcblx0XHR2YXIgbHlyaWNzID0gcmVzdWx0Lm1lc3NhZ2UuYm9keS5seXJpY3MubHlyaWNzX2JvZHk7XG5cdFx0Y29uc29sZS5sb2cobHlyaWNzKTtcblxuXHRcdC8vIDcuIFVzZSBqYXZhc2NyaXB0IGZpbHRlciB0byBzY2FuIHRoZSBseXJpY3MgZm9yIHByb2Zhbml0eS5cblx0XHR2YXIgZmlsdGVyU3dlYXIgPSAnJztcblx0XHR2YXIgZmlsdGVyU3dlYXIgPSBmaWx0ZXIuY29udGFpbnMobHlyaWNzKTtcblx0XHRjb25zb2xlLmxvZyhmaWx0ZXJTd2Vhcik7XG5cblx0XHQvLyA4LiBJRiB0aGVyZSBpcyBwcm9mYW5pdHkgZGlzcGxheSByZWQgKyBmZWVkYmFja1xuXHRcdGlmIChmaWx0ZXJTd2VhciA9PT0gdHJ1ZSkge1xuXHRcdFx0JCgnLm1vZGFsTm8nKS5hZGRDbGFzcygnbW9kYWxEaXNwbGF5Jyk7XG5cdFx0Ly8gOS4gSUYgRUxTRSBkaXNwbGF5IGdyZWVuICsgZmVlZGJhY2tcblx0XHR9IGVsc2UgaWYgKGZpbHRlclN3ZWFyID09PSBmYWxzZSkge1xuXHRcdFx0JCgnLm1vZGFsWWVzJykuYWRkQ2xhc3MoJ21vZGFsRGlzcGxheScpO1xuXHRcdH1cblx0fSk7XHRcbn1cblxua2FyYU9LLmFkZFRvUGxheWxpc3QgPSBmdW5jdGlvbigpe1xuXG59O1xuXG4kKGZ1bmN0aW9uKCl7XG5cdGthcmFPSy5pbml0KCk7XG59KTtcblxuIiwibW9kdWxlLmV4cG9ydHM9e1wiYmFkd29yZHNcIiA6IFtcIjRyNWVcIixcclxuIFwiNWgxdFwiLFxyXG4gXCI1aGl0XCIsXHJcbiBcImE1NVwiLFxyXG4gXCJhbmFsXCIsXHJcbiAgXCJhbnVzXCIsXHJcbiAgXCJhcjVlXCIsXHJcbiAgXCJhcnJzZVwiLFxyXG4gIFwiYXJzZVwiLFxyXG4gIFwiYXNzXCIsXHJcbiAgXCJhc3MtZnVja2VyXCIsXHJcbiAgXCJhc3Nlc1wiLFxyXG4gIFwiYXNzZnVja2VyXCIsXHJcbiAgXCJhc3NmdWtrYVwiLFxyXG4gIFwiYXNzaG9sZVwiLFxyXG4gIFwiYXNzaG9sZXNcIixcclxuICBcImFzc3dob2xlXCIsXHJcbiAgXCJhX3Nfc1wiLFxyXG4gIFwiYiF0Y2hcIixcclxuICBcImIwMGJzXCIsXHJcbiAgXCJiMTdjaFwiLFxyXG4gIFwiYjF0Y2hcIixcclxuICBcImJhbGxiYWdcIixcclxuICBcImJhbGxzXCIsXHJcbiAgXCJiYWxsc2Fja1wiLFxyXG4gIFwiYmFzdGFyZFwiLFxyXG4gIFwiYmVhc3RpYWxcIixcclxuICBcImJlYXN0aWFsaXR5XCIsXHJcbiAgXCJiZWxsZW5kXCIsXHJcbiAgXCJiZXN0aWFsXCIsXHJcbiAgXCJiZXN0aWFsaXR5XCIsXHJcbiAgXCJiaStjaFwiLFxyXG4gIFwiYmlhdGNoXCIsXHJcbiAgXCJiaXRjaFwiLFxyXG4gIFwiYml0Y2hlclwiLFxyXG4gIFwiYml0Y2hlcnNcIixcclxuICBcImJpdGNoZXNcIixcclxuICBcImJpdGNoaW5cIixcclxuICBcImJpdGNoaW5nXCIsXHJcbiAgXCJibG9vZHlcIixcclxuICBcImJsb3cgam9iXCIsXHJcbiAgXCJibG93am9iXCIsXHJcbiAgXCJibG93am9ic1wiLFxyXG4gIFwiYm9pb2xhc1wiLFxyXG4gIFwiYm9sbG9ja1wiLFxyXG4gIFwiYm9sbG9rXCIsXHJcbiAgXCJib25lclwiLFxyXG4gIFwiYm9vYlwiLFxyXG4gIFwiYm9vYnNcIixcclxuICBcImJvb29ic1wiLFxyXG4gIFwiYm9vb29ic1wiLFxyXG4gIFwiYm9vb29vYnNcIixcclxuICBcImJvb29vb29vYnNcIixcclxuICBcImJyZWFzdHNcIixcclxuICBcImJ1Y2V0YVwiLFxyXG4gIFwiYnVnZ2VyXCIsXHJcbiAgXCJidW1cIixcclxuICBcImJ1bm55IGZ1Y2tlclwiLFxyXG4gIFwiYnV0dFwiLFxyXG4gIFwiYnV0dGhvbGVcIixcclxuICBcImJ1dHRtdWNoXCIsXHJcbiAgXCJidXR0cGx1Z1wiLFxyXG4gIFwiYzBja1wiLFxyXG4gIFwiYzBja3N1Y2tlclwiLFxyXG4gIFwiY2FycGV0IG11bmNoZXJcIixcclxuICBcImNhd2tcIixcclxuICBcImNoaW5rXCIsXHJcbiAgXCJjaXBhXCIsXHJcbiAgXCJjbDF0XCIsXHJcbiAgXCJjbGl0XCIsXHJcbiAgXCJjbGl0b3Jpc1wiLFxyXG4gIFwiY2xpdHNcIixcclxuICBcImNudXRcIixcclxuICBcImNvY2tcIixcclxuICBcImNvY2stc3Vja2VyXCIsXHJcbiAgXCJjb2NrZmFjZVwiLFxyXG4gIFwiY29ja2hlYWRcIixcclxuICBcImNvY2ttdW5jaFwiLFxyXG4gIFwiY29ja211bmNoZXJcIixcclxuICBcImNvY2tzXCIsXHJcbiAgXCJjb2Nrc3Vja1wiLFxyXG4gIFwiY29ja3N1Y2tlZFwiLFxyXG4gIFwiY29ja3N1Y2tlclwiLFxyXG4gIFwiY29ja3N1Y2tpbmdcIixcclxuICBcImNvY2tzdWNrc1wiLFxyXG4gIFwiY29ja3N1a2FcIixcclxuICBcImNvY2tzdWtrYVwiLFxyXG4gIFwiY29rXCIsXHJcbiAgXCJjb2ttdW5jaGVyXCIsXHJcbiAgXCJjb2tzdWNrYVwiLFxyXG4gIFwiY29vblwiLFxyXG4gIFwiY294XCIsXHJcbiAgXCJjcmFwXCIsXHJcbiAgXCJjdW1cIixcclxuICBcImN1bW1lclwiLFxyXG4gIFwiY3VtbWluZ1wiLFxyXG4gIFwiY3Vtc1wiLFxyXG4gIFwiY3Vtc2hvdFwiLFxyXG4gIFwiY3VuaWxpbmd1c1wiLFxyXG4gIFwiY3VuaWxsaW5ndXNcIixcclxuICBcImN1bm5pbGluZ3VzXCIsXHJcbiAgXCJjdW50XCIsXHJcbiAgXCJjdW50bGlja1wiLFxyXG4gIFwiY3VudGxpY2tlclwiLFxyXG4gIFwiY3VudGxpY2tpbmdcIixcclxuICBcImN1bnRzXCIsXHJcbiAgXCJjeWFsaXNcIixcclxuICBcImN5YmVyZnVjXCIsXHJcbiAgXCJjeWJlcmZ1Y2tcIixcclxuICBcImN5YmVyZnVja2VkXCIsXHJcbiAgXCJjeWJlcmZ1Y2tlclwiLFxyXG4gIFwiY3liZXJmdWNrZXJzXCIsXHJcbiAgXCJjeWJlcmZ1Y2tpbmdcIixcclxuICBcImQxY2tcIixcclxuICBcImRhbW5cIixcclxuICBcImRpY2tcIixcclxuICBcImRpY2toZWFkXCIsXHJcbiAgXCJkaWxkb1wiLFxyXG4gIFwiZGlsZG9zXCIsXHJcbiAgXCJkaW5rXCIsXHJcbiAgXCJkaW5rc1wiLFxyXG4gIFwiZGlyc2FcIixcclxuICBcImRsY2tcIixcclxuICBcImRvZy1mdWNrZXJcIixcclxuICBcImRvZ2dpblwiLFxyXG4gIFwiZG9nZ2luZ1wiLFxyXG4gIFwiZG9ua2V5cmliYmVyXCIsXHJcbiAgXCJkb29zaFwiLFxyXG4gIFwiZHVjaGVcIixcclxuICBcImR5a2VcIixcclxuICBcImVqYWN1bGF0ZVwiLFxyXG4gIFwiZWphY3VsYXRlZFwiLFxyXG4gIFwiZWphY3VsYXRlc1wiLFxyXG4gIFwiZWphY3VsYXRpbmdcIixcclxuICBcImVqYWN1bGF0aW5nc1wiLFxyXG4gIFwiZWphY3VsYXRpb25cIixcclxuICBcImVqYWt1bGF0ZVwiLFxyXG4gIFwiZiB1IGMga1wiLFxyXG4gIFwiZiB1IGMgayBlIHJcIixcclxuICBcImY0bm55XCIsXHJcbiAgXCJmYWdcIixcclxuICBcImZhZ2dpbmdcIixcclxuICBcImZhZ2dpdHRcIixcclxuICBcImZhZ2dvdFwiLFxyXG4gIFwiZmFnZ3NcIixcclxuICBcImZhZ290XCIsXHJcbiAgXCJmYWdvdHNcIixcclxuICBcImZhZ3NcIixcclxuICBcImZhbm55XCIsXHJcbiAgXCJmYW5ueWZsYXBzXCIsXHJcbiAgXCJmYW5ueWZ1Y2tlclwiLFxyXG4gIFwiZmFueXlcIixcclxuICBcImZhdGFzc1wiLFxyXG4gIFwiZmN1a1wiLFxyXG4gIFwiZmN1a2VyXCIsXHJcbiAgXCJmY3VraW5nXCIsXHJcbiAgXCJmZWNrXCIsXHJcbiAgXCJmZWNrZXJcIixcclxuICBcImZlbGNoaW5nXCIsXHJcbiAgXCJmZWxsYXRlXCIsXHJcbiAgXCJmZWxsYXRpb1wiLFxyXG4gIFwiZmluZ2VyZnVja1wiLFxyXG4gIFwiZmluZ2VyZnVja2VkXCIsXHJcbiAgXCJmaW5nZXJmdWNrZXJcIixcclxuICBcImZpbmdlcmZ1Y2tlcnNcIixcclxuICBcImZpbmdlcmZ1Y2tpbmdcIixcclxuICBcImZpbmdlcmZ1Y2tzXCIsXHJcbiAgXCJmaXN0ZnVja1wiLFxyXG4gIFwiZmlzdGZ1Y2tlZFwiLFxyXG4gIFwiZmlzdGZ1Y2tlclwiLFxyXG4gIFwiZmlzdGZ1Y2tlcnNcIixcclxuICBcImZpc3RmdWNraW5nXCIsXHJcbiAgXCJmaXN0ZnVja2luZ3NcIixcclxuICBcImZpc3RmdWNrc1wiLFxyXG4gIFwiZmxhbmdlXCIsXHJcbiAgXCJmb29rXCIsXHJcbiAgXCJmb29rZXJcIixcclxuICBcImZ1Y2tcIixcclxuICBcImZ1Y2thXCIsXHJcbiAgXCJmdWNrZWRcIixcclxuICBcImZ1Y2tlclwiLFxyXG4gIFwiZnVja2Vyc1wiLFxyXG4gIFwiZnVja2hlYWRcIixcclxuICBcImZ1Y2toZWFkc1wiLFxyXG4gIFwiZnVja2luXCIsXHJcbiAgXCJmdWNraW5nXCIsXHJcbiAgXCJmdWNraW5nc1wiLFxyXG4gIFwiZnVja2luZ3NoaXRtb3RoZXJmdWNrZXJcIixcclxuICBcImZ1Y2ttZVwiLFxyXG4gIFwiZnVja3NcIixcclxuICBcImZ1Y2t3aGl0XCIsXHJcbiAgXCJmdWNrd2l0XCIsXHJcbiAgXCJmdWRnZSBwYWNrZXJcIixcclxuICBcImZ1ZGdlcGFja2VyXCIsXHJcbiAgXCJmdWtcIixcclxuICBcImZ1a2VyXCIsXHJcbiAgXCJmdWtrZXJcIixcclxuICBcImZ1a2tpblwiLFxyXG4gIFwiZnVrc1wiLFxyXG4gIFwiZnVrd2hpdFwiLFxyXG4gIFwiZnVrd2l0XCIsXHJcbiAgXCJmdXhcIixcclxuICBcImZ1eDByXCIsXHJcbiAgXCJmX3VfY19rXCIsXHJcbiAgXCJnYW5nYmFuZ1wiLFxyXG4gIFwiZ2FuZ2JhbmdlZFwiLFxyXG4gIFwiZ2FuZ2JhbmdzXCIsXHJcbiAgXCJnYXlsb3JkXCIsXHJcbiAgXCJnYXlzZXhcIixcclxuICBcImdvYXRzZVwiLFxyXG4gIFwiR29kXCIsXHJcbiAgXCJnb2QtZGFtXCIsXHJcbiAgXCJnb2QtZGFtbmVkXCIsXHJcbiAgXCJnb2RkYW1uXCIsXHJcbiAgXCJnb2RkYW1uZWRcIixcclxuICBcImhhcmRjb3Jlc2V4XCIsXHJcbiAgXCJoZWxsXCIsXHJcbiAgXCJoZXNoZVwiLFxyXG4gIFwiaG9hclwiLFxyXG4gIFwiaG9hcmVcIixcclxuICBcImhvZXJcIixcclxuICBcImhvbW9cIixcclxuICBcImhvcmVcIixcclxuICBcImhvcm5pZXN0XCIsXHJcbiAgXCJob3JueVwiLFxyXG4gIFwiaG90c2V4XCIsXHJcbiAgXCJqYWNrLW9mZlwiLFxyXG4gIFwiamFja29mZlwiLFxyXG4gIFwiamFwXCIsXHJcbiAgXCJqZXJrLW9mZlwiLFxyXG4gIFwiamlzbVwiLFxyXG4gIFwiaml6XCIsXHJcbiAgXCJqaXptXCIsXHJcbiAgXCJqaXp6XCIsXHJcbiAgXCJrYXdrXCIsXHJcbiAgXCJrbm9iXCIsXHJcbiAgXCJrbm9iZWFkXCIsXHJcbiAgXCJrbm9iZWRcIixcclxuICBcImtub2JlbmRcIixcclxuICBcImtub2JoZWFkXCIsXHJcbiAgXCJrbm9iam9ja3lcIixcclxuICBcImtub2Jqb2tleVwiLFxyXG4gIFwia29ja1wiLFxyXG4gIFwia29uZHVtXCIsXHJcbiAgXCJrb25kdW1zXCIsXHJcbiAgXCJrdW1cIixcclxuICBcImt1bW1lclwiLFxyXG4gIFwia3VtbWluZ1wiLFxyXG4gIFwia3Vtc1wiLFxyXG4gIFwia3VuaWxpbmd1c1wiLFxyXG4gIFwibDNpK2NoXCIsXHJcbiAgXCJsM2l0Y2hcIixcclxuICBcImxhYmlhXCIsXHJcbiAgXCJsbWZhb1wiLFxyXG4gIFwibHVzdFwiLFxyXG4gIFwibHVzdGluZ1wiLFxyXG4gIFwibTBmMFwiLFxyXG4gIFwibTBmb1wiLFxyXG4gIFwibTQ1dGVyYmF0ZVwiLFxyXG4gIFwibWE1dGVyYjhcIixcclxuICBcIm1hNXRlcmJhdGVcIixcclxuICBcIm1hc29jaGlzdFwiLFxyXG4gIFwibWFzdGVyLWJhdGVcIixcclxuICBcIm1hc3RlcmI4XCIsXHJcbiAgXCJtYXN0ZXJiYXQqXCIsXHJcbiAgXCJtYXN0ZXJiYXQzXCIsXHJcbiAgXCJtYXN0ZXJiYXRlXCIsXHJcbiAgXCJtYXN0ZXJiYXRpb25cIixcclxuICBcIm1hc3RlcmJhdGlvbnNcIixcclxuICBcIm1hc3R1cmJhdGVcIixcclxuICBcIm1vLWZvXCIsXHJcbiAgXCJtb2YwXCIsXHJcbiAgXCJtb2ZvXCIsXHJcbiAgXCJtb3RoYWZ1Y2tcIixcclxuICBcIm1vdGhhZnVja2FcIixcclxuICBcIm1vdGhhZnVja2FzXCIsXHJcbiAgXCJtb3RoYWZ1Y2thelwiLFxyXG4gIFwibW90aGFmdWNrZWRcIixcclxuICBcIm1vdGhhZnVja2VyXCIsXHJcbiAgXCJtb3RoYWZ1Y2tlcnNcIixcclxuICBcIm1vdGhhZnVja2luXCIsXHJcbiAgXCJtb3RoYWZ1Y2tpbmdcIixcclxuICBcIm1vdGhhZnVja2luZ3NcIixcclxuICBcIm1vdGhhZnVja3NcIixcclxuICBcIm1vdGhlciBmdWNrZXJcIixcclxuICBcIm1vdGhlcmZ1Y2tcIixcclxuICBcIm1vdGhlcmZ1Y2tlZFwiLFxyXG4gIFwibW90aGVyZnVja2VyXCIsXHJcbiAgXCJtb3RoZXJmdWNrZXJzXCIsXHJcbiAgXCJtb3RoZXJmdWNraW5cIixcclxuICBcIm1vdGhlcmZ1Y2tpbmdcIixcclxuICBcIm1vdGhlcmZ1Y2tpbmdzXCIsXHJcbiAgXCJtb3RoZXJmdWNra2FcIixcclxuICBcIm1vdGhlcmZ1Y2tzXCIsXHJcbiAgXCJtdWZmXCIsXHJcbiAgXCJtdXRoYVwiLFxyXG4gIFwibXV0aGFmZWNrZXJcIixcclxuICBcIm11dGhhZnVja2tlclwiLFxyXG4gIFwibXV0aGVyXCIsXHJcbiAgXCJtdXRoZXJmdWNrZXJcIixcclxuICBcIm4xZ2dhXCIsXHJcbiAgXCJuMWdnZXJcIixcclxuICBcIm5hemlcIixcclxuICBcIm5pZ2czclwiLFxyXG4gIFwibmlnZzRoXCIsXHJcbiAgXCJuaWdnYVwiLFxyXG4gIFwibmlnZ2FoXCIsXHJcbiAgXCJuaWdnYXNcIixcclxuICBcIm5pZ2dhelwiLFxyXG4gIFwibmlnZ2VyXCIsXHJcbiAgXCJuaWdnZXJzXCIsXHJcbiAgXCJub2JcIixcclxuICBcIm5vYiBqb2tleVwiLFxyXG4gIFwibm9iaGVhZFwiLFxyXG4gIFwibm9iam9ja3lcIixcclxuICBcIm5vYmpva2V5XCIsXHJcbiAgXCJudW1ibnV0c1wiLFxyXG4gIFwibnV0c2Fja1wiLFxyXG4gIFwib3JnYXNpbVwiLFxyXG4gIFwib3JnYXNpbXNcIixcclxuICBcIm9yZ2FzbVwiLFxyXG4gIFwib3JnYXNtc1wiLFxyXG4gIFwicDByblwiLFxyXG4gIFwicGF3blwiLFxyXG4gIFwicGVja2VyXCIsXHJcbiAgXCJwZW5pc1wiLFxyXG4gIFwicGVuaXNmdWNrZXJcIixcclxuICBcInBob25lc2V4XCIsXHJcbiAgXCJwaHVja1wiLFxyXG4gIFwicGh1a1wiLFxyXG4gIFwicGh1a2VkXCIsXHJcbiAgXCJwaHVraW5nXCIsXHJcbiAgXCJwaHVra2VkXCIsXHJcbiAgXCJwaHVra2luZ1wiLFxyXG4gIFwicGh1a3NcIixcclxuICBcInBodXFcIixcclxuICBcInBpZ2Z1Y2tlclwiLFxyXG4gIFwicGltcGlzXCIsXHJcbiAgXCJwaXNzXCIsXHJcbiAgXCJwaXNzZWRcIixcclxuICBcInBpc3NlclwiLFxyXG4gIFwicGlzc2Vyc1wiLFxyXG4gIFwicGlzc2VzXCIsXHJcbiAgXCJwaXNzZmxhcHNcIixcclxuICBcInBpc3NpblwiLFxyXG4gIFwicGlzc2luZ1wiLFxyXG4gIFwicGlzc29mZlwiLFxyXG4gIFwicG9vcFwiLFxyXG4gIFwicG9yblwiLFxyXG4gIFwicG9ybm9cIixcclxuICBcInBvcm5vZ3JhcGh5XCIsXHJcbiAgXCJwb3Jub3NcIixcclxuICBcInByaWNrXCIsXHJcbiAgXCJwcmlja3NcIixcclxuICBcInByb25cIixcclxuICBcInB1YmVcIixcclxuICBcInB1c3NlXCIsXHJcbiAgXCJwdXNzaVwiLFxyXG4gIFwicHVzc2llc1wiLFxyXG4gIFwicHVzc3lcIixcclxuICBcInB1c3N5c1wiLFxyXG4gIFwicmVjdHVtXCIsXHJcbiAgXCJyZXRhcmRcIixcclxuICBcInJpbWphd1wiLFxyXG4gIFwicmltbWluZ1wiLFxyXG4gIFwicyBoaXRcIixcclxuICBcInMuby5iLlwiLFxyXG4gIFwic2FkaXN0XCIsXHJcbiAgXCJzY2hsb25nXCIsXHJcbiAgXCJzY3Jld2luZ1wiLFxyXG4gIFwic2Nyb2F0XCIsXHJcbiAgXCJzY3JvdGVcIixcclxuICBcInNjcm90dW1cIixcclxuICBcInNlbWVuXCIsXHJcbiAgXCJzZXhcIixcclxuICBcInNoIStcIixcclxuICBcInNoIXRcIixcclxuICBcInNoMXRcIixcclxuICBcInNoYWdcIixcclxuICBcInNoYWdnZXJcIixcclxuICBcInNoYWdnaW5cIixcclxuICBcInNoYWdnaW5nXCIsXHJcbiAgXCJzaGVtYWxlXCIsXHJcbiAgXCJzaGkrXCIsXHJcbiAgXCJzaGl0XCIsXHJcbiAgXCJzaGl0ZGlja1wiLFxyXG4gIFwic2hpdGVcIixcclxuICBcInNoaXRlZFwiLFxyXG4gIFwic2hpdGV5XCIsXHJcbiAgXCJzaGl0ZnVja1wiLFxyXG4gIFwic2hpdGZ1bGxcIixcclxuICBcInNoaXRoZWFkXCIsXHJcbiAgXCJzaGl0aW5nXCIsXHJcbiAgXCJzaGl0aW5nc1wiLFxyXG4gIFwic2hpdHNcIixcclxuICBcInNoaXR0ZWRcIixcclxuICBcInNoaXR0ZXJcIixcclxuICBcInNoaXR0ZXJzXCIsXHJcbiAgXCJzaGl0dGluZ1wiLFxyXG4gIFwic2hpdHRpbmdzXCIsXHJcbiAgXCJzaGl0dHlcIixcclxuICBcInNrYW5rXCIsXHJcbiAgXCJzbHV0XCIsXHJcbiAgXCJzbHV0c1wiLFxyXG4gIFwic21lZ21hXCIsXHJcbiAgXCJzbXV0XCIsXHJcbiAgXCJzbmF0Y2hcIixcclxuICBcInNvbi1vZi1hLWJpdGNoXCIsXHJcbiAgXCJzcGFjXCIsXHJcbiAgXCJzcHVua1wiLFxyXG4gIFwic19oX2lfdFwiLFxyXG4gIFwidDF0dDFlNVwiLFxyXG4gIFwidDF0dGllc1wiLFxyXG4gIFwidGVldHNcIixcclxuICBcInRlZXpcIixcclxuICBcInRlc3RpY2FsXCIsXHJcbiAgXCJ0ZXN0aWNsZVwiLFxyXG4gIFwidGl0XCIsXHJcbiAgXCJ0aXRmdWNrXCIsXHJcbiAgXCJ0aXRzXCIsXHJcbiAgXCJ0aXR0XCIsXHJcbiAgXCJ0aXR0aWU1XCIsXHJcbiAgXCJ0aXR0aWVmdWNrZXJcIixcclxuICBcInRpdHRpZXNcIixcclxuICBcInRpdHR5ZnVja1wiLFxyXG4gIFwidGl0dHl3YW5rXCIsXHJcbiAgXCJ0aXR3YW5rXCIsXHJcbiAgXCJ0b3NzZXJcIixcclxuICBcInR1cmRcIixcclxuICBcInR3NHRcIixcclxuICBcInR3YXRcIixcclxuICBcInR3YXRoZWFkXCIsXHJcbiAgXCJ0d2F0dHlcIixcclxuICBcInR3dW50XCIsXHJcbiAgXCJ0d3VudGVyXCIsXHJcbiAgXCJ2MTRncmFcIixcclxuICBcInYxZ3JhXCIsXHJcbiAgXCJ2YWdpbmFcIixcclxuICBcInZpYWdyYVwiLFxyXG4gIFwidnVsdmFcIixcclxuICBcIncwMHNlXCIsXHJcbiAgXCJ3YW5nXCIsXHJcbiAgXCJ3YW5rXCIsXHJcbiAgXCJ3YW5rZXJcIixcclxuICBcIndhbmt5XCIsXHJcbiAgXCJ3aG9hclwiLFxyXG4gIFwid2hvcmVcIixcclxuICBcIndpbGxpZXNcIixcclxuICBcIndpbGx5XCIsXHJcbiAgXCJ4cmF0ZWRcIixcclxuICBcInh4eFwiXHJcbl19IiwidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxudmFyIGJhZHdvcmRzID0gcmVxdWlyZSgnLi9iYWR3b3Jkcy5qc29uJykuYmFkd29yZHM7XHJcbnZhciBUZXh0RmluZGVyID0gcmVxdWlyZSgnLi90ZXh0ZmluZGVyJyk7XHJcblxyXG4vLyBDb25zdHJ1Y3RvclxyXG5mdW5jdGlvbiBCYWRMYW5ndWFnZUZpbHRlcigpIHtcclxuXHR0aGlzLnRleHRmaW5kZXIgPSBuZXcgVGV4dEZpbmRlcihiYWR3b3Jkcyk7XHJcbn1cclxuXHJcbi8vIENoZWNrIGlmIGFueSBiYWQgd29yZHMgaXMgY29udGFpbmVkIGluIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGVudCkge1xyXG5cdHJldHVybiB0aGlzLnRleHRmaW5kZXIuY29udGFpbnMoY29udGVudCk7XHJcbn07XHJcblxyXG4vLyBDaGVjayBpZiBhbnkgYmFkIHdvcmRzIGlzIGNvbnRhaW5lZCBpbiBjb250ZW50IGFuZCByZXR1cm5zIGFycmF5IG9mIHdvcmRzXHJcbkJhZExhbmd1YWdlRmlsdGVyLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5tYXRjaGVzKGNvbnRlbnQpO1xyXG59O1xyXG5cclxuLy8gUmVtb3ZlIGJhZCB3b3JkcyBmcm9tIGNvbnRlbnRcclxuQmFkTGFuZ3VhZ2VGaWx0ZXIucHJvdG90eXBlLnJlbW92ZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5yZW1vdmVXb3Jkcyhjb250ZW50KTtcclxufTtcclxuXHJcbi8vIFJlcGxhY2UgYmFkIHdvcmRzIGZyb20gY29udGVudFxyXG5CYWRMYW5ndWFnZUZpbHRlci5wcm90b3R5cGUucmVwbGFjZVdvcmRzID0gZnVuY3Rpb24oY29udGVudCwgcmVwbGFjZXN0cikge1xyXG4gICAgcmV0dXJuIHRoaXMudGV4dGZpbmRlci5yZXBsYWNlV29yZHMoY29udGVudCwgcmVwbGFjZXN0cik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhZExhbmd1YWdlRmlsdGVyOyIsIi8vIENvbnN0cnVjdG9yXHJcbmZ1bmN0aW9uIFRleHRGaW5kZXIod29yZExpc3QpIHtcclxuICB0aGlzLndvcmRsaXN0ID0gd29yZExpc3Q7XHJcbiAgdGhpcy5zZWFyY2hzdHJpbmcgPSBuZXcgUmVnRXhwKHdvcmRMaXN0LmpvaW4oXCIgfFwiKS5yZXBsYWNlKC9bXlxcd1xcc158XS9naSwgJycpLCAnaScpO1xyXG4gIHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nID0gbmV3IFJlZ0V4cCh3b3JkTGlzdC5qb2luKFwiIHxcIikucmVwbGFjZSgvW15cXHdcXHNefF0vZ2ksICcnKSwgJ2dpJyk7XHJcblxyXG59XHJcbi8vIGNsYXNzIG1ldGhvZHNcclxuVGV4dEZpbmRlci5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcblx0cmV0dXJuIHRoaXMuc2VhcmNoc3RyaW5nLnRlc3QoY29udGVudCk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5tYXRjaGVzID0gZnVuY3Rpb24oY29udGVudCkge1xyXG4gICAgcmV0dXJuIGNvbnRlbnQubWF0Y2godGhpcy5nbG9iYWxzZWFyY2hzdHJpbmcpO1xyXG59O1xyXG5cclxuVGV4dEZpbmRlci5wcm90b3R5cGUucmVtb3ZlV29yZHMgPSBmdW5jdGlvbihjb250ZW50KSB7XHJcbiAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nLCAnJyk7XHJcbn07XHJcblxyXG5UZXh0RmluZGVyLnByb3RvdHlwZS5yZXBsYWNlV29yZHMgPSBmdW5jdGlvbihjb250ZW50LCByZXBsYWNlc3RyKSB7XHJcbiAgICByZXR1cm4gY29udGVudC5yZXBsYWNlKHRoaXMuZ2xvYmFsc2VhcmNoc3RyaW5nLCByZXBsYWNlc3RyKTtcclxufTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRGaW5kZXI7IiwiIl19
