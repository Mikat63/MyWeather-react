import { useEffect, useState } from "react";
import WeatherSection from "../WeatherSection/WeatherSection";
import SearchBar from "../SearchBar/SearchBar";

function Main() {
  const [weatherCards, setWeatherCards] = useState([]);
  const [search, setSearch] = useState(null);

  // fetch api for json weather infos with 3 days forecast
  async function loadWeather(lat, lon, researchTown) {
    // read whatever was cached from the last position-based load
    const storageWeather = JSON.parse(
      localStorage.getItem("userPositionWeather"),
    );

    // cache hit: only for the auto-position flow (not a search), and less than 30 min old
    if (
      storageWeather &&
      storageWeather.createdAt + 30 * 60 * 1000 < Date.now() &&
      !researchTown
    ) {
      // restore the cached cards array as-is, no fetch needed
      setWeatherCards(storageWeather.weatherCards);

      return;
    } else {
      // build the API query: searched city name if there is one, otherwise lat,lon
      const fetchValue = researchTown ? researchTown : `${lat},${lon}`;
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_KEY}&q=${fetchValue}&days=3&aqi=no&alerts=no`,
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

      // for now: always replace with a single card (no multi-card yet)

      const updateCards = [
        {
          id: weatherNow.name,
          currentWeather: weatherNow,
          liveWeather: weatherNow,
          forecastDays: data.forecast.forecastday,
        },
      ];

      researchTown ? setSearch(updateCards[0]) : setWeatherCards(updateCards);

      // only persist to localStorage for the auto-position flow, never for searches
      if (!researchTown) {
        localStorage.setItem(
          "userPositionWeather",
          JSON.stringify({
            weatherCards: updateCards,
            createdAt: Date.now(),
          }),
        );
      }
    }
  }

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

    getPosition();

    const id = setInterval(
      () => {
        getPosition();
      },
      30 * 60 * 1000,
    );
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function for have weather forecast days
  function weatherByDay(id, day) {
    setWeatherCards(
      weatherCards.map((cardToShow) => {
        if (id === cardToShow.id) {
          const newCurrentWeather = {
            name: cardToShow.currentWeather.name,
            temp: Math.round(day.day.avgtemp_c),
            tempMin: Math.round(day.day.mintemp_c),
            tempMax: Math.round(day.day.maxtemp_c),
            icon: `https:${day.day.condition.icon}`,
            code: day.day.condition.code,
            wind: day.day.maxwind_kph,
          };
          return { ...cardToShow, currentWeather: newCurrentWeather };
        } else {
          return cardToShow;
        }
      }),
    );
  }

  function restoreCurrentWeather(id) {
    setWeatherCards(
      weatherCards.map((cardToShow) =>
        cardToShow.id === id
          ? { ...cardToShow, currentWeather: cardToShow.liveWeather }
          : cardToShow,
      ),
    );
  }

  function addCard() {
    if (search) {
      const updateToCard = [...weatherCards, search];

      setWeatherCards(updateToCard);

      localStorage.setItem(
        "userPositionWeather",
        JSON.stringify({
          weatherCards: updateToCard,
          createdAt: Date.now(),
        }),
      );
      setSearch(null);
      return;
    } else {
      return;
    }
  }

  const cardToDisplay = search ? search : weatherCards[0];

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-4 gap-5">
      <SearchBar loadWeather={loadWeather} addCard={addCard} />
      {cardToDisplay && (
        <WeatherSection
          currentWeather={cardToDisplay.currentWeather}
          forecastDays={cardToDisplay.forecastDays}
          weatherByDay={(day) => weatherByDay(cardToDisplay.id, day)}
          restoreCurrentWeather={() => restoreCurrentWeather(cardToDisplay.id)}
        />
      )}
    </main>
  );
}

export default Main;
