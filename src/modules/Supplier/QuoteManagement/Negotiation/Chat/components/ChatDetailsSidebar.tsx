import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';
import { BadgeCheck, CheckCircle2, ChevronDown, FileText, Phone, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { CustomerProfileModal } from './CustomerProfileModal';
import { NegotiationHistoryTimeline } from './NegotiationHistoryTimeline';
import { PricingBreakdownSection } from './PricingBreakdownSection';

interface ChatDetailsSidebarProps {
    activeNegotiation: NegotiationItem;
    negotiationStatusMap: Record<string | number, string>;
    currentPrice: number;
    liveOffers: Record<string | number, number>;
    showMobileDetails: boolean;
    setShowMobileDetails: (v: boolean) => void;
    chatMessages?: Record<string | number, ChatMessage[]>;
    onCallClick?: (type: 'audio' | 'video') => void;
}

export const ChatDetailsSidebar: React.FC<ChatDetailsSidebarProps> = ({
    activeNegotiation,
    negotiationStatusMap,
    currentPrice,
    liveOffers,
    showMobileDetails,
    setShowMobileDetails,
    chatMessages,
    onCallClick
}) => {
    const [openSections, setOpenSections] = useState({
        overview: true,
        logistics: false,
        pricing: false,
        history: false,
        documents: true
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const statusText = negotiationStatusMap[activeNegotiation.rawId] || activeNegotiation.status || 'Active Negotiation';
    const currency = (!activeNegotiation.currency || activeNegotiation.currency === '€') ? '€' : activeNegotiation.currency;
    const [showProfileModal, setShowProfileModal] = useState(false);

    const handleDocumentsClick = () => {
        setOpenSections(prev => ({ ...prev, documents: true }));
        setTimeout(() => {
            document.getElementById('sidebar-documents-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const currentMsgList = chatMessages?.[activeNegotiation.rawId] 
        || chatMessages?.[activeNegotiation.id] 
        || chatMessages?.[String(activeNegotiation.rawId)] 
        || chatMessages?.[String(activeNegotiation.id)] 
        || [];

    const messageAttachments = currentMsgList
        .flatMap(m => m.attachments || [])
        .map(att => ({ name: att.name, size: att.size, type: att.type, url: att.url }));
    const documents = [...(activeNegotiation.documents || []), ...messageAttachments];

    return (
        <div className={`xl:flex xl:w-[290px] 2xl:w-[320px] shrink-0 flex-col min-h-0 h-full bg-white overflow-y-auto border-l border-slate-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${showMobileDetails ? 'fixed inset-y-0 right-0 z-50 w-80 shadow-2xl flex bg-white' : 'hidden'
            }`}>
            {/* Header */}
            <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-slate-100 relative">
                {showMobileDetails && (
                    <button type="button" onClick={() => setShowMobileDetails(false)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded-full">
                        <X size={18} />
                    </button>
                )}
                <div className="relative mb-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-50 text-[#FF4A1F] border border-orange-200 flex items-center justify-center font-bold text-2xl shadow-2xs">
                        {activeNegotiation.customerAvatar ? (
                            <img src={activeNegotiation.customerAvatar} alt={activeNegotiation.customer} className="w-full h-full object-cover" />
                        ) : (
                            <span>{activeNegotiation.customer.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full z-10 shadow-xs" />
                </div>

                <div className="flex items-center gap-1 justify-center">
                    <h3 className="text-[14px] font-bold text-slate-800">{activeNegotiation.customer}</h3>
                    <span title="Verified Client"><BadgeCheck size={16} className="text-[#FF4A1F]" /></span>
                </div>
                <p className="text-[11px] font-semibold text-[#FF4A1F] mt-0.5">{activeNegotiation.quoteId}</p>

                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10.5px] font-bold shadow-2xs"><CheckCircle2 size={12} className="text-emerald-600" /> {statusText}</span>
                    <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 border border-slate-200/80 px-2 py-0.5 rounded-full text-[10.5px] font-semibold">★ {activeNegotiation.customerRating || 0.0}</span>
                </div>

                <div className="flex items-center gap-6 mt-4">
                    <div onClick={() => setShowProfileModal(true)} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors"><User size={15} /></div>
                        <span className="text-[10.5px] font-semibold text-slate-600">Profile</span>
                    </div>
                    <div onClick={handleDocumentsClick} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors"><FileText size={15} /></div>
                        <span className="text-[10.5px] font-semibold text-slate-600">Documents</span>
                    </div>
                    <div onClick={() => onCallClick?.('audio')} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors"><Phone size={15} /></div>
                        <span className="text-[10.5px] font-semibold text-slate-600">Call</span>
                    </div>
                </div>
            </div>

            {/* Accordion Sections */}
            <div className="flex flex-col divide-y divide-slate-100">
                {/* 1: Overview */}
                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('overview')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Quote Overview</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.overview ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.overview && (
                        <div className="px-4 pb-3 text-[12px] space-y-2">
                            <div className="flex justify-between"><span className="text-slate-500">Negotiation ID</span><span className="font-bold text-[#FF4A1F]">{activeNegotiation.id}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">RFQ Ref</span><span className="font-medium text-slate-800">{activeNegotiation.requestId || 'REQ-8820'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200/60">{statusText}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Cargo</span><span className="font-medium text-slate-800 text-right">{activeNegotiation.palletType || 'Euro Pallets (12 Units)'}</span></div>
                        </div>
                    )}
                </div>

                {/* 2: Logistics & Route */}
                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('logistics')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Logistics & Route</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.logistics && (
                        <div className="px-4 pb-3 text-[12px] space-y-2">
                            <div className="bg-slate-50 p-2.5 rounded border border-slate-200/70 space-y-1.5">
                                <div className="flex items-start gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" /><span className="font-semibold text-slate-800 leading-tight truncate">{activeNegotiation.pickup}</span></div>
                                <div className="border-l border-dashed border-slate-300 ml-1 pl-3 text-[10px] text-slate-400">{activeNegotiation.distance}</div>
                                <div className="flex items-start gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF4A1F] mt-1 shrink-0" /><span className="font-semibold text-slate-800 leading-tight truncate">{activeNegotiation.delivery}</span></div>
                            </div>
                            <div className="flex justify-between"><span className="text-slate-500">Vehicle</span><span className="font-medium text-slate-800">{activeNegotiation.vehicleType || 'Curtain Sider'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Pickup Date</span><span className="font-medium text-slate-800">{activeNegotiation.pickupDate || activeNegotiation.requestDate || '26 Aug 2026'}</span></div>
                        </div>
                    )}
                </div>

                {/* 3: Pricing */}
                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('pricing')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Pricing Breakdown</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.pricing && (
                        <PricingBreakdownSection
                            activeNegotiation={activeNegotiation}
                            currency={currency}
                            currentPrice={currentPrice}
                        />
                    )}
                </div>

                {/* 4: Negotiation History */}
                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('history')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Negotiation History</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.history ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.history && (
                        <NegotiationHistoryTimeline
                            activeNegotiation={activeNegotiation}
                            currency={currency}
                            currentPrice={currentPrice}
                        />
                    )}
                </div>

                {/* 5: Documents */}
                <div id="sidebar-documents-section">
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('documents')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Media & Documents ({documents.length})</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.documents && <div className="px-4 pb-3"><AttachmentsList items={documents} /></div>}
                </div>
            </div>

            <CustomerProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                customer={activeNegotiation}
                onCallClick={() => onCallClick?.('audio')}
            />
        </div>
    );
};
