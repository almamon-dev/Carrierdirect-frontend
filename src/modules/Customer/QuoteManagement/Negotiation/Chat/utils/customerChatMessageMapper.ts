import { CustomerChatItem, CustomerChatMessage } from '../types';
import { formatLocalTime, generateCustomerInitialMessages } from './customerChatUtils';

export const mapRawCustomerChatMessages = (
    rawMsgs: any[],
    activeChat: CustomerChatItem,
    isQuoteAccepted: boolean,
    isQuoteRejected: boolean,
    quoteDeclineReason?: string
): CustomerChatMessage[] => {
    const hasAnyCounterOffers = Array.isArray(rawMsgs) && rawMsgs.some((m: any) => {
        const rType = String(m.type || m.message_type || '').toLowerCase();
        return rType === 'offer' || rType === 'counter_offer' || rType === 'counter-offer' || Boolean(m.proposed_amount);
    });

    const initialItems = generateCustomerInitialMessages(activeChat).map(init => {
        if (init.type === 'quote_request') {
            if (isQuoteAccepted) return { ...init, status: 'accepted' as const };
            if (isQuoteRejected) return { ...init, status: 'rejected' as const, declineReason: quoteDeclineReason || init.declineReason };
            if (hasAnyCounterOffers || activeChat?.raw?.revision_status === 'pending' || (activeChat?.currentPrice && activeChat?.raw?.amount && activeChat?.currentPrice !== activeChat?.raw?.amount)) {
                return { ...init, status: 'superseded' as const, is_superseded: true };
            }
        }
        return init;
    });

    const mapped: CustomerChatMessage[] = rawMsgs.map((m: any) => {
        const isSent = m.is_me !== undefined ? Boolean(m.is_me) : Boolean(m.sender_type === 'customer' || (m.sender_id && activeChat?.raw?.quote_request?.user_id && m.sender_id === activeChat.raw.quote_request.user_id));
        const rawType = String(m.type || m.message_type || '').toLowerCase();
        const textContent = String(m.text || m.message || m.message_text || m.body || '');

        const isOffer = 
            rawType === 'offer' || 
            rawType === 'counter_offer' || 
            rawType === 'counter-offer' ||
            m.isCounterOffer === true ||
            (Boolean(m.proposed_amount) && rawType !== 'quote_request' && rawType !== 'system') ||
            textContent.toLowerCase().includes('submitted a counter offer') ||
            textContent.toLowerCase().includes('counter offer of') ||
            textContent.toLowerCase().includes('submitted a revised offer') ||
            textContent.toLowerCase().includes('revised offer of');

        const isSupplierOffer = Boolean(
            m.sender_type === 'supplier' ||
            (m.sender_id && activeChat?.raw?.user_id && m.sender_id === activeChat.raw.user_id) ||
            (!isSent && activeChat?.raw?.quote_request?.user_id && m.sender_id !== activeChat.raw.quote_request.user_id)
        );

        const rawQuote = activeChat?.raw || {};
        const isExplicitlyNotRevised = rawQuote.revision_status === 'none';
        const isRevisedOffer = !isExplicitlyNotRevised && Boolean(
            rawQuote.revision_status === 'revised' ||
            rawQuote.revision_status === 'pending' ||
            (rawQuote.revised_amount !== undefined && rawQuote.revised_amount !== null && Number(rawQuote.revised_amount) > 0) ||
            rawType === 'revised_offer' ||
            m.type === 'revised_offer' ||
            m.message_type === 'revised_offer' ||
            (m.revision_status && m.revision_status !== 'none') ||
            textContent.toLowerCase().includes('submitted a revised offer') ||
            textContent.toLowerCase().includes('revised offer of')
        );

        const offerTitle = isRevisedOffer
            ? (isSent ? 'Revised Offer Submitted' : 'Revised Offer Received')
            : (isSupplierOffer
                ? (isSent ? 'Quotation Offer Submitted' : 'Quotation Offer Received')
                : (isSent ? 'Counter Offer Submitted' : 'Counter Offer Received')
            );

        const isSystem = rawType === 'system' || textContent.startsWith('✅') || textContent.startsWith('❌') || textContent.startsWith('Offer Accepted') || textContent.startsWith('Payment completed!') || textContent.startsWith('Booking confirmed!');
        const isQuoteRequest = rawType === 'quote_request';

        const msgType = isSystem ? 'system' : (isQuoteRequest ? 'quote_request' : (isOffer ? 'offer' : (isSent ? 'sent' : 'received')));

        const proposedAmt = m.proposed_amount ? Number(m.proposed_amount) : (m.newTotal ? Number(m.newTotal) : (m.amount ? Number(m.amount) : undefined));
        const prevAmt = m.previous_amount ? Number(m.previous_amount) : (m.previousTotal ? Number(m.previousTotal) : (activeChat?.currentPrice || undefined));

        return {
            id: m.id || `msg-${Date.now()}-${Math.random()}`,
            type: msgType,
            attachments: m.attachments || (m.attachment ? [m.attachment] : undefined),
            text: textContent,
            time: formatLocalTime(m.created_at, m.time || m.created_at_formatted),
            sender: m.sender || m.sender_name,
            avatar: m.avatar,
            seen: Boolean(m.is_read || m.seen || m.read_at),
            seenAt: m.seen_at || m.read_at,
            isRead: Boolean(m.is_read),
            deliveryStatus: m.is_read ? 'seen' : (m.delivery_status || 'sent'),
            status: m.status || 'pending',
            declineReason: m.decline_reason || m.declineReason,
            newTotal: proposedAmt,
            previousTotal: prevAmt,
            base_amount: m.base_amount !== undefined && m.base_amount !== null ? Number(m.base_amount) : undefined,
            extra_charges: m.extra_charges || m.extraCharges || undefined,
            extraCharges: m.extra_charges || m.extraCharges || undefined,
            title: m.title || (isOffer ? offerTitle : undefined),
            notes: m.notes || (textContent.toLowerCase().includes('submitted a counter offer') ? '' : textContent),
            is_me: isSent,
            is_my_offer: m.is_my_offer !== undefined ? Boolean(m.is_my_offer) : isSent,
            isPinned: Boolean(m.is_pinned ?? m.isPinned),
            isDeleted: Boolean(m.is_deleted ?? m.isDeleted),
            isEdited: Boolean(m.is_edited ?? m.edited_at),
        };
    });

    const quoteRequestCard = initialItems.find(item => item.type === 'quote_request');
    const filteredMapped = mapped.filter(m => m.type !== 'quote_request');

    // Synthesize payment completed message if paid and not yet present in raw chat
    const rawQuoteId = activeChat?.raw?.quote_id || activeChat?.raw?.id || activeChat?.id;
    const cleanId = String(rawQuoteId || "").replace(/[^0-9]/g, "");

    const isPayLater = Boolean(
        (cleanId && localStorage.getItem(`cd_quote_paid_type_${cleanId}`) === "pay_later") ||
        (rawQuoteId && localStorage.getItem(`cd_quote_paid_type_${rawQuoteId}`) === "pay_later") ||
        activeChat?.raw?.invoice?.invoice_type === "pay_later" ||
        activeChat?.raw?.order?.invoice_type === "pay_later" ||
        activeChat?.raw?.payment_option === "pay_later"
    );

    const isPaid = Boolean(
        (cleanId && localStorage.getItem(`cd_quote_paid_${cleanId}`) === "true") ||
        (rawQuoteId && localStorage.getItem(`cd_quote_paid_${rawQuoteId}`) === "true") ||
        activeChat?.raw?.is_paid ||
        activeChat?.raw?.has_order ||
        activeChat?.raw?.order_id ||
        activeChat?.raw?.status_raw === "booked" ||
        activeChat?.raw?.status === "Booked" ||
        (activeChat as any)?.status === "Booked" ||
        (activeChat as any)?.statusRaw === "booked" ||
        (activeChat as any)?.isPaid ||
        (activeChat as any)?.hasOrder ||
        activeChat?.raw?.payment_status === "succeeded" ||
        activeChat?.raw?.payment_status === "paid" ||
        activeChat?.raw?.payment_status === "completed" ||
        activeChat?.raw?.payment_option === "pay_later" ||
        activeChat?.raw?.payment_option === "pay_now" ||
        activeChat?.raw?.order?.status === "in_progress" ||
        activeChat?.raw?.order?.status === "completed" ||
        activeChat?.raw?.order?.status === "confirmed" ||
        activeChat?.raw?.order?.status === "delivered" ||
        activeChat?.raw?.invoice?.status === "paid" ||
        activeChat?.raw?.invoice?.invoice_type === "pay_later"
    );

    const hasPaymentMsg = filteredMapped.some((m) => {
        const t = (m.text || "").toLowerCase();
        return t.includes("payment completed") || t.includes("pay later booking confirmed") || t.includes("funds held securely") || t.includes("escrow payment of");
    });

    const paymentSyntheticMsgs: CustomerChatMessage[] = [];
    if (isPaid && !hasPaymentMsg) {
        const orderNum = activeChat?.raw?.order?.order_number || activeChat?.raw?.order_number || (cleanId ? `ORD-${cleanId.padStart(4, "0")}` : "ORD-0001");
        const formattedAmt = activeChat?.currentPrice ? `€${Number(activeChat.currentPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "";

        if (isPayLater) {
            paymentSyntheticMsgs.push({
                id: `synthetic-paylater-${cleanId || 1}`,
                type: "system",
                text: `Pay Later booking confirmed! 📋\nBooking${formattedAmt ? ` of ${formattedAmt}` : ""} is confirmed under Corporate Net-30 terms. Transport Order #${orderNum} is now active.`,
                time: "Today",
                status: "accepted",
            });
        } else {
            paymentSyntheticMsgs.push({
                id: `synthetic-payment-${cleanId || 1}`,
                type: "system",
                text: `Payment completed! 🎉\nEscrow payment${formattedAmt ? ` of ${formattedAmt}` : ""} has been secured via Stripe. Transport Order #${orderNum} is now active.`,
                time: "Today",
                status: "accepted",
            });
        }
    }

    const finalMessages = [...filteredMapped, ...paymentSyntheticMsgs];
    const hasOfferInChat = filteredMapped.some(m => m.type === 'offer');
    return (!hasOfferInChat && quoteRequestCard) ? [quoteRequestCard, ...finalMessages] : finalMessages;
};
