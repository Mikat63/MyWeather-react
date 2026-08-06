import logo from "../../assets/logo_transparent-300.webp";

function Header() {
  return (
    <header className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
      <img
        className="w-10 h-10 pointer-events-none drop-shadow-md"
        src={logo}
        alt="Icone de MyWeather"
      />
      <span className="text-lg font-semibold tracking-wide text-white">
        MyWeather
      </span>
    </header>
  );
}

export default Header;
