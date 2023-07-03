import * as modul from "./modul.js";
import playerView from "./views/playerView.js";
const stationsContainer = document.querySelector(".stations-list");
const btn_next = document.getElementById("btn_next");
const btn_prev = document.getElementById("btn_prev");
const page_span = document.getElementById("page");
let current_page = 1;
let records_per_page = 5;
modul.loadStations().then((stations) => {
  modul.state.station = stations.sort((a, b) => b.votes - a.votes);
  console.log("stations:", stations);
  playerView.render(
    stations[10].url_resolved,
    stations[10].name,
    stations[10].homepage
  );
  console.log(stations[10].name);
  playerView.playerActivity();
  // modul.state.station.forEach((staion) => {
  //   renderStation(staion);
  // });
  changePage(1);
  //stationsList = document.querySelectorAll(".station-details");
  playStation();
});

const renderStation = function (station) {
  let markup;
  console.log(station.favicon.length);
  if (station.favicon.length === 0) {
    markup = `<li class="station-details" data-station-uid="${station.stationuuid}">
      <div class="st-logo"><img src="https://i.imgur.com/MtRDWSz.jpg" class="station-img" /></div>
     <div class="station-desc"-> <h2 class="station-name">${station.name}</h2></div>
    </li>`;
  } else {
    markup = `<li class="station-details" data-station-uid="${station.stationuuid}"><div class="st-logo"><img src="${station.favicon}" class="station-img"/></div>
    <div class="station-desc"-> <h2 class="station-name">${station.name}</h2></div>`;
  }
  stationsContainer.insertAdjacentHTML("beforeend", markup);
};

const playStation = function () {
  const stationsList = document.querySelectorAll(".station-details");
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
      selectedStation.style = `
        box-shadow: -5px 0px 1rem 4px #df460a;
        margin-left: 6px;
    `;
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
function prevPage() {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
    playStation();
  }
}

function nextPage() {
  if (current_page < numPages()) {
    current_page++;
    changePage(current_page);
    playStation();
  }
}

function changePage(page) {
  // Validate page
  console.log("changefunc");
  if (page < 1) page = 1;
  if (page > numPages()) page = numPages();

  stationsContainer.innerHTML = "";

  for (
    var i = (page - 1) * records_per_page;
    i < page * records_per_page;
    i++
  ) {
    //listing_table.innerHTML += modul.state.station[i].adName + "<br>";
    renderStation(modul.state.station[i]);
  }
  page_span.innerHTML = page;

  if (page == 1) {
    btn_prev.style.visibility = "hidden";
  } else {
    btn_prev.style.visibility = "visible";
  }

  if (page == numPages()) {
    btn_next.style.visibility = "hidden";
  } else {
    btn_next.style.visibility = "visible";
  }
}
function numPages() {
  return Math.ceil(modul.state.station.length / records_per_page);
}

// window.onload = function() {
//     changePage(1);
// };
btn_next.addEventListener("click", nextPage);
btn_prev.addEventListener("click", prevPage);
