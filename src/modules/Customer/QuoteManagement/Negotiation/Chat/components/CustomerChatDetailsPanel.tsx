import React, { useState } from 'react';
import { BadgeCheck, ChevronDown, CreditCard, FileText, User } from 'lucide-react';
import { CustomerChatItem, CustomerChatMessage } from '../types';
import { CustomerChatOverviewSection } from './details/CustomerChatOverviewSection';
import { CustomerChatLogisticsSection } from './details/CustomerChatLogisticsSection';
import { SupplierProfileModal } from './SupplierProfileModal';
import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';

interface CustomerChatDetailsPanelProps {
    activeChat: CustomerChatItem;
    showDetailsPanel: boolean;
    setShowDetailsPanel?: (val: boolean) => void;
    currentMessages?: CustomerChatMessage[];
}

export const CustomerChatDetailsPanel: React.FC<CustomerChatDetailsPanelProps> = ({
    activeChat,
    showDetailsPanel,
    currentMessages = []
}) => {
    const [openSections, setOpenSections] = useState({ overview: true, logistics: false, pricing: false, documents: false });
    const [showProfileModal, setShowProfileModal] = useState(false);

    const toggleSection = (sec: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
    };

    const handleDocumentsClick = () => {
        setOpenSections(prev => ({ ...prev, documents: true }));
        setTimeout(() => { document.getElementById('customer-sidebar-documents-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
    };

    const messageAttachments = currentMessages
        .flatMap(m => m.attachments || [])
        .filter(att => {
            const name = (att.name || '').toLowerCase();
            const url = (att.url || '').toLowerCase();
            return !name.endsWith('.mp3') && !name.endsWith('.wav') && !name.endsWith('.ogg') && !name.endsWith('.m4a') && !url.includes('blob:');
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
                        className="relative mb-3 cursor-pointer group"
                    >
                        <div className="w-16 h-16 shrink-0 aspect-square rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-900/50 flex items-center justify-center font-bold text-2xl shadow-2xs group-hover:opacity-90 transition-opacity overflow-hidden">
                            {activeChat.avatar && (activeChat.avatar.startsWith('http') || activeChat.avatar.startsWith('/storage') || activeChat.avatar.startsWith('data:') || activeChat.avatar.includes('.')) ? (
                                <img
                                    src={activeChat.avatar}
                                    alt=""
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            ) : (
                                <span>{(activeChat.name || 'S').charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <span
                            className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white dark:border-slate-900 rounded-full z-10 shadow-xs ${
                                activeChat.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                            }`}
                            title={activeChat.isOnline ? "Active now" : (activeChat.lastSeenHuman || "Offline")}
                        />
                    </div>
                    <div className="flex items-center gap-1 justify-center cursor-pointer" onClick={() => setShowProfileModal(true)}>
                        <h3 className="text-[14px] font-bold text-slate-800 dark:text-slate-100 hover:text-[#FF4A1F] transition-colors">{activeChat.name}</h3>
                        <span title="Verified Carrier"><BadgeCheck size={16} className="text-[#FF4A1F]" /></span>
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
                        {openSections.pricing && (() => {
                            const extraCharges = (activeChat?.extraCharges && activeChat.extraCharges.length > 0)
                                ? activeChat.extraCharges
                                : (activeChat?.raw?.extra_charges || activeChat?.raw?.extraCharges || []);
                            const totalExtras = extraCharges.reduce((acc: number, c: any) => acc + Number(c.amount || 0), 0);
                            const currentPrice = Number(activeChat.currentPrice || 0);
                            const baseFreight = activeChat?.baseFreightAmount || (
                                activeChat?.raw?.base_amount_raw ??
                                (activeChat?.raw?.base_amount ? parseFloat(String(activeChat.raw.base_amount).replace(/[^0-9.]/g, "")) : (currentPrice > totalExtras && totalExtras > 0 ? currentPrice - totalExtras : currentPrice))
                            );

                            return (
                                <div className="px-4 pb-3">
                                    <table className="w-full text-[11.5px] border-collapse">
                                        <tbody>
                                            <tr className="border-b border-slate-100/80 dark:border-slate-800/80">
                                                <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[130px]">
                                                    <div className="flex items-center gap-1.5">
                                                        <CreditCard size={12} className="text-slate-400 shrink-0" />
                                                        <span>Base Freight</span>
                                                    </div>
                                                </td>
                                                <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                                <td className="py-1.5 pl-1 font-bold text-slate-800 dark:text-slate-200 text-right">
                                                    € {baseFreight.toLocaleString()}
                                                </td>
                                            </tr>

                                            {extraCharges.map((charge: any, idx: number) => (
                                                <tr key={idx} className="border-b border-slate-100/80 dark:border-slate-800/80">
                                                    <td className="py-1.5 text-slate-500 font-medium whitespace-nowrap w-[130px]">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                                                            <span className="truncate max-w-[110px]" title={charge.custom_name || charge.customName || charge.label || charge.type}>
                                                                {charge.custom_name || charge.customName || charge.label || charge.type || `Extra Charge #${idx + 1}`}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-1.5 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                                    <td className="py-1.5 pl-1 font-semibold text-slate-700 dark:text-slate-300 text-right">
                                                        +€ {Number(charge.amount || 0).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}

                                            <tr>
                                                <td className="py-2 text-slate-800 dark:text-slate-200 font-bold whitespace-nowrap w-[130px]">
                                                    <div className="flex items-center gap-1.5">
                                                        <CreditCard size={12} className="text-[#FF4A1F] shrink-0" />
                                                        <span>Current Total</span>
                                                    </div>
                                                </td>
                                                <td className="py-2 text-slate-400 font-bold text-center w-[20px] select-none">:</td>
                                                <td className="py-2 pl-1 text-[13.5px] font-black text-[#FF4A1F] text-right">
                                                    € {currentPrice.toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })()}
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
