import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Shield, Check, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { DriverProfile } from '../../types';

interface Props {
    isOpen: boolean;
    profile: DriverProfile;
    onClose: () => void;
    onSave: (updated: Partial<DriverProfile>) => Promise<void>;
}

export const AccountSettingsModal: React.FC<Props> = ({ isOpen, profile, onClose, onSave }) => {
    const [name, setName] = useState(profile.name);
    const [phone, setPhone] = useState(profile.phone);
    const [email, setEmail] = useState(profile.email);
    const [homeTerminal, setHomeTerminal] = useState(profile.homeTerminal || '');
    const [emergencyName, setEmergencyName] = useState(profile.emergencyContact?.name || '');
    const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact?.phone || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave({
                name,
                phone,
                email,
                homeTerminal,
                emergencyContact: {
                    name: emergencyName,
                    relationship: profile.emergencyContact?.relationship || 'Contact',
                    phone: emergencyPhone,
                },
            });
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#12161c] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                            <User size={18} />
                        </div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Account Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Home Terminal & Regional Hub</label>
                        <input
                            type="text"
                            value={homeTerminal}
                            onChange={(e) => setHomeTerminal(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                        />
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">Emergency Contact</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contact Name</label>
                                <input
                                    type="text"
                                    value={emergencyName}
                                    onChange={(e) => setEmergencyName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Contact Phone</label>
                                <input
                                    type="tel"
                                    value={emergencyPhone}
                                    onChange={(e) => setEmergencyPhone(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-xs"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            <span>Save Changes</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
