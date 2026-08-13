import { useState } from "react";

function ForecastDays({
  forecastDays,
  weatherByDay,
  restoreCurrentWeather,
  idCard,
}) {
  const [selectDate, setSelectDate] = useState(null);

  return (
    <div className="w-full flex flex-row justify-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-2xl p-1.5">
      {forecastDays.map((day, index) => {
        const nomJourCourt = new Date(day.date).toLocaleDateString("fr-FR", {
          weekday: "short",
        });
        const nomJourLong = new Date(day.date).toLocaleDateString("fr-FR", {
          weekday: "long",
        });

        const isSelected =
          selectDate === null ? index === 0 : day.date === selectDate;

        return (
          <button
            key={day.date}
            onClick={() => {
              setSelectDate(day.date);
              index === 0
                ? restoreCurrentWeather(idCard)
                : weatherByDay(idCard, day);
            }}
            autoFocus={index === 0}
            className={`flex-1 min-w-0 px-2 py-2 rounded-xl text-[13px] font-medium capitalize transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              isSelected
                ? "bg-white/90 text-slate-900 shadow-md scale-[1.03]"
                : "text-slate-200/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="sm:hidden">{nomJourCourt}</span>
            <span className="hidden sm:inline">{nomJourLong}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ForecastDays;
