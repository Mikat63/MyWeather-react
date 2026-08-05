import { useEffect, useState } from "react";
import WeatherSection from "../WeatherSection/WeatherSection";

function Main() {
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecastDays, setForecastDays] = useState([]);

  useEffect(() => {
    // fetch api for json weather infos with 3 days forecast
    async function loadWeather(lat, lon) {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`,
      );
      const data = await res.json();
      console.log(data);

      setCurrentWeather({
        name: data.location.name,
        temp: Math.round(data.current.temp_c),
        tempMin: Math.round(data.forecast.forecastday[0].day.mintemp_c),
        tempMax: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
        icon: data.current.condition.icon,
        code: data.current.condition.code,
        wind: data.current.wind_kph,
      });

      setForecastDays(data.forecast.forecastday);
    }

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

    getPosition();

    const id = setInterval(
      () => {
        getPosition();
      },
      30 * 60 * 1000,
    );
    return () => clearInterval(id);
  }, []);

  function weatherByDay(day) {
    setCurrentWeather({
      name: currentWeather.name,
      temp: Math.round(temp),
      tempMin: day.day.mintemp_c,
      tempMax: day.day.maxtemp_c,
      icon: day.day.condition.icon,
      code: day.day.condition.code,
      wind: day.day.maxwind,
    });
  }

  return (
    <main className="w-full p-4 flex-1 flex flex-col items-center justify-center">
      <WeatherSection
        currentWeather={currentWeather}
        forecastDays={forecastDays}
      />
    </main>
  );
}

export default Main;
