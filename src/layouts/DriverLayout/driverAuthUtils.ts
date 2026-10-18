import { TOKEN_CONFIG } from '@/config/auth';

export function getAuthUser() {
    try {
        const raw =
            localStorage.getItem(TOKEN_CONFIG.userKey) ||
            localStorage.getItem('carrierdirect_user_data') ||
            localStorage.getItem('user');
        if (!raw) return { name: 'Commercial Driver', email: '', user_type: 'driver' };
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) {
            return { name: 'Commercial Driver', email: '', user_type: 'driver' };
        }
        return parsed;
    } catch {
        return { name: 'Commercial Driver', email: '', user_type: 'driver' };
    }
}

export function initials(name?: any): string {
    if (!name || typeof name !== 'string') return 'D';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() || '')
        .join('');
}
