import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { useUser } from "../../context/UserContext";
import { usePeriod } from "../../context/PeriodContext";
import { useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function WeeklyRunningChart() {
  const { startDate, endDate, nextPeriod, prevPeriod } = usePeriod();
  const { userActivity, getUserActivity, token } = useUser();

  useEffect(() => {
    if (!token) return;

    getUserActivity(token, {
      startWeek: startDate.toISOString().slice(0, 10),
      endWeek: endDate.toISOString().slice(0, 10),
    });
  }, [startDate, endDate, token, getUserActivity]);

  const activityList = Array.isArray(userActivity) ? userActivity : [];

  if (activityList.length === 0) {
    return (
      <div className="bg-white rounded-[16px] p-6">
        <p className="text-gray-400">Aucune activité disponible</p>
      </div>
    );
  }

  // 1️⃣ Buckets S1 → S4
  const weeklyBuckets = {
    S1: 0,
    S2: 0,
    S3: 0,
    S4: 0,
  };

  activityList.forEach((activity) => {
    const activityDate = new Date(activity.date);
    const diffDays = Math.floor(
      (activityDate - startDate) / (1000 * 60 * 60 * 24),
    );

    if (diffDays >= 0 && diffDays < 28) {
      const weekIndex = Math.floor(diffDays / 7);
      weeklyBuckets[`S${weekIndex + 1}`] += activity.distance;
    }
  });

  const labels = Object.keys(weeklyBuckets);
  const distances = Object.values(weeklyBuckets);

  const average = distances.reduce((sum, v) => sum + v, 0) / distances.length;

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  });

  const periodLabel = `${formatter.format(startDate)} - ${formatter.format(
    endDate,
  )}`;

  const data = {
    labels,
    datasets: [
      {
        label: "Km",
        data: distances,
        backgroundColor: "#B6BDFC",
        borderRadius: 999,
        barThickness: 26,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toFixed(1)} km`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
        grid: {
          borderDash: [4, 4],
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-[16px] p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[#1E40FF] text-xl font-semibold">
            {average.toFixed(1)} km en moyenne
          </h2>
          <p className="text-gray-500 text-sm">
            Total des kilomètres {periodLabel}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={prevPeriod}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
          >
            ←
          </button>
          <button
            onClick={nextPeriod}
            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      <div style={{ height: 300 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
