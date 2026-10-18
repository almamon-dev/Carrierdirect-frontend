import React, { FormEvent } from 'react';
import { Truck, Pencil, Box, Loader2, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import { DriverProfile } from '../../../types';
import { ProfileFormData } from './profileStateMappers';
import { EQUIPMENT_TYPE_OPTIONS } from './profileConstants';
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
}

export const ProfileTabVehicle: React.FC<Props> = ({
    profile,
    formData,
    isEditing,
    isSaving,
    onToggleEdit,
    onFieldChange,
    onCancelEdit,
    onSave,
}) => {
    const equipment = profile.fleetEquipment;

    return (
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
            <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                    <Truck className="w-3.5 h-3.5 text-[#FF4A1F]" />
                    Assigned Vehicle & Equipment Specifications
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
                    <form onSubmit={onSave} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <Input
                                label="Tractor Make & Model *"
                                value={formData.tractorModel}
                                onChange={(e) => onFieldChange('tractorModel', e.target.value)}
                                placeholder="Volvo FH16 750 Globetrotter"
                                required
                            />

                            <Input
                                label="Power Unit Fleet # *"
                                value={formData.unitNumber}
                                onChange={(e) => onFieldChange('unitNumber', e.target.value)}
                                placeholder="TRK-7701"
                                required
                            />

                            <Input
                                label="Commercial License Plate *"
                                value={formData.licensePlate}
                                onChange={(e) => onFieldChange('licensePlate', e.target.value)}
                                placeholder="231-D-45892"
                                required
                            />

                            <Input
                                label="Chassis 17-digit VIN *"
                                value={formData.vin}
                                onChange={(e) => onFieldChange('vin', e.target.value)}
                                placeholder="1M8GDM9A2IE291038"
                                required
                            />
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                                <Box className="w-3 h-3 text-[#FF4A1F]" />
                                <span>Assigned Trailer Specifications</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <Input
                                    label="Trailer Unit Number *"
                                    value={formData.trailerNumber}
                                    onChange={(e) => onFieldChange('trailerNumber', e.target.value)}
                                    placeholder="TRL-9942"
                                    required
                                />

                                <div>
                                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                        Equipment / Trailer Type *
                                    </label>
                                    <Select
                                        value={formData.equipmentType}
                                        onChange={(val) => onFieldChange('equipmentType', val)}
                                        options={EQUIPMENT_TYPE_OPTIONS}
                                        placeholder="Select Equipment Type"
                                    />
                                </div>
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
                                <span>Save Vehicle</span>
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                            <ProfileKeyValueRow label="Tractor Make & Model" value={formData.tractorModel || equipment?.tractorModel} />
                            <ProfileKeyValueRow label="Power Unit Fleet #" value={formData.unitNumber || equipment?.unitNumber} isMono />
                            <ProfileKeyValueRow label="Vehicle License Plate" value={formData.licensePlate || equipment?.licensePlate} isMono />
                            <ProfileKeyValueRow label="Chassis 17-digit VIN" value={formData.vin || equipment?.vin} isMono />
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                <ProfileKeyValueRow label="Assigned Trailer Number" value={formData.trailerNumber || equipment?.trailerNumber} isMono />
                                <ProfileKeyValueRow label="Equipment / Trailer Type" value={formData.equipmentType || equipment?.equipmentType} />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
