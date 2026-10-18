import { DriverProfile } from '../types';

export function buildPersonalPayload(updates: Partial<DriverProfile>): FormData | Record<string, any> {
    if (updates.avatar && typeof updates.avatar !== 'string') {
        const fd = new FormData();
        fd.append('profile_picture', updates.avatar as any);
        if (updates.name) fd.append('name', updates.name);
        if (updates.phone) fd.append('phone', updates.phone);
        if (updates.address) fd.append('address', updates.address);
        if (updates.city) fd.append('city', updates.city);
        if (updates.state) fd.append('state', updates.state);
        if (updates.zipCode) fd.append('zip_code', updates.zipCode);
        if (updates.slogan) fd.append('bio', updates.slogan);
        if (updates.title) fd.append('designation', updates.title);
        return fd;
    }

    return {
        name: updates.name,
        phone: updates.phone,
        address: updates.address,
        city: updates.city,
        state: updates.state,
        zip_code: updates.zipCode,
        bio: updates.slogan,
        designation: updates.title,
        profile_picture: updates.avatar,
        avatar: updates.avatar,
    };
}

export function buildEmergencyPayload(updates: Partial<DriverProfile>) {
    return {
        emergency_contact_name: updates.emergencyContact?.name,
        emergency_contact_phone: updates.emergencyContact?.phone,
        emergency_contact_relation: updates.emergencyContact?.relationship,
        terminal_location: updates.homeTerminal,
        endorsements: updates.cdlDetails?.endorsements
            ? typeof updates.cdlDetails.endorsements === 'string'
                ? updates.cdlDetails.endorsements.split(',').map((s) => s.trim()).filter(Boolean)
                : updates.cdlDetails.endorsements
            : undefined,
    };
}

export function buildCredentialsPayload(updates: Partial<DriverProfile>): Record<string, any> {
    const credsPayload: Record<string, any> = {};
    if (updates.cdlDetails?.cdlNumber) credsPayload.driver_license_number = updates.cdlDetails.cdlNumber;
    if (updates.cdlDetails?.stateOfIssue) credsPayload.driver_license_state = updates.cdlDetails.stateOfIssue;
    if (updates.cdlDetails?.licenseClass) {
        credsPayload.driver_license_class =
            updates.cdlDetails.licenseClass === 'Class A'
                ? 'class_a'
                : updates.cdlDetails.licenseClass === 'Class B'
                ? 'class_b'
                : updates.cdlDetails.licenseClass === 'Class C'
                ? 'class_c'
                : 'standard';
    }
    if (updates.cdlDetails?.issueDate) credsPayload.license_issue_date = updates.cdlDetails.issueDate;
    if (updates.cdlDetails?.expirationDate) credsPayload.license_expiry_date = updates.cdlDetails.expirationDate;
    if (updates.dotMedical?.nrcmeRegistryId) credsPayload.medical_card_number = updates.dotMedical.nrcmeRegistryId;
    if (updates.dotMedical?.medicalExaminer) credsPayload.medical_examiner = updates.dotMedical.medicalExaminer;
    if (updates.dotMedical?.examDate) credsPayload.medical_exam_date = updates.dotMedical.examDate;
    if (updates.dotMedical?.expiryDate) credsPayload.medical_card_expiry_date = updates.dotMedical.expiryDate;
    if (updates.dotMedical?.mcsaForm) credsPayload.mcsa_form = updates.dotMedical.mcsaForm;

    return credsPayload;
}

export function buildEquipmentPayload(updates: Partial<DriverProfile>) {
    if (!updates.fleetEquipment) return null;
    return {
        tractor_model: updates.fleetEquipment.tractorModel,
        truck_number: updates.fleetEquipment.unitNumber,
        trailer_number: updates.fleetEquipment.trailerNumber,
        license_plate: updates.fleetEquipment.licensePlate,
        vin_number: updates.fleetEquipment.vin,
        equipment_type: updates.fleetEquipment.equipmentType,
        insurance_provider: updates.fleetEquipment.insuranceProvider,
        insurance_policy_number: updates.fleetEquipment.insurancePolicyNumber,
        insurance_expiry_date: updates.fleetEquipment.insuranceExpiryDate,
    };
}
