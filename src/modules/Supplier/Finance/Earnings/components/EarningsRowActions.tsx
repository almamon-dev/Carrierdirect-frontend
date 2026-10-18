import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, ExternalLink, Download, Check, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button";
import { EarningItem } from "../types/earnings.types";

interface EarningsRowActionsProps {
    row: EarningItem;
    onCopy: (text: string) => void;
    onDownloadReport: () => void;
}

export function EarningsRowActions({ row, onCopy, onDownloadReport }: EarningsRowActionsProps) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copiedOrder, setCopiedOrder] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const ordNumber = row.order_number || row.id;
    const ordId = row.order_id || ordNumber;

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 200)
            });
            setIsOpen(true);
        }
    };

    const handleCopyOrder = () => {
        if (!ordNumber) return;
        onCopy(ordNumber);
        setCopiedOrder(true);
        setTimeout(() => {
            setCopiedOrder(false);
            handleClose();
        }, 1200);
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        const handleScroll = () => handleClose();
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen, handleClose]);

    return (
        <div className="relative flex items-center justify-end w-full min-h-[26px]">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[4px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="More Actions"
            >
                <MoreVertical size={16} />
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
                        className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {ordId && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    navigate(`/supplier/orders/details/${ordId}`);
                                }}
                            >
                                <ExternalLink size={14} className="text-slate-400 shrink-0" />
                                <span>View Job Details</span>
                            </button>
                        )}

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onDownloadReport();
                            }}
                        >
                            <Download size={14} className="text-[#ff4a1f] shrink-0" />
                            <span>Download Statement</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {ordNumber && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleCopyOrder}
                            >
                                {copiedOrder ? (
                                    <>
                                        <Check size={14} className="text-emerald-500 shrink-0" />
                                        <span className="text-emerald-600 font-semibold">Copied Ref!</span>
                                    </>
                                ) : (
                                    <>
                                        <Receipt size={14} className="text-slate-400 shrink-0" />
                                        <span>Copy Job Ref</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
