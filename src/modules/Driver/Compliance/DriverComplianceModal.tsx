import {
    CreditCard,
    UploadCloud,
    CheckCircle2,
    Briefcase,
    Shield,
    Truck,
    Check,
    X,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import { DriverComplianceData } from "./useDriverCompliance";

interface Props {
    isOpen: boolean;
    initialData?: DriverComplianceData;
    onClose: () => void;
    onComplete: (data: Partial<DriverComplianceData>) => void;
}

const formatDateForInput = (val?: string | null): string => {
    if (!val) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
    }
    return val;
};

const licenseClassOptions = [
    { value: "", label: "Select CDL Classification" },
    { value: "Class A", label: "Class A - Heavy Tractor-Trailer combinations" },
    { value: "Class B", label: "Class B - Straight Truck & Heavy Single Vehicle" },
    { value: "Class C", label: "Class C - Hazardous / Passenger Transport" },
];

const equipmentTypeOptions = [
    { value: "", label: "Select Equipment / Trailer Type" },
    { value: "53ft Dry Van", label: "53ft Dry Van Trailer" },
    { value: "53ft Reefer", label: "53ft Temperature Controlled Reefer" },
    { value: "Flatbed", label: "Standard Flatbed Trailer" },
    { value: "Step Deck", label: "Step Deck / Drop Deck" },
    { value: "Power Only", label: "Power Only (Tractor Unit Only)" },
    { value: "Tanker", label: "Liquid / Bulk Tanker" },
    { value: "Box Truck", label: "Commercial Box Truck (26ft)" },
    { value: "Hotshot", label: "Hotshot / Gooseneck" },
    { value: "Conestoga", label: "Conestoga Trailer" },
    { value: "Car Hauler", label: "Auto Carrier / Car Hauler" },
    { value: "Other", label: "Other (Enter Custom Trailer / Equipment)" },
];

