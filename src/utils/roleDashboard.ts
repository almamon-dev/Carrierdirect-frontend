import { TOKEN_CONFIG } from '../config/auth';

function resolveUser(userOrStr?: any): any {
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
    } else if (typeof user === 'string') {
        try {
            user = JSON.parse(user);
        } catch {
            user = null;
        }
    }
    return user;
}

export function isDriverUser(userOrStr?: any): boolean {
    const user = resolveUser(userOrStr);
    if (!user) return false;

    if (user.user_type === 'driver') return true;
    if (user.is_driver === true) return true;
    if (Boolean(user.driver_profile || user.driverProfile)) return true;

    // Check system driver role ID or name/slug
    if (user.role_id === 1 || user.role?.id === 1) return true;

    const roleSlug = String(
        user.role?.slug || 
        user.role?.name || 
        user.role_name || 
        (typeof user.role === 'string' ? user.role : '')
    ).toLowerCase();

    if (roleSlug.includes('driver')) {
        return true;
    }

    return false;
}

export function isSupplierUser(userOrStr?: any): boolean {
    const user = resolveUser(userOrStr);
    if (!user) return false;
    if (isDriverUser(user)) return false;
    return user.user_type === 'supplier' || user.user_type === 'supplier_employee';
}

export function isCustomerUser(userOrStr?: any): boolean {
    const user = resolveUser(userOrStr);
    if (!user) return false;
    return user.user_type === 'customer' || user.user_type === 'client';
}

export function isAdminUser(userOrStr?: any): boolean {
    const user = resolveUser(userOrStr);
    if (!user) return false;
    return user.user_type === 'admin' || user.user_type === 'super_admin';
}

export function getUserEffectiveRole(userOrStr?: any): 'driver' | 'supplier' | 'customer' | 'admin' | null {
    const user = resolveUser(userOrStr);
    if (!user) return null;
    if (isAdminUser(user)) return 'admin';
    if (isDriverUser(user)) return 'driver';
    if (isSupplierUser(user)) return 'supplier';
    if (isCustomerUser(user)) return 'customer';
    return null;
}

export function getRoleDashboardUrl(userOrStr?: any): string {
    const user = resolveUser(userOrStr);
    if (!user) return '/web/login';

    if (isAdminUser(user)) return '/admin/dashboard';
    if (isDriverUser(user)) return '/driver/dashboard';
    if (isCustomerUser(user)) return '/customer/dashboard';

    // supplier / supplier_employee roles
    const roleSlug = String(
        user.role?.slug || 
        user.role?.name || 
        user.role_name || 
        (typeof user.role === 'string' ? user.role : '')
    ).toLowerCase();

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
