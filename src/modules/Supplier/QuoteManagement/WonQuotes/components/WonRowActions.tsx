import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Truck, UserPlus, UserCheck, Navigation, FileCheck, UploadCloud, CreditCard, FileDown } from 'lucide-react';
import Button from '@/components/ui/button';
import { WonQuoteItem } from '../types';
import { encryptId } from '@/lib/encryption';

interface WonRowActionsProps {
    row: WonQuoteItem;
}

export const WonRowActions: React.FC<WonRowActionsProps> = ({ row }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 200),
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

    const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
    const quoteRawId = (row as any).quoteRawId || (row as any).quote_id || rawId;
    const orderId = (row as any).orderId || (row as any).order_id;
    const driverId = (row as any).driverId;
    const deliveryStatus = String((row as any).deliveryStatus || row.status || '').toLowerCase().trim();

    const isCompleted = deliveryStatus === 'completed';
    const isDelivered = deliveryStatus === 'delivered' || isCompleted;
    const canAssignDriver = !driverId && !isCompleted && !isDelivered;
    const canReassignDriver = Boolean(driverId) && !isCompleted && !isDelivered;
    const canTrackDelivery = ['in_transit', 'in transit', 'picked_up', 'delivered'].includes(deliveryStatus);
    const hasPod = Boolean((row as any).podUrl || ['delivered', 'completed', 'pod pending', 'pod_pending'].includes(deliveryStatus));
    const docUrl = (row as any).invoice_url || (row as any).pdf_url || (row as any).pod_document_url || (row as any).attachment_url || (row as any).order?.invoice_url || (row as any).order?.document_url || '';
    const hasDoc = Boolean(docUrl);
    const canUploadPod = ['delivered', 'in_transit', 'in transit', 'pod pending', 'pod_pending'].includes(deliveryStatus) && !isCompleted;
    const hasPayment = Boolean((row as any).isPaid || isCompleted || isDelivered);

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <div
                    className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 1. View Order / Job */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            if (orderId) {
                                navigate(`/supplier/orders/${encryptId(orderId)}`);
                            } else {
                                navigate('/supplier/orders/active-jobs');
                            }
                        }}
                    >
                        <Truck size={14} className="text-emerald-500 shrink-0" />
                        <span>View Order / Job</span>
                    </button>

                    {/* 2. Assign Driver — when no driver is assigned and assignment is permitted */}
                    {canAssignDriver && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate('/supplier/orders/assign-driver', { state: { orderId, rawId } });
                            }}
                        >
                            <UserPlus size={14} className="text-indigo-500 shrink-0" />
                            <span>Assign Driver</span>
                        </button>
                    )}

                    {/* 3. Reassign Driver — when reassignment is permitted */}
                    {canReassignDriver && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate('/supplier/orders/assign-driver', { state: { orderId, rawId, reassign: true } });
                            }}
                        >
                            <UserCheck size={14} className="text-slate-400 shrink-0" />
                            <span>Reassign Driver</span>
                        </button>
                    )}

                    {/* 4. Track Delivery — when delivery tracking is available */}
                    {canTrackDelivery && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate('/supplier/orders/active-jobs');
                            }}
                        >
                            <Navigation size={14} className="text-blue-500 shrink-0" />
                            <span>Track Delivery</span>
                        </button>
                    )}

                    {/* 5. Upload POD — when the delivery workflow allows uploading */}
                    {canUploadPod && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate('/supplier/orders/pods');
                            }}
                        >
                            <UploadCloud size={14} className="text-amber-500 shrink-0" />
                            <span>Upload POD</span>
                        </button>
                    )}

                    {/* 6. View POD — when a POD has been uploaded */}
                    {hasPod && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate('/supplier/orders/pods');
                            }}
                        >
                            <FileCheck size={14} className="text-slate-400 shrink-0" />
                            <span>View POD</span>
                        </button>
                    )}

                    {/* 7. View Payment / Escrow Details — when the relevant record exists */}
                    {hasPayment && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate('/supplier/finance');
                            }}
                        >
                            <CreditCard size={14} className="text-emerald-500 shrink-0" />
                            <span>View Payment / Escrow Details</span>
                        </button>
                    )}

                                        {/* 8. Download Order Documents — when available */}
                    {hasDoc && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                window.open(docUrl, '_blank');
                            }}
                        >
                            <FileDown size={14} className="text-slate-400 shrink-0" />
                            <span>Download Order Documents</span>
                        </button>
                    )}

                    {/* 9. View Quote */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            navigate(`/supplier/quotes/my-quotes/${encryptId(quoteRawId)}`, { state: { from: 'won' } });
                        }}
                    >
                        <Eye size={14} className="text-slate-400 shrink-0" />
                        <span>View Quote</span>
                    </button>
                </div>,
                document.body
            )}

            {/* Backdrop to dismiss menu */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9998] cursor-default" 
                    onClick={handleClose} 
                />
            )}
        </div>
    );
};
