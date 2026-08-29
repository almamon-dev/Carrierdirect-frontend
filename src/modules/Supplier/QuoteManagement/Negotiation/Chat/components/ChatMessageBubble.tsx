import React, { useState } from 'react';
import { Pin, Ban, Pencil, Trash2, FileText, Download, X, ChevronLeft, ChevronRight, ChevronDown, ExternalLink, Globe, Check, CheckCircle2, XCircle, CheckCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import CounterOfferMessage from '@/modules/Customer/QuoteManagement/Negotiation/CounterOffer';
import { DeclineOfferModal } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/components/DeclineOfferModal';
import { decryptId } from '@/lib/encryption';
import { SAMPLE_NEGOTIATIONS } from '../../hooks/useSupplierNegotiations';
import { NegotiationItem } from '../../types';
import { ChatMessage } from '../types';
import { getAttachmentUrl } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/utils/customerChatUtils';
import ChatImage from '@/modules/Customer/QuoteManagement/Negotiation/Chat/components/ChatImage';

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
    handleRejectOffer: (msg: any, reason?: string) => void;
}

interface LinkPreviewData {
    url: string;
    domain: string;
    title: string;
    description: string;
    image?: string;
}

const extractFirstUrl = (text?: string): string | null => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/i;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
};

const getLinkPreview = (rawUrl: string, activeNegotiation?: NegotiationItem): LinkPreviewData => {
    try {
        const parsed = new URL(rawUrl);
        const host = parsed.host;
        const pathname = parsed.pathname;

        // 1. Direct Image Links (e.g. .jpg, .png, .webp, .svg, .gif)
        if (/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(rawUrl)) {
            const fileName = pathname.split('/').pop()?.split('?')[0] || 'Image';
            return {
                url: rawUrl,
                domain: host.toUpperCase(),
                title: fileName.replace(/[-_]/g, ' '),
                description: `Direct image preview from ${host}`,
                image: rawUrl
            };
        }

        // 2. CarrierDirect Negotiation Links (dynamic resolution from URL token or session key)
        if (host.includes('localhost') || host.includes('carrierdirect') || host.includes('vercel.app')) {
            if (pathname.includes('/negotiation')) {
                let matchedItem: NegotiationItem | undefined = undefined;

                // Extract encrypted token from path
                const viewMatch = pathname.match(/\/view\/([^/]+)/);
                if (viewMatch && viewMatch[1]) {
                    const encToken = viewMatch[1];
                    const decrypted = decryptId(encToken);
                    const rawNum = Number(String(decrypted).replace(/[^0-9]/g, ''));

                    matchedItem = SAMPLE_NEGOTIATIONS.find(
                        n => n.rawId === rawNum ||
                             String(n.rawId) === String(decrypted) ||
                             n.id === decrypted ||
                             n.rawId === Number(decrypted)
                    );
                }

                // If not matched by token, try matching session key (e.g. ses-3 or ses-2)
                if (!matchedItem) {
                    const sessionMatch = rawUrl.match(/ses-([a-zA-Z0-9_-]+)/);
                    if (sessionMatch) {
                        const sKey = `ses-${sessionMatch[1]}`;
                        const sNum = Number(sessionMatch[1]);
                        matchedItem = SAMPLE_NEGOTIATIONS.find(
                            n => n.sessionKey === sKey || n.rawId === sNum
                        );
                    }
                }

                // Fallback to active negotiation or first sample
                const target = matchedItem || activeNegotiation || SAMPLE_NEGOTIATIONS[0];

                if (target) {
                    return {
                        url: rawUrl,
                        domain: 'CARRIERDIRECT.COM',
                        title: `${target.customer} • Quote ${target.quoteId}`,
                        description: `${target.requestTitle || `${target.pickup} → ${target.delivery}`} • Current Rate: €${Number(target.currentOffer || target.originalAmount).toLocaleString()}`,
                        image: target.customerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
                    };
                }
            }

            if (pathname.includes('/quotes')) {
                return {
                    url: rawUrl,
                    domain: 'CARRIERDIRECT.COM',
                    title: 'CarrierDirect • Freight Quotes',
                    description: 'Fast, transparent and reliable freight quote management for carriers and enterprise shippers.',
                    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80'
                };
            }

            return {
                url: rawUrl,
                domain: 'CARRIERDIRECT.COM',
                title: 'CarrierDirect • Smart Freight Logistics',
                description: 'End-to-end logistics platform connecting shippers and carriers with real-time tracking.',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
            };
        }

        // 3. YouTube videos
        if (host.includes('youtube.com') || host.includes('youtu.be')) {
            let videoId = '';
            if (host.includes('youtu.be')) {
                videoId = pathname.replace(/^\//, '');
            } else {
                videoId = parsed.searchParams.get('v') || '';
            }
            const ytThumbnail = videoId
                ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                : 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80';

            return {
                url: rawUrl,
                domain: 'YOUTUBE.COM',
                title: 'YouTube Video',
                description: 'Watch video content shared on YouTube.',
                image: ytThumbnail
            };
        }

        // 4. GitHub
        if (host.includes('github.com')) {
            const repoPath = pathname.replace(/^\/+|\/+$/g, '');
            return {
                url: rawUrl,
                domain: 'GITHUB.COM',
                title: repoPath ? `GitHub - ${repoPath}` : 'GitHub: Where the world builds software',
                description: 'Explore code repositories, open source projects, and software collaboration.',
                image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80'
            };
        }

        // 5. Google
        if (host.includes('google.com')) {
            return {
                url: rawUrl,
                domain: 'GOOGLE.COM',
                title: 'Google Search',
                description: "Search the world's information, including webpages, images, videos and more.",
                image: 'https://images.unsplash.com/photo-1572945753443-448f8888b14e?w=800&auto=format&fit=crop&q=80'
            };
        }

        // 6. Generic fallback
        const cleanPath = pathname.replace(/^\/+|\/+$/g, '').replace(/[-_/]/g, ' ');
        const pathTitle = cleanPath.length > 0 && cleanPath.length < 50
            ? cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1)
            : host;

        return {
            url: rawUrl,
            domain: host.toUpperCase(),
            title: `${pathTitle} - Web Link`,
            description: `Visit ${host} to view and explore this webpage.`,
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
        };
    } catch {
        return {
            url: rawUrl,
            domain: 'WEB LINK',
            title: rawUrl,
            description: 'Click to open this link in a new window.'
        };
    }
};

