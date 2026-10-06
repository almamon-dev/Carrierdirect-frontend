import React, { useState } from 'react';
import { Phone, Mail, MapPin, User, Copy, Check, Save, FileText, Lock } from 'lucide-react';
import { DriverProfile } from '../../../types';
import Button from '@/components/ui/button';
import TabHeader from '@/components/ui/tab-header';

interface Props {
    profile: DriverProfile;
    onSave: (updates: Partial<DriverProfile>) => Promise<any>;
    onCancel?: () => void;
}

export const PersonalInfoSection: React.FC<Props> = ({ profile, onSave, onCancel }) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [name, setName] = useState(profile.name || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [email, setEmail] = useState(profile.email || '');
    const [homeTerminal, setHomeTerminal] = useState(profile.homeTerminal || '');
    const [emergencyName, setEmergencyName] = useState(profile.emergencyContact?.name || '');
    const [emergencyRelationship, setEmergencyRelationship] = useState(profile.emergencyContact?.relationship || '');
    const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact?.phone || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1800);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
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
                    relationship: emergencyRelationship,
                    phone: emergencyPhone,
                },
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-5 animate-in fade-in duration-200">
            <TabHeader title="Personal & Contact Information" icon={FileText} />

            {/* 1. Primary Contact Details */}
            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Primary Driver Contact
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Driver Full Name <span className="text-[#ff4a1f]">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                            placeholder="Full Name"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <span>Email Address</span>
                                <span className="text-[10px] text-slate-400 font-normal">(Account ID - Cannot be changed)</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCopy(email, 'email')}
                                className="text-[10.5px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                            >
                                {copiedField === 'email' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                <span>Copy</span>
                            </button>
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                disabled
                                readOnly
                                className="w-full h-9 px-3 text-xs bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-[3px] text-slate-500 dark:text-slate-400 cursor-not-allowed select-none pr-8"
                                placeholder="driver@example.com"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={12} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block flex items-center justify-between">
                            <span>Phone Number <span className="text-[#ff4a1f]">*</span></span>
                            <button
                                type="button"
                                onClick={() => handleCopy(phone, 'phone')}
                                className="text-[10.5px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                            >
                                {copiedField === 'phone' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                                <span>Copy</span>
                            </button>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                            placeholder="+1 (555) 000-0000"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Home Terminal / Depot Hub
                        </label>
                        <input
                            type="text"
                            value={homeTerminal}
                            onChange={(e) => setHomeTerminal(e.target.value)}
                            className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                            placeholder="Regional Terminal / City Hub"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Emergency Contact Details */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Emergency Contact Person
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            value={emergencyName}
                            onChange={(e) => setEmergencyName(e.target.value)}
                            className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                            placeholder="Contact Person"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Relationship
                        </label>
                        <input
                            type="text"
                            value={emergencyRelationship}
                            onChange={(e) => setEmergencyRelationship(e.target.value)}
                            className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                            placeholder="Spouse / Family"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                            Emergency Phone
                        </label>
                        <input
                            type="tel"
                            value={emergencyPhone}
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                </div>
            </div>

            {/* Save Button Row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {onCancel ? (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-8.5 px-3 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-[3px] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        Back to Overview
                    </button>
                ) : <span />}

                <div className="flex items-center gap-3 ml-auto">
                    {saveSuccess && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <Check size={14} />
                            <span>Profile updated successfully!</span>
                        </span>
                    )}

                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-8.5 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        <Save size={13} />
                        <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                    </Button>
                </div>
            </div>
        </form>
    );
};
