import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { TOKEN_CONFIG } from '../../config/auth';
import { getRoleDashboardUrl, getUserEffectiveRole } from '../../utils/roleDashboard';

interface ProtectedRouteProps {
    allowedRole?: 'customer' | 'supplier' | 'admin' | 'driver';
    children?: React.ReactNode;
}

export default function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
    const location = useLocation();

    // ── 1. Check token ────────────────────────────────────────────────────────
    const token =
        localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
        localStorage.getItem('carrierdirect_access_token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token');

    if (!token) {
        // Not authenticated — send to login, preserve intended destination
        return <Navigate to="/web/login" state={{ from: location }} replace />;
    }

    // ── 2. Read and parse user ────────────────────────────────────────────────
    const userStr =
        localStorage.getItem(TOKEN_CONFIG.userKey) ||
        localStorage.getItem('carrierdirect_user_data') ||
        localStorage.getItem('user');

    let user: any = null;
    let effectiveRole: 'driver' | 'supplier' | 'customer' | 'admin' | null = null;

    if (userStr) {
        try {
            user = JSON.parse(userStr);
            effectiveRole = getUserEffectiveRole(user);

            // ── 2a. Check Email Verification ──────────────────────────
            if (user && !user.email_verified_at && !location.pathname.startsWith('/web/verify-email')) {
                return <Navigate to={`/web/verify-email-notice?email=${encodeURIComponent(user.email || "")}`} replace />;
            }

            // ── 2b. Check Supplier Profile Completion (Supplier Owners Only) ──
            if (effectiveRole === 'supplier' && user.user_type === 'supplier') {
                const isProfileCompleted = Boolean(
                    user.is_profile_completed ||
                    user.is_profile_complete ||
                    (user.country && user.city && user.zip_code)
                );

                // If incomplete, force redirect to complete-profile
                if (!isProfileCompleted && location.pathname !== '/supplier/complete-profile') {
                    return <Navigate to="/supplier/complete-profile" replace />;
                }

                // If already complete, strictly block complete-profile and redirect to dashboard
                if (isProfileCompleted && location.pathname === '/supplier/complete-profile') {
                    return <Navigate to="/supplier/dashboard" replace />;
                }
            } else if (location.pathname === '/supplier/complete-profile') {
                // Non-supplier owners should never be on complete-profile page
                return <Navigate to={getRoleDashboardUrl(user)} replace />;
            }
        } catch {
            // Corrupt data — clear and redirect to login
            localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.userKey);
            localStorage.removeItem('carrierdirect_access_token');
            localStorage.removeItem('carrierdirect_user_data');
            localStorage.removeItem('erp_access_token');
            localStorage.removeItem('erp_user_data');
            return <Navigate to="/web/login" replace />;
        }
    }

    // ── 3. Strict Role Isolation Check ────────────────────────────────────────
    const isRoleAllowed = (requiredRole?: string, actualRole?: string | null) => {
        if (!requiredRole) return true;
        if (!actualRole) return false;
        if (actualRole === 'admin') return true; // Super admins can view portals
        return actualRole === requiredRole;
    };

    if (allowedRole && (!effectiveRole || !isRoleAllowed(allowedRole, effectiveRole))) {
        return <Navigate to={getRoleDashboardUrl(user)} replace />;
    }

    // ── 4. All checks passed — render the route ───────────────────────────────
    return children ? <>{children}</> : <Outlet />;
}
