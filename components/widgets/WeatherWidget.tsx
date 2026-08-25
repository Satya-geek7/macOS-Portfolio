"use client";

import { useNow } from "@/lib/use-now";
import { weather } from "@/lib/portfolio.config";

export default function WeatherWidget() {
  const now = useNow(60_000);
  const hour = now ? now.getHours() : 12;
  const isNight = hour < 6 || hour >= 19;

  return (
    <div className="widget weather-widget">
      <div className="widget-head">{weather.city}</div>

      <div className="weather-top">
        <div>
          <div className="weather-temp">{weather.temp}°</div>
          <div className="weather-cond">
            {weather.condition} {isNight ? "Night" : "Day"}
          </div>
          <div className="weather-range">
            H:{weather.high}° L:{weather.low}°
          </div>
        </div>
        <div className="weather-sun" aria-hidden="true" />
      </div>

      <div className="weather-meta">
        <span>Humidity {weather.humidity}%</span>
        <span>Wind {weather.wind} km/h</span>
      </div>
    </div>
  );
}
