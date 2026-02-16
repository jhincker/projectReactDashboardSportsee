import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Logo from "../images/Logo.svg";

export default function HeaderContainer() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const baseLinkClasses = "hover:text-[#0B23F4]";
  const activeLinkClasses = "text-[#0B23F4]";

  return (
    <header className="w-full flex bg-[#F2F3FF]">
      <div className="w-[360px] flex items-center mt-8 mb-6 ml-32">
        <NavLink to="/dashboard">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
        </NavLink>
      </div>

      <div className="w-full flex justify-end items-center mr-32">
        <nav className="flex flex-row gap-6 bg-white py-4 px-12 rounded-[40px] font-light">
          <p>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? `${baseLinkClasses} ${activeLinkClasses}`
                  : baseLinkClasses
              }
            >
              Dashboard
            </NavLink>
          </p>

          <p>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? `${baseLinkClasses} ${activeLinkClasses}`
                  : baseLinkClasses
              }
            >
              Mon profil
            </NavLink>
          </p>

          <span className="text-[#0B23F4] font-thin">|</span>

          <button
            onClick={handleLogout}
            className="text-[#0B23F4] hover:opacity-70"
          >
            Se déconnecter
          </button>
        </nav>
      </div>
    </header>
  );
}
