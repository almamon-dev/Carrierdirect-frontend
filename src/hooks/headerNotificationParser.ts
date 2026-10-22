import { HeaderNotification, NotificationCategory } from './headerNotificationTypes';
import { encryptId } from '@/lib/encryption';

export { encryptId };

export const normalizeNotifLink = (
    rawLink: string | undefined,
    role: 'supplier' | 'customer' | 'driver' = 'supplier'
): string => {
    if (!rawLink) {
        return role === 'driver'
            ? '/driver/notifications'
            : (role === 'supplier' ? '/supplier/notifications' : '/customer/notifications');
    }

    let link = rawLink.trim();

    // 1. If full URL (http/https), extract pathname + search + hash if it's on localhost or app host
    if (link.startsWith('http://') || link.startsWith('https://')) {
        try {
            const urlObj = new URL(link);
            link = urlObj.pathname + urlObj.search + urlObj.hash;
        } catch {
            return link;
        }
    }

    // 2. Strip leading /api if present from backend responses
    if (link.startsWith('/api/')) {
        link = link.replace(/^\/api/, '');
    } else if (link === '/api') {
        link = '/';
    }

    // 3. Conversation links
    if (link.startsWith('/supplier/quotes/conversation/')) {
        link = link.replace('/supplier/quotes/conversation/', '/supplier/quotes/negotiation/conversation/');
    }
    if (link.startsWith('/customer/quotes/conversation/')) {
        link = link.replace('/customer/quotes/conversation/', '/customer/quotes/negotiation/conversation/');
    }

    // 4. Role-specific link formatting
    if (role === 'supplier') {
        if (link.startsWith('/orders') || link.startsWith('/supplier/orders')) {
            link = '/supplier/orders/active-jobs';
        }
        if (link.startsWith('/wallet')) {
            link = '/supplier/wallet';
        }
        if (!link.startsWith('/supplier')) {
            link = '/supplier' + (link.startsWith('/') ? link : '/' + link);
        }
    } else if (role === 'customer') {
        if (link.includes('quote')) {
            link = '/customer/quotes/processing?view=table';
        } else if (link.startsWith('/orders') && !link.startsWith('/customer/orders')) {
            link = '/customer' + link;
        } else if (link.startsWith('/invoices') && !link.startsWith('/customer/finance/invoices')) {
            link = '/customer/finance' + link;
        }

        if (!link.startsWith('/customer')) {
            link = '/customer' + (link.startsWith('/') ? link : '/' + link);
        }
    } else if (role === 'driver') {
        if (!link.startsWith('/driver')) {
            link = '/driver' + (link.startsWith('/') ? link : '/' + link);
        }
    }

    return link;
};

export const mapNotificationType = (typeStr: string): HeaderNotification['type'] => {
    const lower = (typeStr || '').toLowerCase();
    if (lower.includes('compliance') || lower.includes('document')) return 'compliance';
    if (lower.includes('quote') || lower.includes('rfq') || lower.includes('offer')) return 'quote';
    if (lower.includes('shipment') || lower.includes('order') || lower.includes('transit') || lower.includes('pod')) return 'shipment';
    if (lower.includes('message') || lower.includes('chat')) return 'message';
    if (lower.includes('finance') || lower.includes('payout') || lower.includes('invoice') || lower.includes('pay') || lower.includes('escrow') || lower.includes('wallet')) return 'finance';
    if (lower.includes('account') || lower.includes('driver')) return 'account';
    return 'system';
};

export const formatTimeAgo = (dateStr: string | number | Date): string => {
    try {
        const timeMs = new Date(dateStr).getTime();
        if (isNaN(timeMs)) return 'Recently';
        const diff = Date.now() - timeMs;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins} min ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    } catch {
        return 'Recently';
    }
};

