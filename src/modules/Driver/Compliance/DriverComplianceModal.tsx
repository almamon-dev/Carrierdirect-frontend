import { FileText, X } from "lucide-react";
import React from "react";
import { COMPLIANCE_STEPS } from "./components/complianceConstants";
import { ComplianceModalFooter } from "./components/ComplianceModalFooter";
import { ComplianceSidebar } from "./components/ComplianceSidebar";
import { ComplianceStepDocuments } from "./components/ComplianceStepDocuments";
import { ComplianceStepExperience } from "./components/ComplianceStepExperience";
import { ComplianceStepPersonal } from "./components/ComplianceStepPersonal";
import { useComplianceForm } from "./components/useComplianceForm";
import { DriverComplianceData } from "./types";

interface Props {
    isOpen: boolean;
    initialData?: DriverComplianceData;
    canDismiss?: boolean;
    onClose: () => void;
    onComplete?: (data?: any) => Promise<void> | void;
}

export const DriverComplianceModal: React.FC<Props> = ({
    isOpen,
    initialData,
    canDismiss = true,
    onClose,
    onComplete,
}) => {
    const {
        step,
        setStep,
        fullName,
        setFullName,
        phone,
        setPhone,
        currentLocation,
        setCurrentLocation,
        setLatitude,
        setLongitude,
        avatarPreview,
        avatarInputRef,
        handleAvatarChange,
        experienceYears,
        setExperienceYears,
        licenseClass,
        setLicenseClass,
        endorsements,
        setEndorsements,
        vehicleTypes,
        setVehicleTypes,
        licenseFrontPreview,
        licenseFrontName,
        licenseFrontSize,
        licenseFrontInputRef,
        handleLicenseFrontChange,
        handleLicenseFrontRemove,
        licenseBackPreview,
        licenseBackName,
        licenseBackSize,
        licenseBackInputRef,
        handleLicenseBackChange,
        handleLicenseBackRemove,
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
        isSubmitting,
        errorMessage,
        errors,
        setErrors,
        isCurrentStepValid,
        handleNextStep,
    } = useComplianceForm({ isOpen, initialData, onClose, onComplete });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs p-0 animate-in fade-in duration-300">
            <div className="fixed inset-0" onClick={canDismiss ? onClose : undefined} />

            <div className="bg-white dark:bg-[#181a20] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full max-w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out flex flex-col h-auto max-h-[92vh] md:max-h-[88vh] relative z-10 font-sans mx-auto">
                {/* Drag Handle */}
                <button
                    type="button"
                    onClick={canDismiss ? onClose : undefined}
                    disabled={!canDismiss}
                    className="w-full pt-2.5 pb-2 flex items-center justify-center bg-white dark:bg-[#181a20] shrink-0 cursor-pointer group hover:bg-slate-50 dark:hover:bg-[#1a1f26] transition-colors focus:outline-hidden"
                    title="Click to minimize or close"
                    aria-label="Minimize compliance modal"
                >
                    <div className="w-14 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-[#FF4A1F] dark:group-hover:bg-[#FF4A1F] transition-all group-hover:w-20 group-hover:scale-y-110" />
                </button>

                {/* Close Button */}
                {canDismiss && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-4 sm:right-6 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer z-20"
                        title="Close"
                    >
                        <X size={18} />
                    </button>
                )}

                {/* Modal Body: Left Stepper + Right Content */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                    <ComplianceSidebar step={step} onStepClick={setStep} />

                    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#181a20] overflow-hidden">
                        {/* Top Header */}
                        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#181a20] shrink-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF4A1F] dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/60">
                                    <FileText size={12} />
                                    Complete Your Account
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    Step {step} of 3 • {COMPLIANCE_STEPS[step - 1]?.title}
                                </span>
                            </div>
                        </div>

                        {/* Step Form Content */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                            {errorMessage && (
                                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 mb-2">
                                    {errorMessage}
                                </div>
                            )}

                            {step === 1 && (
                                <ComplianceStepPersonal
                                    fullName={fullName}
                                    setFullName={setFullName}
                                    phone={phone}
                                    setPhone={setPhone}
                                    currentLocation={currentLocation}
                                    setCurrentLocation={setCurrentLocation}
                                    setLatitude={setLatitude}
                                    setLongitude={setLongitude}
                                    avatarPreview={avatarPreview}
                                    avatarInputRef={avatarInputRef}
                                    onAvatarChange={handleAvatarChange}
                                    errors={errors}
                                    setErrors={setErrors}
                                />
                            )}

                            {step === 2 && (
                                <ComplianceStepExperience
                                    experienceYears={experienceYears}
                                    setExperienceYears={setExperienceYears}
                                    licenseClass={licenseClass}
                                    setLicenseClass={setLicenseClass}
                                    endorsements={endorsements}
                                    setEndorsements={setEndorsements}
                                    vehicleTypes={vehicleTypes}
                                    setVehicleTypes={setVehicleTypes}
                                    errors={errors}
                                    setErrors={setErrors}
                                />
                            )}

                            {step === 3 && (
                                <ComplianceStepDocuments
                                    licenseFrontPreview={licenseFrontPreview}
                                    licenseFrontName={licenseFrontName}
                                    licenseFrontSize={licenseFrontSize}
                                    licenseFrontInputRef={licenseFrontInputRef}
                                    handleLicenseFrontChange={handleLicenseFrontChange}
                                    handleLicenseFrontRemove={handleLicenseFrontRemove}
                                    licenseFrontError={errors.licenseFront}
                                    licenseBackPreview={licenseBackPreview}
                                    licenseBackName={licenseBackName}
                                    licenseBackSize={licenseBackSize}
                                    licenseBackInputRef={licenseBackInputRef}
                                    handleLicenseBackChange={handleLicenseBackChange}
                                    handleLicenseBackRemove={handleLicenseBackRemove}
                                    licenseBackError={errors.licenseBack}
                                    medicalCardPreview={medicalCardPreview}
                                    medicalCardName={medicalCardName}
                                    medicalCardSize={medicalCardSize}
                                    medicalInputRef={medicalInputRef}
                                    handleMedicalChange={handleMedicalChange}
                                    handleMedicalRemove={handleMedicalRemove}
                                    insurancePreview={insurancePreview}
                                    insuranceName={insuranceName}
                                    insuranceSize={insuranceSize}
                                    insuranceInputRef={insuranceInputRef}
                                    handleInsuranceChange={handleInsuranceChange}
                                    handleInsuranceRemove={handleInsuranceRemove}
                                />
                            )}
                        </div>

                        {/* Footer Action Bar */}
                        <ComplianceModalFooter
                            step={step}
                            canDismiss={canDismiss}
                            isSubmitting={isSubmitting}
                            isCurrentStepValid={isCurrentStepValid}
                            onBack={() => { setErrors({}); setStep((s) => (s - 1) as any); }}
                            onClose={onClose}
                            onNext={handleNextStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
