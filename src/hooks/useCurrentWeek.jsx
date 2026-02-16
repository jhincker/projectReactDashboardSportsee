import { useMemo } from "react";

export default function useCurrentWeek(runningData) {
  return useMemo(() => {
    if (!runningData?.length)
      return { start: null, end: null, weekSessions: [] };

    // 1️⃣ dernière activité
    const lastActivity = runningData
      .map((s) => new Date(s.date))
      .sort((a, b) => b - a)[0];

    // 2️⃣ lundi de la semaine
    const day = lastActivity.getDay(); // 0 dimanche
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const start = new Date(lastActivity);
    start.setDate(lastActivity.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);

    // 3️⃣ dimanche
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    // 4️⃣ sessions de la semaine
    const weekSessions = runningData.filter((session) => {
      const d = new Date(session.date);
      return d >= start && d <= end;
    });

    return { start, end, weekSessions };
  }, [runningData]);
}