export const resolveNotificationCategory = (
    item: any,
    dataObj: any,
    notifType: string
): NotificationCategory => {
    const rawCategory = String(item.category || dataObj.category || '').toLowerCase();
    if (rawCategory === 'compliance') return 'compliance';
    if (rawCategory === 'finance' || rawCategory === 'payment') return 'finance';
    if (rawCategory === 'quote') return 'quote';
    if (rawCategory === 'shipment') return 'shipment';
    if (rawCategory === 'account') return 'account';

    const combined = `${item.type || ''} ${dataObj.type || ''} ${item.title || dataObj.title || ''} ${item.message || dataObj.message || ''} ${notifType || ''}`.toLowerCase();

    if (
        combined.includes('compliance') ||
        combined.includes('document') ||
        combined.includes('insurance') ||
        combined.includes('license') ||
        combined.includes('expir') ||
        combined.includes('verification_required')
    ) {
        return 'compliance';
    }

    if (
        combined.includes('finance') ||
        combined.includes('payment') ||
        combined.includes('escrow') ||
        combined.includes('fund') ||
        combined.includes('wallet') ||
        combined.includes('payout') ||
        combined.includes('withdraw') ||
        combined.includes('invoice') ||
        combined.includes('pay_later') ||
        combined.includes('charge')
    ) {
        return 'finance';
    }

    if (
        combined.includes('quote') ||
        combined.includes('rfq') ||
        combined.includes('offer') ||
        combined.includes('negotiat') ||
        combined.includes('counter')
    ) {
        return 'quote';
    }

    if (
        combined.includes('shipment') ||
        combined.includes('transit') ||
        combined.includes('pod') ||
        combined.includes('delivery') ||
        combined.includes('deliver') ||
        combined.includes('picked_up') ||
        combined.includes('pickup') ||
        combined.includes('order') ||
        combined.includes('cargo')
    ) {
        return 'shipment';
    }

    if (
        combined.includes('account') ||
        combined.includes('driver_assigned') ||
        combined.includes('driver assigned') ||
        combined.includes('verified') ||
        combined.includes('profile')
    ) {
        return 'account';
    }

    return 'shipment';
};

export const resolveNotificationSubCategory = (
    item: any,
    dataObj: any,
    title: string,
    desc: string
): string => {
    const combined = `${item.type || ''} ${dataObj.type || ''} ${title} ${desc}`.toLowerCase();

    if (combined.includes('delivery_accepted') || combined.includes('delivery accepted')) {
        return 'delivery_accepted';
    }
    if (combined.includes('pod') || combined.includes('proof of delivery')) {
        return 'pod';
    }
    if (combined.includes('document_expiry') || combined.includes('expir') || combined.includes('insurance document')) {
        return 'documents_expiring';
    }
    if (combined.includes('funds_released') || combined.includes('fund_release') || combined.includes('funds released') || combined.includes('released to your balance')) {
        return 'funds_released';
    }
    if (combined.includes('quote_accepted') || combined.includes('quote accepted') || combined.includes('offer accepted')) {
        return 'quote_accepted';
    }
    if (combined.includes('escrow') || combined.includes('payment_received') || combined.includes('payment received')) {
        return 'escrow';
    }
    if (combined.includes('driver_assigned') || combined.includes('driver assigned') || combined.includes('assigned to your shipment')) {
        return 'driver_assigned';
    }
    if (combined.includes('quote_revised') || combined.includes('revised quote') || combined.includes('revised offer') || combined.includes('revision')) {
        return 'quote_revised';
    }
    if (combined.includes('quote_submitted') || combined.includes('quote submitted')) {
        return 'quote_submitted';
    }
    if (combined.includes('quote_received') || combined.includes('new_quote') || combined.includes('new quote from') || combined.includes('new quote received') || combined.includes('offer received')) {
        return 'quote_received';
    }
    if (combined.includes('new_rfq') || combined.includes('new quote request') || combined.includes('freight request')) {
        return 'new_quote_request';
    }
    if (combined.includes('in_transit') || combined.includes('in transit') || combined.includes('transit')) {
        return 'transit';
    }
    if (combined.includes('account_verified') || combined.includes('account verified')) {
        return 'account_verified';
    }

    return 'general';
};

