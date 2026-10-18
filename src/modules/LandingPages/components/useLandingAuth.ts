import { useState, useEffect } from "react";
import { TOKEN_CONFIG } from "@/config/auth";
import { getRoleDashboardUrl, isDriverUser } from "@/utils/roleDashboard";

export function useLandingAuth() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const readAuth = () => {
      const token = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
      const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
      if (!token || !userStr) { setCurrentUser(null); return; }
      try {
        const u = JSON.parse(userStr);
        setCurrentUser(u);
      } catch {
        setCurrentUser(null);
      }
    };

    readAuth();
    window.addEventListener("storage", readAuth);
    return () => window.removeEventListener("storage", readAuth);
  }, []);

  const dashboardPath = getRoleDashboardUrl(currentUser);
  const isDriver = isDriverUser(currentUser);
  const profilePath = isDriver
    ? "/driver/profile"
    : `${dashboardPath.split("/dashboard")[0]}/settings`;

  const roleBadgeLabel = isDriver
    ? "Driver"
    : currentUser?.user_type === "admin"
      ? "Admin"
      : currentUser?.user_type === "supplier_employee"
        ? (currentUser?.role?.name || '-')
        : (currentUser?.user_type === "supplier" ? "Supplier" : "Customer");

  return {
    currentUser,
    setCurrentUser,
    dashboardPath,
    profilePath,
    roleBadgeLabel,
  };
}
