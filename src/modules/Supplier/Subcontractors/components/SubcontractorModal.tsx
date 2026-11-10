import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Building2, Phone, Mail, FileText, MapPin, Hash, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import { Subcontractor } from '../types';

interface SubcontractorModalProps {
    isOpen: boolean;
    onClose: () => void;
    subcontractor?: Subcontractor | null;
    onSave: (data: Partial<Subcontractor>) => Promise<void>;
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

        try {
            setIsSubmitting(true);
            setError(null);
            await onSave({
                name: name.trim(),
                contact_name: contactName.trim() || undefined,
                phone: phone.trim() || undefined,
                email: email.trim() || undefined,
                vat_number: vatNumber.trim() || undefined,
                company_registration: registration.trim() || undefined,
                address: address.trim() || undefined,
                status,
                notes: notes.trim() || undefined,
            });
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
                className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] font-sans my-auto"
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
