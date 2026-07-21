import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Phone, Video, Info, Search, User, ChevronDown, FileText
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

// Imported modular components from Customer side to reuse
import CounterOfferMessage from '@/modules/Customer/QuoteManagement/Negotiation/CounterOffer';
import AttachmentsList from '@/modules/Customer/QuoteManagement/Negotiation/Attachments';
import ChatInputActions from '@/modules/Customer/QuoteManagement/Negotiation/Actions';

export default function SupplierNegotiationChat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [openSections, setOpenSections] = useState({
        overview: false,
        logistics: false,
        pricing: false,
        documents: false,
        privacy: false
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, []);

    const chats = [
        { id: 1, name: 'ABC Logistics', avatar: 'A', preview: 'ABC Logistics has submitted a new...', time: '10:30 AM', unread: true, active: true },
        { id: 2, name: 'Global Freight', avatar: 'G', preview: 'We are waiting for your response.', time: 'Yesterday', unread: false, active: false },
        { id: 3, name: 'Mega Shippers', avatar: 'M', preview: 'When can you pick up the cargo?', time: 'Tue', unread: false, active: false },
        { id: 4, name: 'Delta Cargo', avatar: 'D', preview: 'Thanks for the quick delivery!', time: 'Mon', unread: true, active: false },
    ];

    const filteredChats = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const messages = [
        { id: 1, type: 'system', text: 'Negotiation started for Quote QT-8822', time: '10:00 AM, Today' },
        { id: 2, type: 'sent', text: 'Hello! I saw your request for reducing the base freight.', time: '10:04 AM' },
        { id: 3, type: 'sent', text: 'We can offer a maximum discount of 2,500 €.', time: '10:05 AM' },
        { id: 4, type: 'received', sender: 'ABC Logistics', text: 'Hi, thanks for reaching out.', time: '10:14 AM', avatar: 'A' },
        { id: 5, type: 'received', sender: 'ABC Logistics', text: '2,500 € discount is good, but could we round the total down to 40,000 € flat?', time: '10:15 AM', avatar: 'A' },
        { id: 6, type: 'received', sender: 'ABC Logistics', text: 'That would really help us close this deal quickly.', time: '10:16 AM', avatar: 'A' },
        { id: 7, type: 'sent', text: 'Let me check with my manager if we can authorize that.', time: '10:17 AM' },
        { id: 8, type: 'sent', text: 'Give me a moment.', time: '10:18 AM' },
        { id: 9, type: 'offer', title: 'New Counter Offer Received', text: 'ABC Logistics has submitted a new offer for 40,000 € total.', time: '10:30 AM', newTotal: 40000, previousTotal: 42500 }
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[500px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            
            {/* Left Sidebar: Chats List */}
            <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col min-h-0 h-full bg-white border-r border-slate-200">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 rounded-full hover:bg-slate-100 -ml-2" onClick={() => navigate(-1)}>
                            <ArrowLeft size={18} />
                        </Button>
                        <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">Chats</h2>
                    </div>
                </div>
                
                <div className="px-4 pb-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search Messenger" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-[36px] pl-9 pr-4 text-[13px] bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 placeholder-slate-500" 
                        />
                    </div>
                </div>

                <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <Badge variant="secondary" className="bg-brand-light text-indigo-700 hover:bg-indigo-100 border-none rounded-full px-3 py-1 font-semibold cursor-pointer">All</Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none rounded-full px-3 py-1 font-semibold cursor-pointer whitespace-nowrap">Unread</Badge>
                </div>

                <div className="flex-1 overflow-y-auto px-2 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredChats.map((chat, idx) => (
                        <div key={chat.id} className={`p-2 rounded-lg cursor-pointer flex gap-3 items-center group relative ${idx > 0 ? 'mt-1' : ''} ${chat.active ? 'bg-brand-light/50' : 'hover:bg-slate-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 relative ${chat.active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                                {chat.avatar}
                                {chat.active && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-[14px] truncate ${chat.active ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{chat.name}</h4>
                                <p className={`text-[12px] truncate ${chat.unread ? 'font-medium text-slate-600' : 'text-slate-500'}`}>{chat.preview}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-[10px] ${chat.active ? 'text-slate-500 font-medium' : 'text-slate-400 font-medium'}`}>{chat.time}</span>
                                {chat.unread && <div className="w-2.5 h-2.5 rounded-full bg-brand"></div>}
                            </div>
                        </div>
                    ))}
                    
                    {filteredChats.length === 0 && (
                        <div className="text-center py-8 text-slate-500 text-sm">No chats found.</div>
                    )}
                </div>
            </div>

            {/* Middle: Chat Area */}
            <div className="lg:col-span-8 xl:col-span-6 flex flex-col min-h-0 h-full bg-white relative">
                {/* Chat Header */}
                <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg relative">
                            A
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-slate-800">ABC Logistics</h2>
                            <div className="text-[12px] text-slate-500 font-medium mt-0.5">Active now</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-brand rounded-full hover:bg-slate-100 hidden sm:flex">
                            <Phone size={20} fill="currentColor" className="text-brand" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-brand rounded-full hover:bg-slate-100 hidden sm:flex">
                            <Video size={22} fill="currentColor" className="text-brand" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-brand rounded-full hover:bg-slate-100">
                            <Info size={22} className="text-brand" />
                        </Button>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {messages.map((msg, index) => {
                        const prevMsg = index > 0 ? messages[index - 1] : null;
                        const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
                        
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
                            <div key={msg.id} className={`flex gap-2.5 ${isSent ? 'justify-end' : 'justify-start'} ${spacingClass}`}>
                                {!isSent && (
                                    <div className="w-7 h-7 flex-shrink-0 mt-auto">
                                        {isLastInGroup && (
                                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                {msg.avatar}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                                    <div className={`relative px-4 py-2 text-[14.5px] leading-relaxed ${borderRadiusClasses} ${
                                        isSent 
                                        ? 'bg-brand text-white' 
                                        : 'bg-slate-100 text-slate-900'
                                    }`}>
                                        {msg.text}
                                    </div>
                                    {isLastInGroup && (
                                        <span className="text-[10px] text-slate-400 font-medium mt-1.5 px-1">{msg.time}</span>
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
                />
            </div>

            {/* Right Sidebar: Quote Details */}
            <div className="hidden xl:flex xl:col-span-3 flex-col min-h-0 h-full bg-white overflow-y-auto border-l border-slate-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="flex flex-col items-center pt-8 pb-4">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-3xl mb-3 relative">
                        A
                        <div className="absolute bottom-0 right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                    </div>
                    <h3 className="text-[13px] font-bold text-slate-800">ABC Logistics</h3>
                    <p className="text-[12px] text-slate-500 mt-1">Active 20m ago</p>

                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                <User size={18} />
                            </div>
                            <span className="text-[12px] font-medium text-slate-700">Profile</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                <FileText size={18} />
                            </div>
                            <span className="text-[12px] font-medium text-slate-700">Documents</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                                <Phone size={18} />
                            </div>
                            <span className="text-[12px] font-medium text-slate-700">Call</span>
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex flex-col">
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('overview')}
                        >
                            <span className="text-[14px] font-semibold text-slate-800">Quote Overview (QT-8822)</span>
                            <ChevronDown size={18} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.overview ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.overview && (
                            <div className="px-5 pb-3">
                                <div className="text-[12.5px] space-y-2.5">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Status</span>
                                        <span className="font-medium text-amber-600">In Negotiation</span>
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
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('logistics')}
                        >
                            <span className="text-[14px] font-semibold text-slate-800">Logistics Details</span>
                            <ChevronDown size={18} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.logistics ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.logistics && (
                            <div className="px-5 pb-3">
                                <div className="text-[12.5px] space-y-2.5">
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

                    {/* Pricing Section */}
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('pricing')}
                        >
                            <span className="text-[14px] font-semibold text-slate-800">Pricing & Counter Offers</span>
                            <ChevronDown size={18} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.pricing ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.pricing && (
                            <div className="px-5 pb-3">
                                <div className="text-[12.5px]">
                                    <div className="space-y-2.5 mb-2.5 pb-2.5 border-b border-slate-100">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Base Freight</span>
                                            <span className="font-medium text-slate-800">€ 40,000</span>
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
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-800">Original Total</span>
                                        <span className="text-[13px] font-bold text-slate-800 line-through text-slate-400">€ 45,000</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('documents')}
                        >
                            <span className="text-[14px] font-semibold text-slate-800">Media & Documents</span>
                            <ChevronDown size={18} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.documents ? 'rotate-180' : ''}`} />
                        </div>
                        {openSections.documents && (
                            <div className="px-5 pb-3">
                                <AttachmentsList />
                            </div>
                        )}
                    </div>

                    {/* Privacy & support Section */}
                    <div>
                        <div 
                            className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => toggleSection('privacy')}
                        >
                            <span className="text-[14px] font-semibold text-slate-800">Privacy & support</span>
                            <ChevronDown size={18} className={`text-slate-400 group-hover:text-slate-600 transition-transform ${openSections.privacy ? 'rotate-180' : ''}`} />
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
