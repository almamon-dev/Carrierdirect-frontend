import React, { useState } from 'react';
import {
    ArrowRight,
    Briefcase,
    Calendar,
    Check,
    CheckCircle2,
    CreditCard,
    Shield,
    UploadCloud,
    X,
    FileText,
    Truck,
    ShieldCheck
} from 'lucide-react';
import { DriverComplianceData } from './useDriverCompliance';

interface Props {
    isOpen: boolean;
    initialData?: DriverComplianceData;
    onClose: () => void;
    onComplete: (data: Partial<DriverComplianceData>) => void;
}

export const DriverComplianceModal: React.FC<Props> = ({
    isOpen,
    initialData,
    onClose,
    onComplete,
}) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Form state - Step 1: CDL
    const [cdlNumber, setCdlNumber] = useState(initialData?.cdlNumber || 'DL-4587-NY');
    const [licenseClass, setLicenseClass] = useState(initialData?.licenseClass || 'Class A');
    const [stateOfIssue, setStateOfIssue] = useState(initialData?.stateOfIssue || 'New York');
    const [issueDate, setIssueDate] = useState(initialData?.issueDate || 'Jan 01, 2025');
    const [cdlExpiry, setCdlExpiry] = useState(initialData?.cdlExpiry || 'Dec 31, 2028');
    const [endorsements, setEndorsements] = useState(initialData?.endorsements || 'Air Brakes, Tanker, HazMat');
    const [cdlFrontPhoto, setCdlFrontPhoto] = useState<string | null>(initialData?.cdlFrontPhoto || '/documents/drivers/DRV-9872/cdl-front.pdf');
    const [cdlBackPhoto, setCdlBackPhoto] = useState<string | null>(initialData?.cdlBackPhoto || '/documents/drivers/DRV-9872/cdl-back.pdf');

    // Form state - Step 2: DOT Medical
    const [dotRegistryNumber, setDotRegistryNumber] = useState(initialData?.dotRegistryNumber || '#88924018');
    const [medicalExaminer, setMedicalExaminer] = useState(initialData?.medicalExaminer || 'Dr. Robert Hayes');
    const [examDate, setExamDate] = useState(initialData?.examDate || 'Jan 10, 2025');
    const [dotExpiry, setDotExpiry] = useState(initialData?.dotExpiry || 'Jan 10, 2026');
    const [dotMedicalPhoto, setDotMedicalPhoto] = useState<string | null>(initialData?.dotMedicalPhoto || '/documents/drivers/DRV-9872/medical-certificate.pdf');
    const [mcsaForm, setMcsaForm] = useState(initialData?.mcsaForm || 'MCSA-5876');
    const [mcsaFormPhoto, setMcsaFormPhoto] = useState<string | null>(initialData?.mcsaFormPhoto || '/documents/drivers/DRV-9872/mcsa-5876.pdf');

    // Form state - Step 3: Insurance & Fleet
    const [tractorModel, setTractorModel] = useState(initialData?.tractorModel || 'Freightliner Cascadia');
    const [unitNumber, setUnitNumber] = useState(initialData?.unitNumber || 'TRK-559');
    const [licensePlate, setLicensePlate] = useState(initialData?.licensePlate || 'ABC-987654');
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState(initialData?.insurancePolicyNumber || 'INS-POL-49201');
    const [insuranceRenewalDate, setInsuranceRenewalDate] = useState(initialData?.insuranceRenewalDate || '12/31/2026');
    const [insurancePhoto, setInsurancePhoto] = useState<string | null>(initialData?.insurancePhoto || '/documents/fleet/TRK-559/insurance.pdf');

    if (!isOpen) return null;

    const handleFileSimulate = (setter: (val: string) => void, defaultPath: string) => {
        setter(defaultPath);
    };

    const handleNextStep = () => {
        if (step === 1) setStep(2);
        else if (step === 2) setStep(3);
        else if (step === 3) {
            onComplete({
                cdlNumber,
                licenseClass,
                stateOfIssue,
                issueDate,
                cdlExpiry,
                endorsements,
                cdlFrontPhoto,
                cdlBackPhoto,
                dotRegistryNumber,
                medicalExaminer,
                examDate,
                dotExpiry,
                dotMedicalPhoto,
                mcsaForm,
                mcsaFormPhoto,
                tractorModel,
                unitNumber,
                licensePlate,
                insurancePolicyNumber,
                insuranceRenewalDate,
                insurancePhoto,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300 p-0">
            {/* Backdrop click dismiss */}
            <div className="fixed inset-0" onClick={onClose} />

            {/* 100% Full-Width Bottom Sheet Container */}
            <div className="bg-white dark:bg-[#1e2329] rounded-t-3xl border-t border-slate-200/90 dark:border-slate-800 w-full shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 ease-out flex flex-col max-h-[90vh] relative z-10">
                {/* Top Drag Handle (Centered) */}
                <div className="pt-3.5 pb-1 flex justify-center">
                    <div className="w-16 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
                </div>

                {/* Close X Button at Top-Right Corner */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-6 sm:right-8 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-20"
                    title="Close"
                >
                    <X size={22} />
                </button>

                {/* Header Container */}
                <div className="px-6 pt-1 pb-4 text-center relative border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            Driver Compliance Verification
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Step {step} of 3 • Required for Shipments & Active Fleet Dispatch
                        </p>

                        {/* Stepper Navigation Progress Bar */}
                        <div className="flex items-center justify-center gap-2 sm:gap-6 mt-3.5 px-2">
                            {/* 1. CDL License */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        step > 1
                                            ? 'bg-emerald-600 text-white'
                                            : step === 1
                                                ? 'bg-[#FF4A1F] text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    {step > 1 ? <Check size={16} strokeWidth={2.5} /> : <CreditCard size={16} />}
                                </div>
                                <span className="text-[10.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                                    CDL License
                                </span>
                            </div>

                            {/* Connector 1 */}
                            <div
                                className={`w-12 sm:w-20 h-[2px] mb-4 transition-colors ${
                                    step > 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                            />

                            {/* 2. DOT Med Card */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        step > 2
                                            ? 'bg-emerald-600 text-white'
                                            : step === 2
                                                ? 'bg-[#FF4A1F] text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    {step > 2 ? <Check size={16} strokeWidth={2.5} /> : <Briefcase size={16} />}
                                </div>
                                <span className="text-[10.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                                    DOT Med Card
                                </span>
                            </div>

                            {/* Connector 2 */}
                            <div
                                className={`w-12 sm:w-20 h-[2px] mb-4 transition-colors ${
                                    step > 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                            />

                            {/* 3. Insurance & Fleet */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        step === 3
                                            ? 'bg-[#FF4A1F] text-white shadow-xs'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}
                                >
                                    <Shield size={16} />
                                </div>
                                <span className="text-[10.5px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                                    Fleet Insurance
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Content - Scrollable */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-sans text-xs">
                    <div className="max-w-2xl mx-auto space-y-4">
                        {/* ── STEP 1: CDL LICENSE ── */}
                        {step === 1 && (
                            <div className="space-y-3.5 animate-in fade-in duration-150">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Step 1: Commercial Driver License (CDL-A)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Enter your valid CDL license specifications and upload scans of both sides.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {/* CDL Number */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            CDL License Number
                                        </label>
                                        <div className="relative">
                                            <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={cdlNumber}
                                                onChange={(e) => setCdlNumber(e.target.value)}
                                                placeholder="DL-4587-NY"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>

                                    {/* License Class */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            License Class
                                        </label>
                                        <input
                                            type="text"
                                            value={licenseClass}
                                            onChange={(e) => setLicenseClass(e.target.value)}
                                            placeholder="Class A"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                        />
                                    </div>

                                    {/* State of Issue */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            State of Issue
                                        </label>
                                        <input
                                            type="text"
                                            value={stateOfIssue}
                                            onChange={(e) => setStateOfIssue(e.target.value)}
                                            placeholder="New York"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                        />
                                    </div>

                                    {/* Expiration Date */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Expiration Date
                                        </label>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={cdlExpiry}
                                                onChange={(e) => setCdlExpiry(e.target.value)}
                                                placeholder="Dec 31, 2028"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>

                                    {/* Endorsements */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Endorsements
                                        </label>
                                        <input
                                            type="text"
                                            value={endorsements}
                                            onChange={(e) => setEndorsements(e.target.value)}
                                            placeholder="Air Brakes, Tanker, HazMat"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                        />
                                    </div>
                                </div>

                                {/* Photo Uploads */}
                                <div className="pt-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Upload License Documents (PDF / Scans)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleFileSimulate(setCdlFrontPhoto, '/documents/drivers/DRV-9872/cdl-front.pdf')}
                                            className={`py-3 px-3 rounded-[4px] border border-dashed flex items-center justify-between gap-1.5 transition-colors cursor-pointer text-xs font-bold ${
                                                cdlFrontPhoto
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={16} className={cdlFrontPhoto ? 'text-emerald-500' : 'text-[#FF4A1F]'} />
                                                <span className="truncate">{cdlFrontPhoto ? 'CDL Front: Attached' : 'Upload CDL Front'}</span>
                                            </div>
                                            {cdlFrontPhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleFileSimulate(setCdlBackPhoto, '/documents/drivers/DRV-9872/cdl-back.pdf')}
                                            className={`py-3 px-3 rounded-[4px] border border-dashed flex items-center justify-between gap-1.5 transition-colors cursor-pointer text-xs font-bold ${
                                                cdlBackPhoto
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={16} className={cdlBackPhoto ? 'text-emerald-500' : 'text-[#FF4A1F]'} />
                                                <span className="truncate">{cdlBackPhoto ? 'CDL Back: Attached' : 'Upload CDL Back'}</span>
                                            </div>
                                            {cdlBackPhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: DOT MEDICAL CERTIFICATE ── */}
                        {step === 2 && (
                            <div className="space-y-3.5 animate-in fade-in duration-150">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Step 2: DOT Medical Examiner's Certificate
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Provide your NRCME registry ID, medical examiner, and physical certificate copy.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {/* DOT Registry */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            NRCME Registry ID
                                        </label>
                                        <div className="relative">
                                            <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={dotRegistryNumber}
                                                onChange={(e) => setDotRegistryNumber(e.target.value)}
                                                placeholder="#88924018"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>

                                    {/* Medical Examiner */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Medical Examiner Name
                                        </label>
                                        <input
                                            type="text"
                                            value={medicalExaminer}
                                            onChange={(e) => setMedicalExaminer(e.target.value)}
                                            placeholder="Dr. Robert Hayes"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                        />
                                    </div>

                                    {/* Exam Date */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Exam Date
                                        </label>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={examDate}
                                                onChange={(e) => setExamDate(e.target.value)}
                                                placeholder="Jan 10, 2025"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>

                                    {/* Medical Card Expiry */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Card Expiry Date
                                        </label>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={dotExpiry}
                                                onChange={(e) => setDotExpiry(e.target.value)}
                                                placeholder="Jan 10, 2026"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>

                                    {/* FMCSA Physical Form */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            FMCSA Physical Form Type
                                        </label>
                                        <input
                                            type="text"
                                            value={mcsaForm}
                                            onChange={(e) => setMcsaForm(e.target.value)}
                                            placeholder="MCSA-5876"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                        />
                                    </div>
                                </div>

                                {/* Upload DOT Certificate & Form */}
                                <div className="pt-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Upload Medical Certificate & MCSA-5876 (PDF Documents)
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleFileSimulate(setDotMedicalPhoto, '/documents/drivers/DRV-9872/medical-certificate.pdf')}
                                            className={`py-3 px-3 rounded-[4px] border border-dashed flex items-center justify-between gap-1.5 transition-colors cursor-pointer text-xs font-bold ${
                                                dotMedicalPhoto
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={16} className={dotMedicalPhoto ? 'text-emerald-500' : 'text-[#FF4A1F]'} />
                                                <span className="truncate">{dotMedicalPhoto ? 'Medical Card: Attached' : 'Upload Medical Certificate'}</span>
                                            </div>
                                            {dotMedicalPhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleFileSimulate(setMcsaFormPhoto, '/documents/drivers/DRV-9872/mcsa-5876.pdf')}
                                            className={`py-3 px-3 rounded-[4px] border border-dashed flex items-center justify-between gap-1.5 transition-colors cursor-pointer text-xs font-bold ${
                                                mcsaFormPhoto
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <UploadCloud size={16} className={mcsaFormPhoto ? 'text-emerald-500' : 'text-[#FF4A1F]'} />
                                                <span className="truncate">{mcsaFormPhoto ? 'Form MCSA-5876: Attached' : 'Upload MCSA-5876'}</span>
                                            </div>
                                            {mcsaFormPhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 3: CARRIER INSURANCE & FLEET ── */}
                        {step === 3 && (
                            <div className="space-y-3.5 animate-in fade-in duration-150">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                        Step 3: Commercial Carrier Insurance & Assigned Fleet
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Verify power unit equipment specifications and commercial cargo policy.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    {/* Tractor Model */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Assigned Tractor Model
                                        </label>
                                        <div className="relative">
                                            <Truck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={tractorModel}
                                                onChange={(e) => setTractorModel(e.target.value)}
                                                placeholder="Freightliner Cascadia"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>

                                    {/* Unit Number */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Power Unit Number
                                        </label>
                                        <input
                                            type="text"
                                            value={unitNumber}
                                            onChange={(e) => setUnitNumber(e.target.value)}
                                            placeholder="TRK-559"
                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                        />
                                    </div>

                                    {/* Policy Number */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Insurance Policy Number
                                        </label>
                                        <div className="relative">
                                            <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={insurancePolicyNumber}
                                                onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                                                placeholder="INS-POL-49201"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>

                                    {/* Policy Renewal Date */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Policy Renewal Date
                                        </label>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#FF4A1F]" />
                                            <input
                                                type="text"
                                                value={insuranceRenewalDate}
                                                onChange={(e) => setInsuranceRenewalDate(e.target.value)}
                                                placeholder="12/31/2026"
                                                className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Insurance Certificate */}
                                <div className="pt-1">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Upload Certificate of Insurance (PDF Document)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleFileSimulate(setInsurancePhoto, '/documents/fleet/TRK-559/insurance.pdf')}
                                        className={`w-full py-3 px-3 rounded-[4px] border border-dashed flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-bold ${
                                            insurancePhoto
                                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-slate-50 dark:bg-[#161a22] border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <UploadCloud size={16} className={insurancePhoto ? 'text-emerald-500' : 'text-[#FF4A1F]'} />
                                            <span className="truncate">{insurancePhoto ? 'Insurance Certificate: Attached' : 'Upload Carrier Insurance Document'}</span>
                                        </div>
                                        {insurancePhoto && <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#161a22] shrink-0">
                    <div className="max-w-2xl mx-auto flex items-center gap-3">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep((prev) => (prev - 1) as any)}
                                className="w-1/3 py-2.5 px-4 bg-white dark:bg-[#1e2329] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                            >
                                Back
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={handleNextStep}
                            className="flex-1 py-2.5 px-4 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-[4px] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                        >
                            <span>
                                {step === 1
                                    ? 'Next Step (2/3)'
                                    : step === 2
                                        ? 'Next Step (3/3)'
                                        : 'Complete & Unlock'}
                            </span>
                            {step === 3 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
