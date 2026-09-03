import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../ui/input';
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
  FileUp
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
  originalPrice: string;
  discountBadge: string;
  isPinned?: boolean;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    quoteId: 'QT-8822',
    negId: 'NEG-102',
    supplierName: 'Prime Movers',
    avatar: 'PM',
    currentOffer: '€40,000',
    originalPrice: '€42,500',
    discountBadge: '5.9% OFF',
    isPinned: true,
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: '101',
        sender: 'supplier',
        senderName: 'Prime Movers',
        text: 'We can offer a discounted rate of €40,000 for full freight & loading. This offer includes express transit, 24/7 dedicated dispatch support, full transit insurance coverage, and white-glove loading/unloading services at both terminals.',
        time: '10:05 AM',
        isCounterOffer: true,
        offerAmount: 40000,
        previousAmount: 42500,
        extraFeeItems: [
          { name: 'Loading & Handling', amount: 300, description: 'Forklift & 2 helper team' },
          { name: 'Transit Insurance', amount: 200, description: 'Full cargo loss protection' }
        ]
      },
      {
        id: '102',
        sender: 'customer',
        senderName: 'You',
        text: 'Thanks! Could we do €38,500 flat? We can confirm the booking right away.',
        time: '10:14 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    quoteId: 'QT-8815',
    negId: 'NEG-101',
    supplierName: 'Fast Track BD',
    avatar: 'FT',
    currentOffer: '€32,000',
    originalPrice: '€35,000',
    discountBadge: '8.5% OFF',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: '201',
        sender: 'supplier',
        senderName: 'Fast Track BD',
        text: 'New counter offer submitted: We can do it for €32,000 flat.',
        time: '09:20 AM',
        isCounterOffer: true,
        offerAmount: 32000,
        previousAmount: 35000
      }
    ]
  }
];

const quickEmojis = ['😊', '👍', '🚚', '📦', '💰', '🤝', '✍️', '🔥', '🚀', '💬', '📄', '🏷️', '✅', '📍', '🙌', '⭐'];

