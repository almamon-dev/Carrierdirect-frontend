import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Truck } from "lucide-react";
import React from "react";
import { EXPERIENCE_OPTIONS, LICENSE_CLASS_OPTIONS } from "./complianceConstants";

interface ComplianceStepExperienceProps {
    experienceYears: string;
    setExperienceYears: (val: string) => void;
    licenseClass: string;
    setLicenseClass: (val: string) => void;
    endorsements: string;
    setEndorsements: (val: string) => void;
    vehicleTypes: string;
    setVehicleTypes: (val: string) => void;
    errors: { [key: string]: string };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const ComplianceStepExperience: React.FC<ComplianceStepExperienceProps> = ({
    experienceYears,
    setExperienceYears,
    licenseClass,
    setLicenseClass,
    endorsements,
    setEndorsements,
    vehicleTypes,
    setVehicleTypes,
    errors,
    setErrors,
}) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60 flex items-center justify-center text-[#FF4A1F] shrink-0 mt-0.5">
                    <Truck size={20} />
                </div>
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Driver Experience & License Details
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Specify your driving qualifications, CDL class, and experience.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Years of Driving Experience <span className="text-[#FF4A1F]">*</span>
                    </label>
                    <Select
                        value={experienceYears}
                        onChange={(val: any) => {
                            const raw = typeof val === 'object' && val !== null ? (val.value ?? val.id ?? val.target?.value) : val;
                            setExperienceYears(String(raw ?? ''));
                            if (errors.experienceYears) {
                                setErrors((prev) => ({ ...prev, experienceYears: "" }));
                            }
                        }}
                        options={EXPERIENCE_OPTIONS}
                        placeholder="Select years"
                        error={errors.experienceYears}
                        triggerClassName="rounded-[4px] h-9 text-xs"
                        className="w-full text-xs"
                    />
                    {errors.experienceYears && (
                        <span className="text-[12px] text-[#d82c0d] mt-1 block font-sans font-normal">
                            {errors.experienceYears}
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        License Class <span className="text-[#FF4A1F]">*</span>
                    </label>
                    <Select
                        value={licenseClass}
                        onChange={(val: any) => {
                            const raw = typeof val === 'object' && val !== null ? (val.value ?? val.id ?? val.target?.value) : val;
                            setLicenseClass(String(raw ?? ''));
                            if (errors.licenseClass) {
                                setErrors((prev) => ({ ...prev, licenseClass: "" }));
                            }
                        }}
                        options={LICENSE_CLASS_OPTIONS}
                        placeholder="Select license class"
                        error={errors.licenseClass}
                        triggerClassName="rounded-[4px] h-9 text-xs"
                        className="w-full text-xs"
                    />
                    {errors.licenseClass && (
                        <span className="text-[12px] text-[#d82c0d] mt-1 block font-sans font-normal">
                            {errors.licenseClass}
                        </span>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Endorsements (Optional)
                    </label>
                    <Input
                        value={endorsements}
                        onChange={(e) => setEndorsements(e.target.value)}
                        placeholder="e.g. Tanker (N), HazMat (H), Doubles (T)"
                        className="h-9 text-xs rounded-[4px]"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Vehicle Types Experienced With (Optional)
                    </label>
                    <Input
                        value={vehicleTypes}
                        onChange={(e) => setVehicleTypes(e.target.value)}
                        placeholder="e.g. Semi-trailer, Flatbed, Box truck"
                        className="h-9 text-xs rounded-[4px]"
                    />
                </div>
            </div>
        </div>
    );
};
