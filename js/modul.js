export const state = {
  station: [],
};

//list off all radio
export const loadStations = function () {
  return fetch(
    "http://de1.api.radio-browser.info/json/stations/bycountry/morocco"
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};
