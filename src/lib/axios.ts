import { API_CONFIG } from '../config/api';
import { TOKEN_CONFIG } from '../config/auth';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
    params?: Record<string, string | number | boolean | undefined | null>;
    body?: any;
}

let lastNetworkErrorNotification = 0;
function notifyNetworkError(message: string) {
    const now = Date.now();
    if (now - lastNetworkErrorNotification > 5000) {
        lastNetworkErrorNotification = now;
        window.dispatchEvent(new CustomEvent('app:toast', {
            detail: { message, type: 'error' }
        }));
    }
}

if (typeof window !== 'undefined') {
    window.addEventListener('offline', () => {
        notifyNetworkError("Network connection lost. Please check your internet connection.");
    });
}

class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = API_CONFIG.baseURL || '';
    }

    private getHeaders(customHeaders?: HeadersInit): HeadersInit {
        const token =
            localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
            localStorage.getItem('access_token') ||
            localStorage.getItem('token') ||
            localStorage.getItem('erp_access_token');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            ...(customHeaders as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `${TOKEN_CONFIG.tokenType} ${token}`;
        }

        return headers;
    }

    private buildUrl(endpoint: string = '', params?: Record<string, any>): string {
        const baseUrl = this.baseURL || API_CONFIG.baseURL || '';
        const cleanBaseUrl = baseUrl ? String(baseUrl).replace(/\/+$/, '') : '';
        const cleanEndpoint = endpoint ? String(endpoint).replace(/^\/+/, '') : '';
        let url = cleanBaseUrl ? `${cleanBaseUrl}/${cleanEndpoint}` : `/${cleanEndpoint}`;

        let actualParams = params;
        if (params && typeof params === 'object' && 'params' in params && params.params && typeof params.params === 'object') {
            actualParams = params.params;
        }

        if (actualParams && Object.keys(actualParams).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(actualParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value));
                }
            });
            url += `?${searchParams.toString()}`;
        }

        return url;
    }

    public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, headers, body, ...customConfig } = options;
        const url = this.buildUrl(endpoint, params);

        const computedHeaders = this.getHeaders(headers) as Record<string, string>;
        if (typeof FormData !== 'undefined' && body instanceof FormData) {
            delete computedHeaders['Content-Type'];
        }

        const config: RequestInit = {
            method: 'GET',
            headers: computedHeaders,
            body,
            ...customConfig,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 401) {
                    const existingToken =
                        localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
                        localStorage.getItem('access_token') ||
                        localStorage.getItem('token');

                    if (existingToken) {
                        localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
                        localStorage.removeItem(TOKEN_CONFIG.refreshTokenKey);
                        localStorage.removeItem(TOKEN_CONFIG.userKey);
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

                if (response.status === 403) {
                    if (data.code === 'EMAIL_UNVERIFIED') {
                        const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
                        let email = '';
                        try {
                            const u = userStr ? JSON.parse(userStr) : null;
                            email = u?.email || '';
                        } catch { }
                        if (!window.location.pathname.includes('/verify-email')) {
                            window.location.href = `/web/verify-email-notice?email=${encodeURIComponent(email)}`;
                        }
                    }
                }

                if ([502, 503, 504].includes(response.status)) {
                    notifyNetworkError("Network error: Server unreachable or service unavailable.");
                }

                const errorMessage = data.message || data.error || `HTTP Error ${response.status}`;
                const error = new Error(errorMessage) as any;
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error: any) {
            console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);

            const isConnectionError =
                !error.status ||
                error instanceof TypeError ||
                error?.name === 'TypeError' ||
                (error?.message && typeof error.message === 'string' && (
                    error.message.toLowerCase().includes('failed to fetch') ||
                    error.message.toLowerCase().includes('networkerror') ||
                    error.message.toLowerCase().includes('network error')
                )) ||
                (typeof navigator !== 'undefined' && !navigator.onLine);

            if (isConnectionError) {
                notifyNetworkError("Network error: Unable to connect to the API server.");
            }

            throw error;
        }
    }

    public get<T = any>(endpoint: string, params?: Record<string, string | number | boolean>, headers?: HeadersInit | { headers?: HeadersInit }) {
        const resolvedHeaders = (headers && typeof headers === 'object' && 'headers' in headers) ? (headers as any).headers : headers;
        return this.request<T>(endpoint, { method: 'GET', params, headers: resolvedHeaders });
    }

    public post<T = any>(endpoint: string, body?: any, headers?: HeadersInit | { headers?: HeadersInit }) {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const resolvedHeaders = (headers && typeof headers === 'object' && 'headers' in headers) ? (headers as any).headers : headers;
        return this.request<T>(endpoint, {
            method: 'POST',
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            headers: resolvedHeaders,
        });
    }

    public put<T = any>(endpoint: string, body?: any, headers?: HeadersInit | { headers?: HeadersInit }) {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const resolvedHeaders = (headers && typeof headers === 'object' && 'headers' in headers) ? (headers as any).headers : headers;
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            headers: resolvedHeaders,
        });
    }

    public patch<T = any>(endpoint: string, body?: any, headers?: HeadersInit | { headers?: HeadersInit }) {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const resolvedHeaders = (headers && typeof headers === 'object' && 'headers' in headers) ? (headers as any).headers : headers;
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            headers: resolvedHeaders,
        });
    }

    public delete<T = any>(endpoint: string, headers?: HeadersInit | { headers?: HeadersInit }) {
        const resolvedHeaders = (headers && typeof headers === 'object' && 'headers' in headers) ? (headers as any).headers : headers;
        return this.request<T>(endpoint, { method: 'DELETE', headers: resolvedHeaders });
    }
}

export const apiClient = new ApiClient();
export default apiClient;
