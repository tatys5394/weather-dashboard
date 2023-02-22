const API_KEY = "104a3cf9c97eb36dae06eabd5aa7ae2d";
const CITY_QUERY_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_QUERY_URL = "https://api.openweathermap.org/data/2.5/forecast";
const ICON_QUERY_URL = "http://openweathermap.org/img/w/";

// create user input box for cities
// create an array of cities? or how do we get coordinates 
// create localstorage to store user input. Specify state and country variables in your API call, as multiple countries or states might have cities with the same name. For the purposes of this guide, you can use the city variable that you just created.

// Map elements section
var searchButton = $("#search-button");
searchButton.on("click", search);
var cityName = $("#city-name");
var userInput = $("#user-input");
var icon = $("#icon");
var tempEl = $("#Temp");
var humidityEl = $("#Humidity");
var windSpeedEl = $("#Wind-speed");
var searchHistory = [];
var savedInputEl = $("#saved-input");

$(document).ready(function () {
});

async function search(event) {
    event.preventDefault();
    var city = userInput.val();
    var cityData = await getCityInfo(city);
    var cityLat = cityData[0].lat;
    var cityLon = cityData[0].lon;
    var cityWeatherData = await getCityWeatherInfo(cityLat, cityLon);
    var temp = cityWeatherData.list[0].main.temp
    var humidity = cityWeatherData.list[0].main.humidity
    var windSpeed = cityWeatherData.list[0].wind.speed

    cityName.text(city);
    
    var iconID = cityWeatherData.list[0].weather[0].icon
    var iconURL = ICON_QUERY_URL + iconID + ".png";
    icon.attr('src', iconURL);
    var date = cityWeatherData.list[0].dt_txt.split(" ")[0];
    cityName.append(`  ( ${date} )`);
    var tempText = "Temp: " + temp + " deg F ";
    var humidityText = "Humidity: " + humidity + " % "; 
    var windSpeedText = "Wind speed: " + windSpeed + " mph "; 
    
   tempEl.text(tempText);
   humidityEl.text(humidityText);
   windSpeedEl.text(windSpeedText);
   addToHistory(city); 
   displayForecast(cityWeatherData);
}

function addToHistory(city) {
if(searchHistory.indexOf(city)!== -1){
    return;
}
searchHistory.push(city);
localStorage.setItem("search-history", JSON.stringify(searchHistory));
displayHistory();
}

function displayHistory(){
savedInputEl.innerHTML = "";
for(var i = searchHistory.length-1; i >= 0; i --) {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("history-btn", "btn-history");
    btn.setAttribute("data-search", searchHistory[i]);
    btn.textContent = searchHistory[i];
    savedInputEl.append(btn)
}}

async function getCityInfo(city) {
    // This functions consumes this API https://openweathermap.org/api/geocoding-api
    // This function returns a Json with all the city information
    var cityURL = CITY_QUERY_URL + "?q=" + city + "&appid=" + API_KEY;

    var response = await fetch(cityURL, {method:"GET"});
    var data = await response.json();
    return data;
}

async function getCityWeatherInfo(lat, lon) {
    var weatherURL = WEATHER_QUERY_URL + "?lat=" + lat + "&lon=" + lon +  "&units=imperial" + "&appid=" + API_KEY; 

    var response = await fetch(weatherURL, {method:"GET"});
    var data = await response.json();

    console.log("data = ", data);
    return data;
}

function displayForecast(cityWeatherData) {
    console.log("func called");
    for (let i = 1; i < 6; i++) {
      console.log("when run");
      var iconID = cityWeatherData.list[0].weather[0].icon;
        var iconURL = ICON_QUERY_URL + iconID + ".png";
        icon.attr("src", iconURL);
        var dateI = cityWeatherData.list[0].dt_txt.split(" ")[0];
        cityName.append(`  ( ${dateI} )`);
      var tempI = cityWeatherData.list[i].main.temp;
      var humidityI = cityWeatherData.list[i].main.humidity;
      var windSpeedI = cityWeatherData.list[i].wind.speed;
  
      var tempText = "Temp: " + tempI + " deg F";
      var humidityText = "Humidity: " + humidityI;
      var windSpeedText = "Wind speed: " + windSpeedI + " mph ";

      $("#date" + i).html(dateI);
      $("#icon" + i).html("<img src=" + iconURL + ">");
      $("#Temp" + i).html(tempText);
      $("#Wind" + i).html(windSpeedText);
      $("#Humidity" + i).html(humidityText);
    }
    }
