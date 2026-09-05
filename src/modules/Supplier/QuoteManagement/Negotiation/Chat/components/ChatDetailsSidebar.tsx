import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';
import { PricingBreakdownSection } from './PricingBreakdownSection';
import { NegotiationHistoryTimeline } from './NegotiationHistoryTimeline';
import { CustomerProfileModal } from './CustomerProfileModal';
import { SidebarHeaderProfile } from './details/SidebarHeaderProfile';
import { SidebarOverviewSection } from './details/SidebarOverviewSection';
import { SidebarLogisticsSection } from './details/SidebarLogisticsSection';

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
    showMobileDetails,
    setShowMobileDetails,
    chatMessages,
    onCallClick
}) => {
    const [openSections, setOpenSections] = useState({ overview: true, logistics: false, pricing: false, history: false, documents: false });
    const [showProfileModal, setShowProfileModal] = useState(false);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const statusText = negotiationStatusMap[activeNegotiation.rawId] || activeNegotiation.status || 'Active Negotiation';
    const isAccepted = statusText.toLowerCase() === 'accepted' || (activeNegotiation as any)?.status === 'Accepted';
    const isRejected = statusText.toLowerCase() === 'rejected' || statusText.toLowerCase() === 'declined' || (activeNegotiation as any)?.status === 'Rejected';
    const currency = (!activeNegotiation.currency || activeNegotiation.currency === '€') ? '€' : activeNegotiation.currency;

    const handleDocumentsClick = () => {
        setOpenSections(prev => ({ ...prev, documents: true }));
        setTimeout(() => { document.getElementById('sidebar-documents-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
    };

    const currentMsgList = chatMessages?.[activeNegotiation.rawId] || chatMessages?.[activeNegotiation.id] || [];
    const messageAttachments = currentMsgList.flatMap(m => m.attachments || []).map(att => ({ name: att.name, size: att.size, type: att.type, url: att.url }));
    const documents = [...(activeNegotiation.documents || []), ...messageAttachments];

    return (
        <div className={`shrink-0 flex-col min-h-0 h-full bg-white overflow-y-auto border-l border-slate-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${showMobileDetails ? 'flex fixed xl:static inset-y-0 right-0 z-50 w-80 xl:w-[290px] 2xl:w-[320px] shadow-2xl xl:shadow-none bg-white' : 'hidden'}`}>
            <SidebarHeaderProfile
                activeNegotiation={activeNegotiation} statusText={statusText} isAccepted={isAccepted} isRejected={isRejected}
                showMobileDetails={showMobileDetails} setShowMobileDetails={setShowMobileDetails}
                onOpenProfile={() => setShowProfileModal(true)} onDocumentsClick={handleDocumentsClick}
            />

            <div className="flex flex-col divide-y divide-slate-100">
                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('overview')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Quote Overview</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.overview ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.overview && <SidebarOverviewSection activeNegotiation={activeNegotiation} statusText={statusText} isAccepted={isAccepted} isRejected={isRejected} />}
                </div>

                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('logistics')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Logistics & Route</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.logistics && <SidebarLogisticsSection activeNegotiation={activeNegotiation} />}
                </div>

                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('pricing')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Pricing Breakdown</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.pricing && <PricingBreakdownSection activeNegotiation={activeNegotiation} currency={currency} currentPrice={currentPrice} />}
                </div>

                <div>
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('history')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Negotiation History</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.history ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.history && <NegotiationHistoryTimeline activeNegotiation={activeNegotiation} currency={currency} currentPrice={currentPrice} />}
                </div>

                <div id="sidebar-documents-section">
                    <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('documents')}>
                        <span className="text-[12.5px] font-bold text-slate-800">Media & Documents ({documents.length})</span>
                        <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                    </div>
                    {openSections.documents && <div className="px-4 pb-3"><AttachmentsList items={documents} /></div>}
                </div>
            </div>

            <CustomerProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} customer={activeNegotiation} onCallClick={() => onCallClick?.('audio')} />
        </div>
    );
};
