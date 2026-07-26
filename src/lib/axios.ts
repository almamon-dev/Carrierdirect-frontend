import { API_CONFIG } from '../config/api';
import { TOKEN_CONFIG } from '../config/auth';

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean>;
}

class ApiClient {
    private baseURL: string;

    constructor() {
        this.baseURL = API_CONFIG.baseURL;
    }

    private getHeaders(customHeaders?: HeadersInit): HeadersInit {
        const token = localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(customHeaders as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `${TOKEN_CONFIG.tokenType} ${token}`;
        }

        return headers;
    }

    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
        const cleanBaseUrl = this.baseURL.replace(/\/+$/, '');
        const cleanEndpoint = endpoint.replace(/^\/+/, '');
        let url = `${cleanBaseUrl}/${cleanEndpoint}`;

        if (params && Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
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
                    localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
                    localStorage.removeItem(TOKEN_CONFIG.refreshTokenKey);
                    localStorage.removeItem(TOKEN_CONFIG.userKey);
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/web/login';
                    }
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
            throw error;
        }
    }

    public get<T = any>(endpoint: string, params?: Record<string, string | number | boolean>, headers?: HeadersInit) {
        return this.request<T>(endpoint, { method: 'GET', params, headers });
    }

    public post<T = any>(endpoint: string, body?: any, headers?: HeadersInit) {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        return this.request<T>(endpoint, {
            method: 'POST',
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            headers,
        });
    }

    public put<T = any>(endpoint: string, body?: any, headers?: HeadersInit) {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
            headers,
        });
    }

    public delete<T = any>(endpoint: string, headers?: HeadersInit) {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
}

export const apiClient = new ApiClient();
export default apiClient;
