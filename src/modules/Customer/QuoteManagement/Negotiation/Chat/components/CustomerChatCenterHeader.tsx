import React, { useState } from "react";
import { BadgeCheck, MoreVertical } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import { CustomerChatItem } from "../types";

interface CustomerChatCenterHeaderProps {
    activeChat: CustomerChatItem | null;
    isLoading?: boolean;
    showDetailsPanel: boolean;
    setShowDetailsPanel: (val: boolean) => void;
}

export const CustomerChatCenterHeader: React.FC<CustomerChatCenterHeaderProps> = ({
    activeChat,
    isLoading = false,
    showDetailsPanel,
    setShowDetailsPanel,
}) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="h-[60px] bg-white dark:bg-[#12161c] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between z-10 sticky top-0 shadow-2xs font-sans shrink-0 box-border">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {isLoading && (!activeChat || !activeChat.name) ? (
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 aspect-square" />
                        <div className="space-y-1.5 min-w-0">
                            <Skeleton className="h-4 w-32 rounded-md" />
                            <Skeleton className="h-3 w-20 rounded-md" />
                        </div>
                    </div>
                ) : activeChat ? (
                    <>
                        <div className="relative shrink-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 border border-[#BFDBFE] dark:border-blue-900/50 shadow-2xs">
                                {activeChat.avatar && (activeChat.avatar.startsWith("http") || activeChat.avatar.startsWith("/storage") || activeChat.avatar.startsWith("data:") || activeChat.avatar.includes(".")) ? (
                                    <img
                                        src={activeChat.avatar}
                                        alt=""
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                ) : (
                                    <span>{(activeChat.name || "S").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "S1"}</span>
                                )}
                            </div>
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white dark:border-[#12161c] rounded-full z-10 shadow-2xs ${activeChat.isOnline ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <h2 className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
                                    {activeChat.name}
                                </h2>
                                {activeChat.isVerified !== false && (
                                    <span title="Verified Partner" className="inline-flex items-center text-[#FF6A00] shrink-0">
                                        <BadgeCheck size={14} className="shrink-0 fill-[#FF6A00]/20" />
                                    </span>
                                )}
                            </div>
                            <div className="text-[11px] sm:text-[11.5px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                                <span className="shrink-0 text-slate-500 font-normal">
                                    {activeChat.lastSeenHuman ? (activeChat.lastSeenHuman.toLowerCase().startsWith('active') ? activeChat.lastSeenHuman : `Active ${activeChat.lastSeenHuman}`) : (activeChat.isOnline ? "Active now" : "Offline")}
                                </span>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">{activeChat.quoteNo}</span>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>

            {/* Right Action Menu */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 relative">
                <button
                    type="button"
                    onClick={() => setShowMenu(!showMenu)}
                    className="h-8 w-8 rounded-[4px] flex items-center justify-center cursor-pointer text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                    title="More Options"
                    aria-label="More options"
                >
                    <MoreVertical size={18} />
                </button>

                {showMenu && (
                    <div className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-800 rounded-[4px] shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 animate-in fade-in-50 duration-100 text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => {
                                setShowDetailsPanel(!showDetailsPanel);
                                setShowMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center justify-between"
                        >
                            <span>{showDetailsPanel ? "Hide Quote Details" : "View Quote Details"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (activeChat) {
                                    navigator.clipboard.writeText(String(activeChat.quoteNo || activeChat.id));
                                }
                                setShowMenu(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                            Copy Quote ID
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
