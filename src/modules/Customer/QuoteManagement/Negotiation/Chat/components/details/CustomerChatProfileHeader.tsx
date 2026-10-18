import React from "react";
import { User, FileText, ShieldCheck } from "lucide-react";
import { CustomerChatItem } from "../../types";

interface CustomerChatProfileHeaderProps {
    activeChat: CustomerChatItem;
    onOpenProfileModal: () => void;
    onScrollToDocuments: () => void;
}

export const CustomerChatProfileHeader: React.FC<CustomerChatProfileHeaderProps> = ({
    activeChat,
    onOpenProfileModal,
    onScrollToDocuments,
}) => {
    return (
        <div className="p-5 flex flex-col items-center border-b border-slate-100 dark:border-slate-800 text-center relative">
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
                    onClick={onOpenProfileModal}
                    className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                    <User size={13} className="text-slate-500" />
                    <span>Profile</span>
                </button>
                <button
                    type="button"
                    onClick={onScrollToDocuments}
                    className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                    <FileText size={13} className="text-slate-500" />
                    <span>Documents</span>
                </button>
            </div>
        </div>
    );
};
