// Token keys used for localStorage or cookies
export const TOKEN_CONFIG = {
    accessTokenKey: 'erp_access_token',
    refreshTokenKey: 'erp_refresh_token',
    userKey: 'erp_user_data',
    tokenType: 'Bearer', // Standard OAuth 2.0 token type
};

// Session and authentication behavior settings
export const AUTH_SETTINGS = {
    // How long before the session expires (in minutes)
    sessionTimeoutInMinutes: 120,
    
    // Automatically redirect here after successful login
    defaultRedirectPath: '/dashboard',
    
    // Redirect here if an unauthenticated user tries to access a protected route
    loginPath: '/login',
};

// Available Roles in the ERP System
export const ROLES = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    STAFF: 'Staff',
    CUSTOMER: 'Customer',
};

// Define standard permission scopes
export const PERMISSIONS = {
    USERS: {
        CREATE: 'users.create',
        READ: 'users.read',
        UPDATE: 'users.update',
        DELETE: 'users.delete',
    },
    SALES: {
        CREATE_INVOICE: 'sales.invoice.create',
        VIEW_REPORTS: 'sales.reports.view',
    },
    PRODUCTS: {
        MANAGE: 'products.manage',
    }
};

// Optional: OAuth settings (if you plan to use Google/Facebook login later)
export const OAUTH_CONFIG = {
    google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    },
};
