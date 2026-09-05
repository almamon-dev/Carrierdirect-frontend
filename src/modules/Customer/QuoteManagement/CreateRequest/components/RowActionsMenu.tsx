import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, Edit, Copy, FileDown, XCircle, Trash2 } from 'lucide-react';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { CustomerQuoteRequestItem } from '../types';

interface RowActionsMenuProps {
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    dropdownPos: { top: number; left: number };
    row: CustomerQuoteRequestItem;
    isRepeating: boolean;
    onClose: () => void;
    onRepeatRequest: (row: CustomerQuoteRequestItem) => void;
    onDeleteRequest: (row: CustomerQuoteRequestItem) => void;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
    dropdownRef,
    dropdownPos,
    row,
    isRepeating,
    onClose,
    onRepeatRequest,
    onDeleteRequest,
}) => {
    const navigate = useNavigate();

    return (
        <div 
            ref={dropdownRef}
            className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={(e) => e.stopPropagation()}
        >
            {row.status !== 'Draft' && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                    onClick={() => {
                        onClose();
                        const rawId = String(row.rawId || row.id).replace('REQ-', '');
                        navigate(`/customer/quotes/received/track/${rawId}`);
                    }}
                >
                    <Activity size={14} className="text-[#ff4a1f] shrink-0" />
                    <span>Track Bids</span>
                </button>
            )}

            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                onClick={() => { 
                    onClose(); 
                    navigate(buildSecureQuoteUrl('view', row.rawId || row.id)); 
                }}
            >
                <Eye size={14} className="text-slate-400 shrink-0" />
                <span>View Details</span>
            </button>

            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                onClick={() => { 
                    onClose(); 
                    navigate(buildSecureQuoteUrl('edit', row.rawId || row.id)); 
                }}
            >
                <Edit size={14} className="text-indigo-500 shrink-0" />
                <span>Edit</span>
            </button>

            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 font-medium disabled:opacity-50 transition-colors cursor-pointer" 
                disabled={isRepeating}
                onClick={() => {
                    onClose();
                    onRepeatRequest(row);
                }}
            >
                {isRepeating ? (
                    <svg className="animate-spin w-3.5 h-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                ) : (
                    <Copy size={14} className="text-blue-500 shrink-0" />
                )}
                <span>{isRepeating ? 'Loading...' : 'Repeat Request'}</span>
            </button>

            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                onClick={onClose}
            >
                <FileDown size={14} className="text-slate-400 shrink-0" />
                <span>Download PDF</span>
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-medium transition-colors" 
                onClick={() => {
                    onClose();
                    onDeleteRequest(row);
                }}
            >
                {row.status === 'Bidding Active' || row.status === 'active' ? (
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
        </div>
    );
};
