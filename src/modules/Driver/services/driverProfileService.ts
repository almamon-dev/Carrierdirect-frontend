import { TOKEN_CONFIG } from '@/config/auth';
import apiClient from '@/lib/axios';
import { initialDriverProfile } from '../Profile/data/profileData';
import { DriverProfile } from '../types';
import { mapBackendProfileToDriverProfile } from './driverProfileMapper';
import {
    buildPersonalPayload,
    buildEmergencyPayload,
    buildCredentialsPayload,
    buildEquipmentPayload,
} from './profilePayloadUtils';

export function syncAuthUserAvatar(avatarUrl?: string | null, name?: string) {
    if (!avatarUrl && !name) return;
    try {
        let hasChanged = false;
        const keys = [TOKEN_CONFIG.userKey, 'carrierdirect_user_data', 'user', 'erp_user_data'];
        keys.forEach((key) => {
            const raw = localStorage.getItem(key);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed === 'object') {
                        if (avatarUrl !== undefined && parsed.profile_picture !== avatarUrl) {
                            parsed.profile_picture = avatarUrl;
                            hasChanged = true;
                        }
                        if (name && parsed.name !== name) {
                            parsed.name = name;
                            hasChanged = true;
                        }
                        if (hasChanged) {
                            localStorage.setItem(key, JSON.stringify(parsed));
                        }
                    }
                } catch {}
            }
        });
        if (hasChanged) {
            window.dispatchEvent(new Event('user-profile-updated'));
        }
    } catch (err) {
        console.warn('Failed to sync auth user avatar:', err);
    }
}

export const driverProfileService = {
    async getProfile(): Promise<DriverProfile> {
        try {
            const res = await apiClient.get('/driver/profile');
            const data = res.data?.data || res.data;
            if (data && (data.name || data.id || data.employee_id)) {
                if (data.profile_picture) {
                    syncAuthUserAvatar(data.profile_picture, data.name);
                }
                return mapBackendProfileToDriverProfile(data);
            }
        } catch (err) {
            console.error('API Error in getProfile:', err);
        }
        return initialDriverProfile;
    },

    async completeSetup(formData: FormData): Promise<any> {
        const res = await apiClient.post('/driver/profile/complete-setup', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        const data = res.data?.data || res.data;
        if (data?.profile_picture) {
            syncAuthUserAvatar(data.profile_picture, data.name);
        }
        window.dispatchEvent(new Event('driver-profile-updated'));
        window.dispatchEvent(new Event('driver-compliance-updated'));
        return data;
    },

    async updatePersonalInfo(formData: FormData | object): Promise<DriverProfile> {
        await apiClient.post('/driver/profile/personal', formData, {
            headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        });
        const updated = await this.getProfile();
        if (updated?.avatar) {
            syncAuthUserAvatar(updated.avatar, updated.name);
        }
        window.dispatchEvent(new Event('driver-profile-updated'));
        return updated;
    },

    async updateCredentials(formData: FormData | object): Promise<DriverProfile> {
        await apiClient.post('/driver/profile/credentials', formData, {
            headers: formData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        });
        window.dispatchEvent(new Event('driver-profile-updated'));
        window.dispatchEvent(new Event('driver-compliance-updated'));
        return this.getProfile();
    },

    async updateEquipment(data: FormData | object): Promise<DriverProfile> {
        await apiClient.post('/driver/profile/equipment', data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
        });
        window.dispatchEvent(new Event('driver-profile-updated'));
        window.dispatchEvent(new Event('driver-compliance-updated'));
        return this.getProfile();
    },

    async updateEmergency(data: object): Promise<DriverProfile> {
        await apiClient.post('/driver/profile/emergency', data);
        window.dispatchEvent(new Event('driver-profile-updated'));
        window.dispatchEvent(new Event('driver-compliance-updated'));
        return this.getProfile();
    },

    async submitForVerification(): Promise<{ verification_status: string; message: string }> {
        const res = await apiClient.post('/driver/profile/submit-verification');
        window.dispatchEvent(new Event('driver-compliance-updated'));
        window.dispatchEvent(new Event('driver-profile-updated'));
        return res.data;
    },

    async getVerificationStatus(): Promise<{
        is_verified: boolean;
        verification_status: string;
        duty_status: string;
        rejection_reason?: string | null;
    }> {
        try {
            const res = await apiClient.get('/driver/verification/status');
            const data = res.data?.data || res.data;
            if (data) {
                return {
                    is_verified: Boolean(data.is_verified),
                    verification_status: data.verification_status || (data.is_verified ? 'verified' : 'pending_setup'),
                    duty_status: data.duty_status || 'offline',
                    rejection_reason: data.rejection_reason || null,
                };
            }
        } catch (err) {
            console.error('API Error in getVerificationStatus:', err);
        }
        return {
            is_verified: false,
            verification_status: 'pending_setup',
            duty_status: 'offline',
            rejection_reason: null,
        };
    },

    async updateProfile(updates: Partial<DriverProfile>): Promise<DriverProfile> {
        try {
            const hasPersonal =
                updates.name || updates.phone || updates.address || updates.slogan ||
                updates.city || updates.state || updates.zipCode || updates.title || updates.avatar !== undefined;
            if (hasPersonal) {
                const personalPayload = buildPersonalPayload(updates);
                await apiClient.post('/driver/profile/personal', personalPayload, {
                    headers: personalPayload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
                });
            }

            if (updates.emergencyContact || updates.homeTerminal || updates.cdlDetails?.endorsements) {
                await apiClient.post('/driver/profile/emergency', buildEmergencyPayload(updates));
            }

            if (updates.cdlDetails || updates.dotMedical) {
                const credsPayload = buildCredentialsPayload(updates);
                if (Object.keys(credsPayload).length > 0) {
                    await apiClient.post('/driver/profile/credentials', credsPayload);
                }
            }

            if (updates.fleetEquipment) {
                const eqPayload = buildEquipmentPayload(updates);
                if (eqPayload) {
                    await apiClient.post('/driver/profile/equipment', eqPayload);
                }
            }
        } catch (err) {
            console.warn('API sync error in updateProfile:', err);
        }
        window.dispatchEvent(new Event('driver-profile-updated'));
        window.dispatchEvent(new Event('driver-compliance-updated'));
        return this.getProfile();
    },

    async toggleDutyStatus(
        status: 'online' | 'offline' | 'on_trip' | 'break',
        coords?: { lat: number; lng: number }
    ): Promise<DriverProfile> {
        try {
            await apiClient.put('/driver/duty-status', {
                duty_status: status,
                latitude: coords?.lat,
                longitude: coords?.lng,
            });
        } catch (err) {
            console.error('API error in toggleDutyStatus:', err);
        }
        window.dispatchEvent(new Event('driver-profile-updated'));
        return this.getProfile();
    },
};
