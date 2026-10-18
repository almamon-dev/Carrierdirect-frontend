import { useCallback } from 'react';
import messageService, {
    GeneralMessage,
    ConversationPartnerItem,
    ConversationUser,
    MessageAttachment,
    SendMessagePayload,
} from '@/services/messageService';
import { parseRawAttachments } from './generalMessageHelpers';
import { formatLocalTime } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';

interface UseSendMessageActionProps {
    activePartnerId: number | null;
    activePartner: ConversationUser | null;
    role?: 'supplier' | 'customer' | string;
    messages: GeneralMessage[];
    setMessages: React.Dispatch<React.SetStateAction<GeneralMessage[]>>;
    setConversations: React.Dispatch<React.SetStateAction<ConversationPartnerItem[]>>;
    setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
    messagesCacheRef: React.MutableRefObject<Map<number, GeneralMessage[]>>;
}

export const useSendMessageAction = ({
    activePartnerId,
    activePartner,
    role,
    messages,
    setMessages,
    setConversations,
    setIsSending,
    messagesCacheRef,
}: UseSendMessageActionProps) => {
    const sendMessage = useCallback(
        async (payloadOrText: string | SendMessagePayload, maybeFiles?: File[], maybeReplyToId?: number | null): Promise<boolean> => {
            let receiverId = activePartnerId;
            let text = '';
            let files: File[] = [];
            let replyToId: number | null = null;

            if (typeof payloadOrText === 'object' && payloadOrText !== null) {
                receiverId = Number(payloadOrText.receiver_id || activePartnerId);
                text = payloadOrText.message || '';
                files = payloadOrText.attachments || [];
                replyToId = payloadOrText.reply_to_id ? Number(payloadOrText.reply_to_id) : maybeReplyToId ? Number(maybeReplyToId) : null;
            } else {
                text = String(payloadOrText || '');
                files = maybeFiles || [];
                replyToId = maybeReplyToId ? Number(maybeReplyToId) : null;
            }

            if (!receiverId) return false;
            if (!text.trim() && files.length === 0) return false;

            const tempId = Date.now();
            const now = new Date();
            const formattedTime = formatLocalTime(now.toISOString());

            const tempAttachments: MessageAttachment[] = files.map((file) => {
                const isImg = file.type.startsWith('image/');
                const url = URL.createObjectURL(file);
                return {
                    name: file.name,
                    url,
                    path: url,
                    mime: file.type,
                    type: isImg ? 'image' : 'file',
                    size: `${Math.round(file.size / 1024)} KB`,
                };
            });

            const targetReply = replyToId ? messages.find((m) => m.id === Number(replyToId)) : null;

            const optimisticMessage: GeneralMessage = {
                id: tempId,
                sender_id: 0,
                receiver_id: receiverId,
                reply_to_id: replyToId || null,
                reply_to: targetReply
                    ? {
                          id: targetReply.id,
                          sender_id: targetReply.sender_id,
                          message: targetReply.message,
                          message_type: targetReply.message_type,
                          is_me: targetReply.is_me,
                      }
                    : null,
                message: text.trim(),
                message_type: tempAttachments.some((a) => a.type === 'image') ? 'image' : tempAttachments.length ? 'file' : 'text',
                attachments: tempAttachments.length > 0 ? tempAttachments : null,
                is_me: true,
                is_read: false,
                time: formattedTime,
                date: now.toLocaleDateString(),
                created_at_human: 'Just now',
                created_at: now.toISOString(),
            };

            setMessages((prev) => [...prev, optimisticMessage]);

            const partnerId = receiverId;
            const currentCache = messagesCacheRef.current.get(partnerId) || [];
            messagesCacheRef.current.set(partnerId, [...currentCache, optimisticMessage]);

            setConversations((prev) => {
                const existing = prev.find((c) => Number(c.user?.id) === partnerId);
                const others = prev.filter((c) => Number(c.user?.id) !== partnerId);
                const user = existing?.user || activePartner || {
                    id: partnerId,
                    name: 'Partner',
                    user_type: role === 'supplier' ? 'customer' : 'supplier',
                    email: '',
                    avatar: '',
                    company_name: 'Partner',
                };

                const updatedItem: ConversationPartnerItem = {
                    user,
                    last_message: {
                        id: tempId,
                        sender_id: 0,
                        message: text.trim() || (files.length ? 'Sent an attachment' : ''),
                        message_type: String(optimisticMessage.message_type),
                        is_me: true,
                        is_read: true,
                        created_at_human: 'Just now',
                        time: formattedTime,
                    },
                    unread_count: 0,
                    last_message_at: now.toISOString(),
                };

                return [updatedItem, ...others];
            });

            setIsSending(true);

            try {
                const res: any = await messageService.sendMessage({
                    receiver_id: partnerId,
                    message: text.trim(),
                    reply_to_id: replyToId || undefined,
                    attachments: files,
                });
                const serverMsg = res?.data?.data || res?.data || res;
                const realId = serverMsg?.id ? Number(serverMsg.id) : tempId;
                const rawAttachments = parseRawAttachments(serverMsg);

                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === tempId
                            ? {
                                  ...m,
                                  id: realId,
                                  attachments: rawAttachments.length > 0 ? rawAttachments : m.attachments,
                                  created_at_human: serverMsg?.created_at_human || m.created_at_human,
                              }
                            : m
                    )
                );

                const updatedCache = (messagesCacheRef.current.get(partnerId) || []).map((m) =>
                    m.id === tempId ? { ...m, id: realId } : m
                );
                messagesCacheRef.current.set(partnerId, updatedCache);

                return true;
            } catch (err) {
                console.error('Failed to send message:', err);
                return false;
            } finally {
                setIsSending(false);
            }
        },
        [activePartnerId, activePartner, role, messages, setMessages, setConversations, setIsSending, messagesCacheRef]
    );

    return { sendMessage };
};
