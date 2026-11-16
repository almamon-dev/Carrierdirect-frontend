import { API_CONFIG } from '@/config/api';

/**
 * Constructs the backend Google OAuth redirect endpoint URL.
 * Supports passing desired user role (customer | supplier).
 */
export function getGoogleOAuthUrl(role: 'customer' | 'supplier' = 'customer'): string {
    let base = API_CONFIG.baseURL || '';
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        if (!base || base.includes('ngrok') || base.includes('cloudflare') || base.includes('trycloudflare')) {
            base = 'http://localhost:8000/api';
        }
    }

    const cleanBase = base.replace(/\/+$/, '');
    const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    return `${cleanBase}/auth/google/redirect?role=${role}&redirect_url=${encodeURIComponent(redirectOrigin)}`;
}

/**
 * Initiates the Google OAuth 2.0 flow by navigating the browser to the backend redirect endpoint.
 */
export function triggerGoogleSignIn(role: 'customer' | 'supplier' = 'customer'): void {
    const url = getGoogleOAuthUrl(role);
    window.location.href = url;
}

