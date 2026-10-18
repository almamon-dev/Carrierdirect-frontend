import { DriverProfile } from '../../../types';
import { formatDateForInput } from './profileConstants';

export interface ProfileFormData {
    name: string;
    title: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    homeTerminal: string;
    cdlNumber: string;
    stateOfIssue: string;
    licenseClass: string;
    issueDate: string;
    expirationDate: string;
    endorsements: string;
    nrcmeId: string;
    medicalExaminer: string;
    medicalExamDate: string;
    medicalExpiryDate: string;
    tractorModel: string;
    unitNumber: string;
    licensePlate: string;
    vin: string;
    trailerNumber: string;
    equipmentType: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    insuranceExpiryDate: string;
}

export function mapProfileToFormData(profile: DriverProfile): ProfileFormData {
    return {
        name: profile.name || '',
        title: profile.title || 'Commercial Heavy Vehicle Driver',
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zipCode || '',
        homeTerminal: profile.homeTerminal || '',
        cdlNumber: profile.cdlDetails?.cdlNumber || profile.driverLicense || '',
        stateOfIssue: profile.cdlDetails?.stateOfIssue || '',
        licenseClass: profile.cdlDetails?.licenseClass || 'Class A',
        issueDate: formatDateForInput(profile.cdlDetails?.issueDate),
        expirationDate: formatDateForInput(profile.cdlDetails?.expirationDate),
        endorsements: profile.cdlDetails?.endorsements || '',
        nrcmeId: profile.dotMedical?.nrcmeRegistryId || '',
        medicalExaminer: profile.dotMedical?.medicalExaminer || '',
        medicalExamDate: formatDateForInput(profile.dotMedical?.examDate),
        medicalExpiryDate: formatDateForInput(profile.dotMedical?.expiryDate),
        tractorModel: profile.fleetEquipment?.tractorModel || profile.vehicleAssigned?.model || '',
        unitNumber: profile.fleetEquipment?.unitNumber || '',
        licensePlate: profile.fleetEquipment?.licensePlate || profile.vehicleAssigned?.plate || '',
        vin: profile.fleetEquipment?.vin || '',
        trailerNumber: profile.fleetEquipment?.trailerNumber || '',
        equipmentType: profile.fleetEquipment?.equipmentType || profile.vehicleAssigned?.type || '53ft Dry Van',
        insuranceProvider: profile.fleetEquipment?.insuranceProvider || '',
        insurancePolicyNumber: profile.fleetEquipment?.insurancePolicyNumber || '',
        insuranceExpiryDate: formatDateForInput(profile.fleetEquipment?.insuranceExpiryDate),
    };
}

export function buildDriverProfilePayload(profile: DriverProfile, formData: ProfileFormData): Partial<DriverProfile> {
    return {
        name: formData.name,
        title: formData.title,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        homeTerminal: formData.homeTerminal,
        cdlDetails: {
            ...profile.cdlDetails,
            cdlNumber: formData.cdlNumber,
            stateOfIssue: formData.stateOfIssue,
            licenseClass: formData.licenseClass,
            issueDate: formData.issueDate,
            expirationDate: formData.expirationDate,
            endorsements: formData.endorsements,
            cdlFrontUrl: profile.cdlDetails?.cdlFrontUrl || '',
            cdlBackUrl: profile.cdlDetails?.cdlBackUrl || '',
            verification: profile.cdlDetails?.verification || 'Verified',
        },
        dotMedical: {
            ...profile.dotMedical,
            nrcmeRegistryId: formData.nrcmeId,
            medicalExaminer: formData.medicalExaminer,
            examDate: formData.medicalExamDate,
            expiryDate: formData.medicalExpiryDate,
            certificateStatus: profile.dotMedical?.certificateStatus || 'Active',
            certificateUrl: profile.dotMedical?.certificateUrl || '',
            mcsaForm: profile.dotMedical?.mcsaForm || 'MCSA-5876',
            mcsaFormUrl: profile.dotMedical?.mcsaFormUrl || '',
        },
        fleetEquipment: {
            ...profile.fleetEquipment,
            tractorModel: formData.tractorModel,
            unitNumber: formData.unitNumber,
            licensePlate: formData.licensePlate,
            vin: formData.vin,
            trailerNumber: formData.trailerNumber,
            equipmentType: formData.equipmentType,
            insuranceProvider: formData.insuranceProvider,
            insurancePolicyNumber: formData.insurancePolicyNumber,
            insuranceExpiryDate: formData.insuranceExpiryDate,
        },
        vehicleAssigned: {
            ...profile.vehicleAssigned,
            model: formData.tractorModel,
            plate: formData.licensePlate,
            type: formData.equipmentType,
        },
    };
}
