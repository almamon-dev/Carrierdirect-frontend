import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
    Navigation, 
    Eye, 
    Edit, 
    Tag, 
    MessageSquare, 
    Copy, 
    Trash2, 
    XCircle 
} from 'lucide-react';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';

interface ProcessingRowActionsMenuProps {
    isOpen: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    dropdownPos: { top: number; left: number };
    row: any;
    onClose: () => void;
    onDelete?: (row: any) => void;
}

export const ProcessingRowActionsMenu: React.FC<ProcessingRowActionsMenuProps> = ({
    isOpen,
    dropdownRef,
    dropdownPos,
    row,
    onClose,
    onDelete,
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const rawId = String(row.rawId || row.id || '').replace('REQ-', '').replace('ORD-', '');
    const isAcceptedOrDelivered = row.status === 'Accepted' || row.status === 'POD Accepted' || row.status === 'Completed' || row.status === 'In Transit';

    return createPortal(
        <div 
            ref={dropdownRef}
            className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* 1. Track Shipment */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                onClick={() => {
                    onClose();
                    navigate(`/customer/quotes/processing/track/${rawId || '1'}`);
                }}
            >
                <Navigation size={14} className="text-[#ff4a1f] shrink-0" />
                <span>Track Shipment</span>
            </button>

            {/* 2. View Received Quotes */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                onClick={() => {
                    onClose();
                    navigate(`/customer/quotes/received?requestId=${rawId || row.id}`);
                }}
            >
                <Tag size={14} className="text-emerald-600 shrink-0" />
                <span>View Quotes {row.bidsCount ? `(${row.bidsCount})` : ''}</span>
            </button>

            {/* 3. Chat & Negotiate */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                onClick={() => { 
                    onClose(); 
                    navigate('/customer/quotes/negotiation'); 
                }}
            >
                <MessageSquare size={14} className="text-blue-500 shrink-0" />
                <span>Chat & Negotiate</span>
            </button>

            {/* 4. Duplicate Request */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 font-medium transition-colors cursor-pointer" 
                onClick={() => {
                    onClose();
                    navigate('/customer/quotes/create/new', { state: { cloneData: row } });
                }}
            >
                <Copy size={14} className="text-slate-400 shrink-0" />
                <span>Duplicate Request</span>
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

            {/* 5. Cancel / Delete Request */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-medium transition-colors" 
                onClick={() => {
                    onClose();
                    if (onDelete) onDelete(row);
                }}
            >
                {row.status === 'Active' || row.status === 'Bidding Active' ? (
                    <>
                        <XCircle size={14} className="text-red-500 shrink-0" />
                        <span>Cancel Request</span>
                    </>
                ) : (
                    <>
                        <Trash2 size={14} className="text-red-500 shrink-0" />
                        <span>Delete</span>
                    </>
                )}
            </button>
        </div>,
        document.body
    );
};
