
// create user input box for cities
// create an array of cities? or how do we get coordinates
// create localstorage to store user input. Specify state and country variables in your API call, as multiple countries or states might have cities with the same name. For the purposes of this guide, you can use the city variable that you just created.

// Map elements section

$(document).ready(function () {});
const API_KEY = "104a3cf9c97eb36dae06eabd5aa7ae2d";
const CITY_QUERY_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_QUERY_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_QUERY_URL = "https://openweathermap.org/img/w/";
var searchButton = $("#search-button");
searchButton.on("click", search);
var cityName = $("#city-name");
var userInput = $("#user-input");
var icon = $("#icon");
var tempEl = $("#Temp");
var humidityEl = $("#Humidity");
var windSpeedEl = $("#Wind-speed");
let searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
var savedInputEl = $("#saved-input");
var currentDate = dayjs().format("MM,DD,YYYY");
// console.log(currentDate);

async function search(event) {
  event.preventDefault();
  var city = userInput.val();
  var cityData = await getCityInfo(city);
  var cityLat = cityData[0].lat;
  var cityLon = cityData[0].lon;
  var cityWeatherData = await getCityWeatherInfo(cityLat, cityLon);
  var temp = cityWeatherData.list[0].main.temp;
  var humidity = cityWeatherData.list[0].main.humidity;
  var windSpeed = cityWeatherData.list[0].wind.speed;

  cityName.text(city);

  var iconID = cityWeatherData.list[0].weather[0].icon;
  var iconURL = ICON_QUERY_URL + iconID + ".png";
  icon.attr("src", iconURL);

  var date = cityWeatherData.list[0].dt_txt.split(" ")[0];
  cityName.append(`  ( ${date} )`);

  var tempText = "Temp: " + temp + " deg F ";
  var humidityText = "Humidity: " + humidity + " % ";
  var windSpeedText = "Wind speed: " + windSpeed + " mph ";

  tempEl.text(tempText);
  humidityEl.text(humidityText);
  windSpeedEl.text(windSpeedText);
  addToHistory(city, tempText, humidityText, windSpeedText, date, iconURL);
  displayForecast(cityWeatherData);
}

function addToHistory(city, tempText, humidityText, windSpeedText, date, iconURL) {
  if (searchHistory.indexOf(city) !== -1) {
    return;
  }
  let weatherObj = {
    city: "",
    date: "",
    temp:"",
    humidity:"",
    windSpeed:"",
    iconURL:""
  }
  weatherObj.city =city;
  weatherObj.date = date;
  weatherObj.temp = tempText;
  weatherObj.humidity = humidityText;
  weatherObj.windSpeed = windSpeedText;
  weatherObj.iconURL = iconURL;
  searchHistory.push(weatherObj);
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  displayHistory();
}

function loadCityFromHistory() {
  var city = "London";
  var index = searchHistory.indexOf(city);
  for (var i = searchHistory.length - 1; i >= 0; i--) {
   console.log(searchHistory[i].city);
   if(searchHistory[i].city === city) {
    
   }
  }
}

function displayHistory() {
  savedInputEl.innerHTML = "";
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("history-btn", "btn-history");
    btn.setAttribute("data-search", searchHistory[i]);
    btn.textContent = searchHistory[i].city;
    btn.addEventListener("click",loadCityFromHistory);
    savedInputEl.append(btn);
  }

}

async function getCityInfo(city) {
  // This functions consumes this API https://openweathermap.org/api/geocoding-api
  // This function returns a Json with all the city information
  var cityURL = CITY_QUERY_URL + "?q=" + city + "&appid=" + API_KEY;

  var response = await fetch(cityURL, { method: "GET" });
  var data = await response.json();
  return data;
}

async function getCityWeatherInfo(lat, lon) {
  var weatherURL =
    WEATHER_QUERY_URL +
    "?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    "&appid=" +
    API_KEY;

  var response = await fetch(weatherURL, { method: "GET" });
  var data = await response.json();

  // console.log("data = ", data);
  return data;
}

function displayForecast(cityWeatherData) {
  // console.log(cityWeatherData.list);
  for (let i = 0; i < 5; i++) {
    var iconID = cityWeatherData.list[i * 8].weather[0].icon;
    var iconURL = ICON_QUERY_URL + iconID + ".png";
    // icon.attr("src", iconURL);
    // console.log(iconURL);
    var dateI = cityWeatherData.list[i * 8].dt_txt.split(" ")[0];
    var tempI = cityWeatherData.list[i * 8].main.temp;
    var humidityI = cityWeatherData.list[i * 8].main.humidity;
    var windSpeedI = cityWeatherData.list[i * 8].wind.speed;

    var tempText = "Temp: " + tempI + " deg F";
    var humidityText = "Humidity: " + humidityI;
    var windSpeedText = "Wind speed: " + windSpeedI + " mph ";

    $("#date" + i).html(dateI);
    $("#icon" + i).attr("src",iconURL);
    $("#Temp" + i).html(tempText);
    $("#Wind-speed" + i).html(windSpeedText);
    $("#Humidity" + i).html(humidityText);
  }
}