export const DriverComplianceModal: React.FC<Props> = ({
    isOpen,
    initialData,
    onClose,
    onComplete,
}) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form state - Step 1: CDL
    const [cdlNumber, setCdlNumber] = useState("");
    const [licenseClass, setLicenseClass] = useState("");
    const [stateOfIssue, setStateOfIssue] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [cdlExpiry, setCdlExpiry] = useState("");
    const [endorsements, setEndorsements] = useState("");
    const [cdlFrontPhoto, setCdlFrontPhoto] = useState<string | null>(null);
    const [cdlBackPhoto, setCdlBackPhoto] = useState<string | null>(null);
    const [cdlFrontFile, setCdlFrontFile] = useState<File | null>(null);
    const [cdlBackFile, setCdlBackFile] = useState<File | null>(null);

    // Form state - Step 2: DOT Medical
    const [dotRegistryNumber, setDotRegistryNumber] = useState("");
    const [medicalExaminer, setMedicalExaminer] = useState("");
    const [examDate, setExamDate] = useState("");
    const [dotExpiry, setDotExpiry] = useState("");
    const [dotMedicalPhoto, setDotMedicalPhoto] = useState<string | null>(null);
    const [dotMedicalFile, setDotMedicalFile] = useState<File | null>(null);

    // Form state - Step 3: Equipment & Fleet & Insurance
    const [tractorModel, setTractorModel] = useState("");
    const [unitNumber, setUnitNumber] = useState("");
    const [trailerNumber, setTrailerNumber] = useState("");
    const [equipmentType, setEquipmentType] = useState("");
    const [customEquipmentType, setCustomEquipmentType] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [vinNumber, setVinNumber] = useState("");
    const [insuranceProvider, setInsuranceProvider] = useState("");
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
    const [insuranceRenewalDate, setInsuranceRenewalDate] = useState("");
    const [insurancePhoto, setInsurancePhoto] = useState<string | null>(null);
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

    const cdlFrontRef = useRef<HTMLInputElement>(null);
    const cdlBackRef = useRef<HTMLInputElement>(null);
    const dotMedicalRef = useRef<HTMLInputElement>(null);
    const insuranceRef = useRef<HTMLInputElement>(null);

    // Reset step when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
        }
    }, [isOpen]);

    // Sync initialData when modal opens or initialData changes
    useEffect(() => {
        if (initialData) {
            setCdlNumber(initialData.cdlNumber || "");
            setLicenseClass(initialData.licenseClass || "");
            setStateOfIssue(initialData.stateOfIssue || "");
            setIssueDate(formatDateForInput(initialData.issueDate));
            setCdlExpiry(formatDateForInput(initialData.cdlExpiry));
            setEndorsements(initialData.endorsements || "");
            setCdlFrontPhoto(initialData.cdlFrontPhoto || null);
            setCdlBackPhoto(initialData.cdlBackPhoto || null);

            setDotRegistryNumber(initialData.dotRegistryNumber || "");
            setMedicalExaminer(initialData.medicalExaminer || "");
            setExamDate(formatDateForInput(initialData.examDate));
            setDotExpiry(formatDateForInput(initialData.dotExpiry));
            setDotMedicalPhoto(initialData.dotMedicalPhoto || null);

            setTractorModel(initialData.tractorModel || "");
            setUnitNumber(initialData.unitNumber || "");
            setTrailerNumber(initialData.trailerNumber || "");
            
            // Equipment Type / Other Custom handling
            const incomingEquip = initialData.equipmentType || "";
            const isStandard = equipmentTypeOptions.some(
                (opt) => opt.value === incomingEquip && opt.value !== "" && opt.value !== "Other"
            );
            if (!incomingEquip) {
                setEquipmentType("");
                setCustomEquipmentType("");
            } else if (isStandard) {
                setEquipmentType(incomingEquip);
                setCustomEquipmentType("");
            } else {
                setEquipmentType("Other");
                setCustomEquipmentType(incomingEquip);
            }

            setLicensePlate(initialData.licensePlate || "");
            setVinNumber(initialData.vinNumber || "");
            setInsuranceProvider(initialData.insuranceProvider || "");
            setInsurancePolicyNumber(initialData.insurancePolicyNumber || "");
            setInsuranceRenewalDate(formatDateForInput(initialData.insuranceRenewalDate));
            setInsurancePhoto(initialData.insurancePhoto || null);

            setCdlFrontFile(null);
            setCdlBackFile(null);
            setDotMedicalFile(null);
            setInsuranceFile(null);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        nameSetter: (val: string | null) => void,
        fileSetter: (file: File | null) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            nameSetter(file.name);
            fileSetter(file);
        }
    };

    const handleNextStep = () => {
        if (step === 1) setStep(2);
        else if (step === 2) setStep(3);
        else if (step === 3) {
            const finalEquipmentType = equipmentType === "Other" ? customEquipmentType : equipmentType;
            onComplete({
                cdlNumber,
                licenseClass,
                stateOfIssue,
                issueDate,
                cdlExpiry,
                endorsements,
                cdlFrontPhoto,
                cdlBackPhoto,
                cdlFrontFile,
                cdlBackFile,
                dotRegistryNumber,
                medicalExaminer,
                examDate,
                dotExpiry,
                dotMedicalPhoto,
                dotMedicalFile,
                tractorModel,
                unitNumber,
                trailerNumber,
                equipmentType: finalEquipmentType,
                licensePlate,
                vinNumber,
                insuranceProvider,
                insurancePolicyNumber,
                insuranceRenewalDate,
                insurancePhoto,
                insuranceFile,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300 p-0">
            {/* Backdrop click dismiss */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* Hidden File Inputs */}
            <input
                type="file"
                ref={cdlFrontRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, setCdlFrontPhoto, setCdlFrontFile)}
            />
            <input
                type="file"
                ref={cdlBackRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, setCdlBackPhoto, setCdlBackFile)}
            />
            <input
                type="file"
                ref={dotMedicalRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, setDotMedicalPhoto, setDotMedicalFile)}
            />
            <input
                type="file"
                ref={insuranceRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, setInsurancePhoto, setInsuranceFile)}
            />

            {/* Bottom-Sheet Container */}
            <div className="bg-white dark:bg-[#1e2329] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out flex flex-col h-auto max-h-[92vh] relative z-10 font-sans">
                {/* Top Drag Handle Bar (Centered) */}
                <div className="pt-3 pb-1 flex justify-center bg-white dark:bg-[#1e2329]">
                    <div className="w-16 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>

                {/* Close X Button at Top-Right */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3.5 right-4 sm:right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer z-20"
                    title="Close"
                >
                    <X size={20} />
                </button>

                {/* Header Container with Centered Stepper Navigation */}
                <div className="w-full px-4 sm:px-8 pt-1 pb-4 text-center border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1e2329] shrink-0">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            Driver Compliance Verification
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Step {step} of 3 • Required for Shipments & Active Fleet Dispatch
                        </p>

                        {/* Stepper Navigation Progress Bar */}
                        <div className="flex items-center justify-center gap-2 sm:gap-6 mt-4 px-2">
                            {/* 1. CDL License */}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex flex-col items-center cursor-pointer group"
                            >
                                <div
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                        step > 1
                                            ? "bg-emerald-600 text-white"
                                            : step === 1
                                                ? "bg-[#FF4A1F] text-white ring-4 ring-orange-100 dark:ring-orange-950/50"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                    }`}
                                >
                                    {step > 1 ? <Check size={16} strokeWidth={2.5} /> : <CreditCard size={16} />}
                                </div>
                                <span
                                    className={`text-[10.5px] sm:text-xs font-bold mt-1.5 transition-colors ${
                                        step === 1
                                            ? "text-[#FF4A1F]"
                                            : step > 1
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-slate-500 dark:text-slate-400"
                                    }`}
                                >
                                    CDL License
                                </span>
                            </button>

                            {/* Connector 1 */}
                            <div
                                className={`w-12 sm:w-20 md:w-28 h-[2px] mb-5 transition-colors ${
                                    step > 1 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                                }`}
                            />

                            {/* 2. DOT Med Card */}
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="flex flex-col items-center cursor-pointer group"
                            >
                                <div
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                        step > 2
                                            ? "bg-emerald-600 text-white"
                                            : step === 2
                                                ? "bg-[#FF4A1F] text-white ring-4 ring-orange-100 dark:ring-orange-950/50"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                    }`}
                                >
                                    {step > 2 ? <Check size={16} strokeWidth={2.5} /> : <Briefcase size={16} />}
                                </div>
                                <span
                                    className={`text-[10.5px] sm:text-xs font-bold mt-1.5 transition-colors ${
                                        step === 2
                                            ? "text-[#FF4A1F]"
                                            : step > 2
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-slate-500 dark:text-slate-400"
                                    }`}
                                >
                                    DOT Med Card
                                </span>
                            </button>

                            {/* Connector 2 */}
                            <div
                                className={`w-12 sm:w-20 md:w-28 h-[2px] mb-5 transition-colors ${
                                    step > 2 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                                }`}
                            />

                            {/* 3. Fleet & Equipment */}
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="flex flex-col items-center cursor-pointer group"
                            >
                                <div
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                        step === 3
                                            ? "bg-[#FF4A1F] text-white ring-4 ring-orange-100 dark:ring-orange-950/50"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                                    }`}
                                >
                                    <Truck size={16} />
                                </div>
                                <span
                                    className={`text-[10.5px] sm:text-xs font-bold mt-1.5 transition-colors ${
                                        step === 3
                                            ? "text-[#FF4A1F]"
                                            : "text-slate-500 dark:text-slate-400"
                                    }`}
                                >
                                    Fleet Insurance
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body Area - Clean Form directly on modal surface */}
                <div className="px-6 sm:px-10 py-6 overflow-y-auto flex-1 font-sans text-xs">
                    <div className="max-w-2xl mx-auto">
                        {/* STEP 1: CDL LICENSE */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <CreditCard size={18} className="text-[#FF4A1F]" />
                                        <span>Step 1: Commercial Driver License (CDL)</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Verify your state-issued commercial driver credentials and active endorsements.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    {/* License Number */}
                                    <Input
                                        label="CDL License Number"
                                        icon={<CreditCard size={15} className="text-[#FF4A1F]" />}
                                        value={cdlNumber}
                                        onChange={(e) => setCdlNumber(e.target.value)}
                                        placeholder="e.g. D12345678"
                                        required
                                    />

                                    {/* State of Issue */}
                                    <Input
                                        label="State of Issue"
                                        value={stateOfIssue}
                                        onChange={(e) => setStateOfIssue(e.target.value)}
                                        placeholder="e.g. TX / CA / IL"
                                        required
                                    />

                                    {/* License Class */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            CDL Classification
                                        </label>
                                        <Select
                                            value={licenseClass}
                                            onChange={(val) => setLicenseClass(val)}
                                            options={licenseClassOptions}
                                            placeholder="Select CDL Classification"
                                        />
                                    </div>

                                    {/* Issue Date */}
                                    <DatePicker
                                        label="License Issue Date"
                                        value={issueDate}
                                        onChange={(e) => setIssueDate(e.target.value)}
                                    />

                                    {/* Expiration Date */}
                                    <DatePicker
                                        label="CDL Expiration Date"
                                        value={cdlExpiry}
                                        onChange={(e) => setCdlExpiry(e.target.value)}
                                        required
                                    />

                                    {/* Endorsements */}
                                    <div className="sm:col-span-2">
                                        <Input
                                            label="CDL Endorsements"
                                            value={endorsements}
                                            onChange={(e) => setEndorsements(e.target.value)}
                                            placeholder="e.g. Tanker (N), HazMat (H), Doubles (T)"
                                        />
                                    </div>
                                </div>

                                {/* Document Uploads */}
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        CDL License Verification Documents (Front & Back)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* CDL Front */}
                                        <button
                                            type="button"
                                            onClick={() => cdlFrontRef.current?.click()}
                                            className={`h-11 px-3.5 rounded-[4px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                                cdlFrontPhoto
                                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={16} className={cdlFrontPhoto ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                                <span className="truncate">{cdlFrontPhoto ? `Front: ${cdlFrontPhoto}` : "Upload CDL Front Photo / PDF"}</span>
                                            </div>
                                            {cdlFrontPhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                        </button>

                                        {/* CDL Back */}
                                        <button
                                            type="button"
                                            onClick={() => cdlBackRef.current?.click()}
                                            className={`h-11 px-3.5 rounded-[4px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                                cdlBackPhoto
                                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={16} className={cdlBackPhoto ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                                <span className="truncate">{cdlBackPhoto ? `Back: ${cdlBackPhoto}` : "Upload CDL Back Photo / PDF"}</span>
                                            </div>
                                            {cdlBackPhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DOT MEDICAL */}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Briefcase size={18} className="text-[#FF4A1F]" />
                                        <span>Step 2: DOT Medical Card & Physical Examination</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Provide your National Registry of Certified Medical Examiners (NRCME) credentials.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    {/* Medical Registry Number */}
                                    <Input
                                        label="DOT / NRCME Registry Number"
                                        icon={<Briefcase size={15} className="text-[#FF4A1F]" />}
                                        value={dotRegistryNumber}
                                        onChange={(e) => setDotRegistryNumber(e.target.value)}
                                        placeholder="e.g. 1234567890"
                                        required
                                    />

                                    {/* Medical Examiner */}
                                    <Input
                                        label="Certified Medical Examiner Name"
                                        value={medicalExaminer}
                                        onChange={(e) => setMedicalExaminer(e.target.value)}
                                        placeholder="e.g. Dr. Robert Smith, MD"
                                        required
                                    />

                                    {/* Exam Date */}
                                    <DatePicker
                                        label="Physical Exam Date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                    />

                                    {/* DOT Expiration Date */}
                                    <DatePicker
                                        label="DOT Medical Expiration Date"
                                        value={dotExpiry}
                                        onChange={(e) => setDotExpiry(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Document Upload */}
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Upload DOT Medical Certificate (PDF / Scans)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => dotMedicalRef.current?.click()}
                                        className={`w-full h-11 px-3.5 rounded-[4px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                            dotMedicalPhoto
                                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <UploadCloud size={16} className={dotMedicalPhoto ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                            <span className="truncate">{dotMedicalPhoto ? `Medical Certificate: ${dotMedicalPhoto}` : "Upload DOT Medical Certificate PDF / Photo"}</span>
                                        </div>
                                        {dotMedicalPhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: EQUIPMENT & INSURANCE */}
                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-150">
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Truck size={18} className="text-[#FF4A1F]" />
                                        <span>Step 3: Power Unit, Trailer & Insurance Verification</span>
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Register your commercial vehicle specifications and active carrier insurance policy.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                    {/* Tractor Model */}
                                    <Input
                                        label="Tractor Make & Model"
                                        icon={<Truck size={15} className="text-[#FF4A1F]" />}
                                        value={tractorModel}
                                        onChange={(e) => setTractorModel(e.target.value)}
                                        placeholder="e.g. Freightliner Cascadia / Volvo VNL"
                                    />

                                    {/* Power Unit Number */}
                                    <Input
                                        label="Power Unit / Truck Number"
                                        value={unitNumber}
                                        onChange={(e) => setUnitNumber(e.target.value)}
                                        placeholder="e.g. TRK-101"
                                    />

                                    {/* Equipment Type */}
                                    <div>
                                        <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Equipment / Trailer Type
                                        </label>
                                        <Select
                                            value={equipmentType}
                                            onChange={(val) => {
                                                setEquipmentType(val);
                                                if (val !== "Other") {
                                                    setCustomEquipmentType("");
                                                }
                                            }}
                                            options={equipmentTypeOptions}
                                            placeholder="Select Equipment / Trailer Type"
                                        />
                                    </div>

                                    {/* Assigned Trailer Number */}
                                    <Input
                                        label="Assigned Trailer Number"
                                        value={trailerNumber}
                                        onChange={(e) => setTrailerNumber(e.target.value)}
                                        placeholder="e.g. TRL-559"
                                    />

                                    {/* Custom Equipment Input if 'Other' selected */}
                                    {equipmentType === "Other" && (
                                        <div className="sm:col-span-2 animate-in fade-in duration-150">
                                            <Input
                                                label="Custom Equipment / Trailer Specification"
                                                value={customEquipmentType}
                                                onChange={(e) => setCustomEquipmentType(e.target.value)}
                                                placeholder="Enter your custom trailer type (e.g. 48ft Lowboy, Hopper Bottom, Double Drop)"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* License Plate */}
                                    <Input
                                        label="Vehicle License Plate Number"
                                        value={licensePlate}
                                        onChange={(e) => setLicensePlate(e.target.value)}
                                        placeholder="e.g. ABC-12345"
                                    />

                                    {/* VIN Number */}
                                    <Input
                                        label="VIN (Vehicle Identification Number)"
                                        value={vinNumber}
                                        onChange={(e) => setVinNumber(e.target.value)}
                                        placeholder="e.g. 1FT8W3BT9H..."
                                    />

                                    {/* Commercial Insurance Provider */}
                                    <Input
                                        label="Commercial Fleet Insurance Provider"
                                        icon={<Shield size={15} className="text-[#FF4A1F]" />}
                                        value={insuranceProvider}
                                        onChange={(e) => setInsuranceProvider(e.target.value)}
                                        placeholder="e.g. Progressive Commercial / Great West"
                                    />

                                    {/* Policy Number */}
                                    <Input
                                        label="Insurance Policy Number"
                                        value={insurancePolicyNumber}
                                        onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                                        placeholder="e.g. POL-9928172"
                                    />

                                    {/* Insurance Renewal Date */}
                                    <div className="sm:col-span-2">
                                        <DatePicker
                                            label="Insurance Policy Expiration / Renewal Date"
                                            value={insuranceRenewalDate}
                                            onChange={(e) => setInsuranceRenewalDate(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Certificate of Insurance Upload */}
                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Upload Certificate of Insurance (COI) Document
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => insuranceRef.current?.click()}
                                        className={`w-full h-11 px-3.5 rounded-[4px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                            insurancePhoto
                                                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <UploadCloud size={16} className={insurancePhoto ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                            <span className="truncate">{insurancePhoto ? `Insurance COI: ${insurancePhoto}` : "Upload Certificate of Insurance (PDF / Scan)"}</span>
                                        </div>
                                        {insurancePhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Navigation Bar */}
                <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#161a22] shrink-0">
                    <div className="max-w-2xl mx-auto w-full flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={step === 1 ? onClose : () => setStep((s) => (s - 1) as any)}
                            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-[4px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                            {step === 1 ? "Cancel" : "← Back"}
                        </button>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="px-6 py-2 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-[0.99]"
                        >
                            <span>
                                {step === 1
                                    ? "Next Step (2/3) →"
                                    : step === 2
                                    ? "Next Step (3/3) →"
                                    : "Submit Verification for Approval"}
                            </span>
                            {step === 3 && <CheckCircle2 size={15} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
