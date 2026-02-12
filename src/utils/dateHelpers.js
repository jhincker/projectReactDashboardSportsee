// src/utils/dateHelpers.js
export function calculateRestDays(runningData, createdAt) {
  if (!createdAt) return 0;
  const startDate = new Date(createdAt);
  if (Number.isNaN(startDate.getTime())) return 0;

  const today = new Date();
  const diffTime = today - startDate;
  const totalDays = Math.max(
    0,
    Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1,
  );

  if (!Array.isArray(runningData) || runningData.length === 0) {
    return totalDays; // si pas d'activités, tous les jours sont des jours de repos
  }

  // normalise chaque session en YYYY-MM-DD (date locale ou UTC selon besoin)
  const dayStrings = runningData
    .map((s) => {
      if (!s || !s.date) return null;
      const d = new Date(s.date);
      if (Number.isNaN(d.getTime())) return null;
      // normaliser en ISO date-only, en UTC :
      return d.toISOString().slice(0, 10);
    })
    .filter(Boolean);

  const uniqueRunningDays = new Set(dayStrings).size;

  const restDays = Math.max(0, totalDays - uniqueRunningDays);
  return restDays;
}
