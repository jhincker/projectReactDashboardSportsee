// src/UserContext.jsx (variante)
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null,
  );
  const [userId, setUserId] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem("userId") : null,
  );

  // loginUser: perform login and store token/userId
  const loginUser = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Erreur POST " + res.status);
      const created = await res.json();
      // Optimiste : ajoute localement
      setUser((prev) => [created, ...prev]);
      // Store token/userId if provided
      if (created && created.token) {
        setToken(created.token);
        setUserId(created.userId ?? null);
        try {
          localStorage.setItem("token", created.token);
          if (created.userId) localStorage.setItem("userId", created.userId);
        } catch (e) {
          // ignore
        }
      }
      return created;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // getUserInfo: fetch user details using stored token
  // Accept an optional tokenArg so callers can fetch immediately after login
  const getUserInfo = useCallback(
    async (tokenArg) => {
      const usedToken = tokenArg ?? token;
      if (!usedToken) return null;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:8000/api/user-info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${usedToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Erreur getUserInfo " + res.status);
        const userInfo = await res.json();
        // Update local state
        setUser((prev) => [userInfo, ...prev]);
        if (userInfo && userInfo.profile) {
          setUserStats(userInfo.statistics ?? null);
          setUserProfile(userInfo.profile ?? null);
        }
        return userInfo;
      } catch (e) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  // On mount, if token exists, try to load user info
  useEffect(() => {
    if (token) {
      getUserInfo().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const getUserActivity = useCallback(
    async (tokenArg, { startWeek, endWeek } = {}) => {
      const usedToken = tokenArg ?? token;
      if (!usedToken) return null;

      const params = new URLSearchParams();
      if (startWeek) params.append("startWeek", startWeek);
      if (endWeek) params.append("endWeek", endWeek);

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:8000/api/user-activity?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${usedToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!res.ok) throw new Error("Erreur getUserActivity " + res.status);

        const data = await res.json();
        setUserActivity(data ?? []);
        return data;
      } catch (e) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    if (token) {
      getUserActivity(token, {
        startWeek: "2025-05-28",
        endWeek: "2025-06-25",
      }).catch(() => {});
    }
  }, [token, getUserActivity]);

  // Déconnexion auto si API renvoie 401
  useEffect(() => {
    if (error === "Unauthorized") {
      logout();
    }
  }, [error]);

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUser(null);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } catch (e) {}
  };
  // date formatter for UI (available via context)
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const value = {
    user,
    userStats,
    userProfile,
    userActivity,
    loading,
    error,
    loginUser,
    getUserInfo,
    getUserActivity,
    token,
    userId,
    logout,
    dateFormatter,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser dans UserProvider");
  return ctx;
}
