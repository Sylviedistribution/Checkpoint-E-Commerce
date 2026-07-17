import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p className="page-status">Chargement…</p>;
  }
  if (!user) {
    return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
  }
  return children;
}
