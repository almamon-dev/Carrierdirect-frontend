import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { DriverProfile } from '../../../types';
import { driverApi } from '../../../services/driverApi';
import { useToastStore } from '@/stores/useToastStore';
import { mapProfileToFormData, buildDriverProfilePayload } from './profileStateMappers';

export function useProfilePageState(
    profile: DriverProfile,
    updateProfile: (updates: Partial<DriverProfile>) => Promise<DriverProfile>,
    reloadProfile: () => Promise<void>
) {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [previewDoc, setPreviewDoc] = useState<{
        isOpen: boolean;
        title: string;
        url?: string;
        type?: string;
    }>({ isOpen: false, title: '' });

    const [formData, setFormData] = useState(() => mapProfileToFormData(profile));

    const resetFormFromProfile = () => {
        if (profile) setFormData(mapProfileToFormData(profile));
    };

    useEffect(() => {
        resetFormFromProfile();
    }, [profile]);

    const handleFieldChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCancelEdit = () => {
        resetFormFromProfile();
        setIsEditing(false);
    };

    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
            const fd = new FormData();
            fd.append('profile_picture', file);
            await driverApi.updatePersonalInfo(fd);
            await reloadProfile();
            useToastStore.getState().showToast('Driver profile photo updated successfully!', 'success');
        } catch (err) {
            console.error('Failed to update photo:', err);
            useToastStore.getState().showToast('Failed to update photo', 'error');
        } finally {
            setIsUploadingPhoto(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    const handleRemoveAvatar = async () => {
        setIsUploadingPhoto(true);
        try {
            const fd = new FormData();
            fd.append('remove_picture', '1');
            fd.append('profile_picture', 'remove');
            await driverApi.updatePersonalInfo(fd);
            await reloadProfile();
            useToastStore.getState().showToast('Profile photo removed.', 'success');
        } catch (err) {
            console.error('Failed to remove photo:', err);
            useToastStore.getState().showToast('Failed to remove photo', 'error');
        } finally {
            setIsUploadingPhoto(false);
            if (avatarInputRef.current) avatarInputRef.current.value = '';
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateProfile(buildDriverProfilePayload(profile, formData));
            useToastStore.getState().showToast('Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update driver profile', err);
            useToastStore.getState().showToast('Failed to save changes.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        avatarInputRef,
        isEditing,
        setIsEditing,
        isSaving,
        isUploadingPhoto,
        isSupportOpen,
        setIsSupportOpen,
        previewDoc,
        setPreviewDoc,
        formData,
        handleFieldChange,
        handleCancelEdit,
        handleAvatarUpload,
        handleRemoveAvatar,
        handleSave,
    };
}
