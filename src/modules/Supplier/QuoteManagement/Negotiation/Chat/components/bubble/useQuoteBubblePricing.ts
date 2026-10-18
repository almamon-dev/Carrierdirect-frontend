import { useMemo } from 'react';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';

export function useQuoteBubblePricing(msg: ChatMessage, activeNegotiation: NegotiationItem) {
    const initialOffer = Number(
        msg.newTotal ||
        activeNegotiation.originalAmount ||
        Number(String(activeNegotiation.budget || '').replace(/[^0-9.]/g, '')) ||
        48035
    );

    const isAccepted = msg.status === 'accepted' || (activeNegotiation as any)?.status === 'Accepted';
    const isDeclined =
        msg.status === 'rejected' ||
        (msg.status as string) === 'declined' ||
        (activeNegotiation as any)?.status === 'Offer Declined' ||
        (activeNegotiation as any)?.status === 'rejected';
    const isSuperseded = msg.status === 'superseded' || (msg as any)?.is_superseded === true;

    const isSupplierSender = 
        msg.sender === 'supplier' || 
        (msg as any).sender_type === 'supplier' || 
        (msg as any).is_me === true || 
        (msg as any).is_my_offer === true || 
        (msg as any).isSent === true || 
        msg.type === 'sent';

    const isCustomerSender = 
        msg.sender === 'customer' || 
        (msg as any).sender_type === 'customer' || 
        (msg as any).is_me === false || 
        (msg as any).is_my_offer === false || 
        (msg as any).isSent === false || 
        msg.type === 'received' ||
        (Boolean(msg.sender) && msg.sender !== 'supplier' && msg.sender === activeNegotiation.customer);

    const isSentByMe = (msg as any).is_my_offer !== undefined 
        ? Boolean((msg as any).is_my_offer) 
        : (msg as any).is_me !== undefined 
            ? Boolean((msg as any).is_me)
            : (msg as any).isSent !== undefined
                ? Boolean((msg as any).isSent)
                : isSupplierSender
                    ? true
                    : isCustomerSender
                        ? false
                        : true;

    const canAccept = !isSentByMe && ((activeNegotiation as any).can_accept === true) && !isAccepted && !isDeclined && !isSuperseded;

    const notesText = activeNegotiation.notes || 'GPS live tracking, tail-lift vehicle & loading assistance included.';

    const extraList = useMemo(() => {
        let list: any[] = [];
        if (Array.isArray((msg as any).extra_charges) && (msg as any).extra_charges.length > 0) {
            list = (msg as any).extra_charges;
        } else if (Array.isArray((msg as any).extraCharges) && (msg as any).extraCharges.length > 0) {
            list = (msg as any).extraCharges;
        } else if (Array.isArray((activeNegotiation as any)?.extraCharges) && (activeNegotiation as any)?.extraCharges.length > 0) {
            list = (activeNegotiation as any).extraCharges;
        } else if (Array.isArray((activeNegotiation as any)?.raw?.extra_charges) && (activeNegotiation as any)?.raw?.extra_charges.length > 0) {
            list = (activeNegotiation as any).raw.extra_charges;
        } else if (notesText && notesText.includes('[Extras:')) {
            const match = notesText.match(/\[Extras:\s*([^\]]+)\]/i);
            if (match && match[1]) {
                const parts = match[1].split(',');
                list = parts.map((p) => {
                    const [namePart, amtPart] = p.split(':');
                    const amt = parseFloat(String(amtPart || '').replace(/[^0-9.]/g, '')) || 0;
                    return {
                        type: (namePart || 'Extra Charge').trim(),
                        customName: (namePart || 'Extra Charge').trim(),
                        amount: amt,
                    };
                }).filter((item) => item.amount > 0);
            }
        }
        return list;
    }, [msg, activeNegotiation, notesText]);

    const totalExtras = useMemo(() => {
        return extraList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }, [extraList]);

    const basePrice = useMemo(() => {
        const rawMsgBase = (msg as any).base_amount !== undefined && (msg as any).base_amount !== null ? Number((msg as any).base_amount) :
            (activeNegotiation.baseFreight !== undefined && activeNegotiation.baseFreight !== null ? Number(activeNegotiation.baseFreight) : null);

        if (totalExtras > 0) {
            if (rawMsgBase !== null && rawMsgBase > 0 && Math.abs(rawMsgBase + totalExtras - initialOffer) < 0.01) {
                return rawMsgBase;
            }
            if (initialOffer > totalExtras) {
                return initialOffer - totalExtras;
            }
            return Math.max(0, initialOffer - totalExtras);
        }

        if (rawMsgBase !== null && rawMsgBase > 0 && Math.abs(rawMsgBase - initialOffer) < 0.01) {
            return rawMsgBase;
        }
        return initialOffer;
    }, [msg, activeNegotiation, initialOffer, totalExtras]);

    return {
        initialOffer,
        isAccepted,
        isDeclined,
        isSuperseded,
        isSentByMe,
        canAccept,
        extraList,
        totalExtras,
        basePrice,
        totalQuotationAmount: initialOffer,
        notesText,
    };
}
