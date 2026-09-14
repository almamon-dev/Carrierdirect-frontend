import React, { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, MoreVertical, Copy, Pin, Trash2, Check, Tag } from 'lucide-react';
import { DeclineOfferModal } from '../DeclineOfferModal';
import { CustomerChatItem, CustomerChatMessage } from '../../types';
import { CustomerQuoteRequestCardDetails } from './CustomerQuoteRequestCardDetails';
import { CustomerQuoteRequestCardActions } from './CustomerQuoteRequestCardActions';

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
    const dist = activeChat?.distance || '450 km';
    const vehicle = activeChat?.vehicleType || 'Covered Van (20ft)';
    const initialOffer = Number(msg.newTotal || activeChat?.currentPrice || 0);
    const extraCharges = (activeChat?.extraCharges && activeChat.extraCharges.length > 0)
        ? activeChat.extraCharges
        : (activeChat?.raw?.extra_charges || activeChat?.raw?.extraCharges || []);
    const totalExtras = extraCharges.reduce((acc: number, c: any) => acc + Number(c.amount || 0), 0);
    const totalQuotationAmount = Number(msg.newTotal || activeChat?.currentPrice || activeChat?.raw?.amount || 0);
    const baseFreightRate = activeChat?.baseFreightAmount || (
        activeChat?.raw?.base_amount_raw ??
        (activeChat?.raw?.base_amount ? parseFloat(String(activeChat.raw.base_amount).replace(/[^0-9.]/g, "")) : (totalQuotationAmount > totalExtras && totalExtras > 0 ? totalQuotationAmount - totalExtras : totalQuotationAmount))
    );

    const pickupDate = (activeChat as any)?.pickupDate || activeChat?.raw?.pickup_date || 'Flexible / Today';
    const deliveryDate = (activeChat as any)?.deliveryDate || activeChat?.raw?.delivery_date || 'Standard Delivery';
    const palletType = (activeChat as any)?.palletType || activeChat?.raw?.pallet_type || 'Standard Euro Pallet';
    const transitTime = activeChat?.raw?.transitTime || activeChat?.raw?.estimated_time || '1 - 2 Business Days';
    const notes = (activeChat as any)?.notes || activeChat?.raw?.notes || activeChat?.raw?.message_snippet || '';

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

    return (
        <div className={`flex justify-center ${spacingClass} group relative`}>
            <div className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[6px] p-3.5 w-full max-w-[390px] shadow-2xs space-y-2.5 font-sans relative">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">Quote Details</h3>
                            <p className="text-[10px] text-slate-400 font-medium truncate">{activeChat?.carrier || activeChat?.company || customerName}</p>
                        </div>
                    </div>

                    <span className="text-[10px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/50 shrink-0">
                        #{quoteNum}
                    </span>
                </div>

                {/* Route & Distance */}
                <div className="pt-1.5 flex items-center justify-between text-[11.5px]">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate min-w-0">
                        {pickupLoc} → {deliveryLoc}
                    </div>
                    <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium shrink-0 ml-2">
                        {dist}
                    </span>
                </div>

                {/* Pricing Breakdown */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-[11.5px]">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Base Freight Price</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            € {baseFreightRate.toLocaleString()}
                        </span>
                    </div>

                    {extraCharges.length > 0 && extraCharges.map((charge: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between pl-2">
                            <span className="text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                                <span className="truncate">{charge.custom_name || charge.customName || charge.label || charge.type || `Extra Charge #${idx + 1}`}</span>
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                +€ {Number(charge.amount || 0).toLocaleString()}
                            </span>
                        </div>
                    ))}

                    <div className="pt-1.5 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Total Quotation Amount</span>
                        <span className="text-[14px] font-black text-[#FF4A1F]">
                            € {totalQuotationAmount.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Cargo & Expandable Details */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <div className="truncate min-w-0">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Cargo: </span>
                        <span>{palletType} • {vehicle}</span>
                    </div>
                    {!isDetailsOpen && (
                        <button
                            type="button"
                            onClick={() => setIsDetailsOpen(true)}
                            className="font-bold text-[11px] text-[#00a884] hover:underline cursor-pointer shrink-0 ml-1.5"
                        >
                            Read more
                        </button>
                    )}
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
                        <div className="flex justify-end">
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
