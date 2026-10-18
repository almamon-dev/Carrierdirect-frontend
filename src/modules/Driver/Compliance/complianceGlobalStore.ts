import { TOKEN_CONFIG } from '@/config/auth';

export function getStoredUser() {
    try {
        const raw =
            localStorage.getItem(TOKEN_CONFIG.userKey) ||
            localStorage.getItem('carrierdirect_user_data') ||
            localStorage.getItem('user');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function getInitialVerified(): boolean {
    const user = getStoredUser();
    return Boolean(user?.is_verified);
}

export function getInitialStatus(): string {
    const user = getStoredUser();
    if (user?.is_verified) return 'verified';
    return user?.verification_status || 'pending_setup';
}

let cachedIsVerified = getInitialVerified();

export function setGlobalDriverVerified(verified: boolean) {
    cachedIsVerified = verified;
}

export function getGlobalDriverVerified(): boolean {
    return cachedIsVerified;
}

/**
 * Global helper to guard any driver action with compliance verification
 */
export function requireDriverCompliance(action: () => void, featureName?: string): boolean {
    if (!cachedIsVerified) {
        window.dispatchEvent(
            new CustomEvent('open-driver-lock-prompt', {
                detail: { featureName: featureName || 'Driver Actions' },
            })
        );
        return false;
    }
    action();
    return true;
}
