import React, { useState } from 'react';
import { Pin, Trash2, Check } from 'lucide-react';
import { TiEdit } from 'react-icons/ti';
import { CustomerChatMessage } from '../../types';

interface CustomerChatBubbleActionsProps {
    msg: CustomerChatMessage;
    isSent: boolean;
    onTogglePin?: () => void;
    onDelete?: () => void;
    onStartEdit?: () => void;
}

export const CustomerChatBubbleActions: React.FC<CustomerChatBubbleActionsProps> = ({
    msg,
    isSent,
    onTogglePin,
    onDelete,
    onStartEdit,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (msg.text) {
            navigator.clipboard.writeText(msg.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-xs px-1 py-0.5 text-slate-500 text-xs shrink-0 self-center ${isSent ? 'mr-1' : 'ml-1'}`}>
            <button type="button" onClick={handleCopy} className="p-1 hover:text-[#FF4A1F] rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer" title="Copy text">
                {copied ? <Check size={12} className="text-emerald-500" /> : <span className="text-[10px] font-bold">📋</span>}
            </button>
            {onTogglePin && (
                <button type="button" onClick={onTogglePin} className={`p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer ${msg.isPinned ? 'text-amber-500' : 'hover:text-amber-500'}`} title={msg.isPinned ? 'Unpin message' : 'Pin message'}>
                    <Pin size={12} className={msg.isPinned ? 'fill-amber-500' : ''} />
                </button>
            )}
            {isSent && onStartEdit && (
                <button type="button" onClick={onStartEdit} className="p-1 hover:text-blue-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer" title="Edit message">
                    <TiEdit size={14} />
                </button>
            )}
            {onDelete && (
                <button type="button" onClick={onDelete} className="p-1 hover:text-rose-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer" title="Delete message">
                    <Trash2 size={12} />
                </button>
            )}
        </div>
    );
};
