import { driverApi } from '../../../services/driverApi';

export interface CredentialsSubmitData {
    cdlNumber: string;
    stateOfIssue: string;
    licenseClass: string;
    issueDate: string;
    expirationDate: string;
    endorsements: string;
    nrcmeId: string;
    medicalExaminer: string;
    examDate: string;
    dotExpiry: string;
    mcsaForm: string;
    insuranceProvider: string;
    policyNumber: string;
    insuranceEffectiveDate: string;
    insuranceExpiryDate: string;
}

export interface CredentialsFiles {
    cdlFrontFile: File | null;
    cdlBackFile: File | null;
    medicalFile: File | null;
    mcsaFile: File | null;
    insuranceFile: File | null;
}

export async function submitCredentials(data: CredentialsSubmitData, files: CredentialsFiles) {
    const formData = new FormData();
    formData.append('driver_license_number', data.cdlNumber);
    formData.append('driver_license_state', data.stateOfIssue);
    formData.append(
        'driver_license_class',
        data.licenseClass === 'Class A'
            ? 'class_a'
            : data.licenseClass === 'Class B'
            ? 'class_b'
            : data.licenseClass === 'Class C'
            ? 'class_c'
            : 'standard'
    );
    if (data.issueDate) formData.append('license_issue_date', data.issueDate);
    if (data.expirationDate) formData.append('license_expiry_date', data.expirationDate);
    if (data.nrcmeId) formData.append('medical_card_number', data.nrcmeId);
    if (data.medicalExaminer) formData.append('medical_examiner', data.medicalExaminer);
    if (data.examDate) formData.append('medical_exam_date', data.examDate);
    if (data.dotExpiry) formData.append('medical_card_expiry_date', data.dotExpiry);
    if (data.mcsaForm) formData.append('mcsa_form', data.mcsaForm);

    if (files.cdlFrontFile) formData.append('license_document', files.cdlFrontFile);
    if (files.cdlBackFile) formData.append('license_back_document', files.cdlBackFile);
    if (files.medicalFile) formData.append('medical_card_document', files.medicalFile);
    if (files.mcsaFile) formData.append('mcsa_document', files.mcsaFile);

    await driverApi.updateCredentials(formData);

    const equipFormData = new FormData();
    equipFormData.append('insurance_provider', data.insuranceProvider);
    equipFormData.append('insurance_policy_number', data.policyNumber);
    equipFormData.append('insurance_effective_date', data.insuranceEffectiveDate);
    equipFormData.append('insurance_expiry_date', data.insuranceExpiryDate);
    if (files.insuranceFile) equipFormData.append('insurance_document', files.insuranceFile);
    await driverApi.updateEquipment(equipFormData);

    if (data.endorsements) {
        await driverApi.updateEmergency({
            endorsements: data.endorsements.split(',').map((s) => s.trim()).filter(Boolean),
        });
    }
}
