import { useState, useEffect, useCallback, useRef } from 'react';
import { driverApi } from '../services/driverApi';
import { TOKEN_CONFIG } from '@/config/auth';
import { DriverComplianceData, defaultComplianceData } from './types';
import {
    getStoredUser,
    getInitialVerified,
    getInitialStatus,
    setGlobalDriverVerified,
    getGlobalDriverVerified,
    requireDriverCompliance,
} from './complianceGlobalStore';
import { mapProfileToComplianceData, submitComplianceData } from './complianceSubmission';

export type { DriverComplianceData };
export {
    defaultComplianceData,
    setGlobalDriverVerified,
    getGlobalDriverVerified,
    requireDriverCompliance,
};

export function useDriverCompliance() {
    const isFetchingRef = useRef(false);
    const [isVerified, setIsVerified] = useState<boolean>(getInitialVerified);
    const [verificationStatus, setVerificationStatus] = useState<string>(getInitialStatus);
    const [complianceData, setComplianceData] = useState<DriverComplianceData>(defaultComplianceData);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
    const [isLockPromptOpen, setIsLockPromptOpen] = useState<boolean>(false);
    const [lockPromptFeature, setLockPromptFeature] = useState<string>('Dispatch Notifications & Load Actions');

    const loadLiveCompliance = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        try {
            const profile = await driverApi.getProfile();
            const verified = Boolean(profile.isVerified);
            const status = profile.verificationStatus || (verified ? 'verified' : 'pending_setup');

            setIsVerified(verified);
            setGlobalDriverVerified(verified);
            setVerificationStatus(status);

            try {
                const user = getStoredUser();
                if (user) {
                    user.is_verified = verified;
                    user.verification_status = status;
                    localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(user));
                }
            } catch (e) {
                // ignore
            }

            setComplianceData(mapProfileToComplianceData(profile, verified, status));
        } catch (err) {
            console.error('Failed to fetch live compliance status:', err);
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLiveCompliance();
        const handleSync = () => {
            loadLiveCompliance();
        };

        window.addEventListener('driver-compliance-updated', handleSync);
        window.addEventListener('driver-profile-updated', handleSync);
        return () => {
            window.removeEventListener('driver-compliance-updated', handleSync);
            window.removeEventListener('driver-profile-updated', handleSync);
        };
    }, [loadLiveCompliance]);

    useEffect(() => {
        if (verificationStatus !== 'under_review') return;
        const interval = setInterval(() => {
            loadLiveCompliance();
        }, 15000);
        return () => clearInterval(interval);
    }, [verificationStatus, loadLiveCompliance]);

    const requireVerification = useCallback(
        (action: () => void, featureName?: string) => {
            if (!isVerified) {
                setLockPromptFeature(featureName || 'Dispatch Notifications & Load Actions');
                setIsLockPromptOpen(true);
                return false;
            }
            action();
            return true;
        },
        [isVerified]
    );

    const completeCompliance = useCallback(
        async (data: Partial<DriverComplianceData>) => {
            try {
                await submitComplianceData(data);
                await loadLiveCompliance();
            } catch (err) {
                console.error('Failed to submit compliance to API:', err);
                throw err;
            } finally {
                setIsLockPromptOpen(false);
            }
        },
        [loadLiveCompliance]
    );

    const resetCompliance = useCallback(() => {
        setIsVerified(false);
        setGlobalDriverVerified(false);
        setComplianceData(defaultComplianceData);
        window.dispatchEvent(new Event('driver-compliance-updated'));
    }, []);

    return {
        isVerified,
        verificationStatus,
        complianceData,
        isLoading,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isLockPromptOpen,
        setIsLockPromptOpen,
        lockPromptFeature,
        setLockPromptFeature,
        requireVerification,
        completeCompliance,
        resetCompliance,
        reloadCompliance: loadLiveCompliance,
    };
}
