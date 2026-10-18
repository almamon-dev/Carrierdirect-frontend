import React, { useRef, useState } from 'react';
import { DriverProfile } from '../../../types';
import { OverviewDriverDossierColumn } from './OverviewDriverDossierColumn';
import { OverviewContactColumn } from './OverviewContactColumn';
import { OverviewEquipmentColumn } from './OverviewEquipmentColumn';
import { useOverviewProfileForm } from './useOverviewProfileForm';

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
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile.avatar);
    const [imgError, setImgError] = useState(false);

    const {
        isSaving,
        isEditMode,
        setIsEditMode,
        name,
        email,
        phone,
        setPhone,
        homeTerminal,
        setHomeTerminal,
        address,
        setAddress,
        emergencyContact,
        setEmergencyContact,
        emergencyPhone,
        setEmergencyPhone,
        relationship,
        setRelationship,
        slogan,
        setSlogan,
        tractorModel,
        setTractorModel,
        unitNumber,
        setUnitNumber,
        trailerNumber,
        setTrailerNumber,
        vinNumber,
        setVinNumber,
        handleSaveProfile,
        handleCancel,
    } = useOverviewProfileForm({ profile, onUpdateProfile });

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

    const isVerified = Boolean(profile.isVerified);
    const isUnderReview = profile.verificationStatus === 'under_review';
    const isOnline = profile.dutyStatus === 'online' || profile.dutyStatus === 'on_trip';
    const employer = profile.employerCarrier;
    const companyName = employer?.companyName || employer?.company_name;

    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-2xs w-full">
            <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/80">
                    <OverviewDriverDossierColumn
                        profile={profile}
                        isVerified={isVerified}
                        isUnderReview={isUnderReview}
                        isOnline={isOnline}
                        name={name}
                        avatarUrl={avatarUrl}
                        imgError={imgError}
                        setImgError={setImgError}
                        handleAvatarClick={handleAvatarClick}
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        onToggleDuty={onToggleDuty}
                        email={email}
                        phone={phone}
                        setPhone={setPhone}
                        companyName={companyName}
                        isEditMode={isEditMode}
                        setIsEditMode={setIsEditMode}
                        handleCancel={handleCancel}
                        isSaving={isSaving}
                    />

                    <OverviewContactColumn
                        isEditMode={isEditMode}
                        address={address}
                        setAddress={setAddress}
                        homeTerminal={homeTerminal}
                        setHomeTerminal={setHomeTerminal}
                        emergencyContact={emergencyContact}
                        setEmergencyContact={setEmergencyContact}
                        emergencyPhone={emergencyPhone}
                        setEmergencyPhone={setEmergencyPhone}
                        relationship={relationship}
                        setRelationship={setRelationship}
                        slogan={slogan}
                        setSlogan={setSlogan}
                    />

                    <OverviewEquipmentColumn
                        isEditMode={isEditMode}
                        tractorModel={tractorModel}
                        setTractorModel={setTractorModel}
                        unitNumber={unitNumber}
                        setUnitNumber={setUnitNumber}
                        trailerNumber={trailerNumber}
                        setTrailerNumber={setTrailerNumber}
                        vinNumber={vinNumber}
                        setVinNumber={setVinNumber}
                    />
                </div>
            </form>
        </div>
    );
};

export default OverviewSection;
