const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector(".form-container");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// variables
let currentTab=userTab;
const API_KEY="00a3590a1e460b78dbaec38c9915f49e";
currentTab.classList.add("current-tab");
getFromSessionStorage(); // if coordinates already  present in the session

// firstly grant access screen shows so we need to activate grant access button
const grantAccessButton=document.querySelector("[data-grantAccess");
grantAccessButton.addEventListener("click",getLocation);

// if button clicks this function calls which asks for location access
function getLocation(){
    if(navigator.geolocation){
        // navigator.geolocation: object, getCurrentPosition: method , 
        // showPosition: callback function (called when current location retrieved successfully)
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("getlocationerror");
        alert("error");
        // hw: show an alert for no geolocation support available
    }
}

// if get access then we fetch the coordinates of current location and stores them temporarily
// in session which exists till page exist
function showPosition(position){
    
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
}

// after getting coordinates 
// call api and get weather info using latitude and longitude
// fetch weather information using coordinates for your weather screen
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;   // get latitude and longitude

    // now during calling API duration we need to display loading screen so, 
    grantAccessContainer.classList.remove("active");    // invisible grant access
    loadingScreen.classList.add("active");              // visible loading screen

    // API call
    try{
        // fetch api
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`); 
        const data=await response.json();  // convert info json format

        // now remove loading screen
        loadingScreen.classList.remove("active");

        // and show the weather info fetched from api
        userInfoContainer.classList.add("active");

        // render info on ui
        renderWeatherInfo(data);

    }
    // if api call fails then
    catch(err){
        loadingScreen.classList.remove("active"); // remove loading screen 
        console.log("error found!" , err); // show error
        alert("error");
    }
}

// after getting data render them on ui
function renderWeatherInfo(weatherInfo){
    // firstly fetch all the required elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temperature]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch all the values from data and store them in respective variables
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

// now current location data is visible now ,soif we want to switch between tabs
// switching
userTab.addEventListener('click',()=>{
    // pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener('click',()=>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
})

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        // switch bg properties
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;           // update current-tab
        currentTab.classList.add("current-tab");

        // to check which tab are you in: if this returns true it means that you are in user tab
        //  and have to switch to search tab , so make userTab invisible and searchTab visible
        if(!searchForm.classList.contains("active")){

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        // if returns false that means you are in searchtab so switch to usertab
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            // as now you are in usertab to make weather display in userTab you have to  check local storage for coordinates
            getFromSessionStorage();
           
        }

    }
}

// for search tab , to get user response on search bar
const searchInput=document.querySelector("[data-searchInput]");

// if user submits then, get the city name and call weather info function to get info using city name
searchForm.addEventListener("submit",(e)=>{

    // stops the default behavior of the form submission
    //When you submit a form (by pressing Enter or clicking a submit button), 
    // the default behavior of the browser is to:Reload the page Or navigate to the form’s action URL
    e.preventDefault(); 

    let cityName=searchInput.value;

    if(cityName=="")  // if cityname empty no need to work
        return;
    else fetchSearchWeatherInfo(cityName);

})

// fetch weather information using cityname for search screen
async function fetchSearchWeatherInfo(city){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const res=await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(res);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("error found!" , err);
        alert("error");
    }
    
}

// check if coordinates are present in session storage
function getFromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");

    // if coordinates not present it means you haven't grant access yet so show grant access screen
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }

    // if present than show weather info screen
    else{
        const coordinates=JSON.parse(localCoordinates);  // convert coordinates in json format
        fetchUserWeatherInfo(coordinates);  // call api to fetch information of weather on the basis of coordinates
    }
}


// practice api calls and fetching process
// function renderWeatherInfo(data){
    
//     let newPara=document.createElement('p');
//     newPara.textContent=`${data.current.temperature}°C`;

//     document.body.appendChild(newPara);

// }

// async function fetchWeatherDetails(){

//     try {
//         let city="orai";
//         const url=`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`;
        
//         const response = await fetch(url) // fetch api
//         const data =await response.json(); // convert it to json format

//         // console.log("weather data:->",data);

//         renderWeatherInfo(data);

//     } catch (error) {
//         console.log("error found!" , error);
//     }
    

    
// }