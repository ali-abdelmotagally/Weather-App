import React, { useEffect, useState } from 'react'
import Location from '../assets/Location.svg'
import feels_like from '../assets/feels_like.svg'
import humidity from '../assets/humidity.svg'
import rain_icon from '../assets/rain.svg'
import uv_icon from '../assets/uv.svg'
import wind from '../assets/wind.svg'
import visibility_icon from '../assets/visibility.svg'
import dew from '../assets/dew-point-filled.svg'
import air_pressure from '../assets/pressure.svg'
import morning from '../assets/wallpapers/morning.jpg'
import day from '../assets/wallpapers/day.jpg'
import sunset from '../assets/wallpapers/sunset.jpg'
import night from '../assets/wallpapers/night.jpg'
import right_arrow from '../assets/right-arrow.svg'
import moon from '../assets/moon.svg'


export default function Home() {
    const [weatherData, setWeatherData] = useState(null);
    const [airQualityData, setAirQualityData] = useState(null);
    const [Loading, setLoading] = useState(true)

    // added city search
    const [citySearch, setCitySearch] = useState("");
    const [cityResults, setCityResults] = useState([]);


    //default city
    const [location, setLocation] = useState(() => {
  const savedLocation = localStorage.getItem("weatherLocation");

  return savedLocation ? JSON.parse(savedLocation) : 
      {
        name: "Assiut",
        country: "Egypt",
        latitude: 27.18096,
        longitude: 31.18368,
      };
});

  useEffect(() => {
  localStorage.setItem("weatherLocation", JSON.stringify(location));
  }, [location]);

    // getting current hour
    const currentHour = weatherData?.current.time.slice(0, 13) + ":00";
    const hourIndex = weatherData?.hourly.time.indexOf(currentHour);
    const actual_temp = weatherData?.current.temperature_2m; //actual temp
    const feels_like_temp = weatherData?.current.apparent_temperature; //feels-like temp
    // const time = weatherData?.current.time;
    const windspeed = weatherData?.current.wind_speed_10m;
    const humditiy = weatherData?.current.relative_humidity_2m;
    const lat = weatherData?.latitude;
    const long = weatherData?.longitude;
    // const elev = weatherData?.elevation;
    const rainChance = weatherData?.hourly.precipitation_probability[hourIndex];
    const uv = weatherData?.hourly.uv_index[hourIndex];
    const pressure = weatherData?.current.pressure_msl;
    const visibility = hourIndex >= 0 ? weatherData?.hourly.visibility[hourIndex] : null;
    const dewPoint = weatherData?.hourly.dew_point_2m[hourIndex];
    const moonPhase = weatherData?.daily.moon_phase[0]


  // city search function
  async function searchCity() {
  if (citySearch.trim().length < 2) return;

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(citySearch)}&count=5&language=en`
    );

    const data = await response.json();

    setCityResults(data.results ?? []);
  } catch (error) {
    console.log(error.message);
  }
}

function selectCity(city) {
  setLocation({
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude,
  });

  setCitySearch("");
  setCityResults([]);
}
    
  //moon phases meaning
  function getMoonPhase(phase) {
  if (phase < 0.0625 || phase >= 0.9375) return "New Moon";
  if (phase < 0.1875) return "Waxing Crescent";
  if (phase < 0.3125) return "First Quarter";
  if (phase < 0.4375) return "Waxing Gibbous";
  if (phase < 0.5625) return "Full Moon";
  if (phase < 0.6875) return "Waning Gibbous";
  if (phase < 0.8125) return "Last Quarter";
  return "Waning Crescent";
}

  const moonPhaseName = getMoonPhase(moonPhase);


    // weather state by code
   const weatherDescriptions = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  5: "Haze",
  10: "Mist",
  19: "Funnel cloud",
  20: "Funnel cloud",
  21: "Rain",
  22: "Snow",
  45: "Fog",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  56: "Light Freezing Drizzle",
  57: "Dense Freezing Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Light Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Slight Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  85: "Slight Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Slight Hail",
  99: "Thunderstorm with Heavy Hail",
};
    

    const weatherCode = weatherData?.current.weather_code;

    const aqi = airQualityData?.current.us_aqi;

    // air quality meaning
    const aqiMeanings = [
  {
    min: 0,
    max: 50,
    category: "Good",
    meaning: "Air quality is satisfactory, with little or no health risk.",
  },
  {
    min: 51,
    max: 100,
    category: "Moderate",
    meaning: "Air quality is acceptable, but unusually sensitive people may experience minor effects.",
  },
  {
    min: 101,
    max: 150,
    category: "Unhealthy for Sensitive Groups",
    meaning: "Sensitive people may experience health effects.",
  },
  {
    min: 151,
    max: 200,
    category: "Unhealthy",
    meaning: "Everyone may begin experiencing health effects.",
  },
  {
    min: 201,
    max: 300,
    category: "Very Unhealthy",
    meaning: "Health alert: everyone may experience more serious health effects.",
  },
  {
    min: 301,
    max: 500,
    category: "Hazardous",
    meaning: "Health warning: everyone is more likely to be affected.",
  },
  ];

  const aqiInfo = aqiMeanings.find((item) => aqi >= item.min && aqi <= item.max)

  const category = aqiInfo?.category ?? "Unknown";
  const meaning = aqiInfo?.meaning ?? "No information available.";




useEffect(() => {
 async function getWeather(){
  try{
  const weatherUrl =
  `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,uv_index,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,moon_phase,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,rain_sum,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=7`;

  const airQualityUrl =
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;

     const [weatherResponse, airQualityResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(airQualityUrl),
      ]);

    
    const weather = await weatherResponse.json();
    const airQuality = await airQualityResponse.json();


  if(!weatherResponse.ok || !airQualityResponse.ok){
  throw new Error("Couldn't fetch data.")
  }

  setWeatherData(weather);
  setAirQualityData(airQuality);
  console.log(weather)
  console.log(airQuality)

  }
  catch(error){
    console.log(error.message)
  }
  finally{
    setLoading(false)
  }

}
    
getWeather();

    const interval = setInterval(getWeather, 5 * 60 * 1000); // updates weather data every 5 minutes

   return () => clearInterval(interval);
}, [location.latitude, location.longitude])

// know the time
function getTimeOfDay(weatherData) {
  const now = new Date(weatherData.current.time);
  const sunrise = new Date(weatherData.daily.sunrise[0]);
  const sunset = new Date(weatherData.daily.sunset[0]);

  const minutesAfterSunrise = (now - sunrise) / 60000;
  const minutesUntilSunset = (sunset - now) / 60000;

  if (minutesAfterSunrise >= 0 && minutesAfterSunrise <= 120) {
    return "morning";
  }

  if (minutesUntilSunset >= -60 && minutesUntilSunset <= 60) {
    return "sunset";
  }

  if (weatherData.current.is_day === 0) {
    return "night";
  }

  return "day";
}


// change wallpaper depending on time 
const timeOfDay = weatherData
  ? getTimeOfDay(weatherData)
  : "day";

const backgrounds = {
  morning: morning,
  day: day,
  sunset: sunset,
  night: night,
};



if (Loading || !weatherData) 
    {
    return <p className='text-red-600 bg-red-200 text-center text-lg'>Loading Weather...</p>;
    }
return (
    <>
    
    <div
  className="min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${backgrounds[timeOfDay]})`
  }}
