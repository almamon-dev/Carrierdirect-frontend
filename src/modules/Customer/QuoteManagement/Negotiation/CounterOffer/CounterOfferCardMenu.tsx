import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Copy, Pin, Trash2, Check } from 'lucide-react';

interface CounterOfferCardMenuProps {
    isSentByMe: boolean;
    quoteNum: string;
    currency: string;
    proposedPrice: number;
    basePrice: number;
    pickupLoc: string;
    deliveryLoc: string;
    status: string;
    isPinned?: boolean;
    onTogglePin?: () => void;
    onDelete?: () => void;
}

export const CounterOfferCardMenu: React.FC<CounterOfferCardMenuProps> = ({
    isSentByMe,
    quoteNum,
    currency,
    proposedPrice,
    basePrice,
    pickupLoc,
    deliveryLoc,
    status,
    isPinned,
    onTogglePin,
    onDelete,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleCopyDetails = () => {
        const textToCopy = `Counter Offer #${quoteNum}
Rate: ${currency} ${proposedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Base Rate: ${currency} ${basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Route: ${pickupLoc} → ${deliveryLoc}
Status: ${status}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setIsMenuOpen(false);
        }, 1500);
    };

    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 ${
                isSentByMe ? "right-full mr-2" : "left-full ml-2"
            } transition-opacity duration-150 z-30 ${
                isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            ref={menuRef}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                }}
                className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center transition-colors cursor-pointer border shadow-2xs ${
                    isMenuOpen
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600"
                        : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700"
                }`}
                title="More options"
                aria-label="More options"
            >
                <MoreVertical size={13} />
            </button>

            {isMenuOpen && (
                <div className={`absolute ${isSentByMe ? "right-0" : "left-0"} bottom-full mb-1.5 w-40 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 rounded-lg p-1 shadow-xl border border-slate-200/90 dark:border-slate-700 min-w-[155px] z-50 animate-in zoom-in-95 fade-in-0 duration-150 text-[12px] font-medium font-sans`}>
                    <button
                        type="button"
                        onClick={handleCopyDetails}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                    >
                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-500 dark:text-slate-400" />}
                        <span>{copied ? "Copied!" : "Copy Details"}</span>
                    </button>

                    {onTogglePin && (
                        <button
                            type="button"
                            onClick={() => {
                                onTogglePin();
                                setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
                        >
                            <Pin size={13} className={isPinned ? "text-amber-500 fill-amber-500" : "text-slate-500 dark:text-slate-400"} />
                            <span>{isPinned ? "Unpin from Top" : "Pin to Top"}</span>
                        </button>
                    )}

                    {onDelete && (
                        <>
                            <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete();
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                            >
                                <Trash2 size={13} className="text-rose-500" />
                                <span>Delete</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
