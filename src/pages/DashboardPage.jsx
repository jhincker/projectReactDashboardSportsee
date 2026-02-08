import HeaderContainer from "../containers/HeaderContainer";
import FooterContainer from "../containers/FooterContainer";
import { useUsers } from "../context/usersContext.jsx";

const DashboardPage = () => {
  const { error, loading, userStats, userProfile, dateFormatter } = useUsers();
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <HeaderContainer />
        <div id="header-profil" className="bg-[#F2F3FF] flex-1 w-full">
          <div className="flex justify-between bg-white px-32 py-24 mx-48 my-32 rounded-[20px]">
            {/* use flex with a gap to position image and text cleanly */}
            <div className="flex items-center gap-4">
              <img
                className="h-[117px] w-[104px] object-cover rounded-[10px]"
                src={userProfile?.profilePicture}
                alt="Profil"
              />
              <div>
                <p className="m-0 text-lg font-medium">
                  {userProfile?.firstName ?? "Profil non chargé"}{" "}
                  {userProfile?.lastName}
                </p>
                <p className="m-0 text-[#707070] font-light">
                  Membre depuis le {userProfile?.createdAt ? dateFormatter.format(new Date(userProfile.createdAt)) : "Profil non chargé"}
                </p>
              </div>
            </div>
            <div>
              <div>
                <p className="text-[#707070] font-light">
                  Distance totale parcourue
                </p>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <FooterContainer />
      </div>
    </>
  );
};

export default DashboardPage;