>

  {/* search bar UI */}
  <div className="flex justify-center gap-2 pt-6">
 <input
  value={citySearch}
  onChange={(e) => {
    setCitySearch(e.target.value);

    if (e.target.value.trim() === "") {
      setCityResults([]);
    }
  }}
    placeholder="Search for a city..."
    className="rounded-3xl px-3 py-2 text-white/60 bg-black/40 backdrop-blur-lg focus:outline-none focus:ring-2 focus:border-white/50 focus:bg-black/60 transition duration-200 placeholder:text-white/50"
  />

  <button
    onClick={searchCity}
    className="cursor-pointer rounded-3xl bg-black/40 px-4 py-2 text-white/60 hover:bg-black/60 hover:text-white/75 transition duration-200"
  >
    Search
  </button>
</div>

{cityResults.length > 0 && (
  <div className="bg-black/30 w-fit mx-auto p-4 rounded-xl backdrop-blur-2xl shadow-lg text-white/60 text-center mt-2">
    {cityResults.map((city) => (
      <button
        key={city.id}
        onClick={() => selectCity(city)}
        className="block mx-auto p-2 hover:bg-black/30 rounded-lg w-full"
      >
        {city.name}, {city.country}
        {city.admin1 && ` - ${city.admin1}`}
      </button>
    ))}
  </div>
)}


    <h1 className={` ${timeOfDay  === 'morning' ?  "text-black/75" : "text-white/75"} opacity-80 text-5xl font-bold pt-20 text-center`}> {actual_temp} °C</h1>

    
    <p
  className={`flex justify-center gap-1 ${
    timeOfDay === "morning" ? "text-black/75" : "text-white/75"
  } opacity-80 text-md font-semibold pt-2 text-center`}
>
  <img
    className={`w-5 ${
      timeOfDay === "morning" ? "invert-35" : "invert-75"
    }`}
    src={Location}
    alt="Location"
  />

  {location.name}, {location.country}
</p>

    <p className={`text-center pt-2 text-lg ${timeOfDay === 'morning' ?  "text-black/75" : "text-white/75"} opacity-80 font-bold`}>{weatherDescriptions[weatherCode] ?? "Unknown"} 
    <a href='https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM'
    target='blank'
    className='font-thin'> *
    </a>
    </p>


    <div className={` ${timeOfDay  === 'morning' ?  "text-black/75" : "text-white/75"} text-sm mx-auto mt-3 flex justify-center gap-4 font-thin`}>
    <div className="">Latitude {lat}</div>
    <div className="">Longitude {long}</div>
    </div>



{/* cards */}

