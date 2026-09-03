import { CustomerChatMessage, LinkPreviewData } from '../types';
import { API_CONFIG } from '@/config/api';

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

export const generateCustomerInitialMessages = (chatItem: any): CustomerChatMessage[] => {
    if (!chatItem) return [];
    const raw = chatItem?.raw || chatItem;
    const origAmount = Number(raw?.originalAmount || chatItem?.currentPrice || 0);
    const pickupLoc = raw?.origin || raw?.pickup || chatItem?.origin || 'Pickup Location';
    const deliveryLoc = raw?.destination || raw?.delivery || chatItem?.destination || 'Delivery Destination';
    const quoteNum = chatItem?.quoteNo || raw?.quoteId || (raw?.id ? `QT-${String(raw.id).padStart(4, '0')}` : 'QT-0001');
    const customerName = raw?.customer || 'Customer';
    const transitTime = raw?.transitTime || '1 - 2 Business Days';
    const additionalNotes = (raw?.notes && raw.notes.trim().length > 5)
        ? raw.notes.trim()
        : 'Includes GPS live tracking, tail-lift vehicle & loading assistance';

    const supplierProposal = `Hello ${customerName},

I’m interested in your freight request. I’d like to submit the following quote:

• Quote: €${origAmount.toLocaleString()}
• Pickup: ${pickupLoc}
• Delivery: ${deliveryLoc}
• Estimated Transit Time: ${transitTime}
• Additional Notes: ${additionalNotes}

Please let me know if you need any further information. I look forward to discussing the details with you.

Best regards`;

    const isRejected = raw?.status === 'rejected' || raw?.status === 'declined' || raw?.status === 'Declined' || raw?.status === 'Offer Declined' || raw?.revisionStatus === 'rejected' || raw?.status_raw === 'rejected';
    const isAccepted = raw?.status === 'accepted' || raw?.status === 'Accepted' || raw?.status === 'completed' || raw?.status === 'confirmed' || raw?.revisionStatus === 'accepted' || raw?.status_raw === 'accepted' || raw?.status_raw === 'completed';
    const initialStatus = isAccepted ? 'accepted' : isRejected ? 'rejected' : 'pending';

    return [
        {
            id: `req-${chatItem?.id || raw?.id || 1}`,
            type: 'quote_request',
            title: 'Quote Request Received',
            sender: customerName,
            text: `${customerName} has submitted a quote request for this shipment.`,
            time: raw?.lastUpdated || raw?.requestDate || 'Today',
            newTotal: origAmount,
            previousTotal: origAmount,
            quoteNo: quoteNum,
            status: initialStatus,
            declineReason: raw?.declineReason || raw?.decline_reason
        },
        {
            id: `msg-quote-proposal-${chatItem?.id || raw?.id || 1}`,
            type: 'received',
            sender: chatItem?.name || raw?.supplier || 'Carrier Partner',
            avatar: chatItem?.avatar || (raw?.supplier || 'C').charAt(0).toUpperCase(),
            text: supplierProposal,
            time: raw?.lastUpdated || raw?.requestDate || '10:05 AM'
        }
    ];
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

