import React from 'react';
import { DriverProfile } from '../../../types';
import { DocumentPreviewModal } from '../DocumentPreviewModal';
import { useCredentialsForm } from './useCredentialsForm';
import { CredentialsSectionHeader } from './CredentialsSectionHeader';
import { CdlLicenseCard } from './CdlLicenseCard';
import { DotMedicalCard } from './DotMedicalCard';
import { InsurancePolicyCard } from './InsurancePolicyCard';

interface Props {
    profile: DriverProfile;
}

export const CredentialsSection: React.FC<Props> = ({ profile }) => {
    const form = useCredentialsForm(profile);

    const cdl = profile.cdlDetails || ({} as any);
    const dot = profile.dotMedical || ({} as any);
    const isVerified = Boolean(profile.isVerified);
    const isUnderReview = profile.verificationStatus === 'under_review';
    const isRejected = profile.verificationStatus === 'rejected';

    return (
        <div className="space-y-3 font-sans animate-in fade-in duration-200">
            {/* Hidden File Upload Inputs */}
            <input
                type="file"
                ref={form.cdlFrontRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) form.setCdlFrontFile(f);
                }}
            />
            <input
                type="file"
                ref={form.cdlBackRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) form.setCdlBackFile(f);
                }}
            />
            <input
                type="file"
                ref={form.medicalDocRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) form.setMedicalFile(f);
                }}
            />
            <input
                type="file"
                ref={form.mcsaDocRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) form.setMcsaFile(f);
                }}
            />
            <input
                type="file"
                ref={form.insuranceDocRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) form.setInsuranceFile(f);
                }}
            />

            <CredentialsSectionHeader
                isVerified={isVerified}
                isUnderReview={isUnderReview}
                isRejected={isRejected}
                isEditMode={form.isEditMode}
                isSaving={form.isSaving}
                onEdit={() => form.setIsEditMode(true)}
                onCancel={form.handleCancel}
                onSave={form.handleSave}
            />

            <form onSubmit={form.handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <CdlLicenseCard
                        isEditMode={form.isEditMode}
                        licenseClassBadge={cdl.licenseClass}
                        cdlNumber={form.cdlNumber}
                        setCdlNumber={form.setCdlNumber}
                        stateOfIssue={form.stateOfIssue}
                        setStateOfIssue={form.setStateOfIssue}
                        licenseClass={form.licenseClass}
                        setLicenseClass={form.setLicenseClass}
                        expirationDate={form.expirationDate}
                        setExpirationDate={form.setExpirationDate}
                        endorsements={form.endorsements}
                        setEndorsements={form.setEndorsements}
                        cdlFrontFile={form.cdlFrontFile}
                        cdlBackFile={form.cdlBackFile}
                        cdlFrontRef={form.cdlFrontRef}
                        cdlBackRef={form.cdlBackRef}
                        cdlFrontUrl={cdl.cdlFrontUrl}
                        openDocPreview={form.openDocPreview}
                    />

                    <DotMedicalCard
                        isEditMode={form.isEditMode}
                        nrcmeId={form.nrcmeId}
                        setNrcmeId={form.setNrcmeId}
                        medicalExaminer={form.medicalExaminer}
                        setMedicalExaminer={form.setMedicalExaminer}
                        examDate={form.examDate}
                        setExamDate={form.setExamDate}
                        dotExpiry={form.dotExpiry}
                        setDotExpiry={form.setDotExpiry}
                        mcsaForm={form.mcsaForm}
                        setMcsaForm={form.setMcsaForm}
                        medicalFile={form.medicalFile}
                        medicalDocRef={form.medicalDocRef}
                        certificateUrl={dot.certificateUrl}
                        openDocPreview={form.openDocPreview}
                    />

                    <InsurancePolicyCard
                        isEditMode={form.isEditMode}
                        insuranceProvider={form.insuranceProvider}
                        setInsuranceProvider={form.setInsuranceProvider}
                        policyNumber={form.policyNumber}
                        setPolicyNumber={form.setPolicyNumber}
                        insuranceExpiryDate={form.insuranceExpiryDate}
                        setInsuranceExpiryDate={form.setInsuranceExpiryDate}
                        insuranceFile={form.insuranceFile}
                        insuranceDocRef={form.insuranceDocRef}
                        insuranceCertificateUrl={profile.fleetEquipment?.insuranceCertificateUrl}
                        openDocPreview={form.openDocPreview}
                    />
                </div>
            </form>

            <DocumentPreviewModal
                isOpen={form.previewDoc.isOpen}
                onClose={() => form.setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
                title={form.previewDoc.title}
                fileUrl={form.previewDoc.fileUrl}
                fileType={form.previewDoc.fileType}
            />
        </div>
    );
};

export default CredentialsSection;
