import HeaderContainer from "../containers/HeaderContainer";
import FooterContainer from "../containers/FooterContainer";
import { useUser } from "../context/UserContext.jsx";
import { useMemo } from "react";
import { calculateRestDays } from "../utils/dateHelpers";

const ProfilePage = () => {
  const {
    error,
    loading,
    userStats,
    userProfile,
    userActivity,
    dateFormatter,
    user,
  } = useUser();

  const formatDuration = (duration) => {
    if (!duration) return "0h 0min";

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return `${hours}h ${minutes}min`;
  };

  const restDays = useMemo(() => {
    return calculateRestDays(
      userStats?.runningData,
      userProfile?.createdAt ?? userStats?.userInfos?.createdAt,
    );
  }, [userStats, userProfile]);

  return (
    <>
      <div className="flex flex-col min-h-screen font-inter">
        <HeaderContainer />
        <div className="bg-[#F2F3FF] flex-1 w-full pb-32">
          <div className="grid grid-cols-2 gap-16 pt-32">
            <div className="w-full gap-8 rounded-[10px] pl-32">
              <div className="flex items-center gap-4 rounded-[10px] bg-white p-8">
                <img
                  className="h-[117px] w-[104px] object-cover rounded-[10px]"
                  src={userProfile?.profilePicture}
                  alt="Profil"
                />
                <div>
                  <p className="m-0 text-lg font-normal">
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
              <div className="mt-8 flex items-start flex-col justify-center gap-2 rounded-[20px] bg-white p-8">
                <h1 className="text-lg font-normal">Votre profil</h1>
                <hr className="w-full h-px my-8 bg-gray-300 border-0" />
                <p className="text-gray-500">Âge : {userProfile?.age}</p>
                <p className="text-gray-500">
                  Genre : {userProfile?.gender === "female" ? "Femme" : "Homme"}
                </p>
                <p className="text-gray-500">Taille : {userProfile?.height}</p>
                <p className="text-gray-500">Poids : {userProfile?.weight}</p>
              </div>
            </div>
            <div className="pr-32">
              <div className="">
                <h1 className="text-lg font-normal">Vos statistiques</h1>
                <p className="text-md">
                  depuis le{" "}
                  {userProfile?.createdAt
                    ? dateFormatter.format(new Date(userProfile.createdAt))
                    : "Profil non chargé"}{" "}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex flex-col items-start justify-start bg-[#0B23F4] text-white w-[276px] h-[103px] rounded-[10px] text-sm px-6 py-4 gap-4">
                  <p className="font-thin">Temps total couru</p>
                  <p className="font-normal text-lg">
                    {formatDuration(userStats?.totalDuration)}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start bg-[#0B23F4] text-white w-[276px] h-[103px] rounded-[10px] text-sm px-6 py-4 gap-4">
                  <p className="font-thin">Calories brûlées</p>
                  <p className="font-normal text-lg">
                    {userStats?.totalCaloriesBurned} cal
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start bg-[#0B23F4] text-white w-[276px] h-[103px] rounded-[10px] text-sm px-6 py-4 gap-4">
                  <p className="font-thin">Distance totale parcourue</p>
                  <p className="font-normal text-lg">
                    {userStats?.totalDistance} km
                  </p>
                </div>
                <div className="flex flex-col items-start justify-start bg-[#0B23F4] text-white w-[276px] h-[103px] rounded-[10px] text-sm px-6 py-4 gap-4">
                  <p className="font-thin">Nombre de jours de repos</p>
                  <p className="font-normal text-lg">{restDays} jours</p>
                </div>
                <div className="flex flex-col items-start justify-start bg-[#0B23F4] text-white w-[276px] h-[103px] rounded-[10px] text-sm px-6 py-4 gap-4">
                  <p className="font-thin">Nombre de sessions</p>
                  <p className="font-normal text-lg">
                    {userStats?.totalSessions} sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterContainer />
      </div>
    </>
  );
};

export default ProfilePage;
