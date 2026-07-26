import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { TOKEN_CONFIG } from '../../config/auth';

interface ProtectedRouteProps {
    allowedRole?: 'customer' | 'supplier' | 'admin';
    children?: React.ReactNode;
}

function getDashboardByRole(role: string): string {
    if (role === 'supplier') return '/supplier/dashboard';
    if (role === 'admin')    return '/admin/dashboard';
    return '/customer/dashboard';
}

export default function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
    const location = useLocation();

    // ── 1. Check token ────────────────────────────────────────────────────────
    const token =
        localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
        localStorage.getItem('erp_access_token') ||
        localStorage.getItem('token');

    if (!token) {
        // Not authenticated — send to login, preserve intended destination
        return <Navigate to="/web/login" state={{ from: location }} replace />;
    }

    // ── 2. Read user role ─────────────────────────────────────────────────────
    const userStr =
        localStorage.getItem(TOKEN_CONFIG.userKey) ||
        localStorage.getItem('erp_user_data') ||
        localStorage.getItem('user');

    let userRole: string | null = null;

    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userRole = user?.user_type || user?.role || null;
        } catch {
            // Corrupt data — clear and redirect to login
            localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.userKey);
            return <Navigate to="/web/login" replace />;
        }
    }

    // ── 3. Role check ─────────────────────────────────────────────────────────
    // If we know the role AND an allowedRole is specified AND they don't match,
    // redirect to the correct dashboard for that role.
    if (allowedRole && userRole && userRole !== allowedRole) {
        return <Navigate to={getDashboardByRole(userRole)} replace />;
    }

    // ── 4. All checks passed — render the route ───────────────────────────────
    return children ? <>{children}</> : <Outlet />;
}
