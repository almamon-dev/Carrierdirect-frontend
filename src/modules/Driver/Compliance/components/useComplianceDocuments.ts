import React, { useEffect, useRef, useState } from "react";
import { DriverComplianceData } from "../types";
import { formatFileSize } from "./complianceConstants";

interface Props {
    isOpen: boolean;
    initialData?: DriverComplianceData;
    errors: { [key: string]: string };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const useComplianceDocuments = ({ isOpen, initialData, errors, setErrors }: Props) => {
    const [licenseFrontFile, setLicenseFrontFile] = useState<File | null>(null);
    const [licenseFrontPreview, setLicenseFrontPreview] = useState<string | null>(null);
    const [licenseFrontName, setLicenseFrontName] = useState("");
    const [licenseFrontSize, setLicenseFrontSize] = useState("");

    const [licenseBackFile, setLicenseBackFile] = useState<File | null>(null);
    const [licenseBackPreview, setLicenseBackPreview] = useState<string | null>(null);
    const [licenseBackName, setLicenseBackName] = useState("");
    const [licenseBackSize, setLicenseBackSize] = useState("");

    const [medicalCardFile, setMedicalCardFile] = useState<File | null>(null);
    const [medicalCardPreview, setMedicalCardPreview] = useState<string | null>(null);
    const [medicalCardName, setMedicalCardName] = useState("");
    const [medicalCardSize, setMedicalCardSize] = useState("");

    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
    const [insurancePreview, setInsurancePreview] = useState<string | null>(null);
    const [insuranceName, setInsuranceName] = useState("");
    const [insuranceSize, setInsuranceSize] = useState("");

    const licenseFrontInputRef = useRef<HTMLInputElement>(null);
    const licenseBackInputRef = useRef<HTMLInputElement>(null);
    const medicalInputRef = useRef<HTMLInputElement>(null);
    const insuranceInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        if (initialData) {
            setLicenseFrontPreview(initialData.licenseDocumentUrl || null);
            setLicenseFrontName(initialData.licenseDocumentUrl ? initialData.licenseDocumentUrl.split('/').pop() || "Driving License Front" : "");
            setLicenseFrontSize("");
            setLicenseBackPreview(initialData.licenseBackDocumentUrl || null);
            setLicenseBackName(initialData.licenseBackDocumentUrl ? initialData.licenseBackDocumentUrl.split('/').pop() || "Driving License Back" : "");
            setLicenseBackSize("");
            setMedicalCardPreview(initialData.medicalCardDocumentUrl || null);
            setMedicalCardName(initialData.medicalCardDocumentUrl ? initialData.medicalCardDocumentUrl.split('/').pop() || "Medical Certificate" : "");
            setMedicalCardSize("");
            setInsurancePreview(initialData.insuranceDocumentUrl || null);
            setInsuranceName(initialData.insuranceDocumentUrl ? initialData.insuranceDocumentUrl.split('/').pop() || "Insurance Document" : "");
            setInsuranceSize("");
        } else {
            setLicenseFrontPreview(null);
            setLicenseFrontName("");
            setLicenseFrontSize("");
            setLicenseBackPreview(null);
            setLicenseBackName("");
            setLicenseBackSize("");
            setMedicalCardPreview(null);
            setMedicalCardName("");
            setMedicalCardSize("");
            setInsurancePreview(null);
            setInsuranceName("");
            setInsuranceSize("");
        }
    }, [isOpen, initialData]);

    const handleLicenseFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLicenseFrontFile(file);
            setLicenseFrontName(file.name);
            setLicenseFrontSize(formatFileSize(file.size));
            setLicenseFrontPreview(URL.createObjectURL(file));
            if (errors.licenseFront) setErrors((prev) => ({ ...prev, licenseFront: "" }));
        }
    };

    const handleLicenseFrontRemove = () => {
        setLicenseFrontFile(null);
        setLicenseFrontPreview(null);
        setLicenseFrontName("");
        setLicenseFrontSize("");
        if (licenseFrontInputRef.current) licenseFrontInputRef.current.value = "";
    };

    const handleLicenseBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLicenseBackFile(file);
            setLicenseBackName(file.name);
            setLicenseBackSize(formatFileSize(file.size));
            setLicenseBackPreview(URL.createObjectURL(file));
            if (errors.licenseBack) setErrors((prev) => ({ ...prev, licenseBack: "" }));
        }
    };

    const handleLicenseBackRemove = () => {
        setLicenseBackFile(null);
        setLicenseBackPreview(null);
        setLicenseBackName("");
        setLicenseBackSize("");
        if (licenseBackInputRef.current) licenseBackInputRef.current.value = "";
    };

    const handleMedicalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMedicalCardFile(file);
            setMedicalCardName(file.name);
            setMedicalCardSize(formatFileSize(file.size));
            setMedicalCardPreview(URL.createObjectURL(file));
        }
    };

    const handleMedicalRemove = () => {
        setMedicalCardFile(null);
        setMedicalCardPreview(null);
        setMedicalCardName("");
        setMedicalCardSize("");
        if (medicalInputRef.current) medicalInputRef.current.value = "";
    };

    const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInsuranceFile(file);
            setInsuranceName(file.name);
            setInsuranceSize(formatFileSize(file.size));
            setInsurancePreview(URL.createObjectURL(file));
        }
    };

    const handleInsuranceRemove = () => {
        setInsuranceFile(null);
        setInsurancePreview(null);
        setInsuranceName("");
        setInsuranceSize("");
        if (insuranceInputRef.current) insuranceInputRef.current.value = "";
    };

    const isStep3Valid = Boolean((licenseFrontFile || licenseFrontPreview) && (licenseBackFile || licenseBackPreview));

    return {
        licenseFrontFile,
        licenseFrontPreview,
        licenseFrontName,
        licenseFrontSize,
        licenseFrontInputRef,
        handleLicenseFrontChange,
        handleLicenseFrontRemove,
        licenseBackFile,
        licenseBackPreview,
        licenseBackName,
        licenseBackSize,
        licenseBackInputRef,
        handleLicenseBackChange,
        handleLicenseBackRemove,
        medicalCardFile,
        medicalCardPreview,
        medicalCardName,
        medicalCardSize,
        medicalInputRef,
        handleMedicalChange,
        handleMedicalRemove,
        insuranceFile,
        insurancePreview,
        insuranceName,
        insuranceSize,
        insuranceInputRef,
        handleInsuranceChange,
        handleInsuranceRemove,
        isStep3Valid,
    };
};
