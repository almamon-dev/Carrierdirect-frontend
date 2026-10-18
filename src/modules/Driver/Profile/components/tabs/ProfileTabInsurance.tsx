import React, { FormEvent } from 'react';
import { ShieldCheck, Pencil, FileText, Eye, Loader2, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Input from '@/components/ui/input';
import DatePicker from '@/components/ui/date-picker';
import Button from '@/components/ui/button';
import { DriverProfile } from '../../../types';
import { ProfileFormData } from './profileStateMappers';
import { ProfileKeyValueRow } from './ProfileKeyValueRow';

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

export const ProfileTabInsurance: React.FC<Props> = ({
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
    const equipment = profile.fleetEquipment;

    return (
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
            <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF4A1F]" />
                    Commercial Fleet Liability & Cargo Insurance
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
                    <form onSubmit={onSave} className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <Input
                                label="Insurance Provider / Underwriter *"
                                value={formData.insuranceProvider}
                                onChange={(e) => onFieldChange('insuranceProvider', e.target.value)}
                                placeholder="Allianz Commercial Fleet Insurance"
                                required
                            />

                            <Input
                                label="Master Policy Number *"
                                value={formData.insurancePolicyNumber}
                                onChange={(e) => onFieldChange('insurancePolicyNumber', e.target.value)}
                                placeholder="ALZ-COMM-883920"
                                required
                            />

                            <div className="sm:col-span-2">
                                <DatePicker
                                    label="Policy Expiration / Renewal Date *"
                                    value={formData.insuranceExpiryDate}
                                    onChange={(e) => onFieldChange('insuranceExpiryDate', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onCancelEdit}
                                className="h-7 text-xs px-2.5 rounded-[3px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="h-7 text-xs px-3 bg-[#FF4A1F] hover:bg-[#E03E15] font-bold text-white shadow-2xs cursor-pointer rounded-[3px] flex items-center gap-1.5"
                            >
                                {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                <span>Save Insurance</span>
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                            <ProfileKeyValueRow
                                label="Insurance Provider"
                                value={formData.insuranceProvider || equipment?.insuranceProvider}
                            />
                            <ProfileKeyValueRow
                                label="Master Policy Number"
                                value={formData.insurancePolicyNumber || equipment?.insurancePolicyNumber}
                                isMono
                                badge={
                                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1 py-0.2 rounded-[2px]">
                                        Active Policy
                                    </span>
                                }
                            />
                            <ProfileKeyValueRow
                                label="Policy Expiration / Renewal"
                                value={
                                    formData.insuranceExpiryDate ||
                                    (equipment?.insuranceExpiryDate ? String(equipment.insuranceExpiryDate).split('T')[0] : '—')
                                }
                            />
                        </div>

                        {/* Documents Subsection */}
                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="p-2 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 max-w-md">
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                            Commercial Liability Certificate
                                        </h4>
                                        <p className="text-[10px] text-slate-400 capitalize">
                                            Coverage: $1,000,000 active policy
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onPreviewDoc({
                                            isOpen: true,
                                            title: 'Fleet Insurance Policy Certificate',
                                            url: equipment?.insuranceCertificateUrl,
                                            type: 'Insurance Certificate',
                                        })
                                    }
                                    className="h-6 px-2 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs cursor-pointer"
                                >
                                    <Eye className="w-3 h-3" /> View
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
