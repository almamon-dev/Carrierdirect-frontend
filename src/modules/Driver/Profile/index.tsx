import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDriverProfile } from './hooks/useDriverProfile';
import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { DispatcherSupportModal } from './components/DispatcherSupportModal';
import { DRIVER_SETTINGS_TABS } from './components/tabs/profileConstants';
import { useProfilePageState } from './components/tabs/useProfilePageState';
import { ProfilePageHeader } from './components/tabs/ProfilePageHeader';
import { ProfileVerificationBanner } from './components/tabs/ProfileVerificationBanner';
import { ProfileNavigationTabs } from './components/tabs/ProfileNavigationTabs';
import { ProfileTabIdentity } from './components/tabs/ProfileTabIdentity';
import { ProfileTabDocuments } from './components/tabs/ProfileTabDocuments';

export default function DriverProfilePage() {
    const { profile, isLoading, updateProfile, toggleDuty, reloadProfile } = useDriverProfile();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTabParam = searchParams.get('tab');

    const isValidTab = DRIVER_SETTINGS_TABS.some((t) => t.id === currentTabParam);
    const activeTab = isValidTab ? currentTabParam! : 'profile';

    const state = useProfilePageState(profile, updateProfile, reloadProfile);

    const handleTabChange = (tabId: string) => {
        setSearchParams({ tab: tabId }, { replace: true });
        state.setIsEditing(false);
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
    const isVerified = Boolean(
        profile.isVerified || cdl?.verification === 'Verified' || cdl?.verification === 'FMCSA Verified'
    );

    return (
        <div className="p-3 sm:p-4 md:p-5 w-full space-y-2.5 font-sans antialiased min-h-screen pb-12">
            <ProfilePageHeader
                isEditing={state.isEditing}
                onToggleEdit={() => {
                    if (state.isEditing) state.handleCancelEdit();
                    else state.setIsEditing(true);
                }}
                onOpenSupport={() => state.setIsSupportOpen(true)}
            />

            <ProfileVerificationBanner
                profile={profile}
                isVerified={isVerified}
                toggleDuty={toggleDuty}
            />

            <ProfileNavigationTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="pt-0.5 w-full">
                {activeTab === 'profile' && (
                    <ProfileTabIdentity
                        profile={profile}
                        formData={state.formData}
                        isEditing={state.isEditing}
                        isSaving={state.isSaving}
                        isUploadingPhoto={state.isUploadingPhoto}
                        avatarInputRef={state.avatarInputRef}
                        onToggleEdit={() => state.setIsEditing(!state.isEditing)}
                        onFieldChange={state.handleFieldChange}
                        onCancelEdit={state.handleCancelEdit}
                        onSave={state.handleSave}
                        onAvatarUpload={state.handleAvatarUpload}
                        onRemoveAvatar={state.handleRemoveAvatar}
                    />
                )}

                {activeTab === 'documents' && (
                    <ProfileTabDocuments
                        profile={profile}
                        onPreviewDoc={state.setPreviewDoc}
                    />
                )}
            </div>

            <DocumentPreviewModal
                isOpen={state.previewDoc.isOpen}
                onClose={() => state.setPreviewDoc({ isOpen: false, title: '' })}
                title={state.previewDoc.title}
                fileUrl={state.previewDoc.url || ''}
                fileType={state.previewDoc.type || 'PDF Document'}
            />

            <DispatcherSupportModal
                isOpen={state.isSupportOpen}
                onClose={() => state.setIsSupportOpen(false)}
            />
        </div>
    );
}
