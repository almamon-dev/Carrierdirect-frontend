import { useState, useEffect, useCallback } from 'react';

const COMPLIANCE_STORAGE_KEY = 'carrierdirect_driver_compliance_completed';
const COMPLIANCE_DATA_KEY = 'carrierdirect_driver_compliance_data';

export interface DriverComplianceData {
    cdlNumber: string;
    licenseClass?: string;
    stateOfIssue?: string;
    issueDate?: string;
    cdlExpiry: string;
    endorsements?: string;
    cdlFrontPhoto?: string | null;
    cdlBackPhoto?: string | null;
    dotRegistryNumber: string;
    medicalExaminer?: string;
    examDate?: string;
    dotExpiry: string;
    dotMedicalPhoto?: string | null;
    mcsaForm?: string;
    mcsaFormPhoto?: string | null;
    insurancePolicyNumber: string;
    insuranceRenewalDate: string;
    insurancePhoto?: string | null;
    tractorModel?: string;
    unitNumber?: string;
    licensePlate?: string;
    isVerified: boolean;
    completedAt?: string;
}

const defaultComplianceData: DriverComplianceData = {
    cdlNumber: 'DL-4587-NY',
    licenseClass: 'Class A',
    stateOfIssue: 'New York',
    issueDate: 'Jan 01, 2025',
    cdlExpiry: 'Dec 31, 2028',
    endorsements: 'Air Brakes, Tanker, HazMat',
    cdlFrontPhoto: '/documents/drivers/DRV-9872/cdl-front.pdf',
    cdlBackPhoto: '/documents/drivers/DRV-9872/cdl-back.pdf',
    dotRegistryNumber: '#88924018',
    medicalExaminer: 'Dr. Robert Hayes',
    examDate: 'Jan 10, 2025',
    dotExpiry: 'Jan 10, 2026',
    dotMedicalPhoto: '/documents/drivers/DRV-9872/medical-certificate.pdf',
    mcsaForm: 'MCSA-5876',
    mcsaFormPhoto: '/documents/drivers/DRV-9872/mcsa-5876.pdf',
    insurancePolicyNumber: 'INS-POL-49201',
    insuranceRenewalDate: '12/31/2026',
    insurancePhoto: '/documents/fleet/TRK-559/insurance.pdf',
    tractorModel: 'Freightliner Cascadia',
    unitNumber: 'TRK-559',
    licensePlate: 'ABC-987654',
    isVerified: false,
};

/**
 * Global helper to guard any driver action with compliance verification
 */
export function requireDriverCompliance(action: () => void, featureName?: string): boolean {
    try {
        const verified = localStorage.getItem(COMPLIANCE_STORAGE_KEY) === 'true';
        if (!verified) {
            window.dispatchEvent(
                new CustomEvent('open-driver-lock-prompt', {
                    detail: { featureName: featureName || 'Dispatch Notifications & Load Actions' },
                })
            );
            return false;
        }
    } catch {}
    action();
    return true;
}

