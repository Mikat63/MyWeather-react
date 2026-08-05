import ForecastDays from "../forecastDays/ForecastDays";

function WeatherSection({ currentWeather, forecastDays }) {
  // method to update widget background
  function getWeatherBackground(code) {
    if (code === 1000) return "bg-gradient-to-br from-sky-400 to-blue-500"; // sunny
    if (code === 1003) return "bg-gradient-to-br from-sky-300 to-slate-400"; // partly cloudy
    if ([1006, 1009].includes(code))
      return "bg-gradient-to-br from-slate-400 to-slate-600"; // cloudy
    if (code === 1087 || (code >= 1273 && code <= 1276))
      return "bg-gradient-to-br from-slate-700 to-slate-900"; // thunderstorm
    if ((code >= 1180 && code <= 1201) || code === 1063)
      return "bg-gradient-to-br from-slate-500 to-blue-700"; // rain
    if (code >= 1210 && code <= 1237)
      return "bg-gradient-to-br from-slate-200 to-blue-200"; // snow
    if ([1030, 1135].includes(code))
      return "bg-gradient-to-br from-slate-300 to-slate-500"; // fog

    return "bg-gradient-to-br from-slate-400 to-slate-600"; // fallback
  }

  return (
    <section
      className={`${getWeatherBackground(currentWeather.code)} w-[80%] text-slate-50 flex flex-col items-center pb-4 sm:w-[70%] md:w-[60%]`}
    >
      <ForecastDays />
      <span className="text-[28px] text-slate-50 pt-4">{currentWeather.name}</span>
      <p>
        <img
          src={currentWeather.icon}
          alt="Icone de la météo"
          className="w-32 h-32"
        />
      </p>
      <span className="text-[80px] text-shadow text-slate-50">{currentWeather.temp}</span>
      <div className="text-[20px] text-slate-50">Vent 1km/h (360°)</div>
    </section>
  );
}

export default WeatherSection;
