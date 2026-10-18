import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageSquare, Copy, Check, Navigation, FileCheck, Star, FileText, UserCheck, RefreshCw, CreditCard, UploadCloud } from 'lucide-react';
import { SupplierOrderItem } from '../types';

interface OrderActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    copied: boolean;
    row: SupplierOrderItem;
    onClose: () => void;
    onViewDetails: () => void;
    onTrackOrder: () => void;
    onOpenChat: () => void;
    onOpenRating: () => void;
    onManagePOD: () => void;
    onCopyId: () => void;
    onAssignDriver?: () => void;
    onUpdateStatus?: () => void;
}

const MenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
}> = ({ icon, label, onClick, className = 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium' }) => (
    <button
        type="button"
        className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${className}`}
        onClick={onClick}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export const OrderActionsMenu: React.FC<OrderActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    copied,
    row,
    onClose,
    onViewDetails,
    onTrackOrder,
    onOpenChat,
    onOpenRating,
    onManagePOD,
    onCopyId,
    onAssignDriver,
    onUpdateStatus,
}) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    const rawStatus = (row?.status_raw || row?.status || '').toLowerCase();
    const isCompleted = rawStatus === 'completed' || rawStatus === 'delivered' || rawStatus === 'pod accepted';
    const isDriverAssigned = rawStatus === 'driver_assigned' || Boolean(
        (row as any)?.assigned_driver_id ||
        (row as any)?.driver_id ||
        (row as any)?.driver?.id ||
        (row as any)?.assignedDriver
    );
    const hasPod = Boolean(row?.pod_document_url || row?.pod_file_url || (row?.pod_status && row.pod_status !== 'Not Uploaded'));
    const docUrl = row?.pod_document_url || row?.pod_file_url || (row as any)?.invoice_url || (row as any)?.document_url;
    const hasDoc = Boolean(docUrl);
    const hasPayment = Boolean(row?.total_amount || (row as any)?.gross_amount || (row as any)?.payment_status || (row as any)?.escrow_status);

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
            />
            <div
                className="fixed w-52 max-w-[calc(100vw-16px)] bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans overflow-hidden"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. View Order / Job */}
                <MenuItem
                    icon={<Eye size={14} className="text-slate-400 shrink-0" />}
                    label="View Order / Job"
                    onClick={() => { onClose(); onViewDetails(); }}
                />

                {/* 2. Assign Driver — when unassigned and permitted */}
                {!isCompleted && !isDriverAssigned && onAssignDriver && (
                    <MenuItem
                        icon={<UserCheck size={14} className="text-[#ff4a1f] shrink-0" />}
                        label="Assign Driver"
                        onClick={() => { onClose(); onAssignDriver(); }}
                        className="text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 font-bold"
                    />
                )}

                {/* 3. Reassign Driver — when permitted */}
                {!isCompleted && isDriverAssigned && onAssignDriver && (
                    <MenuItem
                        icon={<UserCheck size={14} className="text-slate-400 shrink-0" />}
                        label="Reassign Driver"
                        onClick={() => { onClose(); onAssignDriver(); }}
                        className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium"
                    />
                )}

                {/* Update Shipment Status */}
                {!isCompleted && onUpdateStatus && (
                    <MenuItem
                        icon={<RefreshCw size={14} className="text-blue-500 shrink-0" />}
                        label="Update Shipment Status"
                        onClick={() => { onClose(); onUpdateStatus(); }}
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 font-semibold"
                    />
                )}

                {/* 4. Track Delivery — when available */}
                <MenuItem
                    icon={<Navigation size={14} className="text-slate-400 shrink-0" />}
                    label="Track Delivery"
                    onClick={() => { onClose(); onTrackOrder(); }}
                />

                {/* View Customer Details / Chat */}
                <MenuItem
                    icon={<MessageSquare size={14} className="text-slate-400 shrink-0" />}
                    label="Chat with Shipper"
                    onClick={() => { onClose(); onOpenChat(); }}
                />

                {/* 5. View POD — when uploaded */}
                {hasPod && (
                    <MenuItem
                        icon={<FileCheck size={14} className="text-emerald-500 shrink-0" />}
                        label="View POD"
                        onClick={() => { onClose(); onManagePOD(); }}
                        className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
                    />
                )}

                {/* 6. Upload / Replace POD — only when permitted */}
                {!isCompleted && (
                    <MenuItem
                        icon={<UploadCloud size={14} className="text-amber-500 shrink-0" />}
                        label={hasPod ? "Replace POD" : "Upload POD"}
                        onClick={() => { onClose(); onManagePOD(); }}
                        className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-semibold"
                    />
                )}

                {/* 7. View Payment / Escrow Details */}
                {hasPayment && (
                    <MenuItem
                        icon={<CreditCard size={14} className="text-emerald-500 shrink-0" />}
                        label="View Payment / Escrow Details"
                        onClick={() => {
                            onClose();
                            navigate('/supplier/finance');
                        }}
                        className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-medium"
                    />
                )}

                {/* 8. Download Order Documents — when available */}
                {hasDoc && (
                    <MenuItem
                        icon={<FileText size={14} className="text-slate-400 shrink-0" />}
                        label="Download Order Documents"
                        onClick={() => {
                            onClose();
                            if (docUrl) window.open(docUrl, '_blank');
                        }}
                    />
                )}

                {isCompleted && (
                    <MenuItem
                        icon={<Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                        label="Rate Customer & Shipper"
                        onClick={() => { onClose(); onOpenRating(); }}
                        className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-semibold"
                    />
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={onCopyId}
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
    );
};

export default OrderActionsMenu;
