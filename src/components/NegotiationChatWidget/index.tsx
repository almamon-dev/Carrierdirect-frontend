import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../ui/input';
import apiClient from '@/lib/axios';
import { encryptId } from '@/lib/encryption';
import {
  MessageSquare as ChatIcon,
  X as CloseIcon,
  Send as SendIcon,
  Paperclip as AttachIcon,
  Image as ImageIcon,
  Smile as SmileIcon,
  Check,
  ArrowDown,
  MoreHorizontal,
  Copy,
  Tag,
  RefreshCw,
  Lock,
  CheckCheck,
  User as UserIcon,
  FileSearch,
  History,
  Download,
  FileSpreadsheet,
  Pin,
  Bell,
  Share2,
  Trash2,
  ArrowLeftRight,
  PlusCircle,
  Receipt,
  Plus,
  FileText,
  MapPin,
  FileUp,
  Loader2
} from 'lucide-react';

interface ExtraFeeItem {
  id: string;
  name: string;
  amount: string;
  description?: string;
}

interface ChatAttachment {
  type: 'image' | 'file';
  url?: string;
  name: string;
  size?: string;
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'supplier' | 'system';
  senderName: string;
  text: string;
  time: string;
  timestamp?: number;
  isCounterOffer?: boolean;
  offerAmount?: number;
  previousAmount?: number;
  extraFeeItems?: { name: string; amount: number; description?: string }[];
  attachment?: ChatAttachment;
}

interface Conversation {
  id: string;
  quoteId: string;
  negId: string;
  supplierName: string;
  avatar: string;
  currentOffer: string;
  currentOfferAmount: number;
  originalPrice: string;
  originalPriceAmount: number;
  discountBadge: string;
  isPinned?: boolean;
  unreadCount: number;
  isOnline: boolean;
  lastActivityTime: number;
  canAccept?: boolean;
  canCounter?: boolean;
  canDecline?: boolean;
  canWithdraw?: boolean;
  isMyOffer?: boolean;
  status?: string;
  messages: ChatMessage[];
}

const quickEmojis = ['😊', '👍', '🚚', '📦', '💰', '🤝', '✍️', '🔥', '🚀', '💬', '📄', '🏷️', '✅', '📍', '🙌', '⭐'];

const sortConversationsList = (list: Conversation[]): Conversation[] => {
  return [...list].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (b.lastActivityTime || 0) - (a.lastActivityTime || 0);
  });
};

