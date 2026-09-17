import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, FileText, ChevronDown, CreditCard, ShieldCheck, MapPin } from "lucide-react";
import { CustomerChatItem, CustomerChatMessage } from "../types";
import { CustomerChatOverviewSection } from "./details/CustomerChatOverviewSection";
import { CustomerChatLogisticsSection } from "./details/CustomerChatLogisticsSection";
import { CustomerChatAttachmentList } from "./bubble/CustomerChatAttachmentList";
import { SupplierProfileModal } from "./SupplierProfileModal";
import { getStatusBadgeClass } from "@/modules/Supplier/QuoteManagement/utils/statusStyles";

interface CustomerChatDetailsPanelProps {
    activeChat: CustomerChatItem | null;
    currentMessages: CustomerChatMessage[];
    showDetailsPanel: boolean;
    contactQuotes?: CustomerChatItem[];
    onSelectQuote?: (id: number | string) => void;
}

export const CustomerChatDetailsPanel: React.FC<CustomerChatDetailsPanelProps> = ({
    activeChat,
    currentMessages,
    showDetailsPanel,
    contactQuotes = [],
    onSelectQuote,
}) => {
    const navigate = useNavigate();
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

    const showSeeAll = contactQuotes.length > 4;
    const displayedQuotes = showSeeAll ? contactQuotes.slice(0, 4) : contactQuotes;

    return (
        <>
            <div className="hidden xl:flex xl:col-span-3 flex-col min-h-0 h-full bg-white dark:bg-[#12161c] border-l border-slate-200 dark:border-slate-800 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {/* Profile Header */}
                <div className="p-5 flex flex-col items-center border-b border-slate-100 dark:border-slate-800 text-center">
                    <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-orange-50 dark:bg-orange-950/40 border-2 border-orange-200/80 dark:border-orange-900/50 flex items-center justify-center text-[#FF4A1F] font-bold text-xl shadow-xs">
                            {activeChat.avatar && (activeChat.avatar.startsWith("http") || activeChat.avatar.startsWith("/storage") || activeChat.avatar.startsWith("data:") || activeChat.avatar.includes(".")) ? (
                                <img
                                    src={activeChat.avatar}
                                    alt=""
                                    className="w-full h-full object-contain"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                            ) : (
                                <span>{(activeChat.name || "S").charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white dark:border-[#12161c] rounded-full ${activeChat.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                    </div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{activeChat.name}</h3>
                        <ShieldCheck size={14} className="text-[#FF4A1F] shrink-0" />
                    </div>
                    <p className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 mb-3">{activeChat.quoteNo}</p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowProfileModal(true)}
                            className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                            <User size={13} className="text-slate-500" />
                            <span>Profile</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const el = document.getElementById("customer-sidebar-documents-section");
                                if (el) {
                                    setOpenSections(prev => ({ ...prev, documents: true }));
                                    el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                            <FileText size={13} className="text-slate-500" />
                            <span>Documents</span>
                        </button>
                    </div>
                </div>

                {/* Minimalist Accordion Sections */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {/* Clean Divider-based Quotations Switcher (Max 3 shown + See all) */}
                    {contactQuotes && contactQuotes.length > 0 && (
                        <div>
                            <div
                                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors select-none"
                                onClick={() => toggleSection("quotes")}
                            >
                                <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
                                    Quotations ({contactQuotes.length})
                                </span>
                                <ChevronDown size={15} className={`text-slate-400 transition-transform duration-200 ${openSections.quotes ? "rotate-180" : ""}`} />
                            </div>

                            {openSections.quotes && (
                                <div className="px-4 pb-2">
                                    <div className="divide-y divide-slate-100/90 dark:divide-slate-800/80">
                                        {displayedQuotes.map((q, idx) => {
                                            const isSelected = String(q.id) === String(activeChat.id);
                                            const rawStatusLower = String(q.raw?.status_raw || q.raw?.status || (q as any).status || "Active").toLowerCase();
                                            let statusLabel = q.raw?.status || (q as any).status || "Active";
                                            if (rawStatusLower.includes("accept")) statusLabel = "Accepted";
                                            else if (rawStatusLower.includes("reject") || rawStatusLower.includes("decline")) statusLabel = "Rejected";
                                            else if (rawStatusLower.includes("expire")) statusLabel = "Expired";
                                            else if (rawStatusLower.includes("pending")) statusLabel = "Pending";

                                            return (
                                                <div
                                                    key={q.id}
                                                    onClick={() => onSelectQuote && onSelectQuote(q.id)}
                                                    className={`py-2.5 cursor-pointer transition-colors flex items-center justify-between gap-3 ${isSelected
                                                        ? "font-medium"
                                                        : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-400"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                        <span
                                                            className={`w-5 h-5 rounded-full text-[10.5px] font-bold flex items-center justify-center shrink-0 transition-colors ${isSelected
                                                                ? "bg-[#FF4A1F] text-white shadow-2xs"
                                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                                                                }`}
                                                        >
                                                            {idx + 1}
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`text-[12px] truncate ${isSelected ? "font-bold text-slate-900 dark:text-white" : "font-semibold text-slate-700 dark:text-slate-300"
                                                                    }`}>
                                                                    {q.quoteNo}
                                                                </span>
                                                                <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-medium shrink-0 border ${getStatusBadgeClass(statusLabel)}`}>
                                                                    {statusLabel}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 min-w-0" title={`${q.origin || q.raw?.pickup || 'Pickup Location'} → ${q.destination || q.raw?.delivery || 'Delivery Destination'}`}>
                                                                <MapPin size={10.5} className="text-[#ff4a1f] shrink-0" />
                                                                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">
                                                                    {q.origin || q.raw?.pickup || 'Pickup Location'}
                                                                </span>
                                                                <span className="text-slate-400 shrink-0 select-none">→</span>
                                                                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">
                                                                    {q.destination || q.raw?.delivery || 'Delivery Destination'}
                                                                </span>
                                                            </div>                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className={`text-[12px] block ${isSelected ? "font-black text-[#FF4A1F]" : "font-bold text-slate-800 dark:text-slate-200"
                                                            }`}>
                                                            € {Number(q.currentPrice || 0).toLocaleString()}
                                                        </span>
                                                        <span className="text-[9.5px] text-slate-400 block">{q.distance}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Link if more than 4 quotes */}
                                    {showSeeAll && (
                                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/customer/quotes/negotiation/supplier/${supplierSlug}`)}
                                                className="text-[11.5px] font-semibold text-[#FF4A1F] hover:text-[#e03f19] transition-colors py-1 cursor-pointer flex items-center justify-center gap-1 w-full"
                                            >
                                                <span>View all</span>

                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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

                    <div>
                        <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center justify-between group transition-colors" onClick={() => toggleSection("pricing")}>
                            <span className="text-[12.5px] font-bold text-slate-800 dark:text-slate-200">Pricing Breakdown</span>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform ${openSections.pricing ? "rotate-180" : ""}`} />
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
