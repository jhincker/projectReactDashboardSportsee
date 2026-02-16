// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, token } = useUser();

  // Si pas de token → retour login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
