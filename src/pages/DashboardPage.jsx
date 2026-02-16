import HeaderContainer from "../containers/HeaderContainer";
import FooterContainer from "../containers/FooterContainer";
import { useUser } from "../context/UserContext.jsx";
import IconFlag from "../images/IconFlag.svg";
import WeeklyRunningChart from "../components/charts/WeeklyRunningChart.jsx";
import HeartRateChart from "../components/charts/HeartRateChart.jsx";
import WeeklyGoalChart from "../components/charts/WeeklyGoalChart";
import { useMemo } from "react";

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

  // Calculate startOfWeek (Monday 00:00:00) and endOfWeek (Sunday 23:59:59.999)
  const { startOfWeek, endOfWeek } = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 (Sun) - 6 (Sat)
    // compute offset to Monday
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { startOfWeek: monday, endOfWeek: sunday };
  }, []);

  const weeklyRuns = useMemo(() => {
    return runningData.filter((session) => {
      if (!session || !session.date) return false;
      const d = new Date(session.date);
      if (Number.isNaN(d.getTime())) return false;
      return d >= startOfWeek && d <= endOfWeek;
    });
  }, [runningData, startOfWeek, endOfWeek]);

  const formatDate = (date) =>
    date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });

  const weeklyStats = useMemo(() => {
    let distance = 0;
    let duration = 0;
    let sessions = weeklyRuns.length;

    weeklyRuns.forEach((s) => {
      distance += s.distance;
      duration += s.duration;
    });

    return { distance, duration, sessions };
  }, [weeklyRuns]);

  return (
    <>
      <div className="min-h-screen flex flex-col font-inter">
        <HeaderContainer />
        <div id="header-profil" className="bg-[#F2F3FF] flex-1 w-full">
          <div className="flex justify-between bg-white px-12 py-8 mx-32 my-32 rounded-[20px]">
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
          <h2 className="text-lg pb-8 ml-32">Vos dernières performances</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="ml-32">
              <WeeklyRunningChart />
            </div>
            <div className="mr-32">
              <HeartRateChart />
            </div>
          </div>
          <div className="flex flex-col ml-32 gap-1 mt-12">
            <h2 className="text-lg">Cette semaine</h2>
            <p className="text-sm text-gray-500 pb-8">
              Du {formatDate(startOfWeek)} au {formatDate(endOfWeek)}
            </p>{" "}
          </div>
          <div className="grid grid-cols-2 gap-8 items-stretch mb-32">
            {/* COLONNE GAUCHE */}
            <div className="ml-32 h-full">
              <WeeklyGoalChart
                startOfWeek={startOfWeek}
                endOfWeek={endOfWeek}
              />
            </div>

            {/* COLONNE DROITE */}
            <div className="mr-32 grid grid-rows-2 gap-6 h-full">
              {/* DUREE */}
              <div className="bg-white rounded-[16px] p-8 flex flex-col justify-center">
                <p className="text-gray-500">Durée d'activité</p>
                <p className="text-[#1E2BFF] text-3xl font-semibold mt-2">
                  {Math.round(weeklyStats.duration)}
                  <span className="text-[#8C94FF] text-xl font-normal">
                    {" "}
                    minutes
                  </span>
                </p>
              </div>

              {/* DISTANCE */}
              <div className="bg-white rounded-[16px] p-8 flex flex-col justify-center">
                <p className="text-gray-500">Distance</p>
                <p className="text-[#FF3B1E] text-3xl font-semibold mt-2">
                  {weeklyStats.distance.toFixed(1)}
                  <span className="text-[#FFB2A8] text-xl font-normal">
                    {" "}
                    kilomètres
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <FooterContainer />
      </div>
    </>
  );
};

export default DashboardPage;
