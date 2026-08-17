import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { getAccessToken, getUser } from "../utils/token";
import { UserRole } from "../types";

type AdminRouteProps = {
  children: ReactNode;
};

/**
 * Route protégée pour les admins uniquement
 * Redirige vers login si pas authentifié
 * Redirige vers dashboard si authentifié mais pas admin
 */
function AdminRoute({ children }: AdminRouteProps) {
  const token = getAccessToken();
  const user = getUser();
  const location = useLocation();

  // Pas authentifié
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Pas admin
  if (user?.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
