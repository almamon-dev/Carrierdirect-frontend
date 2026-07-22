import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Phone, Video, Info, Search, User, ChevronDown, FileText, CheckCircle2, BadgeCheck, Pin, PinOff, Pencil, Trash2, Check, X, ChevronLeft, ChevronRight, Ban
} from 'lucide-react';
import Button from '@/components/ui/button';

// Imported modular components
import CounterOfferMessage from '@/modules/Customer/QuoteManagement/Negotiation/CounterOffer';
import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';
import ChatInputActions from '@/modules/Customer/QuoteManagement/Negotiation/Actions';

export default function SupplierNegotiationChat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChatId, setActiveChatId] = useState(1);

    const [editingMsgId, setEditingMsgId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');
    const [highlightedMsgId, setHighlightedMsgId] = useState<number | null>(null);
    const [activePinnedIndex, setActivePinnedIndex] = useState(0);

    const [openSections, setOpenSections] = useState({
        overview: true,
        logistics: false,
        pricing: true, // Always open by default as requested
        history: true,
        documents: false,
        privacy: false
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const [chats, setChats] = useState([
        { id: 1, name: 'ABC Logistics', avatar: 'A', preview: 'Submitted counter offer € 40,000', time: '10:30 AM', unreadCount: 2, unread: true, active: true, quoteNo: 'QT-8822', baseFreight: '€ 40,000', isVerified: true, isPinned: true },
        { id: 2, name: 'Global Freight', avatar: 'G', preview: 'We are waiting for your response.', time: 'Yesterday', unreadCount: 0, unread: false, active: false, quoteNo: 'QT-8823', baseFreight: '€ 32,000', isVerified: true, isPinned: false },
        { id: 3, name: 'Mega Shippers', avatar: 'M', preview: 'When can you pick up the cargo?', time: 'Tue 04:15 PM', unreadCount: 0, unread: false, active: false, quoteNo: 'QT-8824', baseFreight: '€ 35,000', isVerified: false, isPinned: false },
        { id: 4, name: 'Delta Cargo', avatar: 'D', preview: 'Thanks for the quick delivery!', time: 'Mon 11:20 AM', unreadCount: 1, unread: true, active: false, quoteNo: 'QT-8825', baseFreight: '€ 38,000', isVerified: true, isPinned: false },
    ]);

    const togglePinChat = (e: React.MouseEvent, chatId: number) => {
        e.stopPropagation();
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
    };

    const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

    const [chatMessages, setChatMessages] = useState<Record<number, any[]>>({
        1: [
            { id: 1, type: 'system', text: 'Negotiation started for Quote QT-8822', time: '10:00 AM, Today' },
            { id: 2, type: 'received', sender: 'ABC Logistics', text: 'Hello! We received your counter offer.', time: '10:04 AM', avatar: 'A' },
            { id: 3, type: 'received', sender: 'ABC Logistics', text: 'We are reviewing the breakdown.', time: '10:05 AM', avatar: 'A' },
            { id: 4, type: 'sent', text: 'Please let us know if you accept € 40,000.', time: '10:14 AM' },
            { id: 9, type: 'offer', title: 'New Counter Offer Received', text: 'Customer submitted counter offer for € 40,000 total.', time: '10:30 AM', newTotal: 40000, previousTotal: 42500 }
        ],
        2: [
            { id: 1, type: 'system', text: 'Negotiation started for Quote QT-8823', time: 'Yesterday' },
            { id: 2, type: 'received', sender: 'Global Freight', text: 'We are waiting for your response.', time: 'Yesterday 04:30 PM', avatar: 'G' },
        ],
        3: [
            { id: 1, type: 'system', text: 'Negotiation started for Quote QT-8824', time: 'Tue 02:00 PM' },
            { id: 2, type: 'received', sender: 'Mega Shippers', text: 'When can you pick up the cargo?', time: 'Tue 04:15 PM', avatar: 'M' },
        ],
        4: [
            { id: 1, type: 'system', text: 'Negotiation started for Quote QT-8825', time: 'Mon 09:00 AM' },
            { id: 2, type: 'received', sender: 'Delta Cargo', text: 'Thanks for the quick delivery!', time: 'Mon 11:20 AM', avatar: 'D' },
        ]
    });

    const handleTogglePinMessage = (msgId: number) => {
        setChatMessages(prev => ({
            ...prev,
            [activeChatId]: (prev[activeChatId] || []).map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m)
        }));
    };

    const handleDeleteMessage = (msgId: number) => {
        setChatMessages(prev => ({
            ...prev,
            [activeChatId]: (prev[activeChatId] || []).map(m => m.id === msgId ? { ...m, isDeleted: true, isPinned: false } : m)
        }));
    };

    const handleStartEdit = (msg: any) => {
        setEditingMsgId(msg.id);
        setEditingText(msg.text);
        setInputValue(msg.text);
    };

    const handleCancelEdit = () => {
        setEditingMsgId(null);
        setEditingText('');
        setInputValue('');
    };

    const handleSaveEdit = (msgId: number) => {
        if (!editingText.trim()) return;
        setChatMessages(prev => ({
            ...prev,
            [activeChatId]: (prev[activeChatId] || []).map(m => m.id === msgId ? { ...m, text: editingText, isEdited: true } : m)
        }));
        setEditingMsgId(null);
        setEditingText('');
    };

    const scrollToPinnedMessage = (msgId: number) => {
        const el = document.getElementById(`msg-bubble-${msgId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedMsgId(msgId);
            setTimeout(() => setHighlightedMsgId(null), 2500);
        }
    };

    const currentMessages = chatMessages[activeChatId] || [];

    const handleSelectChat = (chatId: number) => {
        setActiveChatId(chatId);
        // Mark as read when selected
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, unread: false, unreadCount: 0 } : c));
    };

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        if (editingMsgId) {
            setChatMessages(prev => ({
                ...prev,
                [activeChatId]: (prev[activeChatId] || []).map(m => m.id === editingMsgId ? { ...m, text: text, isEdited: true } : m)
            }));
            setEditingMsgId(null);
            setEditingText('');
            setInputValue('');
            return;
        }

        const newMsg = {
            id: Date.now(),
            type: 'sent',
            text: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newMsg]
        }));
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, preview: text, time: 'Just now' } : c));
        setInputValue('');
        setTimeout(scrollToBottom, 100);
    };

    const handleSendCounterOffer = (amount: number, note: string) => {
        const newOfferMsg = {
            id: Date.now(),
            type: 'offer',
            title: 'Counter Offer Submitted',
            text: note || `You submitted a counter offer for € ${amount.toLocaleString()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newTotal: amount,
            previousTotal: 45000
        };
        setChatMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), newOfferMsg]
        }));
        setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, preview: `Counter offer sent: € ${amount.toLocaleString()}`, time: 'Just now' } : c));
        setTimeout(scrollToBottom, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChatId]);

    const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');

    const filteredChats = chats
        .filter(chat => {
            const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
            if (filterTab === 'unread') {
                return matchesSearch && (chat.unread || chat.unreadCount > 0);
            }
            return matchesSearch;
        })
        .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    const unreadCountTotal = chats.filter(c => c.unread || c.unreadCount > 0).length;

    return (
        <div className="p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] flex flex-col font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[500px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            
            {/* Left Sidebar: Chats List */}
            <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col min-h-0 h-full bg-white border-r border-slate-200">
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-2" onClick={() => navigate(-1)}>
                            <ArrowLeft size={18} />
                        </Button>
                        <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">Negotiations</h2>
                    </div>
                </div>
                
                <div className="px-4 pt-3 pb-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search negotiations..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 text-slate-700 placeholder-slate-400" 
                        />
                    </div>
                </div>

                <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <button 
                        type="button"
                        onClick={() => setFilterTab('all')}
                        className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer transition-colors ${
                            filterTab === 'all' 
                            ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'
                        }`}
                    >
                        All
                    </button>
                    <button 
                        type="button"
                        onClick={() => setFilterTab('unread')}
                        className={`rounded-full px-3.5 py-1 text-[11.5px] cursor-pointer whitespace-nowrap transition-colors ${
                            filterTab === 'unread' 
                            ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80 font-bold shadow-2xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80 font-semibold'
                        }`}
                    >
                        Unread {unreadCountTotal > 0 && `(${unreadCountTotal})`}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredChats.map((chat) => {
                        const isActive = chat.id === activeChatId;
                        return (
                            <div 
                                key={chat.id} 
                                onClick={() => handleSelectChat(chat.id)}
                                className={`p-2.5 rounded-xl cursor-pointer flex gap-3 items-center group relative transition-all mt-1 ${isActive ? 'bg-slate-100/80 border border-slate-200/80 shadow-2xs' : 'hover:bg-slate-50 border border-transparent'}`}
                            >
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-base shrink-0 relative transition-colors ${isActive ? 'bg-orange-50 text-[#FF4A1F] border border-orange-200/80' : 'bg-slate-100 text-slate-700 border border-slate-200/60'}`}>
                                    {chat.avatar}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <h4 className={`text-[13px] truncate ${isActive ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{chat.name}</h4>
                                            {chat.isVerified && (
                                                <span title="Verified Account"><BadgeCheck size={14} className="text-[#FF4A1F] shrink-0" /></span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 ml-1">
                                            {chat.isPinned && (
                                                <Pin size={12} className="text-[#FF4A1F] fill-[#FF4A1F] rotate-45 shrink-0" title="Pinned Conversation" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => togglePinChat(e, chat.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-[#FF4A1F] p-0.5 rounded cursor-pointer"
                                                title={chat.isPinned ? "Unpin chat" : "Pin chat to top"}
                                            >
                                                {chat.isPinned ? <PinOff size={12} /> : <Pin size={12} />}
                                            </button>
                                            <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-1">
                                        <p className={`text-[11.5px] truncate ${chat.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{chat.preview}</p>
                                        {chat.unreadCount > 0 && (
                                            <span className="px-1.5 py-0.5 rounded-full bg-[#FF4A1F] text-[#FFFFFF] text-[10px] font-bold shrink-0">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {filteredChats.length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-sm">No negotiations found.</div>
                    )}
                </div>
            </div>

            {/* Middle: Chat Area */}
            <div className="lg:col-span-8 xl:col-span-6 flex flex-col min-h-0 h-full bg-white relative">
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between z-10 sticky top-0 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF4A1F] text-white rounded-full flex items-center justify-center font-bold text-lg relative">
                            {activeChat.avatar}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-[15px] font-bold text-slate-800">{activeChat.name}</h2>
                                {activeChat.isVerified && (
                                    <span className="inline-flex items-center gap-1 bg-orange-50 text-[#FF4A1F] border border-orange-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        <BadgeCheck size={13} className="text-[#FF4A1F]" />
                                        Verified
                                    </span>
                                )}
                            </div>
                            <div className="text-[12px] text-slate-500 font-medium mt-0.5">Active now • {activeChat.quoteNo}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 hidden sm:flex">
                            <Phone size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100 hidden sm:flex">
                            <Video size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-600 rounded-full hover:bg-slate-100">
                            <Info size={18} />
                        </Button>
                    </div>
                </div>

                {/* Pinned Messages Banner */}
                {(() => {
                    const pinnedMessages = currentMessages.filter(m => m.isPinned);
                    if (pinnedMessages.length === 0) return null;
                    const safeIndex = activePinnedIndex % pinnedMessages.length;
                    const currentPinned = pinnedMessages[safeIndex];

                    return (
                        <div 
                            onClick={() => scrollToPinnedMessage(currentPinned.id)}
                            className="bg-orange-50/90 border-b border-orange-200/80 px-4 py-2 flex items-center justify-between text-xs z-10 shrink-0 cursor-pointer hover:bg-orange-100/80 transition-colors"
                            title="Click to jump to pinned message"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Pin size={13} className="text-[#FF4A1F] fill-[#FF4A1F] rotate-45 shrink-0" />
                                <span className="font-bold text-slate-800 shrink-0">
                                    Pinned Message {pinnedMessages.length > 1 && `(${safeIndex + 1}/${pinnedMessages.length})`}:
                                </span>
                                <span className="text-slate-600 truncate font-medium">{currentPinned.text}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                {pinnedMessages.length > 1 && (
                                    <div className="flex items-center gap-1 mr-1">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const prevIdx = (safeIndex - 1 + pinnedMessages.length) % pinnedMessages.length;
                                                setActivePinnedIndex(prevIdx);
                                                scrollToPinnedMessage(pinnedMessages[prevIdx].id);
                                            }}
                                            className="p-0.5 rounded hover:bg-orange-200/60 text-slate-600 cursor-pointer"
                                            title="Previous pinned message"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const nextIdx = (safeIndex + 1) % pinnedMessages.length;
                                                setActivePinnedIndex(nextIdx);
                                                scrollToPinnedMessage(pinnedMessages[nextIdx].id);
                                            }}
                                            className="p-0.5 rounded hover:bg-orange-200/60 text-slate-600 cursor-pointer"
                                            title="Next pinned message"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                                <span className="text-[11px] font-bold text-[#FF4A1F] underline">View</span>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTogglePinMessage(currentPinned.id);
                                    }}
                                    className="text-slate-400 hover:text-slate-700 text-[11px] font-bold underline cursor-pointer"
                                >
                                    Unpin
                                </button>
                            </div>
                        </div>
                    );
                })()}

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {currentMessages.map((msg, index) => {
                        const prevMsg = index > 0 ? currentMessages[index - 1] : null;
                        const nextMsg = index < currentMessages.length - 1 ? currentMessages[index + 1] : null;
                        
                        const isFirstInGroup = !prevMsg || prevMsg.type !== msg.type || prevMsg.sender !== msg.sender;
                        const isLastInGroup = !nextMsg || nextMsg.type !== msg.type || nextMsg.sender !== msg.sender;

                        const spacingClass = isFirstInGroup ? 'mt-5' : 'mt-1';

                        if (msg.type === 'system') {
                            return (
                                <div key={msg.id} className={`flex justify-center ${spacingClass}`}>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        {msg.text} • {msg.time}
                                    </span>
                                </div>
                            );
                        }

                        if (msg.type === 'offer') {
                            return (
                                <div key={msg.id} className={spacingClass}>
                                    <CounterOfferMessage msg={msg} />
                                </div>
                            );
                        }

                        const isSent = msg.type === 'sent';
                        const isEditing = editingMsgId === msg.id;
                        const isHighlighted = highlightedMsgId === msg.id;

                        if (msg.isDeleted) {
                            return (
                                <div key={msg.id} className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass}`}>
                                    <div className="px-3.5 py-1.5 rounded-2xl text-[12.5px] italic text-slate-400 border border-slate-200/80 bg-slate-50 flex items-center gap-1.5 font-medium shadow-2xs">
                                        <Ban size={13} className="text-slate-400 shrink-0" />
                                        <span>{isSent ? 'You deleted this message' : 'This message was deleted'}</span>
                                    </div>
                                </div>
                            );
                        }

                        let borderRadiusClasses = 'rounded-2xl';
                        if (isSent) {
                            if (!isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tr-sm rounded-br-sm';
                            else if (!isFirstInGroup && isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tr-sm';
                            else if (isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-br-sm';
                        } else {
                            if (!isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tl-sm rounded-bl-sm';
                            else if (!isFirstInGroup && isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-tl-sm';
                            else if (isFirstInGroup && !isLastInGroup) borderRadiusClasses = 'rounded-2xl rounded-bl-sm';
                        }

                        return (
                            <div key={msg.id} className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass} group relative`}>
                                {!isSent && (
                                    <div className="w-7 h-7 flex-shrink-0 mt-auto">
                                        {isLastInGroup && (
                                            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                                                {msg.avatar || activeChat.avatar}
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
                                    
                                    {/* Floating Action Toolbar on Left for sent, Right for received */}
                                    {!isEditing && (
                                        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white border border-slate-200/90 rounded-full px-1.5 py-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 ${
                                            isSent ? 'right-full mr-2.5' : 'left-full ml-2.5'
                                        }`}>
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePinMessage(msg.id)}
                                                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                                    msg.isPinned 
                                                    ? 'bg-orange-100 text-[#FF4A1F]' 
                                                    : 'text-slate-500 hover:text-[#FF4A1F] hover:bg-orange-50'
                                                }`}
                                                title={msg.isPinned ? "Unpin message" : "Pin message"}
                                            >
                                                <Pin size={13} className={msg.isPinned ? 'fill-[#FF4A1F] rotate-45' : ''} />
                                            </button>

                                            {isSent && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartEdit(msg)}
                                                        className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        title="Edit message"
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="p-1.5 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Delete message"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Corner Pinned Indicator Badge */}
                                    {msg.isPinned && (
                                        <div 
                                            className={`absolute -top-1.5 ${isSent ? '-left-1.5' : '-right-1.5'} w-4.5 h-4.5 bg-[#FF4A1F] text-white rounded-full flex items-center justify-center shadow-xs z-10`}
                                            title="Pinned Message"
                                        >
                                            <Pin size={9} className="fill-white rotate-45" />
                                        </div>
                                    )}

                                    <div className={`relative px-4 py-2 text-[14px] leading-relaxed whitespace-pre-wrap break-words ${borderRadiusClasses} ${
                                        isSent 
                                        ? 'bg-[#FF4A1F] text-white font-medium' 
                                        : 'bg-slate-100 text-slate-900 font-medium'
                                    }`}>
                                        {msg.text}
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
                    })}
                    <div ref={messagesEndRef} className="mt-4" />
                </div>

                {/* Chat Input Area Component */}
                <ChatInputActions 
                    inputValue={inputValue} 
                    setInputValue={setInputValue} 
                    scrollToBottom={scrollToBottom}
                    onSendMessage={handleSendMessage}
                    onSendCounterOffer={handleSendCounterOffer}
                    isSupplier={true}
                    isEditing={!!editingMsgId}
                    onCancelEdit={handleCancelEdit}
                />
            </div>

            {/* Right Sidebar: Quote Details */}
            <div className="hidden xl:flex xl:col-span-3 flex-col min-h-0 h-full bg-white overflow-y-auto border-l border-slate-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex flex-col items-center pt-8 pb-4">
                    <div className="w-20 h-20 rounded-full bg-orange-50 text-[#FF4A1F] border border-orange-200 flex items-center justify-center font-bold text-3xl mb-3 relative shadow-2xs">
                        {activeChat.avatar}
                        <div className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-1 justify-center">
                        <h3 className="text-[14px] font-bold text-slate-800">{activeChat.name}</h3>
                        {activeChat.isVerified && (
                            <span title="Verified Account"><BadgeCheck size={16} className="text-[#FF4A1F]" /></span>
                        )}
                    </div>
                    <p className="text-[11px] font-semibold text-[#FF4A1F] mt-0.5">{activeChat.quoteNo}</p>

                    {activeChat.isVerified && (
                        <span className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            Verified Partner
                        </span>
                    )}

                    <div className="flex items-center gap-6 mt-5">
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors">
                                <User size={18} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600">Profile</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors">
                                <FileText size={18} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600">Documents</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF4A1F] transition-colors">
                                <Phone size={18} />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600">Call</span>
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex flex-col">
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors border-t border-slate-100"
                            onClick={() => toggleSection('overview')}
                        >
                            <span className="text-[13px] font-bold text-slate-800">Quote Overview ({activeChat.quoteNo})</span>
                            <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.overview ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.overview && (
                            <div className="px-5 pb-3">
                                <div className="text-[12px] space-y-2.5">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Status</span>
                                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[11px]">In Negotiation</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Created</span>
                                        <span className="font-medium text-slate-800">2026-07-20 09:00 AM</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logistics Details Section */}
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors border-t border-slate-100"
                            onClick={() => toggleSection('logistics')}
                        >
                            <span className="text-[13px] font-bold text-slate-800">Logistics Details</span>
                            <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.logistics && (
                            <div className="px-5 pb-3">
                                <div className="text-[12px] space-y-2.5">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Vehicle</span>
                                        <span className="font-medium text-slate-800">Covered Van (14ft)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Pickup Date</span>
                                        <span className="font-medium text-slate-800">2026-07-28</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Delivery Date</span>
                                        <span className="font-medium text-slate-800">2026-07-30</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Labor</span>
                                        <span className="font-medium text-slate-800">2 Persons</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pricing Section (Always Open) */}
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors border-t border-slate-100"
                            onClick={() => toggleSection('pricing')}
                        >
                            <span className="text-[13px] font-bold text-slate-800">Pricing & Counter Offers</span>
                            <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.pricing && (
                            <div className="px-5 pb-3">
                                <div className="text-[12px]">
                                    <div className="space-y-2.5 mb-2.5 pb-2.5 border-b border-slate-100">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Base Freight</span>
                                            <span className="font-bold text-slate-800">{activeChat.baseFreight}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Load/Unload</span>
                                            <span className="font-medium text-slate-800">€ 3,500</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Insurance</span>
                                            <span className="font-medium text-slate-800">€ 1,500</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="font-bold text-slate-800">Current Total</span>
                                        <span className="text-[14px] font-bold text-[#FF4A1F]">€ 40,000</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Negotiation History Section */}
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors border-t border-slate-100"
                            onClick={() => toggleSection('history')}
                        >
                            <span className="text-[13px] font-bold text-slate-800">Negotiation History</span>
                            <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.history ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.history && (
                            <div className="px-5 pb-3">
                                <div className="space-y-3 text-[11.5px] border-l-2 border-slate-200 pl-3.5 ml-1 my-1">
                                    <div className="relative">
                                        <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                                        <p className="font-bold text-slate-700">Initial Quote (€ 45,000)</p>
                                        <p className="text-slate-400 text-[10.5px]">2026-07-20 09:00 AM</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white"></div>
                                        <p className="font-bold text-amber-700">Customer Counter (€ 42,500)</p>
                                        <p className="text-slate-400 text-[10.5px]">2026-07-20 02:15 PM</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[18px] top-1 w-2.5 h-2.5 rounded-full bg-[#FF4A1F] border-2 border-white"></div>
                                        <p className="font-bold text-[#FF4A1F]">Current Offer (€ 40,000)</p>
                                        <p className="text-slate-400 text-[10.5px]">Today 10:30 AM</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors border-t border-slate-100"
                            onClick={() => toggleSection('documents')}
                        >
                            <span className="text-[13px] font-bold text-slate-800">Media & Documents</span>
                            <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.documents && (
                            <div className="px-5 pb-3">
                                <AttachmentsList />
                            </div>
                        )}
                    </div>

                    {/* Privacy & Support Section */}
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors border-t border-slate-100"
                            onClick={() => toggleSection('privacy')}
                        >
                            <span className="text-[13px] font-bold text-slate-800">Privacy & Support</span>
                            <ChevronDown size={16} className={`text-slate-400 group-hover:text-slate-[#FF4A1F] transition-transform ${openSections.privacy ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.privacy && (
                            <div className="px-4 pb-3">
                                <p className="text-[12px] text-slate-500 text-center py-2">No active reports or issues.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            </div>
        </div>
    );
}
