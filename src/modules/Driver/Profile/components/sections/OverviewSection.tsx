import React, { useRef, useState } from 'react';
import { 
    User, ShieldCheck, CheckCircle2, Edit3, 
    BadgeCheck, Camera
} from 'lucide-react';
import { DriverProfile } from '../../../types';
import Button from '@/components/ui/button';

interface Props {
    profile: DriverProfile;
    onUpdateAvatar?: (avatarUrl: string) => Promise<any> | void;
    onUpdateProfile?: (updates: Partial<DriverProfile>) => Promise<any> | void;
    onToggleDuty?: (status: DriverProfile['dutyStatus']) => Promise<any> | void;
}

const FormFieldRow = ({ label, required = false, children, isVerified = false, valueText, isEdit = false }: any) => (
    <div className={`flex ${isEdit ? 'items-start sm:items-center' : 'items-center'} gap-2`}>
        <div className={`w-[130px] sm:w-[140px] shrink-0 flex items-center justify-between text-[12.5px] ${isEdit ? 'font-bold text-slate-700 dark:text-slate-300 pt-1.5 sm:pt-0' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
            <span>{label} {required && isEdit && <span className="text-[#ff4a1f]">*</span>}</span>
            <span className="text-slate-300 dark:text-slate-600">:</span>
        </div>
        <div className="flex-1 relative min-w-0">
            {isEdit ? children : (
                <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 py-0.5 min-h-[26px] flex items-center break-words">
                    {valueText || '—'}
                </div>
            )}
            {isVerified && !isEdit && (
                <span className="inline-flex items-center text-emerald-500 ml-1.5" title="Verified">
                   <CheckCircle2 size={15} strokeWidth={2.5} />
                </span>
            )}
        </div>
    </div>
);

export const OverviewSection: React.FC<Props> = ({ 
    profile, 
    onUpdateAvatar, 
    onUpdateProfile, 
    onToggleDuty 
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Form state using driver profile data
    const [name, setName] = useState(profile.name || 'James Wilson');
    const [email, setEmail] = useState(profile.email || 'james.wilson@carrierdirect.com');
    const [phone, setPhone] = useState(profile.phone || '+1 (555) 123-4567');
    const [role, setRole] = useState(profile.employmentStatus || 'Company Driver');
    
    const [homeTerminal, setHomeTerminal] = useState(profile.homeTerminal || 'Newark Regional Freight Center, Hub #4');
    const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact?.name || 'Sarah Wilson');
    const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact?.phone || '+1 (555) 999-0000');
    const [address, setAddress] = useState(profile.address || '1244 Commerce Way, Suite 400, Newark, NJ 07102');

    const handleAvatarClick = () => {
        if (isEditMode) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpdateAvatar) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onUpdateAvatar(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onUpdateProfile) {
            setIsEditMode(false);
            return;
        }
        setIsSaving(true);
        try {
            await onUpdateProfile({
                name,
                email,
                phone,
                employmentStatus: role as any,
                homeTerminal: homeTerminal,
                address,
                emergencyContact: {
                    name: emergencyContact,
                    relationship: profile.emergencyContact?.relationship || 'Spouse',
                    phone: emergencyPhone
                }
            });
            setIsEditMode(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset state back to initial profile values
        setName(profile.name || 'James Wilson');
        setEmail(profile.email || 'james.wilson@carrierdirect.com');
        setPhone(profile.phone || '+1 (555) 123-4567');
        setRole(profile.employmentStatus || 'Company Driver');
        setHomeTerminal(profile.homeTerminal || 'Newark Regional Freight Center, Hub #4');
        setEmergencyContact(profile.emergencyContact?.name || 'Sarah Wilson');
        setEmergencyPhone(profile.emergencyContact?.phone || '+1 (555) 999-0000');
        setAddress(profile.address || '1244 Commerce Way, Suite 400, Newark, NJ 07102');
        setIsEditMode(false);
    };

    const inputClasses = "w-full h-8 px-2.5 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded text-[13px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-orange-300 dark:focus:border-orange-800 focus:ring-1 focus:ring-orange-300 dark:focus:ring-orange-800 transition-shadow";

    return (
        <div className="animate-in fade-in duration-200">
            {/* Hidden File Input for Avatar Photo Upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <form onSubmit={handleSaveProfile} className="flex flex-col">
                
                {/* 1. Header Area: Avatar & Badges */}
                <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div 
                            onClick={handleAvatarClick}
                            title="Click to upload or change profile photo"
                            className="relative w-11 h-11 shrink-0 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center border border-orange-200 dark:border-orange-900/40 text-orange-600 dark:text-orange-400 cursor-pointer group hover:ring-2 hover:ring-[#ff4a1f]/40 transition-all"
                        >
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt={name}
                                    className="w-11 h-11 rounded-full object-cover"
                                />
                            ) : (
                                <User size={19} />
                            )}
                            
                            {/* Duty Status dot (Top Right) */}
                            <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1e2329] ${profile.dutyStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} title={profile.dutyStatus === 'online' ? 'On Duty' : 'Off Duty'} />
                            
                            {/* Camera Upload Badge (Bottom Right) */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff4a1f] text-white flex items-center justify-center border-2 border-white dark:border-[#1e2329] shadow-2xs group-hover:scale-110 transition-transform">
                                <Camera size={9} strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h2 className="text-[14px] font-extrabold text-slate-900 dark:text-white">
                                    {name}
                                </h2>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded border border-blue-200/60 dark:border-blue-800/60 shrink-0 uppercase tracking-wider">
                                    <BadgeCheck size={10} className="fill-blue-500 text-white" />
                                    {role}
                                </span>
                            </div>
                            <div className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {email} • ID: <span className="font-bold text-slate-700 dark:text-slate-300">{profile.id || 'DRV-9872'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                        {!isEditMode ? (
                            <button
                                type="button"
                                onClick={() => setIsEditMode(true)}
                                className="h-8 px-3 text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <Edit3 size={13} className="text-[#ff4a1f]" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <span className="h-8 px-3 text-[11.5px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 rounded border border-orange-200/60 dark:border-orange-900/60 flex items-center">
                                Editing Mode
                            </span>
                        )}
                        <span className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                            <ShieldCheck size={14} className="text-[#ff4a1f]" />
                            <span>Authorized Driver</span>
                        </span>
                    </div>
                </div>

                {/* 2. Personal & Contact Info */}
                <div className="mb-4">
                    <h3 className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                        Personal & Contact Info
                    </h3>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 ${isEditMode ? 'gap-y-3' : 'gap-y-1.5'}`}>
                        <FormFieldRow label="Full Name" required valueText={name} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className={inputClasses} 
                                required
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Email Address" required isVerified valueText={email} isEdit={isEditMode}>
                            <input 
                                type="email" 
                                value={email} 
                                readOnly
                                className={`${inputClasses} pr-10 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-90`} 
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Phone Number" valueText={phone} isEdit={isEditMode}>
                            <input 
                                type="tel" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                className={inputClasses} 
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Designation / Role" valueText={role} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)} 
                                className={inputClasses} 
                            />
                        </FormFieldRow>
                    </div>
                </div>

                {/* 3. Driver Details & Emergency */}
                <div className="mb-3">
                    <h3 className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 border-b border-slate-100 dark:border-slate-800/80 pb-1">
                        Terminal & Emergency Info
                    </h3>
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 ${isEditMode ? 'gap-y-3' : 'gap-y-1.5'}`}>
                        <FormFieldRow label="Base Location" valueText={homeTerminal} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={homeTerminal} 
                                onChange={(e) => setHomeTerminal(e.target.value)} 
                                className={inputClasses} 
                            />
                        </FormFieldRow>
                        
                        <FormFieldRow label="Driver Address" valueText={address} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                className={inputClasses} 
                            />
                        </FormFieldRow>

                        <FormFieldRow label="Emergency Contact" valueText={emergencyContact} isEdit={isEditMode}>
                            <input 
                                type="text" 
                                value={emergencyContact} 
                                onChange={(e) => setEmergencyContact(e.target.value)} 
                                className={inputClasses} 
                                placeholder="Name of contact"
                            />
                        </FormFieldRow>

                        <FormFieldRow label="Emergency Phone" required valueText={emergencyPhone} isEdit={isEditMode}>
                            <input 
                                type="tel" 
                                value={emergencyPhone} 
                                onChange={(e) => setEmergencyPhone(e.target.value)} 
                                className={inputClasses} 
                                required
                            />
                        </FormFieldRow>
                    </div>
                </div>

                {/* 4. Actions (Only in Edit Mode) */}
                {isEditMode && (
                    <div className="flex justify-end pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 gap-2.5">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="h-8 px-4 text-[12.5px] font-bold bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="h-8 px-4 text-[12.5px] font-bold bg-[#1a9f53] hover:bg-[#168a47] text-white rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Profile Settings'}
                        </Button>
                    </div>
                )}
                
            </form>
        </div>
    );
};
