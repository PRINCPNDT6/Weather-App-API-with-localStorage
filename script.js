const API_KEY = `cc39b3fd753f279781239cea0d514532`
// const API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid = ${API_KEY}&units=metric`
{/* <img src = 'https://openweathermap.org/img/wn/${}@2x'>  */}

const container = document.querySelector('.container')
const weatherInfo = document.getElementById('weatherInfo')

const renderWeatherApp = (data)=>{
    console.log('data from renderWeatherApp:',data);
    weatherInfo.innerHTML = '';
     if(data.cod == 404){
        // console.log(data.message);
        const notFound = document.createElement('h2')
        notFound.className = 'notFound'
        notFound.innerHTML = `Oops:${data.message}`;
        weatherInfo.appendChild(notFound)
        return;
        
    }
    
    // const weatherInfoBox = document.createElement('div')
    // weatherInfoBox.className = 'weatherInfoBox'

    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const date = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    
    const dayWithDate = document.createElement('span')
    dayWithDate.className = 'dayWithDate';
    dayWithDate.innerHTML = `${day}, ${date}`;
    weatherInfo.appendChild(dayWithDate)

    //////
    function getCityTime(timezone) {
    const now = new Date();

     
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;

    
    const cityTime = new Date(utc + timezone * 1000);

    let hours = cityTime.getHours();
    let minutes = cityTime.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    }

    setInterval(() => {
    time.innerHTML = getCityTime(data.timezone);
    }, 60000);


    const time = document.createElement('span')
    time.className = 'time';
    time.innerHTML = getCityTime(data.timezone)
    weatherInfo.appendChild(time)

    const name = document.createElement('span')
    name.className = 'name';
    name.innerHTML = `${data.name},${data.sys.country}`
    weatherInfo.appendChild(name)

    const weatherImages = {
    Clear: 'assets/clear.png',
    Clouds: 'assets/cloud.png',
    Rain: 'assets/rain.png',
    Drizzle: 'assets/rain.png',
    Thunderstorm: 'assets/rain.png',
    Snow: 'assets/snow.png',
    Mist: 'assets/mist.png',
    Haze: 'assets/mist.png',
    Fog: 'assets/mist.png',
    Smoke: 'assets/mist.png',
    Dust: 'assets/mist.png',
    Sand: 'assets/mist.png',
    Ash: 'assets/mist.png'
    };



    const img = document.createElement('img')
    img.className = 'weatherImg'
    img.src = weatherImages[data.weather[0].main] || 'assets/clear.png';
    weatherInfo.appendChild(img)

    const temp = document.createElement('span')
    temp.className = 'temp'
    temp.innerHTML = `${Math.round(data.main.temp)}°C`;
    weatherInfo.appendChild(temp)

    const main = document.createElement('span')
    main.className = 'main'
    main.innerHTML = `${data.weather[0].main}`;
    weatherInfo.appendChild(main)

     



    const hr = document.createElement('hr')
    hr.className = 'hr'
    weatherInfo.appendChild(hr)

    const moreInfoBox = document.createElement('div')
    moreInfoBox.className = 'moreInfoBox'

    const moreInfoA = [ data.weather[0].description, `${data.wind.speed} m/s`, `${data.main.pressure} hPa`, `${data.main.humidity} %`]

    moreInfoA.forEach(item => {
    const span = document.createElement('span')
    span.innerHTML = item;
    // span.className = 'span'
    moreInfoBox.appendChild(span) 
    })
    weatherInfo.appendChild(moreInfoBox)
}

 function setWeatherBackground(main) {
  // remove old classes
   container.classList.remove(
    'clear',
    'clouds',
    'rain',
    'snow',
    'mist',
    'default'
  );

  if (main === 'Clear') {
    container.classList.add('clear');
  } 
  else if (main === 'Clouds') {
    container.classList.add('clouds');
  } 
  else if (main === 'Rain' || main === 'Drizzle' || main === 'Thunderstorm') {
    container.classList.add('rain');
  } 
  else if (main === 'Snow') {
    container.classList.add('snow');
  } 
  else if (
    main === 'Mist' ||
    main === 'Haze' ||
    main === 'Fog' ||
    main === 'Smoke' ||
    main === 'Dust' ||
    main === 'Sand' ||
    main === 'Ash'
  ) {
    container.classList.add('mist');
  } 
  else {
    container.classList.add('default');
  }
}

const getWeather = async (city)=>{
    console.log('city from getWeather', city);
    
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    const response = await fetch(api);
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    
    // console.log('status',data.cod);
    // console.log('city from getWeather:',city);
    
    renderWeatherApp(data)
    setWeatherBackground(data.weather[0].main);

}

 

const setCity = (city)=>{
    let cities = city;
    
    console.log('cities from setCity:', cities);
    
    const userCity = JSON.parse(localStorage.getItem('city')) || [];
    if(userCity[userCity.length - 1]?.usercity === city) return;
    userCity.push({
        usercity: cities
    });

    let setItem = localStorage.setItem('city',JSON.stringify(userCity));
    
    // console.log(userCity.usercity);
    getWeather(city)
    
    // console.log('city from setCity:', userCity.usercity);
    

}

 const getCity = () =>{
    let Allcity = JSON.parse(localStorage.getItem('city')) || [];
    if(Allcity.length === 0) return;

    const lastCity = Allcity[Allcity.length - 1].usercity;
    getWeather(lastCity)
    console.log('last city from getCity', lastCity);
    
    // getItem.forEach(item =>{
    //     getWeather(item.usercity)
    // });

 }

 getCity();

// getWeather('meerut')

const search = document.getElementById('search')
search.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
        if(search.value === '') return;
        
        setCity(search.value)
        // console.log('search value from eventListner:',search.value);
        // console.log(search.value);
        


        search.value = '';
        
    }
})
































/*
const city = 'meerut'
const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid = ${API_KEY}&units=metric`;
const xhr = new XMLHttpRequest();
xhr.open('GET',url)
xhr.onload = function(){
    console.log(this.responseText);
    
}
xhr.send();
*/

