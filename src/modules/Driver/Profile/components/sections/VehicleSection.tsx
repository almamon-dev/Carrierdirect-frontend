import React, { useState, useRef, useEffect } from 'react';
import {
    Truck, ShieldCheck, FileText, CheckCircle2,
    Calendar, Tag, Hash, CreditCard, Box, Radio, Gauge, Navigation,
    Plus, Edit3, Trash2, X, Save, UploadCloud
} from 'lucide-react';
import { DriverProfile } from '../../../types';
import { driverApi } from '../../../services/driverApi';
import TabHeader from '@/components/ui/tab-header';
import { DocumentPreviewModal } from '../DocumentPreviewModal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import DatePicker from '@/components/ui/date-picker';

interface Props {
    profile: DriverProfile;
}

const KeyValueRow = ({
    label,
    value,
    isMono = false,
    highlight = false,
    icon: Icon,
    iconColor = 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
    action
}: {
    label: string;
    value: React.ReactNode;
    isMono?: boolean;
    highlight?: boolean;
    icon?: any;
    iconColor?: string;
    action?: React.ReactNode;
}) => (
    <div className="flex items-start justify-between py-[5px] text-[13px]">
        <div className="flex items-start gap-1.5 min-w-0 flex-1 pr-2">
            {Icon && (
                <div className={`w-5 h-5 rounded-[3px] flex items-center justify-center shrink-0 mt-0.5 ${iconColor}`}>
                    <Icon size={11} />
                </div>
            )}
            <span className="w-[140px] shrink-0 text-slate-600 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium select-none px-0.5">:</span>
            <span className={`break-words ${isMono ? 'font-mono' : ''} ${highlight ? 'font-bold text-[#ff4a1f]' : 'font-semibold text-slate-900 dark:text-white'}`}>
                {value || '—'}
            </span>
        </div>
        {action && <div className="shrink-0 ml-2">{action}</div>}
    </div>
);

const equipmentTypeOptions = [
    { value: "53ft Dry Van", label: "53ft Dry Van Trailer" },
    { value: "53ft Reefer", label: "53ft Temperature Controlled Reefer" },
    { value: "Flatbed", label: "Standard Flatbed Trailer" },
    { value: "Step Deck", label: "Step Deck / Drop Deck" },
    { value: "Power Only", label: "Power Only (Tractor Unit Only)" },
    { value: "Tanker", label: "Liquid / Bulk Tanker" },
    { value: "Box Truck", label: "Commercial Box Truck (26ft)" },
];

