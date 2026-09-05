import React from 'react';
import { BadgeCheck, Pin, PinOff } from 'lucide-react';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';

interface ChatSidebarItemProps {
    item: NegotiationItem;
    isActive: boolean;
    isPinned: boolean;
    isUnread: boolean;
    threadMsgs: ChatMessage[];
    priceDisplay: number;
    onSelect: () => void;
    onTogglePin: (e: React.MouseEvent) => void;
}

export const ChatSidebarItem: React.FC<ChatSidebarItemProps> = ({
    item,
    isActive,
    isPinned,
    isUnread,
    threadMsgs,
    priceDisplay,
    onSelect,
    onTogglePin,
}) => {
    const lastMsg = threadMsgs[threadMsgs.length - 1];
    const previewText = lastMsg ? lastMsg.text : `Quote Offer ${item.budget}`;

    return (
        <div
            onClick={onSelect}
            className={`p-2.5 rounded-[4px] cursor-pointer flex gap-3 items-center group relative transition-all mt-1 ${
                isActive ? 'bg-slate-100 dark:bg-[#1c222b] border border-slate-200 dark:border-slate-700/80 shadow-2xs' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
            }`}
        >
            <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base overflow-hidden border shadow-2xs ${
                    isActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/50 text-[#2563EB]'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                    {item.customerAvatar ? (
                        <img src={item.customerAvatar} alt={item.customer} className="w-full h-full object-cover" />
                    ) : (
                        <span>{item.customer.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full z-10 shadow-2xs" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                        <h4 className={`text-[13px] truncate ${isActive ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {item.customer}
                        </h4>
                        <span title="Verified Client"><BadgeCheck size={14} className="text-[#FF4A1F] shrink-0" /></span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                        {isPinned && <span title="Pinned"><Pin size={12} className="text-[#FF4A1F] fill-[#FF4A1F] rotate-45 shrink-0" /></span>}
                        <button
                            type="button"
                            onClick={onTogglePin}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#FF4A1F] p-0.5 rounded cursor-pointer"
                            title={isPinned ? 'Unpin chat' : 'Pin chat to top'}
                        >
                            {isPinned ? <PinOff size={12} /> : <Pin size={12} />}
                        </button>
                        <span className="text-[10px] text-slate-400 font-medium">{item.lastUpdated || 'Today'}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-1">
                    <p className={`text-[11.5px] truncate ${isUnread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>{previewText}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-bold text-[#FF4A1F]">€ {priceDisplay.toLocaleString()}</span>
                        {isUnread && (
                            <span className="min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                                {item.unreadCount || 1}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600">{item.quoteId}</span>
                    <span>{item.distance}</span>
                </div>
            </div>
        </div>
    );
};
