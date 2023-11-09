export default handleGetWeatherError(getWeather);

import createWeatherList from "./createWeatherList";

async function getWeather(location) {
  const formattedLocation = formatLocation(location);
  const request = new Request(
    `http://api.weatherapi.com/v1/forecast.json?key=c675b2e8fe3c440abd162043230711&q=${formattedLocation}&days=4&aqi=no&alerts=no`,
    {
      mode: "cors",
      method: "GET",
    }
  );

  const response = await fetch(request);
  if (response.status === 403) throw new Error("Api key invalid");
  else if (response.status === 400) throw new Error("Not found");
  const data = await response.json();
  console.log(data);
  return createWeatherList(data.forecast.forecastday);
}

function handleGetWeatherError(fn) {
  return function (...params) {
    return fn(...params).catch((err) => {
      console.log("Error", err);
    });
  };
}

function formatLocation(location) {
  let locationList = location.split(" ");
  locationList = locationList.filter((word) => word !== " ");
  if (locationList.length === 1) return locationList[0];
  else {
    let formattedLocation = "";
    locationList.forEach((word, index) => {
      if (index + 1 === locationList.length) {
        formattedLocation += word;
      } else {
        formattedLocation += `${word}-`;
      }
    });
    return formattedLocation;
  }
}
