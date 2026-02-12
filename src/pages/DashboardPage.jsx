import HeaderContainer from "../containers/HeaderContainer";
import FooterContainer from "../containers/FooterContainer";
import { useUser } from "../context/UserContext.jsx";
import IconFlag from "../images/IconFlag.svg";
import WeeklyRunningChart from "../components/charts/WeeklyRunningChart.jsx";

const DashboardPage = () => {
  const {
    error,
    loading,
    userStats,
    userProfile,
    userActivity,
    dateFormatter,
    user,
  } = useUser();
  // Determine running data from available sources (user, userActivity, userStats)
  const runningData =
    user?.runningData ??
    userActivity?.runningData ??
    userActivity ??
    userStats?.runningData ??
    [];
  return (
    <>
      <div className="min-h-screen flex flex-col font-inter">
        <HeaderContainer />
        <div id="header-profil" className="bg-[#F2F3FF] flex-1 w-full">
          <div className="flex justify-between bg-white px-32 py-24 mx-48 my-32 rounded-[20px]">
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
                  Membre depuis le{" "}
                  {userProfile?.createdAt
                    ? dateFormatter.format(new Date(userProfile.createdAt))
                    : "Profil non chargé"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[#707070] font-light">
                  Distance totale parcourue
                </p>
              </div>
              <div className="flex items-center justify-center bg-[#0B23F4] h-[90px] w-[183px] rounded-[10px] text-[22px] gap-4">
                <div>
                  <img src={IconFlag}></img>
                </div>
                <div className="text-white">
                  <h4>{userStats?.totalDistance} km</h4>
                </div>
              </div>
            </div>
          </div>
          <div>
            <WeeklyRunningChart />
          </div>
        </div>
        <FooterContainer />
      </div>
    </>
  );
};

export default DashboardPage;
