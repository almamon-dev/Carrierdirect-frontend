import apiClient from '../lib/axios';
import { ENDPOINTS } from '../config/api';
import { TOKEN_CONFIG } from '../config/auth';

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    user_type: 'customer' | 'supplier';
    name?: string;
    company_name?: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number?: string;
    insurance_type?: string;
    insurance_provider_name?: string;
    policy_number?: string;
    policy_expiry_date?: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    user_type: 'customer' | 'supplier' | 'admin';
    company_name?: string;
    phone_number?: string;
    is_verified?: boolean;
}

export const authService = {
    async login(payload: LoginPayload) {
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, payload);

        const token: string = response.access_token || response.token || response.data?.access_token;
        const user: AuthUser = response.data?.user || response.user;

        if (token) {
            localStorage.setItem(TOKEN_CONFIG.accessTokenKey, token);
        }
        if (user) {
            localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(user));
        }

        return {
            user,
            token,
            checkoutUrl: response.data?.checkout_url ?? null,
            requiresPayment: response.data?.requires_payment ?? false,
            raw: response,
        };
    },

    async register(payload: RegisterPayload) {
        const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, payload);
        return response;
    },

    async verifyEmail(email: string, token: string) {
        // Link-based verification: send email + token from URL query params
        const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { email, token });

        const authToken: string = response.access_token || response.token || response.data?.access_token;
        const user: AuthUser = response.data?.user || response.user;

        if (authToken) {
            localStorage.setItem(TOKEN_CONFIG.accessTokenKey, authToken);
        }
        if (user) {
            localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(user));
        }

        return {
            user,
            token: authToken,
            checkoutUrl: response.data?.checkout_url ?? null,
            requiresPayment: response.data?.requires_payment ?? false,
            raw: response,
        };
    },

    async logout() {
        try {
            await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            localStorage.removeItem(TOKEN_CONFIG.accessTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.refreshTokenKey);
            localStorage.removeItem(TOKEN_CONFIG.userKey);
        }
    },

    getCurrentUser(): AuthUser | null {
        const userStr = localStorage.getItem(TOKEN_CONFIG.userKey);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_CONFIG.accessTokenKey);
    }
};

export default authService;
