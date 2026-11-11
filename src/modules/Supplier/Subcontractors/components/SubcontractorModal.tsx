import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import { Building2, Check, FileText, Hash, Mail, MapPin, Phone, ShieldCheck, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Subcontractor } from '../types';

interface SubcontractorModalProps {
    isOpen: boolean;
    onClose: () => void;
    subcontractor?: Subcontractor | null;
    onSave: (data: any) => Promise<void>;
}

export const SubcontractorModal: React.FC<SubcontractorModalProps> = ({
    isOpen,
    onClose,
    subcontractor,
    onSave,
}) => {
    const isEdit = Boolean(subcontractor?.id);

    const [name, setName] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [vatNumber, setVatNumber] = useState('');
    const [registration, setRegistration] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [notes, setNotes] = useState('');

    // Compliance fields
    const [insuranceExpiry, setInsuranceExpiry] = useState('');
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [licenseFile, setLicenseFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (subcontractor) {
            setName(subcontractor.name || '');
            setContactName(subcontractor.contact_name || '');
            setPhone(subcontractor.phone || '');
            setEmail(subcontractor.email || '');
            setVatNumber(subcontractor.vat_number || '');
            setRegistration(subcontractor.company_registration || '');
            setAddress(subcontractor.address || '');
            setStatus(subcontractor.status || 'active');
            setNotes(subcontractor.notes || '');
            setInsuranceExpiry(subcontractor.insurance_expiry_date ? String(subcontractor.insurance_expiry_date).split('T')[0] : '');
            setLicenseExpiry(subcontractor.operating_license_expiry_date ? String(subcontractor.operating_license_expiry_date).split('T')[0] : '');
            setInsuranceFile(null);
            setLicenseFile(null);
        } else {
            setName('');
            setContactName('');
            setPhone('');
            setEmail('');
            setVatNumber('');
            setRegistration('');
            setAddress('');
            setStatus('active');
            setNotes('');
            setInsuranceExpiry('');
            setLicenseExpiry('');
            setInsuranceFile(null);
            setLicenseFile(null);
        }
        setError(null);
    }, [subcontractor, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Subcontractor company name is required');
            return;
        }

        // On creation, require Insurance & Operating License compliance documents
        if (!isEdit && !insuranceFile) {
            setError('Insurance Certificate file is required for new subcontractor registration.');
            return;
        }
        if (!isEdit && !insuranceExpiry) {
            setError('Insurance Certificate expiry date is required.');
            return;
        }
        if (!isEdit && !licenseFile) {
            setError('Operating Licence file is required for new subcontractor registration.');
            return;
        }
        if (!isEdit && !licenseExpiry) {
            setError('Operating Licence expiry date is required.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const formData = new FormData();
            formData.append('name', name.trim());
            if (contactName.trim()) formData.append('contact_name', contactName.trim());
            if (phone.trim()) formData.append('phone', phone.trim());
            if (email.trim()) formData.append('email', email.trim());
            if (vatNumber.trim()) formData.append('vat_number', vatNumber.trim());
            if (registration.trim()) formData.append('company_registration', registration.trim());
            if (address.trim()) formData.append('address', address.trim());
            formData.append('status', status);
            if (notes.trim()) formData.append('notes', notes.trim());

            if (insuranceExpiry) formData.append('insurance_expiry_date', insuranceExpiry);
            if (insuranceFile) formData.append('insurance_certificate_file', insuranceFile);

            if (licenseExpiry) formData.append('operating_license_expiry_date', licenseExpiry);
            if (licenseFile) formData.append('operating_license_file', licenseFile);

            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to save subcontractor.');
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
                className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] font-sans my-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[4px] bg-[#ff4a1f]/10 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <Building2 size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                                {isEdit ? 'Edit Subcontractor' : 'Add New Subcontractor'}
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Manage external partner carrier & logistics contractor
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

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Company Name <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Input
                                icon={<Building2 size={13} />}
                                type="text"
                                required
                                disabled={isSubmitting}
                                placeholder="e.g. Swift Logistics Europe Ltd."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-8.5 text-xs rounded-[4px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Contact Person
                                </FormLabel>
                                <Input
                                    type="text"
                                    disabled={isSubmitting}
                                    placeholder="e.g. John Doe"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    className="h-8.5 text-xs rounded-[4px]"
                                />
                            </div>

                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Phone Number
                                </FormLabel>
                                <Input
                                    icon={<Phone size={13} />}
                                    type="text"
                                    disabled={isSubmitting}
                                    placeholder="+353 1 234 5678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-8.5 text-xs rounded-[4px]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Email Address
                                </FormLabel>
                                <Input
                                    icon={<Mail size={13} />}
                                    type="email"
                                    disabled={isSubmitting}
                                    placeholder="dispatch@partner.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-8.5 text-xs rounded-[4px]"
                                />
                            </div>

                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    VAT / Tax Number
                                </FormLabel>
                                <Input
                                    icon={<Hash size={13} />}
                                    type="text"
                                    disabled={isSubmitting}
                                    placeholder="IE 1234567T"
                                    value={vatNumber}
                                    onChange={(e) => setVatNumber(e.target.value)}
                                    className="h-8.5 text-xs rounded-[4px]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Company Reg Number
                                </FormLabel>
                                <Input
                                    icon={<FileText size={13} />}
                                    type="text"
                                    disabled={isSubmitting}
                                    placeholder="CRO-654321"
                                    value={registration}
                                    onChange={(e) => setRegistration(e.target.value)}
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
                                Office / Depot Address
                            </FormLabel>
                            <Input
                                icon={<MapPin size={13} />}
                                type="text"
                                disabled={isSubmitting}
                                placeholder="Terminal 2, Dublin Port Hub, Dublin"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="h-8.5 text-xs rounded-[4px]"
                            />
                        </div>

                        {/* COMPLIANCE DOCUMENTS SECTION */}
                        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-[4px] space-y-3">
                            <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-300 font-bold text-xs">
                                <ShieldCheck size={14} className="text-[#ff4a1f]" />
                                <span>Required Compliance Documents</span>
                            </div>

                            {/* 1. Insurance Certificate */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Insurance Certificate {!isEdit && <span className="text-rose-500">*</span>}
                                    </FormLabel>
                                    {subcontractor?.insurance_status && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${subcontractor.insurance_status === 'verified'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : (subcontractor.insurance_status === 'expired' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')
                                            }`}>
                                            {subcontractor.insurance_status.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="relative">
                                        <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                                            Document {!isEdit && <span className="text-rose-500">*</span>}
                                        </label>
                                        <input
                                            type="file"
                                            id="insurance_file"
                                            disabled={isSubmitting}
                                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                                            onChange={(e) => setInsuranceFile(e.target.files?.[0] || null)}
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
                                            value={insuranceExpiry}
                                            onChange={(e) => setInsuranceExpiry(e.target.value)}
                                            className="h-8 text-xs rounded-[4px]"
                                            title="Insurance Expiry Date"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Operating Licence */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Operating Licence {!isEdit && <span className="text-rose-500">*</span>}
                                    </FormLabel>
                                    {subcontractor?.operating_license_status && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${subcontractor.operating_license_status === 'verified'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : (subcontractor.operating_license_status === 'expired' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700')
                                            }`}>
                                            {subcontractor.operating_license_status.toUpperCase()}
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
                                            id="license_file"
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
                                            title="Operating Licence Expiry Date"
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                                🔔 Automated reminders will be sent to the subcontractor <strong>7 days</strong> and <strong>3 days</strong> prior to document expiration.
                            </p>
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Internal Notes (Optional)
                            </FormLabel>
                            <textarea
                                rows={2}
                                disabled={isSubmitting}
                                placeholder="Special terms, contact hours, preferred corridors..."
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
                            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Subcontractor' : 'Create Subcontractor'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default SubcontractorModal;
