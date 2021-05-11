class Tidal extends MprisBase {
	appName = "Tidal";
	pauseBtnSel = '#footerPlayer [data-type="button__pause"]';
	playBtnSel = '#footerPlayer [data-type="button__play"]';
	nextBtnSel = '#footerPlayer [data-type="button__skip-next"]';
	prevBtnSel = '#footerPlayer [data-type="button__skip-previous"]';
	imageUrlSel = '#footerPlayer figure img';
	subtitleTextSel = 'ytmusic-player-bar .content-info-wrapper .subtitle';

	titleTextSel = '#nowPlaying [data-test=now-playing-track-title]';
	artistTextSel = '#nowPlaying [class*="mediaArtists"]';
	albumSel = '#nowPlaying [class*="playingFrom"] [class*="text"]';
	timeInfoDurationSel = 'time[data-test="duration-time"][datetime]';
	constructor() {
		console.log("Tidal", 'constructor')
		super("Tidal");
	}

	init() {
		console.log(this.appName, 'init')
		this.update()

		setInterval(() => this.update(), 2000)
	}

	getPosition(callback) {
		console.log(this.appName, 'getPosition', arguments)

		if (!$().length)
			return callback(0);

		var text = $(this.timeInfoSel).text();

		text = text.split('/');

		if (text.length != 2)
			return 0;

		callback(this.microSeconds(text[0].trim()));
	}

	setRate(callback) {
		// Not supported
	}

	setVolume(callback) {

	}

	setShuffle(callback, value) {

	}

	setLoopStatus(callback, value) {

	}

	setFullscreen(callback) {
		// Not supported 
	}

	next(callback) {
		console.log(this.appName, 'next', arguments)

		if ($(this.nextBtnSel).length)
			$(this.nextBtnSel).click()

		callback()
		this.update()
	}

	previous(callback) {
		console.log(this.appName, 'previous', arguments)

		if ($(this.prevBtnSel).length)
			$(this.prevBtnSel).click()

		callback()
		this.update()
	}

	playPause(callback) {
		console.log(this.appName, 'playPause', arguments)

		if ($(this.pauseBtnSel).length)
			$(this.pauseBtnSel).click()

		if ($(this.playBtnSel).length)
			$(this.playBtnSel).click()

		callback()
		this.update()
	}

	pause(callback) {
		console.log(this.appName, 'pause', arguments)

		if ($(this.pauseBtnSel).length)
			$(this.pauseBtnSel).click()

		callback()
		this.update()
	}

	play(callback) {
		console.log(this.appName, 'play', arguments)

		if ($(this.playBtnSel).length)
			$(this.playBtnSel).click()

		callback()
		this.update()
	}

	update(callback) {
		if ($(this.playBtnSel).length) {
			if ($(this.playBtnSel).prop('disabled')) {
				this.media.PlaybackStatus = 'Stopped';
			} else {
				this.media.PlaybackStatus = 'Playing'
			}
		} else if ($(this.pauseBtnSel).length) {
			this.media.PlaybackStatus = 'Paused';
		}

		if ($(this.nextBtnSel).length && ! $(this.nextBtnSel).prop('disabled'))
			this.media.CanGoNext = true
		else 
			this.media.CanGoNext = false

		if ($(this.prevBtnSel).length && ! $(this.prevBtnSel).prop('disabled'))
			this.media.CanGoPrevious = true
		else 
			this.media.CanGoPrevious = false

		var title = $(this.titleTextSel);
		if (title.length) {
			var titleText = title.text();
			this.media.Metadata["mpris:trackid"] = titleText;
			this.media.Metadata["xesam:title"] = titleText;
		}

		if ($(this.imageUrlSel).length) {
			this.media.Metadata["mpris:artUrl"] = $(this.imageUrlSel).attr("src");
		}

		this.media.Metadata["xesam:url"] = location.href

		var subtitleEl = $(this.subtitleTextSel);
		var artist = $(this.artistTextSel);
		if(artist.length) {
			this.media.Metadata["xesam:artist"] = [artist.text().trim()];
			this.media.Metadata["xesam:albumArtist"] = [artist.text().trim()];
		}
		var album = $(this.albumSel);
		if(album.length) {
			this.media.Metadata["xesam:album"] = album.text().trim();
		}
		
		if ($(this.timeInfoDurationSel).length) {
			var timestamp = $(this.timeInfoDurationSel).get(0).textContent.trim();

			if (timestamp) {
				this.media.Metadata["mpris:length"] = this.microSeconds(timestamp);
			}
		}

		console.log('this.media', this.media);

		if(! _.isEqual(this.oldMedia, this.media)){
			this.oldMedia = _.cloneDeep(this.media);
			this.changed(this.media)
		}
	}

	microSeconds(position) {
		position = position.split(':');

		if (position.length != 2)
			return 0;

		position = parseInt(position[0]) * 60 + parseInt(position[1])
		position = position * 1e6
		return position
	}
}

var tidal = new Tidal()

var checkExist = setInterval(function() {
	if ($("#nowPlaying").length) {
		console.log(this.appName, 'checkExist', arguments)
		clearInterval(checkExist);
		tidal.init()
	}
}, 100);

