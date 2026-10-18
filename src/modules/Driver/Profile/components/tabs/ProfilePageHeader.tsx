import React from 'react';
import { Phone, Pencil, X } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    isEditing: boolean;
    onToggleEdit: () => void;
    onOpenSupport: () => void;
}

export const ProfilePageHeader: React.FC<Props> = ({
    isEditing,
    onToggleEdit,
    onOpenSupport,
}) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Driver Profile & Settings
                </h1>
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                    Manage your driver credentials, commercial licenses, vehicle assignment, and carrier compliance.
                </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onOpenSupport}
                    className="h-7 text-xs px-2.5 rounded-[4px] border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                    <Phone size={12} className="text-[#FF4A1F]" />
                    <span>Dispatch Support</span>
                </Button>

                <Button
                    type="button"
                    onClick={onToggleEdit}
                    className={`h-7 text-xs px-3 font-bold shadow-2xs cursor-pointer rounded-[4px] flex items-center gap-1.5 transition-all ${
                        isEditing
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                            : 'bg-[#FF4A1F] hover:bg-[#E03E15] text-white'
                    }`}
                >
                    {isEditing ? <X size={12} /> : <Pencil size={12} />}
                    <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
                </Button>
            </div>
        </div>
    );
};
