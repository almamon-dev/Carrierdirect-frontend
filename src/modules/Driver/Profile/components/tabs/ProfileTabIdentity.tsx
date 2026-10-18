import React, { FormEvent, RefObject } from 'react';
import { User, Pencil, Camera, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DriverProfile } from '../../../types';
import { ProfileFormData } from './profileStateMappers';
import { IdentityEditForm } from './IdentityEditForm';
import { IdentityViewGrid } from './IdentityViewGrid';

interface Props {
    profile: DriverProfile;
    formData: ProfileFormData;
    isEditing: boolean;
    isSaving: boolean;
    isUploadingPhoto: boolean;
    avatarInputRef: RefObject<HTMLInputElement | null>;
    onToggleEdit: () => void;
    onFieldChange: (field: string, val: string) => void;
    onCancelEdit: () => void;
    onSave: (e: FormEvent) => void;
    onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAvatar: () => void;
}

export const ProfileTabIdentity: React.FC<Props> = ({
    profile,
    formData,
    isEditing,
    isSaving,
    isUploadingPhoto,
    avatarInputRef,
    onToggleEdit,
    onFieldChange,
    onCancelEdit,
    onSave,
    onAvatarUpload,
    onRemoveAvatar,
}) => {
    return (
        <Card className="shadow-2xs border-slate-200 dark:border-slate-800 rounded-[4px] bg-white dark:bg-[#181a20]">
            <CardHeader className="py-2 px-3 sm:px-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#151921] rounded-t-[4px] flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                    <User className="w-3.5 h-3.5 text-[#FF4A1F]" />
                    Driver Identity & Contact Information
                </CardTitle>
                <button
                    type="button"
                    onClick={onToggleEdit}
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
                            onChange={onAvatarUpload}
                            className="hidden"
                            title="Upload driver photo"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Driver Profile Photo
                            </label>
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
                                    onClick={onRemoveAvatar}
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

                {isEditing ? (
                    <IdentityEditForm
                        formData={formData}
                        isSaving={isSaving}
                        onFieldChange={onFieldChange}
                        onCancel={onCancelEdit}
                        onSave={onSave}
                    />
                ) : (
                    <IdentityViewGrid profile={profile} formData={formData} />
                )}
            </CardContent>
        </Card>
    );
};
