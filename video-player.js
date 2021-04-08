const _container = document.querySelector('#videoContainer');
const _video = _container.querySelector('#video');
const _cuesContainer = _container.querySelector('.cues-container');
const _cues = _container.querySelector('#video-cues');
const _controls = _container.querySelector('#video-controls');

const _playpause = _controls.querySelector('#playpause');
const _stop = _controls.querySelector('#stop');
const _mute = _controls.querySelector('#mute');
const _volinc = _controls.querySelector('#volinc');
const _voldec = _controls.querySelector('#voldec');
const _progress = _controls.querySelector('#progress');
const _timer = _controls.querySelector('#timer');
const _fullscreen = _controls.querySelector('#fs');
const _quality = _controls.querySelector('#quality');
const _captions = _controls.querySelector('#captions');

const tracks = _video.textTracks[0];
tracks.mode = 'hidden';

const video = {
   cues: tracks.cues,
   totalSeconds: 0,
   playedSeconds: 0
}

_playpause.addEventListener('click', function(e) {
    if (_video.paused || _video.ended) {
        _video.play();
        _playpause.textContent = 'pause';
    } else {
        _video.pause();
        _playpause.textContent = 'play_arrow';
    }
 });

 _stop.addEventListener('click', function(e) {
    _video.pause();
    _video.currentTime = 0;
    _progress.value = 0;
 });

_mute.addEventListener('click', function(e) {
    _video.muted = !_video.muted;
});

_volinc.addEventListener('click', function(e) {
    alterVolume('+');
 });
 _voldec.addEventListener('click', function(e) {
    alterVolume('-');
 });

 var alterVolume = function(dir) {
    var currentVolume = Math.floor(_video.volume * 10) / 10;
    if (dir === '+') {
       if (currentVolume < 1) _video.volume += 0.1;
    }
    else if (dir === '-') {
       if (currentVolume > 0) _video.volume -= 0.1;
    }
 }

 var onCueEnter = function() {
    _cues.textContent = this.text;
    _cues.classList.remove('hidden');
 }

 var onCueExit = function() {
   _cues.textContent = '';
   _cues.classList.add('hidden');
}

var formatTime = function(seconds) {
   return new Date(seconds * 1000).toISOString().substr(11, 8)
}

var updateTimer = function() {
   _timer.textContent = formatTime(video.playedSeconds) + ' / ' + formatTime(video.totalSeconds);
 }

 _video.addEventListener('loadedmetadata', function() {
   video.totalSeconds = this.duration;
   _progress.setAttribute('max', video.totalSeconds);
   updateTimer();

    for (let i in video.cues) {
      let cue = video.cues[i];
      cue.onenter = onCueEnter;
      cue.onexit = onCueExit;
    }
 });

 _video.addEventListener('timeupdate', function() {
    video.playedSeconds = this.currentTime
    _progress.value = video.playedSeconds;

    updateTimer();
 });

 _progress.addEventListener('click', function(e) {
    var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
    _video.currentTime = pos * _video.duration;
 });

 const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

 if (!fullScreenEnabled) {
    fullscreen.style.display = 'none';
 }

 _fullscreen.addEventListener('click', function(e) {
    handleFullscreen();
 });

 var handleFullscreen = function() {
    if (isFullScreen()) {
       if (document.exitFullscreen) document.exitFullscreen();
       else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
       else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
       else if (document.msExitFullscreen) document.msExitFullscreen();
       setFullscreenData(false);
       _container.dataset.fullscreen = false;
       _fullscreen.textContent = 'fullscreen';
    }
    else {
       if (_container.requestFullscreen) _container.requestFullscreen();
       else if (_container.mozRequestFullScreen) _container.mozRequestFullScreen();
       else if (_container.webkitRequestFullScreen) _container.webkitRequestFullScreen();
       else if (_container.msRequestFullscreen) _container.msRequestFullscreen();
       _container.dataset.fullscreen = true;
       _fullscreen.textContent = 'fullscreen_exit';
    }
 }

 var isFullScreen = function() {
    return !!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
 }

 document.addEventListener('fullscreenchange', function(e) {
    _container.dataset.fullscreen = !!(document.fullscreen || document.fullscreenElement);
 });
 document.addEventListener('webkitfullscreenchange', function() {
    _container.dataset.fullscreen = !!document.webkitIsFullScreen;
 });
 document.addEventListener('mozfullscreenchange', function() {
    _container.dataset.fullscreen = !!document.mozFullScreen;
 });
 document.addEventListener('msfullscreenchange', function() {
    _container.dataset.fullscreen = !!document.msFullscreenElement;
 });


_quality.addEventListener('change', function (e) {
    const currentTime = _video.currentTime;

    _video.querySelector('source[type="video/mp4"]').src = 'video/' + _quality.value + '.mp4';
    _video.querySelector('source[type="video/webm"]').src = 'video/' + _quality.value + '.webm';
    _video.load();
    _video.currentTime = currentTime;
    _video.play();
}); 


 _captions.addEventListener('click', function (e) {
   _cuesContainer.classList.toggle('hidden');
 });

 _video.load();
