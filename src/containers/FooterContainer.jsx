import LogoVisual from "../images/LogoVisual.svg";

export default function FooterContainer() {
  return (
    <footer className="w-full flex bg-white font-thin text-14">
      <div className="w-full flex items-center py-6 pl-8 gap-4">
        <p>©Sportsee</p>
        <p>Tous droits réservés</p>
      </div>
      <div className="w-full flex justify-end items-center pr-8">
        <nav className="flex flex-row gap-6">
          <a>Conditions générales</a>
          <a>Contact</a>
          <img src={LogoVisual} alt="Logo" className="w-auto" />
        </nav>
      </div>
    </footer>
  );
}
