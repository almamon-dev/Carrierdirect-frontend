/**
 * RowActions — Three-dot context menu for each quote request row.
 * Renders via createPortal to avoid table overflow clipping.
 * Closes on outside click, Escape key, and scroll.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
    MoreVertical, Activity, Eye, Edit, Copy, FileDown, XCircle, Trash2 
} from 'lucide-react';
import Button from '@/components/ui/button';
import { CustomerQuoteRequestItem } from '../types';

interface RowActionsProps {
    row: CustomerQuoteRequestItem;
    isRepeating: boolean;
    onRepeatRequest: (row: CustomerQuoteRequestItem) => void;
    onDeleteRequest: (row: CustomerQuoteRequestItem) => void;
}

export const RowActions: React.FC<RowActionsProps> = ({
    row,
    isRepeating,
    onRepeatRequest,
    onDeleteRequest,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180)
            });
            setIsOpen(true);
        }
    };

    // Close on outside click, Escape key, and scroll
    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleScroll = () => handleClose();

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, handleClose]);

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button 
                ref={triggerRef}
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Track Bids (Visible only for non-draft active requests) */}
                    {row.status !== 'Draft' && (
                        <button 
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                            onClick={() => {
                                handleClose();
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
                            handleClose(); 
                            navigate(`/customer/quotes/create/view/${row.rawId || String(row.id).replace('REQ-', '')}`); 
                        }}
                    >
                        <Eye size={14} className="text-slate-400 shrink-0" />
                        <span>View Details</span>
                    </button>

                    <button 
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                        onClick={() => { 
                            handleClose(); 
                            navigate(`/customer/quotes/create/edit/${row.rawId || String(row.id).replace('REQ-', '')}`); 
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
                            handleClose();
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
                        onClick={handleClose}
                    >
                        <FileDown size={14} className="text-slate-400 shrink-0" />
                        <span>Download PDF</span>
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    {row.status === 'Bidding Active' || row.status === 'active' ? (
                        <button 
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-medium transition-colors" 
                            onClick={() => {
                                handleClose();
                                onDeleteRequest(row);
                            }}
                        >
                            <XCircle size={14} className="text-red-500 shrink-0" />
                            <span>Cancel Request</span>
                        </button>
                    ) : (
                        <button 
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-medium transition-colors" 
                            onClick={() => {
                                handleClose();
                                onDeleteRequest(row);
                            }}
                        >
                            <Trash2 size={14} className="text-red-500 shrink-0" />
                            <span>Delete</span>
                        </button>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};
