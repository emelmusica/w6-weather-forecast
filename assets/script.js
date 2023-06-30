// JavaScript code with your API key
const apiKey = 'b009913e081b1279c55d5cc41732a04c';

// DOM elements
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherData = document.getElementById('weatherData');
const forecast = document.getElementById('forecast');
const historyList = document.getElementById('historyList');

// Search history array
const searchHistory = [];

// Event listener for the search button click
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city !== '') {
    getWeatherData(city);
  }
});

// Event listener for the "Enter" key press on the city input
cityInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});

// Event listener for the click on the search history list
historyList.addEventListener('click', (event) => {
  const selectedCity = event.target.innerText;
  getWeatherData(selectedCity);
});

// Function to fetch weather data from the OpenWeatherMap API
async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    displayWeatherData(data);

    const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    if (!forecastResponse.ok) {
      throw new Error('Forecast data not available');
    }
    const forecastData = await forecastResponse.json();
    displayForecastData(forecastData);

    addToSearchHistory(city);
  } catch (error) {
    console.error('Error:', error);
    alert('Error fetching data. Please try again.');
  }
}

// Function to display current weather data
function displayWeatherData(data) {
  const { name, main, weather, wind } = data;
  const weatherIcon = `https://openweathermap.org/img/w/${weather[0].icon}.png`;

  weatherData.innerHTML = `
    <h2>${name} (${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })})</h2>
    <p><img src="${weatherIcon}" alt="Weather Icon" class="weather-icon"></p>
    <p>Temperature: ${main.temp} °C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;

  weatherData.style.display = 'block';
}

// Function to display 5-day forecast data
function displayForecastData(data) {
    forecast.innerHTML = ''; // Clear the existing forecast data before adding new data
    const forecastHeader = document.createElement('h2');
    forecastHeader.textContent = '5-Day Forecast:';
    forecast.appendChild(forecastHeader);
  
    for (let i = 0; i < data.list.length; i += 8) {
      const { dt_txt, main, weather, wind } = data.list[i];
      const weatherIcon = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
  
      const dayContainer = document.createElement('div');
      dayContainer.classList.add('day');
  
      dayContainer.innerHTML = `
        <p>${new Date(dt_txt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        <p><img src="${weatherIcon}" alt="Weather Icon" class="weather-icon"></p>
        <p>Temp: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind: ${wind.speed} m/s</p>
      `;
  
      forecast.appendChild(dayContainer);
    }
  }
  

// Function to add a city to the search history
function addToSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    updateSearchHistory();
  }
}

// Function to update the search history list on the webpage
function updateSearchHistory() {
  historyList.innerHTML = '';
  searchHistory.forEach((city) => {
    const li = document.createElement('li');
    li.textContent = city;
    li.addEventListener('click', () => {
      getWeatherData(city);
    });
    historyList.appendChild(li);
  });
}
