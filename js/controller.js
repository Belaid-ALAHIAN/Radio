import * as modul from "./modul.js";
import playerView from "./views/playerView.js";
const stationsContainer = document.querySelector(".stations-list");
let current_page = 1;
let records_per_page = 2;
modul.loadStations().then((stations) => {
  modul.state.station = stations.slice(50, 57);
  console.log("stations:", stations);
  playerView.render(
    stations[10].url_resolved,
    stations[10].name,
    stations[10].homepage
  );
  console.log(stations[10].name);
  playerView.playerActivity();
  modul.state.station.forEach((staion) => {
    renderStation(staion);
  });
  stationsList = document.querySelectorAll(".station-details");
  playStation(stationsList);
});

const renderStation = function (station) {
  let markup;
  console.log(station.favicon.length);
  if (station.favicon.length === 0) {
    markup = `<li class="station-details" data-station-uid="${station.stationuuid}">
      <div class="st-logo"><img src="https://us.123rf.com/450wm/wahyufrida/wahyufrida1909/wahyufrida190900710/wahyufrida190900710.jpg?ver=6" class="station-img" /></div>
     <div class="station-desc"-> <h2 class="station-name">${station.name}</h2></div>
     <div class="station-votes"-> <h2 class="station-name">Votes: ${station.votes}</h2></div>
     <div class="station-tags"-> <h2 class="station-name">Type: ${station.tags}</h2></div>
    </li>`;
  } else {
    markup = `<li class="station-details" data-station-uid="${station.stationuuid}"><div class="st-logo"><img src="${station.favicon}" class="station-img"/></div>
    <div class="station-desc"-> <h2 class="station-name">${station.name}</h2></div>
    <div class="station-votes"-> <h2 class="station-name">Votes: ${station.votes}</h2></div>
    <div class="station-tags"-> <h2 class="station-name">Type: ${station.tags}</h2></div>`;
  }
  stationsContainer.insertAdjacentHTML("beforeend", markup);
};

const playStation = function (stationsList) {
  console.log(modul.state.station);
  stationsList.forEach((station) => {
    station.addEventListener("click", function (e) {
      const selecteEl = e.target.closest(".station-details");
      console.log(selecteEl);
      console.log(selecteEl.dataset.stationUid);
      console.log(modul.state.station[3].stationUid);
      const selectedStation = modul.state.station.find((el) => {
        return el.stationuuid === selecteEl.dataset.stationUid;
      });
      console.log(selectedStation);
      playerView.render(
        selectedStation.url_resolved,
        selectedStation.name,
        selectedStation.homepage
      );
      playerView.audio.volume = playerView.audiovolume;
      playerView.audioPlayer.style.setProperty(
        "--volume-before-width",
        playerView.audiovolume * 100 + "%"
      );
      playerView.playAudioStream(playerView.audio).then((res) => {
        playerView.animatePlay();
      });
      playerView.playState = "play";
      playerView.playerActivity();
    });
  });
};

//pagination
