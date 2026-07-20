export const API_CONFIG = {
    // API Base URL from environment variables
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    
    // API Version
    version: 'v1',
    
    // Request Timeout (30 seconds)
    timeout: 30000,
    
    // Default Headers
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    
    // Auto Retry Configuration for failed requests
    retry: {
        attempts: 2,
        delayMs: 1000,
    }
};

// Organize your API Endpoints here
export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh',
        ME: '/auth/me',
    },
    USERS: {
        LIST: '/users',
        CREATE: '/users',
        GET: (id: string | number) => `/users/${id}`,
        UPDATE: (id: string | number) => `/users/${id}`,
        DELETE: (id: string | number) => `/users/${id}`,
        ASSIGN_ROLE: (id: string | number) => `/users/${id}/role`,
    },
    PRODUCTS: {
        LIST: '/products',
        CREATE: '/products',
        GET: (id: string | number) => `/products/${id}`,
        UPDATE: (id: string | number) => `/products/${id}`,
        DELETE: (id: string | number) => `/products/${id}`,
        CATEGORIES: '/products/categories',
    },
    SALES: {
        INVOICES: '/sales/invoices',
        ORDERS: '/sales/orders',
        CUSTOMERS: '/sales/customers',
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
        CHART_DATA: '/dashboard/chart',
    }
};
