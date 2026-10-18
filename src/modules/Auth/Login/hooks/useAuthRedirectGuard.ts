import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_CONFIG } from '../../../../config/auth';
import { getRoleDashboardUrl, isDriverUser } from '../../../../utils/roleDashboard';

export const useAuthRedirectGuard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
        const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!token || !userStr) return;

        try {
            const user = JSON.parse(userStr);
            if (user?.user_type === 'admin') {
                window.location.href = '/admin/dashboard';
            } else if (isDriverUser(user)) {
                navigate('/driver/dashboard', { replace: true });
            } else if (user?.user_type === 'supplier_employee') {
                navigate(getRoleDashboardUrl(user), { replace: true });
            } else if (user?.user_type === 'supplier') {
                const isProfileCompleted = Boolean(
                    user?.is_profile_completed ||
                    user?.is_profile_complete ||
                    (user?.country && user?.city && user?.zip_code)
                );
                navigate(isProfileCompleted ? '/supplier/dashboard' : '/supplier/complete-profile', { replace: true });
            } else if (user?.user_type === 'customer') {
                navigate('/customer/dashboard', { replace: true });
            } else {
                navigate(getRoleDashboardUrl(user), { replace: true });
            }
        } catch {
            localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.userKey);
        }
    }, [navigate]);
};
