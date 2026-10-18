import React from 'react';
import { Shield, CheckCircle2, Clock, AlertTriangle, Edit3, X, Save } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import Button from '@/components/ui/button';

interface Props {
    isVerified: boolean;
    isUnderReview: boolean;
    isRejected: boolean;
    isEditMode: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}

export const CredentialsSectionHeader: React.FC<Props> = ({
    isVerified,
    isUnderReview,
    isRejected,
    isEditMode,
    isSaving,
    onEdit,
    onCancel,
    onSave,
}) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <TabHeader title="Credentials & Compliance Dossier" icon={Shield} />

            <div className="flex items-center gap-2">
                {isVerified ? (
                    <span className="h-7 px-2.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-[3px] border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span>FMCSA Compliant</span>
                    </span>
                ) : isUnderReview ? (
                    <span className="h-7 px-2.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-[3px] border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 shadow-2xs">
                        <Clock size={12} className="text-amber-600 animate-spin-slow" />
                        <span>Verification Under Review</span>
                    </span>
                ) : isRejected ? (
                    <span className="h-7 px-2.5 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 rounded-[3px] border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 shadow-2xs">
                        <AlertTriangle size={12} className="text-rose-600" />
                        <span>Revision Requested</span>
                    </span>
                ) : (
                    <span className="h-7 px-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>Pending Setup</span>
                    </span>
                )}

                {!isEditMode ? (
                    <Button
                        type="button"
                        size="sm"
                        onClick={onEdit}
                        className="h-7 px-3 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                        <Edit3 size={12} />
                        <span>Edit Credentials</span>
                    </Button>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="h-7 px-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <X size={12} />
                            <span>Cancel</span>
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={isSaving}
                            className="h-7 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-[3px] shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <Save size={12} />
                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
