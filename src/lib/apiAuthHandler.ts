import { API_CONFIG } from '../config/api';
import { TOKEN_CONFIG } from '../config/auth';

let lastNetworkErrorNotification = 0;

export function notifyNetworkError(message: string) {
    const now = Date.now();
    if (now - lastNetworkErrorNotification > 5000) {
        lastNetworkErrorNotification = now;
        window.dispatchEvent(
            new CustomEvent('app:toast', {
                detail: { message, type: 'error' },
            })
        );
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('offline', () => {
        notifyNetworkError('Network connection lost. Please check your internet connection.');
    });
}

export function handleAuthError(status: number, data: any) {
    if (status === 401) {
        const existingToken =
            localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
            localStorage.getItem('carrierdirect_access_token') ||
            localStorage.getItem('access_token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('erp_access_token');

        if (existingToken) {
            localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.refreshTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.userKey);
            localStorage.removeItem('carrierdirect_access_token');
            localStorage.removeItem('carrierdirect_user_data');
            localStorage.removeItem('erp_access_token');
            localStorage.removeItem('erp_user_data');
            localStorage.removeItem('access_token');
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            const isAuthPage =
                window.location.pathname.includes('/login') ||
                window.location.pathname.includes('/register') ||
                window.location.pathname.includes('/web/');

            if (!isAuthPage) {
                window.location.href = '/web/login';
            }
        }
    }

    if (status === 403 && data.code === 'EMAIL_UNVERIFIED') {
        const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
        let email = '';
        try {
            const u = userStr ? JSON.parse(userStr) : null;
            email = u?.email || '';
        } catch {}
        if (!window.location.pathname.includes('/verify-email')) {
            window.location.href = `/web/verify-email-notice?email=${encodeURIComponent(email)}`;
        }
    }

    if ([502, 503, 504].includes(status)) {
        notifyNetworkError('Network error: Server unreachable or service unavailable.');
    }
}

export function buildApiUrl(baseURL: string, endpoint: string = '', params?: Record<string, any>): string {
    const baseUrl = baseURL || API_CONFIG.baseURL || '';
    const cleanBaseUrl = baseUrl ? String(baseUrl).replace(/\/+$/, '') : '';
    const cleanEndpoint = endpoint ? String(endpoint).replace(/^\/+/, '') : '';
    let url = cleanBaseUrl ? `${cleanBaseUrl}/${cleanEndpoint}` : `/${cleanEndpoint}`;

    let actualParams = params;
    if (params && typeof params === 'object' && 'params' in params && params.params && typeof params.params === 'object') {
        actualParams = params.params;
    }

    if (actualParams && Object.keys(actualParams).length > 0) {
        const separator = url.includes('?') ? '&' : '?';
        const searchParams = new URLSearchParams();
        Object.entries(actualParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        const searchStr = searchParams.toString();
        if (searchStr) {
            url += `${separator}${searchStr}`;
        }
    }

    return url;
}