export const VehicleSection: React.FC<Props> = ({ profile }) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // Form state
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

    const [previewDoc, setPreviewDoc] = useState<{
        isOpen: boolean;
        title: string;
        fileUrl: string;
        fileType?: string;
    }>({
        isOpen: false,
        title: '',
        fileUrl: '',
    });

    const openDocPreview = (title: string, fileUrl: string, fileType = 'PDF Document') => {
        if (!fileUrl) return;
        setPreviewDoc({ isOpen: true, title, fileUrl, fileType });
    };

    const fleet = profile.fleetEquipment || ({} as any);

    useEffect(() => {
        setTractorModel(fleet.tractorModel || '');
        setUnitNumber(fleet.unitNumber || '');
        setTrailerNumber(fleet.trailerNumber || '');
        setEquipmentType(fleet.equipmentType || '53ft Dry Van');
        setLicensePlate(fleet.licensePlate || '');
        setVinNumber(fleet.vin || '');
        setInsuranceProvider(fleet.insuranceProvider || '');
        setInsurancePolicyNumber(fleet.insurancePolicyNumber || '');
        setInsuranceExpiryDate(fleet.insuranceExpiryDate || '');
    }, [profile]);

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
            setIsEditOpen(false);
        } catch (err) {
            console.error('Failed to update equipment:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Header & Actions */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <TabHeader title="Assigned Fleet & Equipment" icon={Truck} />
                <Button
                    type="button"
                    size="sm"
                    onClick={() => setIsEditOpen(true)}
                    className="h-8 px-3.5 text-xs sm:text-[13px] font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                    <Edit3 size={14} />
                    <span>Edit Equipment Specs</span>
                </Button>
            </div>

            {/* Live Assigned Vehicle Card */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-800/80 rounded-md p-4 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#ff4a1f]"></div>

                {/* Assignment Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/60 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-800/60">
                            <Truck size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    {fleet.tractorModel || 'Equipment Not Assigned'}
                                </h3>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                                    fleet.unitNumber || fleet.tractorModel
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60"
                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                                }`}>
                                    <CheckCircle2 size={12} className={`mr-1 ${fleet.unitNumber || fleet.tractorModel ? "text-emerald-600" : "text-slate-400"}`} />
                                    {fleet.unitNumber || fleet.tractorModel ? "Active Assigned" : "Pending Assignment"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Unit Number: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{fleet.unitNumber || '—'}</span> • Trailer: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{fleet.trailerNumber || '—'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {fleet.insuranceCertificateUrl && (
                            <button
                                type="button"
                                onClick={() => openDocPreview("Commercial Insurance Policy", fleet.insuranceCertificateUrl)}
                                className="h-7 px-2.5 text-xs font-semibold text-[#ff4a1f] bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/40 border border-orange-200/60 dark:border-orange-800/60 rounded-[3px] flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <FileText size={12} />
                                <span>Insurance Policy</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Detailed Spec Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
                    {/* Column 1: Power Unit Specs */}
                    <div className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                            <Tag size={12} />
                            <span>Power Unit Specs</span>
                        </div>
                        <KeyValueRow
                            label="Tractor Model"
                            value={fleet.tractorModel}
                            icon={Truck}
                        />
                        <KeyValueRow
                            label="Power Unit #"
                            value={fleet.unitNumber}
                            isMono
                            icon={Hash}
                        />
                        <KeyValueRow
                            label="License Plate"
                            value={fleet.licensePlate}
                            isMono
                            icon={CreditCard}
                        />
                        <KeyValueRow
                            label="Vehicle VIN"
                            value={fleet.vin}
                            isMono
                            icon={ShieldCheck}
                        />
                    </div>

                    {/* Column 2: Equipment & Trailer */}
                    <div className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                            <Box size={12} />
                            <span>Assigned Trailer</span>
                        </div>
                        <KeyValueRow
                            label="Equipment Type"
                            value={fleet.equipmentType}
                            icon={Box}
                        />
                        <KeyValueRow
                            label="Trailer #"
                            value={fleet.trailerNumber}
                            isMono
                            icon={Hash}
                        />
                        <KeyValueRow
                            label="Inspection Status"
                            value={
                                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-bold">
                                    <CheckCircle2 size={12} className="mr-1" />
                                    {fleet.inspectionStatus || 'Pending Inspection'}
                                </span>
                            }
                            icon={ShieldCheck}
                            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                        />
                    </div>

                    {/* Column 3: Commercial Insurance */}
                    <div className="space-y-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                            <ShieldCheck size={12} />
                            <span>Fleet Insurance</span>
                        </div>
                        <KeyValueRow
                            label="Carrier Insurer"
                            value={fleet.insuranceProvider || '—'}
                            icon={ShieldCheck}
                            iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
                        />
                        <KeyValueRow
                            label="Policy Number"
                            value={fleet.insurancePolicyNumber || '—'}
                            isMono
                            icon={FileText}
                            iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
                        />
                        <KeyValueRow
                            label="Policy Expiry"
                            value={
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                    {fleet.insuranceExpiryDate || '—'}
                                </span>
                            }
                            icon={Calendar}
                            iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                        />
                    </div>
                </div>
            </div>

            {/* Edit Equipment Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#1e2329] rounded-xl border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
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
                                onClick={() => setIsEditOpen(false)}
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
                                            const selectedVal = typeof val === "object" ? (val?.value ?? val?.target?.value ?? "") : (val || "");
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
                                    <span>{insuranceFile ? insuranceFile.name : (fleet.insuranceCertificateUrl ? 'Replace Insurance COI Document' : 'Upload Insurance Policy / COI')}</span>
                                </button>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
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
                </div>
            )}

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                isOpen={previewDoc.isOpen}
                onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
                title={previewDoc.title}
                fileUrl={previewDoc.fileUrl}
                fileType={previewDoc.fileType}
            />
        </div>
    );
};

export default VehicleSection;
