const userTab = document.querySelector("[data-userWeather");
const searchTab = document.querySelector("[data-searchWeather");
const searchForm = document.querySelector("[search-form");
const grantAccessContainer = document.querySelector('.grantAccess-container');
const userInfoContainer = document.querySelector(".user-info-container");
const loadingContainer = document.querySelector('.loading-container');
const pageNotFound = document.querySelector('.pageNotFound-container');
const apiError = document.querySelector("[api-error]");

console.log(userInfoContainer);

const API_KEY = "333268bcaa1ba130ded6cfc2c5a12fd7";
let oldTab = userTab;
oldTab.classList.add("current-tab");
getDataFromSessionStorage();

function switchTab(newTab) {
  if (oldTab != newTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");
    if (!searchForm.classList.contains('active')) {
      
      pageNotFound.classList.remove("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
    else {
      searchForm.classList.remove("active");
      pageNotFound.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getDataFromSessionStorage();
    }
  }
}

userTab.addEventListener('click', () => {
  switchTab(userTab);
})

searchTab.addEventListener('click', () => {
  switchTab(searchTab);
})


//check if coordinates are present or not in session storage
function getDataFromSessionStorage() {
  const localCoords = sessionStorage.getItem('user-coordinates');
  if (!localCoords) {
    grantAccessContainer.classList.add('active');
  }
  else {
    const coordinates = JSON.parse(localCoords);
    fetchUserWeatherDetails(coordinates);
  }
}
//users weather info fetch
async function fetchUserWeatherDetails(coordinates) {
  const { lat, lon } = coordinates;
  loadingContainer.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  pageNotFound.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    if (!data.sys) {
      throw data;
    }
    loadingContainer.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherDetails(data);
  } catch (error) {
    userInfoContainer.classList.remove("active");
    loadingContainer.classList.remove("active");
    pageNotFound.classList.add("active");
    apiError.innerHTML = `${error?.message}`;
  }
}

// Render Function to show in ui

function renderWeatherDetails(weatherDetail) {
  const cityName = document.querySelector("[city-Name]");
  const countryFlag = document.querySelector("[country-flag]");
  const weatherDesc = document.querySelector("[weather-desc]");
  const weatherImg = document.querySelector("[weather-img]");
  const temp = document.querySelector("[data-temp]");
  const wind = document.querySelector("[data-wind]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-clouds]");

  // put ui components detail from api
  cityName.innerHTML = `${weatherDetail?.name}`;
  countryFlag.src = `https://flagcdn.com/144x108/${weatherDetail?.sys?.country.toLowerCase()}.png`;
  weatherDesc.innerHTML = `${weatherDetail?.weather?.[0]?.description}`;
  weatherImg.src = `http://openweathermap.org/img/w/${weatherDetail?.weather?.[0]?.icon}.png`;
  temp.innerHTML = `${weatherDetail?.main?.temp} °C`;
  wind.innerHTML = `${weatherDetail?.wind?.speed} m/s`;
  humidity.innerHTML = `${weatherDetail?.main?.humidity}%`;
  clouds.innerHTML = `${weatherDetail?.clouds?.all}%`;
}

//geo location api
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const userCoordinates =
    {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
  } 
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherDetails(userCoordinates);
}

const grantAccessButton = document.querySelector("[grant-access-button]");
grantAccessButton.addEventListener('click', () => {
  getLocation();
})

// get cityname from search option
const searchInput = document.querySelector('[data-searchInput]');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let cityName = searchInput.value;
  console.log(cityName);
  if (cityName === "")
    return;
  else
    fetchSearchWeatherDetails(cityName);
})


// get seached city data from api


async function fetchSearchWeatherDetails(city) {
  console.log(city);
  loadingContainer.classList.add('active');
  userInfoContainer.classList.remove('active');
  grantAccessContainer.classList.remove("active");
  pageNotFound.classList.remove("active");

  try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
    const data = await response.json();
    
    if (!data.sys) {
      throw data;
    }
      loadingContainer.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherDetails(data);
  }
  catch (error) {
    userInfoContainer.classList.remove("active");
    loadingContainer.classList.remove("active");
    pageNotFound.classList.add('active');
    apiError.innerHTML = `${error?.message}`;
  }
  
}