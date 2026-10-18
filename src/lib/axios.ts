import { API_CONFIG } from '../config/api';
import { TOKEN_CONFIG } from '../config/auth';
import { notifyNetworkError, handleAuthError, buildApiUrl } from './apiAuthHandler';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
    params?: Record<string, string | number | boolean | undefined | null>;
    body?: any;
    silent?: boolean;
}

class ApiClient {
    private baseURL: string;

    constructor() {
        let base = API_CONFIG.baseURL || '';
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            if (!base || base.includes('ngrok')) {
                base = 'http://localhost:8000/api';
            }
        }
        this.baseURL = base;
    }

    private getHeaders(customHeaders?: HeadersInit): HeadersInit {
        const token =
            localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
            localStorage.getItem('carrierdirect_access_token') ||
            localStorage.getItem('access_token') ||
            localStorage.getItem('token');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': '69420',
            ...(customHeaders as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `${TOKEN_CONFIG.tokenType} ${token}`;
        }

        return headers;
    }

    public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, headers, body, ...customConfig } = options;
        const url = buildApiUrl(this.baseURL, endpoint, params);

        const computedHeaders = this.getHeaders(headers) as Record<string, string>;
        if (typeof FormData !== 'undefined' && body instanceof FormData) {
            delete computedHeaders['Content-Type'];
            delete computedHeaders['content-type'];
            delete computedHeaders['CONTENT-TYPE'];
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
                handleAuthError(response.status, data);
                const errorMessage = data.message || data.error || `HTTP Error ${response.status}`;
                const error = new Error(errorMessage) as any;
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error: any) {
            if (!options.silent) {
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
            }

            throw error;
        }
    }

    public get<T = any>(endpoint: string, paramsOrOptions?: any, headers?: HeadersInit | { headers?: HeadersInit }) {
        let params = paramsOrOptions;
        let isSilent = false;
        if (paramsOrOptions && typeof paramsOrOptions === 'object') {
            if ('params' in paramsOrOptions) params = paramsOrOptions.params;
            if ('silent' in paramsOrOptions) isSilent = Boolean(paramsOrOptions.silent);
        }
        const resolvedHeaders = (headers && typeof headers === 'object' && 'headers' in headers) ? (headers as any).headers : headers;
        return this.request<T>(endpoint, { method: 'GET', params, headers: resolvedHeaders, silent: isSilent });
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

    public delete<T = any>(endpoint: string, paramsOrOptions?: any, headers?: HeadersInit | { headers?: HeadersInit }) {
        let params = paramsOrOptions;
        let isSilent = false;
        let body: any = undefined;
        if (paramsOrOptions && typeof paramsOrOptions === 'object') {
            if ('params' in paramsOrOptions) params = paramsOrOptions.params;
            if ('silent' in paramsOrOptions) isSilent = Boolean(paramsOrOptions.silent);
            if ('body' in paramsOrOptions || 'data' in paramsOrOptions) body = paramsOrOptions.body || paramsOrOptions.data;
        }
        const resolvedHeaders = (headers && typeof headers === 'object' && 'headers' in headers) ? (headers as any).headers : headers;
        return this.request<T>(endpoint, {
            method: 'DELETE',
            params,
            body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
            headers: resolvedHeaders,
            silent: isSilent,
        });
    }

    public async getBlob(endpoint: string, params?: any): Promise<Blob> {
        const url = buildApiUrl(this.baseURL, endpoint, params);
        const headers = this.getHeaders({ Accept: "application/pdf, application/octet-stream, */*" });
        const response = await fetch(url, { method: "GET", headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        return await response.blob();
    }
}

export const apiClient = new ApiClient();
export default apiClient;
