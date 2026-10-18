import React, { FormEvent } from 'react';
import { Loader2, Save } from 'lucide-react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import DatePicker from '@/components/ui/date-picker';
import Button from '@/components/ui/button';
import { ProfileFormData } from './profileStateMappers';
import { LICENSE_CLASS_OPTIONS } from './profileConstants';

interface Props {
    formData: ProfileFormData;
    isSaving: boolean;
    onFieldChange: (field: string, val: string) => void;
    onCancel: () => void;
    onSave: (e: FormEvent) => void;
}

export const CdlEditForm: React.FC<Props> = ({
    formData,
    isSaving,
    onFieldChange,
    onCancel,
    onSave,
}) => {
    return (
        <form onSubmit={onSave} className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Input
                    label="CDL License Number *"
                    value={formData.cdlNumber}
                    onChange={(e) => onFieldChange('cdlNumber', e.target.value)}
                    placeholder="e.g. DL-IE-98452107"
                    required
                />

                <Input
                    label="State / Jurisdiction of Issue *"
                    value={formData.stateOfIssue}
                    onChange={(e) => onFieldChange('stateOfIssue', e.target.value)}
                    placeholder="Dublin Port Region"
                    required
                />

                <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                        CDL Classification *
                    </label>
                    <Select
                        value={formData.licenseClass}
                        onChange={(val) => onFieldChange('licenseClass', val)}
                        options={LICENSE_CLASS_OPTIONS}
                        placeholder="Select CDL Classification"
                    />
                </div>

                <DatePicker
                    label="License Issue Date"
                    value={formData.issueDate}
                    onChange={(e) => onFieldChange('issueDate', e.target.value)}
                />

                <DatePicker
                    label="License Expiration Date *"
                    value={formData.expirationDate}
                    onChange={(e) => onFieldChange('expirationDate', e.target.value)}
                    required
                />

                <div className="sm:col-span-2">
                    <Input
                        label="Endorsements & Special Ratings"
                        value={formData.endorsements}
                        onChange={(e) => onFieldChange('endorsements', e.target.value)}
                        placeholder="HazMat (ADR), Tanker (N), Double/Triple (T)"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onCancel}
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
                    <span>Save CDL</span>
                </Button>
            </div>
        </form>
    );
};
