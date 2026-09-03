import React, { useState } from 'react';
import { User, FileText, Phone, ChevronDown, BadgeCheck } from 'lucide-react';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';
import { SupplierProfileModal } from './SupplierProfileModal';

interface CustomerChatDetailsPanelProps {
    activeChat: CustomerChatItem | null;
    currentMessages?: CustomerChatMessage[];
    showDetailsPanel?: boolean;
}

export const CustomerChatDetailsPanel: React.FC<CustomerChatDetailsPanelProps> = ({ activeChat, currentMessages = [], showDetailsPanel = true }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [openSections, setOpenSections] = useState({
        overview: true,
        logistics: false,
        pricing: false,
        documents: false,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (!activeChat) return null;

    const handleDocumentsClick = () => {
        setOpenSections(prev => ({ ...prev, documents: true }));
        setTimeout(() => {
            document.getElementById('customer-sidebar-documents-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

    const handleCallClick = () => {
        setShowProfileModal(true);
    };

    const messageAttachments = (currentMessages || [])
        .flatMap(m => {
            const atts: any[] = m.attachments || [];
            if (atts.length > 0) return atts;
            if (((m as any).type === 'image' || (m as any).message_type === 'image') && m.text) return [{ name: 'Photo', url: m.text, type: 'image' }];
            return [];
        })
        .map(att => ({
            name: att.name || 'Attachment',
            size: att.size || '',
            type: att.type || (att.url && /\.(jpg|jpeg|png|webp|gif|svg|bmp|avif)($|\?)/i.test(att.url) ? 'image' : 'file'),
            url: att.url || (att as any).file_url || (att as any).path || (att as any).file || ''
        }));
    const documents = [...(activeChat.raw?.documents || []), ...messageAttachments];

    return (
        <>
            <div className={`flex-col min-h-0 h-full bg-white dark:bg-[#12161c] overflow-y-auto border-l border-slate-200 dark:border-slate-800 [&::-webkit-scrollbar]:hidden ${showDetailsPanel ? 'hidden xl:flex xl:col-span-3' : 'hidden'}`}>
                <div className="flex flex-col items-center pt-8 pb-4">
                    <div
                        onClick={() => setShowProfileModal(true)}
                        className="w-16 h-16 shrink-0 aspect-square rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center font-bold text-2xl mb-3 relative shadow-2xs cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        {activeChat.avatar}
                        <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-1 justify-center cursor-pointer" onClick={() => setShowProfileModal(true)}>
                        <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 hover:text-[#FF4A1F] transition-colors">{activeChat.name}</h3>
                        <span title="Verified Carrier"><BadgeCheck size={16} className="text-emerald-500" /></span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{activeChat.quoteNo}</p>

                    <div className="flex items-center gap-6 mt-4">
                        <div onClick={() => setShowProfileModal(true)} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                <User size={15} />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-[#FF4A1F] transition-colors">Profile</span>
                        </div>
                        <div onClick={handleDocumentsClick} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                <FileText size={15} />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-[#FF4A1F] transition-colors">Documents</span>
                        </div>
                        <div onClick={handleCallClick} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                                <Phone size={15} />
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-[#FF4A1F] transition-colors">Call</span>
                        </div>
                    </div>
                </div>

                <div className="mt-1 flex flex-col text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
                    {/* Quote Overview */}
                    <div>
                        <div
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('overview')}
                        >
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Quote Overview ({activeChat.quoteNo})</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.overview ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.overview && (
                            <div className="px-4 pb-3 space-y-2 text-[11.5px]">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-slate-500 shrink-0">Route</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right leading-snug break-words">
                                        {activeChat.routeText}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Distance</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeChat.distance}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logistics Details */}
                    <div>
                        <div
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('logistics')}
                        >
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Logistics Details</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.logistics && (
                            <div className="px-4 pb-3 space-y-2 text-[11.5px]">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Vehicle</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{activeChat.vehicleType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Pickup Date</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">2026-07-28</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Delivery Date</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">2026-07-30</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pricing Breakdown */}
                    <div>
                        <div
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('pricing')}
                        >
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Pricing Breakdown</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.pricing && (
                            <div className="px-4 pb-3 space-y-2 text-[11.5px]">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Initial Rate</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">€ {activeChat.currentPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span className="font-bold text-slate-800 dark:text-slate-200">Current Total</span>
                                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">€ {activeChat.currentPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Media & Documents Section */}
                    <div id="customer-sidebar-documents-section">
                        <div
                            className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('documents')}
                        >
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Media & Documents ({documents.length})</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.documents && (
                            <div className="px-4 pb-3">
                                <AttachmentsList items={documents} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <SupplierProfileModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                supplier={activeChat}
            />
        </>
    );
};
