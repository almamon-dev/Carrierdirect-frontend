import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { TOKEN_CONFIG } from '../../config/auth';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '../ui/button';

interface PermissionGuardProps {
    requiredPermission?: string;
    requiredPermissions?: string[];
    ownerOnly?: boolean;
    children: React.ReactNode;
    fallback?: 'redirect' | 'denied_ui';
}

export function hasPermission(
    user: any,
    requiredPermission?: string,
    requiredPermissions?: string[],
    ownerOnly?: boolean
): boolean {
    if (!user) return false;

    // Super Admin / Supplier Owner has full wildcard access
    if (user.user_type === 'supplier' || user.user_type === 'admin') {
        return true;
    }

    // Owner only restriction
    if (ownerOnly) {
        return false;
    }

    const permissions: string[] = Array.isArray(user.permissions) ? user.permissions : [];

    // Wildcard check
    if (permissions.includes('*') || permissions.includes('all')) {
        return true;
    }

    // Check single required permission
    if (requiredPermission) {
        if (!permissions.includes(requiredPermission)) {
            return false;
        }
    }

    // Check multiple required permissions (any matching)
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasAny = requiredPermissions.some(p => permissions.includes(p));
        if (!hasAny) {
            return false;
        }
    }

    return true;
}

export default function PermissionGuard({
    requiredPermission,
    requiredPermissions,
    ownerOnly = false,
    children,
    fallback = 'denied_ui'
}: PermissionGuardProps) {
    const location = useLocation();

    const userStr =
        localStorage.getItem(TOKEN_CONFIG.userKey) ||
        localStorage.getItem('carrierdirect_user_data') ||
        localStorage.getItem('user');

    let user: any = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch {
            user = null;
        }
    }

    const allowed = hasPermission(user, requiredPermission, requiredPermissions, ownerOnly);

    if (!allowed) {
        if (fallback === 'redirect') {
            return <Navigate to="/supplier/dashboard" state={{ from: location }} replace />;
        }

        return (
            <div className="min-h-[65vh] flex items-center justify-center p-4">
                <div
    className="max-w-md w-full bg-white dark:bg-[#181a20] rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center shadow-lg">
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40 text-red-500 mx-auto flex items-center justify-center mb-4">
                        <ShieldAlert size={28} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                        Access Restricted
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        Your organization staff role does not have permission to view or manage this section. Contact your organization administrator for elevated access.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex items-center gap-1.5"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft size={14} />
                            <span>Go Back</span>
                        </Button>
                        <Button
                            size="sm"
                            className="text-xs bg-[#FF4A1F] hover:bg-[#e03e16] text-white"
                            onClick={() => window.location.href = '/supplier/dashboard'}
                        >
                            <span>Dashboard Home</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
