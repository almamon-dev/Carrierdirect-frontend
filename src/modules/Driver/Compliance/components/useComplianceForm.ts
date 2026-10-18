import React, { useEffect, useRef, useState } from "react";
import { driverProfileService } from "../../services/driverProfileService";
import { DriverComplianceData } from "../types";
import { useComplianceDocuments } from "./useComplianceDocuments";

interface UseComplianceFormParams {
    isOpen: boolean;
    initialData?: DriverComplianceData;
    onClose: () => void;
    onComplete?: (data?: any) => Promise<void> | void;
}

export const useComplianceForm = ({
    isOpen,
    initialData,
    onClose,
    onComplete,
}: UseComplianceFormParams) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form States - 1. Personal Information
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [currentLocation, setCurrentLocation] = useState("");
    const [latitude, setLatitude] = useState<number | string | null>(null);
    const [longitude, setLongitude] = useState<number | string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Form States - 2. Driver Details
    const [experienceYears, setExperienceYears] = useState("");
    const [licenseClass, setLicenseClass] = useState("");
    const [endorsements, setEndorsements] = useState("");
    const [vehicleTypes, setVehicleTypes] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Form States - 3. Documents Hook
    const docs = useComplianceDocuments({ isOpen, initialData, errors, setErrors });

    useEffect(() => {
        if (!isOpen) return;
        if (initialData) {
            setFullName(initialData.fullName || "");
            setPhone(initialData.phone || "");
            setCurrentLocation(initialData.currentLocation || "");
            if (initialData.latitude != null) setLatitude(initialData.latitude);
            if (initialData.longitude != null) setLongitude(initialData.longitude);
            setExperienceYears(initialData.experienceYears || "");
            setLicenseClass(initialData.licenseClass || "");
            setEndorsements(initialData.endorsements || "");
            setVehicleTypes(initialData.vehicleTypes || "");
            setAvatarPreview(initialData.avatarUrl || null);
        }
        setErrors({});
    }, [isOpen, initialData]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const isStep1Valid = Boolean(fullName.trim() && phone.trim() && currentLocation.trim());
    const isStep2Valid = Boolean(experienceYears && licenseClass);
    const isCurrentStepValid = step === 1 ? isStep1Valid : step === 2 ? isStep2Valid : docs.isStep3Valid;

    const validateStep = (currentStep: 1 | 2 | 3) => {
        const errs: { [key: string]: string } = {};
        if (currentStep === 1) {
            if (!fullName.trim()) errs.fullName = "Full name is required";
            if (!phone.trim()) errs.phone = "Phone number is required";
            if (!currentLocation.trim()) errs.currentLocation = "Current location is required";
        } else if (currentStep === 2) {
            if (!experienceYears) errs.experienceYears = "Driving experience is required";
            if (!licenseClass) errs.licenseClass = "License class is required";
        } else if (currentStep === 3) {
            if (!docs.licenseFrontFile && !docs.licenseFrontPreview) errs.licenseFront = "Front side of driving license is required";
            if (!docs.licenseBackFile && !docs.licenseBackPreview) errs.licenseBack = "Back side of driving license is required";
        }
        return errs;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append("full_name", fullName);
            formData.append("name", fullName);
            formData.append("phone", phone);
            formData.append("current_location", currentLocation);
            if (latitude != null) {
                formData.append("current_latitude", String(latitude));
                formData.append("latitude", String(latitude));
            }
            if (longitude != null) {
                formData.append("current_longitude", String(longitude));
                formData.append("longitude", String(longitude));
            }
            formData.append("experience_years", experienceYears);
            formData.append("license_class", licenseClass);
            if (endorsements) formData.append("endorsements", endorsements);
            if (vehicleTypes) formData.append("vehicle_types", vehicleTypes);

            if (avatarFile) formData.append("profile_picture", avatarFile);
            if (docs.licenseFrontFile) {
                formData.append("license_document", docs.licenseFrontFile);
                formData.append("license_front_document", docs.licenseFrontFile);
            }
            if (docs.licenseBackFile) formData.append("license_back_document", docs.licenseBackFile);
            if (docs.medicalCardFile) formData.append("medical_card_document", docs.medicalCardFile);
            if (docs.insuranceFile) formData.append("insurance_document", docs.insuranceFile);

            await driverProfileService.completeSetup(formData);
            if (onComplete) await onComplete(formData);
            onClose();
        } catch (err: any) {
            console.error("Failed to submit driver compliance:", err);
            setErrorMessage(err?.response?.data?.message || err?.message || "Failed to complete account setup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextStep = () => {
        const errs = validateStep(step);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});
        if (step < 3) {
            setStep((s) => (s + 1) as any);
        } else {
            handleSubmit();
        }
    };

    return {
        step,
        setStep,
        fullName,
        setFullName,
        phone,
        setPhone,
        currentLocation,
        setCurrentLocation,
        latitude,
        setLatitude,
        longitude,
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
        isSubmitting,
        errorMessage,
        errors,
        setErrors,
        isCurrentStepValid,
        handleNextStep,
        ...docs,
    };
};
