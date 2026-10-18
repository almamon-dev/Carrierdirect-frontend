import React from 'react';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import DatePicker from '@/components/ui/date-picker';
import { equipmentTypeOptions } from './equipmentConstants';

interface EquipmentFormFieldsProps {
    tractorModel: string;
    setTractorModel: (val: string) => void;
    unitNumber: string;
    setUnitNumber: (val: string) => void;
    trailerNumber: string;
    setTrailerNumber: (val: string) => void;
    equipmentType: string;
    setEquipmentType: (val: string) => void;
    licensePlate: string;
    setLicensePlate: (val: string) => void;
    vinNumber: string;
    setVinNumber: (val: string) => void;
    insuranceProvider: string;
    setInsuranceProvider: (val: string) => void;
    insurancePolicyNumber: string;
    setInsurancePolicyNumber: (val: string) => void;
    insuranceExpiryDate: string;
    setInsuranceExpiryDate: (val: string) => void;
}

export const EquipmentFormFields: React.FC<EquipmentFormFieldsProps> = ({
    tractorModel,
    setTractorModel,
    unitNumber,
    setUnitNumber,
    trailerNumber,
    setTrailerNumber,
    equipmentType,
    setEquipmentType,
    licensePlate,
    setLicensePlate,
    vinNumber,
    setVinNumber,
    insuranceProvider,
    setInsuranceProvider,
    insurancePolicyNumber,
    setInsurancePolicyNumber,
    insuranceExpiryDate,
    setInsuranceExpiryDate,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
                label="Tractor Make & Model"
                value={tractorModel}
                onChange={(e) => setTractorModel(e.target.value)}
                placeholder="e.g. Freightliner Cascadia"
            />
            <Input
                label="Power Unit / Truck Number"
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                placeholder="e.g. TRK-101"
            />
            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Equipment / Trailer Type
                </label>
                <Select
                    value={equipmentType}
                    onChange={(val) => {
                        const selectedVal = typeof val === 'object' ? (val?.value ?? val?.target?.value ?? '') : (val || '');
                        setEquipmentType(selectedVal);
                    }}
                    options={equipmentTypeOptions}
                />
            </div>
            <Input
                label="Assigned Trailer Number"
                value={trailerNumber}
                onChange={(e) => setTrailerNumber(e.target.value)}
                placeholder="e.g. TRL-559"
            />
            <Input
                label="License Plate"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="e.g. ABC-12345"
            />
            <Input
                label="VIN Number"
                value={vinNumber}
                onChange={(e) => setVinNumber(e.target.value)}
                placeholder="e.g. 1FT8W3BT9H..."
            />
            <Input
                label="Insurance Provider"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                placeholder="e.g. Progressive Commercial"
            />
            <Input
                label="Insurance Policy Number"
                value={insurancePolicyNumber}
                onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                placeholder="e.g. POL-984018"
            />
            <div className="sm:col-span-2">
                <DatePicker
                    label="Insurance Expiry Date"
                    value={insuranceExpiryDate}
                    onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                />
            </div>
        </div>
    );
};
