import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loadingspinner from "./Loadingspinner";

const PROTECTED_PREFIXES = ["/dashboard", "/projects", "/profile"];

const ProtectedRoutes = ({ children }) => {
  const { loading, user } = useAuth();
  const location = useLocation();

  const requiresAuthentication = PROTECTED_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  if (!requiresAuthentication) {
    return children;
  }

  if (loading) {
    return <Loadingspinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoutes;
