import React from 'react';
import {
  MessageSquare as ChatIcon,
  Loader2,
  FileText,
  Download,
  Check,
  CheckCheck,
} from 'lucide-react';
import { ConversationUser, GeneralMessage } from '@/services/messageService';
import { parseRawAttachments } from '@/hooks/useGeneralMessages';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import {
  quickStarters,
  isImageAttachment,
  getAvatarBg,
  getInitials,
  formatChatTime,
} from './negotiationChatWidgetUtils';

interface ChatWidgetMessageStreamProps {
  isLoadingMessages: boolean;
  messages: GeneralMessage[];
  activePartner: ConversationUser;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onQuickStarterClick: (starter: string) => void;
  onLightboxOpen: (url: string) => void;
}

export const ChatWidgetMessageStream: React.FC<ChatWidgetMessageStreamProps> = ({
  isLoadingMessages,
  messages,
  activePartner,
  messagesEndRef,
  onQuickStarterClick,
  onLightboxOpen,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
      {isLoadingMessages ? (
        <div className="flex flex-col items-center justify-center h-48 space-y-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#ff4a1f]" />
          <span className="text-xs">Loading message history...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-[#ff4a1f] flex items-center justify-center shadow-xs">
            <ChatIcon className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No message history yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
              Type a message below to start your conversation with {activePartner.name}.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-1.5 justify-center max-w-xs">
            {quickStarters.map((starter, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onQuickStarterClick(starter)}
                className="px-2.5 py-1 text-[11px] rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#ff4a1f] hover:text-[#ff4a1f] transition-colors cursor-pointer shadow-2xs"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isMe = Boolean(msg.is_me);
          const rawAttachments = parseRawAttachments(msg);

          return (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${getAvatarBg(
                    activePartner.name
                  )} text-white font-bold text-[9px] flex items-center justify-center shrink-0 mb-1 shadow-2xs`}
                >
                  {getInitials(activePartner.name)}
                </div>
              )}

              <div className={`max-w-[78%] space-y-1 ${isMe ? 'items-end' : 'items-start'}`}>
                {rawAttachments.length > 0 && (
                  <div className="space-y-1">
                    {rawAttachments.map((att, aIdx) => {
                      const attUrl = getAttachmentUrl(typeof att === 'string' ? att : att.url || att.path);
                      const isImg = isImageAttachment(att) || (typeof att === 'string' && /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(att));

                      if (isImg) {
                        return (
                          <div
                            key={aIdx}
                            onClick={() => onLightboxOpen(attUrl)}
                            className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-xs shadow-xs cursor-pointer group relative bg-black/5"
                          >
                            <img
                              src={attUrl}
                              alt="Attachment"
                              className="max-h-48 w-full object-cover transition-transform group-hover:scale-102"
                            />
                          </div>
                        );
                      }

                      const fileName = typeof att === 'string' ? att.split('/').pop() || 'Document' : att.name || 'Document';
                      return (
                        <a
                          key={aIdx}
                          href={attUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs max-w-xs text-left hover:border-[#ff4a1f] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {fileName}
                            </p>
                            <p className="text-[10px] text-slate-400">Click to download</p>
                          </div>
                          <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                )}

                {msg.message && (
                  <div
                    className={`p-2.5 text-xs leading-relaxed break-words rounded-2xl shadow-2xs ${
                      isMe
                        ? 'bg-[#ff4a1f] text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                )}

                <div
                  className={`flex items-center gap-1 px-1 text-[9.5px] text-slate-400 ${
                    isMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{formatChatTime(msg.time, msg.created_at_human || msg.created_at)}</span>
                  {isMe && (
                    <span>
                      {msg.is_read ? (
                        <CheckCheck className="w-3 h-3 text-[#ff4a1f]" />
                      ) : (
                        <Check className="w-3 h-3 text-slate-400" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
