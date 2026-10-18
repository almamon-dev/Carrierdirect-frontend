import { FileText, Image as ImageIcon, Info, ShieldCheck } from "lucide-react";
import React from "react";
import { DocumentUploadCard } from "./DocumentUploadCard";

interface ComplianceStepDocumentsProps {
    licenseFrontPreview: string | null;
    licenseFrontName: string;
    licenseFrontSize: string;
    licenseFrontInputRef: React.RefObject<HTMLInputElement | null>;
    handleLicenseFrontChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLicenseFrontRemove: () => void;
    licenseFrontError?: string;

    licenseBackPreview: string | null;
    licenseBackName: string;
    licenseBackSize: string;
    licenseBackInputRef: React.RefObject<HTMLInputElement | null>;
    handleLicenseBackChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLicenseBackRemove: () => void;
    licenseBackError?: string;

    medicalCardPreview: string | null;
    medicalCardName: string;
    medicalCardSize: string;
    medicalInputRef: React.RefObject<HTMLInputElement | null>;
    handleMedicalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMedicalRemove: () => void;

    insurancePreview: string | null;
    insuranceName: string;
    insuranceSize: string;
    insuranceInputRef: React.RefObject<HTMLInputElement | null>;
    handleInsuranceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInsuranceRemove: () => void;
}

export const ComplianceStepDocuments: React.FC<ComplianceStepDocumentsProps> = ({
    licenseFrontPreview,
    licenseFrontName,
    licenseFrontSize,
    licenseFrontInputRef,
    handleLicenseFrontChange,
    handleLicenseFrontRemove,
    licenseFrontError,

    licenseBackPreview,
    licenseBackName,
    licenseBackSize,
    licenseBackInputRef,
    handleLicenseBackChange,
    handleLicenseBackRemove,
    licenseBackError,

    medicalCardPreview,
    medicalCardName,
    medicalCardSize,
    medicalInputRef,
    handleMedicalChange,
    handleMedicalRemove,

    insurancePreview,
    insuranceName,
    insuranceSize,
    insuranceInputRef,
    handleInsuranceChange,
    handleInsuranceRemove,
}) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-[4px] bg-orange-100/70 dark:bg-orange-950/60 flex items-center justify-center text-[#FF4A1F] shrink-0 mt-0.5">
                    <FileText size={16} />
                </div>
                <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        Upload Verification Documents
                    </h3>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Please upload the required documents below. Make sure all documents are clear, readable and not expired.
                    </p>
                </div>
            </div>

            {/* 4 Document Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* CARD 1: Driving License Front */}
                <DocumentUploadCard
                    title="Driving License (Front Side)"
                    subtitle="Upload the front side of your driving license."
                    icon={<ImageIcon size={13} />}
                    iconBg="bg-orange-100/80 dark:bg-orange-950/80 text-[#FF4A1F]"
                    isRequired
                    preview={licenseFrontPreview}
                    fileName={licenseFrontName}
                    fileSize={licenseFrontSize}
                    inputRef={licenseFrontInputRef}
                    onFileChange={handleLicenseFrontChange}
                    onRemove={handleLicenseFrontRemove}
                    uploadLabel="Upload File"
                    uploadSubtitle="JPG, PNG or PDF (Max 10MB)"
                    error={licenseFrontError}
                />

                {/* CARD 2: Driving License Back */}
                <DocumentUploadCard
                    title="Driving License (Back Side)"
                    subtitle="Upload the back side of your driving license."
                    icon={<ImageIcon size={13} />}
                    iconBg="bg-orange-100/80 dark:bg-orange-950/80 text-[#FF4A1F]"
                    isRequired
                    preview={licenseBackPreview}
                    fileName={licenseBackName}
                    fileSize={licenseBackSize}
                    inputRef={licenseBackInputRef}
                    onFileChange={handleLicenseBackChange}
                    onRemove={handleLicenseBackRemove}
                    uploadLabel="Upload File"
                    uploadSubtitle="JPG, PNG or PDF (Max 10MB)"
                    error={licenseBackError}
                />

                {/* CARD 3: Medical Certificate */}
                <DocumentUploadCard
                    title="Medical Certificate"
                    subtitle="Upload your medical certificate if available."
                    icon={<FileText size={13} />}
                    iconBg="bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400"
                    badge="Optional"
                    preview={medicalCardPreview}
                    fileName={medicalCardName}
                    fileSize={medicalCardSize}
                    inputRef={medicalInputRef}
                    onFileChange={handleMedicalChange}
                    onRemove={handleMedicalRemove}
                    uploadLabel="Upload File"
                    uploadSubtitle="DOT Card / Medical PDF"
                />

                {/* CARD 4: Insurance Document */}
                <DocumentUploadCard
                    title="Insurance Document"
                    subtitle="Upload your insurance document if available."
                    icon={<ShieldCheck size={13} />}
                    iconBg="bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400"
                    badge="Optional"
                    preview={insurancePreview}
                    fileName={insuranceName}
                    fileSize={insuranceSize}
                    inputRef={insuranceInputRef}
                    onFileChange={handleInsuranceChange}
                    onRemove={handleInsuranceRemove}
                    uploadLabel="Upload File"
                    uploadSubtitle="Insurance Certificate PDF"
                />
            </div>

            {/* Informational Blue Note */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-lg text-xs text-blue-800 dark:text-blue-300 mt-4">
                <Info size={16} className="text-blue-500 shrink-0" />
                <span>
                    Driving license (front and back) is required. Medical certificate and insurance document are optional and can also be uploaded later in your profile settings.
                </span>
            </div>
        </div>
    );
};
