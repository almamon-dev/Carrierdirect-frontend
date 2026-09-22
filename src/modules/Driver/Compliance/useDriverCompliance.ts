import { useState, useEffect, useCallback } from "react";
import { driverApi } from "../services/driverApi";
import { TOKEN_CONFIG } from "@/config/auth";

export interface DriverComplianceData {
    cdlNumber: string;
    licenseClass: string;
    stateOfIssue: string;
    issueDate: string;
    cdlExpiry: string;
    endorsements: string;
    cdlFrontPhoto?: string | null;
    cdlBackPhoto?: string | null;
    cdlFrontFile?: File | null;
    cdlBackFile?: File | null;
    dotRegistryNumber: string;
    medicalExaminer?: string;
    examDate?: string;
    dotExpiry: string;
    dotMedicalPhoto?: string | null;
    dotMedicalFile?: File | null;
    mcsaForm?: string;
    mcsaFormPhoto?: string | null;
    mcsaFormFile?: File | null;
    insuranceProvider?: string;
    insurancePolicyNumber: string;
    insuranceRenewalDate: string;
    insurancePhoto?: string | null;
    insuranceFile?: File | null;
    tractorModel?: string;
    unitNumber?: string;
    trailerNumber?: string;
    equipmentType?: string;
    licensePlate?: string;
    vinNumber?: string;
    isVerified: boolean;
    verificationStatus?: string;
    rejectionReason?: string;
    completedAt?: string;
}

const defaultComplianceData: DriverComplianceData = {
    cdlNumber: "",
    licenseClass: "",
    stateOfIssue: "",
    issueDate: "",
    cdlExpiry: "",
    endorsements: "",
    cdlFrontPhoto: null,
    cdlBackPhoto: null,
    cdlFrontFile: null,
    cdlBackFile: null,
    dotRegistryNumber: "",
    medicalExaminer: "",
    examDate: "",
    dotExpiry: "",
    dotMedicalPhoto: null,
    dotMedicalFile: null,
    mcsaForm: "",
    mcsaFormPhoto: null,
    mcsaFormFile: null,
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceRenewalDate: "",
    insurancePhoto: null,
    insuranceFile: null,
    tractorModel: "",
    unitNumber: "",
    trailerNumber: "",
    equipmentType: "",
    licensePlate: "",
    vinNumber: "",
    isVerified: false,
    verificationStatus: "pending_setup",
};

