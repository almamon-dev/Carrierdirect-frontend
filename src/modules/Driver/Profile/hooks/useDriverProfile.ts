import { useState, useEffect } from 'react';
import { driverApi } from '../../services/driverApi';
import { DriverProfile } from '../../types';
import { initialDriverProfile } from '../data/profileData';

export function useDriverProfile() {
    const [profile, setProfile] = useState<DriverProfile>(initialDriverProfile);
    const [isLoading, setIsLoading] = useState(true);

    const loadProfile = async () => {
        try {
            const data = await driverApi.getProfile();
            setProfile(data);
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
        const onProfileUpdate = () => loadProfile();
        window.addEventListener('driver-profile-updated', onProfileUpdate);
        return () => window.removeEventListener('driver-profile-updated', onProfileUpdate);
    }, []);

    const updateProfile = async (updates: Partial<DriverProfile>) => {
        const updated = await driverApi.updateProfile(updates);
        setProfile(updated);
        return updated;
    };

    const toggleDuty = async (status: DriverProfile['dutyStatus']) => {
        const updated = await driverApi.toggleDutyStatus(status);
        setProfile(updated);
        return updated;
    };

    return {
        profile,
        isLoading,
        updateProfile,
        toggleDuty,
        reloadProfile: loadProfile,
    };
}