export const parseRawNotification = (
    item: any,
    idx: number,
    role: 'supplier' | 'customer' | 'driver' = 'supplier'
): HeaderNotification => {
    const rawData = (item && item.data && typeof item.data === 'object' && Object.keys(item.data).length > 0)
        ? item.data
        : {};
    const dataObj = { ...(item || {}), ...rawData };
    const notifId = item.id || dataObj.id || `api-notif-${idx}`;
    const typeRaw = item.type || dataObj.type || item.category || dataObj.category || 'system';
    const notifType = mapNotificationType(typeRaw);

    const amountRaw = dataObj.amount || item.amount || dataObj.budget || item.budget || dataObj.target_price || item.target_price || dataObj.price || item.price || dataObj.proposed_amount || dataObj.total_amount;
    const formattedAmount = amountRaw 
        ? (typeof amountRaw === 'number' ? `€${amountRaw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : (String(amountRaw).includes('€') || String(amountRaw).includes('$') ? amountRaw : `€${amountRaw}`))
        : '';

    const orderNumber = dataObj.order_number || item.order_number || (dataObj.order_id ? `#ORD-${dataObj.order_id}` : '');
    const driverName = dataObj.driver_name || item.driver_name || '';
    const customerName = dataObj.customer_name || item.customer_name || 'Customer';
    const pickupCity = dataObj.pickup_city || dataObj.from_city || dataObj.origin || item.origin || dataObj.pickup || item.pickup || dataObj.pickup_address;
    const deliveryCity = dataObj.delivery_city || dataObj.to_city || dataObj.destination || item.destination || dataObj.delivery || item.delivery || dataObj.delivery_address;
    const routeStr = (pickupCity && deliveryCity) ? `${pickupCity} → ${deliveryCity}` : (dataObj.route || item.route || '');

    const reqSlug = dataObj.slug || item.slug || dataObj.request_id || item.request_id || dataObj.quote_request_id;
    const quoteId = dataObj.quote_id || item.quote_id;

    let rawTitle = item.title || dataObj.title || item.subject || dataObj.subject || '';
    const typeName = String(typeRaw).toLowerCase();

    if (!rawTitle) {
        if (typeName.includes('pod')) {
            rawTitle = orderNumber ? `POD Received: Order #${orderNumber}` : 'POD Received';
        } else if (typeName.includes('quote_submitted')) {
            rawTitle = dataObj.request_code ? `Quote Submitted: ${dataObj.request_code}` : 'Quote Submitted';
        } else if (typeName.includes('quote_revised') || typeName.includes('revision')) {
            rawTitle = dataObj.supplier_company ? `Revised Quote from ${dataObj.supplier_company}` : (dataObj.request_code ? `Quote Revised: ${dataObj.request_code}` : 'Quote Revised');
        } else if (typeName.includes('newquote') || typeName.includes('quote_received')) {
            rawTitle = dataObj.supplier_company || dataObj.supplier_name
                ? `New Quote from ${dataObj.supplier_company || dataObj.supplier_name}`
                : (dataObj.request_code ? `New Quote: ${dataObj.request_code}` : 'New Quote Received');
        } else if (typeName.includes('new_rfq') || (notifType === 'quote' && role === 'supplier')) {
            rawTitle = 'New Quote Request';
        } else if (notifType === 'quote' && role === 'customer') {
            rawTitle = dataObj.supplier_company || dataObj.supplier_name
                ? `New Quote from ${dataObj.supplier_company || dataObj.supplier_name}`
                : 'New Quote Received';
        } else if (typeName.includes('quoteaccepted') || typeName.includes('accept')) {
            rawTitle = 'Quote Accepted';
        } else if (typeName.includes('fund_release') || typeName.includes('funds_released')) {
            rawTitle = 'Funds Released';
        } else if (typeName.includes('payment_received') || typeName.includes('escrow')) {
            rawTitle = 'Payment Received in Escrow';
        } else if (typeName.includes('driver_assigned')) {
            rawTitle = 'Driver Assigned';
        } else if (typeName.includes('document_expiry') || typeName.includes('expir')) {
            rawTitle = 'Documents Expiring Soon';
        } else if (typeName.includes('status_updated') || notifType === 'shipment' || notifType === 'order') {
            rawTitle = dataObj.status === 'in_transit' ? 'Shipment Update: In transit' : 'Shipment Update';
        } else {
            rawTitle = 'Notification';
        }
    }

    // Clean up title for clean UI aesthetics matching mockup
    let title = rawTitle.replace(/\s*\(Order\s*#[^)]+\)$/i, '').trim();
    if (title.toLowerCase().includes('driver assigned')) {
        title = 'Driver Assigned';
    }
    if (title.toLowerCase().startsWith('delivery accepted')) {
        title = orderNumber ? `Delivery Accepted: Order #${orderNumber}` : title;
    }
    if (title.toLowerCase().startsWith('proof of delivery received') || title.toLowerCase().startsWith('pod uploaded')) {
        title = orderNumber ? `POD Received: Order #${orderNumber}` : 'POD Received';
    }

    let rawDesc = item.desc || dataObj.desc || item.details || dataObj.details || item.description || dataObj.description || item.message || dataObj.message || '';

    const category = resolveNotificationCategory(item, dataObj, notifType);
    const subCategory = resolveNotificationSubCategory(item, dataObj, title, rawDesc);

    let desc = rawDesc;
    if (subCategory === 'delivery_accepted' || title.toLowerCase().includes('delivery accepted')) {
        desc = rawDesc || (orderNumber ? `Customer has accepted delivery and approved Proof of Delivery for Order #${orderNumber}. Shipment is completed!` : 'Customer has accepted delivery and approved Proof of Delivery. Shipment is completed!');
    } else if (subCategory === 'pod' && driverName) {
        desc = rawDesc || `Driver ${driverName} has delivered your shipment and submitted the Proof of Delivery.`;
    } else if (subCategory === 'transit' && orderNumber) {
        desc = rawDesc || `Your shipment for Order #${orderNumber} is currently in transit with ${driverName || 'driver'}.`;
    } else if (subCategory === 'escrow' && formattedAmount && orderNumber) {
        desc = rawDesc || `${formattedAmount} is held securely in escrow for Order #${orderNumber}.`;
    } else if (subCategory === 'driver_assigned' && orderNumber) {
        desc = rawDesc || `${driverName || 'Driver'} has been assigned to your shipment for Order #${orderNumber}.`;
    } else if (subCategory === 'funds_released' && formattedAmount && orderNumber) {
        desc = rawDesc || `${formattedAmount} for Order #${orderNumber} has been released to your balance.`;
    } else if (subCategory === 'documents_expiring') {
        desc = rawDesc || `Your insurance document will expire in ${dataObj.days || 5} days. Please upload an updated document.`;
    } else if (subCategory === 'quote_accepted' && formattedAmount) {
        desc = rawDesc || `Your quote of ${formattedAmount} was accepted by ${customerName}. Order #${orderNumber || ''} has been created.`;
    } else if (subCategory === 'quote_received' || subCategory === 'quote_submitted' || subCategory === 'quote_revised') {
        desc = rawDesc || (
            subCategory === 'quote_submitted'
                ? `Your quote of ${formattedAmount || 'amount'} for ${dataObj.request_code || 'quote request'} was submitted.`
                : `${dataObj.supplier_company || dataObj.supplier_name || 'A carrier'} submitted an offer of ${formattedAmount || 'amount'} for ${dataObj.request_code || 'your freight request'}.`
        );
    } else if (subCategory === 'new_quote_request' && routeStr) {
        desc = rawDesc || `New freight request: ${routeStr}.${formattedAmount ? ` Budget: ${formattedAmount}` : ''}`;
    }

    if (!desc || desc.length < 3) {
        desc = role === 'supplier'
            ? 'New update on your freight quotes and active orders.'
            : 'New update on your freight shipment.';
    }

    let rawLink = item.link || dataObj.link || item.action_url || dataObj.action_url || item.url || dataObj.url;
    if (!rawLink) {
        if (role === 'supplier') {
            if (subCategory === 'funds_released' || subCategory === 'escrow' || category === 'finance') {
                rawLink = '/supplier/wallet';
            } else if (category === 'compliance') {
                rawLink = '/supplier/settings';
            } else if (subCategory === 'quote_submitted' || subCategory === 'quote_revised') {
                rawLink = '/supplier/quotes/my-quotes';
            } else if (subCategory === 'new_quote_request' || category === 'quote') {
                rawLink = reqSlug ? `/supplier/quotes/requests/${encryptId(reqSlug)}` : '/supplier/quotes/requests';
            } else {
                rawLink = '/supplier/orders/active-jobs';
            }
        } else if (role === 'driver') {
            rawLink = '/driver/shipments';
        } else {
            if (category === 'finance') {
                rawLink = '/customer/finance/invoices';
            } else if (category === 'quote') {
                rawLink = '/customer/quotes/processing?view=table';
            } else {
                rawLink = '/customer/orders';
            }
        }
    }

    const timestamp = item.created_at ? new Date(item.created_at).getTime() : Date.now();

    return {
        id: notifId,
        title,
        desc,
        time: item.created_at ? formatTimeAgo(item.created_at) : (item.time_ago || dataObj.time_ago || 'Recently'),
        timestamp,
        createdAt: item.created_at || undefined,
        amount: formattedAmount || undefined,
        type: notifType,
        category,
        subCategory,
        unread: Boolean(!item.read_at && !item.is_read && item.status !== 'read'),
        link: normalizeNotifLink(rawLink, role)
    };
};
