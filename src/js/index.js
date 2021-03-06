import * as Display from './display';
import * as Listener from './listeners';
import getWeather from './api';

// Aux function
function parse(data, unitsCharacter) {
  const degreeCharacter = String.fromCharCode(176);
  const getTemperature = (data) => parseInt(data, 10);

  return {
    locationName: `${data.name}, ${data.sys.country}`,
    temperature: `${getTemperature(data.main.temp)}${degreeCharacter} ${unitsCharacter}`,
    description: `${data.weather[0].main}`,
    feels: `Feels like: ${getTemperature(data.main.feels_like)}${degreeCharacter} ${unitsCharacter}`,
    clouds: `Clouds: ${data.clouds.all}%`,
    humidity: `Humidity: ${data.main.humidity}%`,
    pressure: `Pressure: ${data.main.pressure} hPa`,
    weatherIconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
  };
}

function getUnits() {
  const unitInput = document.getElementById('unit-input');

  return unitInput.value === 'imperial'
    ? { units: unitInput.value, unitsCharacter: 'F' }
    : { units: unitInput.value, unitsCharacter: 'C' };
}

function searchLocation(locationName) {
  if (!locationName || locationName.match(/^ *$/) !== null) return;

  const { unitsCharacter, units } = getUnits();
  const displayWeatherOnTimeout = (weatherInfo) => {
    setTimeout(() => { Display.weather(weatherInfo); }, 500);
  };

  Display.weatherContainer();
  Display.clear();
  getWeather({ locationName, units })
    .then(data => {
      displayWeatherOnTimeout(parse(data, unitsCharacter));
    })
    .catch(() => {
      Display.error();
    });
}

(function setup() {
  Display.searchSuggestions();
  Listener.onSearch(searchLocation);
  Listener.unitChange(searchLocation);
}());
