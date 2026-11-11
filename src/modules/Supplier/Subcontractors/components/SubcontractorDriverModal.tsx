import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Mail, FileText, Check, ShieldCheck, Calendar } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import { Subcontractor, SubcontractorDriver } from '../types';

interface SubcontractorDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    subcontractor: Subcontractor | null;
    driver?: SubcontractorDriver | null;
    onSave: (subcontractorId: number | string, data: any) => Promise<void>;
}

export const SubcontractorDriverModal: React.FC<SubcontractorDriverModalProps> = ({
    isOpen,
    onClose,
    subcontractor,
    driver,
    onSave,
}) => {
    const isEdit = Boolean(driver?.id);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [notes, setNotes] = useState('');

    // Driver Compliance fields
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [licenseFile, setLicenseFile] = useState<File | null>(null);
    const [insuranceExpiry, setInsuranceExpiry] = useState('');
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (driver) {
            setName(driver.name || '');
            setEmail(driver.email || '');
            setPhone(driver.phone || '');
            setLicenseNumber(driver.driver_license_number || '');
            setVehiclePlate(driver.vehicle_plate || '');
            setVehicleType(driver.vehicle_type || '');
            setStatus(driver.status || 'active');
            setNotes(driver.notes || '');
            setLicenseExpiry(driver.license_expiry_date ? String(driver.license_expiry_date).split('T')[0] : '');
            setInsuranceExpiry(driver.insurance_expiry_date ? String(driver.insurance_expiry_date).split('T')[0] : '');
            setLicenseFile(null);
            setInsuranceFile(null);
        } else {
            setName('');
            setEmail('');
            setPhone('');
            setLicenseNumber('');
            setVehiclePlate('');
            setVehicleType('');
            setStatus('active');
            setNotes('');
            setLicenseExpiry('');
            setInsuranceExpiry('');
            setLicenseFile(null);
            setInsuranceFile(null);
        }
        setError(null);
    }, [driver, isOpen]);

    if (!isOpen || !subcontractor) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Driver name is required.');
            return;
        }
        if (!email.trim()) {
            setError('Driver email is required for Driver App login.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            setError('Please enter a valid driver email address.');
            return;
        }
        if (!phone.trim()) {
            setError('Driver contact phone number is required.');
            return;
        }

        if (!isEdit && !licenseFile) {
            setError('Driving Licence document is required for subcontractor driver.');
            return;
        }
        if (!isEdit && !licenseExpiry) {
            setError('Driving Licence expiry date is required.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('email', email.trim());
            formData.append('phone', phone.trim());
            if (licenseNumber.trim()) formData.append('driver_license_number', licenseNumber.trim());
            if (vehiclePlate.trim()) formData.append('vehicle_plate', vehiclePlate.trim());
            if (vehicleType.trim()) formData.append('vehicle_type', vehicleType.trim());
            formData.append('status', status);
            if (notes.trim()) formData.append('notes', notes.trim());

            if (licenseExpiry) formData.append('license_expiry_date', licenseExpiry);
            if (licenseFile) formData.append('license_file', licenseFile);

            if (insuranceExpiry) formData.append('insurance_expiry_date', insuranceExpiry);
            if (insuranceFile) formData.append('insurance_file', insuranceFile);

            await onSave(subcontractor.id, formData);
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to save subcontractor driver.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] font-sans my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <User size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                                {isEdit ? 'Edit Subcontractor Driver' : 'Add Driver under Subcontractor'}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Contractor: <strong className="text-slate-800 dark:text-slate-200">{subcontractor.name}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-[4px] cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                    {/* Scrollable Form Body */}
                    <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                        {error && (
                            <div className="p-2.5 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                                {error}
                            </div>
                        )}

                        <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-[4px] text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
                            <ShieldCheck size={14} className="shrink-0 mt-0.5 text-blue-600" />
                            <span>
                                Driver will be isolated to subcontractor jobs assigned by your dispatchers. They can log in to the Driver App using their email address.
                            </span>
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Driver Full Name <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Input
                                icon={<User size={13} />}
                                type="text"
                                required
                                disabled={isSubmitting}
                                placeholder="e.g. Liam O'Connor"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-8.5 text-xs rounded-[4px]"
                            />
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Email (Driver App Login) <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Input
                                icon={<Mail size={13} />}
                                type="email"
                                required
                                disabled={isSubmitting}
                                placeholder="driver@subcontractor.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-8.5 text-xs rounded-[4px]"
                            />
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Contact Phone Number <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Input
                                icon={<Phone size={13} />}
                                type="text"
                                required
                                disabled={isSubmitting}
                                placeholder="+353 87 123 4567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-8.5 text-xs rounded-[4px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Vehicle Registration
                                </FormLabel>
                                <Input
                                    type="text"
                                    disabled={isSubmitting}
                                    placeholder="e.g. 212-C-8492"
                                    value={vehiclePlate}
                                    onChange={(e) => setVehiclePlate(e.target.value)}
                                    className="h-8.5 text-xs rounded-[4px]"
                                />
                            </div>

                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Status
                                </FormLabel>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    disabled={isSubmitting}
                                    className="w-full h-8.5 px-3 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e2329] text-xs font-medium text-slate-800 dark:text-slate-200 outline-hidden"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* DRIVER COMPLIANCE DOCUMENTS */}
                        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-[4px] space-y-3">
                            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold text-xs">
                                <ShieldCheck size={14} className="text-[#ff4a1f]" />
                                <span>Driver Compliance Verification</span>
                            </div>

                            {/* 1. Driving Licence Document & Expiry */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Driving Licence {!isEdit && <span className="text-rose-500">*</span>}
                                    </FormLabel>
                                    {driver?.license_status && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                            driver.license_status === 'verified'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : (driver.license_status === 'expired' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')
                                        }`}>
                                            {driver.license_status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="relative">
                                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                            Licence Document {!isEdit && <span className="text-rose-500">*</span>}
                                        </label>
                                        <input
                                            type="file"
                                            id="driver_license_file"
                                            disabled={isSubmitting}
                                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                                            onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                                            className="text-[11px] file:mr-2 file:py-1 file:px-2 file:rounded-[3px] file:border-0 file:text-[11px] file:font-semibold file:bg-white dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-100 w-full cursor-pointer border border-slate-300 dark:border-slate-700 rounded-[4px] p-1 bg-white dark:bg-[#1e2329]"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                            Expiry Date {!isEdit && <span className="text-rose-500">*</span>}
                                        </label>
                                        <Input
                                            type="date"
                                            disabled={isSubmitting}
                                            value={licenseExpiry}
                                            onChange={(e) => setLicenseExpiry(e.target.value)}
                                            className="h-8 text-xs rounded-[4px]"
                                            title="Licence Expiry Date"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Driver Insurance / CPC Certificate */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Insurance / CPC Certificate
                                    </FormLabel>
                                    {driver?.insurance_status && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${driver.insurance_status === 'verified'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : (driver.insurance_status === 'expired' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')
                                            }`}>
                                            {driver.insurance_status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="relative">
                                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                            Insurance / CPC File
                                        </label>
                                        <input
                                            type="file"
                                            id="driver_insurance_file"
                                            disabled={isSubmitting}
                                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                                            onChange={(e) => setInsuranceFile(e.target.files?.[0] || null)}
                                            className="text-[11px] file:mr-2 file:py-1 file:px-2 file:rounded-[3px] file:border-0 file:text-[11px] file:font-semibold file:bg-white dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-100 w-full cursor-pointer border border-slate-300 dark:border-slate-700 rounded-[4px] p-1 bg-white dark:bg-[#1e2329]"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                            Expiry Date
                                        </label>
                                        <Input
                                            type="date"
                                            disabled={isSubmitting}
                                            value={insuranceExpiry}
                                            onChange={(e) => setInsuranceExpiry(e.target.value)}
                                            className="h-8 text-xs rounded-[4px]"
                                            title="Insurance Expiry Date"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                                🔔 Automatic reminder emails will be sent to the driver <strong>7 days</strong> and <strong>3 days</strong> before license expiry.
                            </p>
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Notes (Optional)
                            </FormLabel>
                            <textarea
                                rows={2}
                                disabled={isSubmitting}
                                placeholder="Available regions, ADR certs, qualifications..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2.5 rounded-[4px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e2329] text-xs text-slate-800 dark:text-slate-200 outline-hidden resize-none"
                            />
                        </div>
                    </div>

                    {/* Fixed Footer Actions */}
                    <div className="px-4 sm:px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="h-8.5 px-4 text-xs font-semibold rounded-[4px] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={isSubmitting}
                            className="h-8.5 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                            <Check size={13} />
                            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Driver' : 'Add Driver'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default SubcontractorDriverModal;
