import React, { useState, useEffect, useRef } from "react";
import {
    CreditCard,
    UploadCloud,
    CheckCircle2,
    Briefcase,
    Shield,
    Truck,
    Check,
    X,
    ShieldCheck,
    Lock,
    Clock,
    RotateCw,
    AlertCircle,
    Loader2,
} from "lucide-react";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import { DriverComplianceData } from "./useDriverCompliance";

interface Props {
    isOpen: boolean;
    initialData?: DriverComplianceData;
    onClose: () => void;
    onComplete: (data: Partial<DriverComplianceData>) => Promise<void> | void;
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
    { value: "", label: "Select CDL Classification *" },
    { value: "Class A", label: "Class A - Heavy Tractor-Trailer combinations" },
    { value: "Class B", label: "Class B - Straight Truck & Heavy Single Vehicle" },
    { value: "Class C", label: "Class C - Hazardous / Commercial Transport" },
];

const equipmentTypeOptions = [
    { value: "", label: "Select Equipment / Trailer Type *" },
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

const COMPLIANCE_STEPS = [
    {
        number: 1,
        title: "CDL License",
        subtitle: "Driver credentials & class",
        icon: CreditCard,
    },
    {
        number: 2,
        title: "DOT Medical Card",
        subtitle: "MCSA-5876 physical exam",
        icon: Briefcase,
    },
    {
        number: 3,
        title: "Assigned Vehicle",
        subtitle: "Power unit & trailer specs",
        icon: Truck,
    },
    {
        number: 4,
        title: "Fleet Insurance",
        subtitle: "Commercial liability COI",
        icon: ShieldCheck,
    },
    {
        number: 5,
        title: "Admin Approval",
        subtitle: "Safety review & status",
        icon: Clock,
    },
];

export const DriverComplianceModal: React.FC<Props> = ({
    isOpen,
    initialData,
    onClose,
    onComplete,
}) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Form state - Step 3: Equipment & Power Unit
    const [tractorModel, setTractorModel] = useState("");
    const [unitNumber, setUnitNumber] = useState("");
    const [trailerNumber, setTrailerNumber] = useState("");
    const [equipmentType, setEquipmentType] = useState("");
    const [customEquipmentType, setCustomEquipmentType] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [vinNumber, setVinNumber] = useState("");

    // Form state - Step 4: Insurance
    const [insuranceProvider, setInsuranceProvider] = useState("");
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
    const [insuranceRenewalDate, setInsuranceRenewalDate] = useState("");
    const [insurancePhoto, setInsurancePhoto] = useState<string | null>(null);
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

    const cdlFrontRef = useRef<HTMLInputElement>(null);
    const cdlBackRef = useRef<HTMLInputElement>(null);
    const dotMedicalRef = useRef<HTMLInputElement>(null);
    const insuranceRef = useRef<HTMLInputElement>(null);

    // Reset or set step when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData?.verificationStatus === "under_review" || initialData?.isVerified) {
                setStep(5);
            } else {
                setStep(1);
            }
        }
    }, [isOpen, initialData?.verificationStatus, initialData?.isVerified]);

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

    // ─── STRICT FRONTEND STEP VALIDATION ───
    const isStep1Valid = Boolean(
        cdlNumber.trim() &&
        stateOfIssue.trim() &&
        licenseClass.trim() &&
        cdlExpiry.trim() &&
        (cdlFrontPhoto || cdlFrontFile) &&
        (cdlBackPhoto || cdlBackFile)
    );

    const isStep2Valid = Boolean(
        dotRegistryNumber.trim() &&
        medicalExaminer.trim() &&
        dotExpiry.trim() &&
        (dotMedicalPhoto || dotMedicalFile)
    );

    const isStep3Valid = Boolean(
        tractorModel.trim() &&
        unitNumber.trim() &&
        equipmentType.trim() &&
        (equipmentType !== "Other" || customEquipmentType.trim() !== "") &&
        trailerNumber.trim() &&
        licensePlate.trim() &&
        vinNumber.trim()
    );

    const isStep4Valid = Boolean(
        insuranceProvider.trim() &&
        insurancePolicyNumber.trim() &&
        insuranceRenewalDate.trim() &&
        (insurancePhoto || insuranceFile)
    );

    const isCurrentStepValid =
        step === 1 ? isStep1Valid :
        step === 2 ? isStep2Valid :
        step === 3 ? isStep3Valid :
        step === 4 ? isStep4Valid :
        true;

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

    const handleNextStep = async () => {
        if (step === 1 && isStep1Valid) {
            setStep(2);
        } else if (step === 2 && isStep2Valid) {
            setStep(3);
        } else if (step === 3 && isStep3Valid) {
            setStep(4);
        } else if (step === 4 && isStep4Valid) {
            setIsSubmitting(true);
            try {
                const finalEquipmentType = equipmentType === "Other" ? customEquipmentType : equipmentType;
                await onComplete({
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
                // Transition to Step 5 (Admin Approval) and stay on it
                setStep(5);
            } catch (err) {
                console.error("Failed to submit verification:", err);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const isUnderReview = initialData?.verificationStatus === "under_review" || step === 5;
    const isApproved = initialData?.isVerified || initialData?.verificationStatus === "verified";

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

            {/* ══════════════════════════════════════════════════════════════
                BOTTOM-SHEET CONTAINER (Slides up from footer)
               ══════════════════════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-[#181a20] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out flex flex-col h-auto max-h-[92vh] md:max-h-[85vh] relative z-10 font-sans">
                
                {/* Top Drag Handle Bar (Click to Minimize) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full pt-2.5 pb-2 flex items-center justify-center bg-white dark:bg-[#181a20] shrink-0 cursor-pointer group hover:bg-slate-50 dark:hover:bg-[#1a1f26] transition-colors focus:outline-hidden"
                    title="Click to minimize or close"
                    aria-label="Minimize compliance modal"
                >
                    <div className="w-14 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-[#FF4A1F] dark:group-hover:bg-[#FF4A1F] transition-all group-hover:w-20 group-hover:scale-y-110" />
                </button>

                {/* Close Button (X) */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-4 sm:right-6 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer z-20"
                    title="Close"
                >
                    <X size={18} />
                </button>

                {/* Top Header Section */}
                <div className="px-5 sm:px-8 pt-0 pb-3 text-left border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#181a20] shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF4A1F] dark:bg-orange-950/60 dark:text-orange-400 border border-orange-200/80 dark:border-orange-800/60">
                            <Shield size={11} />
                            FMCSA Compliance
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Step {step} of 5 • {COMPLIANCE_STEPS[step - 1]?.title}
                        </span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    MODAL BODY: LEFT SIDEBAR (STEPPER) + RIGHT FORM CONTENT
                   ══════════════════════════════════════════════════════════════ */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
                    
                    {/* ─── LEFT SIDEBAR: VERTICAL STEPPER ─── */}
                    <div className="w-full md:w-[270px] lg:w-[290px] bg-slate-50/90 dark:bg-[#14181f] border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
                        <div>
                            <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                                Verification Progress
                            </h3>

                            {/* Vertical Stepper with Connected Lines */}
                            <div className="space-y-0">
                                {COMPLIANCE_STEPS.map((s, idx) => {
                                    const isCurrent = step === s.number;
                                    const isCompleted = step > s.number;
                                    const isLast = idx === COMPLIANCE_STEPS.length - 1;

                                    return (
                                        <div key={s.number} className="relative flex items-start group">
                                            {/* Vertical Connecting Line between circle centers */}
                                            {!isLast && (
                                                <div
                                                    className={`absolute left-[13px] top-[26px] bottom-[-2px] w-[2px] transition-colors duration-300 ${
                                                        isCompleted
                                                            ? "bg-emerald-500 dark:bg-emerald-500"
                                                            : "bg-slate-200 dark:bg-slate-700/80"
                                                    }`}
                                                />
                                            )}

                                            {/* Step Button */}
                                            <button
                                                type="button"
                                                onClick={() => setStep(s.number as any)}
                                                className="relative flex items-start gap-3 pb-4.5 text-left w-full cursor-pointer focus:outline-hidden"
                                            >
                                                {/* Circular Step Indicator */}
                                                <div
                                                    className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                                                        isCompleted
                                                            ? "bg-emerald-600 text-white shadow-2xs"
                                                            : isCurrent
                                                            ? s.number === 5
                                                                ? "bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/60 shadow-2xs"
                                                                : "bg-[#FF4A1F] text-white ring-4 ring-orange-100 dark:ring-orange-950/60 shadow-2xs"
                                                            : "bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 text-slate-500 group-hover:border-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                                                    }`}
                                                >
                                                    {isCompleted ? (
                                                        <Check size={13} strokeWidth={2.5} />
                                                    ) : s.number === 5 ? (
                                                        <Clock size={13} />
                                                    ) : (
                                                        <span>{s.number}</span>
                                                    )}
                                                </div>

                                                {/* Step Label & Subtitle */}
                                                <div className="pt-0.5 min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className={`text-xs font-bold transition-colors truncate ${
                                                                isCurrent
                                                                    ? s.number === 5 ? "text-amber-600 dark:text-amber-400" : "text-[#FF4A1F]"
                                                                    : isCompleted
                                                                    ? "text-slate-900 dark:text-slate-100"
                                                                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                                                            }`}
                                                        >
                                                            {s.title}
                                                        </span>
                                                        {isCompleted && (
                                                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1 rounded-[2px]">
                                                                Done
                                                            </span>
                                                        )}
                                                        {isCurrent && s.number === 5 && (
                                                            <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-1 rounded-[2px] animate-pulse">
                                                                Review
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                                        {s.subtitle}
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom Sidebar Note */}
                        <div className="hidden md:flex items-center gap-2 p-2 bg-white dark:bg-[#1a1f26] rounded-[4px] border border-slate-200/80 dark:border-slate-800 text-[10.5px] text-slate-500 dark:text-slate-400 mt-2">
                            <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="leading-tight">
                                Encrypted & verified for instant dispatching.
                            </span>
                        </div>
                    </div>

                    {/* ─── RIGHT CONTENT AREA: STEP FORMS & INPUTS ─── */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#181a20] overflow-hidden">
                        
                        {/* Step Form Header */}
                        <div className="px-5 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#151921] shrink-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                {step === 1 && <><CreditCard size={15} className="text-[#FF4A1F]" /> Commercial Driver's License (CDL)</>}
                                {step === 2 && <><Briefcase size={15} className="text-[#FF4A1F]" /> DOT Medical Certificate (MCSA-5876)</>}
                                {step === 3 && <><Truck size={15} className="text-[#FF4A1F]" /> Assigned Vehicle & Trailer Specifications</>}
                                {step === 4 && <><ShieldCheck size={15} className="text-[#FF4A1F]" /> Commercial Fleet Liability & Cargo Insurance</>}
                                {step === 5 && <><Clock size={15} className="text-amber-500" /> Fleet Admin Approval & Review Status</>}
                            </h4>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-sans text-xs">
                            
                            {/* ── STEP 1: CDL LICENSE ── */}
                            {step === 1 && (
                                <div className="space-y-3.5 animate-in fade-in duration-150">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input
                                            label="CDL License Number *"
                                            icon={<CreditCard size={14} className="text-[#FF4A1F]" />}
                                            value={cdlNumber}
                                            onChange={(e) => setCdlNumber(e.target.value)}
                                            placeholder="e.g. DL-IE-98452107"
                                            required
                                        />

                                        <Input
                                            label="State / Jurisdiction of Issue *"
                                            value={stateOfIssue}
                                            onChange={(e) => setStateOfIssue(e.target.value)}
                                            placeholder="e.g. Dublin Port Region"
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                                CDL Classification <span className="text-red-500 font-bold ml-0.5">*</span>
                                            </label>
                                            <Select
                                                value={licenseClass}
                                                onChange={(val) => setLicenseClass(val)}
                                                options={licenseClassOptions}
                                                placeholder="Select CDL Classification"
                                            />
                                        </div>

                                        <DatePicker
                                            label="License Issue Date"
                                            value={issueDate}
                                            onChange={(e) => setIssueDate(e.target.value)}
                                        />

                                        <DatePicker
                                            label="CDL Expiration Date *"
                                            value={cdlExpiry}
                                            onChange={(e) => setCdlExpiry(e.target.value)}
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <Input
                                                label="CDL Endorsements & Ratings"
                                                value={endorsements}
                                                onChange={(e) => setEndorsements(e.target.value)}
                                                placeholder="e.g. Tanker (N), HazMat (H), Doubles (T)"
                                            />
                                        </div>
                                    </div>

                                    {/* Document Uploads */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                                            CDL License Verification Documents (Front & Back) <span className="text-red-500 font-bold ml-0.5">*</span>
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            {/* CDL Front */}
                                            <button
                                                type="button"
                                                onClick={() => cdlFrontRef.current?.click()}
                                                className={`h-10 px-3 rounded-[3px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                                    cdlFrontPhoto || cdlFrontFile
                                                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                        : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <UploadCloud size={15} className={cdlFrontPhoto || cdlFrontFile ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                                    <span className="truncate">{cdlFrontPhoto || cdlFrontFile?.name ? `Front: ${cdlFrontPhoto || cdlFrontFile?.name}` : "Upload CDL Front *"}</span>
                                                </div>
                                                {(cdlFrontPhoto || cdlFrontFile) && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                            </button>

                                            {/* CDL Back */}
                                            <button
                                                type="button"
                                                onClick={() => cdlBackRef.current?.click()}
                                                className={`h-10 px-3 rounded-[3px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                                    cdlBackPhoto || cdlBackFile
                                                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                        : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 truncate">
                                                    <UploadCloud size={15} className={cdlBackPhoto || cdlBackFile ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                                    <span className="truncate">{cdlBackPhoto || cdlBackFile?.name ? `Back: ${cdlBackPhoto || cdlBackFile?.name}` : "Upload CDL Back *"}</span>
                                                </div>
                                                {(cdlBackPhoto || cdlBackFile) && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 2: DOT MEDICAL ── */}
                            {step === 2 && (
                                <div className="space-y-3.5 animate-in fade-in duration-150">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input
                                            label="DOT / NRCME Registry Number *"
                                            icon={<Briefcase size={14} className="text-[#FF4A1F]" />}
                                            value={dotRegistryNumber}
                                            onChange={(e) => setDotRegistryNumber(e.target.value)}
                                            placeholder="e.g. MC-IE-552091"
                                            required
                                        />

                                        <Input
                                            label="Certified Medical Examiner Name *"
                                            value={medicalExaminer}
                                            onChange={(e) => setMedicalExaminer(e.target.value)}
                                            placeholder="e.g. Dr. Conor O'Brien, MD"
                                            required
                                        />

                                        <DatePicker
                                            label="Physical Examination Date"
                                            value={examDate}
                                            onChange={(e) => setExamDate(e.target.value)}
                                        />

                                        <DatePicker
                                            label="DOT Medical Expiration Date *"
                                            value={dotExpiry}
                                            onChange={(e) => setDotExpiry(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Document Upload */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                                            Upload DOT Medical Certificate (PDF / Photo) <span className="text-red-500 font-bold ml-0.5">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => dotMedicalRef.current?.click()}
                                            className={`w-full h-10 px-3 rounded-[3px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                                dotMedicalPhoto || dotMedicalFile
                                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={15} className={dotMedicalPhoto || dotMedicalFile ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                                <span className="truncate">{dotMedicalPhoto || dotMedicalFile?.name ? `Medical: ${dotMedicalPhoto || dotMedicalFile?.name}` : "Upload DOT Medical Certificate (PDF / JPG) *"}</span>
                                            </div>
                                            {(dotMedicalPhoto || dotMedicalFile) && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 3: ASSIGNED VEHICLE & EQUIPMENT ── */}
                            {step === 3 && (
                                <div className="space-y-3.5 animate-in fade-in duration-150">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input
                                            label="Tractor Make & Model *"
                                            icon={<Truck size={14} className="text-[#FF4A1F]" />}
                                            value={tractorModel}
                                            onChange={(e) => setTractorModel(e.target.value)}
                                            placeholder="e.g. Volvo FH16 750 Globetrotter"
                                            required
                                        />

                                        <Input
                                            label="Power Unit Fleet Number *"
                                            value={unitNumber}
                                            onChange={(e) => setUnitNumber(e.target.value)}
                                            placeholder="e.g. TRK-7701"
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                                                Equipment / Trailer Type <span className="text-red-500 font-bold ml-0.5">*</span>
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

                                        {equipmentType === "Other" && (
                                            <div className="sm:col-span-2 animate-in fade-in duration-150">
                                                <Input
                                                    label="Custom Equipment / Trailer Specification *"
                                                    value={customEquipmentType}
                                                    onChange={(e) => setCustomEquipmentType(e.target.value)}
                                                    placeholder="Enter your custom trailer type"
                                                    required
                                                />
                                            </div>
                                        )}

                                        <Input
                                            label="Assigned Trailer Number *"
                                            value={trailerNumber}
                                            onChange={(e) => setTrailerNumber(e.target.value)}
                                            placeholder="e.g. TRL-9942"
                                            required
                                        />

                                        <Input
                                            label="Vehicle License Plate *"
                                            value={licensePlate}
                                            onChange={(e) => setLicensePlate(e.target.value)}
                                            placeholder="e.g. 231-D-45892"
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <Input
                                                label="Chassis 17-digit VIN *"
                                                value={vinNumber}
                                                onChange={(e) => setVinNumber(e.target.value)}
                                                placeholder="e.g. 1M8GDM9A2IE291038"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 4: FLEET INSURANCE ── */}
                            {step === 4 && (
                                <div className="space-y-3.5 animate-in fade-in duration-150">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Input
                                            label="Fleet Insurance Provider *"
                                            icon={<Shield size={14} className="text-[#FF4A1F]" />}
                                            value={insuranceProvider}
                                            onChange={(e) => setInsuranceProvider(e.target.value)}
                                            placeholder="e.g. Allianz Commercial Fleet Insurance"
                                            required
                                        />

                                        <Input
                                            label="Master Policy Number *"
                                            value={insurancePolicyNumber}
                                            onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                                            placeholder="e.g. ALZ-COMM-883920"
                                            required
                                        />

                                        <div className="sm:col-span-2">
                                            <DatePicker
                                                label="Policy Expiration / Renewal Date *"
                                                value={insuranceRenewalDate}
                                                onChange={(e) => setInsuranceRenewalDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* COI Document Upload */}
                                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                                            Upload Certificate of Insurance (COI Document) <span className="text-red-500 font-bold ml-0.5">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => insuranceRef.current?.click()}
                                            className={`w-full h-10 px-3 rounded-[3px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-semibold ${
                                                insurancePhoto || insuranceFile
                                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={15} className={insurancePhoto || insuranceFile ? "text-emerald-500" : "text-[#FF4A1F] shrink-0"} />
                                                <span className="truncate">{insurancePhoto || insuranceFile?.name ? `COI: ${insurancePhoto || insuranceFile?.name}` : "Upload Certificate of Insurance (PDF / Scan) *"}</span>
                                            </div>
                                            {(insurancePhoto || insuranceFile) && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── STEP 5: ADMIN APPROVAL SCREEN ── */}
                            {step === 5 && (
                                <div className="space-y-4 animate-in fade-in duration-200 py-1">
                                    {/* Status Hero Card */}
                                    <div className={`p-4 rounded-[6px] border ${
                                        isApproved
                                            ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                                            : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/90 dark:border-amber-800/80 text-amber-950 dark:text-amber-200"
                                    } flex items-start gap-3.5`}>
                                        <div className="p-2 rounded-full bg-white dark:bg-[#181a20] shadow-2xs shrink-0 mt-0.5">
                                            {isApproved ? (
                                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                            ) : (
                                                <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                                    {isApproved
                                                        ? "Compliance Verification Approved & Active"
                                                        : "Verification Submitted • Awaiting Fleet Admin Approval"}
                                                </h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    isApproved
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                                                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                                                }`}>
                                                    {isApproved ? "Verified Active" : "Status: Under Review"}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                                {isApproved
                                                    ? "Your commercial credentials, physical certificate, and vehicle records have been verified. You now have full access to load booking and digital BOL dispatch manifests."
                                                    : "Your commercial driver credentials, DOT examination, and equipment specifications have been submitted successfully. Our fleet safety team is reviewing your documents."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submitted Credentials Summary Card */}
                                    <div className="p-3.5 rounded-[6px] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151921] space-y-2">
                                        <h5 className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                            Submitted Verification Summary
                                        </h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 py-1">
                                                <span className="text-slate-500 dark:text-slate-400">CDL License:</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                                                    {cdlNumber || "DL-IE-98452107"} ({licenseClass || "Class A"})
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 py-1">
                                                <span className="text-slate-500 dark:text-slate-400">DOT Registry ID:</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                                                    {dotRegistryNumber || "MC-IE-552091"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 py-1">
                                                <span className="text-slate-500 dark:text-slate-400">Assigned Tractor:</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                                                    {tractorModel || "Volvo FH16"} (Unit: {unitNumber || "TRK-7701"})
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 py-1">
                                                <span className="text-slate-500 dark:text-slate-400">Master Insurance:</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                                                    {insuranceProvider || "Allianz Fleet"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estimated review notice */}
                                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 px-1">
                                        <AlertCircle size={14} className="text-amber-500 shrink-0" />
                                        <span>
                                            Verification typically takes 1 – 2 business hours. You will receive an alert as soon as verification completes.
                                        </span>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer Action Bar */}
                        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#151921] shrink-0 flex items-center justify-between gap-3">
                            {step < 5 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={step === 1 ? onClose : () => setStep((s) => (s - 1) as any)}
                                        className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                    >
                                        {step === 1 ? "Cancel" : "← Back"}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {!isCurrentStepValid && (
                                            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 hidden sm:inline-block">
                                                Fill required (*) fields to continue
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            disabled={!isCurrentStepValid || isSubmitting}
                                            onClick={handleNextStep}
                                            className={`px-5 py-1.5 rounded-[3px] text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 ${
                                                isCurrentStepValid && !isSubmitting
                                                    ? "bg-[#FF4A1F] hover:bg-[#E03E15] text-white cursor-pointer active:scale-[0.99]"
                                                    : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60"
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={13} className="animate-spin" />
                                                    <span>Submitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>
                                                        {step === 1
                                                            ? "Next: DOT Medical (2/5) →"
                                                            : step === 2
                                                            ? "Next: Assigned Vehicle (3/5) →"
                                                            : step === 3
                                                            ? "Next: Fleet Insurance (4/5) →"
                                                            : "Submit Verification for Approval"}
                                                    </span>
                                                    {step === 4 && <CheckCircle2 size={14} />}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-4 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                    >
                                        ← Review Submitted Steps
                                    </button>

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-1.5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[3px] text-xs font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.99]"
                                    >
                                        <span>Done / Return to Dashboard</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};
