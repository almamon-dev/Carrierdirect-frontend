import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, UserCheck } from 'lucide-react';
import { SupplierOrderItem } from '../types';
import OrderActionsMenu from './OrderActionsMenu';

interface OrderRowActionsProps {
    row: SupplierOrderItem;
    onOpenRating: (target: { id: string; customer: string; route: string }) => void;
    onAssignDriver?: (row: SupplierOrderItem) => void;
}

export const OrderRowActions: React.FC<OrderRowActionsProps> = ({
    row,
    onOpenRating,
    onAssignDriver,
}) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [copied, setCopied] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleOpenMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (dropdownOpen) {
            setDropdownOpen(false);
            return;
        }
        const rect = buttonRef.current?.getBoundingClientRect();
        if (rect) {
            const menuHeight = 280;
            const spaceBelow = window.innerHeight - rect.bottom;
            const top = spaceBelow < menuHeight
                ? rect.top + window.scrollY - menuHeight
                : rect.bottom + window.scrollY + 4;
            const left = Math.max(10, rect.right + window.scrollX - 208);
            setDropdownPos({ top, left });
        }
        setDropdownOpen(true);
    };

    const handleClose = () => setDropdownOpen(false);

    const handleViewDetails = () => {
        navigate(`/supplier/orders/details/${row.slug || row.id}`, { state: { orderData: row } });
    };

    const handleTrackOrder = () => {
        navigate(`/supplier/orders/details/${row.slug || row.id}`, { state: { orderData: row, openTab: 'tracking' } });
    };

    const handleOpenChat = () => {
        navigate(`/supplier/quotes/negotiation`);
    };

    const handleManagePOD = () => {
        navigate(`/supplier/orders/pod/${row.slug || row.id}`, { state: { orderData: row } });
    };

    const handleCopyId = () => {
        const idText = row.order_id || row.order_no || row.order_number || String(row.id);
        navigator.clipboard.writeText(idText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const customerName = row.customer_name || row.customer?.name || 'Customer';
    const routeDisplay = row.route || `${row.pickup_city || 'Origin'} → ${row.delivery_city || 'Destination'}`;

    const rawStatus = (row?.status_raw || row?.status || '').toLowerCase().trim();
    const isCompleted = rawStatus === 'completed' || rawStatus === 'cancelled' || rawStatus === 'pod accepted';
    const isAssigned = rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'in_progress' || rawStatus === 'picked_up' || rawStatus === 'in_transit' || rawStatus === 'delivered' || rawStatus === 'arrived';

    return (
        <div className="flex items-center justify-end gap-1.5 font-sans" onClick={(e) => e.stopPropagation()}>
            {/* Quick Assign Driver Button */}
            {!isCompleted && onAssignDriver && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/supplier/orders/assign-driver", { state: { selectedOrder: row } });
                    }}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-[4px] transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                        isAssigned
                            ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            : 'bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs font-bold'
                    }`}
                    title={isAssigned ? 'Reassign Driver & Vehicle' : 'Assign Driver & Vehicle'}
                >
                    <UserCheck size={12} className={isAssigned ? 'text-[#ff4a1f] shrink-0' : 'text-white shrink-0'} />
                    <span>{isAssigned ? 'Assigned' : 'Assign'}</span>
                </button>
            )}

            {/* 3-Dots More Options Button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={handleOpenMenu}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="More actions"
            >
                <MoreVertical size={15} />
            </button>

            {/* Popup Menu */}
            <OrderActionsMenu
                isOpen={dropdownOpen}
                dropdownPos={dropdownPos}
                copied={copied}
                row={row}
                onClose={handleClose}
                onViewDetails={handleViewDetails}
                onTrackOrder={handleTrackOrder}
                onOpenChat={handleOpenChat}
                onOpenRating={() => onOpenRating({
                    id: String(row.id),
                    customer: customerName,
                    route: routeDisplay
                })}
                onManagePOD={handleManagePOD}
                onCopyId={handleCopyId}
                onAssignDriver={onAssignDriver ? () => onAssignDriver(row) : undefined}
            />
        </div>
    );
};

export default OrderRowActions;
