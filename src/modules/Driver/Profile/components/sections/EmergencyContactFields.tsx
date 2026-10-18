import React from 'react';

interface EmergencyContactFieldsProps {
    emergencyName: string;
    setEmergencyName: (val: string) => void;
    emergencyRelationship: string;
    setEmergencyRelationship: (val: string) => void;
    emergencyPhone: string;
    setEmergencyPhone: (val: string) => void;
}

export const EmergencyContactFields: React.FC<EmergencyContactFieldsProps> = ({
    emergencyName,
    setEmergencyName,
    emergencyRelationship,
    setEmergencyRelationship,
    emergencyPhone,
    setEmergencyPhone,
}) => {
    return (
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Emergency Contact Person
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                        Contact Name
                    </label>
                    <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                        placeholder="Contact Person"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                        Relationship
                    </label>
                    <input
                        type="text"
                        value={emergencyRelationship}
                        onChange={(e) => setEmergencyRelationship(e.target.value)}
                        className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                        placeholder="Spouse / Family"
                    />
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                        Emergency Phone
                    </label>
                    <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="w-full h-9 px-3 text-xs bg-slate-50/70 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-900 dark:text-white focus:outline-none focus:border-[#ff4a1f]"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>
            </div>
        </div>
    );
};
