import logo from "../../assets/logo_transparent.png";

function Header() {
  return (
    <header className="bg-[#282c34] min-h-[10vh] flex flex-col items-center justify-center text-[calc(10px + 2vmin)] text-white">
      <img
        className="h-25 pointer-events-none"
        src={logo}
        alt="Icone de MyWeather"
      />
    </header>
  );
}

export default Header;
