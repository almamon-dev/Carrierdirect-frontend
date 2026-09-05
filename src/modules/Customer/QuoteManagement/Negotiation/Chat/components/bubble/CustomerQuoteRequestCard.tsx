import React, { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
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
}

export const CustomerQuoteRequestCard: React.FC<CustomerQuoteRequestCardProps> = ({
    msg,
    activeChat,
    spacingClass,
    onAcceptOffer,
    onRejectOffer,
}) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    const customerName = msg.sender || activeChat?.raw?.customer || 'Customer';
    const quoteNum = msg.quoteNo || activeChat?.quoteNo || 'QT-0001';
    const pickupLoc = activeChat?.origin || 'Pickup Location';
    const deliveryLoc = activeChat?.destination || 'Delivery Destination';
    const dist = activeChat?.distance || '450 km';
    const vehicle = activeChat?.vehicleType || 'Curtainsider 13.6m';
    const initialOffer = Number(msg.newTotal || activeChat?.currentPrice || 0);

    const pickupDate = (activeChat as any)?.pickupDate || activeChat?.raw?.pickup_date || 'Flexible / Today';
    const deliveryDate = (activeChat as any)?.deliveryDate || activeChat?.raw?.delivery_date || 'Standard Delivery';
    const palletType = (activeChat as any)?.palletType || activeChat?.raw?.pallet_type || 'Standard Euro Pallet';
    const transitTime = activeChat?.raw?.transitTime || activeChat?.raw?.estimated_time || '1 - 2 Business Days';
    const notes = (activeChat as any)?.notes || activeChat?.raw?.notes || activeChat?.raw?.message_snippet || '';

    return (
        <div className={`max-w-md mx-auto my-3 bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-[5px] p-4 shadow-xs text-slate-800 dark:text-slate-200 font-sans ${spacingClass}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-[5px] bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                        <FileText size={16} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">Quote Details</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{quoteNum} • {customerName}</p>
                    </div>
                </div>
                <span className="text-[11px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-[5px] border border-orange-100 dark:border-orange-900/40">
                    {vehicle}
                </span>
            </div>

            <div className="py-3 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-[5px] border border-slate-100 dark:border-slate-800">
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pickup</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{pickupLoc}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Delivery</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{deliveryLoc}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between px-1">
                    <span className="text-slate-400 text-[11px]">Distance: <strong>{dist}</strong></span>
                    <span className="text-slate-400 text-[11px]">Est. Transit: <strong>{transitTime}</strong></span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Initial Quote Rate</span>
                    <span className="text-base font-black text-[#FF4A1F]">€ {initialOffer.toLocaleString()}</span>
                </div>

                {isDetailsOpen && (
                    <CustomerQuoteRequestCardDetails
                        pickupDate={pickupDate}
                        deliveryDate={deliveryDate}
                        palletType={palletType}
                        vehicle={vehicle}
                        notes={notes}
                    />
                )}

                <button
                    type="button"
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#FF4A1F] dark:text-slate-400 transition-colors py-0.5 cursor-pointer"
                >
                    <span>{isDetailsOpen ? 'Show less' : 'Read more / View details'}</span>
                    <ChevronDown size={13} className={`transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <CustomerQuoteRequestCardActions
                isAccepted={msg.status === 'accepted'}
                isDeclined={msg.status === 'rejected'}
                msg={msg}
                onAcceptOffer={onAcceptOffer}
                onShowDeclineModal={() => setShowDeclineModal(true)}
            />

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
