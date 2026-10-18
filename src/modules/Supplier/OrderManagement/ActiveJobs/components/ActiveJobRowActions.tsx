import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, Truck, Navigation, FileCheck, Star, UserCheck, MoreVertical, Copy, Check } from 'lucide-react';
import { SupplierOrder, checkHasRealDriver } from '../../data/ordersData';

interface ActiveJobRowActionsProps {
    row: SupplierOrder;
    onOpenRating: (target: { id: string; customer: string; route: string }) => void;
    navigate: (path: string, options?: any) => void;
}

export const ActiveJobRowActions: React.FC<ActiveJobRowActionsProps> = ({
    row,
    onOpenRating,
    navigate,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [copied, setCopied] = useState(false);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180),
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

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const rawStatus = (row.status || '').toLowerCase().trim();
    const isCompleted = rawStatus === 'completed' || rawStatus === 'delivered' || rawStatus === 'pod accepted';
    const hasDriver = checkHasRealDriver(row);

    return (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            {!isCompleted && (
                <button
                    type="button"
                    onClick={() => navigate('/supplier/orders/assign-driver', { state: { selectedOrder: row } })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-all cursor-pointer whitespace-nowrap active:scale-95 bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs font-bold"
                    title={hasDriver ? 'Reassign Driver & Vehicle' : 'Assign Driver & Vehicle'}
                >
                    <UserCheck size={12} className="text-white shrink-0" />
                    <span>{hasDriver ? 'Reassign' : 'Assign'}</span>
                </button>
            )}

            <button
                type="button"
                onClick={handleToggle}
                className="h-7 w-7 p-0 flex items-center justify-center rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="More actions"
            >
                <MoreVertical size={15} />
            </button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    />

                    <div
                        className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate(`/supplier/orders/details/${row.slug}`);
                            }}
                        >
                            <Eye size={14} className="text-slate-400 shrink-0" />
                            <span>View Job Details</span>
                        </button>

                        {!isCompleted && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    navigate('/supplier/orders/assign-driver', { state: { selectedOrder: row } });
                                }}
                            >
                                <UserCheck size={14} className="text-[#ff4a1f] shrink-0" />
                                <span>{hasDriver ? 'Reassign Driver' : 'Assign Driver'}</span>
                            </button>
                        )}

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate(`/supplier/orders/details/${row.slug}#tracking`);
                            }}
                        >
                            <Navigation size={14} className="text-slate-400 shrink-0" />
                            <span>Live GPS Tracking</span>
                        </button>

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate(`/supplier/orders/pod`);
                            }}
                        >
                            <FileCheck size={14} className="text-emerald-500 shrink-0" />
                            <span>Submit Signed POD</span>
                        </button>

                        {isCompleted && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    onOpenRating({ id: row.id, customer: row.customer, route: `${row.pickup} → ${row.delivery}` });
                                }}
                            >
                                <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                                <span>Rate Customer</span>
                            </button>
                        )}

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(row.id);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                    handleClose();
                                }, 1000);
                            }}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="text-emerald-500 shrink-0" />
                                    <span className="text-emerald-600 font-semibold">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} className="text-slate-400 shrink-0" />
                                    <span>Copy Job ID</span>
                                </>
                            )}
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default ActiveJobRowActions;
