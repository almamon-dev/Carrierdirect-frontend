export interface DriverComplianceData {
    fullName?: string;
    phone?: string;
    currentLocation?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    experienceYears?: string;
    licenseClass?: string;
    endorsements?: string;
    vehicleTypes?: string;
    avatarUrl?: string | null;
    licenseDocumentUrl?: string | null;
    licenseBackDocumentUrl?: string | null;
    medicalCardDocumentUrl?: string | null;
    insuranceDocumentUrl?: string | null;
    isVerified: boolean;
    verificationStatus?: string;
    rejectionReason?: string;
    completedAt?: string;
    // Backwards compatibility legacy fields
    cdlNumber?: string;
    stateOfIssue?: string;
    issueDate?: string;
    cdlExpiry?: string;
    dotRegistryNumber?: string;
    medicalExaminer?: string;
    examDate?: string;
    dotExpiry?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    insuranceRenewalDate?: string;
}

export const defaultComplianceData: DriverComplianceData = {
    fullName: '',
    phone: '',
    currentLocation: '',
    experienceYears: '',
    licenseClass: '',
    endorsements: '',
    vehicleTypes: '',
    avatarUrl: null,
    licenseDocumentUrl: null,
    medicalCardDocumentUrl: null,
    insuranceDocumentUrl: null,
    isVerified: false,
    verificationStatus: 'pending_setup',
};
