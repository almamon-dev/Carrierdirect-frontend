import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Eye, Mail, Ban, CheckCircle, Trash2, Copy, Check, Send } from 'lucide-react';
import { TeamMember } from '../types/team.types';

interface TeamMemberActionsMenuProps {
    isOpen: boolean;
    row: TeamMember;
    dropdownPos: { top: number; left: number };
    onClose: () => void;
    onDelete?: (row: TeamMember) => void;
    onBlock?: (row: TeamMember) => void;
    onUnblock?: (row: TeamMember) => void;
    onResendInvite?: (row: TeamMember) => void;
}

export const TeamMemberActionsMenu: React.FC<TeamMemberActionsMenuProps> = ({
    isOpen,
    row,
    dropdownPos,
    onClose,
    onDelete,
    onBlock,
    onUnblock,
    onResendInvite,
}) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    if (!isOpen || typeof document === 'undefined') return null;

    const isBlocked = row.status === 'Blocked' || Boolean(row.isBlocked);
    const isPending = row.status === 'Pending' || (row.status as string) === 'invited' || row.lastLogin === 'Never';

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            onClose();
        }, 1200);
    };

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        const memberId = row.rawId || row.id;
                        navigate(`/supplier/team/member/${memberId}`);
                    }}
                >
                    <Eye size={14} className="text-slate-400 shrink-0" />
                    <span>View Profile</span>
                </button>

                {isPending && onResendInvite && (
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            onClose();
                            onResendInvite(row);
                        }}
                    >
                        <Send size={14} className="text-[#FF4A1F] shrink-0" />
                        <span>Resend Invitation</span>
                    </button>
                )}

                {row.email && (
                    <a
                        href={`mailto:${row.email}`}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={onClose}
                    >
                        <Mail size={14} className="text-slate-400 shrink-0" />
                        <span>Send Email</span>
                    </a>
                )}

                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => handleCopy(row.id)}
                >
                    {copied ? (
                        <Check size={14} className="text-emerald-500 shrink-0" />
                    ) : (
                        <Copy size={14} className="text-slate-400 shrink-0" />
                    )}
                    <span>{copied ? 'Copied ID!' : 'Copy Employee ID'}</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {isBlocked ? (
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            onClose();
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
                            onClose();
                            if (onBlock) onBlock(row);
                        }}
                    >
                        <Ban size={14} className="text-amber-500 shrink-0" />
                        <span>Block Member</span>
                    </button>
                )}

                <button
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        if (onDelete) onDelete(row);
                    }}
                >
                    <Trash2 size={14} className="text-red-500 shrink-0" />
                    <span>Delete Member</span>
                </button>
            </div>
        </>,
        document.body
    );
};
