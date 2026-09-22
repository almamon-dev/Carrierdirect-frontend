import React, { useRef, useState, useEffect } from 'react';
import {
    User,
    CheckCircle2,
    Edit3,
    Camera,
    Building2,
    PhoneCall,
    Save,
    Truck,
    Clock,
} from 'lucide-react';
import { DriverProfile } from '../../../types';
import { driverApi } from '../../../services/driverApi';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

interface Props {
    profile: DriverProfile;
    onUpdateAvatar?: (avatarDataUrl: string) => Promise<any> | void;
    onUpdateProfile?: (updates: Partial<DriverProfile>) => Promise<any> | void;
    onToggleDuty?: (status: DriverProfile['dutyStatus']) => Promise<any> | void;
}

export const OverviewSection: React.FC<Props> = ({
    profile,
    onUpdateAvatar,
    onUpdateProfile,
    onToggleDuty,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile.avatar);
    const [imgError, setImgError] = useState(false);

    // Form inputs state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [homeTerminal, setHomeTerminal] = useState('');
    const [address, setAddress] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [emergencyPhone, setEmergencyPhone] = useState('');
    const [relationship, setRelationship] = useState('');
    const [slogan, setSlogan] = useState('');

    // Fleet state
    const [tractorModel, setTractorModel] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [trailerNumber, setTrailerNumber] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [vinNumber, setVinNumber] = useState('');

    // Sync with incoming profile
    const syncWithProfile = () => {
        setName(profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone || '');
        setHomeTerminal(profile.homeTerminal || '');
        setAddress(profile.address || '');
        setEmergencyContact(profile.emergencyContact?.name || '');
        setEmergencyPhone(profile.emergencyContact?.phone || '');
        setRelationship(profile.emergencyContact?.relationship || '');
        setSlogan(profile.slogan || '');
        setAvatarUrl(profile.avatar);

        const fleet = profile.fleetEquipment || ({} as any);
        setTractorModel(fleet.tractorModel || '');
        setUnitNumber(fleet.unitNumber || '');
        setTrailerNumber(fleet.trailerNumber || '');
        setLicensePlate(fleet.licensePlate || '');
        setVinNumber(fleet.vin || fleet.vinNumber || '');
    };

    useEffect(() => {
        syncWithProfile();
    }, [profile]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setAvatarUrl(reader.result);
                    setImgError(false);
                    if (onUpdateAvatar) {
                        onUpdateAvatar(reader.result);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await driverApi.updatePersonalInfo({
                name,
                phone,
                address,
                bio: slogan,
            });
            await driverApi.updateEmergency({
                emergency_contact_name: emergencyContact,
                emergency_contact_phone: emergencyPhone,
                emergency_contact_relation: relationship,
                terminal_location: homeTerminal,
            });
            await driverApi.updateEquipment({
                tractor_model: tractorModel,
                truck_number: unitNumber,
                trailer_number: trailerNumber,
                license_plate: licensePlate,
                vin_number: vinNumber,
            });

            if (onUpdateProfile) {
                await onUpdateProfile({
                    name,
                    phone,
                    homeTerminal,
                    address,
                    slogan,
                    emergencyContact: {
                        name: emergencyContact,
                        phone: emergencyPhone,
                        relationship,
                    },
                    fleetEquipment: {
                        ...profile.fleetEquipment,
                        tractorModel,
                        unitNumber,
                        trailerNumber,
                        licensePlate,
                        vin: vinNumber,
                    } as any,
                });
            }
            setIsEditMode(false);
        } catch (err) {
            console.error('Failed to save driver profile:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        syncWithProfile();
        setIsEditMode(false);
    };

    const isVerified = Boolean(profile.isVerified);
    const isUnderReview = profile.verificationStatus === 'under_review';
    const isOnline = profile.dutyStatus === 'online' || profile.dutyStatus === 'on_trip';
    const employer = profile.employerCarrier;
    const companyName = employer?.companyName || employer?.company_name;

    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs w-full">
            <form onSubmit={handleSaveProfile}>
                {/* SINGLE CARD UNIFIED 3-COLUMN LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/80">
                    
                    {/* SECTION 1: Driver Dossier & Status */}
                    <div className="flex flex-col justify-between space-y-3 pt-0 lg:pr-6">
                        <div>
                            {/* Section Header */}
                            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                                <div className="flex items-center gap-1.5">
                                    <User size={14} className="text-[#FF4A1F]" />
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                        Driver Dossier & Status
                                    </h3>
                                </div>
                                {isVerified ? (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/70 rounded-[3px] flex items-center gap-1">
                                        <CheckCircle2 size={10} />
                                        <span>Active Verified</span>
                                    </span>
                                ) : isUnderReview ? (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800/70 rounded-[3px] flex items-center gap-1">
                                        <Clock size={10} />
                                        <span>Under Review</span>
                                    </span>
                                ) : (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[3px]">
                                        Pending Setup
                                    </span>
                                )}
                            </div>

                            {/* Driver Header Profile Info */}
                            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                                        {avatarUrl && !imgError ? (
                                            <img
                                                src={avatarUrl}
                                                alt={name}
                                                onError={() => setImgError(true)}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#FF4A1F]/10 dark:bg-[#FF4A1F]/20 text-[#FF4A1F] flex items-center justify-center font-bold text-sm">
                                                {name ? name.charAt(0).toUpperCase() : 'D'}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Upload Driver Avatar"
                                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                    >
                                        <Camera size={13} />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                            {name || 'Driver'}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                        <span className="font-mono text-[#FF4A1F] font-bold">
                                            {`DRV-${profile.id || '0'}`}
                                        </span>
                                        {profile.licenseBadge && (
                                            <>
                                                <span>•</span>
                                                <span className="px-1 py-0.2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold rounded-[2px] text-[10px]">
                                                    {profile.licenseBadge}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dossier Key-Values */}
                            <div className="space-y-2 text-xs">
                                {/* Duty Status */}
                                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Duty Status</span>
                                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.2 rounded-[3px] ${
                                                isOnline
                                                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                    : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    isOnline
                                                        ? 'bg-emerald-500 animate-pulse'
                                                        : 'bg-slate-400'
                                                }`}
                                            />
                                            <span>
                                                {isOnline ? 'Online' : 'Offline'}
                                            </span>
                                        </span>
                                        {onToggleDuty && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onToggleDuty(
                                                        isOnline ? 'offline' : 'online'
                                                    )
                                                }
                                                className="text-[10px] text-[#FF4A1F] hover:underline font-bold cursor-pointer shrink-0"
                                            >
                                                {isOnline ? 'Go Offline' : 'Switch to Online'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Email Address</span>
                                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                    <span className="text-slate-800 dark:text-slate-200 truncate font-mono text-[11.5px]" title={email}>
                                        {email || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                </div>

                                {/* Phone Number */}
                                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Phone Number</span>
                                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                    {isEditMode ? (
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="e.g. +1 (555) 000-0000"
                                            className="h-7 text-xs"
                                        />
                                    ) : (
                                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                                            {phone || <span className="text-slate-400 italic font-normal">Not added</span>}
                                        </span>
                                    )}
                                </div>

                                {/* Carrier Fleet */}
                                <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Carrier Fleet</span>
                                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={companyName}>
                                        {companyName || <span className="text-slate-400 italic font-normal">Not assigned</span>}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                            {!isEditMode ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditMode(true)}
                                    className="h-7 px-2.5 text-xs font-bold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-[#FF4A1F]/30 rounded-[3px] inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                                >
                                    <Edit3 size={12} />
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <div className="flex items-center gap-1.5 w-full justify-end">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="h-7 px-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[3px] transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <Button
                                        type="submit"
                                        disabled={isSaving}
                                        className="h-7 px-3 text-xs font-bold bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                    >
                                        <Save size={12} />
                                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: Personal & Emergency Contact */}
                    <div className="flex flex-col space-y-3 pt-4 lg:pt-0 lg:px-6">
                        {/* Section Header */}
                        <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-1.5">
                                <PhoneCall size={14} className="text-[#FF4A1F]" />
                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Personal & Emergency Contact
                                </h3>
                            </div>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-[3px] flex items-center gap-1">
                                <Building2 size={10} />
                                <span>Contact Details</span>
                            </span>
                        </div>

                        {/* Contact Key-Values */}
                        <div className="space-y-2 text-xs">
                            {/* Home Address */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Home Address</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="e.g. 742 Evergreen Terr, Springfield"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="text-slate-800 dark:text-slate-200 truncate" title={address}>
                                        {address || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* Home Terminal */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Home Terminal</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={homeTerminal}
                                        onChange={(e) => setHomeTerminal(e.target.value)}
                                        placeholder="e.g. Chicago Logistics Hub #4"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="text-slate-800 dark:text-slate-200 truncate" title={homeTerminal}>
                                        {homeTerminal || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* Emergency Contact Name */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Emergency Name</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={emergencyContact}
                                        onChange={(e) => setEmergencyContact(e.target.value)}
                                        placeholder="e.g. Sarah Jenkins"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {emergencyContact || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* Emergency Contact Phone */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Emergency Phone</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={emergencyPhone}
                                        onChange={(e) => setEmergencyPhone(e.target.value)}
                                        placeholder="e.g. +1 (555) 999-1122"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-bold text-red-600 dark:text-red-400 truncate">
                                        {emergencyPhone || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* Emergency Relationship */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Relationship</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={relationship}
                                        onChange={(e) => setRelationship(e.target.value)}
                                        placeholder="e.g. Spouse / Sibling"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {relationship || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* Driver Bio / Notes */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Driver Bio</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={slogan}
                                        onChange={(e) => setSlogan(e.target.value)}
                                        placeholder="Short note or safety slogan"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="text-slate-800 dark:text-slate-200 truncate italic">
                                        {slogan || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Assigned Equipment & Fleet */}
                    <div className="flex flex-col space-y-3 pt-4 lg:pt-0 lg:pl-6">
                        {/* Section Header */}
                        <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                            <div className="flex items-center gap-1.5">
                                <Truck size={14} className="text-[#FF4A1F]" />
                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Assigned Equipment & Fleet
                                </h3>
                            </div>
                            {unitNumber ? (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/70 rounded-[3px] flex items-center gap-1">
                                    <CheckCircle2 size={10} />
                                    <span>Assigned</span>
                                </span>
                            ) : (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-[3px]">
                                    Unassigned
                                </span>
                            )}
                        </div>

                        {/* Equipment Key-Values */}
                        <div className="space-y-2 text-xs">
                            {/* Tractor Model */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Tractor Model</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={tractorModel}
                                        onChange={(e) => setTractorModel(e.target.value)}
                                        placeholder="e.g. Freightliner Cascadia"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {tractorModel || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* Power Unit Number */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Power Unit</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={unitNumber}
                                        onChange={(e) => setUnitNumber(e.target.value)}
                                        placeholder="e.g. TRK-101"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400 truncate">
                                        {unitNumber || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* Trailer Number */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Trailer Unit</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={trailerNumber}
                                        onChange={(e) => setTrailerNumber(e.target.value)}
                                        placeholder="e.g. TRL-559"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {trailerNumber || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* License Plate */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">License Plate</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={licensePlate}
                                        onChange={(e) => setLicensePlate(e.target.value)}
                                        placeholder="e.g. ABC-12345"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                        {licensePlate || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>

                            {/* VIN Number */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">VIN Number</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={vinNumber}
                                        onChange={(e) => setVinNumber(e.target.value)}
                                        placeholder="e.g. 1FT8W3BT9H..."
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {vinNumber || <span className="text-slate-400 italic font-normal">Not added</span>}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default OverviewSection;
