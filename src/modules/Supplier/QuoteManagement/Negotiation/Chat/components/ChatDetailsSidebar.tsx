import React, { useState, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';
import { PricingBreakdownSection } from './PricingBreakdownSection';
import { NegotiationHistoryTimeline } from './NegotiationHistoryTimeline';
import { CustomerProfileModal } from './CustomerProfileModal';
import { SidebarHeaderProfile } from './details/SidebarHeaderProfile';
import { SidebarOverviewSection } from './details/SidebarOverviewSection';
import { SidebarLogisticsSection } from './details/SidebarLogisticsSection';
import { SupplierChatQuotationsListSection } from './details/SupplierChatQuotationsListSection';

interface ChatDetailsSidebarProps {
    activeNegotiation: NegotiationItem;
    allNegotiations?: NegotiationItem[];
    onSelectNegotiation?: (item: NegotiationItem) => void;
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
    allNegotiations = [],
    onSelectNegotiation,
    negotiationStatusMap,
    currentPrice,
    showMobileDetails,
    setShowMobileDetails,
    chatMessages,
    onCallClick
}) => {
    const [openSections, setOpenSections] = useState({
        quotes: true,
        overview: true,
        logistics: false,
        pricing: false,
        history: false,
        documents: false
    });
    const [showProfileModal, setShowProfileModal] = useState(false);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const customerQuotes = useMemo(() => {
        if (!activeNegotiation) return [];
        const activeCustName = (activeNegotiation.customer || '').trim().toLowerCase();
        const activeCustId = activeNegotiation.raw?.customer_id || activeNegotiation.raw?.user_id;

        const matched = (allNegotiations || []).filter(n => {
            const nCustName = (n.customer || '').trim().toLowerCase();
            const nCustId = n.raw?.customer_id || n.raw?.user_id;
            if (activeCustId && nCustId) {
                return String(nCustId) === String(activeCustId);
            }
            if (activeCustName && nCustName) {
                return nCustName === activeCustName;
            }
            return String(n.rawId) === String(activeNegotiation.rawId) || String(n.id) === String(activeNegotiation.id);
        });

        return matched.length > 0 ? matched : [activeNegotiation];
    }, [allNegotiations, activeNegotiation]);

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
        <>
            {/* Mobile Backdrop for Details Sidebar */}
            {showMobileDetails && (
                <div
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs z-30 lg:hidden animate-in fade-in duration-200"
                    onClick={() => setShowMobileDetails(false)}
                    aria-hidden="true"
                />
            )}

            <div className={`shrink-0 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] overflow-y-auto border-l border-slate-200 dark:border-slate-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
                showMobileDetails
                    ? 'flex absolute lg:static inset-y-0 right-0 z-40 lg:z-auto w-[88vw] max-w-[340px] lg:w-[320px] 2xl:w-[340px] shadow-2xl lg:shadow-none animate-in slide-in-from-right duration-200'
                    : 'hidden'
            }`}>
                {/* Header Bar */}
                <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border bg-white dark:bg-[#12161c] sticky top-0 z-10">
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Quote Details</span>
                    <button
                        type="button"
                        onClick={() => setShowMobileDetails(false)}
                        className="h-8 w-8 rounded-[4px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Close details"
                        aria-label="Close details"
                    >
                        <X size={18} />
                    </button>
                </div>

                <SidebarHeaderProfile
                    activeNegotiation={activeNegotiation} statusText={statusText} isAccepted={isAccepted} isRejected={isRejected}
                    showMobileDetails={showMobileDetails} setShowMobileDetails={setShowMobileDetails}
                    onOpenProfile={() => setShowProfileModal(true)} onDocumentsClick={handleDocumentsClick}
                />

                <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {/* Quotations List Accordion */}
                    {customerQuotes && customerQuotes.length > 0 && (
                        <SupplierChatQuotationsListSection
                            customerQuotes={customerQuotes}
                            activeNegotiation={activeNegotiation}
                            isOpen={openSections.quotes}
                            onToggle={() => toggleSection('quotes')}
                            onSelectQuote={onSelectNegotiation}
                        />
                    )}

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('overview')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Quote Overview</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.overview ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.overview && <SidebarOverviewSection activeNegotiation={activeNegotiation} statusText={statusText} isAccepted={isAccepted} isRejected={isRejected} />}
                    </div>

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('logistics')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Logistics & Route</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.logistics && <SidebarLogisticsSection activeNegotiation={activeNegotiation} />}
                    </div>

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('pricing')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Pricing Breakdown</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.pricing && <PricingBreakdownSection activeNegotiation={activeNegotiation} currency={currency} currentPrice={currentPrice} />}
                    </div>

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('history')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Negotiation History</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.history ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.history && <NegotiationHistoryTimeline activeNegotiation={activeNegotiation} currency={currency} currentPrice={currentPrice} />}
                    </div>

                    <div id="sidebar-documents-section">
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between transition-colors" onClick={() => toggleSection('documents')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Media & Documents ({documents.length})</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.documents && <div className="px-4 pb-3"><AttachmentsList items={documents} /></div>}
                    </div>
                </div>

                <CustomerProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} customer={activeNegotiation} onCallClick={() => onCallClick?.('audio')} />
            </div>
        </>
    );
};
