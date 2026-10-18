import { driverApi } from '../services/driverApi';
import { DriverComplianceData } from './types';

export function mapProfileToComplianceData(profile: any, verified: boolean, status: string): DriverComplianceData {
    return {
        fullName: profile.name || profile.fullName || '',
        phone: profile.phone || '',
        currentLocation: profile.currentLocation || profile.current_location || '',
        latitude: profile.latitude || profile.current_latitude || null,
        longitude: profile.longitude || profile.current_longitude || null,
        experienceYears: profile.experienceYears || profile.experience_years || '',
        licenseClass: profile.licenseClass || profile.license_class || profile.cdlDetails?.licenseClass || '',
        endorsements: profile.endorsements || profile.cdlDetails?.endorsements || '',
        vehicleTypes: profile.vehicleTypes || profile.vehicle_types || '',
        avatarUrl: profile.avatarUrl || profile.profile_picture || null,
        licenseDocumentUrl: profile.cdlDetails?.cdlFrontUrl || profile.credentials?.license_document || profile.license_document || profile.license_front_document || profile.licenseDocumentUrl || null,
        licenseBackDocumentUrl: profile.cdlDetails?.cdlBackUrl || profile.credentials?.license_back_document || profile.license_back_document || profile.licenseBackDocumentUrl || null,
        medicalCardDocumentUrl: profile.dotMedical?.certificateUrl || profile.credentials?.medical_card_document || profile.medical_card_document || profile.medicalCardDocumentUrl || null,
        insuranceDocumentUrl: profile.fleetEquipment?.insuranceCertificateUrl || profile.equipment?.insurance_document || profile.credentials?.insurance_document || profile.insurance_document || profile.insuranceDocumentUrl || null,
        isVerified: verified,
        verificationStatus: status,
        rejectionReason: profile.rejectionReason || profile.rejection_reason,
    };
}

export async function submitComplianceData(data: FormData | Partial<DriverComplianceData>): Promise<any> {
    if (data instanceof FormData) {
        return await driverApi.completeSetup(data);
    }

    const formData = new FormData();
    if (data.fullName) formData.append('full_name', data.fullName);
    if (data.phone) formData.append('phone', data.phone);
    if (data.currentLocation) formData.append('current_location', data.currentLocation);
    if (data.latitude) {
        formData.append('current_latitude', String(data.latitude));
        formData.append('latitude', String(data.latitude));
    }
    if (data.longitude) {
        formData.append('current_longitude', String(data.longitude));
        formData.append('longitude', String(data.longitude));
    }
    if (data.experienceYears) formData.append('experience_years', data.experienceYears);
    if (data.licenseClass) formData.append('license_class', data.licenseClass);
    if (data.endorsements) formData.append('endorsements', data.endorsements);
    if (data.vehicleTypes) formData.append('vehicle_types', data.vehicleTypes);

    return await driverApi.completeSetup(formData);
}