function ExpandableText({ text, limit = 120 }: { text: string; limit?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= limit) {
    return <p className="leading-relaxed">{text}</p>;
  }

  return (
    <div>
      <p className="inline leading-relaxed">
        {isExpanded ? text : `${text.slice(0, limit)}... `}
      </p>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[#ff4a1f] font-semibold text-[11px] hover:underline cursor-pointer inline-block ml-1"
      >
        {isExpanded ? 'See less' : 'See more'}
      </button>
    </div>
  );
}

export default function NegotiationChatWidget() {
  const navigate = useNavigate();
  const location = useLocation();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isSubmittingMessage, setIsSubmittingMessage] = useState<boolean>(false);
  const [isAcceptingOffer, setIsAcceptingOffer] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const [showConvDropdown, setShowConvDropdown] = useState(false);
  const [showMoreActionsMenu, setShowMoreActionsMenu] = useState(false);
  const [showOfferBanner, setShowOfferBanner] = useState(true);

  const [inputValue, setInputValue] = useState('');

  // Dynamic Counter Offer Form State
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [extraFees, setExtraFees] = useState<ExtraFeeItem[]>([]);
  const [counterNote, setCounterNote] = useState('');
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Composer Actions Popovers State & File Refs
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Draggable Floating Button Position State
  const [btnPos, setBtnPos] = useState<{ x: number; y: number } | null>(() => {
    try {
      const saved = localStorage.getItem('chat_widget_btn_pos');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, mouseX: 0, mouseY: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const moreActionsRef = useRef<HTMLDivElement>(null);
  const convDropdownRef = useRef<HTMLDivElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSupplierContext = location.pathname.startsWith('/supplier');

  // Fetch all active negotiations from real backend API sorted by latest message activity
  const fetchConversations = useCallback(async (silent = false) => {
    if (!silent) setIsLoadingList(true);
    try {
      const endpoint = isSupplierContext ? '/supplier/negotiations' : '/customer/negotiations';
      let res;
      try {
        res = await apiClient.get(endpoint);
      } catch {
        res = await apiClient.get('/negotiations');
      }

      const resData = res?.data?.data || res?.data || res;
      const rawList = Array.isArray(resData?.negotiations?.data)
        ? resData.negotiations.data
        : Array.isArray(resData?.negotiations)
        ? resData.negotiations
        : Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : [];

      const mapped: Conversation[] = rawList.map((q: any) => {
        const negId = String(q.id || q.quote_id);
        const otherName = q.company_name || q.sender_name || (isSupplierContext ? 'Customer' : 'Supplier');
        const avatarInitials = otherName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase() || (isSupplierContext ? 'CU' : 'CD');

        const rawAmt = q.amount_raw !== undefined && q.amount_raw !== null ? q.amount_raw : (typeof q.amount === 'number' ? q.amount : String(q.amount || '0').replace(/[^0-9.-]+/g, ''));
        const activePriceNum = Number(rawAmt) || 0;

        const rawBase = q.base_amount_raw !== undefined && q.base_amount_raw !== null ? q.base_amount_raw : (typeof q.base_amount === 'number' ? q.base_amount : String(q.base_amount || '0').replace(/[^0-9.-]+/g, ''));
        const basePriceNum = Number(rawBase) || activePriceNum;

        let diffPercent = 'Offer';
        if (basePriceNum > activePriceNum && basePriceNum > 0) {
          diffPercent = `${(((basePriceNum - activePriceNum) / basePriceNum) * 100).toFixed(1)}% OFF`;
        }

        const activityTime = q.last_activity_timestamp
          ? Number(q.last_activity_timestamp) * 1000
          : q.created_at
          ? new Date(q.created_at).getTime()
          : Date.now();

        return {
          id: negId,
          quoteId: q.quote_id_formatted || (q.id ? `QT-${String(q.id).padStart(4, '0')}` : 'QT-0001'),
          negId: negId,
          supplierName: otherName,
          avatar: avatarInitials,
          currentOffer: q.amount || `€${activePriceNum.toLocaleString()}`,
          currentOfferAmount: activePriceNum,
          originalPrice: q.base_amount || (basePriceNum > 0 ? `€${basePriceNum.toLocaleString()}` : (q.amount || '€0')),
          originalPriceAmount: basePriceNum,
          discountBadge: diffPercent,
          isPinned: false,
          unreadCount: Number(q.unread_count || 0),
          isOnline: Boolean(q.is_online),
          lastActivityTime: activityTime,
          canAccept: q.can_accept !== undefined ? Boolean(q.can_accept) : !isSupplierContext,
          canCounter: q.can_counter !== undefined ? Boolean(q.can_counter) : true,
          canDecline: q.can_decline !== undefined ? Boolean(q.can_decline) : true,
          canWithdraw: Boolean(q.can_withdraw),
          isMyOffer: Boolean(q.is_my_offer),
          status: q.status || 'Pending',
          messages: []
        };
      });

      const sorted = sortConversationsList(mapped);

      setConversations(prev => {
        return sorted.map(item => {
          const existing = prev.find(p => p.id === item.id);
          return existing && existing.messages.length > 0
            ? { ...item, messages: existing.messages, isPinned: existing.isPinned, lastActivityTime: Math.max(item.lastActivityTime, existing.lastActivityTime) }
            : item;
        });
      });

      setActiveConvId(prevActive => {
        if (prevActive && sorted.some(c => c.id === prevActive)) {
          return prevActive;
        }
        return sorted[0]?.id || '';
      });
    } catch (err) {
      console.error('Failed to load negotiations in widget:', err);
    } finally {
      setIsLoadingList(false);
    }
  }, [isSupplierContext]);

  // Fetch messages for a specific active conversation
  const fetchMessagesForConv = useCallback(async (convId: string, silent = false) => {
    if (!convId) return;
    if (!silent) setIsLoadingMessages(true);

    try {
      const endpoint = isSupplierContext
        ? `/supplier/negotiations/${convId}/messages`
        : `/customer/negotiations/${convId}/messages`;

      let res;
      try {
        res = await apiClient.get(endpoint);
      } catch {
        res = await apiClient.get(`/negotiations/${convId}/messages`);
      }

      const resData = res?.data?.data || res?.data || res;
      const rawMsgs = Array.isArray(resData?.all_messages)
        ? resData.all_messages
        : Array.isArray(resData?.messages)
        ? resData.messages
        : Array.isArray(resData?.data)
        ? resData.data
        : Array.isArray(resData)
        ? resData
        : [];

      let latestMsgTime = 0;

      const mappedMsgs: ChatMessage[] = rawMsgs.map((m: any) => {
        const isMe = Boolean(m.is_me || m.is_sender || m.sender_role === (isSupplierContext ? 'supplier' : 'customer'));
        const isCounter = Boolean(
          m.is_counter_offer ||
          m.message_type === 'counter_offer' ||
          m.message_type === 'offer' ||
          m.type === 'offer' ||
          (m.offer_amount && Number(m.offer_amount) > 0)
        );

        const amount = Number(m.offer_amount || m.proposed_amount || m.counter_offer_amount || m.amount || 0);
        const prevAmount = Number(m.previous_amount || m.original_amount || 0);

        let extraCharges: { name: string; amount: number; description?: string }[] = [];
        if (Array.isArray(m.extra_charges)) {
          extraCharges = m.extra_charges.map((c: any) => ({
            name: c.custom_name || c.type || 'Extra Fee',
            amount: Number(c.amount || 0),
            description: c.description
          })).filter((c: any) => c.amount > 0);
        }

        let attachmentObj: ChatAttachment | undefined;
        if (m.attachment || m.attachments) {
          const att = Array.isArray(m.attachments) ? m.attachments[0] : m.attachment;
          if (att) {
            const isImg = att.type === 'image' || String(att.file_type || att.url || '').match(/\.(png|jpe?g|webp|gif)$/i);
            attachmentObj = {
              type: isImg ? 'image' : 'file',
              url: att.url || att.file_url,
              name: att.name || att.file_name || 'Attachment',
              size: att.size || att.file_size
            };
          }
        }

        const msgTimestamp = m.created_at ? new Date(m.created_at).getTime() : Date.now();
        if (msgTimestamp > latestMsgTime) {
          latestMsgTime = msgTimestamp;
        }

        return {
          id: String(m.id || Date.now() + Math.random()),
          sender: isMe ? 'customer' : 'supplier',
          senderName: isMe ? 'You' : (m.sender_name || 'Partner'),
          text: m.message || m.text || (isCounter ? `Counter offer submitted: €${amount.toLocaleString()}` : ''),
          time: m.time || m.created_at_human || (m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'),
          timestamp: msgTimestamp,
          isCounterOffer: isCounter,
          offerAmount: amount > 0 ? amount : undefined,
          previousAmount: prevAmount > 0 ? prevAmount : undefined,
          extraFeeItems: extraCharges.length > 0 ? extraCharges : undefined,
          attachment: attachmentObj
        };
      });

      setConversations(prev => {
        const updated = prev.map(c => {
          if (c.id === convId) {
            return {
              ...c,
              messages: mappedMsgs,
              unreadCount: 0,
              lastActivityTime: Math.max(c.lastActivityTime, latestMsgTime || Date.now())
            };
          }
          return c;
        });
        return sortConversationsList(updated);
      });
    } catch (err) {
      console.error(`Failed to load messages for conversation ${convId}:`, err);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [isSupplierContext]);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when active conv changes or widget is opened
  useEffect(() => {
    if (activeConvId && isOpen) {
      fetchMessagesForConv(activeConvId);
    }
  }, [activeConvId, isOpen, fetchMessagesForConv]);

  // Real-time polling when widget is open
  useEffect(() => {
    if (!isOpen || !activeConvId) return;
    const interval = setInterval(() => {
      fetchMessagesForConv(activeConvId, true);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, activeConvId, fetchMessagesForConv]);

  // Background polling for unread badge when widget is closed
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      fetchConversations(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [isOpen, fetchConversations]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const totalUnreadCount = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [conversations, activeConvId, isOpen]);

  // Close dropdowns & popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target as Node)) {
        setShowMoreActionsMenu(false);
      }
      if (convDropdownRef.current && !convDropdownRef.current.contains(event.target as Node)) {
        setShowConvDropdown(false);
      }
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setShowPlusMenu(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDragStart = (clientX: number, clientY: number) => {
    isDraggingRef.current = false;
    const currentX = btnPos?.x ?? (window.innerWidth - 76);
    const currentY = btnPos?.y ?? (window.innerHeight - 80);
    dragStartRef.current = { x: currentX, y: currentY, mouseX: clientX, mouseY: clientY };

    const onMove = (moveX: number, moveY: number) => {
      const dx = moveX - dragStartRef.current.mouseX;
      const dy = moveY - dragStartRef.current.mouseY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        isDraggingRef.current = true;
      }
      const newX = Math.max(12, Math.min(window.innerWidth - 68, dragStartRef.current.x + dx));
      const newY = Math.max(12, Math.min(window.innerHeight - 68, dragStartRef.current.y + dy));
      setBtnPos({ x: newX, y: newY });
    };

    const onEnd = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      setBtnPos((latest) => {
        if (latest) {
          try {
            localStorage.setItem('chat_widget_btn_pos', JSON.stringify(latest));
          } catch {}
        }
        return latest;
      });
    };

    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleMouseUp = () => onEnd();
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => onEnd();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleLauncherClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleAddExtraFeeRow = () => {
    setExtraFees(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', amount: '', description: '' }
    ]);
  };

  const handleRemoveExtraFeeRow = (id: string) => {
    setExtraFees(prev => prev.filter(item => item.id !== id));
  };

  const handleExtraFeeChange = (id: string, field: 'name' | 'amount' | 'description', value: string) => {
    setExtraFees(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSelectConversation = (convId: string) => {
    setActiveConvId(convId);
    setConversations(prev => {
      const updated = prev.map(c => (c.id === convId ? { ...c, unreadCount: 0 } : c));
      return sortConversationsList(updated);
    });
    setShowConvDropdown(false);
    fetchMessagesForConv(convId);
  };

  const handleGoToFullDetails = () => {
    if (!activeConv) return;
    setIsOpen(false);
    setShowMoreActionsMenu(false);
    const routePrefix = isSupplierContext ? '/supplier/quotes/negotiation/conversation' : '/customer/quotes/negotiation/conversation';
    navigate(`${routePrefix}/${encryptId(activeConv.negId)}`);
  };

  const handleCopyQuoteId = () => {
    if (!activeConv) return;
    navigator.clipboard.writeText(activeConv.quoteId);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleInsertEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConv) return;
    const nowTime = Date.now();
    const imageUrl = URL.createObjectURL(file);
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      senderName: 'You',
      text: `Uploaded photo: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: nowTime,
      attachment: { type: 'image', url: imageUrl, name: file.name }
    };

    setConversations(prev => {
      const updated = prev.map(c => (c.id === activeConvId ? { ...c, messages: [...c.messages, newMsg], lastActivityTime: nowTime } : c));
      return sortConversationsList(updated);
    });
    e.target.value = '';

    try {
      const formData = new FormData();
      formData.append('attachments[]', file);
      formData.append('message', `Uploaded photo: ${file.name}`);
      const endpoint = isSupplierContext ? `/supplier/negotiations/${activeConv.id}/messages` : `/customer/negotiations/${activeConv.id}/messages`;
      await apiClient.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(() =>
        apiClient.post(`/negotiations/${activeConv.id}/messages`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      );
      fetchMessagesForConv(activeConv.id, true);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConv) return;
    const nowTime = Date.now();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      senderName: 'You',
      text: `Attached file: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: nowTime,
      attachment: { type: 'file', name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` }
    };

    setConversations(prev => {
      const updated = prev.map(c => (c.id === activeConvId ? { ...c, messages: [...c.messages, newMsg], lastActivityTime: nowTime } : c));
      return sortConversationsList(updated);
    });
    e.target.value = '';

    try {
      const formData = new FormData();
      formData.append('attachments[]', file);
      formData.append('message', `Attached file: ${file.name}`);
      const endpoint = isSupplierContext ? `/supplier/negotiations/${activeConv.id}/messages` : `/customer/negotiations/${activeConv.id}/messages`;
      await apiClient.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(() =>
        apiClient.post(`/negotiations/${activeConv.id}/messages`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      );
      fetchMessagesForConv(activeConv.id, true);
    } catch (err) {
      console.error('File upload failed:', err);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || !activeConv || isSubmittingMessage) return;

    const textToSend = inputValue.trim();
    setInputValue('');
    const nowTime = Date.now();

    const newMsg: ChatMessage = {
      id: String(nowTime),
      sender: 'customer',
      senderName: 'You',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: nowTime
    };

    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === activeConvId) {
          return { ...c, messages: [...c.messages, newMsg], lastActivityTime: nowTime };
        }
        return c;
      });
      return sortConversationsList(updated);
    });

    setIsSubmittingMessage(true);
    try {
      const endpoint = isSupplierContext ? `/supplier/negotiations/${activeConv.id}/messages` : `/customer/negotiations/${activeConv.id}/messages`;
      await apiClient.post(endpoint, { message: textToSend }).catch(() =>
        apiClient.post(`/negotiations/${activeConv.id}/messages`, { message: textToSend })
      );
      fetchMessagesForConv(activeConv.id, true);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSubmittingMessage(false);
    }
  };

  const handleSendCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv) return;
    const basePriceNum = parseFloat(counterPrice) || 0;

    const validExtraFees = extraFees
      .map(f => ({
        name: f.name.trim() || 'Extra Fee',
        amount: parseFloat(f.amount) || 0,
        description: f.description?.trim() || undefined
      }))
      .filter(f => f.amount > 0);

    const totalExtraFeesSum = validExtraFees.reduce((sum, f) => sum + f.amount, 0);
    const grandTotal = basePriceNum + totalExtraFeesSum;

    if (grandTotal <= 0) return;

    const feeBreakdownText = validExtraFees.length > 0
      ? ` + Fees (${validExtraFees.map(f => `${f.name}: €${f.amount.toLocaleString()}`).join(', ')})`
      : '';

    const nowTime = Date.now();
    const counterMsg: ChatMessage = {
      id: String(nowTime),
      sender: 'customer',
      senderName: 'You',
      text: counterNote || `Proposing counter offer of €${grandTotal.toLocaleString()} (Base: €${basePriceNum.toLocaleString()}${feeBreakdownText}). Ready for immediate booking.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: nowTime,
      isCounterOffer: true,
      offerAmount: grandTotal,
      previousAmount: activeConv.currentOfferAmount || basePriceNum,
      extraFeeItems: validExtraFees.length > 0 ? validExtraFees : undefined
    };

    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: [...c.messages, counterMsg],
            currentOffer: `€${grandTotal.toLocaleString()}`,
            currentOfferAmount: grandTotal,
            lastActivityTime: nowTime
          };
        }
        return c;
      });
      return sortConversationsList(updated);
    });

    setShowCounterModal(false);
    setCounterNote('');
    setCounterPrice('');
    setExtraFees([]);

    try {
      const endpoint = isSupplierContext ? `/supplier/negotiations/${activeConv.id}/counter-offer` : `/customer/negotiations/${activeConv.id}/counter-offer`;
      await apiClient.post(endpoint, {
        amount: grandTotal,
        proposed_amount: grandTotal,
        note: counterNote,
        extra_charges: validExtraFees,
        negotiation_id: activeConv.id
      }).catch(() =>
        apiClient.post(`/negotiations/${activeConv.id}/counter-offer`, {
          amount: grandTotal,
          proposed_amount: grandTotal,
          note: counterNote,
          extra_charges: validExtraFees,
          negotiation_id: activeConv.id
        })
      );
      fetchConversations(true);
      fetchMessagesForConv(activeConv.id, true);
    } catch (err) {
      console.error('Failed to submit counter offer:', err);
    }
  };

  const handleAcceptCurrentOffer = async () => {
    if (!activeConv || isAcceptingOffer) return;
    setIsAcceptingOffer(true);

    const nowTime = Date.now();
    const acceptMsg: ChatMessage = {
      id: String(nowTime),
      sender: 'customer',
      senderName: 'You',
      text: `✅ Offer accepted at ${activeConv.currentOffer}! Proceeding to booking confirmation.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: nowTime
    };

    setConversations(prev => {
      const updated = prev.map(c => (c.id === activeConvId ? { ...c, messages: [...c.messages, acceptMsg], lastActivityTime: nowTime } : c));
      return sortConversationsList(updated);
    });

    try {
      const endpoint = isSupplierContext ? `/supplier/negotiations/${activeConv.id}/accept` : `/customer/negotiations/${activeConv.id}/accept`;
      await apiClient.post(endpoint, {
        amount: activeConv.currentOfferAmount,
        proposed_amount: activeConv.currentOfferAmount
      }).catch(() =>
        apiClient.post(`/negotiations/${activeConv.id}/accept`, {
          amount: activeConv.currentOfferAmount,
          proposed_amount: activeConv.currentOfferAmount
        })
      );

      if (!isSupplierContext) {
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/customer/checkout/${encryptId(activeConv.negId)}`);
        }, 800);
      }
    } catch (err) {
      console.error('Failed to accept offer:', err);
    } finally {
      setIsAcceptingOffer(false);
    }
  };

  // Hide widget completely when on full Messages page
  if (location.pathname.includes('/messages') || location.pathname.includes('/negotiation/conversation')) {
    return null;
  }

  return (
    <>
      {/* Hidden File Input Elements */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Floating Launcher Button */}
      <div
        className="fixed z-[9999] select-none font-sans"
        style={
          btnPos
            ? { left: `${btnPos.x}px`, top: `${btnPos.y}px` }
            : { right: '20px', bottom: '24px' }
        }
      >
        <button
          onClick={handleLauncherClick}
          onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          className={`relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 cursor-grab active:cursor-grabbing hover:scale-105 ${
            isOpen
              ? 'bg-slate-900 text-white rotate-90'
              : 'bg-[#ff4a1f] text-white hover:bg-[#e03e15] ring-4 ring-orange-500/20'
          }`}
          title={isOpen ? 'Close Live Negotiation' : 'Open Live Negotiation Chat'}
        >
          {isOpen ? (
            <CloseIcon className="w-6 h-6" />
          ) : (
            <>
              <ChatIcon className="w-6 h-6" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-emerald-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                  {totalUnreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Negotiation Chat Floating Popover */}
      {isOpen && (
        <div
          className="fixed z-[9998] right-4 bottom-20 sm:bottom-24 w-[92vw] sm:w-[420px] h-[590px] max-h-[84vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden font-sans antialiased animate-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-2xs font-sans">
            <div className="flex items-center gap-2.5 min-w-0 font-sans">
              <div className="relative shrink-0 font-sans">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs font-sans">
                  {activeConv ? activeConv.avatar : 'CD'}
                </div>
                {activeConv?.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="min-w-0 font-sans">
                <div className="flex items-center gap-1.5 font-sans">
                  <h3 className="font-bold text-slate-900 text-sm truncate leading-tight font-sans">
                    {activeConv ? activeConv.supplierName : 'Negotiation'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[9.5px] font-semibold rounded-full font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                  <span className="text-slate-400 font-medium font-sans">
                    Quote #{activeConv ? activeConv.quoteId : 'QT-0000'}
                  </span>
                  {activeConv && (
                    <button
                      onClick={handleCopyQuoteId}
                      className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Copy Quote ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                  {copiedQuote && <span className="text-[10px] text-emerald-600 font-bold font-sans">Copied!</span>}
                </div>
              </div>
            </div>

            {/* Header Right Action Pill Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 font-sans">
              {/* Switch Conversation Button */}
              <div className="relative" ref={convDropdownRef}>
                <button
                  onClick={() => setShowConvDropdown(!showConvDropdown)}
                  className="h-8 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-full flex items-center gap-1.5 transition-colors cursor-pointer font-sans"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>Switch</span>
                  {totalUnreadCount > 0 ? (
                    <span className="h-4 px-1.5 bg-[#ff4a1f] text-white text-[9.5px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {totalUnreadCount} New
                    </span>
                  ) : (
                    <span className="w-4 h-4 bg-slate-200 text-slate-600 text-[10px] font-semibold rounded-full flex items-center justify-center">
                      {conversations.length}
                    </span>
                  )}
                </button>

                {/* Conversation Switcher Dropdown */}
                {showConvDropdown && (
                  <div className="absolute top-10 right-0 w-64 sm:w-72 bg-white rounded-lg border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fade-in p-2 space-y-1 font-sans antialiased max-h-72 overflow-y-auto">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-800 tracking-tight flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1 font-sans">
                      <span>Active Negotiations</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full font-sans">
                        {conversations.length}
                      </span>
                    </div>

                    {conversations.length === 0 ? (
                      <div className="p-3 text-center text-slate-400 text-xs font-normal">
                        No active negotiations found.
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv.id)}
                          className={`p-2.5 rounded-md cursor-pointer flex items-center justify-between transition-all font-sans ${
                            conv.id === activeConvId
                              ? 'bg-orange-50/90 border border-orange-200/90 shadow-2xs'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs font-sans ${
                                conv.id === activeConvId ? 'bg-[#ff4a1f] text-white' : 'bg-slate-900 text-white'
                              }`}
                            >
                              {conv.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate leading-tight font-sans">
                                {conv.supplierName}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-sans">
                                <span className="font-normal text-slate-500 font-sans">#{conv.quoteId}</span>
                                <span className="text-slate-300">•</span>
                                <span className="font-semibold text-slate-900 font-sans">{conv.currentOffer}</span>
                              </div>
                            </div>
                          </div>

                          {conv.unreadCount > 0 && (
                            <span className="min-w-[19px] h-[19px] px-1.5 bg-emerald-500 text-white text-[10.5px] font-extrabold rounded-full shadow-2xs shrink-0 ml-2 font-sans flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* More Actions Menu Button */}
              <div className="relative font-sans" ref={moreActionsRef}>
                <button
                  onClick={() => setShowMoreActionsMenu(!showMoreActionsMenu)}
                  className={`w-8 h-8 bg-slate-100 hover:bg-slate-200/80 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-600 ${
                    showMoreActionsMenu ? 'bg-orange-100 text-[#ff4a1f]' : ''
                  }`}
                  title="More Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showMoreActionsMenu && (
                  <div className="absolute top-10 right-0 w-56 bg-white rounded-lg border border-slate-200 shadow-xl z-50 overflow-hidden animate-fade-in py-1.5 text-[11px] font-sans antialiased">
                    <button
                      onClick={handleGoToFullDetails}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <FileSearch className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Quote Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMoreActionsMenu(false);
                        if (activeConv) {
                          setConversations(prev => {
                            const updated = prev.map(c => (c.id === activeConv.id ? { ...c, isPinned: !c.isPinned } : c));
                            return sortConversationsList(updated);
                          });
                        }
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <Pin className="w-3.5 h-3.5 text-slate-400 rotate-45" />
                      <span>{activeConv?.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowMoreActionsMenu(false);
                        fetchConversations();
                        if (activeConv) fetchMessagesForConv(activeConv.id);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Refresh Messages</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200/80 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-600"
                title="Close Window"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50 p-3 sm:p-4 space-y-3 font-sans">
            {/* Top Offer Banner */}
            {activeConv && showOfferBanner && (
              <div className="bg-white p-3 sm:p-3.5 rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 shrink-0 relative pr-7 font-sans">
                {/* Dismiss Cross */}
                <button
                  type="button"
                  onClick={() => setShowOfferBanner(false)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Hide Current Offer"
                >
                  <CloseIcon className="w-3 h-3" />
                </button>

                <div className="min-w-0 font-sans">
                  <p className="text-[10px] font-semibold text-slate-400 tracking-wider font-sans">Current Offer</p>
                  <div className="flex items-baseline gap-2 mt-0.5 font-sans">
                    <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
                      {activeConv.currentOffer}
                    </span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full border border-emerald-200/70 font-sans">
                      <ArrowDown className="w-2.5 h-2.5" /> {activeConv.discountBadge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                    Original <span className="line-through">{activeConv.originalPrice}</span>
                  </p>
                </div>

                {/* Capsule Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 font-sans">
                  <button
                    onClick={() => setShowCounterModal(!showCounterModal)}
                    className="h-8 px-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-full border border-slate-200 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1 font-sans"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-600" />
                    <span>Counter</span>
                  </button>

                  <button
                    onClick={handleAcceptCurrentOffer}
                    disabled={isAcceptingOffer}
                    className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-semibold text-xs rounded-full shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1 font-sans disabled:opacity-60"
                  >
                    {isAcceptingOffer ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            )}

            {/* Counter Offer Modal Form */}
            {showCounterModal && (
              <form onSubmit={handleSendCounterOffer} className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl space-y-3 animate-fade-in shrink-0 font-sans antialiased">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 font-sans">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-[#ff4a1f]" />
                    <h4 className="text-xs font-bold text-slate-900 font-sans">Propose Counter Offer</h4>
                  </div>
                  <button type="button" onClick={() => setShowCounterModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <CloseIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-sans">
                  <Input
                    label="Offer Price (€) *"
                    type="number"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                    placeholder="e.g. 38000"
                    className="h-8 text-xs font-semibold border-slate-200 focus:border-[#ff4a1f] rounded-md font-sans"
                    required
                  />

                  <Input
                    label="Note"
                    type="text"
                    placeholder="e.g. Ready for instant dispatch"
                    value={counterNote}
                    onChange={(e) => setCounterNote(e.target.value)}
                    className="h-8 text-xs border-slate-200 focus:border-[#ff4a1f] rounded-md font-sans"
                  />
                </div>

                {/* Extra Fees List */}
                <div className="space-y-2 font-sans">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-700 font-sans">Extra Fees</label>
                    <button
                      type="button"
                      onClick={handleAddExtraFeeRow}
                      className="text-[11px] font-semibold text-[#ff4a1f] hover:underline flex items-center gap-0.5 cursor-pointer font-sans"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Fee</span>
                    </button>
                  </div>

                  {extraFees.length === 0 ? (
                    <div className="p-2 bg-slate-50/60 rounded-lg border border-dashed border-slate-200 text-center text-[10.5px] text-slate-400 font-normal font-sans">
                      No extra fees added. Click <span className="font-semibold text-[#ff4a1f] cursor-pointer hover:underline" onClick={handleAddExtraFeeRow}>+ Add Fee</span> to include loading, insurance, etc.
                    </div>
                  ) : (
                    extraFees.map((fee) => (
                      <div key={fee.id} className="p-2 bg-slate-50 rounded-md border border-slate-200/80 space-y-1.5 font-sans">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Fee Name (e.g. Loading Fee)"
                            value={fee.name}
                            onChange={(e) => handleExtraFeeChange(fee.id, 'name', e.target.value)}
                            className="h-7 text-[11px] font-medium bg-white border-slate-200 rounded-lg font-sans"
                          />
                          <div className="w-24 shrink-0">
                            <Input
                              type="number"
                              placeholder="Amount (€)"
                              value={fee.amount}
                              onChange={(e) => handleExtraFeeChange(fee.id, 'amount', e.target.value)}
                              className="h-7 text-[11px] font-medium bg-white border-slate-200 rounded-lg font-sans"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExtraFeeRow(fee.id)}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowCounterModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-bold rounded-md shadow-2xs cursor-pointer font-sans"
                  >
                    Submit Counter Offer
                  </button>
                </div>
              </form>
            )}

            {/* Chat Messages Stream */}
            <div className="space-y-3">
              {isLoadingMessages ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#ff4a1f]" />
                  <p className="text-xs">Loading live messages...</p>
                </div>
              ) : !activeConv || activeConv.messages.length === 0 ? (
                <div className="py-12 px-4 text-center text-slate-400 space-y-2">
                  <ChatIcon className="w-8 h-8 mx-auto text-slate-300" />
                  <h4 className="text-xs font-bold text-slate-700">No message history yet</h4>
                  <p className="text-[11px] max-w-xs mx-auto">
                    Type a message below or submit a counter offer to start negotiations for Quote #{activeConv?.quoteId}.
                  </p>
                </div>
              ) : (
                activeConv.messages.map((msg) => {
                  const isMe = msg.sender === 'customer';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 font-sans ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9.5px] font-bold shrink-0 font-sans">
                        {isMe ? 'U' : activeConv.avatar}
                      </div>

                      <div className={`space-y-1 max-w-[85%] font-sans ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 font-sans ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <span className="font-semibold text-slate-700 font-sans">{msg.senderName}</span>
                          <span>•</span>
                          <span>{msg.time}</span>
                        </div>

                        {/* Counter Offer Card Bubble */}
                        {msg.isCounterOffer && (
                          <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2 font-sans shadow-2xs">
                            <div className="flex items-center justify-between gap-2 border-b border-emerald-200/60 pb-1.5 font-sans">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider font-sans">
                                🏷️ Counter Offer
                              </span>
                              {msg.offerAmount && (
                                <div className="flex items-center gap-1 font-sans">
                                  <span className="text-sm font-extrabold text-emerald-900 font-sans">
                                    €{msg.offerAmount.toLocaleString()}
                                  </span>
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full font-sans">
                                    <ArrowDown className="w-2.5 h-2.5" /> Discount
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Extra Fees Breakdown Lines */}
                            {msg.extraFeeItems && msg.extraFeeItems.length > 0 && (
                              <div className="pt-1.5 border-t border-emerald-200/60 space-y-1.5 text-[10px] text-emerald-900 font-sans">
                                {msg.extraFeeItems.map((item, idx) => (
                                  <div key={idx} className="bg-white/80 p-1.5 rounded-lg border border-emerald-200/40 font-sans">
                                    <div className="flex items-center justify-between font-semibold font-sans">
                                      <span className="flex items-center gap-1 text-emerald-800 font-sans">
                                        <PlusCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                                        {item.name}:
                                      </span>
                                      <span className="text-slate-900 font-sans">+€{item.amount.toLocaleString()}</span>
                                    </div>
                                    {item.description && (
                                      <p className="text-[9.5px] text-slate-500 font-normal mt-0.5 pl-4 font-sans">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="text-xs text-slate-700 leading-relaxed text-left font-sans">
                              <ExpandableText text={msg.text} limit={120} />
                            </div>
                          </div>
                        )}

                        {/* Attachments */}
                        {msg.attachment && (
                          <div className="mt-1 font-sans">
                            {msg.attachment.type === 'image' && msg.attachment.url && (
                              <div className="rounded-lg overflow-hidden border border-slate-200 max-w-xs shadow-2xs bg-white">
                                <img src={msg.attachment.url} alt={msg.attachment.name} className="max-h-44 w-full object-cover" />
                                <p className="p-1.5 text-[10px] text-slate-500 font-normal bg-slate-50 border-t border-slate-100 truncate">
                                  {msg.attachment.name}
                                </p>
                              </div>
                            )}
                            {msg.attachment.type === 'file' && (
                              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs max-w-xs text-left">
                                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#ff4a1f] flex items-center justify-center shrink-0">
                                  <FileText className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-slate-800 truncate">{msg.attachment.name}</p>
                                  {msg.attachment.size && <p className="text-[10px] text-slate-400">{msg.attachment.size}</p>}
                                </div>
                                <Download className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Standard Message Bubble */}
                        {!msg.isCounterOffer && (
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed text-left shadow-2xs font-sans ${
                              isMe
                                ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 rounded-tr-xs'
                                : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                            }`}
                          >
                            <ExpandableText text={msg.text} limit={120} />
                            {isMe && (
                              <div className="flex justify-end mt-1">
                                <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Footer Message Composer */}
          <div className="bg-white px-4 py-3 border-t border-slate-100 space-y-1.5 shrink-0 w-full font-sans antialiased relative">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 font-sans">
              {/* Action Icons */}
              <div className="flex items-center gap-1 shrink-0 font-sans relative">
                {/* Plus (+) Quick Menu */}
                <div className="relative" ref={plusMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlusMenu(!showPlusMenu);
                      setShowEmojiPicker(false);
                    }}
                    className={`p-1.5 transition-colors cursor-pointer flex items-center justify-center rounded-full ${
                      showPlusMenu ? 'text-[#ff4a1f] bg-orange-50' : 'text-slate-400 hover:text-[#ff4a1f]'
                    }`}
                    title="Quick Actions Menu"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>

                  {/* Quick Actions Popover */}
                  {showPlusMenu && (
                    <div className="absolute bottom-9 left-0 w-52 bg-white rounded-lg border border-slate-200 shadow-xl z-50 overflow-hidden animate-fade-in py-1 text-[11px] font-sans antialiased">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPlusMenu(false);
                          setShowCounterModal(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-[#ff4a1f] transition-colors text-left cursor-pointer font-semibold"
                      >
                        <Receipt className="w-3.5 h-3.5 text-[#ff4a1f]" />
                        <span>Send Counter Offer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowPlusMenu(false);
                          imageInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-[#ff4a1f] transition-colors text-left cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Upload Cargo Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowPlusMenu(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-orange-50 hover:text-[#ff4a1f] transition-colors text-left cursor-pointer"
                      >
                        <FileUp className="w-3.5 h-3.5 text-purple-600" />
                        <span>Attach Document</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Image Button */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="text-slate-400 hover:text-[#ff4a1f] p-1.5 transition-colors cursor-pointer flex items-center justify-center rounded-full"
                  title="Upload Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                {/* Attach File Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-slate-400 hover:text-[#ff4a1f] p-1.5 transition-colors cursor-pointer flex items-center justify-center rounded-full"
                  title="Attach File"
                >
                  <AttachIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Input Field */}
              <div className="relative flex-1 flex items-center font-sans" ref={emojiPickerRef}>
                <input
                  type="text"
                  placeholder="Aa"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isSubmittingMessage}
                  className="w-full h-9 pl-3.5 pr-8 text-xs bg-[#f1f5f9] border border-slate-200/60 rounded-full focus:outline-none focus:bg-white focus:border-[#ff4a1f] text-[#202223] placeholder:text-slate-400 font-normal font-sans antialiased"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowPlusMenu(false);
                  }}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer flex items-center justify-center p-0.5 rounded-full ${
                    showEmojiPicker ? 'text-[#ff4a1f]' : 'text-slate-400 hover:text-[#ff4a1f]'
                  }`}
                  title="Insert Emoji"
                >
                  <SmileIcon className="w-4 h-4" />
                </button>

                {/* Emoji Picker Popover */}
                {showEmojiPicker && (
                  <div className="absolute bottom-11 right-0 w-64 bg-white rounded-lg border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fade-in p-2.5 font-sans antialiased">
                    <div className="px-1 pb-1.5 mb-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-800">
                      <span>Quick Emojis</span>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className="text-slate-400 hover:text-[#ff4a1f] cursor-pointer"
                      >
                        <CloseIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-8 gap-1 text-base">
                      {quickEmojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleInsertEmoji(emoji)}
                          className="w-7 h-7 hover:bg-orange-50 rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isSubmittingMessage}
                className="w-8 h-8 bg-[#ff4a1f] hover:bg-[#e63d15] text-white disabled:opacity-30 rounded-full transition-all duration-200 hover:scale-105 shadow-2xs cursor-pointer shrink-0 flex items-center justify-center disabled:hover:scale-100"
                title="Send Message"
              >
                {isSubmittingMessage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SendIcon className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1 text-[9.5px] text-slate-400 font-normal pt-0.5 font-sans">
              <Lock className="w-2.5 h-2.5 text-slate-400" />
              <span>Encrypted & secure negotiation channel</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { NegotiationChatWidget };
