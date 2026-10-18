import React, { FormEvent } from 'react';
import { CreditCard, Pencil, FileText, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DriverProfile } from '../../../types';
import { ProfileFormData } from './profileStateMappers';
import { ProfileKeyValueRow } from './ProfileKeyValueRow';
import { CdlEditForm } from './CdlEditForm';

interface Props {
    profile: DriverProfile;
    formData: ProfileFormData;
    isEditing: boolean;
    isSaving: boolean;
    onToggleEdit: () => void;
    onFieldChange: (field: string, val: string) => void;
    onCancelEdit: () => void;
    onSave: (e: FormEvent) => void;
    onPreviewDoc: (doc: { isOpen: boolean; title: string; url?: string; type?: string }) => void;
}

export const ProfileTabCdl: React.FC<Props> = ({
    profile,
    formData,
    isEditing,
    isSaving,
    onToggleEdit,
    onFieldChange,
    onCancelEdit,
    onSave,
    onPreviewDoc,
}) => {
    const cdl = profile.cdlDetails;

    return (
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
            <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                    <CreditCard className="w-3.5 h-3.5 text-[#FF4A1F]" />
                    Commercial Driver's License (CDL)
                </CardTitle>
                <button
                    type="button"
                    onClick={onToggleEdit}
                    className="text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer flex items-center gap-1"
                >
                    <Pencil size={11} />
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </button>
            </CardHeader>
            <CardContent className="p-3 sm:p-3.5 space-y-3.5">
                {isEditing ? (
                    <CdlEditForm
                        formData={formData}
                        isSaving={isSaving}
                        onFieldChange={onFieldChange}
                        onCancel={onCancelEdit}
                        onSave={onSave}
                    />
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                            <ProfileKeyValueRow
                                label="CDL License Number"
                                value={formData.cdlNumber || cdl?.cdlNumber}
                                isMono
                                badge={
                                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1 py-0.2 rounded-[2px]">
                                        Verified Active
                                    </span>
                                }
                            />
                            <ProfileKeyValueRow label="State / Jurisdiction" value={formData.stateOfIssue || cdl?.stateOfIssue} />
                            <ProfileKeyValueRow label="CDL Classification" value={formData.licenseClass || cdl?.licenseClass} />
                            <ProfileKeyValueRow
                                label="Original Issue Date"
                                value={formData.issueDate || (cdl?.issueDate ? String(cdl.issueDate).split('T')[0] : '—')}
                            />
                            <ProfileKeyValueRow
                                label="License Expiry Date"
                                value={formData.expirationDate || (cdl?.expirationDate ? String(cdl.expirationDate).split('T')[0] : '—')}
                            />
                            <ProfileKeyValueRow label="Endorsements & Ratings" value={formData.endorsements || cdl?.endorsements} />
                        </div>

                        {/* Documents Subsection */}
                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="p-2 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                CDL Front License
                                            </h4>
                                            <p className="text-[10px] text-slate-400 capitalize">Status: Verified on file</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onPreviewDoc({
                                                isOpen: true,
                                                title: 'Commercial Driver License (Front)',
                                                url: cdl?.cdlFrontUrl,
                                                type: 'CDL Front Document',
                                            })
                                        }
                                        className="h-6 px-2 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs cursor-pointer"
                                    >
                                        <Eye className="w-3 h-3" /> View
                                    </button>
                                </div>

                                <div className="p-2 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        <div className="min-w-0">
                                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                CDL Back Endorsements
                                            </h4>
                                            <p className="text-[10px] text-slate-400 capitalize">Status: Verified on file</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onPreviewDoc({
                                                isOpen: true,
                                                title: 'Commercial Driver License (Back)',
                                                url: cdl?.cdlBackUrl,
                                                type: 'CDL Back Document',
                                            })
                                        }
                                        className="h-6 px-2 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs cursor-pointer"
                                    >
                                        <Eye className="w-3 h-3" /> View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
