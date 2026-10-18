import { DriverProfile } from '../types';
import { initialDriverProfile } from '../Profile/data/profileData';

export function mapBackendProfileToDriverProfile(data: any): DriverProfile {
    const licenseClassVal = data.credentials?.driver_license_class;

    return {
        id: data.id || data.employee_id || '',
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.profile_picture || '',
        title: data.personal?.designation || data.role_name || '',
        slogan: data.personal?.bio || '',
        licenseBadge:
            licenseClassVal === 'class_b' ? 'Class B' : licenseClassVal === 'class_c' ? 'Class C' : 'Class A',
        isVerified: Boolean(data.verification?.is_verified),
        verificationStatus: data.verification?.status || 'pending_setup',
        rejectionReason: data.verification?.rejection_reason || undefined,
        employerCarrier: data.employer_carrier || undefined,
        employmentStatus: data.verification?.is_verified ? 'Active' : 'Suspended',
        dutyStatus: data.duty_status || 'offline',
        address: data.personal?.address || '',
        city: data.personal?.city || '',
        state: data.personal?.state || '',
        zipCode: data.personal?.zip_code || '',
        driverLicense: data.credentials?.driver_license_number || '',
        joinedDate: data.created_at || '',
        homeTerminal: data.emergency?.terminal_location || '',
        emergencyContact: {
            name: data.emergency?.contact_name || '',
            phone: data.emergency?.contact_phone || '',
            relationship: data.emergency?.contact_relation || '',
        },
        cdlDetails: {
            cdlNumber: data.credentials?.driver_license_number || '',
            licenseClass:
                licenseClassVal === 'class_b'
                    ? 'Class B'
                    : licenseClassVal === 'class_c'
                        ? 'Class C'
                        : licenseClassVal === 'class_a'
                            ? 'Class A'
                            : '',
            stateOfIssue: data.credentials?.driver_license_state || '',
            expirationDate: data.credentials?.license_expiry_date || '',
            issueDate: data.credentials?.license_issue_date || '',
            endorsements: Array.isArray(data.emergency?.endorsements)
                ? data.emergency.endorsements.join(', ')
                : data.emergency?.endorsements || '',
            cdlFrontUrl: data.credentials?.license_document || '',
            cdlBackUrl: data.credentials?.license_back_document || '',
            verification:
                data.credentials?.license_status === 'verified'
                    ? 'FMCSA Verified'
                    : data.credentials?.license_status === 'rejected'
                        ? 'Rejected'
                        : 'Pending Verification',
        },
        dotMedical: {
            nrcmeRegistryId: data.credentials?.medical_card_number || '',
            medicalExaminer: data.credentials?.medical_examiner || '',
            examDate: data.credentials?.medical_exam_date || '',
            expiryDate: data.credentials?.medical_card_expiry_date || '',
            certificateStatus: data.credentials?.medical_card_status === 'verified' ? 'Active' : 'Pending',
            certificateUrl: data.credentials?.medical_card_document || '',
            mcsaForm: data.credentials?.mcsa_form || '',
            mcsaFormUrl: data.credentials?.mcsa_document || '',
        },
        fleetEquipment: {
            unitNumber: data.equipment?.truck_number || '',
            trailerNumber: data.equipment?.trailer_number || '',
            licensePlate: data.equipment?.license_plate || '',
            vin: data.equipment?.vin_number || '',
            equipmentType: data.equipment?.equipment_type || '',
            tractorModel: data.equipment?.tractor_model || '',
            year: data.equipment?.truck_year ? Number(data.equipment.truck_year) : undefined,
            eldUnitId: data.equipment?.eld_unit_id || '',
            currentMileage: data.equipment?.mileage || '',
            trailerVin: data.equipment?.trailer_vin || '',
            trailerType: data.equipment?.trailer_type || '',
            gpsTracker: data.equipment?.gps_tracker || '',
            inspectionStatus: data.equipment?.inspection_status || '',
            inspectionCertificateName: '',
            inspectionCertificateUrl:
                data.equipment?.inspection_document || data.equipment?.inspection_certificate || '',
            insuranceProvider: data.equipment?.insurance_provider || '',
            insurancePolicyNumber: data.equipment?.insurance_policy_number || '',
            insuranceEffectiveDate: data.equipment?.insurance_effective_date || '',
            insuranceExpiryDate: data.equipment?.insurance_expiry_date || '',
            insuranceStatus: data.equipment?.insurance_policy_number ? 'Active' : '',
            insuranceCertificateUrl: data.equipment?.insurance_document || '',
        },
        vehicleAssigned: {
            plate: data.equipment?.license_plate || '',
            model: data.equipment?.tractor_model || '',
            type: data.equipment?.equipment_type || '',
            capacity: '',
            status: data.verification?.is_verified ? 'Active' : 'Inactive',
        },
        stats: initialDriverProfile.stats,
        preferences: initialDriverProfile.preferences,
    };
}
