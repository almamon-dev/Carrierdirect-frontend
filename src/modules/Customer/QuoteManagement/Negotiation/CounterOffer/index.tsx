import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptId } from '@/lib/encryption';
import Button from '@/components/ui/button';
import { Check, CheckCircle2, ChevronDown, Clock, Copy, MoreVertical, Pin, Tag, Trash2, XCircle, Loader2, ArrowRight, CreditCard, Eye, Truck, HelpCircle } from 'lucide-react';
import { DeclineOfferModal } from '../Chat/components/DeclineOfferModal';
import { QuotePaymentInstructionModal } from '../Chat/components/QuotePaymentInstructionModal';

export interface CounterOfferMessageProps {
    msg: any;
    activeChat?: any;
    activeNegotiation?: any;
    onAccept?: (msg: any) => void;
    onReject?: (msg: any, reason?: string) => void;
    onTogglePin?: () => void;
    onDelete?: () => void;
}

export default function CounterOfferMessage({

    msg,
    activeChat,
    activeNegotiation,
    onAccept,
    onReject,
    onTogglePin,
    onDelete,
}: CounterOfferMessageProps) {
    const navigate = useNavigate();
    const [isAccepting, setIsAccepting] = useState(false);
    const [localStatus, setLocalStatus] = useState<'pending' | 'accepted' | 'rejected' | null>(null);
    const [localReason, setLocalReason] = useState<string>('');
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [showInstructionModal, setShowInstructionModal] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const status = localStatus || msg.status || 'pending';
    const isSentByMe = Boolean(
        msg.is_my_offer !== undefined ? msg.is_my_offer :
            msg.is_me !== undefined ? msg.is_me :
                msg.isSent !== undefined ? msg.isSent :
                    (msg.title && String(msg.title).toLowerCase().includes('submitted'))
    );
    const currency = msg.currency || '€';

    const activeData = activeChat || activeNegotiation || {};
    const rawData = activeData.raw || {};

    const otherPartyName =
        msg.sender ||
        activeData.customer ||
        activeData.carrier ||
        activeData.company ||
        activeData.name ||
        (isSentByMe ? 'Recipient' : 'Supplier');

    const quoteNum =
        msg.quoteNo ||
        activeData.quoteNo ||
        activeData.quoteId ||
        activeData.id ||
        'QT-0001';

    const pickupLoc =
        activeData.origin ||
        activeData.pickup ||
        rawData.origin ||
        rawData.pickup_location ||
        'Pickup Location';

    const deliveryLoc =
        activeData.destination ||
        activeData.delivery ||
        rawData.destination ||
        rawData.delivery_location ||
        'Delivery Destination';

    const distanceStr =
        activeData.distance ||
        rawData.distance ||
        '520 km';

    const pickupDate =
        activeData.pickupDate ||
        rawData.pickup_date ||
        'Flexible / Today';

    const deliveryDate =
        activeData.deliveryDate ||
        rawData.delivery_date ||
        'Standard Delivery';

    const palletType =
        activeData.palletType ||
        rawData.pallet_type ||
        'Standard Euro Pallet';

    const vehicleType =
        activeData.vehicleType ||
        rawData.vehicle_type ||
        'Curtainsider 13.6m';

    const notesText =
        msg.notes ||
        activeData.notes ||
        rawData.notes ||
        (msg.text && !String(msg.text).toLowerCase().includes('submitted a counter offer') ? msg.text : '') ||
        'GPS live tracking & loading assistance included.';

    const prevPrice =
        msg.previousTotal ? Number(msg.previousTotal) :
            (msg.previous_amount ? Number(msg.previous_amount) :
                (msg.amount ? Number(msg.amount) :
                    (activeData.originalAmount || activeData.currentPrice || (activeData.budget ? Number(String(activeData.budget).replace(/[^0-9.]/g, '')) : 45000))));

    const proposedPrice =
        msg.newTotal ? Number(msg.newTotal) :
            (msg.proposed_amount ? Number(msg.proposed_amount) : 40000);

    const isSuperseded = status === 'superseded' || msg.is_superseded === true;
    const isWithdrawn = status === 'withdrawn';
    const isAccepted = status === 'accepted' || (activeData as any)?.status === 'Accepted';
    const isDeclined = status === 'rejected' || status === 'declined' || (activeData as any)?.status === 'Offer Declined' || (activeData as any)?.status === 'rejected';
    const isPending = status === 'pending' && !isSuperseded && !isWithdrawn && !isAccepted && !isDeclined;
    const canAccept = !isSentByMe && isPending;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleCopyDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        const copySummary = `Counter Offer #${quoteNum}
Route: ${pickupLoc} → ${deliveryLoc} (${distanceStr})
Proposed Price: ${currency} ${proposedPrice.toLocaleString()}
Previous Offer: ${currency} ${prevPrice.toLocaleString()}
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

    const handleConfirmAccept = async () => {
        setIsAccepting(true);
        try {
            setLocalStatus('accepted');
            if (onAccept) await onAccept(msg);
        } finally {
            setTimeout(() => setIsAccepting(false), 1000);
        }
    };

    const handleConfirmDecline = (reason: string) => {
        setLocalStatus('rejected');
        setLocalReason(reason);
        setShowDeclineModal(false);
        if (onReject) onReject(msg, reason);
    };

    return (
        <div className="flex justify-center my-2 font-sans group relative items-center">
            <div className="relative w-full max-w-[390px]">
                <div
                    id={`msg-bubble-${msg.id}`}
                    className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[6px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans transition-all duration-300"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                                <Tag className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                                    {isSentByMe ? 'Counter Offer Details' : 'Counter Offer Received'}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{msg.time || 'Just now'}</p>
                            </div>
                        </div>

                        <span className="text-[10px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/50 shrink-0">
                            #{quoteNum}
                        </span>
                    </div>

                    {/* Subtitle / Context description */}
                    <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-normal">
                        {isSentByMe ? (
                            <>
                                Counter offer details submitted to <strong className="text-slate-800 dark:text-slate-100 font-semibold">{otherPartyName}</strong>.
                            </>
                        ) : (
                            <>
                                <strong className="text-slate-800 dark:text-slate-100 font-semibold">{otherPartyName}</strong> has sent a counter offer for this shipment.
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

                    {/* Price Comparison Box */}
                    <div className="bg-slate-50/90 dark:bg-slate-800/50 rounded p-2.5 flex items-center justify-between gap-3 border border-slate-200/80 dark:border-slate-700/80">
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Previous</span>
                            <span className="text-xs font-bold text-slate-400 line-through">
                                {currency} {prevPrice.toLocaleString()}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-[#FF4A1F] font-bold block">Counter Offer</span>
                            <span className="text-[15px] font-black text-[#FF4A1F]">
                                {currency} {proposedPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Cargo & Expandable Details */}
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

                    {isDetailsOpen && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200/70 dark:border-slate-700/70 space-y-1.5 text-[11px]">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Pickup Date</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block">{pickupDate}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block">Delivery Date</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block">{deliveryDate}</span>
                                </div>
                            </div>
                            {notesText && (
                                <div className="pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                                    <span className="text-[10px] text-slate-400 block">Notes</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">{notesText}</p>
                                </div>
                            )}
                            <div className="flex justify-end pt-0.5">
                                <button
                                    type="button"
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="inline-flex items-center gap-1 font-bold text-[10.5px] text-[#00a884] hover:underline cursor-pointer"
                                >
                                    <span>Hide details</span>
                                    <ChevronDown size={11} className="rotate-180" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Status & Actions */}
                    {isSuperseded ? (
                        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded px-2.5 py-1.5 text-center text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                            <Tag size={12} className="text-slate-400" />
                            <span>Offer Superseded by Newer Negotiation</span>
                        </div>
                    ) : isAccepted ? (
                        <div className="space-y-1.5 pt-1 font-sans">
                            {/* Top Row: Side-by-side Accepted Status + Checkout Button */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 rounded-[5px] text-xs font-semibold">
                                    <CheckCircle2 size={13.5} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>Accepted</span>
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => {
                                        const targetQuoteId = activeChat?.raw?.quote_id || activeChat?.raw?.id || (activeChat as any)?.quoteId || activeChat?.id || msg?.id || 1;
                                        navigate(`/customer/checkout/${encryptId(targetQuoteId)}`, {
                                            state: { quote: activeChat?.raw || activeChat }
                                        });
                                    }}
                                    className="flex-1 h-8 rounded-[5px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs"
                                >
                                    <CreditCard size={13} className="shrink-0" />
                                    <span>Checkout & Pay</span>
                                    <ArrowRight size={12} className="shrink-0" />
                                </Button>
                            </div>

                            {/* Bottom Row: Clean Hyperlinks */}
                            <div className="flex items-center justify-center gap-3 pt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const targetQuoteId = activeChat?.raw?.quote_id || activeChat?.raw?.id || (activeChat as any)?.quoteId || activeChat?.id || msg?.id || 1;
                                        navigate(`/customer/quotes/received/view/${encryptId(targetQuoteId)}`);
                                    }}
                                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors cursor-pointer"
                                >
                                    <Eye size={12} />
                                    <span className="underline-offset-2 hover:underline">Details</span>
                                </button>

                                <span className="text-slate-300 dark:text-slate-700">•</span>

                                <button
                                    type="button"
                                    onClick={() => navigate("/customer/orders")}
                                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors cursor-pointer"
                                >
                                    <Truck size={12} />
                                    <span className="underline-offset-2 hover:underline">Track</span>
                                </button>

                                <span className="text-slate-300 dark:text-slate-700">•</span>

                                <button
                                    type="button"
                                    onClick={() => setShowInstructionModal(true)}
                                    className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors cursor-pointer"
                                >
                                    <HelpCircle size={12} />
                                    <span className="underline-offset-2 hover:underline">Payment Info</span>
                                </button>
                            </div>
                        </div>
                    ) : isDeclined ? (
                        <div className="flex flex-col items-center justify-center py-1.5 px-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 rounded text-[11.5px] font-semibold">
                            <div className="flex items-center gap-1.5">
                                <XCircle size={13} className="text-rose-600" />
                                <span>Offer Declined</span>
                            </div>
                            {(msg.declineReason || localReason) && (
                                <p className="text-[10.5px] text-rose-600/80 dark:text-rose-400/80 font-normal mt-0.5 text-center">
                                    Reason: {msg.declineReason || localReason}
                                </p>
                            )}
                        </div>
                    ) : canAccept ? (
                        <div className="space-y-1.5 pt-1">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    disabled={isAccepting}
                                    onClick={handleConfirmAccept}
                                    className="flex-1 h-7.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1 disabled:opacity-60"
                                >
                                    {isAccepting ? (
                                        <>
                                            <Loader2 size={12} className="animate-spin text-white" />
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
                                    onClick={() => { (document.querySelector('button[title*="Counter"], button[title*="Revise"]') as HTMLButtonElement)?.click(); }}
                                    className="flex-1 h-7.5 rounded bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-[11.5px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                                >
                                    Counter Offer
                                </Button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDeclineModal(true)}
                                className="w-full text-center text-[10.5px] font-medium text-slate-400 hover:text-rose-600 py-0.5 transition-colors cursor-pointer"
                            >
                                Decline this request
                            </button>
                        </div>
                    ) : (
                        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 rounded px-2.5 py-1.5 text-center flex items-center justify-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                            <Clock size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>Waiting for {otherPartyName} Response</span>
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

            <DeclineOfferModal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                offerAmount={proposedPrice}
                currency={currency}
                onConfirm={handleConfirmDecline}
            />

            <QuotePaymentInstructionModal
                isOpen={showInstructionModal}
                onClose={() => setShowInstructionModal(false)}
                quoteId={activeChat?.raw?.quote_id || activeChat?.raw?.id || (activeChat as any)?.quoteId || activeChat?.id || msg?.id || 1}
                quoteAmount={proposedPrice || prevPrice || 45000}
                supplierName={otherPartyName || "Carrier Partner"}
                quoteData={activeChat?.raw || activeChat}
            />
        </div>
    );
}
