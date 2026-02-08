import Logo from "../images/Logo.svg";

export default function HeaderContainer() {
  return (
    <header className="w-full flex bg-[#F2F3FF]">
      <div className="w-[360px] flex items-center mt-8 mb-6 ml-32">
        <img src={Logo} alt="Logo" className="h-8 w-auto" />
      </div>
      <div className="w-full flex justify-end items-center mr-32">
        <nav className="flex flex-row gap-6 bg-white py-4 px-12 rounded-[40px] font-light">
          <a>Dashboard</a>
          <a>Mon profil</a>
          <a className="text-[#0B23F4] font-thin">|</a>
          <a className="text-[#0B23F4]">Se déconnecter</a>
        </nav>
      </div>
    </header>
  );
}
