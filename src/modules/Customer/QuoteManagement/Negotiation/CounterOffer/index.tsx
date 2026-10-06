import Button from "@/components/ui/button";
import { encryptId } from "@/lib/encryption";
import { getServiceIcon } from "@/modules/Customer/QuoteManagement/Negotiation/Actions/components/CounterOfferModal";
import {
    ArrowRight,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy,
    Loader2,
    MoreVertical,
    Pin,
    ReceiptText,
    RefreshCw,
    Tag,
    Trash2,
    Truck,
    XCircle,
    MapPin,
    Package,
    Landmark,
    Receipt
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuoteActivityBubble } from "../Chat/components/bubble/QuoteActivityBubble";
import { DeclineOfferModal } from "../Chat/components/DeclineOfferModal";
import { QuotePaymentInstructionModal } from "../Chat/components/QuotePaymentInstructionModal";

export interface CounterOfferMessageProps {
    msg: any;
    activeChat?: any;
    activeNegotiation?: any;
    isSupplier?: boolean;
    onAccept?: (msg: any) => void;
    onReject?: (msg: any, reason?: string) => void;
    onOpenCounterOffer?: () => void;
    onTogglePin?: () => void;
    onDelete?: () => void;
}

export default function CounterOfferMessage({
    msg,
    activeChat,
    activeNegotiation,
    isSupplier,
    onAccept,
    onReject,
    onOpenCounterOffer,
    onTogglePin,
    onDelete,
}: CounterOfferMessageProps) {
    const navigate = useNavigate();
    const [isAccepting, setIsAccepting] = useState(false);
    const [localStatus, setLocalStatus] = useState<"pending" | "accepted" | "rejected" | null>(null);
    const [localReason, setLocalReason] = useState<string>("");
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showInstructionModal, setShowInstructionModal] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const status = localStatus || msg.status || "pending";
    const currency = msg.currency || "€";

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

    const pickupLoc =
        activeData.origin ||
        activeData.pickup ||
        rawData.origin ||
        rawData.pickup_location ||
        "Pickup Location";

    const deliveryLoc =
        activeData.destination ||
        activeData.delivery ||
        rawData.destination ||
        rawData.delivery_location ||
        "Delivery Destination";

    const distanceStr =
        activeData.distance ||
        rawData.distance ||
        "230 km (Air)";

    const pickupDate =
        activeData.pickupDate ||
        rawData.pickup_date ||
        "Flexible / Today";

    const deliveryDate =
        activeData.deliveryDate ||
        rawData.delivery_date ||
        "Standard Delivery";

    const palletType =
        activeData.palletType ||
        rawData.pallet_type ||
        "Standard Euro Pallet";

    const vehicleType =
        activeData.vehicleType ||
        rawData.vehicle_type ||
        "Covered Van (20ft)";

    const notesText =
        msg.notes ||
        activeData.notes ||
        rawData.notes ||
        (msg.text && !String(msg.text).toLowerCase().includes("submitted a counter offer") ? msg.text : "") ||
        "";

    const prevPrice =
        msg.previousTotal ? Number(msg.previousTotal) :
            (msg.previous_amount ? Number(msg.previous_amount) :
                (msg.amount ? Number(msg.amount) :
                    (activeData.originalAmount || activeData.currentPrice || (activeData.budget ? Number(String(activeData.budget).replace(/[^0-9.]/g, "")) : 48000))));

    const proposedPrice =
        msg.newTotal ? Number(msg.newTotal) :
            (msg.proposed_amount ? Number(msg.proposed_amount) : 48035);

    const extraList = useMemo(() => {
        let list: any[] = [];
        if (Array.isArray(msg.extra_charges) && msg.extra_charges.length > 0) {
            list = msg.extra_charges;
        } else if (Array.isArray(msg.extraCharges) && msg.extraCharges.length > 0) {
            list = msg.extraCharges;
        } else if (Array.isArray(activeData.extraCharges) && activeData.extraCharges.length > 0) {
            list = activeData.extraCharges;
        } else if (Array.isArray(rawData.extra_charges) && rawData.extra_charges.length > 0) {
            list = rawData.extra_charges;
        } else if (notesText && notesText.includes("[Extras:")) {
            const match = notesText.match(/\[Extras:\s*([^\]]+)\]/i);
            if (match && match[1]) {
                const parts = match[1].split(",");
                list = parts.map(p => {
                    const [namePart, amtPart] = p.split(":");
                    const amt = parseFloat(String(amtPart || "").replace(/[^0-9.]/g, "")) || 0;
                    return {
                        type: (namePart || "Extra Charge").trim(),
                        customName: (namePart || "Extra Charge").trim(),
                        amount: amt
                    };
                }).filter(item => item.amount > 0);
            }
        }
        return list;
    }, [msg, rawData, activeData, notesText]);

    const totalExtras = useMemo(() => {
        return extraList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }, [extraList]);

    const basePrice = useMemo(() => {
        const rawMsgBase = msg.base_amount !== undefined && msg.base_amount !== null ? Number(msg.base_amount) :
            (msg.baseFreight !== undefined && msg.baseFreight !== null ? Number(msg.baseFreight) : null);

        if (totalExtras > 0) {
            if (rawMsgBase !== null && rawMsgBase > 0 && rawMsgBase < proposedPrice && Math.abs(rawMsgBase + totalExtras - proposedPrice) < 0.01) {
                return rawMsgBase;
            }
            if (rawMsgBase !== null && rawMsgBase > 0 && rawMsgBase < proposedPrice) {
                return rawMsgBase;
            }
            if (proposedPrice > totalExtras) {
                return proposedPrice - totalExtras;
            }
            return proposedPrice;
        }

        if (rawMsgBase !== null && rawMsgBase > 0) {
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
        rawData.is_paid ||
        rawData.has_order ||
        rawData.order_id ||
        rawData.status_raw === "booked" ||
        rawData.status === "Booked" ||
        (activeData as any)?.status === "Booked" ||
        (activeData as any)?.statusRaw === "booked" ||
        (activeData as any)?.isPaid ||
        (activeData as any)?.hasOrder ||
        (activeData as any)?.is_paid ||
        (activeData as any)?.has_order ||
        rawData.order?.status === "in_progress" ||
        rawData.order?.status === "completed" ||
        rawData.order?.status === "confirmed" ||
        rawData.order?.status === "delivered" ||
        rawData.invoice?.status === "paid" ||
        rawData.invoice?.invoice_type === "pay_later" ||
        (msg as any).is_paid ||
        (msg as any).has_order ||
        (msg as any).is_order_paid
    );

    const isSuperseded = status === "superseded" || msg.is_superseded === true;
    const isWithdrawn = status === "withdrawn";
    const isAccepted = status === "accepted" || (activeData as any)?.status === "Accepted" || (activeData as any)?.status === "Booked" || isOrderPaid;
    const isDeclined = status === "rejected" || status === "declined" || (activeData as any)?.status === "Offer Declined" || (activeData as any)?.status === "rejected";
    const isPending = status === "pending" && !isSuperseded && !isWithdrawn && !isAccepted && !isDeclined;
    const canAccept = !isSentByMe && isPending;

    const isSupplierOffer = Boolean(
        msg.sender_type === 'supplier' ||
        (msg.sender_id && activeData.supplier_id && msg.sender_id === activeData.supplier_id) ||
        (msg.sender_id && rawData.user_id && msg.sender_id === rawData.user_id) ||
        (isSupplierSide && isSentByMe) ||
        (!isSupplierSide && !isSentByMe)
    );

    const isExplicitlyNotRevised = rawData?.revision_status === 'none' || (activeData as any)?.revision_status === 'none' || (activeData as any)?.revisionStatus === 'none';

    const isRevised = !isExplicitlyNotRevised && Boolean(
        rawData?.revision_status === 'revised' ||
        rawData?.revision_status === 'pending' ||
        (activeData as any)?.revision_status === 'pending' ||
        (activeData as any)?.revision_status === 'revised' ||
        (activeData as any)?.revisionStatus === 'pending' ||
        (activeData as any)?.revisionStatus === 'revised' ||
        (rawData?.revised_amount !== undefined && rawData?.revised_amount !== null && Number(rawData?.revised_amount) > 0) ||
        ((activeData as any)?.revised_amount !== undefined && (activeData as any)?.revised_amount !== null && Number((activeData as any)?.revised_amount) > 0) ||
        msg?.message_type === 'revised_offer' ||
        msg?.type === 'revised_offer' ||
        (msg.title && String(msg.title).toLowerCase().includes('revised offer')) ||
        (msg.notes && String(msg.notes).toLowerCase().includes('revised offer')) ||
        (msg.text && String(msg.text).toLowerCase().includes('revised offer'))
    );

    const bubbleType = isRevised
        ? "revised_offer"
        : (isSupplierOffer ? "quote_offer" : "counter_offer");

    const avatarInitials = (otherPartyName || "Supplier Co 1")
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "S1";

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleCopyDetails = () => {
        const textToCopy = `Counter Offer #${quoteNum}
Rate: ${currency} ${proposedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Base Rate: ${currency} ${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Route: ${pickupLoc} → ${deliveryLoc}
Status: ${status}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setIsMenuOpen(false);
        }, 1500);
    };

    const handleConfirmAccept = () => {
        setIsAccepting(true);
        setLocalStatus("accepted");
        if (!isSupplierSide) {
            setShowInstructionModal(true);
        }
        if (onAccept) onAccept(msg);
        setTimeout(() => setIsAccepting(false), 200);
    };

    const handleConfirmDecline = (reason: string) => {
        setLocalStatus("rejected");
        setLocalReason(reason);
        setShowDeclineModal(false);
        if (onReject) onReject(msg, reason);
    };

    return (
        <div className="space-y-2 w-full my-1.5">
            {/* 1. Activity Speech Bubble (Right aligned if sent by me, Left aligned with avatar if received) */}
            {isSentByMe ? (
                <div className="flex justify-end w-full">
                    <div className="w-[440px] sm:w-[460px] max-w-full">
                        <QuoteActivityBubble
                            type={bubbleType}
                            actorName={otherPartyName}
                            quoteNumber={quoteNum}
                            amount={proposedPrice}
                            currency={currency}
                            time={msg.time || ""}
                            isSent={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex gap-2.5 items-start justify-start group relative w-full">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 mt-0.5 shadow-2xs select-none overflow-hidden">
                        {activeData?.avatar && (activeData.avatar.startsWith('http') || activeData.avatar.startsWith('/storage') || activeData.avatar.startsWith('data:') || activeData.avatar.includes('.')) ? (
                            <img src={activeData.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            avatarInitials
                        )}
                    </div>

                    <div className="w-[440px] sm:w-[460px] max-w-full">
                        <QuoteActivityBubble
                            type={bubbleType}
                            actorName={otherPartyName}
                            quoteNumber={quoteNum}
                            amount={proposedPrice}
                            currency={currency}
                            time={msg.time || ""}
                            isSent={false}
                        />
                    </div>
                </div>
            )}

            {/* 2. Counter Offer Details Card - Aligned strictly with Card 1 */}
            <div className={`flex items-center ${isSentByMe ? 'justify-end' : 'justify-start pl-[42px]'} w-full my-1.5`}>
                <div className="relative w-[440px] sm:w-[460px] max-w-full group">
                    <div
                        id={`msg-bubble-${msg.id}`}
                        className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#FF6A00] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-900/40">
                                    {isRevised ? <RefreshCw className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                                        {isRevised
                                            ? (isSentByMe ? "Revised Offer Details" : "Revised Offer Received")
                                            : isSupplierOffer
                                                ? (isSentByMe ? "Quotation Offer Details" : "Quotation Offer Received")
                                                : (isSentByMe ? "Counter Offer Details" : "Counter Offer Received")
                                        }
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{msg.time || "2:48 PM"}</p>
                                </div>
                            </div>

                            <span className="text-[11px] font-semibold text-[#FF6A00] bg-orange-50/70 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-[4px] border border-[#FF6A00]/40 shrink-0">
                                #{String(quoteNum).replace(/^#+/, '')}
                            </span>
                        </div>

                        {/* Route with Orange Ring, Dotted Connector with Distance, and Blue Pin */}
                        <div className="py-1 text-[11.5px]">
                            {/* Origin */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#FF6A00] bg-white dark:bg-slate-900 shrink-0" />
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{pickupLoc}</span>
                                </div>
                                <span className="text-[10.5px] font-medium text-slate-400 shrink-0 ml-2">{distanceStr}</span>
                            </div>

                            {/* Connecting Dotted Line */}
                            <div className="ml-[4px] pl-3.5 border-l-2 border-dotted border-slate-300 dark:border-slate-700 h-3.5 my-0.5" />

                            {/* Destination */}
                            <div className="flex items-center gap-2 min-w-0">
                                <MapPin size={13} className="text-[#2563EB] shrink-0" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{deliveryLoc}</span>
                            </div>
                        </div>

                        {/* Itemized Breakdown with Outline Icons */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-1.5 text-[11.5px]">
                            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                    <Package size={13} className="text-slate-400 shrink-0" />
                                    <span>Base Freight Rate</span>
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {currency} {basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            {extraList.length > 0 && extraList.map((ext: any, idx: number) => {
                                const label = ext.customName || ext.custom_name || ext.label || ext.type || "Extra Fee";
                                const isToll = label.toLowerCase().includes('toll');
                                const isCustoms = label.toLowerCase().includes('custom');
                                const IconComponent = isToll ? Landmark : isCustoms ? Receipt : getServiceIcon(label);

                                return (
                                    <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <IconComponent size={13} className="text-slate-400 shrink-0" />
                                            <span>{label}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            +{currency} {Number(ext.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total Offer Row with Previous Strikethrough Price */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                            <div>
                                {prevPrice > 0 && prevPrice !== proposedPrice && (
                                    <span className="text-[10px] text-slate-400 block line-through leading-none">
                                        Prev: {currency} {prevPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                )}
                                <span className="font-bold text-slate-900 dark:text-white text-[12.5px] leading-tight mt-0.5 block">
                                    {isRevised
                                        ? (isSentByMe ? "Total Revised Rate" : "Revised Offer Rate")
                                        : isSupplierOffer
                                            ? "Total Offered Rate"
                                            : (isSentByMe ? "Total Offered Rate" : "Counter Offer Rate")
                                    }
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                                    {currency} {proposedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Cargo Footer Row with View Details Link in Orange */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0 truncate">
                                <Truck size={13} className="text-slate-500 shrink-0" />
                                <span className="truncate">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">Cargo: </span>
                                    {palletType} • {vehicleType}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                className="font-semibold text-[#FF6A00] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 ml-2"
                            >
                                <span>{isDetailsOpen ? "Close Details" : "View Details"}</span>
                                <ChevronRight size={13} className={`transition-transform duration-150 ${isDetailsOpen ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {isDetailsOpen && (
                            <div className="pt-1.5 space-y-1.5 w-full min-w-0">
                                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Pickup Date:</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{pickupDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Delivery Date:</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{deliveryDate}</span>
                                    </div>
                                    {notesText && (
                                        <div className="pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                                            <span className="text-slate-400 block text-[10px]">Notes:</span>
                                            <span className="font-medium text-slate-700 dark:text-slate-300 italic break-words whitespace-normal leading-relaxed">{notesText}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Status / Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            {isAccepted ? (
                                <div className="space-y-1.5">
                                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                                        <CheckCircle2 size={13} className="text-emerald-600" />
                                        <span>{isOrderPaid ? `Offer Accepted & Booked (${currency} ${proposedPrice.toLocaleString()})` : `Offer Accepted (${currency} ${proposedPrice.toLocaleString()})`}</span>
                                    </div>
                                    {!isSupplierSide && (
                                        isOrderPaid ? (
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="w-full h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                                onClick={() => {
                                                    if (orderId) {
                                                        navigate(`/customer/orders/${encryptId(orderId)}`);
                                                    } else {
                                                        navigate("/customer/orders");
                                                    }
                                                }}
                                            >
                                                <Truck size={13} className="shrink-0" />
                                                <span>Track Order</span>
                                                <ArrowRight size={13} />
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="w-full h-8 bg-[#FF6A00] hover:bg-[#e65f00] text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                                onClick={() => setShowInstructionModal(true)}
                                            >
                                                <span>Proceed to Checkout</span>
                                                <ArrowRight size={13} />
                                            </Button>
                                        )
                                    )}
                                </div>
                            ) : isDeclined ? (
                                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-semibold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                                    <XCircle size={13} className="text-rose-600" />
                                    <span>Offer Declined {localReason ? `• ${localReason}` : ""}</span>
                                </div>
                            ) : isSuperseded ? (
                                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-[11px] font-medium py-1 px-2.5 rounded-[4px] flex items-center justify-center gap-1.5">
                                    <Tag size={12} className="text-slate-400" />
                                    <span>Superseded by newer offer</span>
                                </div>
                            ) : canAccept ? (
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            disabled={isAccepting}
                                            onClick={handleConfirmAccept}
                                            className="flex-1 h-7.5 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {isAccepting ? (
                                                <>
                                                    <Loader2 size={12} className="animate-spin text-white shrink-0" />
                                                    <span>Accepting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={12} />
                                                    <span>Accept Offer</span>
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (onOpenCounterOffer) {
                                                    onOpenCounterOffer();
                                                } else {
                                                    const btn = document.querySelector('button[title*="Revise"], button[title*="Counter"], button[title*="Propose"]') as HTMLButtonElement;
                                                    if (btn) btn.click();
                                                }
                                            }}
                                            className="flex-1 h-7.5 rounded-[4px] bg-[#FF6A00] hover:bg-[#e65f00] text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-2xs"
                                        >
                                            {isSupplierSide ? "Revise Offer" : "Counter Offer"}
                                        </Button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeclineModal(true)}
                                        className="w-full text-center text-[10.5px] font-medium text-slate-400 hover:text-rose-600 py-0.5 transition-colors cursor-pointer"
                                    >
                                        Decline this offer
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-[4px] px-2.5 py-1.5 text-center flex flex-col items-center justify-center gap-0.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <Clock size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                                        <span>Waiting for {otherPartyName} Response</span>
                                    </div>
                                    <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">
                                        {otherPartyName} has been notified. You will be updated once a response is received.
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Floating Three-Dot Button on Hover */}
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 ${
                                isSentByMe ? "right-full mr-2" : "left-full ml-2"
                            } transition-opacity duration-150 z-30 ${isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                }`}
                            ref={menuRef}
                        >
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center transition-colors cursor-pointer border shadow-2xs ${isMenuOpen
                                    ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600"
                                    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700"
                                    }`}
                                title="More options"
                                aria-label="More options"
                            >
                                <MoreVertical size={13} />
                            </button>

                            {/* Popover Dropdown Menu */}
                            {isMenuOpen && (
                                <div className={`absolute ${isSentByMe ? "right-0" : "left-0"} bottom-full mb-1.5 w-40 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-lg p-1 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 text-[12px] font-medium font-sans`}>
                                    <button
                                        type="button"
                                        onClick={handleCopyDetails}
                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                    >
                                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-500 dark:text-slate-400" />}
                                        <span>{copied ? "Copied!" : "Copy Details"}</span>
                                    </button>

                                    {onTogglePin && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onTogglePin();
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                        >
                                            <Pin size={13} className={msg.isPinned ? "text-amber-500 fill-amber-500" : "text-slate-500 dark:text-slate-400"} />
                                            <span>{msg.isPinned ? "Unpin from Top" : "Pin to Top"}</span>
                                        </button>
                                    )}

                                    {onDelete && (
                                        <>
                                            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onDelete();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                                            >
                                                <Trash2 size={13} className="text-rose-500" />
                                                <span>Delete</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <DeclineOfferModal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                offerAmount={proposedPrice}

                onConfirm={handleConfirmDecline}
            />

            <QuotePaymentInstructionModal
                isOpen={showInstructionModal}
                onClose={() => setShowInstructionModal(false)}
                quoteId={targetQuoteId}
                quoteAmount={proposedPrice}
                supplierName={otherPartyName}
            />
        </div>
    );
}
