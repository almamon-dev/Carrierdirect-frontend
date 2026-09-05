import { NegotiationItem } from '../../../types';
import { SAMPLE_NEGOTIATIONS } from '../../../hooks/useSupplierNegotiations';
import { decryptId } from '@/lib/encryption';

export interface LinkPreviewData {
    url: string;
    domain: string;
    title: string;
    description: string;
    image?: string;
}

export const extractFirstUrl = (text?: string): string | null => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
};

export const shortenUrl = (url: string, maxLength: number = 42): string => {
    if (!url || url.length <= maxLength) return url;
    try {
        const parsed = new URL(url);
        const host = parsed.host;
        const path = parsed.pathname + parsed.search;
        if (path.length > 18) {
            return `${host}${path.slice(0, 14)}...${path.slice(-8)}`;
        }
        return `${url.slice(0, maxLength - 3)}...`;
    } catch {
        return `${url.slice(0, maxLength - 3)}...`;
    }
};

export const getLinkPreview = (rawUrl: string, activeNegotiation?: NegotiationItem): LinkPreviewData => {
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
            if (pathname.includes('/negotiation')) {
                let matchedItem: NegotiationItem | undefined = undefined;
                const viewMatch = pathname.match(/\/view\/([^/]+)/);
                if (viewMatch && viewMatch[1]) {
                    const encToken = viewMatch[1];
                    const decrypted = decryptId(encToken);
                    const rawNum = Number(String(decrypted).replace(/[^0-9]/g, ''));
                    matchedItem = SAMPLE_NEGOTIATIONS.find(
                        n => n.rawId === rawNum || String(n.rawId) === String(decrypted) || n.id === decrypted || n.rawId === Number(decrypted)
                    );
                }

                if (!matchedItem) {
                    const sessionMatch = rawUrl.match(/ses-([a-zA-Z0-9_-]+)/);
                    if (sessionMatch) {
                        const sKey = `ses-${sessionMatch[1]}`;
                        const sNum = Number(sessionMatch[1]);
                        matchedItem = SAMPLE_NEGOTIATIONS.find(n => n.sessionKey === sKey || n.rawId === sNum);
                    }
                }

                const target = matchedItem || activeNegotiation || SAMPLE_NEGOTIATIONS[0];
                if (target) {
                    return {
                        url: rawUrl,
                        domain: 'CARRIERDIRECT.COM',
                        title: `${target.customer} • Quote ${target.quoteId}`,
                        description: `${target.requestTitle || `${target.pickup} → ${target.delivery}`} • Current Rate: €${Number(target.currentOffer || target.originalAmount).toLocaleString()}`,
                        image: target.customerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                    };
                }
            }

            return {
                url: rawUrl,
                domain: 'CARRIERDIRECT.COM',
                title: 'CarrierDirect • Smart Freight Logistics',
                description: 'End-to-end logistics platform connecting shippers and carriers with real-time tracking.',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
            };
        }

        const cleanPath = pathname.replace(/^\/+|\/+$/g, '').replace(/[-_/]/g, ' ');
        const pathTitle = cleanPath.length > 0 && cleanPath.length < 50
            ? cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1)
            : host;

        return {
            url: rawUrl,
            domain: host.toUpperCase(),
            title: `${pathTitle} - Web Link`,
            description: `Visit ${host} to view and explore this webpage.`,
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
        };
    } catch {
        return {
            url: rawUrl,
            domain: 'WEB LINK',
            title: rawUrl,
            description: 'Click to open this link in a new window.'
        };
    }
};
