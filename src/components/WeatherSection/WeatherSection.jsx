import React from "react";
import ForceastDays from "../forecastDays/ForceastDays";

function WeatherSection() {
  return (
    <section className="bg-[#0b0829] w-[70%] text-slate-50 flex flex-col gap-4 items-center">
      <ForceastDays />
      <span className="card-title">Lyon</span>
      <p>
        <img src="icons/sun.svg" />
      </p>
      <span className="text-[100px] text-shadow">15°</span>
      <div className="wind">Vent 1km/h (360°)</div>
    </section>
  );
}

export default WeatherSection;
