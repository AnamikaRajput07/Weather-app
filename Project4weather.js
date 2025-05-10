const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector(".form-container");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

// variables
let currentTab=userTab;
const API_KEY="df282950cb92023a94090583f1bc7d8f";
currentTab.classList.add("current-tab");

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


// call api and get weather info using latitude and longitude
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;   // get latitude and longitude

    // now during calling API duration we need to display loading screen so, 
    grantAccessContainer.classList.remove("active");    // invisible grant access
    loadingScreen.classList.add("active");              // visible loading screen

    // API call
    try{
        // fetch api
        const response=await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${lat},${lon}`); // add url?
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
    }
}

function renderWeatherInfo(data){
    // firstly fetch all the required elements

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temperature]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fetch all the values from data and store them in respective variables
}

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