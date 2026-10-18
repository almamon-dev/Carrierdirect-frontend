import React, { FormEvent } from 'react';
import { Lock, MapPin, Save, Loader2 } from 'lucide-react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { ProfileFormData } from './profileStateMappers';

interface Props {
    formData: ProfileFormData;
    isSaving: boolean;
    onFieldChange: (field: string, val: string) => void;
    onCancel: () => void;
    onSave: (e: FormEvent) => void;
}

export const IdentityEditForm: React.FC<Props> = ({
    formData,
    isSaving,
    onFieldChange,
    onCancel,
    onSave,
}) => {
    return (
        <form onSubmit={onSave} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Input
                    label="Legal Full Name *"
                    value={formData.name}
                    onChange={(e) => onFieldChange('name', e.target.value)}
                    placeholder="e.g. Conor Gallagher"
                    required
                />

                <div className="relative">
                    <Input
                        label="Primary Account Email *"
                        type="email"
                        value={formData.email}
                        disabled
                        placeholder="driver@fleet.com"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-[34px]" />
                </div>

                <Input
                    label="Direct Mobile Phone *"
                    value={formData.phone}
                    onChange={(e) => onFieldChange('phone', e.target.value)}
                    placeholder="+353 87 123 4567"
                    required
                />

                <Input
                    label="Commercial Designation / Role"
                    value={formData.title}
                    onChange={(e) => onFieldChange('title', e.target.value)}
                    placeholder="Heavy Commercial Vehicle Driver"
                />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#FF4A1F]" />
                    <span>Domicile Address & Terminal</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <Input
                        label="State / Region"
                        value={formData.state}
                        onChange={(e) => onFieldChange('state', e.target.value)}
                        placeholder="e.g. Dublin Division"
                    />

                    <Input
                        label="City *"
                        value={formData.city}
                        onChange={(e) => onFieldChange('city', e.target.value)}
                        placeholder="e.g. Dublin"
                        required
                    />

                    <Input
                        label="Zip / Postal Code *"
                        value={formData.zipCode}
                        onChange={(e) => onFieldChange('zipCode', e.target.value)}
                        placeholder="e.g. 1212"
                        required
                    />

                    <div className="sm:col-span-2">
                        <Input
                            label="Street Address *"
                            value={formData.address}
                            onChange={(e) => onFieldChange('address', e.target.value)}
                            placeholder="Street address, building, apartment/suite"
                            required
                        />
                    </div>
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
                    <span>Save Profile</span>
                </Button>
            </div>
        </form>
    );
};
