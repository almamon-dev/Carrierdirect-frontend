import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { TOKEN_CONFIG } from '@/config/auth';
import authService from '@/services/authService';
import { useToastStore } from '@/stores/useToastStore';
import { OptionItem, ProfileFormData } from '../types/completeProfile.types';
import { generateAutoAddress } from '../utils/completeProfileUtils';
import { useLocationOptions } from './useLocationOptions';
import { submitSupplierProfile } from '../services/completeProfileService';

export function useCompleteProfileState() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const userStr = localStorage.getItem(TOKEN_CONFIG.userKey) || localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : {};

    useEffect(() => {
        const isProfileIncomplete = !currentUser?.country || !currentUser?.city || !currentUser?.zip_code;
        if (!isProfileIncomplete || currentUser?.is_profile_completed) {
            navigate('/supplier/dashboard', { replace: true });
            return;
        }

        apiClient.get('/supplier/profile')
            .then(res => {
                const profileData = res.data?.data || res.data;
                if (profileData?.country && profileData?.city && profileData?.zip_code) {
                    const mergedUser = { ...currentUser, ...profileData, is_profile_completed: true };
                    localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(mergedUser));
                    navigate('/supplier/dashboard', { replace: true });
                }
            })
            .catch(() => {});
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
        } finally {
            navigate('/web/login', { replace: true });
        }
    };

    const [formData, setFormData] = useState<ProfileFormData>({
        companyName: '',
        phone: currentUser.phone_number || currentUser.phone || '',
        country: currentUser.country || '',
        state: currentUser.state || '',
        city: currentUser.city || '',
        zipCode: currentUser.zip_code || '',
        address: currentUser.business_address || currentUser.address || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const { countriesList, statesList, citiesList, zipCodesList } = useLocationOptions(formData.country, formData.state);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            if ((field === 'state' || field === 'zipCode') && !prev.address) {
                updated.address = generateAutoAddress(updated.city, updated.state, updated.country, updated.zipCode);
            }
            return updated;
        });
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleCountryChange = (val: string) => {
        setFormData(prev => {
            const isDiff = prev.country && val && prev.country.trim().toLowerCase() !== val.trim().toLowerCase();
            return {
                ...prev,
                country: val,
                state: isDiff ? '' : prev.state,
                city: isDiff ? '' : prev.city,
                zipCode: isDiff ? '' : prev.zipCode,
                address: isDiff ? '' : prev.address,
            };
        });
        if (errors.country) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.country;
                return newErrors;
            });
        }
    };

    const handleStateChange = (val: string) => {
        setFormData(prev => ({ ...prev, state: val, city: '', zipCode: '', address: '' }));
        if (errors.state) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.state;
                return newErrors;
            });
        }
    };

    const handleCityChange = (val: string, item?: OptionItem) => {
        setFormData(prev => {
            const newZip = (item && item.postal_code) ? item.postal_code : prev.zipCode;
            const autoAddr = generateAutoAddress(val, prev.state, prev.country, newZip);
            return { ...prev, city: val, zipCode: newZip, address: prev.address ? prev.address : autoAddr };
        });
        if (errors.city) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.city;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const autoAddr = generateAutoAddress(formData.city, formData.state, formData.country, formData.zipCode);
        const newErrors: Record<string, string> = {};

        if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip / Postal code is required';
        if (!autoAddr.trim()) newErrors.address = 'Full business address is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTimeout(() => setIsLoading(false), 700);
            return;
        }

        try {
            await submitSupplierProfile(formData, autoAddr, currentUser);
            setIsSuccessModalOpen(true);
        } catch (err: any) {
            const msg = err.data?.message || err.message || 'Failed to update profile. Please check your entries.';
            useToastStore.getState().showToast(msg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        isLoading,
        isSuccessModalOpen,
        setIsSuccessModalOpen,
        countriesList,
        statesList,
        citiesList,
        zipCodesList,
        currentUser,
        handleLogout,
        handleInputChange,
        handleCountryChange,
        handleStateChange,
        handleCityChange,
        handleSubmit,
    };
}
