import { useEffect, useRef, useState } from "react";
import WeatherSection from "../WeatherSection/WeatherSection";
import SearchBar from "../SearchBar/SearchBar";

function Main() {
  const [weatherCards, setWeatherCards] = useState([]);
  const [searchTown, setSearchTown] = useState(null);
  const weatherCardsRef = useRef(weatherCards);

  // give position, if failed or user decline, the function will use Aubiere position
  useEffect(() => {
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
        weatherCardsRef.current.slice(1).map((weatherCard) => {
          loadWeather(undefined, undefined, weatherCard.name, true);
        });
      },
      30 * 60 * 1000,
    );
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    weatherCardsRef.current = weatherCards;
  }, [weatherCards]);

  // fetch api for json weather infos with 3 days forecast
  async function loadWeather(lat, lon, researchTown, isRefresh) {
    // read whatever was cached from the last position-based load
    const storageWeather = JSON.parse(localStorage.getItem("myWeather"));

    // cache hit: only for the auto-position flow (not a search), and less than 30 min old
    if (
      storageWeather &&
      storageWeather.createdAt + 30 * 60 * 1000 > Date.now() &&
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

      const updateCards = {
        id: researchTown ? data.location.name : "defaultCard",
        currentGeolocoWeather: weatherNow,
        saveCurrentGeolocWeather: weatherNow,
        forecastDays: data.forecast.forecastday,
      };

      if (isRefresh) {
        const updatedCards = weatherCards.map((weatherCard) => {
          if (updateCards.id === weatherCard.id) {
            return updateCards;
          } else {
            return weatherCard;
          }
        });
        setWeatherCards(updatedCards);
      } else if (researchTown) {
        setSearchTown(updateCards);
      } else {
        setWeatherCards([updateCards]);

        // only persist to localStorage for the auto-position flow, never for searches
        localStorage.setItem(
          "myWeather",
          JSON.stringify({
            weatherCards: [updateCards],
            createdAt: Date.now(),
          }),
        );
      }
    }
  }

  // swap the displayed weather for a clicked forecast day, on whichever card is currently showing
  function weatherByDay(id, day) {
    // case 1: the displayed card is the search preview
    if (searchTown && searchTown.id === id) {
      // rebuild a weatherNow-shaped object, but from the clicked day's stats instead of today's
      const daySelected = {
        name: searchTown.currentGeolocoWeather.name,
        temp: Math.round(day.day.avgtemp_c),
        tempMin: Math.round(day.day.mintemp_c),
        tempMax: Math.round(day.day.maxtemp_c),
        icon: `https:${day.day.condition.icon}`,
        code: day.day.condition.code,
        wind: day.day.maxwind_kph,
      };

      // only currentGeolocoWeather changes; saveCurrentGeolocWeather stays untouched for restoreCurrentWeather
      setSearchTown({ ...searchTown, currentGeolocoWeather: daySelected });
    } else {
      // case 2: the displayed card is one of the saved cards in weatherCards
      const daySelected = {
        temp: Math.round(day.day.avgtemp_c),
        tempMin: Math.round(day.day.mintemp_c),
        tempMax: Math.round(day.day.maxtemp_c),
        icon: `https:${day.day.condition.icon}`,
        code: day.day.condition.code,
        wind: day.day.maxwind_kph,
      };

      // rebuild the whole array, only replacing the card that matches id
      const updatedCards = weatherCards.map((card) => {
        if (card.id === id) {
          return {
            ...card,
            currentGeolocoWeather: {
              ...daySelected,
              name: card.currentGeolocoWeather.name,
            },
          };
        } else {
          return card;
        }
      });

      setWeatherCards(updatedCards);
    }
  }

  function restoreCurrentWeather(id) {
    if (searchTown && searchTown.id === id) {
      setSearchTown({
        ...searchTown,
        currentGeolocoWeather: searchTown.saveCurrentGeolocWeather,
      });
    } else {
      setWeatherCards([
        {
          ...weatherCards[0],
          currentGeolocoWeather: weatherCards[0].saveCurrentGeolocWeather,
        },
      ]);
    }
  }

  function addCard() {
    // nothing to add if no town has been searched yet
    if (!searchTown) return;

    const updateCards = [...weatherCards, searchTown];
    setSearchTown(null);

    localStorage.setItem(
      "myWeather",
      JSON.stringify({
        weatherCards: updateCards,
        createdAt: Date.now(),
      }),
    );

    return setWeatherCards(updateCards);
  }

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-4 gap-5">
      <SearchBar loadWeather={loadWeather} addCard={addCard} />

      <section class="w-full flex flex-row justify-center">
        {/* only render once the geoloc card exists; searchTown may still override what's shown */}
        {weatherCards[0] && (
          <WeatherSection
            currentWeather={
              searchTown
                ? searchTown.currentGeolocoWeather
                : weatherCards[0].currentGeolocoWeather
            }
            forecastDays={
              searchTown
                ? searchTown.forecastDays
                : weatherCards[0].forecastDays
            }
            weatherByDay={weatherByDay}
            idCard={searchTown ? searchTown.id : weatherCards[0].id}
            restoreCurrentWeather={restoreCurrentWeather}
          />
        )}
      </section>

      <div className="w-[50%] p-0.5 bg-white/20 rounded-md"></div>

      <section class="w-full flex flex-row justify-center">
        {weatherCards.slice(1).map((weatherCard) => {
          return (
            <WeatherSection
              key={weatherCard.id}
              currentWeather={weatherCard.currentGeolocoWeather}
              forecastDays={weatherCard.forecastDays}
              weatherByDay={weatherByDay}
              idCard={weatherCard.id}
            />
          );
        })}
      </section>
    </main>
  );
}

export default Main;
