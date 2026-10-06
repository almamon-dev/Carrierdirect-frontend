import React, { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, ChevronRight, MoreVertical, Copy, Pin, Trash2, Check, MapPin, Package, Landmark, Receipt, Truck, RefreshCw } from 'lucide-react';
import { DeclineOfferModal } from '../DeclineOfferModal';
import { CustomerChatItem, CustomerChatMessage } from '../../types';
import { CustomerQuoteRequestCardDetails } from './CustomerQuoteRequestCardDetails';
import { CustomerQuoteRequestCardActions } from './CustomerQuoteRequestCardActions';
import { QuoteActivityBubble } from './QuoteActivityBubble';

interface CustomerQuoteRequestCardProps {
    msg: CustomerChatMessage;
    activeChat: CustomerChatItem | null;
    spacingClass: string;
    onAcceptOffer: (msg: CustomerChatMessage) => void;
    onRejectOffer: (msg: CustomerChatMessage, reason?: string) => void;
    onOpenCounterOffer?: () => void;
    onTogglePinMessage?: (id: string | number) => void;
    onDeleteMessage?: (id: string | number) => void;
}

export const CustomerQuoteRequestCard: React.FC<CustomerQuoteRequestCardProps> = ({
    msg,
    activeChat,
    spacingClass,
    onAcceptOffer,
    onRejectOffer,
    onOpenCounterOffer,
    onTogglePinMessage,
    onDeleteMessage,
}) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const customerName = msg.sender || activeChat?.raw?.customer || 'Customer';
    const quoteNum = msg.quoteNo || activeChat?.quoteNo || 'QT-0001';
    const pickupLoc = activeChat?.origin || 'Pickup Location';
    const deliveryLoc = activeChat?.destination || 'Delivery Destination';
    const dist = activeChat?.distance || '—';
    const vehicle = activeChat?.vehicleType || 'Covered Van (20ft)';
    const initialOffer = Number(msg.newTotal || activeChat?.currentPrice || 0);
    const extraCharges = (activeChat?.extraCharges && activeChat.extraCharges.length > 0)
        ? activeChat.extraCharges
        : (activeChat?.raw?.extra_charges || activeChat?.raw?.extraCharges || []);
    const totalExtras = extraCharges.reduce((acc: number, c: any) => acc + Number(c.amount || 0), 0);
    const rawTotal = Number(msg.newTotal || activeChat?.currentPrice || activeChat?.raw?.amount || 0);
    const rawBase = activeChat?.baseFreightAmount ?? (
        activeChat?.raw?.base_amount_raw ??
        (activeChat?.raw?.base_amount ? parseFloat(String(activeChat.raw.base_amount).replace(/[^0-9.]/g, "")) : null)
    );

    let baseFreightRate = 0;
    let totalQuotationAmount = 0;

    if (totalExtras > 0) {
        if (rawBase !== null && rawBase > 0) {
            baseFreightRate = rawBase;
            if (rawTotal > rawBase) {
                totalQuotationAmount = rawTotal;
            } else {
                totalQuotationAmount = rawBase + totalExtras;
            }
        } else {
            if (rawTotal > totalExtras) {
                baseFreightRate = rawTotal - totalExtras;
                totalQuotationAmount = rawTotal;
            } else {
                baseFreightRate = rawTotal;
                totalQuotationAmount = rawTotal + totalExtras;
            }
        }
    } else {
        baseFreightRate = rawTotal;
        totalQuotationAmount = rawTotal;
    }

    const pickupDate = (activeChat as any)?.pickupDate || activeChat?.raw?.pickup_date || 'Flexible / Today';
    const deliveryDate = (activeChat as any)?.deliveryDate || activeChat?.raw?.delivery_date || 'Standard Delivery';
    const palletType = (activeChat as any)?.palletType || activeChat?.raw?.pallet_type || 'Standard Euro Pallet';
    const transitTime = activeChat?.raw?.transitTime || activeChat?.raw?.estimated_time || '1 - 2 Business Days';
    const notes = (activeChat as any)?.notes || activeChat?.raw?.notes || activeChat?.raw?.message_snippet || '';

    const supplierDisplayName = activeChat?.carrier || activeChat?.company || activeChat?.name || 'Supplier Co 1';
    const avatarInitials = supplierDisplayName
        .split(' ')
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'S1';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

    const handleCopyDetails = () => {
        const textToCopy = `Quote Request ${quoteNum}
Pickup: ${pickupLoc}
Delivery: ${deliveryLoc}
Distance: ${dist}
Est. Transit: ${transitTime}
Rate: € ${initialOffer.toLocaleString()}
Cargo: ${palletType} • ${vehicle}
Notes: ${notes}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setIsMenuOpen(false);
        }, 1500);
    };

    const isSentByMe = Boolean(
        (msg as any).is_my_offer !== undefined ? (msg as any).is_my_offer :
            (msg as any).is_me !== undefined ? (msg as any).is_me :
                (msg as any).isSent !== undefined ? (msg as any).isSent :
                    msg.type === 'sent' ? true :
                    msg.type === 'received' ? false :
                    true
    );

    return (
        <div className={`space-y-2 w-full ${spacingClass}`}>
            {/* 1. Green Activity Speech Bubble (Right aligned if sent by customer, Left aligned with avatar if received) */}
            {isSentByMe ? (
                <div className="flex justify-end w-full">
                    <div className="w-[440px] sm:w-[460px] max-w-full">
                        <QuoteActivityBubble
                            type="quote_request"
                            actorName={supplierDisplayName}
                            quoteNumber={quoteNum}
                            origin={pickupLoc}
                            destination={deliveryLoc}
                            distance={dist}
                            time={msg.time || '9:15 PM'}
                            isSent={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex gap-2.5 items-start justify-start group relative w-full">
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0 mt-0.5 shadow-2xs select-none overflow-hidden">
                        {activeChat?.avatar && (activeChat.avatar.startsWith('http') || activeChat.avatar.startsWith('/storage') || activeChat.avatar.startsWith('data:') || activeChat.avatar.includes('.')) ? (
                            <img src={activeChat.avatar} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                            avatarInitials
                        )}
                    </div>

                    <div className="w-[440px] sm:w-[460px] max-w-full">
                        <QuoteActivityBubble
                            type="quote_request"
                            actorName={supplierDisplayName}
                            quoteNumber={quoteNum}
                            origin={pickupLoc}
                            destination={deliveryLoc}
                            distance={dist}
                            time={msg.time || '9:15 PM'}
                            isSent={false}
                        />
                    </div>
                </div>
            )}

            {/* 2. Quote Details Card - Aligned strictly with Card 1 */}
            <div className={`flex items-center ${isSentByMe ? 'justify-end' : 'justify-start pl-[42px]'} w-full my-1.5`}>
                <div className="relative w-[440px] sm:w-[460px] max-w-full group">
                    <div
                        id={`msg-bubble-${msg.id}`}
                        className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans"
                    >
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#FF6A00] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-900/40">
                                <RefreshCw className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">Quote Details</h3>
                                <p className="text-[10px] text-slate-400 font-medium truncate">{msg.time || "2:48 PM"}</p>
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
                            <span className="text-[10.5px] font-medium text-slate-400 shrink-0 ml-2">{dist}</span>
                        </div>

                        {/* Connecting Dotted Line */}
                        <div className="ml-[4px] pl-3.5 border-l-2 border-dotted border-slate-300 dark:border-slate-700 h-3.5 my-0.5" />

                        {/* Destination */}
                        <div className="flex items-center gap-2 min-w-0">
                            <MapPin size={13} className="text-[#2563EB] shrink-0" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{deliveryLoc}</span>
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-1.5 text-[11.5px]">
                        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                                <Package size={13} className="text-slate-400 shrink-0" />
                                <span>Base Freight Rate</span>
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                € {baseFreightRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>

                        {extraCharges.length > 0 && extraCharges.map((charge: any, idx: number) => {
                            const label = charge.custom_name || charge.customName || charge.label || charge.type || `Extra Charge #${idx + 1}`;
                            const isToll = label.toLowerCase().includes('toll');
                            const isCustoms = label.toLowerCase().includes('custom');
                            const IconComponent = isToll ? Landmark : isCustoms ? Receipt : Package;

                            return (
                                <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <IconComponent size={13} className="text-slate-400 shrink-0" />
                                        <span>{label}</span>
                                    </div>
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        € {Number(charge.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total Quotation Amount */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                        <span className="text-[12.5px] font-bold text-slate-900 dark:text-white">Total Quotation Amount</span>
                        <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                            € {totalQuotationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Cargo & Expandable Details */}
                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0 truncate">
                            <Truck size={13} className="text-slate-500 shrink-0" />
                            <span className="truncate">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Cargo: </span>
                                {palletType} • {vehicle}
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
                            <CustomerQuoteRequestCardDetails
                                pickupDate={pickupDate}
                                deliveryDate={deliveryDate}
                                palletType={palletType}
                                vehicle={vehicle}
                                notes={notes}
                            />
                        </div>
                    )}

                    <CustomerQuoteRequestCardActions
                        isAccepted={msg.status === 'accepted'}
                        isDeclined={msg.status === 'rejected'}
                        msg={msg}
                        activeChat={activeChat}
                        onAcceptOffer={onAcceptOffer}
                        onShowDeclineModal={() => setShowDeclineModal(true)}
                        onOpenCounterOffer={onOpenCounterOffer}
                    />

                    {/* Floating Three-Dot Button on Hover */}
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 ${
                            isSentByMe ? 'right-full mr-2' : 'left-full ml-2'
                        } transition-opacity duration-150 z-30 ${
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
                            className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center transition-colors cursor-pointer border shadow-2xs ${
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
                            <div className={`absolute ${isSentByMe ? 'right-0' : 'left-0'} bottom-full mb-1.5 w-40 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-lg p-1 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 text-[12px] font-medium font-sans`}>
                                <button
                                    type="button"
                                    onClick={handleCopyDetails}
                                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                >
                                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-500 dark:text-slate-400" />}
                                    <span>{copied ? 'Copied!' : 'Copy Details'}</span>
                                </button>

                                {onTogglePinMessage && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onTogglePinMessage(msg.id);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                                    >
                                        <Pin size={13} className={msg.isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500 dark:text-slate-400'} />
                                        <span>{msg.isPinned ? 'Unpin from Top' : 'Pin to Top'}</span>
                                    </button>
                                )}

                                {onDeleteMessage && (
                                    <>
                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onDeleteMessage(msg.id);
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

            <DeclineOfferModal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                offerAmount={initialOffer}
                currency="€"
                onConfirm={(reason) => onRejectOffer(msg, reason)}
            />
        </div>
    );
};

export default CustomerQuoteRequestCard;
