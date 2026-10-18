import React from 'react';
import { User, CheckCircle2, Clock, Edit3, Save } from 'lucide-react';
import { DriverProfile } from '../../../types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { DriverAvatarHeader } from './DriverAvatarHeader';

interface OverviewDriverDossierColumnProps {
    profile: DriverProfile;
    isVerified: boolean;
    isUnderReview: boolean;
    isOnline: boolean;
    name: string;
    avatarUrl?: string;
    imgError: boolean;
    setImgError: (val: boolean) => void;
    handleAvatarClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleDuty?: (status: DriverProfile['dutyStatus']) => Promise<any> | void;
    email: string;
    phone: string;
    setPhone: (val: string) => void;
    companyName?: string;
    isEditMode: boolean;
    setIsEditMode: (val: boolean) => void;
    handleCancel: () => void;
    isSaving: boolean;
}

export const OverviewDriverDossierColumn: React.FC<OverviewDriverDossierColumnProps> = ({
    profile,
    isVerified,
    isUnderReview,
    isOnline,
    name,
    avatarUrl,
    imgError,
    setImgError,
    handleAvatarClick,
    fileInputRef,
    handleFileChange,
    onToggleDuty,
    email,
    phone,
    setPhone,
    companyName,
    isEditMode,
    setIsEditMode,
    handleCancel,
    isSaving,
}) => {
    return (
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
                <DriverAvatarHeader
                    profile={profile}
                    name={name}
                    avatarUrl={avatarUrl}
                    imgError={imgError}
                    setImgError={setImgError}
                    handleAvatarClick={handleAvatarClick}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                />

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
                                        isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                                    }`}
                                />
                                <span>{isOnline ? 'Online' : 'Offline'}</span>
                            </span>
                            {onToggleDuty && (
                                <button
                                    type="button"
                                    onClick={() => onToggleDuty(isOnline ? 'offline' : 'online')}
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
    );
};
