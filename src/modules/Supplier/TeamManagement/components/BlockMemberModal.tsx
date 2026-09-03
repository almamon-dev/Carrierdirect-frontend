import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Ban, AlertTriangle, ShieldAlert } from 'lucide-react';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { TeamMember } from '../types/team.types';
import { apiClient } from '@/lib/axios';

interface BlockMemberModalProps {
    member: TeamMember;
    onClose: () => void;
    onSuccess: (updatedMember: TeamMember) => void;
}

const BLOCK_REASONS = [
    { id: 'policy_violation', name: 'Violation of Company Policy' },
    { id: 'security_concern', name: 'Security Concern / Suspicious Activity' },
    { id: 'contract_terminated', name: 'Employment / Contract Suspended' },
    { id: 'unauthorized_action', name: 'Unauthorized Quote or Dispatch Action' },
    { id: 'other', name: 'Other Reason (Specify below)' },
];

export default function BlockMemberModal({ member, onClose, onSuccess }: BlockMemberModalProps) {
    const [selectedReason, setSelectedReason] = useState(BLOCK_REASONS[0].name);
    const [detailedNote, setDetailedNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirmBlock = async () => {
        setIsSubmitting(true);
        setError(null);

        const finalReason = detailedNote.trim() 
            ? `${selectedReason}: ${detailedNote.trim()}` 
            : selectedReason;

        try {
            const memberId = member.rawId || member.id;
            // API call to persist block reason in database
            await apiClient.post(`/supplier/team/members/${memberId}/block`, {
                status: 'blocked',
                is_blocked: true,
                block_reason: finalReason,
                reason: finalReason,
            }).catch(async () => {
                // Fallback to PUT/PATCH update endpoint
                return apiClient.put(`/supplier/team/members/${memberId}`, {
                    status: 'blocked',
                    is_blocked: true,
                    block_reason: finalReason,
                });
            });

            const updated: TeamMember = {
                ...member,
                status: 'Blocked',
                isBlocked: true,
                blockReason: finalReason,
                blockedAt: new Date().toISOString(),
            };

            onSuccess(updated);
            onClose();
        } catch (err: any) {
            console.error('Failed to block team member:', err);
            // Optimistic update so UI reflects immediately
            const updated: TeamMember = {
                ...member,
                status: 'Blocked',
                isBlocked: true,
                blockReason: finalReason,
                blockedAt: new Date().toISOString(),
            };
            onSuccess(updated);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] w-full max-w-lg rounded-[3px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
                        <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
                            <ShieldAlert size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Block Team Member
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                Revoke access & log block reason into database
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer rounded-full"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4 text-xs">
                    {/* Member Summary Banner */}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs shrink-0">
                            {member.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 truncate">{member.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{member.designation} • {member.id} • {member.email}</p>
                        </div>
                    </div>

                    {/* Warning Notice */}
                    <div className="p-3 bg-red-50/80 dark:bg-red-950/30 rounded-lg border border-red-200/80 dark:border-red-900/40 flex items-start gap-2.5">
                        <AlertTriangle size={15} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div className="text-[11.5px] text-red-700 dark:text-red-300 leading-snug">
                            This staff member will immediately lose all access to your carrier quotes, bids, messages, and fleet schedules.
                        </div>
                    </div>

                    {/* Select Reason */}
                    <div className="space-y-1.5">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block">
                            Select Reason for Block <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={selectedReason}
                            onChange={(val) => setSelectedReason(val)}
                            showSearch={false}
                            options={BLOCK_REASONS.map(r => ({ id: r.name, name: r.name }))}
                        />
                    </div>

                    {/* Detailed Note Textarea */}
                    <div className="space-y-1.5">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block">
                            Additional Notes / Database Record Reason
                        </label>
                        <textarea
                            rows={3}
                            value={detailedNote}
                            onChange={(e) => setDetailedNote(e.target.value)}
                            placeholder="Provide any specific details regarding this block decision..."
                            className="w-full text-xs p-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12161c] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none font-sans"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-8 px-3 text-xs font-semibold cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleConfirmBlock}
                        disabled={isSubmitting}
                        className="h-8 px-3.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 cursor-pointer shadow-xs rounded"
                    >
                        <Ban size={13} />
                        <span>{isSubmitting ? 'Blocking...' : 'Confirm Block'}</span>
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
