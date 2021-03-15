const cityFormEl = document.querySelector('#city-form');
const cityContainerEl = document.querySelector('#city-container');
const cityEl = document.querySelector('#city-name');
const searchCityEl = document.querySelector('#city-search-term');
const apiKey = '2b9fd3a7d8e988ae12d2bbef3e2f64cf';
const searchedCitiesContainer = document.querySelector('#searched-cities-container');

let searchedCities = [];

function reset() {
    cityContainerEl.innerHTML = '';

    for (var i=1; i < 6; i++) {
        var forecastDivs = document.querySelector('#forecast-' + i)
        forecastDivs.innerHTML = '';
    };
};

function formSubmitHandler() {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var city = cityEl.value.trim();

    getLocationData(city);
    reset();
    cityEl.value = '';
};

function getLocationData(city) {
    let locApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;

    fetch(locApiUrl).then(function(response) {
        response.json().then(function(data) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const city = data[0].name;

            getCurrentWeather(lat, lon, city);

            if (searchedCities.includes(city))
                return;
            else {
                saveSearchedCities(city);
            };
        });

    });
};

function getCurrentWeather(lat, lon, city) {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(weatherApiUrl).then(function(response) {
        response.json().then(function(data) {
            var temp = data.current.temp;
            var humidity = data.current.humidity;
            var windSpeed = data.current.wind_speed;
            var uvIndex = data.daily[0].uvi;
            var iconURL = `http://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;

            // display city, date and icon
            let cityNameEl = document.createElement('h2');
            cityNameEl.textContent = city + ' (' + today + ')';

            let iconEl = document.createElement('img');
            iconEl.setAttribute('src', iconURL);

            // display temp
            let tempEl = document.createElement('p');
            tempEl.innerHTML = 'Temperature: ' + temp + ' &deg;F';

            // display humidity
            let humidityEl = document.createElement('p');
            humidityEl.textContent = 'Humidity: ' + humidity + '%';

            // display wind speed
            let windSpeedEl = document.createElement('p');
            windSpeedEl.textContent = 'Wind Speed: ' + windSpeed + ' mph';

            // display uv index
            let uvIndexEl = document.createElement('p');
            let uvIndexSpan = document.createElement('span');

            uvIndexSpan.textContent = uvIndex;
            uvIndexSpan.id = 'uv-index-span';
            uvIndexEl.textContent = 'UV Index: ';

            cityContainerEl.appendChild(cityNameEl);
            cityNameEl.appendChild(iconEl);
            cityContainerEl.appendChild(tempEl);
            cityContainerEl.appendChild(humidityEl);
            cityContainerEl.appendChild(windSpeedEl);
            uvIndexEl.appendChild(uvIndexSpan);
            cityContainerEl.appendChild(uvIndexEl);

            uvIndexIndicator(uvIndex);

            // 5-DAY Forecast
            for (var i = 1; i < 6; i++) {
                // forecast day elements
                let forecastEl = document.querySelector('#forecast-' + i);
                let forecastDay = data.daily[i];
                let dailyIconURL = `http://openweathermap.org/img/w/${forecastDay.weather[0].icon}.png`;

                // current date
                let timestamp = forecastDay.dt;
                let milli = timestamp * 1000;
                let date = new Date(milli);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                date = month + '/' + day + '/' + year;

                let dateEl = document.createElement('h4');
                dateEl.textContent = date;

                // Icon
                let dailyIconEl = document.createElement('img');
                dailyIconEl.setAttribute('src', dailyIconURL);

                // Temp
                let dailyTemp = forecastDay.temp.day;
                let dailyTempEl = document.createElement('p');
                dailyTempEl.innerHTML = 'Temp: ' + dailyTemp + ' &deg;F';

                // Humidity
                let dailyHumidity = forecastDay.humidity;
                let dailyHumidityEl = document.createElement('p');
                dailyHumidityEl.textContent = 'Humidity: ' + dailyHumidity;

                forecastEl.appendChild(dateEl);
                forecastEl.appendChild(dailyIconEl);
                forecastEl.appendChild(dailyTempEl);
                forecastEl.appendChild(dailyHumidityEl)
            };
        });
    });
};

function uvIndexIndicator(uvIndex) {
    let uvIndexSpanEl = document.querySelector('#uv-index-span');

    if (uvIndex >= 0 && uvIndex < 3) {
        uvIndexSpanEl.className = 'favorable';
    }
    else if (uvIndex >= 3 && uvIndex < 5) {
        uvIndexSpanEl.className = 'moderate';
    }
    else {
        uvIndexSpanEl.className = 'severe';
    }
};

function saveSearchedCities(city) {
    let savedCitiesBtn = document.createElement('button');
    savedCitiesBtn.innerText = city;

    searchedCitiesContainer.appendChild(savedCitiesBtn);
    searchedCities.push(city);

    savedCitiesBtn.addEventListener('click', function() {
        reset();
        getLocationData(city);
    });

    localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
};

function loadSearchedCities() {
    searchedCities = JSON.parse(localStorage.getItem('searchedCities'));

    if (!searchedCities) {
        searchedCities = [];
    };

    for(let i = 0; i < searchedCities.length; i++) {
        let searchedCity = searchedCities[i];
        let savedCitiesBtn = document.createElement('button');
        savedCitiesBtn.innerText = searchedCity;

        searchedCitiesContainer.appendChild(savedCitiesBtn);

        savedCitiesBtn.addEventListener('click', function() {
            reset();
            getLocationData(searchedCity);
        });
    };
};

loadSearchedCities();

cityFormEl.addEventListener('submit', formSubmitHandler);
