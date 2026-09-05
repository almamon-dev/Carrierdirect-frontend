import { LinkPreviewData } from '../types';
import { API_CONFIG } from '@/config/api';
export { generateCustomerInitialMessages } from './customerInitialMessages';

export const getAttachmentUrl = (url?: string): string => {
    if (!url) return '';
    const str = String(url).trim();
    if (!str || str === 'null' || str === 'undefined') return '';
    if (str.startsWith('blob:') || str.startsWith('data:')) {
        return str;
    }

    let finalUrl = str;
    const apiBase = API_CONFIG.baseURL || import.meta.env.VITE_API_BASE_URL || '';
    const apiOrigin = apiBase.replace(/\/api\/?$/, '');

    if (str.startsWith('/')) {
        finalUrl = apiOrigin ? `${apiOrigin}${str}` : str;
    } else if (!str.startsWith('http://') && !str.startsWith('https://')) {
        finalUrl = `${apiOrigin}/${str.replace(/^\/+/, '')}`;
    } else {
        try {
            const parsed = new URL(str);
            if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
                if (apiOrigin && !apiOrigin.includes('localhost')) {
                    finalUrl = `${apiOrigin}${parsed.pathname}${parsed.search}`;
                }
            }
        } catch {}
    }

    if (finalUrl.includes('ngrok') && !finalUrl.includes('ngrok-skip-browser-warning')) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'ngrok-skip-browser-warning=69420';
    }

    return finalUrl;
};

export const extractFirstUrl = (text?: string): string | null => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
};

export const shortenUrl = (url: string, maxLength: number = 38): string => {
    try {
        const parsed = new URL(url);
        const domain = parsed.hostname.replace(/^www\./, '');
        const path = parsed.pathname;

        if (domain.length + path.length <= maxLength) {
            return `${domain}${path}`;
        }
        const availableForPath = maxLength - domain.length - 4;
        if (availableForPath > 5) {
            return `${domain}${path.slice(0, availableForPath)}...`;
        }
        return `${domain}...`;
    } catch {
        return `${url.slice(0, maxLength - 3)}...`;
    }
};

export const getLinkPreview = (rawUrl: string, activeChat?: any): LinkPreviewData => {
    try {
        const parsed = new URL(rawUrl);
        const host = parsed.host;
        const pathname = parsed.pathname;

        if (/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(rawUrl)) {
            const fileName = pathname.split('/').pop()?.split('?')[0] || 'Image';
            return {
                url: rawUrl,
                domain: host.toUpperCase(),
                title: fileName.replace(/[-_]/g, ' '),
                description: `Direct image preview from ${host}`,
                image: rawUrl
            };
        }

        if (host.includes('localhost') || host.includes('carrierdirect') || host.includes('vercel.app')) {
            if (pathname.includes('/negotiation') || pathname.includes('/conversation')) {
                const target = activeChat || null;
                if (target) {
                    return {
                        url: rawUrl,
                        domain: 'CARRIERDIRECT.COM',
                        title: `${target.name || 'CarrierDirect'} • Quote ${target.quoteNo || 'QT-0001'}`,
                        description: `${target.routeText || 'Freight Transport'} • Current Rate: €${Number(target.currentPrice || 1850).toLocaleString()}`,
                        image: target.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                    };
                }
            }

            return {
                url: rawUrl,
                domain: 'CARRIERDIRECT.COM',
                title: 'CarrierDirect Logistics Portal',
                description: 'End-to-end European road freight marketplace and dispatch system.',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
            };
        }

        return {
            url: rawUrl,
            domain: host.toUpperCase(),
            title: `Link: ${host}`,
            description: `Visit ${rawUrl} to see more details.`,
            image: undefined
        };
    } catch {
        return {
            url: rawUrl,
            domain: 'EXTERNAL LINK',
            title: 'Web link preview',
            description: rawUrl,
            image: undefined
        };
    }
};

export function formatLocalTime(createdAt?: string, fallbackTime?: string): string {
    if (createdAt) {
        try {
            let iso = String(createdAt).trim();
            if (!iso.includes('T') && iso.includes(' ')) {
                iso = iso.replace(' ', 'T');
            }
            if (!iso.endsWith('Z') && !iso.includes('+') && !iso.match(/-\d{2}:\d{2}$/)) {
                iso = `${iso}Z`;
            }
            const d = new Date(iso);
            if (!isNaN(d.getTime())) {
                return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
            }
        } catch {
            // fallback
        }
    }
    if (fallbackTime && !fallbackTime.includes('T')) {
        return fallbackTime;
    }
    return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}
