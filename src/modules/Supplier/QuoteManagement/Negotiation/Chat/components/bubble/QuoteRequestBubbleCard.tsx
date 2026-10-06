import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCircle2, Loader2, ChevronDown, ChevronRight, Clock, Copy, MoreVertical, Pin, Trash2, XCircle, Tag, ReceiptText, Building2, ShieldCheck, ArrowRight, Truck, MapPin, Package, Landmark, Receipt, RefreshCw } from "lucide-react";
import Button from "@/components/ui/button";
import { DeclineOfferModal } from "@/modules/Customer/QuoteManagement/Negotiation/Chat/components/DeclineOfferModal";
import { NegotiationItem } from "../../../types";
import { ChatMessage } from "../../types";
import { QuoteRequestCardDetails } from "./QuoteRequestCardDetails";
import { getServiceIcon } from "@/modules/Customer/QuoteManagement/Negotiation/Actions/components/CounterOfferModal";
import { QuoteActivityBubble } from "@/modules/Customer/QuoteManagement/Negotiation/Chat/components/bubble/QuoteActivityBubble";

interface QuoteRequestBubbleCardProps {
    msg: ChatMessage;
    activeNegotiation: NegotiationItem;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any, reason?: string) => void;
    handleTogglePinMessage?: (id: number | string) => void;
    handleDeleteMessage?: (id: number | string) => void;
    highlightedMsgId?: number | string | null;
}

