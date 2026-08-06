import { useEffect, useState } from "react";
import WeatherSection from "../WeatherSection/WeatherSection";

function Main() {
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecastDays, setForecastDays] = useState([]);
  const [liveWeather, setLiveWeather] = useState({});

  useEffect(() => {
    // give position, if failed or user decline, the function will use Aubiere position
    function getPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            loadWeather(
              Math.round(pos.coords.latitude * 1000) / 1000,
              Math.round(pos.coords.longitude * 1000) / 1000,
            );
          },
          () => {
            // fallback Aubière if user don't accept to be locate
            loadWeather(45.7494, 3.1123);
          },
          { enableHighAccuracy: true },
        );
      } else {
        // fallback Aubière if there's a problem
        loadWeather(45.7494, 3.1123);
      }
    }

    // fetch api for json weather infos with 3 days forecast
    async function loadWeather(lat, lon) {
      const storageWeather = JSON.parse(
        localStorage.getItem("userPositionWeather"),
      );

      if (
        storageWeather &&
        storageWeather.createdAt + 30 * 60 * 1000 < Date.now()
      ) {
        setCurrentWeather(storageWeather.currentWeather);
        setLiveWeather(storageWeather.liveWeather);
        setForecastDays(storageWeather.forecastDays);
        return;
      } else {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`,
        );
        const data = await res.json();

        const weatherNow = {
          name: data.location.name,
          temp: Math.round(data.current.temp_c),
          tempMin: Math.round(data.forecast.forecastday[0].day.mintemp_c),
          tempMax: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
          icon: `https:${data.current.condition.icon}`,
          code: data.current.condition.code,
          wind: data.current.wind_kph,
        };

        setLiveWeather(weatherNow);
        setCurrentWeather(weatherNow);

        setForecastDays(data.forecast.forecastday);

        localStorage.setItem(
          "userPositionWeather",
          JSON.stringify({
            currentWeather: weatherNow,
            liveWeather: weatherNow,
            forecastDays: data.forecast.forecastday,
            createdAt: Date.now(),
          }),
        );
      }
    }

    getPosition();

    const id = setInterval(
      () => {
        getPosition();
      },
      30 * 60 * 1000,
    );
    return () => clearInterval(id);
  }, []);

  // function for have weather forecast days
  function weatherByDay(day) {
    setCurrentWeather({
      name: currentWeather.name,
      temp: Math.round(day.day.avgtemp_c),
      tempMin: Math.round(day.day.mintemp_c),
      tempMax: Math.round(day.day.maxtemp_c),
      icon: `https:${day.day.condition.icon}`,
      code: day.day.condition.code,
      wind: day.day.maxwind_kph,
    });
  }

  function restoreCurrentWeather() {
    setCurrentWeather(liveWeather);
  }

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-10">
      <WeatherSection
        currentWeather={currentWeather}
        forecastDays={forecastDays}
        weatherByDay={weatherByDay}
        restoreCurrentWeather={restoreCurrentWeather}
      />
    </main>
  );
}

export default Main;
