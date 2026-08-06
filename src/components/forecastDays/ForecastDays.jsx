import { useState } from "react";

function ForecastDays({ forecastDays, weatherByDay, restoreCurrentWeather }) {
  const [selectDate, setSelectDate] = useState(null);

  return (
    <div className="w-full bg-[#120944] p-2 text-[16px] text-yellow-600 flex flex-row justify-center gap-4">
      {forecastDays.map((day, index) => {
        const nomJour = new Date(day.date).toLocaleDateString("fr-FR", {
          weekday: "long",
        });

        return (
          <button
            key={day.date}
            onClick={() => {
              setSelectDate(day.date);
              index === 0 ? restoreCurrentWeather() : weatherByDay(day);
            }}
            autoFocu={index === 0}
            className={`${(selectDate === null ? index === 0 : day.date === selectDate) ? "scale-125 font-bold" : ""} hover:font-bold hover:scale-125 focus:font-bold focus:scale-125 focus:outline-none cursor-pointer`}
          >
            {nomJour}
          </button>
        );
      })}
    </div>
  );
}

export default ForecastDays;
