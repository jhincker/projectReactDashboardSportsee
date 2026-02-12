import { createContext, useContext, useState } from "react";

const PeriodContext = createContext(null);

function getFourWeeksPeriod(baseDate) {
  const end = new Date(baseDate);
  const start = new Date(baseDate);
  start.setDate(end.getDate() - 27); // 4 semaines = 28 jours

  return { start, end };
}

export function PeriodProvider({ children }) {
  const today = new Date();
  const initial = getFourWeeksPeriod(today);

  const [startDate, setStartDate] = useState(initial.start);
  const [endDate, setEndDate] = useState(initial.end);

  const nextPeriod = () => {
    setStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 28);
      return d;
    });
    setEndDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 28);
      return d;
    });
  };

  const prevPeriod = () => {
    setStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 28);
      return d;
    });
    setEndDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 28);
      return d;
    });
  };

  return (
    <PeriodContext.Provider
      value={{ startDate, endDate, nextPeriod, prevPeriod }}
    >
      {children}
    </PeriodContext.Provider>
  );
}

export function usePeriod() {
  const ctx = useContext(PeriodContext);
  if (!ctx) throw new Error("usePeriod must be used inside PeriodProvider");
  return ctx;
}
