import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useUser } from "../../context/UserContext";
import { usePeriod } from "../../context/PeriodContext";
import { useEffect, useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function WeeklyGoalChart({ startOfWeek, endOfWeek }) {
  const { user, userActivity, userProfile, getUserActivity, token } = useUser();
  const { startDate: periodStart, endDate: periodEnd } = usePeriod();

  // choose explicit props from parent (Dashboard) if provided, otherwise fall back
  // to the period context values
  const usedStart = startOfWeek ?? periodStart;
  const usedEnd = endOfWeek ?? periodEnd;

  useEffect(() => {
    if (!token || !usedStart || !usedEnd) return;

    getUserActivity(token, {
      startWeek: usedStart.toISOString().slice(0, 10),
      endWeek: usedEnd.toISOString().slice(0, 10),
    });
  }, [usedStart, usedEnd, token, getUserActivity]);

  const activityList = Array.isArray(userActivity) ? userActivity : [];

  const weekSessions = useMemo(() => {
    if (!usedStart || !usedEnd) return [];
    return activityList.filter((session) => {
      if (!session || !session.date) return false;
      const d = new Date(session.date);
      if (Number.isNaN(d.getTime())) return false;
      return d >= usedStart && d <= usedEnd;
    });
  }, [activityList, usedStart, usedEnd]);

  const sessionsThisPeriod = weekSessions.length;

  const goal = userProfile?.weeklyGoal ?? 0;
  const sessionsDone = sessionsThisPeriod;
  const remaining = Math.max((userProfile?.weeklyGoal ?? 0) - sessionsDone, 0);

  const data = {
    labels: ["Réalisées", "Restantes"],
    datasets: [
      {
        data: [sessionsThisPeriod, remaining],
        backgroundColor: ["#1E2BFF", "#C7CCFF"],
        borderWidth: 0,
        cutout: "65%",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          padding: 20,
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => ({
              text:
                i === 0
                  ? `${dataset.data[i]} réalisées`
                  : `${dataset.data[i]} restantes`,
              fillStyle: dataset.backgroundColor[i],
              strokeStyle: dataset.backgroundColor[i],
              lineWidth: 0,
              hidden: false,
              index: i,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} course(s)`,
        },
      },
    },
  };

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  });

  const periodLabel = `${usedStart ? formatter.format(usedStart) : "-"} - ${
    usedEnd ? formatter.format(usedEnd) : "-"
  }`;

  return (
    <div className="bg-white rounded-[16px] p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-[#1E2BFF] text-xl font-semibold">
            X{sessionsThisPeriod}{" "}
            <span className="text-[#8C94FF] font-normal">
              sur objectif de {goal}
            </span>
          </h2>
          <p className="text-gray-500 text-sm">
            Courses hebdomadaire réalisées
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="h-[260px] flex items-center justify-center">
        <Doughnut data={data} options={options} />
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">{periodLabel}</p>
    </div>
  );
}