function getStoredUser() {
    try {
        const raw =
            localStorage.getItem(TOKEN_CONFIG.userKey) ||
            localStorage.getItem("carrierdirect_user_data") ||
            localStorage.getItem("user");
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function getInitialVerified(): boolean {
    const user = getStoredUser();
    return Boolean(user?.is_verified);
}

function getInitialStatus(): string {
    const user = getStoredUser();
    if (user?.is_verified) return "verified";
    return user?.verification_status || "pending_setup";
}

let cachedIsVerified = getInitialVerified();

export function setGlobalDriverVerified(verified: boolean) {
    cachedIsVerified = verified;
}

export function getGlobalDriverVerified(): boolean {
    return cachedIsVerified;
}

/**
 * Global helper to guard any driver action with compliance verification
 */
export function requireDriverCompliance(action: () => void, featureName?: string): boolean {
    if (!cachedIsVerified) {
        window.dispatchEvent(
            new CustomEvent("open-driver-lock-prompt", {
                detail: { featureName: featureName || "Driver Actions" },
            })
        );
        return false;
    }
    action();
    return true;
}

export function useDriverCompliance() {
    const [isVerified, setIsVerified] = useState<boolean>(getInitialVerified);
    const [verificationStatus, setVerificationStatus] = useState<string>(getInitialStatus);
    const [complianceData, setComplianceData] = useState<DriverComplianceData>(defaultComplianceData);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
    const [isLockPromptOpen, setIsLockPromptOpen] = useState<boolean>(false);
    const [lockPromptFeature, setLockPromptFeature] = useState<string>("Dispatch Notifications & Load Actions");

    const loadLiveCompliance = useCallback(async () => {
        try {
            const profile = await driverApi.getProfile();
            const verified = Boolean(profile.isVerified);
            const status = profile.verificationStatus || (verified ? "verified" : "pending_setup");
            
            setIsVerified(verified);
            setGlobalDriverVerified(verified);
            setVerificationStatus(status);

            // Sync with local storage user object
            try {
                const user = getStoredUser();
                if (user) {
                    user.is_verified = verified;
                    user.verification_status = status;
                    localStorage.setItem(TOKEN_CONFIG.userKey, JSON.stringify(user));
                }
            } catch (e) {
                // ignore
            }

            setComplianceData({
                cdlNumber: profile.cdlDetails?.cdlNumber || "",
                licenseClass: profile.cdlDetails?.licenseClass || "",
                stateOfIssue: profile.cdlDetails?.stateOfIssue || "",
                issueDate: profile.cdlDetails?.issueDate || "",
                cdlExpiry: profile.cdlDetails?.expirationDate || "",
                endorsements: profile.cdlDetails?.endorsements || "",
                cdlFrontPhoto: profile.cdlDetails?.cdlFrontUrl || null,
                cdlBackPhoto: profile.cdlDetails?.cdlBackUrl || null,
                dotRegistryNumber: profile.dotMedical?.nrcmeRegistryId || "",
                medicalExaminer: profile.dotMedical?.medicalExaminer || "",
                examDate: profile.dotMedical?.examDate || "",
                dotExpiry: profile.dotMedical?.expiryDate || "",
                dotMedicalPhoto: profile.dotMedical?.certificateUrl || null,
                mcsaForm: profile.dotMedical?.mcsaForm || "",
                mcsaFormPhoto: profile.dotMedical?.mcsaFormUrl || null,
                insuranceProvider: profile.fleetEquipment?.insuranceProvider || "",
                insurancePolicyNumber: profile.fleetEquipment?.insurancePolicyNumber || "",
                insuranceRenewalDate: profile.fleetEquipment?.insuranceExpiryDate || "",
                insurancePhoto: profile.fleetEquipment?.insuranceCertificateUrl || null,
                tractorModel: profile.fleetEquipment?.tractorModel || "",
                unitNumber: profile.fleetEquipment?.unitNumber || "",
                trailerNumber: profile.fleetEquipment?.trailerNumber || "",
                equipmentType: profile.fleetEquipment?.equipmentType || "",
                licensePlate: profile.fleetEquipment?.licensePlate || "",
                vinNumber: profile.fleetEquipment?.vin || "",
                isVerified: verified,
                verificationStatus: status,
                rejectionReason: profile.rejectionReason,
            });
        } catch (err) {
            console.error("Failed to fetch live compliance status:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load and sync on global events
    useEffect(() => {
        loadLiveCompliance();
        const handleSync = () => {
            loadLiveCompliance();
        };

        window.addEventListener("driver-compliance-updated", handleSync);
        window.addEventListener("driver-profile-updated", handleSync);
        return () => {
            window.removeEventListener("driver-compliance-updated", handleSync);
            window.removeEventListener("driver-profile-updated", handleSync);
        };
    }, [loadLiveCompliance]);

    // Auto-poll when under_review so driver gets verified in real time when admin approves
    useEffect(() => {
        if (verificationStatus !== "under_review") return;
        const interval = setInterval(() => {
            loadLiveCompliance();
        }, 15000);
        return () => clearInterval(interval);
    }, [verificationStatus, loadLiveCompliance]);

    const requireVerification = useCallback(
        (action: () => void, featureName?: string) => {
            if (!isVerified) {
                setLockPromptFeature(featureName || "Dispatch Notifications & Load Actions");
                setIsLockPromptOpen(true);
                return false;
            }
            action();
            return true;
        },
        [isVerified]
    );

    const completeCompliance = useCallback(async (data: Partial<DriverComplianceData>) => {
        try {
            // 1. Credentials FormData
            const credsFormData = new FormData();
            if (data.cdlNumber) credsFormData.append("driver_license_number", data.cdlNumber);
            if (data.stateOfIssue) credsFormData.append("driver_license_state", data.stateOfIssue);
            if (data.licenseClass) {
                credsFormData.append(
                    "driver_license_class",
                    data.licenseClass === "Class A"
                        ? "class_a"
                        : data.licenseClass === "Class B"
                        ? "class_b"
                        : data.licenseClass === "Class C"
                        ? "class_c"
                        : "standard"
                );
            }
            if (data.issueDate) credsFormData.append("license_issue_date", data.issueDate);
            if (data.cdlExpiry) credsFormData.append("license_expiry_date", data.cdlExpiry);
            if (data.dotRegistryNumber) credsFormData.append("medical_card_number", data.dotRegistryNumber);
            if (data.medicalExaminer) credsFormData.append("medical_examiner", data.medicalExaminer);
            if (data.examDate) credsFormData.append("medical_exam_date", data.examDate);
            if (data.dotExpiry) credsFormData.append("medical_card_expiry_date", data.dotExpiry);
            if (data.mcsaForm) credsFormData.append("mcsa_form", data.mcsaForm);

            if (data.cdlFrontFile) credsFormData.append("license_document", data.cdlFrontFile);
            if (data.cdlBackFile) credsFormData.append("license_back_document", data.cdlBackFile);
            if (data.dotMedicalFile) credsFormData.append("medical_card_document", data.dotMedicalFile);
            if (data.mcsaFormFile) credsFormData.append("mcsa_document", data.mcsaFormFile);

            await driverApi.updateCredentials(credsFormData);

            // 2. Equipment FormData
            const equipFormData = new FormData();
            if (data.tractorModel) equipFormData.append("tractor_model", data.tractorModel);
            if (data.unitNumber) equipFormData.append("truck_number", data.unitNumber);
            if (data.trailerNumber) equipFormData.append("trailer_number", data.trailerNumber);
            if (data.licensePlate) equipFormData.append("license_plate", data.licensePlate);
            if (data.vinNumber) equipFormData.append("vin_number", data.vinNumber);
            if (data.equipmentType) equipFormData.append("equipment_type", data.equipmentType);
            if (data.insuranceProvider) equipFormData.append("insurance_provider", data.insuranceProvider);
            if (data.insurancePolicyNumber) equipFormData.append("insurance_policy_number", data.insurancePolicyNumber);
            if (data.insuranceRenewalDate) equipFormData.append("insurance_expiry_date", data.insuranceRenewalDate);
            if (data.insuranceFile) equipFormData.append("insurance_document", data.insuranceFile);

            await driverApi.updateEquipment(equipFormData);

            // 3. Emergency / Endorsements
            if (data.endorsements) {
                await driverApi.updateEmergency({
                    endorsements: typeof data.endorsements === "string"
                        ? data.endorsements.split(",").map((s) => s.trim()).filter(Boolean)
                        : data.endorsements,
                });
            }

            await driverApi.submitForVerification();
            await loadLiveCompliance();
        } catch (err) {
            console.error("Failed to submit compliance to API:", err);
        } finally {
            setIsVerificationModalOpen(false);
            setIsLockPromptOpen(false);
        }
    }, [loadLiveCompliance]);

    const resetCompliance = useCallback(() => {
        setIsVerified(false);
        setGlobalDriverVerified(false);
        setComplianceData(defaultComplianceData);
        window.dispatchEvent(new Event("driver-compliance-updated"));
    }, []);

    return {
        isVerified,
        verificationStatus,
        complianceData,
        isLoading,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isLockPromptOpen,
        setIsLockPromptOpen,
        lockPromptFeature,
        setLockPromptFeature,
        requireVerification,
        completeCompliance,
        resetCompliance,
        reloadCompliance: loadLiveCompliance,
    };
}
