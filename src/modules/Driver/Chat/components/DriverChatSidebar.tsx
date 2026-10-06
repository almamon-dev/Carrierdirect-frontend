import React from 'react';
import { Search, Circle } from 'lucide-react';
import { DriverChatConversation } from '../../types';

interface Props {
    conversations: DriverChatConversation[];
    activeConvId: string;
    onSelectConv: (id: string) => void;
}

export const DriverChatSidebar: React.FC<Props> = ({ conversations, activeConvId, onSelectConv }) => {
    return (
        <div className="w-full md:w-80 bg-white dark:bg-[#12161c] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-full">
            {/* Header & Search */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Driver Messages</h2>
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search channels..."
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#1a1f26] border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
                {conversations.map((conv) => {
                    const isActive = conv.id === activeConvId;

                    return (
                        <div
                            key={conv.id}
                            onClick={() => onSelectConv(conv.id)}
                            className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                                isActive
                                    ? 'bg-orange-50/70 dark:bg-orange-950/20 border-l-4 border-[#FF4A1F]'
                                    : 'hover:bg-slate-50 dark:hover:bg-[#1a1f26]/50'
                            }`}
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <img
                                    src={conv.avatar}
                                    alt={conv.title}
                                    className="w-10 h-10 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                                />
                                {conv.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#12161c]" />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                        {conv.title}
                                    </h3>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                        {conv.lastMessageTime}
                                    </span>
                                </div>

                                <div className="text-[10px] font-semibold text-[#FF4A1F] dark:text-orange-400">
                                    {conv.role} {conv.relatedOrderId && `• ${conv.relatedOrderId}`}
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {conv.lastMessage}
                                </p>
                            </div>

                            {conv.unreadCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-[#FF4A1F] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
