import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Copy, Check, Mail, Trash2, Ban, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { TeamMember } from '../types/team.types';

interface TeamMemberRowActionsProps {
    row: TeamMember;
    onViewProfile?: (row: TeamMember) => void;
    onDelete?: (row: TeamMember) => void;
    onBlock?: (row: TeamMember) => void;
    onUnblock?: (row: TeamMember) => void;
}

export const TeamMemberRowActions: React.FC<TeamMemberRowActionsProps> = ({
    row,
    onViewProfile,
    onDelete,
    onBlock,
    onUnblock,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const isBlocked = row.status === 'Blocked' || Boolean(row.isBlocked);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 192)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        const handleScroll = () => {
            handleClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

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
                <>
                    {/* Transparent Click-Outside Backdrop */}
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    />

                    <div
                        className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* View Profile */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                const memberId = row.rawId || row.id;
                                navigate(`/supplier/team/${memberId}`);
                            }}
                        >
                            <Eye size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                            <span>View Profile</span>
                        </button>

                        {/* Send Email */}
                        {row.email && (
                            <a
                                href={`mailto:${row.email}`}
                                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleClose}
                            >
                                <Mail size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                                <span>Send Email</span>
                            </a>
                        )}

                        {/* Copy ID */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => handleCopy(row.id)}
                        >
                            {copied ? (
                                <Check size={14} className="text-emerald-500 shrink-0" />
                            ) : (
                                <Copy size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                            )}
                            <span>{copied ? 'Copied ID!' : 'Copy Employee ID'}</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {/* Block / Unblock Member */}
                        {isBlocked ? (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    if (onUnblock) onUnblock(row);
                                }}
                            >
                                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                                <span>Unblock Member</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    if (onBlock) onBlock(row);
                                }}
                            >
                                <Ban size={14} className="text-amber-500 shrink-0" />
                                <span>Block Member</span>
                            </button>
                        )}

                        {/* Delete Member */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                if (onDelete) onDelete(row);
                            }}
                        >
                            <Trash2 size={14} className="text-red-500 shrink-0" />
                            <span>Delete Member</span>
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};
