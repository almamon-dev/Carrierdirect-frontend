import React from 'react';
import { Pin, Ban, Pencil, Trash2, FileText } from 'lucide-react';
import CounterOfferMessage from '@/modules/Customer/QuoteManagement/Negotiation/CounterOffer';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
    msg: ChatMessage;
    index: number;
    prevMsg: ChatMessage | null;
    nextMsg: ChatMessage | null;
    activeNegotiation: NegotiationItem;
    editingMsgId: number | string | null;
    highlightedMsgId: number | string | null;
    handleTogglePinMessage: (id: number | string) => void;
    handleDeleteMessage: (id: number | string) => void;
    handleStartEdit: (msg: ChatMessage) => void;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
    msg,
    prevMsg,
    nextMsg,
    activeNegotiation,
    editingMsgId,
    highlightedMsgId,
    handleTogglePinMessage,
    handleDeleteMessage,
    handleStartEdit,
    handleAcceptOffer,
    handleRejectOffer
}) => {
    const isFirstInGroup = !prevMsg || prevMsg.type !== msg.type || prevMsg.sender !== msg.sender;
    const isLastInGroup = !nextMsg || nextMsg.type !== msg.type || nextMsg.sender !== msg.sender;
    const spacingClass = isFirstInGroup ? 'mt-5' : 'mt-1';

    if (msg.type === 'system') {
        return (
            <div className={`flex justify-center ${spacingClass}`}>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-full">
                    {msg.text} • {msg.time}
                </span>
            </div>
        );
    }

    if (msg.type === 'offer') {
        return (
            <div className={spacingClass}>
                <CounterOfferMessage msg={msg} onAccept={handleAcceptOffer} onReject={handleRejectOffer} />
            </div>
        );
    }

    const isSent = msg.type === 'sent';
    const isEditing = editingMsgId === msg.id;
    const isHighlighted = highlightedMsgId === msg.id;

    if (msg.isDeleted) {
        return (
            <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass}`}>
                <div className="px-3.5 py-1.5 rounded-2xl text-[12.5px] italic text-slate-400 border border-slate-200/80 bg-slate-50 flex items-center gap-1.5 font-medium shadow-2xs">
                    <Ban size={13} className="text-slate-400 shrink-0" />
                    <span>{isSent ? 'You deleted this message' : 'This message was deleted'}</span>
                </div>
            </div>
        );
    }

    const radius = isSent
        ? (!isFirstInGroup && !isLastInGroup ? 'rounded-2xl rounded-tr-sm rounded-br-sm' : !isFirstInGroup ? 'rounded-2xl rounded-tr-sm' : !isLastInGroup ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl')
        : (!isFirstInGroup && !isLastInGroup ? 'rounded-2xl rounded-tl-sm rounded-bl-sm' : !isFirstInGroup ? 'rounded-2xl rounded-tl-sm' : !isLastInGroup ? 'rounded-2xl rounded-bl-sm' : 'rounded-2xl');

    return (
        <div className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} group relative`}>
            {!isSent && (
                <div className="w-7 h-7 flex-shrink-0 mt-auto">
                    {isLastInGroup && (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                            {msg.avatar || activeNegotiation.customer.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            )}

            <div
                id={`msg-bubble-${msg.id}`}
                className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group transition-all duration-500 ${
                    isHighlighted ? 'ring-2 ring-[#FF4A1F] ring-offset-2 rounded-2xl scale-[1.02]' : ''
                }`}
            >
                {!isEditing && (
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white border border-slate-200/90 rounded-full px-1.5 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 ${
                        isSent ? 'right-full mr-2.5' : 'left-full ml-2.5'
                    }`}>
                        <button
                            type="button"
                            onClick={() => handleTogglePinMessage(msg.id)}
                            className={`p-1.5 rounded-full transition-colors cursor-pointer ${msg.isPinned ? 'bg-orange-100 text-[#FF4A1F]' : 'text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50'}`}
                        >
                            <Pin size={13} className={msg.isPinned ? 'fill-[#FF4A1F] rotate-45' : ''} />
                        </button>
                        {isSent && (
                            <>
                                <button type="button" onClick={() => handleStartEdit(msg)} className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer">
                                    <Pencil size={13} />
                                </button>
                                <button type="button" onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 cursor-pointer">
                                    <Trash2 size={13} />
                                </button>
                            </>
                        )}
                    </div>
                )}

                {msg.isPinned && (
                    <div className={`absolute -top-1.5 ${isSent ? '-left-1.5' : '-right-1.5'} w-4.5 h-4.5 bg-[#FF4A1F] text-white rounded-full flex items-center justify-center shadow-xs z-10`}>
                        <Pin size={9} className="fill-white rotate-45" />
                    </div>
                )}

                <div className={`relative px-4 py-2 text-[14px] leading-relaxed whitespace-pre-wrap break-words ${radius} ${isSent ? 'bg-[#FF4A1F] text-white font-medium shadow-2xs' : 'bg-slate-100 text-slate-900 font-medium'}`}>
                    {msg.text && <div>{msg.text}</div>}
                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {msg.attachments.map((att, idx) => (
                                att.type === 'image' && att.url ? (
                                    <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="rounded-lg overflow-hidden border border-white/20 max-w-[220px] block">
                                        <img src={att.url} alt={att.name} className="w-full h-auto max-h-[140px] object-cover" />
                                    </a>
                                ) : (
                                    <div key={idx} className="flex items-center gap-2 bg-black/10 dark:bg-white/10 px-2.5 py-1.5 rounded-lg text-xs font-medium">
                                        <FileText size={14} />
                                        <span className="truncate max-w-[150px]">{att.name}</span>
                                        <span className="text-[10px] opacity-75">({att.size})</span>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>

                {isLastInGroup && (
                    <span className="text-[10px] text-slate-400 font-medium mt-1.5 px-1 flex items-center gap-1">
                        {msg.time}
                        {msg.isEdited && <span className="italic text-[9.5px]">(edited)</span>}
                    </span>
                )}
            </div>
        </div>
    );
};
