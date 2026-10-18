import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { CustomerChatItem, CustomerChatMessage } from "../types";
import { CustomerChatOverviewSection } from "./details/CustomerChatOverviewSection";
import { CustomerChatLogisticsSection } from "./details/CustomerChatLogisticsSection";
import { CustomerChatAttachmentList } from "./bubble/CustomerChatAttachmentList";
import { SupplierProfileModal } from "./SupplierProfileModal";
import { CustomerChatProfileHeader } from "./details/CustomerChatProfileHeader";
import { CustomerChatQuotationsListSection } from "./details/CustomerChatQuotationsListSection";
import { CustomerChatPricingSection } from "./details/CustomerChatPricingSection";

interface CustomerChatDetailsPanelProps {
    activeChat: CustomerChatItem | null;
    currentMessages: CustomerChatMessage[];
    showDetailsPanel: boolean;
    contactQuotes?: CustomerChatItem[];
    onSelectQuote?: (id: number | string) => void;
    onClose?: () => void;
}

export const CustomerChatDetailsPanel: React.FC<CustomerChatDetailsPanelProps> = ({
    activeChat,
    currentMessages,
    showDetailsPanel,
    contactQuotes = [],
    onSelectQuote,
    onClose,
}) => {
    const [openSections, setOpenSections] = useState({
        quotes: true,
        overview: true,
        logistics: false,
        pricing: false,
        documents: false,
    });
    const [showProfileModal, setShowProfileModal] = useState(false);

    if (!showDetailsPanel || !activeChat) return null;

    const toggleSection = (key: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const documents = currentMessages
        .flatMap(m => m.attachments || [])
        .filter(att => att.type === "file" || (att.name && att.name.match(/\.(pdf|docx?|xlsx?|csv)$/i)));

    const supplierSlug = (activeChat.carrier || activeChat.name || "supplier")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

    return (
        <>
            {/* Mobile Backdrop */}
            {showDetailsPanel && (
                <div
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs z-30 lg:hidden animate-in fade-in duration-200"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <div className={`shrink-0 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] overflow-y-auto border-l border-slate-200 dark:border-slate-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
                showDetailsPanel
                    ? 'flex absolute lg:static inset-y-0 right-0 z-40 lg:z-auto w-[88vw] max-w-[340px] lg:w-[320px] 2xl:w-[350px] shadow-2xl lg:shadow-none animate-in slide-in-from-right duration-200'
                    : 'hidden'
            }`}>
                {/* Header Bar */}
                <div className="h-[60px] px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 box-border bg-white dark:bg-[#12161c] sticky top-0 z-10">
                    <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">Quote Details</span>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-8 w-8 rounded-[4px] flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Close details"
                            aria-label="Close details"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Profile Header */}
                <CustomerChatProfileHeader
                    activeChat={activeChat}
                    onOpenProfileModal={() => setShowProfileModal(true)}
                    onScrollToDocuments={() => {
                        const el = document.getElementById("customer-sidebar-documents-section");
                        if (el) {
                            setOpenSections(prev => ({ ...prev, documents: true }));
                            el.scrollIntoView({ behavior: "smooth" });
                        }
                    }}
                />

                {/* Minimalist Accordion Sections */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {/* Quotations List */}
                    {contactQuotes && contactQuotes.length > 0 && (
                        <CustomerChatQuotationsListSection
                            contactQuotes={contactQuotes}
                            activeChat={activeChat}
                            isOpen={openSections.quotes}
                            onToggle={() => toggleSection("quotes")}
                            onSelectQuote={onSelectQuote}
                            supplierSlug={supplierSlug}
                        />
                    )}

                    <div>
                        <div
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection("overview")}
                        >
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Quote Overview ({activeChat.quoteNo})</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.overview ? "rotate-180" : ""}`} />
                        </div>
                        {openSections.overview && <CustomerChatOverviewSection activeChat={activeChat} />}
                    </div>

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors" onClick={() => toggleSection("logistics")}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Logistics Details</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.logistics ? "rotate-180" : ""}`} />
                        </div>
                        {openSections.logistics && <CustomerChatLogisticsSection activeChat={activeChat} />}
                    </div>

                    <CustomerChatPricingSection
                        activeChat={activeChat}
                        isOpen={openSections.pricing}
                        onToggle={() => toggleSection("pricing")}
                    />

                    <div id="customer-sidebar-documents-section">
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors" onClick={() => toggleSection("documents")}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Media & Documents ({documents.length})</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.documents ? "rotate-180" : ""}`} />
                        </div>
                        {openSections.documents && (
                            <div className="px-4 pb-3">
                                <CustomerChatAttachmentList attachments={documents} isSent={false} onImageClick={() => { }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SupplierProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} supplier={activeChat} />
        </>
    );
};
