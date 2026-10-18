import React from 'react';
import { PhoneCall, Building2 } from 'lucide-react';
import Input from '@/components/ui/input';

interface OverviewContactColumnProps {
    isEditMode: boolean;
    address: string;
    setAddress: (val: string) => void;
    homeTerminal: string;
    setHomeTerminal: (val: string) => void;
    emergencyContact: string;
    setEmergencyContact: (val: string) => void;
    emergencyPhone: string;
    setEmergencyPhone: (val: string) => void;
    relationship: string;
    setRelationship: (val: string) => void;
    slogan: string;
    setSlogan: (val: string) => void;
}

export const OverviewContactColumn: React.FC<OverviewContactColumnProps> = ({
    isEditMode,
    address,
    setAddress,
    homeTerminal,
    setHomeTerminal,
    emergencyContact,
    setEmergencyContact,
    emergencyPhone,
    setEmergencyPhone,
    relationship,
    setRelationship,
    slogan,
    setSlogan,
}) => {
    return (
        <div className="flex flex-col space-y-3 pt-4 lg:pt-0 lg:px-6">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5">
                    <PhoneCall size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Personal & Emergency Contact
                    </h3>
                </div>
                <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-[3px] flex items-center gap-1">
                    <Building2 size={10} />
                    <span>Contact Details</span>
                </span>
            </div>

            {/* Contact Key-Values */}
            <div className="space-y-2 text-xs">
                {/* Home Address */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Home Address</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. 742 Evergreen Terr, Springfield"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="text-slate-800 dark:text-slate-200 truncate" title={address}>
                            {address || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>


                {/* Emergency Contact Name */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Emergency Name</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {emergencyContact || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>

                {/* Emergency Contact Phone */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Emergency Phone</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={emergencyPhone}
                            onChange={(e) => setEmergencyPhone(e.target.value)}
                            placeholder="e.g. +1 (555) 999-1122"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-mono font-bold text-red-600 dark:text-red-400 truncate">
                            {emergencyPhone || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>

                {/* Emergency Relationship */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Relationship</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            placeholder="e.g. Spouse / Sibling"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {relationship || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>

                {/* Driver Bio / Notes */}
                <div className="grid grid-cols-[115px_14px_1fr] items-center min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Driver Bio</span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                    {isEditMode ? (
                        <Input
                            value={slogan}
                            onChange={(e) => setSlogan(e.target.value)}
                            placeholder="Short note or safety slogan"
                            className="h-7 text-xs"
                        />
                    ) : (
                        <span className="text-slate-800 dark:text-slate-200 truncate italic">
                            {slogan || <span className="text-slate-400 italic font-normal">Not added</span>}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