export function useDriverCompliance() {
    const [isVerified, setIsVerified] = useState<boolean>(() => {
        try {
            return localStorage.getItem(COMPLIANCE_STORAGE_KEY) === 'true';
        } catch {
            return false;
        }
    });

    const [complianceData, setComplianceData] = useState<DriverComplianceData>(() => {
        try {
            const raw = localStorage.getItem(COMPLIANCE_DATA_KEY);
            if (raw) {
                return { ...defaultComplianceData, ...JSON.parse(raw) };
            }
        } catch {}
        return defaultComplianceData;
    });

    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
    const [isLockPromptOpen, setIsLockPromptOpen] = useState<boolean>(false);
    const [lockPromptFeature, setLockPromptFeature] = useState<string>('Dispatch Notifications & Load Actions');

    // Sync on window storage update
    useEffect(() => {
        const handleSync = () => {
            try {
                const verified = localStorage.getItem(COMPLIANCE_STORAGE_KEY) === 'true';
                setIsVerified(verified);
                const raw = localStorage.getItem(COMPLIANCE_DATA_KEY);
                if (raw) {
                    setComplianceData({ ...defaultComplianceData, ...JSON.parse(raw) });
                }
            } catch {}
        };

        window.addEventListener('storage', handleSync);
        window.addEventListener('driver-compliance-updated', handleSync);
        return () => {
            window.removeEventListener('storage', handleSync);
            window.removeEventListener('driver-compliance-updated', handleSync);
        };
    }, []);

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

    const completeCompliance = useCallback((data: Partial<DriverComplianceData>) => {
        const merged: DriverComplianceData = {
            ...complianceData,
            ...data,
            isVerified: true,
            completedAt: new Date().toISOString(),
        };

        setComplianceData(merged);
        setIsVerified(true);
        setIsVerificationModalOpen(false);
        setIsLockPromptOpen(false);

        try {
            localStorage.setItem(COMPLIANCE_STORAGE_KEY, 'true');
            localStorage.setItem(COMPLIANCE_DATA_KEY, JSON.stringify(merged));

            // Sync with driver portal profile state
            const profileKey = 'driver_portal_profile';
            const rawProfile = localStorage.getItem(profileKey);
            let profileObj = rawProfile ? JSON.parse(rawProfile) : {};
            profileObj = {
                ...profileObj,
                isVerified: true,
                driverLicense: merged.cdlNumber || profileObj.driverLicense || 'DL-4587-NY',
                cdlDetails: {
                    ...(profileObj.cdlDetails || {}),
                    cdlNumber: merged.cdlNumber,
                    licenseClass: merged.licenseClass || 'Class A',
                    stateOfIssue: merged.stateOfIssue || 'New York',
                    issueDate: merged.issueDate || 'Jan 01, 2025',
                    expirationDate: merged.cdlExpiry,
                    endorsements: merged.endorsements || 'Air Brakes, Tanker, HazMat',
                    cdlFrontUrl: merged.cdlFrontPhoto || '/documents/drivers/DRV-9872/cdl-front.pdf',
                    cdlBackUrl: merged.cdlBackPhoto || '/documents/drivers/DRV-9872/cdl-back.pdf',
                    verification: 'FMCSA Verified',
                },
                dotMedical: {
                    ...(profileObj.dotMedical || {}),
                    nrcmeRegistryId: merged.dotRegistryNumber,
                    medicalExaminer: merged.medicalExaminer || 'Dr. Robert Hayes',
                    examDate: merged.examDate || 'Jan 10, 2025',
                    expiryDate: merged.dotExpiry,
                    certificateStatus: 'Active',
                    certificateUrl: merged.dotMedicalPhoto || '/documents/drivers/DRV-9872/medical-certificate.pdf',
                    mcsaForm: merged.mcsaForm || 'MCSA-5876',
                    mcsaFormUrl: merged.mcsaFormPhoto || '/documents/drivers/DRV-9872/mcsa-5876.pdf',
                },
                fleetEquipment: {
                    ...(profileObj.fleetEquipment || {}),
                    tractorModel: merged.tractorModel || 'Freightliner Cascadia',
                    unitNumber: merged.unitNumber || 'TRK-559',
                    licensePlate: merged.licensePlate || 'ABC-987654',
                    insuranceStatus: 'Active',
                    insuranceCertificateUrl: merged.insurancePhoto || '/documents/fleet/TRK-559/insurance.pdf',
                },
            };
            localStorage.setItem(profileKey, JSON.stringify(profileObj));

            window.dispatchEvent(new Event('driver-compliance-updated'));
            window.dispatchEvent(new Event('driver-profile-updated'));
        } catch {}
    }, [complianceData]);

    const resetCompliance = useCallback(() => {
        setIsVerified(false);
        setComplianceData(defaultComplianceData);
        try {
            localStorage.removeItem(COMPLIANCE_STORAGE_KEY);
            localStorage.removeItem(COMPLIANCE_DATA_KEY);
            window.dispatchEvent(new Event('driver-compliance-updated'));
        } catch {}
    }, []);

    return {
        isVerified,
        complianceData,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isLockPromptOpen,
        setIsLockPromptOpen,
        lockPromptFeature,
        setLockPromptFeature,
        requireVerification,
        completeCompliance,
        resetCompliance,
    };
}
