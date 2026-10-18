import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Truck, X, Save, UploadCloud } from 'lucide-react';
import { driverApi } from '../../../services/driverApi';
import { EquipmentFormFields } from './EquipmentFormFields';

interface EditEquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    fleet: any;
}

export const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({ isOpen, onClose, fleet }) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [tractorModel, setTractorModel] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [trailerNumber, setTrailerNumber] = useState('');
    const [equipmentType, setEquipmentType] = useState('53ft Dry Van');
    const [licensePlate, setLicensePlate] = useState('');
    const [vinNumber, setVinNumber] = useState('');
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

    useEffect(() => {
        if (fleet) {
            setTractorModel(fleet.tractorModel || '');
            setUnitNumber(fleet.unitNumber || '');
            setTrailerNumber(fleet.trailerNumber || '');
            setEquipmentType(fleet.equipmentType || '53ft Dry Van');
            setLicensePlate(fleet.licensePlate || '');
            setVinNumber(fleet.vin || '');
            setInsuranceProvider(fleet.insuranceProvider || '');
            setInsurancePolicyNumber(fleet.insurancePolicyNumber || '');
            setInsuranceExpiryDate(fleet.insuranceExpiryDate || '');
        }
    }, [fleet, isOpen]);

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('tractor_model', tractorModel);
            formData.append('truck_number', unitNumber);
            formData.append('trailer_number', trailerNumber);
            formData.append('equipment_type', equipmentType);
            formData.append('license_plate', licensePlate);
            formData.append('vin_number', vinNumber);
            formData.append('insurance_provider', insuranceProvider);
            formData.append('insurance_policy_number', insurancePolicyNumber);
            formData.append('insurance_expiry_date', insuranceExpiryDate);

            if (insuranceFile) {
                formData.append('insurance_document', insuranceFile);
            }

            await driverApi.updateEquipment(formData);
            onClose();
        } catch (err) {
            console.error('Failed to update equipment:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1e2329] rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                    <div className="flex items-center gap-2">
                        <Truck size={16} className="text-[#ff4a1f]" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Edit Assigned Equipment & Fleet Specs
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
                    <input
                        type="file"
                        ref={fileRef}
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setInsuranceFile(f);
                        }}
                    />

                    <EquipmentFormFields
                        tractorModel={tractorModel}
                        setTractorModel={setTractorModel}
                        unitNumber={unitNumber}
                        setUnitNumber={setUnitNumber}
                        trailerNumber={trailerNumber}
                        setTrailerNumber={setTrailerNumber}
                        equipmentType={equipmentType}
                        setEquipmentType={setEquipmentType}
                        licensePlate={licensePlate}
                        setLicensePlate={setLicensePlate}
                        vinNumber={vinNumber}
                        setVinNumber={setVinNumber}
                        insuranceProvider={insuranceProvider}
                        setInsuranceProvider={setInsuranceProvider}
                        insurancePolicyNumber={insurancePolicyNumber}
                        setInsurancePolicyNumber={setInsurancePolicyNumber}
                        insuranceExpiryDate={insuranceExpiryDate}
                        setInsuranceExpiryDate={setInsuranceExpiryDate}
                    />

                    {/* Upload Insurance Doc */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Insurance Certificate (COI) Document
                        </label>
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="w-full h-10 px-3 rounded-[3px] border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#ff4a1f] flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer bg-slate-50 dark:bg-[#15191e]"
                        >
                            <UploadCloud size={14} className="text-[#ff4a1f]" />
                            <span>
                                {insuranceFile
                                    ? insuranceFile.name
                                    : fleet.insuranceCertificateUrl
                                    ? 'Replace Insurance COI Document'
                                    : 'Upload Insurance Policy / COI'}
                            </span>
                        </button>
                    </div>

                    {/* Modal Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-1.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] shadow-2xs cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                            <Save size={13} />
                            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
