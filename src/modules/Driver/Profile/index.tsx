import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    User, 
    CreditCard, 
    FileText, 
    Truck, 
    ShieldCheck, 
    Building2, 
    MapPin, 
    Phone, 
    Lock, 
    Camera, 
    Eye, 
    Paperclip, 
    Save, 
    Loader2, 
    Check, 
    Box,
    Pencil,
    X,
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import DatePicker from '@/components/ui/date-picker';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useDriverProfile } from './hooks/useDriverProfile';
import { driverApi } from '../services/driverApi';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { DispatcherSupportModal } from './components/DispatcherSupportModal';
import { useToastStore } from '@/stores/useToastStore';

const DRIVER_SETTINGS_TABS = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'cdl', label: 'CDL License', icon: CreditCard },
    { id: 'medical', label: 'DOT Medical Card', icon: FileText },
    { id: 'vehicle', label: 'Assigned Vehicle', icon: Truck },
    { id: 'insurance', label: 'Fleet Insurance', icon: ShieldCheck },
];

const LICENSE_CLASS_OPTIONS = [
    { value: 'Class A', label: 'Class A - Heavy Tractor-Trailer combinations' },
    { value: 'Class B', label: 'Class B - Straight Truck & Heavy Single Vehicle' },
    { value: 'Class C', label: 'Class C - Hazardous / Commercial Transport' },
];

const EQUIPMENT_TYPE_OPTIONS = [
    { value: '53ft Dry Van', label: '53ft Dry Van Trailer' },
    { value: '53ft Reefer', label: '53ft Temperature Controlled Reefer' },
    { value: 'Flatbed', label: 'Standard Flatbed Trailer' },
    { value: 'Step Deck', label: 'Step Deck / Drop Deck' },
    { value: 'Power Only', label: 'Power Only (Tractor Unit Only)' },
    { value: 'Tanker', label: 'Liquid / Bulk Tanker' },
    { value: 'Box Truck', label: 'Commercial Box Truck (26ft)' },
    { value: 'Hotshot', label: 'Hotshot / Gooseneck' },
    { value: 'Conestoga', label: 'Conestoga Trailer' },
    { value: 'Car Hauler', label: 'Auto Carrier / Car Hauler' },
];

const formatDateForInput = (val?: string | null): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
    }
    return val;
};

