import { TOKEN_CONFIG } from '../config/auth';

export function getRoleDashboardUrl(userOrStr?: any): string {
    let user = userOrStr;
    if (!user) {
        const userStr =
            localStorage.getItem(TOKEN_CONFIG.userKey) ||
            localStorage.getItem('carrierdirect_user_data') ||
            localStorage.getItem('user');
        if (userStr) {
            try {
                user = JSON.parse(userStr);
            } catch {
                user = null;
            }
        }
    }

    if (!user) return '/supplier/dashboard';
    if (user.user_type === 'admin') return '/admin/dashboard';
    if (user.user_type === 'customer') return '/customer/dashboard';
    if (user.user_type === 'supplier') return '/supplier/dashboard';

    // supplier_employee roles
    const roleSlug = String(user.role?.slug || user.role?.name || user.role || '').toLowerCase();

    if (roleSlug.includes('driver')) {
        return '/supplier/driver/dashboard';
    }
    if (roleSlug.includes('finance') || roleSlug.includes('billing')) {
        return '/supplier/finance/dashboard';
    }
    if (roleSlug.includes('operation')) {
        return '/supplier/operations/dashboard';
    }
    if (roleSlug.includes('sales') || roleSlug.includes('quote')) {
        return '/supplier/sales/dashboard';
    }
    if (roleSlug.includes('support') || roleSlug.includes('customer')) {
        return '/supplier/support/dashboard';
    }

    return '/supplier/dashboard';
}