export const QuoteRequestBubbleCard: React.FC<QuoteRequestBubbleCardProps> = ({
    msg,
    activeNegotiation,
    handleAcceptOffer,
    handleRejectOffer,
    handleTogglePinMessage,
    handleDeleteMessage,
    highlightedMsgId,
}) => {
    const navigate = useNavigate();
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const customerName = msg.sender || activeNegotiation.customer || "Customer";
    const quoteNum = activeNegotiation.quoteId || activeNegotiation.id || "QT-0003";
    const pickupLoc = activeNegotiation.origin || activeNegotiation.pickup || "Pickup Location";
    const deliveryLoc = activeNegotiation.destination || activeNegotiation.delivery || "Delivery Destination";
    const distanceStr = activeNegotiation.distance || "230 km (Air)";
    const initialOffer = Number(msg.newTotal || activeNegotiation.originalAmount || Number(String(activeNegotiation.budget || "").replace(/[^0-9.]/g, "")) || 48035);
    const isAccepted = msg.status === "accepted" || (activeNegotiation as any)?.status === "Accepted";
    const isDeclined = msg.status === "rejected" || (msg.status as string) === "declined" || (activeNegotiation as any)?.status === "Offer Declined" || (activeNegotiation as any)?.status === "rejected";
    const isSuperseded = msg.status === "superseded" || (msg as any)?.is_superseded === true;

    const pickupDate = activeNegotiation.pickupDate || "Flexible / Today";
    const deliveryDate = activeNegotiation.deliveryDate || "Standard Delivery";
    const palletType = activeNegotiation.palletType || "Standard Euro Pallet";
    const vehicleType = activeNegotiation.vehicleType || "Covered Van (20ft)";
    const notesText = activeNegotiation.notes || "GPS live tracking, tail-lift vehicle & loading assistance included.";

    // Action permissions: Determine whether supplier or customer sent this offer
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

    // Extract extra charges and compute itemized breakdown
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
                list = parts.map(p => {
                    const [namePart, amtPart] = p.split(':');
                    const amt = parseFloat(String(amtPart || '').replace(/[^0-9.]/g, '')) || 0;
                    return {
                        type: (namePart || 'Extra Charge').trim(),
                        customName: (namePart || 'Extra Charge').trim(),
                        amount: amt
                    };
                }).filter(item => item.amount > 0);
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
            if (rawMsgBase !== null && rawMsgBase > 0 && rawMsgBase < initialOffer && Math.abs(rawMsgBase + totalExtras - initialOffer) < 0.01) {
                return rawMsgBase;
            }
            if (rawMsgBase !== null && rawMsgBase > 0 && rawMsgBase < initialOffer) {
                return rawMsgBase;
            }
            if (initialOffer > totalExtras) {
                return initialOffer - totalExtras;
            }
            return initialOffer;
        }

        if (rawMsgBase !== null && rawMsgBase > 0) {
            return rawMsgBase;
        }
        return initialOffer;
    }, [msg, activeNegotiation, initialOffer, totalExtras]);

    const totalQuotationAmount = useMemo(() => {
        if (initialOffer > basePrice && initialOffer >= (basePrice + totalExtras)) {
            return initialOffer;
        }
        if (basePrice > 0 && totalExtras > 0) {
            return basePrice + totalExtras;
        }
        return initialOffer || basePrice;
    }, [initialOffer, basePrice, totalExtras]);

    const avatarInitials = (customerName || 'Supplier Co 1')
        .split(' ')
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'S1';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event?.target as Node)) {
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

    const handleCopyDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        const copySummary = `Quote Request #${quoteNum}
Customer: ${customerName}
Route: ${pickupLoc} → ${deliveryLoc} (${distanceStr})
Amount: € ${initialOffer.toLocaleString()}
Schedule: ${pickupDate} → ${deliveryDate}
Cargo: ${palletType} • ${vehicleType}
Notes: ${notesText}`;
        navigator.clipboard.writeText(copySummary);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setIsMenuOpen(false);
        }, 1200);
    };

    return (
        <div className="space-y-2 w-full my-1.5">
            {/* 1. Activity Speech Bubble (Right aligned if sent by supplier, Left aligned if received) */}
            {isSentByMe ? (
                <div className="flex justify-end w-full">
                    <div className="w-[440px] sm:w-[460px] max-w-full">
                        <QuoteActivityBubble
                            type="revised_offer"
                            actorName={customerName}
                            quoteNumber={quoteNum}
                            origin={pickupLoc}
                            destination={deliveryLoc}
                            distance={distanceStr}
                            time={msg.time || "2:48 PM"}
                            amount={totalQuotationAmount}
                            isSent={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex gap-2.5 items-start justify-start group relative w-full">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 mt-0.5 shadow-2xs select-none overflow-hidden">
                        {(activeNegotiation as any)?.avatar && ((activeNegotiation as any).avatar.startsWith('http') || (activeNegotiation as any).avatar.startsWith('/storage') || (activeNegotiation as any).avatar.startsWith('data:') || (activeNegotiation as any).avatar.includes('.')) ? (
                            <img src={(activeNegotiation as any).avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            avatarInitials
                        )}
                    </div>

                    <div className="w-[440px] sm:w-[460px] max-w-full">
                        <QuoteActivityBubble
                            type="quote_request"
                            actorName={customerName}
                            quoteNumber={quoteNum}
                            origin={pickupLoc}
                            destination={deliveryLoc}
                            distance={distanceStr}
                            time={msg.time || "2:48 PM"}
                            amount={totalQuotationAmount}
                            isSent={false}
                        />
                    </div>
                </div>
            )}

            {/* 2. Quote Request Details Card (Strict width w-[440px] sm:w-[460px] that never breaks or shifts horizontally on expand) */}
            <div className={`flex items-center ${isSentByMe ? 'justify-end' : 'justify-start pl-10.5'} w-full my-1.5`}>
                <div className="relative w-[440px] sm:w-[460px] max-w-full group">
                    <div
                        id={`msg-bubble-${msg.id}`}
                        className={`bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans transition-all duration-300 ${highlightedMsgId === msg.id ? 'ring-2 ring-[#FF4A1F] ring-offset-2' : ''
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#FF6A00] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-900/40">
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                                        {canAccept ? "Counter Offer Received" : "Revised Offer Details"}
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
                                    € {basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            {extraList.length > 0 && extraList.map((ext: any, idx: number) => {
                                const label = ext.customName || ext.custom_name || ext.label || ext.type || 'Extra Fee';
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
                                            € {Number(ext.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Total Revised Rate Row */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                            <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">
                                {canAccept ? "Counter Offer Rate" : "Total Revised Rate"}
                            </span>
                            <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                                € {totalQuotationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
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
                            <div className="pt-1.5 space-y-1.5">
                                <QuoteRequestCardDetails
                                    isOpen={isDetailsOpen}
                                    pickupDate={pickupDate}
                                    deliveryDate={deliveryDate}
                                    palletType={palletType}
                                    vehicleType={vehicleType}
                                    notes={notesText}
                                />
                            </div>
                        )}

                        {/* Status / Action Buttons */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                            {isAccepted ? (
                                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                                    <CheckCircle2 size={13} className="text-emerald-600" />
                                    <span>Offer Accepted (€ {totalQuotationAmount.toLocaleString()})</span>
                                </div>
                            ) : isDeclined ? (
                                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-semibold text-xs py-1.5 px-3 rounded-[4px] flex items-center justify-center gap-1.5">
                                    <XCircle size={13} className="text-rose-600" />
                                    <span>Offer Declined</span>
                                </div>
                            ) : canAccept ? (
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            disabled={isAccepting}
                                            onClick={async () => {
                                                setIsAccepting(true);
                                                try {
                                                    await handleAcceptOffer(msg);
                                                } finally {
                                                    setTimeout(() => setIsAccepting(false), 800);
                                                }
                                            }}
                                            className="flex-1 h-7.5 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
                                        >
                                            {isAccepting ? (
                                                <>
                                                    <Loader2 size={12} className="animate-spin text-white shrink-0" />
                                                    <span>Processing...</span>
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
                                                const btn = document.querySelector('button[title*="Revise"], button[title*="Counter"], button[title*="Propose"]') as HTMLButtonElement;
                                                if (btn) btn.click();
                                            }}
                                            className="flex-1 h-7.5 rounded-[4px] bg-[#FF6A00] hover:bg-[#e65f00] text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                                        >
                                            Revise Offer
                                        </Button>
                                    </div>
                                    <button type="button" onClick={() => setShowDeclineModal(true)} className="w-full text-center text-[10.5px] font-medium text-slate-400 hover:text-rose-600 py-0.5 transition-colors cursor-pointer">
                                        Decline this request
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded-[4px] px-2.5 py-1.5 text-center flex items-center justify-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                                    <Clock size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                                    <span>Waiting for Customer Response</span>
                                </div>
                            )}
                        </div>

                        {/* Floating Three-Dot Button on Hover */}
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 ${isSentByMe ? 'right-full mr-2' : 'left-full ml-2'} transition-opacity duration-150 z-30 ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
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
                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600'
                                        : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700'
                                    }`}
                                title="More options"
                                aria-label="More options"
                            >
                                <MoreVertical size={13} />
                            </button>

                            {/* Popover Dropdown Menu */}
                            {isMenuOpen && (
                                <div className={`absolute ${isSentByMe ? 'right-0' : 'left-0'} bottom-full mb-1.5 w-40 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-lg p-1 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 text-[12px] font-medium font-sans`}>
                                    <button
                                        type="button"
                                        onClick={handleCopyDetails}
                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                    >
                                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-500 dark:text-slate-400" />}
                                        <span>{copied ? "Copied!" : "Copy Details"}</span>
                                    </button>

                                    {handleTogglePinMessage && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleTogglePinMessage(msg.id);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                        >
                                            <Pin size={13} className={msg.isPinned ? "text-amber-500 fill-amber-500" : "text-slate-500 dark:text-slate-400"} />
                                            <span>{msg.isPinned ? "Unpin from Top" : "Pin to Top"}</span>
                                        </button>
                                    )}

                                    {handleDeleteMessage && (
                                        <>
                                            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleDeleteMessage(msg.id);
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

            <DeclineOfferModal isOpen={showDeclineModal} onClose={() => setShowDeclineModal(false)} offerAmount={initialOffer} currency="€" onConfirm={(reason) => handleRejectOffer(msg, reason)} />
        </div>
    );
};

export default QuoteRequestBubbleCard;