const shortenUrl = (url: string, maxLength: number = 42): string => {
    if (!url || url.length <= maxLength) return url;
    try {
        const parsed = new URL(url);
        const host = parsed.host;
        const path = parsed.pathname + parsed.search;
        if (path.length > 18) {
            return `${host}${path.slice(0, 14)}...${path.slice(-8)}`;
        }
        return `${url.slice(0, maxLength - 3)}...`;
    } catch {
        return `${url.slice(0, maxLength - 3)}...`;
    }
};

const renderMessageTextWithLinks = (text: string, isSent: boolean) => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const parts = text.split(urlRegex);

    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            const displayUrl = shortenUrl(part, 42);

            return (
                <a
                    key={i}
                    href={part}
                    target="_blank"
                    rel="noreferrer"
                    className={`underline break-all transition-opacity font-semibold ${
                        isSent ? 'text-white/95 hover:text-white' : 'text-blue-600 hover:text-blue-700'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                    title={part}
                >
                    {displayUrl}
                </a>
            );
        }
        return part;
    });
};

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

    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    if (msg.type === 'quote_request') {
        const customerName = msg.sender || activeNegotiation.customer || 'Customer';
        const quoteNum = activeNegotiation.quoteId || activeNegotiation.id || 'QT-0003';
        const pickupLoc = activeNegotiation.origin || activeNegotiation.pickup || 'Pickup Location';
        const deliveryLoc = activeNegotiation.destination || activeNegotiation.delivery || 'Delivery Destination';
        const distanceStr = activeNegotiation.distance || '520 km';
        const initialOffer = Number(msg.newTotal || activeNegotiation.originalAmount || Number(String(activeNegotiation.budget || '').replace(/[^0-9.]/g, '')) || 3986);
        const isAccepted = msg.status === 'accepted' || (activeNegotiation as any)?.status === 'Accepted';
        const isDeclined = msg.status === 'rejected' || (msg.status as string) === 'declined' || (activeNegotiation as any)?.status === 'Offer Declined' || (activeNegotiation as any)?.status === 'rejected' || (activeNegotiation as any)?.status === 'Declined';

        const pickupDate = activeNegotiation.pickupDate || 'Flexible / Today';
        const deliveryDate = activeNegotiation.deliveryDate || 'Standard Delivery';
        const palletType = activeNegotiation.palletType || 'Standard Euro Pallet';
        const vehicleType = activeNegotiation.vehicleType || 'Curtainsider 13.6m';
        const notes = activeNegotiation.notes || '';

        return (
            <div className="flex justify-center my-3 font-sans">
                <div className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 w-full max-w-[380px] mx-auto text-left shadow-xs space-y-3 font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center shrink-0">
                                <FileText className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">Quote Request Received</h3>
                                <p className="text-[10.5px] text-slate-400 font-medium mt-0.5">{msg.time}</p>
                            </div>
                        </div>
                        <span className="text-[10.5px] font-semibold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200/60 dark:border-orange-900/50">
                            #{quoteNum}
                        </span>
                    </div>

                    {/* Short Natural Intro */}
                    <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-normal">
                        <strong className="text-slate-800 dark:text-slate-100 font-semibold">{customerName}</strong> has submitted a quote request for this shipment.
                    </p>

                    {/* Route & Distance */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <p className="text-[12px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                            {pickupLoc} → {deliveryLoc}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Distance: <span className="font-semibold text-slate-700 dark:text-slate-300">{distanceStr}</span>
                        </p>
                    </div>

                    {/* Initial Offer Row */}
                    <div className="flex items-center justify-between pt-2 pb-0.5 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[12px] font-semibold text-slate-600 dark:text-slate-300">Initial Offer</span>
                        <span className="text-base font-black text-[#FF4A1F]">
                            € {initialOffer.toLocaleString()}
                        </span>
                    </div>

                    {/* Expandable Shipment Details / Read More */}
                    {isDetailsOpen && (
                        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-150 text-[11.5px]">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pickup Date</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{pickupDate}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Delivery Date</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{deliveryDate}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Vehicle / Pallet</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{palletType}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Trailer Type</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block mt-0.5">{vehicleType}</span>
                                </div>
                            </div>
                            {notes && (
                                <div className="pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Notes & Requirements</span>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{notes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                        className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#FF4A1F] dark:text-slate-400 dark:hover:text-[#FF4A1F] transition-colors py-0.5 cursor-pointer select-none"
                    >
                        <span>{isDetailsOpen ? 'Show less' : 'Read more / View details'}</span>
                        <ChevronDown size={13} className={`transition-transform duration-200 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Natural Explanation */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Please review the shipment details and offer. You can accept the offer or start a negotiation if you’d like to discuss the price or requirements.
                    </p>

                    {/* Status or Action Buttons */}
                    {isAccepted ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/50 rounded-[3px] text-xs font-semibold">
                            <CheckCircle2 size={15} className="text-emerald-600" />
                            <span>Offer Accepted</span>
                        </div>
                    ) : isDeclined ? (
                        <div className="flex items-center justify-center gap-1.5 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/50 rounded-[3px] text-xs font-semibold">
                            <XCircle size={15} className="text-rose-600" />
                            <span>Offer Declined</span>
                        </div>
                    ) : (
                        <div className="space-y-1.5 pt-1">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    onClick={() => handleAcceptOffer(msg)}
                                    className="flex-1 h-8 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                                >
                                    <Check size={13} /> Accept Offer
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const counterBtn = document.querySelector('button[title*="Counter"]') as HTMLButtonElement;
                                        if (counterBtn) counterBtn.click();
                                    }}
                                    className="flex-1 h-8 rounded-[3px] bg-[#FF4A1F] hover:bg-[#e03e15] text-white text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                                >
                                    Make Counter Offer
                                </Button>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDeclineModal(true)}
                                className="w-full text-center text-[11px] font-medium text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 py-1 transition-colors cursor-pointer"
                            >
                                Decline this request
                            </button>
                        </div>
                    )}
                </div>

                <DeclineOfferModal
                    isOpen={showDeclineModal}
                    onClose={() => setShowDeclineModal(false)}
                    offerAmount={initialOffer}
                    currency="€"
                    onConfirm={(reason) => handleRejectOffer(msg, reason)}
                />
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

    if (msg.type === 'system') {
        return (
            <div className={`flex justify-center ${spacingClass}`}>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full shadow-2xs">
                    {msg.text || (msg as any).message} • {msg.time}
                </span>
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


    const allAttachments = msg.attachments || [];
    const imageAttachments = allAttachments.filter(att => att.type === 'image' || (att.url && /\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i.test(att.url)) || (att.name && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(att.name)));
    const nonImageAttachments = allAttachments.filter(att => !imageAttachments.includes(att));
    const hasText = Boolean(msg.text && msg.text.trim().length > 0);
    const isLongText = Boolean(msg.text && msg.text.length > 220);
    const displayedText = isLongText && !isExpanded ? `${msg.text.slice(0, 190)}...` : (msg.text || '');
    const detectedUrl = hasText ? extractFirstUrl(msg.text) : null;
    const linkPreview = detectedUrl ? getLinkPreview(detectedUrl, activeNegotiation) : null;

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
                className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] min-w-0 flex flex-col ${isSent ? 'items-end' : 'items-start'} relative group transition-all duration-500 ${
                    isHighlighted ? 'ring-2 ring-[#FF4A1F] ring-offset-2 rounded-2xl scale-[1.02]' : ''
                }`}
            >
                {!isEditing && (
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 ${
                        isSent ? 'right-full mr-2' : 'left-full ml-2'
                    }`}>
                        <button
                            type="button"
                            onClick={() => handleTogglePinMessage(msg.id)}
                            className={`p-1 transition-colors cursor-pointer ${msg.isPinned ? 'text-[#FF4A1F]' : 'text-slate-400 hover:text-[#FF4A1F]'}`}
                            title={msg.isPinned ? 'Unpin message' : 'Pin message'}
                        >
                            <Pin size={13} className={msg.isPinned ? 'fill-[#FF4A1F] rotate-45' : ''} />
                        </button>
                        {isSent && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleStartEdit(msg)}
                                    className="p-1 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                                    title="Edit message"
                                >
                                    <Pencil size={13} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Delete message"
                                >
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

                {/* Image Attachments */}
                {imageAttachments.length > 0 && (
                    <div className={`${hasText || nonImageAttachments.length > 0 ? 'mb-1.5' : ''}`}>
                        {imageAttachments.length === 1 ? (
                            <div
                                onClick={() => setLightboxIndex(0)}
                                className="rounded-2xl overflow-hidden inline-block shadow-xs hover:opacity-95 transition-opacity max-w-[240px] sm:max-w-[280px] cursor-pointer"
                            >
                                <ChatImage
                                    src={imageAttachments[0].url}
                                    alt={imageAttachments[0].name || 'image'}
                                    className="w-auto h-auto max-w-[240px] sm:max-w-[280px] max-h-[300px] object-contain rounded-2xl"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden max-w-[260px] sm:max-w-[300px] shadow-xs">
                                {imageAttachments.slice(0, 4).map((att, idx) => {
                                    const isFourthAndMore = idx === 3 && imageAttachments.length > 4;
                                    const remainingCount = imageAttachments.length - 3;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setLightboxIndex(idx)}
                                            className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer group"
                                        >
                                            <ChatImage
                                                src={att.url}
                                                alt={att.name || 'image'}
                                                className="w-full h-full object-contain transition-transform group-hover:scale-105"
                                            />
                                            {isFourthAndMore && (
                                                <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex flex-col items-center justify-center text-white font-extrabold text-lg sm:text-xl group-hover:bg-black/75 transition-colors z-20">
                                                    <span>+{remainingCount}</span>
                                                    <span className="text-[10px] font-medium text-slate-200 uppercase tracking-wider mt-0.5">more</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* WhatsApp Style Document / PDF Card */}
                {nonImageAttachments.length > 0 && (
                    <div className={`flex flex-col gap-2 ${hasText ? 'mb-2' : ''}`}>
                        {nonImageAttachments.map((att, idx) => {
                            const isPdf = att.name.toLowerCase().endsWith('.pdf');
                            const isDoc = att.name.toLowerCase().endsWith('.doc') || att.name.toLowerCase().endsWith('.docx');
                            const isXls = att.name.toLowerCase().endsWith('.xls') || att.name.toLowerCase().endsWith('.xlsx');
                            const badgeColor = isPdf ? 'bg-[#EF4444]' : isXls ? 'bg-[#10B981]' : isDoc ? 'bg-[#2563EB]' : 'bg-[#F97316]';
                            const badgeText = isPdf ? 'PDF' : isXls ? 'XLS' : isDoc ? 'DOC' : 'FILE';
                            const cleanDocTitle = att.name.replace(/\.[^/.]+$/, '').toUpperCase();

                            return (
                                <a
                                    key={idx}
                                    href={getAttachmentUrl(att.url) || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`block rounded-2xl overflow-hidden shadow-xs transition-transform hover:scale-[1.01] max-w-[280px] sm:max-w-[320px] text-left cursor-pointer group/doc ${
                                        isSent
                                            ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30'
                                            : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                                    }`}
                                    title={`Open ${att.name}`}
                                >
                                    <div className="w-full h-28 sm:h-32 bg-white relative overflow-hidden flex flex-col p-3 border-b border-black/5 select-none pointer-events-none">
                                        <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-2">
                                            <div className="text-[12px] font-black text-slate-800 tracking-wider truncate font-serif">
                                                {cleanDocTitle}
                                            </div>
                                            <div className="flex flex-col items-end gap-0.5 shrink-0 ml-2">
                                                <div className="w-10 h-1 bg-slate-300 rounded-full" />
                                                <div className="w-6 h-1 bg-slate-200 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5 opacity-70">
                                            <div className="w-3/4 h-1.5 bg-slate-300 rounded-full" />
                                            <div className="w-full h-1.5 bg-slate-200 rounded-full" />
                                            <div className="w-5/6 h-1.5 bg-slate-200 rounded-full" />
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
                                    </div>

                                    <div className={`p-2.5 sm:p-3 flex items-center gap-3 ${isSent ? 'bg-black/5 dark:bg-black/20' : 'bg-white/90 dark:bg-slate-900/90'}`}>
                                        <div className={`w-7 h-9 ${badgeColor} rounded flex flex-col items-center justify-center text-white shrink-0 shadow-2xs`}>
                                            <span className="text-[9px] font-black tracking-tighter uppercase leading-none">{badgeText}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate leading-snug">
                                                {att.name}
                                            </p>
                                            <p className={`text-[11px] ${isSent ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'} font-normal mt-0.5`}>
                                                1 page • {badgeText} • {att.size || '85 kB'}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Text Bubble & WhatsApp Style Link Preview */}
                {hasText && (
                    <div className={`relative px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] max-w-full ${linkPreview ? 'w-[320px] sm:w-[360px]' : ''} ${radius} ${
                        isSent
                            ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] border border-emerald-200/60 dark:border-emerald-700/30 shadow-2xs font-medium'
                            : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs font-medium'
                    }`}>
                        {linkPreview && (
                            <a
                                href={linkPreview.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`block rounded-lg overflow-hidden mb-2.5 transition-all hover:opacity-95 text-left border-l-4 group/link cursor-pointer ${
                                    isSent
                                        ? 'bg-black/5 dark:bg-black/20 text-[#111b21] dark:text-[#e9edef] border-emerald-500'
                                        : 'bg-black/5 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-emerald-500'
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {linkPreview.image && (
                                    <div className="w-full h-32 sm:h-36 overflow-hidden bg-black/10 relative">
                                        <img
                                            src={linkPreview.image}
                                            alt={linkPreview.title}
                                            className="w-full h-full object-cover group-hover/link:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white rounded-full p-1.5 shadow-xs">
                                            <ExternalLink size={12} />
                                        </div>
                                    </div>
                                )}
                                <div className="p-2.5">
                                    <h4 className="text-[13.5px] font-bold truncate leading-snug">
                                        {linkPreview.domain.toLowerCase()}
                                    </h4>
                                    <p className={`text-xs ${isSent ? 'text-slate-600 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'} truncate mt-0.5 underline`}>
                                        {linkPreview.url}
                                    </p>
                                    <p className={`text-[11px] ${isSent ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'} line-clamp-1 mt-0.5 font-normal`}>
                                        {linkPreview.description || linkPreview.title}
                                    </p>
                                </div>
                            </a>
                        )}

                        <div className="break-words [overflow-wrap:anywhere]">
                            {renderMessageTextWithLinks(displayedText, isSent)}
                            {isLongText && !isExpanded && (
                                <button
                                    type="button"
                                    onClick={() => setIsExpanded(true)}
                                    className={`ml-1 font-bold text-xs cursor-pointer hover:underline inline-block select-none ${
                                        isSent ? 'text-emerald-700 dark:text-emerald-300 underline font-semibold' : 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                    }`}
                                >
                                    Read more
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className={`flex items-center gap-1.5 mt-1 px-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 ${isSent ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.time}</span>
                    {msg.isEdited && <span className="italic text-[9.5px]">(edited)</span>}
                    {isSent && (
                        (msg.seen === true || msg.deliveryStatus === 'seen' || msg.isRead === true) ? (
                            <span className="inline-flex items-center gap-0.5 text-sky-500 font-semibold ml-1">
                                <span>• Seen</span>
                                <CheckCheck size={13} className="text-sky-500 inline-block ml-0.5" />
                            </span>
                        ) : msg.deliveryStatus === 'delivered' ? (
                            <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1">
                                <span>• Delivered</span>
                                <CheckCheck size={13} className="text-slate-400 inline-block ml-0.5" />
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium ml-1">
                                <span>• Sent</span>
                                <Check size={13} className="text-slate-400 inline-block ml-0.5" />
                            </span>
                        )
                    )}
                </div>
            </div>

            {/* Full-Screen Lightbox Modal for Browsing Sent Photos */}
            {lightboxIndex !== null && imageAttachments[lightboxIndex] && (
                <div
                    onClick={() => setLightboxIndex(null)}
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setLightboxIndex(null)}
                            className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                            title="Close"
                        >
                            <X size={24} />
                        </button>

                        {/* Image Counter */}
                        {imageAttachments.length > 1 && (
                            <div className="absolute -top-9 left-0 text-white/80 font-medium text-xs">
                                {lightboxIndex + 1} / {imageAttachments.length}
                            </div>
                        )}

                        {/* Image */}
                        <ChatImage
                            src={imageAttachments[lightboxIndex].url}
                            alt={imageAttachments[lightboxIndex].name || 'preview'}
                            className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                        />

                        {/* Next / Prev Buttons */}
                        {imageAttachments.length > 1 && (
                            <div className="flex items-center gap-4 mt-3">
                                <button
                                    type="button"
                                    onClick={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : imageAttachments.length - 1))}
                                    className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                    title="Previous image"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-white text-xs font-semibold">
                                    {imageAttachments[lightboxIndex].name || `Image ${lightboxIndex + 1}`}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setLightboxIndex(prev => (prev !== null && prev < imageAttachments.length - 1 ? prev + 1 : 0))}
                                    className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                                    title="Next image"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
