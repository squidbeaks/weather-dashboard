var cityFormEl = document.querySelector("#city-form");
var cityContainerEl = document.querySelector("#city-container");
var cityEl = document.querySelector("#city-name");
var searchCityEl = document.querySelector("#city-search-term");
var apiKey = "2b9fd3a7d8e988ae12d2bbef3e2f64cf";
var searchedCitiesContainer = document.querySelector("#searched-cities-container");

var searchedCities = [];

var reset = function() {
    cityContainerEl.innerHTML = '';

    for (var i=1; i < 6; i++) {
        var forecastDivs = document.querySelector("#forecast-" + i)
        forecastDivs.innerHTML = '';
    }
};

var formSubmitHandler = function() {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var city = cityEl.value.trim();
    saveSearchedCities(city);

    getLocationData(city);
    reset();
    cityEl.value = "";
};

var getLocationData = function(city) {
    const locApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    fetch(locApiUrl).then(function(response) {
        response.json().then(function(data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const city = data[0].name;

           getCurrentWeather(lat, lon, city);
        });

    });
};

var getCurrentWeather = function(lat, lon, city) {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    var weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(weatherApiUrl).then(function(response) {
        response.json().then(function(data) {
            var temp = data.current.temp;
            var humidity = data.current.humidity;
            var windSpeed = data.current.wind_speed;
            var uvIndex = data.daily[0].uvi;
            var iconURL = "http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png";

            // display city, date and icon
            let cityNameEl = document.createElement("h2");
            cityNameEl.textContent = city + " (" + today + ")";

            let iconEl = document.createElement("img");
            iconEl.setAttribute("src", iconURL);
            // display temp
            let tempEl = document.createElement("p");
            tempEl.innerHTML = "Temperature: " + temp + " &deg;F";

            // display humidity
            let humidityEl = document.createElement("p");
            humidityEl.textContent = "Humidity: " + humidity + "%";

            // display wind speed
            let windSpeedEl = document.createElement("p");
            windSpeedEl.textContent = "Wind Speed: " + windSpeed + " mph";

            // display uv index
            let uvIndexEl = document.createElement("p");
            let uvIndexSpan = document.createElement("span");

            uvIndexEl.textContent = "UV Index: " + uvIndex;
            uvIndex.textContent = uvIndex;

            uvIndexIndicator(uvIndex);

            cityContainerEl.appendChild(cityNameEl);
            cityNameEl.appendChild(iconEl);
            cityContainerEl.appendChild(tempEl);
            cityContainerEl.appendChild(humidityEl);
            cityContainerEl.appendChild(windSpeedEl);
            cityContainerEl.appendChild(uvIndexEl);

            // 5-DAY Forecast
            for (var i = 1; i < 6; i++) {
                // forecast day elements
                let forecastEl = document.querySelector("#forecast-" + i);
                let forecastDay = data.daily[i];
                var dailyIconURL = "http://openweathermap.org/img/w/" + forecastDay.weather[0].icon + ".png";

                // current date
                let timestamp = forecastDay.dt;
                let milli = timestamp * 1000;
                let date = new Date(milli);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                date = month + '/' + day + '/' + year;

                let dateEl = document.createElement("h4");
                dateEl.textContent = date;

                // Icon
                let dailyIconEl = document.createElement("img");
                dailyIconEl.setAttribute('src', dailyIconURL);

                // Temp
                let dailyTemp = forecastDay.temp.day;
                let dailyTempEl = document.createElement("p");
                dailyTempEl.innerHTML = "Temp: " + dailyTemp + " &deg;F";

                // Humidity
                let dailyHumidity = forecastDay.humidity;
                let dailyHumidityEl = document.createElement("p");
                dailyHumidityEl.textContent = "Humidity: " + dailyHumidity;

                forecastEl.appendChild(dateEl);
                forecastEl.appendChild(dailyIconEl);
                forecastEl.appendChild(dailyTempEl);
                forecastEl.appendChild(dailyHumidityEl)
            };
        });
    });
};

var saveSearchedCities = function(city) {
    var savedCitiesBtn = document.createElement("button");
    savedCitiesBtn.textContent = city;

    if (searchedCities.includes(city)) {
        return;
    }
    else {
        searchedCitiesContainer.appendChild(savedCitiesBtn);
        searchedCities.push(city);
    };

    console.log(searchedCities);

    savedCitiesBtn.addEventListener("click", function() {
        reset();
        getLocationData(city);
    });

    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
};

var uvIndexIndicator = function(uvIndex) {
    // favorable 0-2
    if (uvIndex >= 0 && uvIndex < 3) {
        console.log('favorable');
    }
    // moderate 3-5
    else if (uvIndex >= 3 && uvIndex < 5) {
        console.log("moderate");
    }
    // severe 8-10
    else {
        console.log("severe");
    }
};

cityFormEl.addEventListener("submit", formSubmitHandler);

// GIVEN a weather dashboard with form inputs
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// localStorage