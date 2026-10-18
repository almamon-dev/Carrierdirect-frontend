import { useMemo } from 'react';
import { ActivityBubbleType } from '../Chat/components/bubble/QuoteActivityBubble';

export function useCounterOfferMessageData(msg: any, activeChat: any, activeNegotiation: any, isSupplier?: boolean) {
    const activeData = activeChat || activeNegotiation || {};
    const rawData = activeData.raw || {};

    const isSupplierSide = isSupplier !== undefined
        ? isSupplier
        : Boolean(activeNegotiation !== undefined || (activeData && activeData.customer && !activeData.carrier));

    const isSupplierSender =
        msg.sender === 'supplier' ||
        (msg as any).sender_type === 'supplier' ||
        (msg as any).sender_role === 'supplier' ||
        (msg as any).is_supplier === true;

    const isCustomerSender =
        msg.sender === 'customer' ||
        (msg as any).sender_type === 'customer' ||
        (msg as any).sender_role === 'customer' ||
        (msg as any).is_customer === true ||
        (Boolean(msg.sender) && msg.sender !== 'supplier' && (msg.sender === activeData.customer || msg.sender === activeData.name));

    const isSentByMe = Boolean(
        msg.is_my_offer !== undefined ? msg.is_my_offer :
            msg.is_me !== undefined ? msg.is_me :
                msg.isSent !== undefined ? msg.isSent :
                    msg.type === 'sent' ? true :
                    msg.type === 'received' ? false :
                    isSupplierSender ? isSupplierSide :
                    isCustomerSender ? !isSupplierSide :
                    (msg.title && String(msg.title).toLowerCase().includes("submitted")) ? true :
                    isSupplierSide
    );

    const otherPartyName =
        msg.sender && msg.sender !== 'supplier' && msg.sender !== 'customer'
            ? msg.sender
            : isSupplierSide
                ? (activeData.customer || activeData.company || activeData.name || "Customer Co 1")
                : (activeData.carrier || activeData.supplier || activeData.company || activeData.name || "Supplier Co 1");

    const quoteNum =
        msg.quoteNo ||
        activeData.quoteNo ||
        activeData.quoteId ||
        activeData.id ||
        "QT-0001";

    const pickupLoc = activeData.origin || activeData.pickup || rawData.origin || rawData.pickup_location || '-';
    const deliveryLoc = activeData.destination || activeData.delivery || rawData.destination || rawData.delivery_location || '-';
    const distanceStr = activeData.distance || rawData.distance || "230 km (Air)";
    const pickupDate = activeData.pickupDate || rawData.pickup_date || "Flexible / Today";
    const deliveryDate = activeData.deliveryDate || rawData.delivery_date || "Standard Delivery";
    const palletType = activeData.palletType || rawData.pallet_type || '-';
    const vehicleType = activeData.vehicleType || rawData.vehicle_type || "Covered Van (20ft)";
    const notesText = msg.notes || activeData.notes || rawData.notes || (msg.text && !String(msg.text).toLowerCase().includes("submitted a counter offer") ? msg.text : "") || "";

    const prevPrice = (msg.previousTotal !== undefined && msg.previousTotal !== null && Number(msg.previousTotal) > 0)
        ? Number(msg.previousTotal)
        : ((msg.previous_amount !== undefined && msg.previous_amount !== null && Number(msg.previous_amount) > 0)
            ? Number(msg.previous_amount)
            : 0);

    const proposedPrice = msg.newTotal ? Number(msg.newTotal) : (msg.proposed_amount ? Number(msg.proposed_amount) : 48035);

    const extraList = useMemo(() => {
        if (Array.isArray(msg.extra_charges)) return msg.extra_charges;
        if (Array.isArray(msg.extraCharges)) return msg.extraCharges;
        if (notesText && notesText.includes("[Extras:")) {
            const match = notesText.match(/\[Extras:\s*([^\]]+)\]/i);
            if (match && match[1]) {
                const parts = match[1].split(",");
                return parts.map((p: string) => {
                    const [namePart, amtPart] = p.split(":");
                    const amt = parseFloat(String(amtPart || "").replace(/[^0-9.]/g, "")) || 0;
                    return {
                        type: (namePart || "Extra Charge").trim(),
                        customName: (namePart || "Extra Charge").trim(),
                        amount: amt
                    };
                }).filter((item: any) => item.amount > 0);
            }
        }
        const isPointInTimeOffer = Boolean(msg.previousTotal || msg.previous_amount);
        if (!isPointInTimeOffer) {
            if (Array.isArray(activeData.extraCharges) && activeData.extraCharges.length > 0) return activeData.extraCharges;
            if (Array.isArray(rawData.extra_charges) && rawData.extra_charges.length > 0) return rawData.extra_charges;
        }
        return [];
    }, [msg, rawData, activeData, notesText]);

    const totalExtras = useMemo(() => {
        return extraList.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    }, [extraList]);

    const basePrice = useMemo(() => {
        const rawMsgBase = msg.base_amount !== undefined && msg.base_amount !== null ? Number(msg.base_amount) :
            (msg.baseFreight !== undefined && msg.baseFreight !== null ? Number(msg.baseFreight) : null);

        if (totalExtras > 0) {
            if (rawMsgBase !== null && rawMsgBase > 0 && Math.abs(rawMsgBase + totalExtras - proposedPrice) < 0.01) {
                return rawMsgBase;
            }
            if (proposedPrice > totalExtras) {
                return proposedPrice - totalExtras;
            }
            return Math.max(0, proposedPrice - totalExtras);
        }

        if (rawMsgBase !== null && rawMsgBase > 0 && Math.abs(rawMsgBase - proposedPrice) < 0.01) {
            return rawMsgBase;
        }
        return proposedPrice;
    }, [msg, proposedPrice, totalExtras]);

    const orderId = rawData.order_id || rawData.order?.id || activeData.orderId || activeData.order_id || (msg as any).order_id;
    const targetQuoteId = rawData.quote_id || rawData.id || activeData.quoteId || activeData.quote_id || activeData.id || msg.id || 1;
    const cleanQuoteId = String(targetQuoteId || "").replace(/[^0-9]/g, "");

    const isOrderPaid = Boolean(
        (cleanQuoteId && localStorage.getItem(`cd_quote_paid_${cleanQuoteId}`) === "true") ||
        (targetQuoteId && localStorage.getItem(`cd_quote_paid_${targetQuoteId}`) === "true") ||
        rawData.is_paid || rawData.has_order || rawData.order_id || rawData.status_raw === "booked" || rawData.status === "Booked" ||
        (activeData as any)?.status === "Booked" || (activeData as any)?.statusRaw === "booked" ||
        (activeData as any)?.isPaid || (activeData as any)?.hasOrder || (activeData as any)?.is_paid || (activeData as any)?.has_order ||
        rawData.order?.status === "in_progress" || rawData.order?.status === "completed" || rawData.order?.status === "confirmed" ||
        rawData.order?.status === "delivered" || rawData.invoice?.status === "paid" || rawData.invoice?.invoice_type === "pay_later" ||
        (msg as any).is_paid || (msg as any).has_order || (msg as any).is_order_paid
    );

    const isSupplierOffer = Boolean(
        msg.sender_type === 'supplier' ||
        (msg.sender_id && activeData.supplier_id && msg.sender_id === activeData.supplier_id) ||
        (msg.sender_id && rawData.user_id && msg.sender_id === rawData.user_id) ||
        (isSupplierSide && isSentByMe) ||
        (!isSupplierSide && !isSentByMe)
    );

    const isRevised = Boolean(
        msg?.message_type === 'revised_offer' ||
        msg?.type === 'revised_offer' ||
        (msg.title && String(msg.title).toLowerCase().includes('revised offer')) ||
        (msg.notes && String(msg.notes).toLowerCase().includes('revised offer')) ||
        (msg.text && String(msg.text).toLowerCase().includes('revised offer')) ||
        (isSupplierOffer && prevPrice > 0)
    );

    const bubbleType: ActivityBubbleType = isRevised
        ? "revised_offer"
        : (isSupplierOffer ? "quote_offer" : "counter_offer");

    const avatarInitials = (otherPartyName || "Supplier Co 1")
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "S1";

    return {
        activeData,
        isSupplierSide,
        isSentByMe,
        otherPartyName,
        quoteNum,
        pickupLoc,
        deliveryLoc,
        distanceStr,
        pickupDate,
        deliveryDate,
        palletType,
        vehicleType,
        notesText,
        prevPrice,
        proposedPrice,
        extraList,
        totalExtras,
        basePrice,
        orderId,
        targetQuoteId,
        isOrderPaid,
        isSupplierOffer,
        isRevised,
        bubbleType,
        avatarInitials,
    };
}
