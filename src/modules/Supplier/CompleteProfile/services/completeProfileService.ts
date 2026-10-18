import apiClient from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import { ProfileFormData } from '../types/completeProfile.types';

export async function submitSupplierProfile(formData: ProfileFormData, autoAddr: string, currentUser: any) {
    const personalName = currentUser?.name || currentUser?.full_name || '';
    const res = await apiClient.post('/supplier/profile', {
        ...(personalName ? { name: personalName } : {}),
        company_name: formData.companyName,
        phone_number: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zip_code: formData.zipCode,
        business_address: autoAddr,
    });

    try {
        await apiClient.post('/notifications', {
            type: 'profile_completed',
            title: 'Supplier Profile Completed',
            message: 'Your supplier profile has been successfully completed and activated. You can now browse requests and submit quotes.',
            category: 'account',
        });
    } catch {}

    const apiUser = res.data?.data || {};
    const updatedUser = {
        ...currentUser,
        ...apiUser,
        name: personalName || apiUser.name || currentUser.name,
        company_name: formData.companyName,
        phone_number: formData.phone,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        zip_code: formData.zipCode,
        business_address: autoAddr,
        is_profile_completed: true,
    };

    localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('user-profile-updated'));
    return updatedUser;
}
