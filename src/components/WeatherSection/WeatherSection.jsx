import ForecastDays from "../forecastDays/ForecastDays";

function WeatherSection({
  currentWeather,
  forecastDays,
  weatherByDay,
  restoreCurrentWeather,
  idCard,
}) {
  // method to update widget background
  function getWeatherBackground(code) {
    if (code === 1000)
      return "bg-linear-to-br from-sky-400 via-sky-500 to-blue-600"; // sunny
    if (code === 1003)
      return "bg-linear-to-br from-sky-300 via-slate-400 to-slate-500"; // partly cloudy
    if ([1006, 1009].includes(code))
      return "bg-linear-to-br from-slate-400 via-slate-500 to-slate-600"; // cloudy
    if (code === 1087 || (code >= 1273 && code <= 1276))
      return "bg-linear-to-br from-slate-700 via-indigo-900 to-slate-900"; // thunderstorm
    if ((code >= 1180 && code <= 1201) || code === 1063)
      return "bg-linear-to-br from-slate-600 via-blue-700 to-slate-800"; // rain
    if (code >= 1210 && code <= 1237)
      return "bg-linear-to-br from-slate-300 via-sky-200 to-blue-300"; // snow
    if ([1030, 1135].includes(code))
      return "bg-linear-to-br from-slate-300 via-slate-400 to-slate-500"; // fog

    return "bg-linear-to-br from-slate-400 via-slate-500 to-slate-600"; // fallback
  }

  return (
    <section
      className={`${getWeatherBackground(currentWeather.code)} relative w-[90%] max-w-sm min-h-120 rounded-4xl border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl text-slate-50 flex flex-col items-center gap-1 px-6 pt-6 pb-8 sm:w-[70%] md:w-[60%] transition-colors duration-700`}
    >
      <ForecastDays
        forecastDays={forecastDays}
        weatherByDay={weatherByDay}
        restoreCurrentWeather={restoreCurrentWeather}
        idCard={idCard}
      />

      <span className="mt-3 text-sm font-medium uppercase tracking-[0.15em] text-slate-100/80">
        {currentWeather.name}
      </span>

      <img
        src={currentWeather.icon}
        alt="Icone de la météo"
        className="w-28 h-28 -my-1 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
        fetchPriority="high"
      />

      <span className="text-[88px] leading-none font-extralight text-shadow tracking-tighter text-slate-50">
        {currentWeather.temp}°
      </span>

      <div className="flex gap-2 text-[13px] font-medium text-slate-100/80 mt-1 mb-3">
        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
          min {currentWeather.tempMin}°
        </span>
        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
          max {currentWeather.tempMax}°
        </span>
      </div>

      <div className="flex items-center gap-2 text-[14px] text-slate-100/70 pt-3 border-t border-white/10 w-full justify-center">
        <span>Vent</span>
        <span className="font-semibold text-slate-50">
          {currentWeather.wind} km/h
        </span>
      </div>
    </section>
  );
}

export default WeatherSection;
