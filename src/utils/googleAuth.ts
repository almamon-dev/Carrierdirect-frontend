import { API_CONFIG } from '@/config/api';
import { TOKEN_CONFIG } from '@/config/auth';
import { getRoleDashboardUrl, isDriverUser } from '@/utils/roleDashboard';

export type GoogleAuthRole = 'customer' | 'supplier';

/**
 * Resolves the API base URL consistently with ApiClient so Google OAuth
 * always targets the active backend (localhost:8000 in local dev).
 */
export function resolveGoogleApiBaseUrl(): string {
    let base = API_CONFIG.baseURL || '';
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
        if (isLocalHost && (!base || base.includes('ngrok') || base.includes('cloudflare') || base.includes('trycloudflare'))) {
            base = `http://${host === '0.0.0.0' ? 'localhost' : host}:8000/api`;
        }
    }
    return base.replace(/\/+$/, '');
}

/**
 * Constructs the backend Google OAuth redirect endpoint URL.
 */
export function getGoogleOAuthUrl(
    role: GoogleAuthRole = 'customer',
    mode: 'popup' | 'redirect' = 'popup'
): string {
    const cleanBase = resolveGoogleApiBaseUrl();
    const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const params = new URLSearchParams({
        role,
        mode,
        redirect_url: redirectOrigin,
    });
    return `${cleanBase}/auth/google/redirect?${params.toString()}`;
}

/**
 * Saves Google OAuth Sanctum token and user payload into localStorage.
 */
export function saveGoogleAuthSession(token: string, userData: any): void {
    localStorage.setItem(TOKEN_CONFIG.accessTokenKey, token);
    localStorage.setItem('carrierdirect_access_token', token);
    localStorage.setItem('access_token', token);
    localStorage.setItem('token', token);

    if (userData) {
        const serialized = JSON.stringify(userData);
        localStorage.setItem(TOKEN_CONFIG.userKey, serialized);
        localStorage.setItem('carrierdirect_user_data', serialized);
        localStorage.setItem('user', serialized);
    }
}

/**
 * Resolves the target dashboard path after Google authentication.
 */
export function resolvePostAuthPath(
    userData: any,
    fallbackRole: string = 'customer',
    isProfileCompleted: boolean = true
): { path: string; isExternalAdmin: boolean } {
    const userType = userData?.user_type || fallbackRole;

    if (userType === 'admin') {
        return { path: '/admin/dashboard', isExternalAdmin: true };
    }
    if (isDriverUser(userData)) {
        return { path: '/driver/dashboard', isExternalAdmin: false };
    }
    if (userType === 'customer') {
        return { path: '/customer/dashboard', isExternalAdmin: false };
    }
    if (userType === 'supplier') {
        return {
            path: isProfileCompleted ? (getRoleDashboardUrl(userData) || '/supplier/dashboard') : '/supplier/complete-profile',
            isExternalAdmin: false,
        };
    }

    return {
        path: getRoleDashboardUrl(userData) || '/customer/dashboard',
        isExternalAdmin: false,
    };
}

/**
 * Fallback navigation trigger (used only when popup mode is explicitly bypassed).
 */
export function triggerGoogleSignIn(role: GoogleAuthRole = 'customer'): void {
    window.location.href = getGoogleOAuthUrl(role, 'redirect');
}