// Clean Key : Value Row Component
const KeyValueRow = ({
    label,
    value,
    isMono = false,
    badge = null,
    colSpan = false,
}: {
    label: string;
    value?: string | React.ReactNode;
    isMono?: boolean;
    badge?: React.ReactNode;
    colSpan?: boolean;
}) => (
    <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[125px_12px_1fr] sm:grid-cols-[145px_14px_1fr] items-baseline py-1 text-xs`}>
        <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium truncate">{label}</span>
        <span className="text-[11.5px] text-slate-400 dark:text-slate-500 text-center font-medium">:</span>
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <span className={`text-[12px] font-semibold text-slate-800 dark:text-slate-200 ${isMono ? 'font-mono' : ''}`}>
                {value || <span className="text-slate-400 font-normal">—</span>}
            </span>
            {badge}
        </div>
    </div>
);

export default function DriverProfilePage() {
    const { profile, isLoading, updateProfile, toggleDuty, reloadProfile } = useDriverProfile();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTabParam = searchParams.get('tab');
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const isValidTab = DRIVER_SETTINGS_TABS.some(t => t.id === currentTabParam);
    const activeTab = isValidTab ? currentTabParam! : 'profile';

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId }, { replace: true });
        setIsEditing(false);
    };

    // 1 Edit mode state per active tab
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<{ isOpen: boolean; title: string; url?: string; type?: string }>({
        isOpen: false,
        title: '',
    });

    // Form data matching backend schema
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        homeTerminal: '',
        cdlNumber: '',
        stateOfIssue: '',
        licenseClass: 'Class A',
        issueDate: '',
        expirationDate: '',
        endorsements: '',
        nrcmeId: '',
        medicalExaminer: '',
        medicalExamDate: '',
        medicalExpiryDate: '',
        tractorModel: '',
        unitNumber: '',
        licensePlate: '',
        vin: '',
        trailerNumber: '',
        equipmentType: '53ft Dry Van',
        insuranceProvider: '',
        insurancePolicyNumber: '',
        insuranceExpiryDate: '',
    });

    const resetFormFromProfile = () => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                title: profile.title || 'Commercial Heavy Vehicle Driver',
                phone: profile.phone || '',
                email: profile.email || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                zipCode: profile.zipCode || '',
                homeTerminal: profile.homeTerminal || '',
                cdlNumber: profile.cdlDetails?.cdlNumber || profile.driverLicense || '',
                stateOfIssue: profile.cdlDetails?.stateOfIssue || '',
                licenseClass: profile.cdlDetails?.licenseClass || 'Class A',
                issueDate: formatDateForInput(profile.cdlDetails?.issueDate),
                expirationDate: formatDateForInput(profile.cdlDetails?.expirationDate),
                endorsements: profile.cdlDetails?.endorsements || '',
                nrcmeId: profile.dotMedical?.nrcmeRegistryId || '',
                medicalExaminer: profile.dotMedical?.medicalExaminer || '',
                medicalExamDate: formatDateForInput(profile.dotMedical?.examDate),
                medicalExpiryDate: formatDateForInput(profile.dotMedical?.expiryDate),
                tractorModel: profile.fleetEquipment?.tractorModel || profile.vehicleAssigned?.model || '',
                unitNumber: profile.fleetEquipment?.unitNumber || '',
                licensePlate: profile.fleetEquipment?.licensePlate || profile.vehicleAssigned?.plate || '',
                vin: profile.fleetEquipment?.vin || '',
                trailerNumber: profile.fleetEquipment?.trailerNumber || '',
                equipmentType: profile.fleetEquipment?.equipmentType || profile.vehicleAssigned?.type || '53ft Dry Van',
                insuranceProvider: profile.fleetEquipment?.insuranceProvider || '',
                insurancePolicyNumber: profile.fleetEquipment?.insurancePolicyNumber || '',
                insuranceExpiryDate: formatDateForInput(profile.fleetEquipment?.insuranceExpiryDate),
            });
        }
    };

    useEffect(() => {
        resetFormFromProfile();
    }, [profile]);

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCancelEdit = () => {
        resetFormFromProfile();
        setIsEditing(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            useToastStore.getState().showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            useToastStore.getState().showToast('Profile photo must be less than 5MB', 'error');
            return;
        }

        setIsUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append('profile_picture', file);
            await driverApi.updatePersonalInfo(formData);
            await reloadProfile();
            useToastStore.getState().showToast('Driver profile photo updated successfully!', 'success');
        } catch (err) {
            console.error('Failed to update photo:', err);
            useToastStore.getState().showToast('Failed to update photo', 'error');
        } finally {
            setIsUploadingPhoto(false);
            if (avatarInputRef.current) {
                avatarInputRef.current.value = '';
            }
        }
    };

    const handleRemoveAvatar = async () => {
        setIsUploadingPhoto(true);
        try {
            const formData = new FormData();
            formData.append('remove_picture', '1');
            formData.append('profile_picture', 'remove');
            await driverApi.updatePersonalInfo(formData);
            await reloadProfile();
            useToastStore.getState().showToast('Profile photo removed.', 'success');
        } catch (err) {
            console.error('Failed to remove photo:', err);
            useToastStore.getState().showToast('Failed to remove photo', 'error');
        } finally {
            setIsUploadingPhoto(false);
            if (avatarInputRef.current) {
                avatarInputRef.current.value = '';
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile({
                name: formData.name,
                title: formData.title,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                homeTerminal: formData.homeTerminal,
                cdlDetails: {
                    ...profile.cdlDetails,
                    cdlNumber: formData.cdlNumber,
                    stateOfIssue: formData.stateOfIssue,
                    licenseClass: formData.licenseClass,
                    issueDate: formData.issueDate,
                    expirationDate: formData.expirationDate,
                    endorsements: formData.endorsements,
                    cdlFrontUrl: profile.cdlDetails?.cdlFrontUrl || '',
                    cdlBackUrl: profile.cdlDetails?.cdlBackUrl || '',
                    verification: profile.cdlDetails?.verification || 'Verified',
                },
                dotMedical: {
                    ...profile.dotMedical,
                    nrcmeRegistryId: formData.nrcmeId,
                    medicalExaminer: formData.medicalExaminer,
                    examDate: formData.medicalExamDate,
                    expiryDate: formData.medicalExpiryDate,
                    certificateStatus: profile.dotMedical?.certificateStatus || 'Active',
                    certificateUrl: profile.dotMedical?.certificateUrl || '',
                    mcsaForm: profile.dotMedical?.mcsaForm || 'MCSA-5876',
                    mcsaFormUrl: profile.dotMedical?.mcsaFormUrl || '',
                },
                fleetEquipment: {
                    ...profile.fleetEquipment,
                    tractorModel: formData.tractorModel,
                    unitNumber: formData.unitNumber,
                    licensePlate: formData.licensePlate,
                    vin: formData.vin,
                    trailerNumber: formData.trailerNumber,
                    equipmentType: formData.equipmentType,
                    insuranceProvider: formData.insuranceProvider,
                    insurancePolicyNumber: formData.insurancePolicyNumber,
                    insuranceExpiryDate: formData.insuranceExpiryDate,
                },
                vehicleAssigned: {
                    ...profile.vehicleAssigned,
                    model: formData.tractorModel,
                    plate: formData.licensePlate,
                    type: formData.equipmentType,
                },
            });

            useToastStore.getState().showToast('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update driver profile', err);
            useToastStore.getState().showToast('Failed to save changes.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-3 sm:p-4 md:p-5 w-full space-y-2.5 font-sans antialiased min-h-screen">
                <div className="space-y-2 animate-pulse">
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-[4px]" />
                    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-[4px]" />
                </div>
            </div>
        );
    }

    const cdl = profile.cdlDetails;
    const medical = profile.dotMedical;
    const carrier = profile.employerCarrier;
    const equipment = profile.fleetEquipment;
    const isVerified = Boolean(profile.isVerified || cdl?.verification === 'Verified' || cdl?.verification === 'FMCSA Verified');

    return (
        <div className="p-3 sm:p-4 md:p-5 w-full space-y-2.5 font-sans antialiased min-h-screen pb-12">
            
            {/* ══════════════════════════════════════════════════════════════════
                1. COMPACT HEADER
               ══════════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Driver Profile & Settings
                    </h1>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                        Manage your driver credentials, commercial licenses, vehicle assignment, and carrier compliance.
                    </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSupportOpen(true)}
                        className="h-7 text-xs px-2.5 rounded-[4px] border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5"
                    >
                        <Phone size={12} className="text-[#FF4A1F]" />
                        <span>Dispatch Support</span>
                    </Button>

                    <Button
                        type="button"
                        onClick={() => {
                            if (isEditing) {
                                handleCancelEdit();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                        className={`h-7 text-xs px-3 font-bold shadow-2xs cursor-pointer rounded-[4px] flex items-center gap-1.5 transition-all ${
                            isEditing 
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200' 
                                : 'bg-[#FF4A1F] hover:bg-[#E03E15] text-white'
                        }`}
                    >
                        {isEditing ? <X size={12} /> : <Pencil size={12} />}
                        <span>{isEditing ? 'Cancel Edit' : 'Edit Details'}</span>
                    </Button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                2. COMPACT VERIFICATION STATUS BANNER
               ══════════════════════════════════════════════════════════════════ */}
            <div className="p-2 sm:p-2.5 bg-white dark:bg-[#181a20] rounded-[4px] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 flex-wrap">
                    <ShieldCheck className={`w-4 h-4 ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`} />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Driver Verification:</span>
                    {isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-[3px]">
                            <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> Verified Active (CDL-A)
                        </span>
                    ) : (
                        <span className="inline-flex items-center text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded-[3px]">
                            Pending Compliance Review
                        </span>
                    )}
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                    <span className="text-[11.5px] text-slate-600 dark:text-slate-400 font-medium">
                        {carrier?.company_name || carrier?.companyName || 'Supplier Fleet HQ'} (USDOT {carrier?.dot_number || '3920194'})
                    </span>
                </div>

                {/* Duty Switcher */}
                <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 text-[10.5px] font-semibold shrink-0">
                    <button
                        type="button"
                        onClick={() => toggleDuty('online')}
                        className={`px-2 py-0.5 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 ${
                            profile.dutyStatus === 'online'
                                ? 'bg-white dark:bg-[#1e2329] text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Online</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleDuty('break')}
                        className={`px-2 py-0.5 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 ${
                            profile.dutyStatus === 'break'
                                ? 'bg-white dark:bg-[#1e2329] text-amber-600 dark:text-amber-400 font-bold shadow-2xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Break</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleDuty('offline')}
                        className={`px-2 py-0.5 rounded-[2px] transition-all cursor-pointer flex items-center gap-1 ${
                            profile.dutyStatus === 'offline'
                                ? 'bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 font-bold shadow-2xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>Offline</span>
                    </button>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                3. FLUSH UNDERLINE NAVIGATION TABS
               ══════════════════════════════════════════════════════════════════ */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-0.5 overflow-x-auto overflow-y-hidden hide-scrollbar no-scrollbar w-full">
                {DRIVER_SETTINGS_TABS.map((tab, idx) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer -mb-px ${
                                idx === 0 ? 'pl-0.5 pr-3' : 'px-3'
                            } ${
                                isActive
                                    ? 'border-[#FF4A1F] text-[#FF4A1F]'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                        >
                            <Icon size={13} className={isActive ? 'text-[#FF4A1F]' : 'text-slate-400 dark:text-slate-500'} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                4. BODY CONTENT (KEY : VALUE VIEW MODE & INLINE EDIT MODE)
               ══════════════════════════════════════════════════════════════════ */}
            <div className="pt-0.5 w-full">
                
                {/* ─── TAB 1: PERSONAL PROFILE (Key : Value View Mode) ─── */}
                {activeTab === 'profile' && (
                    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
                        <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                                <User className="w-3.5 h-3.5 text-[#FF4A1F]" />
                                Driver Identity & Contact Information
                            </CardTitle>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <Pencil size={11} />
                                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                            </button>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-3.5 space-y-3.5">
                            {/* Photo Row */}
                            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                                <div className="relative group shrink-0">
                                    <div 
                                        onClick={() => !isUploadingPhoto && avatarInputRef.current?.click()}
                                        className="w-12 h-12 rounded-[4px] bg-slate-50 dark:bg-[#12161c] border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#FF4A1F] cursor-pointer hover:bg-orange-50/20"
                                        title="Click to select or change photo"
                                    >
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt="Driver Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400 dark:text-slate-500 group-hover:text-[#FF4A1F]">
                                                <User className="w-5 h-5" />
                                                <span className="text-[8px] font-semibold mt-0.5">Upload</span>
                                            </div>
                                        )}
                                        {isUploadingPhoto && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <input 
                                        ref={avatarInputRef}
                                        type="file" 
                                        accept="image/png,image/jpeg,image/jpg,image/webp" 
                                        onChange={handleAvatarUpload} 
                                        className="hidden" 
                                        title="Upload driver photo"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Driver Profile Photo</label>
                                        <button 
                                            type="button"
                                            onClick={() => avatarInputRef.current?.click()}
                                            disabled={isUploadingPhoto}
                                            className="text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <Camera size={11} />
                                            <span>{profile.avatar ? 'Change Photo' : 'Upload Photo'}</span>
                                        </button>
                                        {profile.avatar && (
                                            <button 
                                                type="button"
                                                onClick={handleRemoveAvatar}
                                                disabled={isUploadingPhoto}
                                                className="text-[10.5px] font-medium text-slate-400 hover:text-red-500 hover:underline cursor-pointer ml-1 disabled:opacity-50"
                                            >
                                                <span>Remove</span>
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        PNG, JPG, or WEBP under 5MB. Visible on dispatch manifests, trip tracking, and digital BOLs.
                                    </p>
                                </div>
                            </div>

                            {/* View Mode (Key : Value) vs Edit Mode */}
                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-3">
                                    {/* Personal Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <Input
                                            label="Legal Full Name *"
                                            value={formData.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            placeholder="e.g. Conor Gallagher"
                                            required
                                        />

                                        <div className="relative">
                                            <Input
                                                label="Primary Account Email *"
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                placeholder="driver@fleet.com"
                                            />
                                            <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-[34px]" />
                                        </div>

                                        <Input
                                            label="Direct Mobile Phone *"
                                            value={formData.phone}
                                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                                            placeholder="+353 87 123 4567"
                                            required
                                        />

                                        <Input
                                            label="Commercial Designation / Role"
                                            value={formData.title}
                                            onChange={(e) => handleFieldChange('title', e.target.value)}
                                            placeholder="Heavy Commercial Vehicle Driver"
                                        />
                                    </div>

                                    {/* Address Fields */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 text-[#FF4A1F]" />
                                            <span>Domicile Address & Terminal</span>
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                            <Input
                                                label="State / Region"
                                                value={formData.state}
                                                onChange={(e) => handleFieldChange('state', e.target.value)}
                                                placeholder="e.g. Dublin Division"
                                            />

                                            <Input
                                                label="City *"
                                                value={formData.city}
                                                onChange={(e) => handleFieldChange('city', e.target.value)}
                                                placeholder="e.g. Dublin"
                                                required
                                            />

                                            <Input
                                                label="Zip / Postal Code *"
                                                value={formData.zipCode}
                                                onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                                                placeholder="e.g. 1212"
                                                required
                                            />

                                            <div className="sm:col-span-2">
                                                <Input
                                                    label="Street Address *"
                                                    value={formData.address}
                                                    onChange={(e) => handleFieldChange('address', e.target.value)}
                                                    placeholder="Street address, building, apartment/suite"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <Input
                                                    label="Home Terminal Hub"
                                                    value={formData.homeTerminal}
                                                    onChange={(e) => handleFieldChange('homeTerminal', e.target.value)}
                                                    placeholder="Dublin Port Logistics Center"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            className="h-7 text-xs px-2.5 rounded-[3px]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="h-7 text-xs px-3 bg-[#FF4A1F] hover:bg-[#E03E15] font-bold text-white shadow-2xs cursor-pointer rounded-[3px] flex items-center gap-1.5"
                                        >
                                            {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                            <span>Save Profile</span>
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3">
                                    {/* 1. Identity Key : Value Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                        <KeyValueRow label="Legal Full Name" value={formData.name || profile.name} />
                                        <KeyValueRow label="Account Email" value={formData.email || profile.email} />
                                        <KeyValueRow label="Direct Mobile Phone" value={formData.phone || profile.phone} />
                                        <KeyValueRow label="Designation / Role" value={formData.title || profile.title} />
                                    </div>

                                    {/* 2. Domicile Address Key : Value Grid */}
                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                            <KeyValueRow label="Street Address" value={formData.address || profile.address} />
                                            <KeyValueRow label="City / Municipality" value={formData.city || profile.city} />
                                            <KeyValueRow label="State / Region" value={formData.state || profile.state} />
                                            <KeyValueRow label="Zip / Postal Code" value={formData.zipCode || profile.zipCode} />
                                            <KeyValueRow label="Home Terminal Hub" value={formData.homeTerminal || profile.homeTerminal} />
                                        </div>
                                    </div>

                                    {/* 3. Assigned Carrier Authority Key : Value Grid */}
                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                            <KeyValueRow label="Carrier Fleet Company" value={carrier?.company_name || carrier?.companyName || 'Supplier Co 1 Fleet HQ'} />
                                            <KeyValueRow label="USDOT Authority #" value={carrier?.dot_number || 'USDOT-3920194'} isMono />
                                            <KeyValueRow label="Central Dispatch Phone" value={carrier?.phone || '+353 87 123 4567'} />
                                            <KeyValueRow label="Dispatch Desk Email" value={carrier?.email || 'dispatch@supplierco1.ie'} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ─── TAB 2: CDL LICENSE (Key : Value View Mode) ─── */}
                {activeTab === 'cdl' && (
                    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
                        <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                                <CreditCard className="w-3.5 h-3.5 text-[#FF4A1F]" />
                                Commercial Driver's License (CDL)
                            </CardTitle>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <Pencil size={11} />
                                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                            </button>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-3.5 space-y-3.5">
                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-2.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <Input
                                            label="CDL License Number *"
                                            value={formData.cdlNumber}
                                            onChange={(e) => handleFieldChange('cdlNumber', e.target.value)}
                                            placeholder="e.g. DL-IE-98452107"
                                            required
                                        />

                                        <Input
                                            label="State / Jurisdiction of Issue *"
                                            value={formData.stateOfIssue}
                                            onChange={(e) => handleFieldChange('stateOfIssue', e.target.value)}
                                            placeholder="Dublin Port Region"
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                                CDL Classification *
                                            </label>
                                            <Select
                                                value={formData.licenseClass}
                                                onChange={(val) => handleFieldChange('licenseClass', val)}
                                                options={LICENSE_CLASS_OPTIONS}
                                                placeholder="Select CDL Classification"
                                            />
                                        </div>

                                        <DatePicker
                                            label="License Issue Date"
                                            value={formData.issueDate}
                                            onChange={(e) => handleFieldChange('issueDate', e.target.value)}
                                        />

                                        <DatePicker
                                            label="License Expiration Date *"
                                            value={formData.expirationDate}
                                            onChange={(e) => handleFieldChange('expirationDate', e.target.value)}
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <Input
                                                label="Endorsements & Special Ratings"
                                                value={formData.endorsements}
                                                onChange={(e) => handleFieldChange('endorsements', e.target.value)}
                                                placeholder="HazMat (ADR), Tanker (N), Double/Triple (T)"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            className="h-7 text-xs px-2.5 rounded-[3px]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="h-7 text-xs px-3 bg-[#FF4A1F] hover:bg-[#E03E15] font-bold text-white shadow-2xs cursor-pointer rounded-[3px] flex items-center gap-1.5"
                                        >
                                            {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                            <span>Save CDL</span>
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                        <KeyValueRow 
                                            label="CDL License Number" 
                                            value={formData.cdlNumber || cdl?.cdlNumber} 
                                            isMono 
                                            badge={
                                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1 py-0.2 rounded-[2px]">
                                                    Verified Active
                                                </span>
                                            }
                                        />
                                        <KeyValueRow label="State / Jurisdiction" value={formData.stateOfIssue || cdl?.stateOfIssue} />
                                        <KeyValueRow label="CDL Classification" value={formData.licenseClass || cdl?.licenseClass} />
                                        <KeyValueRow label="Original Issue Date" value={formData.issueDate || (cdl?.issueDate ? String(cdl.issueDate).split('T')[0] : '—')} />
                                        <KeyValueRow label="License Expiry Date" value={formData.expirationDate || (cdl?.expirationDate ? String(cdl.expirationDate).split('T')[0] : '—')} />
                                        <KeyValueRow label="Endorsements & Ratings" value={formData.endorsements || cdl?.endorsements} />
                                    </div>

                                    {/* Documents Subsection */}
                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="p-2 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">CDL Front License</h4>
                                                        <p className="text-[10px] text-slate-400 capitalize">Status: Verified on file</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDoc({ isOpen: true, title: 'Commercial Driver License (Front)', url: cdl?.cdlFrontUrl, type: 'CDL Front Document' })}
                                                    className="h-6 px-2 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs cursor-pointer"
                                                >
                                                    <Eye className="w-3 h-3" /> View
                                                </button>
                                            </div>

                                            <div className="p-2 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                    <div className="min-w-0">
                                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">CDL Back Endorsements</h4>
                                                        <p className="text-[10px] text-slate-400 capitalize">Status: Verified on file</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDoc({ isOpen: true, title: 'Commercial Driver License (Back)', url: cdl?.cdlBackUrl, type: 'CDL Back Document' })}
                                                    className="h-6 px-2 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs cursor-pointer"
                                                >
                                                    <Eye className="w-3 h-3" /> View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ─── TAB 3: DOT MEDICAL CARD (Key : Value View Mode) ─── */}
                {activeTab === 'medical' && (
                    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
                        <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                                <FileText className="w-3.5 h-3.5 text-[#FF4A1F]" />
                                DOT Medical Certificate (MCSA-5876) Physical Qualification
                            </CardTitle>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <Pencil size={11} />
                                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                            </button>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-3.5 space-y-3.5">
                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-2.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <Input
                                            label="NRCME National Registry ID *"
                                            value={formData.nrcmeId}
                                            onChange={(e) => handleFieldChange('nrcmeId', e.target.value)}
                                            placeholder="e.g. MC-IE-552091"
                                            required
                                        />

                                        <Input
                                            label="Certified Medical Examiner Name *"
                                            value={formData.medicalExaminer}
                                            onChange={(e) => handleFieldChange('medicalExaminer', e.target.value)}
                                            placeholder="Dr. Conor O'Brien, MD"
                                            required
                                        />

                                        <DatePicker
                                            label="Physical Examination Date"
                                            value={formData.medicalExamDate}
                                            onChange={(e) => handleFieldChange('medicalExamDate', e.target.value)}
                                        />

                                        <DatePicker
                                            label="Medical Certificate Expiration Date *"
                                            value={formData.medicalExpiryDate}
                                            onChange={(e) => handleFieldChange('medicalExpiryDate', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            className="h-7 text-xs px-2.5 rounded-[3px]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="h-7 text-xs px-3 bg-[#FF4A1F] hover:bg-[#E03E15] font-bold text-white shadow-2xs cursor-pointer rounded-[3px] flex items-center gap-1.5"
                                        >
                                            {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                            <span>Save Medical</span>
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                        <KeyValueRow 
                                            label="NRCME Registry ID" 
                                            value={formData.nrcmeId || medical?.nrcmeRegistryId} 
                                            isMono 
                                            badge={
                                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1 py-0.2 rounded-[2px]">
                                                    Active
                                                </span>
                                            }
                                        />
                                        <KeyValueRow label="Medical Examiner Name" value={formData.medicalExaminer || medical?.medicalExaminer} />
                                        <KeyValueRow label="Physical Exam Date" value={formData.medicalExamDate || (medical?.examDate ? String(medical.examDate).split('T')[0] : '—')} />
                                        <KeyValueRow label="Medical Certificate Expiry" value={formData.medicalExpiryDate || (medical?.expiryDate ? String(medical.expiryDate).split('T')[0] : '—')} />
                                    </div>

                                    {/* Documents Subsection */}
                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="p-2 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 max-w-md">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">MCSA-5876 Medical Card</h4>
                                                    <p className="text-[10px] text-slate-400 capitalize">Status: Active & valid</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPreviewDoc({ isOpen: true, title: 'DOT Medical Certificate (MCSA-5876)', url: medical?.certificateUrl, type: 'Medical Certificate' })}
                                                className="h-6 px-2 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs cursor-pointer"
                                            >
                                                <Eye className="w-3 h-3" /> View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ─── TAB 4: ASSIGNED VEHICLE (Key : Value View Mode) ─── */}
                {activeTab === 'vehicle' && (
                    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
                        <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                                <Truck className="w-3.5 h-3.5 text-[#FF4A1F]" />
                                Assigned Vehicle & Equipment Specifications
                            </CardTitle>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <Pencil size={11} />
                                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                            </button>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-3.5 space-y-3.5">
                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <Input
                                            label="Tractor Make & Model *"
                                            value={formData.tractorModel}
                                            onChange={(e) => handleFieldChange('tractorModel', e.target.value)}
                                            placeholder="Volvo FH16 750 Globetrotter"
                                            required
                                        />

                                        <Input
                                            label="Power Unit Fleet # *"
                                            value={formData.unitNumber}
                                            onChange={(e) => handleFieldChange('unitNumber', e.target.value)}
                                            placeholder="TRK-7701"
                                            required
                                        />

                                        <Input
                                            label="Commercial License Plate *"
                                            value={formData.licensePlate}
                                            onChange={(e) => handleFieldChange('licensePlate', e.target.value)}
                                            placeholder="231-D-45892"
                                            required
                                        />

                                        <Input
                                            label="Chassis 17-digit VIN *"
                                            value={formData.vin}
                                            onChange={(e) => handleFieldChange('vin', e.target.value)}
                                            placeholder="1M8GDM9A2IE291038"
                                            required
                                        />
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                                            <Box className="w-3 h-3 text-[#FF4A1F]" />
                                            <span>Assigned Trailer Specifications</span>
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <Input
                                                label="Trailer Unit Number *"
                                                value={formData.trailerNumber}
                                                onChange={(e) => handleFieldChange('trailerNumber', e.target.value)}
                                                placeholder="TRL-9942"
                                                required
                                            />

                                            <div>
                                                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                                    Equipment / Trailer Type *
                                                </label>
                                                <Select
                                                    value={formData.equipmentType}
                                                    onChange={(val) => handleFieldChange('equipmentType', val)}
                                                    options={EQUIPMENT_TYPE_OPTIONS}
                                                    placeholder="Select Equipment Type"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            className="h-7 text-xs px-2.5 rounded-[3px]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="h-7 text-xs px-3 bg-[#FF4A1F] hover:bg-[#E03E15] font-bold text-white shadow-2xs cursor-pointer rounded-[3px] flex items-center gap-1.5"
                                        >
                                            {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                            <span>Save Vehicle</span>
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                        <KeyValueRow label="Tractor Make & Model" value={formData.tractorModel || equipment?.tractorModel} />
                                        <KeyValueRow label="Power Unit Fleet #" value={formData.unitNumber || equipment?.unitNumber} isMono />
                                        <KeyValueRow label="Vehicle License Plate" value={formData.licensePlate || equipment?.licensePlate} isMono />
                                        <KeyValueRow label="Chassis 17-digit VIN" value={formData.vin || equipment?.vin} isMono />
                                    </div>

                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                            <KeyValueRow label="Assigned Trailer Number" value={formData.trailerNumber || equipment?.trailerNumber} isMono />
                                            <KeyValueRow label="Equipment / Trailer Type" value={formData.equipmentType || equipment?.equipmentType} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ─── TAB 5: FLEET INSURANCE (Key : Value View Mode) ─── */}
                {activeTab === 'insurance' && (
                    <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
                        <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#FF4A1F]" />
                                Commercial Fleet Liability & Cargo Insurance
                            </CardTitle>
                            <button
                                type="button"
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-[11px] font-bold text-[#FF4A1F] hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <Pencil size={11} />
                                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                            </button>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-3.5 space-y-3.5">
                            {isEditing ? (
                                <form onSubmit={handleSave} className="space-y-2.5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <Input
                                            label="Insurance Provider / Underwriter *"
                                            value={formData.insuranceProvider}
                                            onChange={(e) => handleFieldChange('insuranceProvider', e.target.value)}
                                            placeholder="Allianz Commercial Fleet Insurance"
                                            required
                                        />

                                        <Input
                                            label="Master Policy Number *"
                                            value={formData.insurancePolicyNumber}
                                            onChange={(e) => handleFieldChange('insurancePolicyNumber', e.target.value)}
                                            placeholder="ALZ-COMM-883920"
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <DatePicker
                                                label="Policy Expiration / Renewal Date *"
                                                value={formData.insuranceExpiryDate}
                                                onChange={(e) => handleFieldChange('insuranceExpiryDate', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancelEdit}
                                            className="h-7 text-xs px-2.5 rounded-[3px]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            className="h-7 text-xs px-3 bg-[#FF4A1F] hover:bg-[#E03E15] font-bold text-white shadow-2xs cursor-pointer rounded-[3px] flex items-center gap-1.5"
                                        >
                                            {isSaving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                                            <span>Save Insurance</span>
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
                                        <KeyValueRow label="Insurance Provider" value={formData.insuranceProvider || equipment?.insuranceProvider} />
                                        <KeyValueRow 
                                            label="Master Policy Number" 
                                            value={formData.insurancePolicyNumber || equipment?.insurancePolicyNumber} 
                                            isMono 
                                            badge={
                                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-1 py-0.2 rounded-[2px]">
                                                    Active Policy
                                                </span>
                                            }
                                        />
                                        <KeyValueRow label="Policy Expiration / Renewal" value={formData.insuranceExpiryDate || (equipment?.insuranceExpiryDate ? String(equipment.insuranceExpiryDate).split('T')[0] : '—')} />
                                    </div>

                                    {/* Documents Subsection */}
                                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                                        <div className="p-2 bg-slate-50 dark:bg-[#14181f] rounded-[3px] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 max-w-md">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <div className="min-w-0">
                                                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Commercial Liability Certificate</h4>
                                                    <p className="text-[10px] text-slate-400 capitalize">Coverage: $1,000,000 active policy</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPreviewDoc({ isOpen: true, title: 'Fleet Insurance Policy Certificate', url: equipment?.insuranceCertificateUrl, type: 'Insurance Certificate' })}
                                                className="h-6 px-2 bg-white dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[10.5px] font-semibold rounded-[3px] flex items-center gap-1 hover:bg-slate-50 shrink-0 shadow-2xs cursor-pointer"
                                            >
                                                <Eye className="w-3 h-3" /> View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

            </div>

            {/* ── Modals ── */}
            <DocumentPreviewModal
                isOpen={previewDoc.isOpen}
                onClose={() => setPreviewDoc({ isOpen: false, title: '' })}
                title={previewDoc.title}
                fileUrl={previewDoc.url || ''}
                fileType={previewDoc.type || 'PDF Document'}
            />

            <DispatcherSupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />
        </div>
    );
}
