import React, { useState, useRef, useEffect } from "react";
import {
    Shield,
    CheckCircle2,
    Calendar,
    Briefcase,
    Tag,
    Edit3,
    FileText,
    UploadCloud,
    Hash,
    Save,
    X,
    Clock,
    AlertTriangle,
} from "lucide-react";
import { DriverProfile } from "../../../types";
import { driverApi } from "../../../services/driverApi";
import TabHeader from "@/components/ui/tab-header";
import { DocumentPreviewModal } from "../DocumentPreviewModal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";

interface Props {
    profile: DriverProfile;
}

const formatDate = (val?: string | null): string => {
    if (!val) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
        return d.toISOString().split("T")[0];
    }
    return val;
};

const licenseClassOptions = [
    { value: "Class A", label: "Class A - Heavy Tractor-Trailer combinations" },
    { value: "Class B", label: "Class B - Straight Truck & Heavy Single Vehicle" },
    { value: "Class C", label: "Class C - Hazardous / Passenger Transport" },
];

export const CredentialsSection: React.FC<Props> = ({ profile }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form inputs state
    const [cdlNumber, setCdlNumber] = useState("");
    const [stateOfIssue, setStateOfIssue] = useState("");
    const [licenseClass, setLicenseClass] = useState("Class A");
    const [issueDate, setIssueDate] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [endorsements, setEndorsements] = useState("");

    const [nrcmeId, setNrcmeId] = useState("");
    const [medicalExaminer, setMedicalExaminer] = useState("");
    const [examDate, setExamDate] = useState("");
    const [dotExpiry, setDotExpiry] = useState("");
    const [mcsaForm, setMcsaForm] = useState("MCSA-5876");

    const [insuranceProvider, setInsuranceProvider] = useState("");
    const [policyNumber, setPolicyNumber] = useState("");
    const [insuranceEffectiveDate, setInsuranceEffectiveDate] = useState("");
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState("");

    // Files state
    const [cdlFrontFile, setCdlFrontFile] = useState<File | null>(null);
    const [cdlBackFile, setCdlBackFile] = useState<File | null>(null);
    const [medicalFile, setMedicalFile] = useState<File | null>(null);
    const [mcsaFile, setMcsaFile] = useState<File | null>(null);
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

    const cdlFrontRef = useRef<HTMLInputElement>(null);
    const cdlBackRef = useRef<HTMLInputElement>(null);
    const medicalDocRef = useRef<HTMLInputElement>(null);
    const mcsaDocRef = useRef<HTMLInputElement>(null);
    const insuranceDocRef = useRef<HTMLInputElement>(null);

    const [previewDoc, setPreviewDoc] = useState<{
        isOpen: boolean;
        title: string;
        fileUrl?: string;
        fileType?: string;
    }>({
        isOpen: false,
        title: "",
    });

    const syncWithProfile = () => {
        const cdl = profile.cdlDetails || ({} as any);
        const dot = profile.dotMedical || ({} as any);
        const fleet = profile.fleetEquipment || ({} as any);

        setCdlNumber(cdl.cdlNumber || "");
        setLicenseClass(cdl.licenseClass || "Class A");
        setStateOfIssue(cdl.stateOfIssue || "");
        setIssueDate(formatDate(cdl.issueDate));
        setExpirationDate(formatDate(cdl.expirationDate));
        setEndorsements(cdl.endorsements || "");

        setNrcmeId(dot.nrcmeRegistryId || "");
        setMedicalExaminer(dot.medicalExaminer || "");
        setExamDate(formatDate(dot.examDate));
        setDotExpiry(formatDate(dot.expiryDate));
        setMcsaForm(dot.mcsaForm || "MCSA-5876");

        setInsuranceProvider(fleet.insuranceProvider || "");
        setPolicyNumber(fleet.insurancePolicyNumber || "");
        setInsuranceEffectiveDate(formatDate(fleet.insuranceEffectiveDate));
        setInsuranceExpiryDate(formatDate(fleet.insuranceExpiryDate));

        setCdlFrontFile(null);
        setCdlBackFile(null);
        setMedicalFile(null);
        setMcsaFile(null);
        setInsuranceFile(null);
    };

    useEffect(() => {
        syncWithProfile();
    }, [profile]);

    const openDocPreview = (title: string, fileUrl?: string, fileType?: string) => {
        if (!fileUrl) return;
        setPreviewDoc({
            isOpen: true,
            title,
            fileUrl,
            fileType: fileType || "Document PDF / Scan",
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("driver_license_number", cdlNumber);
            formData.append("driver_license_state", stateOfIssue);
            formData.append(
                "driver_license_class",
                licenseClass === "Class A"
                    ? "class_a"
                    : licenseClass === "Class B"
                    ? "class_b"
                    : licenseClass === "Class C"
                    ? "class_c"
                    : "standard"
            );
            if (issueDate) formData.append("license_issue_date", issueDate);
            if (expirationDate) formData.append("license_expiry_date", expirationDate);
            if (nrcmeId) formData.append("medical_card_number", nrcmeId);
            if (medicalExaminer) formData.append("medical_examiner", medicalExaminer);
            if (examDate) formData.append("medical_exam_date", examDate);
            if (dotExpiry) formData.append("medical_card_expiry_date", dotExpiry);
            if (mcsaForm) formData.append("mcsa_form", mcsaForm);

            if (cdlFrontFile) formData.append("license_document", cdlFrontFile);
            if (cdlBackFile) formData.append("license_back_document", cdlBackFile);
            if (medicalFile) formData.append("medical_card_document", medicalFile);
            if (mcsaFile) formData.append("mcsa_document", mcsaFile);

            await driverApi.updateCredentials(formData);

            const equipFormData = new FormData();
            equipFormData.append("insurance_provider", insuranceProvider);
            equipFormData.append("insurance_policy_number", policyNumber);
            equipFormData.append("insurance_effective_date", insuranceEffectiveDate);
            equipFormData.append("insurance_expiry_date", insuranceExpiryDate);
            if (insuranceFile) equipFormData.append("insurance_document", insuranceFile);
            await driverApi.updateEquipment(equipFormData);

            if (endorsements) {
                await driverApi.updateEmergency({
                    endorsements: endorsements.split(",").map((s) => s.trim()).filter(Boolean),
                });
            }

            setIsEditMode(false);
        } catch (err) {
            console.error("Failed to update credentials:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        syncWithProfile();
        setIsEditMode(false);
    };

    const cdl = profile.cdlDetails || ({} as any);
    const dot = profile.dotMedical || ({} as any);
    const isVerified = Boolean(profile.isVerified);
    const isUnderReview = profile.verificationStatus === "under_review";
    const isRejected = profile.verificationStatus === "rejected";

    return (
        <div className="space-y-3 font-sans animate-in fade-in duration-200">
            {/* Hidden File Upload Inputs */}
            <input
                type="file"
                ref={cdlFrontRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setCdlFrontFile(f);
                }}
            />
            <input
                type="file"
                ref={cdlBackRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setCdlBackFile(f);
                }}
            />
            <input
                type="file"
                ref={medicalDocRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setMedicalFile(f);
                }}
            />
            <input
                type="file"
                ref={mcsaDocRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setMcsaFile(f);
                }}
            />
            <input
                type="file"
                ref={insuranceDocRef}
                className="hidden"
                accept=".pdf,image/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setInsuranceFile(f);
                }}
            />

            {/* Header & Verification Status Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <TabHeader title="Credentials & Compliance Dossier" icon={Shield} />

                <div className="flex items-center gap-2">
                    {/* Live Badge */}
                    {isVerified ? (
                        <span className="h-7 px-2.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-[3px] border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs">
                            <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                            <span>FMCSA Compliant</span>
                        </span>
                    ) : isUnderReview ? (
                        <span className="h-7 px-2.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-[3px] border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 shadow-2xs">
                            <Clock size={12} className="text-amber-600 animate-spin-slow" />
                            <span>Verification Under Review</span>
                        </span>
                    ) : isRejected ? (
                        <span className="h-7 px-2.5 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 rounded-[3px] border border-rose-200 dark:border-rose-800 flex items-center gap-1.5 shadow-2xs">
                            <AlertTriangle size={12} className="text-rose-600" />
                            <span>Revision Requested</span>
                        </span>
                    ) : (
                        <span className="h-7 px-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>Pending Setup</span>
                        </span>
                    )}

                    {!isEditMode ? (
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setIsEditMode(true)}
                            className="h-7 px-3 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                            <Edit3 size={12} />
                            <span>Edit Credentials</span>
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="h-7 px-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <X size={12} />
                                <span>Cancel</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="h-7 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-[3px] shadow-2xs flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                <Save size={12} />
                                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* 1. Commercial Driver License (CDL) Card */}
                    <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-[#FF4A1F]" />
                                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                    Commercial Driver License (CDL)
                                </h3>
                            </div>
                            <span className="h-6.5 px-2 text-[10.5px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 rounded-[3px] border border-blue-200 dark:border-blue-800 inline-flex items-center gap-1 shrink-0">
                                <CheckCircle2 size={10.5} className="text-blue-600" />
                                <span>{cdl.licenseClass || "Class A"}</span>
                            </span>
                        </div>

                        <div className="p-3.5 space-y-2 text-xs flex-1">
                            {/* License Number */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">License #</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={cdlNumber}
                                        onChange={(e) => setCdlNumber(e.target.value)}
                                        placeholder="e.g. CDL-894210"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {cdlNumber || "—"}
                                    </span>
                                )}
                            </div>

                            {/* State */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Issue State</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={stateOfIssue}
                                        onChange={(e) => setStateOfIssue(e.target.value)}
                                        placeholder="e.g. TX / CA"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {stateOfIssue || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Class */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Class</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Select
                                        value={licenseClass}
                                        onChange={(val) => {
                                            const selectedVal = typeof val === "object" ? (val?.value ?? val?.target?.value ?? "") : (val || "");
                                            setLicenseClass(selectedVal);
                                        }}
                                        options={licenseClassOptions}
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {licenseClass || "Class A"}
                                    </span>
                                )}
                            </div>

                            {/* Expiration Date */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Expiration</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <DatePicker
                                        value={expirationDate}
                                        onChange={(e) => setExpirationDate(e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {expirationDate || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Endorsements */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Endorsements</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={endorsements}
                                        onChange={(e) => setEndorsements(e.target.value)}
                                        placeholder="e.g. HazMat (H), Tanker (N)"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                        {endorsements || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Documents (Front & Back) */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">License Doc</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => cdlFrontRef.current?.click()}
                                                className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 border border-blue-200/60 rounded-[3px] cursor-pointer"
                                            >
                                                <UploadCloud size={11} />
                                                <span>{cdlFrontFile ? cdlFrontFile.name : "Front Doc"}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => cdlBackRef.current?.click()}
                                                className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 border border-slate-200 rounded-[3px] cursor-pointer"
                                            >
                                                <UploadCloud size={11} />
                                                <span>{cdlBackFile ? cdlBackFile.name : "Back Doc"}</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => openDocPreview("Commercial Driver License (CDL)", cdl.cdlFrontUrl || "/documents/cdl-front.pdf")}
                                            className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 border border-blue-200/60 rounded-[3px] transition-colors cursor-pointer"
                                        >
                                            <FileText size={11} className="text-blue-600" />
                                            <span>View Attachment</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. DOT Medical Card Card */}
                    <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                            <div className="flex items-center gap-2">
                                <Briefcase size={14} className="text-[#FF4A1F]" />
                                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                    DOT Medical Certificate
                                </h3>
                            </div>
                            <span className="h-6.5 px-2 text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-[3px] border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1 shrink-0">
                                <CheckCircle2 size={10.5} className="text-emerald-600" />
                                <span>NRCME Active</span>
                            </span>
                        </div>

                        <div className="p-3.5 space-y-2 text-xs flex-1">
                            {/* NRCME ID */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">NRCME ID</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={nrcmeId}
                                        onChange={(e) => setNrcmeId(e.target.value)}
                                        placeholder="e.g. 5646456456"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {nrcmeId || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Medical Examiner */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Examiner</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={medicalExaminer}
                                        onChange={(e) => setMedicalExaminer(e.target.value)}
                                        placeholder="e.g. Dr. Jane Smith, MD"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {medicalExaminer || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Exam Date */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Exam Date</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <DatePicker
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {examDate || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Medical Expiry */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Card Expiry</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <DatePicker
                                        value={dotExpiry}
                                        onChange={(e) => setDotExpiry(e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {dotExpiry || "—"}
                                    </span>
                                )}
                            </div>

                            {/* MCSA Form */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">MCSA Form</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={mcsaForm}
                                        onChange={(e) => setMcsaForm(e.target.value)}
                                        placeholder="e.g. MCSA-5876"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                        {mcsaForm || "MCSA-5876"}
                                    </span>
                                )}
                            </div>

                            {/* Documents */}
                            <div className="grid grid-cols-[105px_14px_1fr] items-center min-w-0 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Medical Doc</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                <div>
                                    {isEditMode ? (
                                        <button
                                            type="button"
                                            onClick={() => medicalDocRef.current?.click()}
                                            className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/60 rounded-[3px] cursor-pointer"
                                        >
                                            <UploadCloud size={11} />
                                            <span>{medicalFile ? medicalFile.name : "Choose Medical Doc"}</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => openDocPreview("DOT Medical Certificate (MCSA-5876)", dot.certificateUrl || "/documents/medical-card.pdf")}
                                            className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/60 rounded-[3px] transition-colors cursor-pointer"
                                        >
                                            <FileText size={11} className="text-emerald-600" />
                                            <span>View Attachment</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Commercial Insurance Policy Card */}
                    <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                        <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-[#FF4A1F]" />
                                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                                    Commercial Fleet & Auto Liability
                                </h3>
                            </div>
                            <span className="h-6.5 px-2 text-[10.5px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 rounded-[3px] border border-purple-200 dark:border-purple-800 inline-flex items-center gap-1 shrink-0">
                                <CheckCircle2 size={10.5} className="text-purple-600" />
                                <span>Active Policy</span>
                            </span>
                        </div>

                        <div className="p-3.5 space-y-2 text-xs flex-1">
                            {/* Provider */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Provider</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={insuranceProvider}
                                        onChange={(e) => setInsuranceProvider(e.target.value)}
                                        placeholder="e.g. Progressive Commercial"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                        {insuranceProvider || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Policy Number */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Policy Number</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <Input
                                        value={policyNumber}
                                        onChange={(e) => setPolicyNumber(e.target.value)}
                                        placeholder="e.g. POL-984018"
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-mono font-bold text-purple-700 dark:text-purple-400 truncate">
                                        {policyNumber || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Expiration Date */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Policy Expiry</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                {isEditMode ? (
                                    <DatePicker
                                        value={insuranceExpiryDate}
                                        onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                                        className="h-7 text-xs"
                                    />
                                ) : (
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {insuranceExpiryDate || "—"}
                                    </span>
                                )}
                            </div>

                            {/* Coverage */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Coverage</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Commercial Auto Liability & Cargo</span>
                            </div>

                            {/* Policy Document */}
                            <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Policy Doc</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                <div>
                                    {isEditMode ? (
                                        <button
                                            type="button"
                                            onClick={() => insuranceDocRef.current?.click()}
                                            className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 border border-purple-200/60 rounded-[3px] cursor-pointer"
                                        >
                                            <UploadCloud size={11} />
                                            <span>{insuranceFile ? insuranceFile.name : "Choose Policy Doc"}</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => openDocPreview("Fleet Insurance Certificate", profile.fleetEquipment?.insuranceCertificateUrl || "/documents/insurance-policy.pdf")}
                                            className="h-6.5 px-2 inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 border border-purple-200/60 rounded-[3px] transition-colors cursor-pointer"
                                        >
                                            <FileText size={11} className="text-purple-600" />
                                            <span>View Attachment</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                isOpen={previewDoc.isOpen}
                onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
                title={previewDoc.title}
                fileUrl={previewDoc.fileUrl}
                fileType={previewDoc.fileType}
            />
        </div>
    );
};

export default CredentialsSection;
