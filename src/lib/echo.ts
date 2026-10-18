import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { TOKEN_CONFIG } from '../config/auth';
import { API_CONFIG } from '../config/api';

(window as any).Pusher = Pusher;

const getAuthToken = () => {
    return (
        localStorage.getItem(TOKEN_CONFIG.accessTokenKey) ||
        localStorage.getItem('carrierdirect_access_token') ||
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        ''
    );
};

const getBaseApiUrl = () => {
    let base = API_CONFIG.baseURL || '';
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        if (!base || base.includes('ngrok')) {
            base = 'http://localhost:8000/api';
        }
    }
    return base.replace(/\/+$/, '');
};

export const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'jbkd61d7jhq1skyqpn51',
    wsHost: import.meta.env.VITE_REVERB_HOST || (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1'),
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${getBaseApiUrl()}/broadcasting/auth`,
    auth: {
        headers: {
            get Authorization() {
                const token = getAuthToken();
                return token ? `Bearer ${token}` : '';
            },
            Accept: 'application/json',
        },
    },
});

export default echo;
