// Ou Root.jsx

import Logo from "../images/Logo.svg";
import login from "../images/login.jpg";
import UserForm from "../components/auth/UserForm.jsx";
import { useUsers } from "../context/usersContext.jsx";

const LoginPage = () => {
  const { users, loading, error } = useUsers();
  return (
    <>
      <div className="inter grid grid-cols-[2fr_3fr] ">
        <div
          id="leftside"
          className="flex justify-center h-screen w-full bg-[#F2F3FF]"
        >
          <div className="flex flex-col items-start">
            <div className="mt-8 mb-10">
              <img src={Logo} alt="Logo" className="h-[23.41px] w-[156.97px]" />
            </div>
            <div>
              <UserForm />
            </div>
          </div>
        </div>
        <div
          className="flex justify-center relative h-screen w-full"
          id="rightside"
        >
          <div className="w-full h-full">
            <img
              className="w-full h-full object-cover absolute inset-0"
              src={login}
            ></img>
          </div>
          <div className="absolute bottom-6 right-6 z-10 w-[360px] text-[#0B23F4] bg-white px-4 py-2 rounded-[50px]">
            <p className="font-light">
              Analysez vos performances en un clin d’œil, suivez vos progrès et
              atteignez vos objectifs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
