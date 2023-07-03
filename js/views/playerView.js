import lottieWeb from "lottie-web";

class View {
  audioPlayer = document.getElementById("player");
  playIconContainer;
  volumeSlider;
  muteIconContainer;
  soundIconContainer;
  audio;
  audiovolume = 1;
  outputContainer;
  playState = "play";
  muteState = "unmute";
  playAnimation;
  muteAnimation;
  soundAnimation;

  render(url = "#", stationName, homepage) {
    const html = this.playerMarkup(url, stationName, homepage);
    this.audioPlayer.innerHTML = "";
    this.audioPlayer.insertAdjacentHTML("afterbegin", html);
    this.getAudioString();
    this.playAnimation.goToAndStop(14, true);
  }
  getAudioString() {
    this.playIconContainer = document.getElementById("play-icon");
    this.soundIconContainer = document.getElementById("sound-icon");
    this.volumeSlider = document.getElementById("volume-slider");
    this.muteIconContainer = document.getElementById("mute-icon");
    this.audio = document.querySelector(".audio");
    this.outputContainer = document.getElementById("volume-output");
    this.playAnimation = lottieWeb.loadAnimation({
      container: this.playIconContainer,
      path: "https://maxst.icons8.com/vue-static/landings/animated-icons/icons/pause/pause.json",
      renderer: "svg",
      loop: false,
      autoplay: false,
      name: "Play Animation",
    });

    this.muteAnimation = lottieWeb.loadAnimation({
      container: this.muteIconContainer,
      path: "https://maxst.icons8.com/vue-static/landings/animated-icons/icons/mute/mute.json",
      renderer: "svg",
      loop: false,
      autoplay: false,
      name: "Mute Animation",
    });
    this.soundAnimation = lottieWeb.loadAnimation({
      container: this.soundIconContainer,
      path: "https://maxst.icons8.com/vue-static/landings/animated-icons/icons/sound/sound.json",
      renderer: "svg",
      loop: true,
      autoplay: false,
      name: "Sound Animation",
    });
  }

  playerActivity() {
    this.playIconContainer.addEventListener("click", () => {
      console.log(this.playState);
      if (this.playState === "play") {
        this.playAudioStream(this.audio).then((res) => {
          console.log("test audio");
          this.playAnimation.playSegments([14, 27], true);
          this.soundAnimation.play();
          this.playState = "pause";
        });
      } else {
        this.audio.pause();
        this.playAnimation.playSegments([0, 14], true);
        this.soundAnimation.pause();
        cancelAnimationFrame(raf);
        this.playState = "play";
      }
    });

    this.muteIconContainer.addEventListener("click", () => {
      if (this.muteState === "unmute") {
        this.muteAnimation.playSegments([0, 15], true);
        this.audio.muted = true;
        this.muteState = "mute";
      } else {
        this.muteAnimation.playSegments([15, 25], true);
        this.audio.muted = false;
        this.muteState = "unmute";
      }
    });

    const showRangeProgress = (rangeInput) => {
      this.audioPlayer.style.setProperty(
        "--volume-before-width",
        (rangeInput.value / rangeInput.max) * 100 + "%"
      );
    };

    this.volumeSlider.addEventListener("input", (e) => {
      showRangeProgress(e.target);
    });
    /** Implement  the functionality of the audio player */

    let raf = null;

    this.volumeSlider.addEventListener("input", (e) => {
      const value = e.target.value;

      this.outputContainer.textContent = value;
      this.audio.volume = value / 100;

      this.audiovolume = this.audio.volume;
    });
  }
  //make audio play async
  playAudioStream(audio) {
    return new Promise(function (resolve, reject) {
      if (audio) {
        audio.play();
        resolve();
      } else {
        const err = new Error("invalid source");
        reject(err);
      }
    });
  }
  spinnerMarkup() {}

  animatePlay() {
    this.playAnimation.playSegments([14, 27], true);
    this.soundAnimation.play();
    this.playState = "pause";
  }

  playerMarkup(url, stationName, homepage) {
    return `<div id="audio-player-container">
    <div class="main-player"><p>${stationName}</p>
        <audio class="audio" src="${url}" preload="”metadata”" loop></audio>
        <button id="play-icon"></button>
        <button id="sound-icon"></button>
        <output id="volume-output"> ${
          this.audiovolume ? this.audiovolume * 100 : "100"
        }</output>
        <input type="range" id="volume-slider" max="100" value="${
          this.audiovolume ? this.audiovolume * 100 : "100"
        }" />
        <button id="mute-icon"></button></div></div>
        <div class="info-player">
        <a href="${homepage}" class="btn ">
            Station WebSite
          </a>
        </div>`;
  }
}

export default new View();
