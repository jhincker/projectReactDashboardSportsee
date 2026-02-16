import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useUser } from "../../context/UserContext";
import { usePeriod } from "../../context/PeriodContext";
import { useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

export default function HeartRateChart() {
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

  const daysLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // 🔹 Buckets journaliers
  const dailyBuckets = {
    Lun: { min: 0, max: 0, avg: 0 },
    Mar: { min: 0, max: 0, avg: 0 },
    Mer: { min: 0, max: 0, avg: 0 },
    Jeu: { min: 0, max: 0, avg: 0 },
    Ven: { min: 0, max: 0, avg: 0 },
    Sam: { min: 0, max: 0, avg: 0 },
    Dim: { min: 0, max: 0, avg: 0 },
  };

  activityList.forEach((activity) => {
    const date = new Date(activity.date);
    const dayIndex = (date.getDay() + 6) % 7; // Convert Sunday=0 to 6
    const dayLabel = daysLabels[dayIndex];

    const heart = activity.heartRate;

    if (heart) {
      dailyBuckets[dayLabel] = {
        min: heart.min,
        max: heart.max,
        avg: heart.average,
      };
    }
  });

  const minData = daysLabels.map((d) => dailyBuckets[d].min);
  const maxData = daysLabels.map((d) => dailyBuckets[d].max);
  const avgData = daysLabels.map((d) => dailyBuckets[d].avg);

  const globalAverage =
    avgData.reduce((sum, v) => sum + v, 0) /
    avgData.filter((v) => v !== 0).length;

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
  });

  const periodLabel = `${formatter.format(startDate)} - ${formatter.format(
    endDate,
  )}`;

  const data = {
    labels: daysLabels,
    datasets: [
      {
        type: "bar",
        label: "Min BPM",
        data: minData,
        backgroundColor: "rgba(255, 180, 170, 0.6)",
        borderRadius: 20,
        barThickness: 14,
      },
      {
        type: "bar",
        label: "Max BPM",
        data: maxData,
        backgroundColor: "#FF2D00",
        borderRadius: 20,
        barThickness: 14,
      },
      {
        type: "line",
        label: "Moyenne BPM",
        data: avgData,
        borderColor: "#3B4FFF",
        backgroundColor: "#3B4FFF",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#1E40FF",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 40,
    },
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        min: 130,
        max: 190,
        ticks: { stepSize: 15 },
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
          <h2 className="text-[#FF2D00] text-2xl font-semibold">
            {globalAverage ? globalAverage.toFixed(0) : 0} BPM
          </h2>
          <p className="text-gray-500 text-sm">Fréquence cardiaque moyenne</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={prevPeriod}
            className="w-8 h-8 rounded-full border flex items-center justify-center"
          >
            ←
          </button>
          <span className="text-sm text-gray-600">{periodLabel}</span>
          <button
            onClick={nextPeriod}
            className="w-8 h-8 rounded-full border flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>

      <div style={{ height: 320 }}>
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
}
