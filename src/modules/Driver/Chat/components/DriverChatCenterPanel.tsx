import React from 'react';
import { Send, Phone, Paperclip, CheckCheck, MapPin, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import { DriverChatConversation, DriverChatMessage } from '../../types';
import { DriverQuickReplies } from './DriverQuickReplies';

interface Props {
    conversation: DriverChatConversation;
    messages: DriverChatMessage[];
    inputValue: string;
    setInputValue: (val: string) => void;
    onSendMessage: (text?: string) => void;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const DriverChatCenterPanel: React.FC<Props> = ({
    conversation,
    messages,
    inputValue,
    setInputValue,
    onSendMessage,
    messagesEndRef,
}) => {
    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
                Select a channel from the list to start messaging.
            </div>
        );
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage();
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-[#0e1217] overflow-hidden">
            {/* Header */}
            <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#12161c] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                        <img
                            src={conversation.avatar}
                            alt={conversation.title}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {conversation.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#12161c]" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {conversation.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span className="text-emerald-500 font-semibold">{conversation.role}</span>
                            {conversation.phone && <span>• {conversation.phone}</span>}
                        </div>
                    </div>
                </div>

                {conversation.phone && (
                    <a
                        href={`tel:${conversation.phone}`}
                        className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                        <Phone size={13} />
                        <span>Direct Call</span>
                    </a>
                )}
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
                {messages.map((msg) => {
                    const isMe = msg.isMe;

                    return (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                                isMe ? 'ml-auto' : 'mr-auto'
                            }`}
                        >
                            <div className="text-[10px] text-slate-400 mb-1 px-1 flex items-center gap-1">
                                <span>{msg.senderName}</span>
                                <span>•</span>
                                <span>{msg.timestamp}</span>
                            </div>

                            <div
                                className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                                    isMe
                                        ? 'bg-[#FF4A1F] text-white rounded-br-xs'
                                        : 'bg-white dark:bg-[#1a1f26] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                            </div>

                            {isMe && (
                                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5 pr-1">
                                    <CheckCheck size={12} className="text-[#FF4A1F]" />
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Status Replies */}
            <DriverQuickReplies onSelectReply={(text) => onSendMessage(text)} />

            {/* Input Bar */}
            <form
                onSubmit={handleFormSubmit}
                className="p-3 sm:p-4 bg-white dark:bg-[#12161c] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type driver update or message..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                />

                <Button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white p-2.5 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                >
                    <Send size={16} />
                </Button>
            </form>
        </div>
    );
};
