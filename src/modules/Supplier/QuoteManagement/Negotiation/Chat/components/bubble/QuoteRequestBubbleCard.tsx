import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CheckCircle2, Loader2, ChevronDown, Clock, Copy, MoreVertical, Pin, Trash2, XCircle, Tag, ReceiptText, Building2, ShieldCheck, ArrowRight, Truck } from "lucide-react";
import Button from "@/components/ui/button";
import { DeclineOfferModal } from "@/modules/Customer/QuoteManagement/Negotiation/Chat/components/DeclineOfferModal";
import { NegotiationItem } from "../../../types";
import { ChatMessage } from "../../types";
import { QuoteRequestCardDetails } from "./QuoteRequestCardDetails";
import { getServiceIcon } from "@/modules/Customer/QuoteManagement/Negotiation/Actions/components/CounterOfferModal";

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
    const distanceStr = activeNegotiation.distance || "520 km";
    const initialOffer = Number(msg.newTotal || activeNegotiation.originalAmount || Number(String(activeNegotiation.budget || "").replace(/[^0-9.]/g, "")) || 3986);
    const isAccepted = msg.status === "accepted" || (activeNegotiation as any)?.status === "Accepted";
    const isDeclined = msg.status === "rejected" || (msg.status as string) === "declined" || (activeNegotiation as any)?.status === "Offer Declined" || (activeNegotiation as any)?.status === "rejected";
    const isSuperseded = msg.status === "superseded" || (msg as any)?.is_superseded === true;

    const pickupDate = activeNegotiation.pickupDate || "Flexible / Today";
    const deliveryDate = activeNegotiation.deliveryDate || "Standard Delivery";
    const palletType = activeNegotiation.palletType || "Standard Euro Pallet";
    const vehicleType = activeNegotiation.vehicleType || "Curtainsider 13.6m";
    const notesText = activeNegotiation.notes || "GPS live tracking, tail-lift vehicle & loading assistance included.";

    // Action permissions: In supplier view, this bubble represents the supplier's initial quote proposal
    const isSentByMe = Boolean(
        (msg as any).is_my_offer !== undefined ? (msg as any).is_my_offer :
            (msg as any).is_me !== undefined ? (msg as any).is_me :
                (msg as any).isSent !== undefined ? (msg as any).isSent :
                    true
    );
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
        if ((msg as any).base_amount !== undefined && (msg as any).base_amount !== null && Number((msg as any).base_amount) > 0) {
            return Number((msg as any).base_amount);
        }
        if (activeNegotiation.baseFreight !== undefined && activeNegotiation.baseFreight !== null && Number(activeNegotiation.baseFreight) > 0) {
            return Number(activeNegotiation.baseFreight);
        }
        if ((activeNegotiation as any)?.raw?.base_amount_raw) {
            return Number((activeNegotiation as any).raw.base_amount_raw);
        }
        if (totalExtras > 0 && initialOffer > totalExtras) {
            return initialOffer - totalExtras;
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
        <div className="flex justify-center my-2 font-sans group relative items-center">
            <div className="relative w-full max-w-[390px]">
                <div
                    id={`msg-bubble-${msg.id}`}
                    className={`bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[6px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans transition-all duration-300 ${
                        highlightedMsgId === msg.id ? 'ring-2 ring-[#FF4A1F] ring-offset-2' : ''
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                                <Tag className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                                    {canAccept ? "Counter Offer Received" : "Quote Request Details"}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{msg.time || "Just now"}</p>
                            </div>
                        </div>

                        <span className="text-[10px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/50 shrink-0">
                            #{quoteNum}
                        </span>
                    </div>

                    {/* Subtitle / Context description */}
                    <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-normal">
                        {canAccept ? (
                            <>
                                <strong className="text-slate-800 dark:text-slate-100 font-semibold">{customerName}</strong> has sent a counter offer for this shipment.
                            </>
                        ) : (
                            <>
                                Quote request details for <strong className="text-slate-800 dark:text-slate-100 font-semibold">{customerName}</strong>.
                            </>
                        )}
                    </p>

                    {/* Route & Distance */}
                    <div className="pt-1.5 flex items-center justify-between text-[11.5px]">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate min-w-0">
                            {pickupLoc} → {deliveryLoc}
                        </div>
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium shrink-0 ml-2">
                            {distanceStr}
                        </span>
                    </div>

                    {/* Compact Payment Breakdown Card */}
                    <div className="rounded bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-2 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                                <ReceiptText size={11} className="text-[#FF4A1F]" /> Payment Breakdown
                            </span>
                            <span className="text-[10px] text-slate-400">Currency: €</span>
                        </div>

                        {/* Itemized Line Items */}
                        <div className="py-0.5 space-y-0.5 text-[11px]">
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                <span>Base Freight Rate</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    € {basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>

                            {extraList.length > 0 && (
                                <div className="space-y-0.5 pt-0.5 border-t border-dashed border-slate-200/60 dark:border-slate-700/60">
                                    {extraList.map((ext: any, idx: number) => {
                                        const ExtIcon = getServiceIcon(ext.customName || ext.custom_name || ext.type || ext.label || 'Extra Fee');
                                        const label = ext.customName || ext.custom_name || ext.label || ext.type || 'Additional Fee';
                                        return (
                                            <div key={idx} className="flex items-center justify-between text-[10.5px] text-slate-600 dark:text-slate-400 pl-1">
                                                <span className="flex items-center gap-1 truncate max-w-[210px]" title={label}>
                                                    <ExtIcon size={10.5} className="text-[#FF4A1F] shrink-0" />
                                                    <span className="truncate">{label}</span>
                                                </span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300 shrink-0">
                                                    +€ {Number(ext.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Total Offer Row */}
                        <div className="pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between bg-orange-50/70 dark:bg-orange-950/35 -mx-2 -mb-2 px-2.5 py-1.5 rounded-b">
                            <span className="font-bold text-slate-900 dark:text-white text-[11.5px] leading-tight">
                                {canAccept ? "Counter Offer Rate" : "Total Offer Rate"}
                            </span>
                            <span className="text-sm sm:text-base font-black text-[#FF4A1F]">
                                € {totalQuotationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Cargo Specs & Requirements preview */}
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                        <div className="truncate min-w-0">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Cargo: </span>
                            <span>{palletType} • {vehicleType}</span>
                        </div>
                        {!isDetailsOpen && (
                            <button
                                type="button"
                                onClick={() => setIsDetailsOpen(true)}
                                className="font-bold text-[11px] text-[#00a884] hover:underline cursor-pointer shrink-0 ml-1.5"
                            >
                                Details
                            </button>
                        )}
                    </div>

                    {/* Expandable Details */}
                    {isDetailsOpen && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200/70 dark:border-slate-700/70 space-y-1.5 text-[11px]">
                            <QuoteRequestCardDetails
                                isOpen={true}
                                pickupDate={pickupDate}
                                deliveryDate={deliveryDate}
                                palletType={palletType}
                                vehicleType={vehicleType}
                                notes={notesText}
                            />
                            <div className="flex justify-end pt-0.5">
                                <button
                                    type="button"
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="inline-flex items-center gap-1 font-bold text-[10.5px] text-[#00a884] hover:underline cursor-pointer"
                                >
                                    <span>Read less</span>
                                    <ChevronDown size={11} className="rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Status & Actions */}
                    {isSuperseded ? (
                        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded px-2.5 py-1.5 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                            <Tag size={12} className="text-slate-400" />
                            <span>Initial Quote Superseded by Counter Offer</span>
                        </div>
                    ) : isAccepted ? (
                        <div className="space-y-1.5 pt-0.5">
                            {Boolean(activeNegotiation.hasOrder || activeNegotiation.isPaid || (activeNegotiation.raw as any)?.has_order || (activeNegotiation.raw as any)?.is_paid) ? (
                                Boolean((activeNegotiation.raw as any)?.invoice?.invoice_type === 'pay_later' || (activeNegotiation as any)?.notes?.toLowerCase().includes('pay later')) ? (
                                    <div className="flex items-center justify-between p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 rounded-[5px] text-[11px] font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 size={13.5} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                            <span>Pay Later (Net-30 Authorized)</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/supplier/orders/active-jobs')}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline text-[10.5px] font-bold cursor-pointer inline-flex items-center gap-0.5"
                                        >
                                            <span>Active Jobs</span>
                                            <ArrowRight size={10} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 rounded-[5px] text-[11px] font-semibold">
                                        <div className="flex items-center gap-1.5">
                                            <ShieldCheck size={13.5} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                            <span>Paid (100% in Escrow)</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/supplier/orders/active-jobs')}
                                            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 underline text-[10.5px] font-bold cursor-pointer inline-flex items-center gap-0.5"
                                        >
                                            <span>Active Jobs</span>
                                            <ArrowRight size={10} />
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 rounded text-[11.5px] font-semibold">
                                    <CheckCircle2 size={13} className="text-emerald-600" />
                                    <span>Offer Accepted</span>
                                </div>
                            )}
                        </div>
                    ) : isDeclined ? (
                        <div className="flex items-center justify-center gap-1.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 rounded text-[11.5px] font-semibold">
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
                                    className="flex-1 h-7.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 shadow-2xs disabled:opacity-75 disabled:cursor-not-allowed"
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
                                <Button type="button" onClick={() => { (document.querySelector('button[title*="Counter"]') as HTMLButtonElement)?.click(); }} className="flex-1 h-7.5 rounded bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1">
                                    Counter Offer
                                </Button>
                            </div>
                            <button type="button" onClick={() => setShowDeclineModal(true)} className="w-full text-center text-[10.5px] font-medium text-slate-400 hover:text-rose-600 py-0.5 transition-colors cursor-pointer">
                                Decline this request
                            </button>
                        </div>
                    ) : (
                        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded px-2.5 py-1.5 text-center flex items-center justify-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                            <Clock size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Waiting for Customer Response</span>
                        </div>
                    )}
                </div>

                {/* Floating Three-Dot Button on Hover */}
                <div
                    className={`absolute top-1/2 -translate-y-1/2 left-full ml-2 transition-opacity duration-150 z-30 ${
                        isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    ref={menuRef}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-colors cursor-pointer border shadow-2xs ${
                            isMenuOpen
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
                        <div className="absolute left-0 bottom-full mb-1.5 w-40 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-lg p-1 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 text-[12px] font-medium font-sans">
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

            <DeclineOfferModal isOpen={showDeclineModal} onClose={() => setShowDeclineModal(false)} offerAmount={initialOffer} currency="€" onConfirm={(reason) => handleRejectOffer(msg, reason)} />
        </div>
    );
};
