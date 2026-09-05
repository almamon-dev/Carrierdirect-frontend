import React, { useState } from 'react';
import { User, FileText, ChevronDown, BadgeCheck, CreditCard } from 'lucide-react';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';
import { SupplierProfileModal } from './SupplierProfileModal';
import { CustomerChatOverviewSection } from './details/CustomerChatOverviewSection';
import { CustomerChatLogisticsSection } from './details/CustomerChatLogisticsSection';

interface CustomerChatDetailsPanelProps {
    activeChat: CustomerChatItem | null;
    currentMessages?: CustomerChatMessage[];
    showDetailsPanel?: boolean;
}

export const CustomerChatDetailsPanel: React.FC<CustomerChatDetailsPanelProps> = ({ activeChat, currentMessages = [], showDetailsPanel = true }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [openSections, setOpenSections] = useState({ overview: true, logistics: false, pricing: false, documents: false });

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
                        <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>
                    <div className="flex items-center gap-1 justify-center cursor-pointer" onClick={() => setShowProfileModal(true)}>
                        <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 hover:text-[#FF4A1F] transition-colors">{activeChat.name}</h3>
                        <span title="Verified Carrier"><BadgeCheck size={16} className="text-emerald-500" /></span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{activeChat.quoteNo}</p>

                    <div className="flex items-center gap-6 mt-4">
                        <div onClick={() => setShowProfileModal(true)} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-slate-200 transition-colors"><User size={15} /></div>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-[#FF4A1F] transition-colors">Profile</span>
                        </div>
                        <div onClick={handleDocumentsClick} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-slate-200 transition-colors"><FileText size={15} /></div>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 group-hover:text-[#FF4A1F] transition-colors">Documents</span>
                        </div>
                    </div>
                </div>

                <div className="mt-1 flex flex-col text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors" onClick={() => toggleSection('overview')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Quote Overview ({activeChat.quoteNo})</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.overview ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.overview && <CustomerChatOverviewSection activeChat={activeChat} />}
                    </div>

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors" onClick={() => toggleSection('logistics')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Logistics Details</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.logistics && <CustomerChatLogisticsSection activeChat={activeChat} />}
                    </div>

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors" onClick={() => toggleSection('pricing')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Pricing Breakdown</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.pricing && (
                            <div className="px-4 pb-3">
                                <table className="w-full text-[11.5px] border-collapse">
                                    <tbody>
                                        <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                            <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[95px]"><div className="flex items-center gap-1.5"><CreditCard size={12} className="text-slate-400 shrink-0" /><span>Initial Rate</span></div></td>
                                            <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                            <td className="py-1.5 pl-1 font-medium text-slate-800 dark:text-slate-200 text-left">€ {activeChat.currentPrice.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap w-[95px]"><div className="flex items-center gap-1.5"><CreditCard size={12} className="text-emerald-500 shrink-0" /><span>Current Total</span></div></td>
                                            <td className="py-2 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                            <td className="py-2 pl-1 font-black text-emerald-600 dark:text-emerald-400 text-left text-sm">€ {activeChat.currentPrice.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div id="customer-sidebar-documents-section">
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors" onClick={() => toggleSection('documents')}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Media & Documents ({documents.length})</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.documents && <div className="px-4 pb-3"><AttachmentsList items={documents} /></div>}
                    </div>
                </div>
            </div>

            <SupplierProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} supplier={activeChat} />
        </>
    );
};
