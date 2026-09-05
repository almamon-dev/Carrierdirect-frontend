import React, { useState } from 'react';
import { Check, CheckCircle2, ChevronDown, FileText, XCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { DeclineOfferModal } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/components/DeclineOfferModal';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';
import { QuoteRequestCardDetails } from './QuoteRequestCardDetails';

interface QuoteRequestBubbleCardProps {
    msg: ChatMessage;
    activeNegotiation: NegotiationItem;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any, reason?: string) => void;
}

export const QuoteRequestBubbleCard: React.FC<QuoteRequestBubbleCardProps> = ({
    msg,
    activeNegotiation,
    handleAcceptOffer,
    handleRejectOffer,
}) => {
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const customerName = msg.sender || activeNegotiation.customer || 'Customer';
    const quoteNum = activeNegotiation.quoteId || activeNegotiation.id || 'QT-0003';
    const pickupLoc = activeNegotiation.origin || activeNegotiation.pickup || 'Pickup Location';
    const deliveryLoc = activeNegotiation.destination || activeNegotiation.delivery || 'Delivery Destination';
    const distanceStr = activeNegotiation.distance || '520 km';
    const initialOffer = Number(msg.newTotal || activeNegotiation.originalAmount || Number(String(activeNegotiation.budget || '').replace(/[^0-9.]/g, '')) || 3986);
    const isAccepted = msg.status === 'accepted' || (activeNegotiation as any)?.status === 'Accepted';
    const isDeclined = msg.status === 'rejected' || (msg.status as string) === 'declined' || (activeNegotiation as any)?.status === 'Offer Declined' || (activeNegotiation as any)?.status === 'rejected';

    return (
        <div className="flex justify-center my-3 font-sans">
            <div className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 w-full max-w-[380px] mx-auto text-left shadow-xs space-y-3 font-sans">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <h3 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">Quote Request Received</h3>
                            <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">{msg.time}</p>
                        </div>
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/50">
                        #{quoteNum}
                    </span>
                </div>

                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-normal">
                    <strong className="text-slate-800 dark:text-slate-100 font-semibold">{customerName}</strong> has submitted a quote request for this shipment.
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <p className="text-[12px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{pickupLoc} → {deliveryLoc}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Distance: <span className="font-semibold text-slate-700 dark:text-slate-300">{distanceStr}</span>
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2 pb-0.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-300">Initial Offer</span>
                    <span className="text-base font-black text-[#FF4A1F]">€ {initialOffer.toLocaleString()}</span>
                </div>

                <QuoteRequestCardDetails
                    isOpen={isDetailsOpen}
                    pickupDate={activeNegotiation.pickupDate || 'Flexible / Today'}
                    deliveryDate={activeNegotiation.deliveryDate || 'Standard Delivery'}
                    palletType={activeNegotiation.palletType || 'Standard Euro Pallet'}
                    vehicleType={activeNegotiation.vehicleType || 'Curtainsider 13.6m'}
                    notes={activeNegotiation.notes}
                />

                <button
                    type="button"
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#FF4A1F] dark:text-slate-400 dark:hover:text-[#FF4A1F] transition-colors py-0.5 cursor-pointer select-none"
                >
                    <span>{isDetailsOpen ? 'Show less' : 'Read more / View details'}</span>
                    <ChevronDown size={13} className={`transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                </button>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Please review the shipment details and offer. You can accept the offer or start a negotiation if you’d like to discuss the price or requirements.
                </p>

                {isAccepted ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 rounded-[3px] text-xs font-semibold">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <span>Offer Accepted</span>
                    </div>
                ) : isDeclined ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 rounded-[3px] text-xs font-semibold">
                        <XCircle size={15} className="text-rose-600" />
                        <span>Offer Declined</span>
                    </div>
                ) : (
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                            <Button type="button" onClick={() => handleAcceptOffer(msg)} className="flex-1 h-8 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1">
                                <Check size={13} /> Accept Offer
                            </Button>
                            <Button type="button" onClick={() => { (document.querySelector('button[title*="Counter"]') as HTMLButtonElement)?.click(); }} className="flex-1 h-8 rounded-[3px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1">
                                Make Counter Offer
                            </Button>
                        </div>
                        <button type="button" onClick={() => setShowDeclineModal(true)} className="w-full text-center text-[11px] font-medium text-slate-400 hover:text-rose-600 py-1 transition-colors cursor-pointer">
                            Decline this request
                        </button>
                    </div>
                )}
            </div>

            <DeclineOfferModal isOpen={showDeclineModal} onClose={() => setShowDeclineModal(false)} offerAmount={initialOffer} currency="€" onConfirm={(reason) => handleRejectOffer(msg, reason)} />
        </div>
    );
};
