'use strict';

var karaOK = {};

karaOK.init = function () {
	karaOK.eventHandlers();
};

karaOK.eventHandlers = function () {

	$('.submitButton').on('submit', function () {

		var userTrackName = $('.trackName').val();
		var userArtistName = $('.artistNAme').val();
		var userLyricsName = $('.lyricsName').val();

		karaOK.getSongInfo(userTrackName, userArtistName, userLyricsName);
	});
};

karaOK.getSongInfo = function (track, artist, lyrics) {
	$.ajax({
		url: 'http://api.musixmatch.com/ws/1.1/track.search',
		method: 'GET',
		dataType: 'json',
		data: {
			q_track: track,
			q_artist: artist,
			q_lyrics: lyrics,
			f_has_lyrics: '',
			f_lyrics_language: 'en'
		}
	}).then(function (result) {
		console.log(result);
	});
};

$(function () {
	karaOK.init();
});