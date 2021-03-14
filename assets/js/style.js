var cityFormEl = document.querySelector("#city-form");
var cityContainerEl = document.querySelector("#city-container");
var cityEl = document.querySelector("#city-name");
var searchCityEl = document.querySelector("#city-search-term");
var apiKey = "2b9fd3a7d8e988ae12d2bbef3e2f64cf";

var formSubmitHandler = function() {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var city = cityEl.value.trim();

    getLocationData(city);
    cityEl.value = "";
};

var getLocationData = function(city) {
    const locApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    fetch(locApiUrl).then(function(response) {
        response.json().then(function(data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const city = data[0].name;

            console.log(data);
            console.log(lat);
            console.log(lon);
            console.log(city);

           getCurrentWeather(lat, lon, city);
        });

    });
};



var getCurrentWeather = function(lat, lon, city) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    console.log(today);

    var weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(weatherApiUrl).then(function(response) {
        response.json().then(function(data) {
            var temp = data.current.temp;
            var humidity = data.current.humidity;
            var windSpeed = data.current.wind_speed;
            var uvIndex = data.daily[0].uvi;

            console.log(data);
            console.log("temp: " + temp);
            console.log("humidity: " + humidity);
            console.log("wind speed: " + windSpeed);
            console.log("uvi: " + uvIndex);


            // display city, date and icon
            let cityNameEl = document.createElement("h2");
            cityNameEl.textContent = city + " (" + today + ") **INSERT ICON HERE**";
            console.log(cityNameEl);

            // display temp
            let tempEl = document.createElement("p");
            tempEl.textContent = temp + " F";

            // display humidity
            let humidityEl = document.createElement("p");
            humidityEl.textContent = humidity + "%";

            // display wind speed
            let windSpeedEl = document.createElement("p");
            windSpeedEl.textContent = windSpeed + " mph";

            // display uv index
            let uvIndexEl = document.createElement("p");
            uvIndexEl.textContent = uvIndex;

            cityContainerEl.appendChild(cityNameEl);
            cityContainerEl.appendChild(tempEl);
            cityContainerEl.appendChild(humidityEl);
            cityContainerEl.appendChild(windSpeedEl);
            cityContainerEl.appendChild(uvIndexEl);

            // 5-DAY Forecast
            // Date
            // Icon
            // Temp
            // Humidity
        });
    });
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