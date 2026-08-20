import { useState } from "react";

function SearchBar({ loadWeather, addCard }) {
  const [researchTown, setResearchTown] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    loadWeather(undefined, undefined, researchTown, false);
  }

  return (
    <div className="w-[90%] max-w-sm sm:w-[70%] sm:max-w-md md:w-[60%] md:max-w-lg flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 shadow-lg shadow-black/20">
      <button
        onClick={addCard}
        type="button"
        aria-label="Ajouter une ville"
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-slate-50 text-xl leading-none hover:bg-white/10 hover:scale-110 focus:bg-white/10 focus:scale-110 focus:outline-none active:scale-95 transition"
      >
        +
      </button>

      <form
        onSubmit={handleSubmit}
        action=""
        className="flex-1 flex items-center gap-2 min-w-0"
      >
        <input
          type="text"
          value={researchTown}
          onChange={(event) => setResearchTown(event.target.value)}
          placeholder="Rechercher une ville"
          className="flex-1 min-w-0 bg-white/10 rounded-full px-4 py-2 text-sm text-slate-50 placeholder:text-slate-300/60 outline-none focus:ring-2 focus:ring-white/30 transition"
        />

        <button
          type="submit"
          aria-label="Rechercher"
          className="shrink-0 rounded-full px-3 py-2 sm:px-5 text-sm font-medium text-slate-50 bg-white/10 hover:bg-white/20 active:scale-95 focus:bg-white/10 focus:scale-110 focus:outline-none transition"
        >
          <span className="hidden sm:inline focus:bg-white/10 focus:scale-110 focus:outline-none">
            Rechercher
          </span>
          <span className="sm:hidden" aria-hidden="true">
            🔍
          </span>
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
