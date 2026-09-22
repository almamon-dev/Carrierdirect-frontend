import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Navigation, Copy, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import { ShipmentItem } from '../../types';
import { requireDriverCompliance } from '../../Compliance';
import { GPSComingSoonModal } from '@/components/modals';

interface Props {
    row: ShipmentItem;
}

export const ShipmentRowActions: React.FC<Props> = ({ row }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isGPSOpen, setIsGPSOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const menuWidth = 175;
            const left = Math.min(
                window.innerWidth - menuWidth - 10,
                Math.max(10, rect.right - menuWidth)
            );
            setDropdownPos({
                top: rect.bottom + 4,
                left,
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleScroll = () => handleClose();
        const handleResize = () => handleClose();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const handleCopy = () => {
        navigator.clipboard.writeText(row.orderNumber);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 600);
    };

    const handleGPS = () => {
        handleClose();
        requireDriverCompliance(() => {
            setIsGPSOpen(true);
        }, 'Live GPS Navigation');
    };

    return (
        <div className="relative flex items-center justify-end w-full shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 rounded-[3px] text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="Actions"
            >
                <MoreVertical size={13.5} />
            </Button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    />

                    <div
                        className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-[4px] shadow-xl border border-slate-200 dark:border-slate-700/80 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans text-xs"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* View Details */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-1.5 text-[11.5px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate(`/driver/shipments/${row.id}`);
                            }}
                        >
                            <Eye size={12.5} className="text-[#FF4A1F] shrink-0" />
                            <span>View Load Details</span>
                        </button>

                        {/* GPS Navigation */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-1.5 text-[11.5px] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                            onClick={handleGPS}
                        >
                            <Navigation size={12.5} className="text-blue-500 shrink-0" />
                            <span>GPS Directions</span>
                        </button>

                        <div className="border-t border-slate-100 dark:border-slate-800 my-0.5" />

                        {/* Copy Load # */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-1.5 text-[11.5px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors font-medium cursor-pointer"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <>
                                    <Check size={12.5} className="text-emerald-500 shrink-0" />
                                    <span className="text-emerald-600">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={12.5} className="text-slate-400 shrink-0" />
                                    <span>Copy Order #</span>
                                </>
                            )}
                        </button>
                    </div>
                </>,
                document.body
            )}

            <GPSComingSoonModal
                isOpen={isGPSOpen}
                destination={`${row.consignee.address}, ${row.consignee.city}`}
                onClose={() => setIsGPSOpen(false)}
            />
        </div>
    );
};
