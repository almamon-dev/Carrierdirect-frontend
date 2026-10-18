import GooglePlacesAutocompleteInput, { LocationData } from "@/components/GooglePlacesAutocompleteInput";
import Input from "@/components/ui/input";
import PhoneInput from "@/components/ui/phone-input";
import { Camera, MapPin, User as UserIcon } from "lucide-react";
import React from "react";

interface ComplianceStepPersonalProps {
    fullName: string;
    setFullName: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    currentLocation: string;
    setCurrentLocation: (val: string) => void;
    setLatitude: (val: number | string | null) => void;
    setLongitude: (val: number | string | null) => void;
    avatarPreview: string | null;
    avatarInputRef: React.RefObject<HTMLInputElement | null>;
    onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: { [key: string]: string };
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const ComplianceStepPersonal: React.FC<ComplianceStepPersonalProps> = ({
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
    onAvatarChange,
    errors,
    setErrors,
}) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60 flex items-center justify-center text-[#FF4A1F] shrink-0 mt-0.5">
                    <UserIcon size={20} />
                </div>
                <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Personal Information
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Provide your basic contact information and profile details.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Avatar upload */}
                <div className="flex flex-col items-center shrink-0">
                    <div
                        onClick={() => avatarInputRef.current?.click()}
                        className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center relative cursor-pointer group hover:border-[#FF4A1F]/50 transition-colors"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                <UserIcon size={34} />
                            </div>
                        )}

                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                            <Camera size={14} />
                        </div>
                    </div>
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onAvatarChange}
                    />
                    <span className="text-[10px] text-slate-400 mt-1.5">Profile Photo</span>
                </div>

                {/* Inputs */}
                <div className="flex-1 w-full space-y-3.5">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Full Name <span className="text-[#FF4A1F]">*</span>
                        </label>
                        <Input
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (errors.fullName && e.target.value.trim()) {
                                    setErrors((prev) => ({ ...prev, fullName: "" }));
                                }
                            }}
                            placeholder="Enter your full name"
                            className="h-9 text-xs rounded-[4px]"
                            error={errors.fullName}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Phone Number <span className="text-[#FF4A1F]">*</span>
                        </label>
                        <PhoneInput
                            value={phone}
                            onChange={(e: any) => {
                                const val = e?.target?.value !== undefined ? e.target.value : (typeof e === "string" ? e : "");
                                setPhone(val);
                                if (errors.phone && val.trim()) {
                                    setErrors((prev) => ({ ...prev, phone: "" }));
                                }
                            }}
                            defaultCountry="BD"
                            placeholder="e.g. 1768-085606"
                            className="text-xs"
                            error={errors.phone}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Current Location <span className="text-[#FF4A1F]">*</span>
                            </label>
                            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                <MapPin size={11} className="text-[#FF4A1F]" />
                                Google Map
                            </span>
                        </div>
                        <GooglePlacesAutocompleteInput
                            name="currentLocation"
                            value={currentLocation}
                            onChange={(e) => {
                                setCurrentLocation(e.target.value);
                                if (errors.currentLocation && e.target.value.trim()) {
                                    setErrors((prev) => ({ ...prev, currentLocation: "" }));
                                }
                            }}
                            onLocationSelect={(data: LocationData) => {
                                if (data.address) {
                                    setCurrentLocation(data.address);
                                    if (data.lat != null) setLatitude(data.lat);
                                    if (data.lng != null) setLongitude(data.lng);
                                    if (errors.currentLocation) {
                                        setErrors((prev) => ({ ...prev, currentLocation: "" }));
                                    }
                                }
                            }}
                            placeholder="City, State, Country or Zip Code"
                            className="h-9 text-xs rounded-[4px]"
                            error={errors.currentLocation}
                            dropdownPosition="top"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
