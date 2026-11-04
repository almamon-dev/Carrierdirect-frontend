import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Truck, FileText, Check, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import { Subcontractor, SubcontractorDriver } from '../types';

interface SubcontractorDriverModalProps {
    isOpen: boolean;
    onClose: () => void;
    subcontractor: Subcontractor | null;
    driver?: SubcontractorDriver | null;
    onSave: (subcontractorId: number | string, data: Partial<SubcontractorDriver>) => Promise<void>;
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
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('Standard Fleet');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (driver) {
            setName(driver.name || '');
            setPhone(driver.phone || '');
            setEmail(driver.email || '');
            setLicenseNumber(driver.driver_license_number || '');
            setVehiclePlate(driver.vehicle_plate || '');
            setVehicleType(driver.vehicle_type || 'Standard Fleet');
            setStatus(driver.status || 'active');
            setNotes(driver.notes || '');
        } else {
            setName('');
            setPhone('');
            setEmail('');
            setLicenseNumber('');
            setVehiclePlate('');
            setVehicleType('Standard Fleet');
            setStatus('active');
            setNotes('');
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
        if (!phone.trim()) {
            setError('Driver phone number is required (used for driver app login & tracking).');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            await onSave(subcontractor.id, {
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim() || undefined,
                driver_license_number: licenseNumber.trim() || undefined,
                vehicle_plate: vehiclePlate.trim() ? vehiclePlate.trim().toUpperCase() : undefined,
                vehicle_type: vehicleType.trim() || undefined,
                status,
                notes: notes.trim() || undefined,
            });
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to save subcontractor driver.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-3 sm:pt-5 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div
                className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)] font-sans my-0"
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
                            Driver will be isolated to subcontractor jobs assigned by your dispatchers. They can log in to the Driver App via this phone number.
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
                            Phone Number (Driver App Login) <span className="text-rose-500">*</span>
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

                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Email (Optional)
                        </FormLabel>
                        <Input
                            icon={<Mail size={13} />}
                            type="email"
                            disabled={isSubmitting}
                            placeholder="driver@subcontractor.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-8.5 text-xs rounded-[4px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Assigned Truck Plate
                            </FormLabel>
                            <Input
                                icon={<Truck size={13} />}
                                type="text"
                                disabled={isSubmitting}
                                placeholder="241-D-1234"
                                value={vehiclePlate}
                                onChange={(e) => setVehiclePlate(e.target.value)}
                                className="h-8.5 text-xs rounded-[4px] uppercase"
                            />
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                License Number
                            </FormLabel>
                            <Input
                                icon={<FileText size={13} />}
                                type="text"
                                disabled={isSubmitting}
                                placeholder="DL-987654"
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="h-8.5 text-xs rounded-[4px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Vehicle Type
                            </FormLabel>
                            <Input
                                type="text"
                                disabled={isSubmitting}
                                placeholder="e.g. Curtainside 40ft"
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
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
        </div>
    );
};

export default SubcontractorDriverModal;