<div className="mt-6 w-[80%] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center whitespace-nowrap gap-4 text-white/75">

    <div className="mb-6 w-full p-5 bg-black/30 rounded-2xl  backdrop-blur-lg shadow-lg ">
      <p className=""> 
      <img className='w-5 invert-75' src={feels_like}></img>Feels like</p>
      <p className="font-bold">{feels_like_temp} °C</p>
    </div>

    <div className="mb-6 w-full p-5 bg-black/30 rounded-2xl  backdrop-blur-lg shadow-lg ">
      <p className=""> 
      <img className='w-5 invert-75' src={humidity}></img>Humidity</p>
      <p className="font-bold">{humditiy}%</p>
    </div>

    <div className="mb-6 w-full p-5 bg-black/30 rounded-2xl backdrop-blur-lg shadow-lg ">
      <p className="">
      <img className='w-5 invert-75' src={wind}></img>Wind Speed</p>
      <p className="font-bold">{windspeed} km/h</p>
    </div>

    <div className="mb-6 w-full pt-2 px-5 bg-black/30 rounded-2xl backdrop-blur-lg shadow-lg ">
      <p className="">
      <img className='w-8 invert-75' src={air_pressure}></img>Pressure</p>
      <p className="font-bold">{pressure} hPa</p>
    </div>

     <div className="mb-6 w-full p-5 bg-black/30 rounded-2xl backdrop-blur-lg shadow-lg ">
      <p className="sm:text-base whitespace-normal">
      <img className='w-6  pr-2 invert-75' src={rain_icon}></img>Chance of Rain</p>
      <p className="font-bold">{rainChance}%</p>
    </div>

    <div className="mb-6 w-full p-5 bg-black/30 rounded-2xl backdrop-blur-lg shadow-lg ">
      <p className="">
      <img className='w-5 invert-75' src={visibility_icon}></img>Visibility</p>
      <p className="font-bold">{(visibility/1000).toFixed(1)} km</p>
    </div>

     <div className="mb-6 w-full p-5 bg-black/30 rounded-2xl backdrop-blur-lg shadow-lg ">
      <p className="">
      <img className='w-5 invert-75' src={uv_icon}></img>UV Index</p>
      <p className="font-bold">{uv} 
      {uv <= 2
      ? " Low"
      : uv <= 5
      ? " Moderate"
      : uv <= 7
      ? " High"
      : uv <= 10
      ? " Very High"
      : " Extreme"
      }
      </p>
    </div>

       <div className="mb-6 w-full p-5 bg-black/30 rounded-2xl backdrop-blur-lg shadow-lg md:col-start-3 lg:col-start-auto">
      <p className="">
      <img className='w-5 invert-75' src={dew}></img>Dew Point</p>
      <p className="font-bold">{dewPoint} °</p>
    </div>
  </div>


  {/* air quality */}

   <div className="w-[80%] grid grid-cols-1 md:grid-cols-[2fr_2fr] gap-4 mx-auto text-white/80">

    <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl px-4 pt-2 pb-4 min-w-5rem">
    <p className='font-bold'>Air Quality</p>
    <p className='pt-2'>{category} <strong>{aqi}</strong></p>

    <div className="flex justify-between items-center pr-2">
      <p className="pt-2 pb-4 text-sm">{meaning}</p>

      <a
        className="w-4 pb-3 shrink-0"
        href="https://open-meteo.com/en/docs/air-quality-api?hourly=pm10,pm2_5,us_aqi"
        target="_blank"
      >
        <img className="invert-100 hover:opacity-80" src={right_arrow} alt="Open documentation"/>
      </a>
    </div>
  </div>

  <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl px-4 pt-2 pb-4">
    <div className="flex gap-2 items-center">
    <p className='font-bold'>Moon Phase</p> 
    <img className='w-5 invert' src={moon}></img>
    </div>
  
    <p className='pt-4'>{moonPhaseName}</p>
    
  </div>

   </div>



  {/* multi-day forecast */}

<div className="text-white/75 w-[80%] mx-auto pt-6 pb-6">

  <p className="text-lg font-semibold mb-4">
    Multi-day forecast
  </p>

  <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-5">

    {weatherData.daily.time.map((date, index) => (
      <div
        key={date}
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-4 border-b border-white/10"
      >

        {/* Date */}
        <p className="font-medium text-left">
          {date === new Date().toLocaleDateString("en-CA")
            ? "Today"
            : date === new Date(Date.now() + 86400000).toLocaleDateString("en-CA")
            ? "Tomorrow"
            : new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
        </p>

        {/* Weather description */}
        <p className="text-sm text-white/60 text-center">
          {weatherDescriptions[weatherData.daily.weather_code[index]] ?? "Unknown"}
        </p>

        {/* Temperatures */}
        <p className="font-semibold text-right whitespace-nowrap">
          <span className="text-white/50 font-normal">
            {weatherData.daily.temperature_2m_min[index]}°
          </span>
          {" / "}
          {weatherData.daily.temperature_2m_max[index]}°C
        </p>

      </div>
    ))}

  </div>
</div>
</div>
  </>
  )
}
