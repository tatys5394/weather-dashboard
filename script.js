const API_KEY = "104a3cf9c97eb36dae06eabd5aa7ae2d";
const CITY_QUERY_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_QUERY_URL = "https://api.openweathermap.org/data/2.5/forecast";


// create user input box for cities
// create an array of cities? or how do we get coordinates 
// create localstorage to store user input. Specify state and country variables in your API call, as multiple countries or states might have cities with the same name. For the purposes of this guide, you can use the city variable that you just created.


$(document).ready(function () {
    // TO DO: remove this because it's gonna be mapped to a button 
    search("Cali");
});

async function search(city) {
    var cityData = await getCityInfo(city);
    var cityLat = cityData[0].lat;
    var cityLon = cityData[0].lon;

    var cityWeatherData = await getCityWeatherInfo(cityLat, cityLon);
    
    var temp = cityWeatherData.list[0].main.temp
    var humidity = cityWeatherData.list[0].main.humidity
    var windSpeed = cityWeatherData.list[0].wind.speed
    
}

async function getCityInfo(city) {
    // This functions consumes this API https://openweathermap.org/api/geocoding-api
    // This function returns a Json with all the city information
    var url = CITY_QUERY_URL + "?q=" + city + "&appid=" + API_KEY;

    var response = await fetch(url, {method:"GET"});
    var data = await response.json();
    return data;
}

async function getCityWeatherInfo(lat, lon) {
    var url = WEATHER_QUERY_URL + "?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY;

    var response = await fetch(url, {method:"GET"});
    var data = await response.json();
    return data;
}
