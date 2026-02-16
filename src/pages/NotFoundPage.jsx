import { Link, useRouteError } from "react-router-dom";
import HeaderContainer from "../containers/HeaderContainer";
import FooterContainer from "../containers/FooterContainer";

export default function NotFoundPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <div className="flex flex-col min-h-screen font-inter">
        <HeaderContainer />
        <div className="bg-[#F2F3FF] flex-1 w-full pb-32">
          <div className="pt-32 px-32 flex items-center justify-center">
            <div className="flex flex-col gap-8 rounded-[20px] p-16 w-full max-w-[600px]">
              <div className="text-center">
                <h1 className="text-6xl font-normal text-[#0B23F4] mb-4">
                  404
                </h1>
                <p className="text-2xl font-normal text-gray-700 mb-8">
                  Page non trouvée
                </p>
                <p className="text-gray-500 text-lg mb-12">
                  Désolé, la page que vous cherchez n'existe pas.
                </p>
              </div>

              <Link
                to="/dashboard"
                className="bg-[#0B23F4] text-center text-white px-12 py-4 rounded-[40px] font-light text-lg hover:opacity-90 transition-opacity"
              >
                Retour au Dashboard
              </Link>
            </div>
          </div>
        </div>
        <FooterContainer />
      </div>
    </>
  );
}