function ExpandableText({ text, limit = 120 }: { text: string; limit?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');

  const [isOpen, setIsOpen] = useState(false);
  const [showConvDropdown, setShowConvDropdown] = useState(false);
  const [showMoreActionsMenu, setShowMoreActionsMenu] = useState(false);
  const [showOfferBanner, setShowOfferBanner] = useState(true);

  const [inputValue, setInputValue] = useState('');

  // Dynamic Counter Offer Form State
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterPrice, setCounterPrice] = useState('38000');
  const [extraFees, setExtraFees] = useState<ExtraFeeItem[]>([]);
  const [counterNote, setCounterNote] = useState('');
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Composer Actions Popovers State & File Refs
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const moreActionsRef = useRef<HTMLDivElement>(null);
  const convDropdownRef = useRef<HTMLDivElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const totalUnreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c));
    setShowConvDropdown(false);
  };

  const handleGoToFullDetails = () => {
    setIsOpen(false);
    setShowMoreActionsMenu(false);
    navigate(`/customer/quotes/negotiation/conversation/${activeConv.negId}`);
  };

  const handleCopyQuoteId = () => {
    navigator.clipboard.writeText(activeConv.quoteId);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleInsertEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      senderName: 'You',
      text: `Uploaded photo: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: { type: 'image', url: imageUrl, name: file.name }
    };
    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, newMsg] } : c));
    e.target.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      senderName: 'You',
      text: `Attached file: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: { type: 'file', name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` }
    };
    setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, newMsg] } : c));
    e.target.value = '';
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      senderName: 'You',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, messages: [...c.messages, newMsg] };
      }
      return c;
    }));

    setInputValue('');
  };

  const handleSendCounterOffer = (e: React.FormEvent) => {
    e.preventDefault();
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

    const counterMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'customer',
      senderName: 'You',
      text: counterNote || `Proposing counter offer of €${grandTotal.toLocaleString()} (Base: €${basePriceNum.toLocaleString()}${feeBreakdownText}). Ready for immediate booking.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCounterOffer: true,
      offerAmount: grandTotal,
      previousAmount: parseFloat(activeConv.currentOffer.replace(/[^0-9.]/g, '')) || 40000,
      extraFeeItems: validExtraFees.length > 0 ? validExtraFees : undefined
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, counterMsg],
          currentOffer: `€${grandTotal.toLocaleString()}`
        };
      }
      return c;
    }));

    setShowCounterModal(false);
    setCounterNote('');
  };

  // Calculate live grand total for modal preview
  const liveTotalExtraFees = extraFees.reduce((sum, f) => sum + (parseFloat(f.amount) || 0), 0);
  const liveGrandTotal = (parseFloat(counterPrice) || 0) + liveTotalExtraFees;

  // Hide widget completely when on full Messages page
  if (location.pathname.includes('/messages')) {
    return null;
  }

  return (
    <>
      {/* Hidden File Input Elements */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        className="hidden"
      />

      {/* Floating Launcher Button Container */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-[#ff4a1f] hover:bg-[#e63d15] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white font-sans shrink-0"
            title={`Negotiation Chat (${totalUnreadCount} New)`}
          >
            <ChatIcon className="w-6 h-6 text-white shrink-0" />

            {totalUnreadCount > 0 ? (
              <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs font-black min-w-[24px] h-[24px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-20 font-sans">
                {totalUnreadCount}
              </span>
            ) : (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-xs z-10" />
            )}
          </button>
        </div>
      )}

      {/* Soft Dim Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Clean iOS Style Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 bg-white border border-slate-200/90 shadow-2xl rounded-3xl flex flex-col w-[94vw] sm:w-[460px] h-[640px] max-h-[85vh] font-sans antialiased overflow-hidden">

          {/* iOS Clean Header Bar */}
          <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 relative font-sans">

            {/* Supplier Avatar & Info */}
            <div className="flex items-center gap-3 min-w-0 font-sans">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs border border-slate-100 font-sans">
                  {activeConv.avatar}
                </div>
                {activeConv.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shrink-0" />
                )}
              </div>

              <div className="min-w-0 flex flex-col justify-center font-sans">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight font-sans">
                    {activeConv.supplierName}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-full border border-emerald-200/70 shrink-0 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                  <span className="text-slate-400 font-medium font-sans">Quote #{activeConv.quoteId}</span>
                  <button
                    onClick={handleCopyQuoteId}
                    className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Copy Quote ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
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
                  <div className="absolute top-10 right-0 w-64 sm:w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fade-in p-2 space-y-1 font-sans antialiased">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-800 tracking-tight flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1 font-sans">
                      <span>Active Negotiations</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-full font-sans">
                        {conversations.length}
                      </span>
                    </div>

                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`p-2.5 rounded-md cursor-pointer flex items-center justify-between transition-all font-sans ${conv.id === activeConvId
                            ? 'bg-orange-50/90 border border-orange-200/90 shadow-2xs'
                            : 'hover:bg-slate-50 border border-transparent'
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs font-sans ${conv.id === activeConvId ? 'bg-[#ff4a1f] text-white' : 'bg-slate-900 text-white'
                            }`}>
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
                    ))}
                  </div>
                )}
              </div>

              {/* More Actions Menu Button */}
              <div className="relative font-sans" ref={moreActionsRef}>
                <button
                  onClick={() => setShowMoreActionsMenu(!showMoreActionsMenu)}
                  className={`w-8 h-8 bg-slate-100 hover:bg-slate-200/80 rounded-full flex items-center justify-center transition-colors cursor-pointer text-slate-600 ${showMoreActionsMenu ? 'bg-orange-100 text-[#ff4a1f]' : ''
                    }`}
                  title="More Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {showMoreActionsMenu && (
                  <div className="absolute top-10 right-0 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fade-in py-1.5 text-[11px] font-sans antialiased">

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
                          setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, isPinned: !c.isPinned } : c));
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
                        navigate(`/customer/quotes/negotiation/conversation/${activeConv?.negId || 1}`);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      <span>Negotiation History</span>
                    </button>

                    <button
                      onClick={() => setShowMoreActionsMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Download Quote PDF</span>
                    </button>

                    <button
                      onClick={() => setShowMoreActionsMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                      <span>Export Conversation</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => { setShowMoreActionsMenu(false); alert('Notifications Settings'); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <Bell className="w-3.5 h-3.5 text-slate-400" />
                      <span>Notification Settings</span>
                    </button>

                    <button
                      onClick={() => { setShowMoreActionsMenu(false); alert('Link Copied'); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer font-sans"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Share Quote</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => { setShowMoreActionsMenu(false); alert('Archived'); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer font-semibold font-sans"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Archive Conversation</span>
                    </button>

                  </div>
                )}
              </div>

              {/* Close Cross Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Middle Content Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-3.5 space-y-3 font-sans bg-[#f8fafc]">

            {/* iOS Style Compact Hero Offer Card */}
            {showOfferBanner && (
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 shrink-0 relative pr-7 font-sans">

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
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans">Current Offer</p>
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
                    onClick={() => {
                      const acceptMsg: ChatMessage = {
                        id: Date.now().toString(),
                        sender: 'customer',
                        senderName: 'You',
                        text: `Offer accepted at ${activeConv.currentOffer}! Proceeding to booking.`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, messages: [...c.messages, acceptMsg] } : c));
                    }}
                    className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e63d15] text-white font-semibold text-xs rounded-full shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1 font-sans"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            )}

            {/* Compact iOS Counter Offer Modal Form */}
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
                    placeholder="e.g. Fast booking"
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
                    <div className="p-2 bg-slate-50/60 rounded-md border border-dashed border-slate-200 text-center text-[10.5px] text-slate-400 font-normal font-sans">
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
                              className="h-7 text-[11px] font-semibold bg-white border-slate-200 rounded-lg font-sans"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExtraFeeRow(fee.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer shrink-0"
                            title="Remove fee"
                          >
                            <CloseIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <Input
                          placeholder="Description (e.g. Forklift & helper)"
                          value={fee.description || ''}
                          onChange={(e) => handleExtraFeeChange(fee.id, 'description', e.target.value)}
                          className="h-6 text-[10.5px] bg-white border-slate-200 rounded-lg font-sans font-normal"
                        />
                      </div>
                    ))
                  )}
                </div>

                {/* Calculation Summary Card */}
                <div className="bg-[#f8fafc] p-2.5 rounded-md border border-slate-200/80 space-y-1 text-[11px] font-sans">
                  <div className="flex items-center justify-between text-slate-600 font-sans">
                    <span>Base Offer:</span>
                    <span className="font-semibold text-slate-800 font-sans">€{(parseFloat(counterPrice) || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 font-sans">
                    <span>Extra Fees Total:</span>
                    <span className="font-semibold text-slate-800 font-sans">+€{liveTotalExtraFees.toLocaleString()}</span>
                  </div>

                  <div className="pt-1 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900 font-sans">
                    <span className="text-slate-800 font-bold font-sans">Grand Total:</span>
                    <span className="font-bold text-xs text-[#ff4a1f] bg-white px-2 py-0.5 rounded-md border border-slate-200 font-sans">
                      €{liveGrandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-0.5 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowCounterModal(false)}
                    className="px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 bg-[#ff4a1f] hover:bg-[#e63d15] text-white text-[11px] font-semibold rounded-full shadow-2xs cursor-pointer flex items-center gap-1 font-sans"
                  >
                    <SendIcon className="w-3 h-3" />
                    <span>Submit Counter</span>
                  </button>
                </div>
              </form>
            )}

            {/* Chat Timeline Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-0.5 font-sans">

              {/* Dotted Timeline Separator */}
              <div className="relative flex items-center justify-center my-3 font-sans">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative px-3 py-0.5 bg-slate-200/60 text-slate-600 text-[10px] font-medium rounded-full font-sans">
                  Today
                </span>
              </div>

              {activeConv.messages.map((msg) => {
                const isMe = msg.sender === 'customer';
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'} font-sans`}>
                    {/* Avatar */}
                    <div className="shrink-0 mt-0.5 font-sans">
                      {isMe ? (
                        <div className="w-7 h-7 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center shadow-2xs font-sans">
                          <UserIcon className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shadow-2xs font-sans">
                          {activeConv.avatar}
                        </div>
                      )}
                    </div>

                    {/* Message Bubble Container */}
                    <div className={`max-w-[85%] space-y-1 ${isMe ? 'items-end text-right' : 'items-start text-left'} font-sans`}>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-0.5 font-sans">
                        <span className="font-semibold text-slate-700 font-sans">{msg.senderName}</span>
                        <span className="font-sans">{msg.time}</span>
                      </div>

                      {/* Counter Offer Card Bubble */}
                      {msg.isCounterOffer && msg.offerAmount && (
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5 font-sans">
                          <div className="p-2.5 bg-emerald-50/80 rounded-md border border-emerald-200/70 space-y-2 font-sans">
                            <div className="flex items-center justify-between gap-2.5 font-sans">
                              <div className="flex items-center gap-2.5 font-sans">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                  <Tag className="w-3.5 h-3.5" />
                                </div>
                                <div className="text-left font-sans">
                                  <p className="text-[10px] font-semibold text-emerald-800 font-sans">Total Counter Offer</p>
                                  <p className="text-base font-bold text-slate-900 font-sans">€{msg.offerAmount.toLocaleString()}</p>
                                </div>
                              </div>

                              {msg.previousAmount && (
                                <div className="text-right font-sans">
                                  <p className="text-[10px] text-slate-400 line-through font-sans">€{msg.previousAmount.toLocaleString()}</p>
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-semibold text-[9px] rounded-full font-sans">
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
                          </div>

                          <div className="text-xs text-slate-700 leading-relaxed text-left font-sans">
                            <ExpandableText text={msg.text} limit={120} />
                          </div>
                        </div>
                      )}

                      {/* Attachments */}
                      {msg.attachment && (
                        <div className="mt-1 font-sans">
                          {msg.attachment.type === 'image' && msg.attachment.url && (
                            <div className="rounded-md overflow-hidden border border-slate-200 max-w-xs shadow-2xs bg-white">
                              <img src={msg.attachment.url} alt={msg.attachment.name} className="max-h-44 w-full object-cover" />
                              <p className="p-1.5 text-[10px] text-slate-500 font-normal bg-slate-50 border-t border-slate-100 truncate">
                                {msg.attachment.name}
                              </p>
                            </div>
                          )}
                          {msg.attachment.type === 'file' && (
                            <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-slate-200 shadow-2xs max-w-xs text-left">
                              <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#ff4a1f] flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-800 truncate">{msg.attachment.name}</p>
                                <p className="text-[10px] text-slate-400">{msg.attachment.size}</p>
                              </div>
                              <Download className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Standard Message Bubble */}
                      {!msg.isCounterOffer && (
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed text-left shadow-2xs font-sans ${isMe
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
              })}
              <div ref={messagesEndRef} />
            </div>

          </div>

          {/* Full-Width iOS Footer Message Composer */}
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
                    className={`p-1.5 transition-colors cursor-pointer flex items-center justify-center rounded-full ${showPlusMenu ? 'text-[#ff4a1f] bg-orange-50' : 'text-slate-400 hover:text-[#ff4a1f]'
                      }`}
                    title="Quick Actions Menu"
                  >
                    <PlusCircle className="w-5 h-5" />
                  </button>

                  {/* Quick Actions Popover */}
                  {showPlusMenu && (
                    <div className="absolute bottom-9 left-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-fade-in py-1 text-[11px] font-sans antialiased">
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
                          setInputValue(prev => prev + ' 📍 Location: Origin Terminal London Gateway');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-orange-50 hover:text-[#ff4a1f] transition-colors text-left cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Share Location</span>
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

              {/* iOS Style Input Field */}
              <div className="relative flex-1 flex items-center font-sans" ref={emojiPickerRef}>
                <input
                  type="text"
                  placeholder="Aa"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full h-9 pl-3.5 pr-8 text-xs bg-[#f1f5f9] border border-slate-200/60 rounded-full focus:outline-none focus:bg-white focus:border-[#ff4a1f] text-[#202223] placeholder:text-slate-400 font-normal font-sans antialiased"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowPlusMenu(false);
                  }}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors cursor-pointer flex items-center justify-center p-0.5 rounded-full ${showEmojiPicker ? 'text-[#ff4a1f]' : 'text-slate-400 hover:text-[#ff4a1f]'
                    }`}
                  title="Insert Emoji"
                >
                  <SmileIcon className="w-4 h-4" />
                </button>

                {/* Emoji Picker Popover */}
                {showEmojiPicker && (
                  <div className="absolute bottom-11 right-0 w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-fade-in p-2.5 font-sans antialiased">
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

              {/* iOS Circular Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-8 h-8 bg-[#ff4a1f] hover:bg-[#e63d15] text-white disabled:opacity-30 rounded-full transition-all duration-200 hover:scale-105 shadow-2xs cursor-pointer shrink-0 flex items-center justify-center disabled:hover:scale-100"
                title="Send Message"
              >
                <SendIcon className="w-4 h-4" />
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
