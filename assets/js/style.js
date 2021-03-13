var cityFormEl = document.querySelector("#city-form");
var cityContainerEl = document.querySelector("#city-container");
var cityEl = document.querySelector("#city-name");
var searchCityEl = document.querySelector("#city-search-term");

var formSubmitHandler = function() {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var city = cityEl.value.trim();

    if (city) {
        getCurrentWeather(city);

        // clear old content
        cityContainerEl.textContent = "";
        cityEl.value = "";
    } else {
        alert("Please enter a city");
    }
};

var getCurrentWeather = function(city) {
    // format the open weather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=2b9fd3a7d8e988ae12d2bbef3e2f64cf";

    // make a get request to url
    fetch(apiUrl)
      .then(function(response) {
        // request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
            displayCurrentWeather(city);
            });
        } else {
          alert("Error: " + response.statusText);
        }
    })
        .catch(function(error) {
            alert("Unable to connect to Open Weather");
    });
};

var displayCurrentWeather = function(city) {
    searchCityEl.textContent = city;

    // city name
    var cityNameEl = document.createElement("h2");
    cityNameEl = cityEl.value.trim();
    console.log(cityNameEl);
    cityContainerEl.appendChild(cityNameEl);

    // temperature
    // humidity
    // wind speed
    // UV index
};


cityFormEl.addEventListener("submit", formSubmitHandler);

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city