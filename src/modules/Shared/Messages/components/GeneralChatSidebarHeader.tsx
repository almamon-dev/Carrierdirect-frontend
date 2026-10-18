import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

interface GeneralChatSidebarHeaderProps {
    unreadTotal: number;
    onBack?: () => void;
    onOpenNewMessage?: () => void;
}

export const GeneralChatSidebarHeader: React.FC<GeneralChatSidebarHeaderProps> = ({
    unreadTotal,
    onBack,
    onOpenNewMessage,
}) => {
    return (
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </button>
                )}
                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-white">Messages</h2>
                {unreadTotal > 0 && (
                    <span className="text-[11px] font-medium bg-orange-100 dark:bg-orange-950/50 text-[#FF4A1F] px-2 py-0.5 rounded-full">
                        {unreadTotal} new
                    </span>
                )}
            </div>

            {onOpenNewMessage && (
                <button
                    type="button"
                    onClick={onOpenNewMessage}
                    className="h-8 px-3 bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer rounded-[3px] transition-colors"
                    title="Start a new message"
                >
                    <Plus size={13} strokeWidth={2.5} />
                    <span>New Message</span>
                </button>
            )}
        </div>
    );
};
