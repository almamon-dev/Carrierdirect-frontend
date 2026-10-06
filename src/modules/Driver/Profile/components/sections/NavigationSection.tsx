import React, { useState } from 'react';
import { Navigation, MapPin, Check, Save } from 'lucide-react';
import { DriverProfile } from '../../../types';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import TabHeader from '@/components/ui/tab-header';

interface Props {
    profile: DriverProfile;
    onSave: (updates: Partial<DriverProfile>) => Promise<any>;
}

const NAV_APPS: { id: DriverProfile['preferences']['navigationApp']; name: string }[] = [
    { id: 'Google Truck GPS', name: 'Google Maps Truck Navigation' },
    { id: 'Waze', name: 'Waze Commercial Fleet' },
    { id: 'HERE WeGo', name: 'HERE WeGo Truck Commercial' },
    { id: 'Apple Maps', name: 'Apple Maps Navigation' },
];

const KeyValueItem = ({ 
    label, 
    value, 
    isMono = false,
    action
}: { 
    label: string; 
    value: React.ReactNode; 
    isMono?: boolean;
    action?: React.ReactNode;
}) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-36 sm:w-48 shrink-0 text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            <span className="text-slate-300 dark:text-slate-600 font-bold select-none">:</span>
            <span className={`truncate ${isMono ? 'font-mono' : ''} font-semibold text-slate-800 dark:text-slate-200`}>
                {value}
            </span>
        </div>
        {action && <div className="shrink-0">{action}</div>}
    </div>
);

export const NavigationSection: React.FC<Props> = ({ profile, onSave }) => {
    const [selectedApp, setSelectedApp] = useState<DriverProfile['preferences']['navigationApp']>(
        profile.preferences?.navigationApp || 'Google Truck GPS'
    );
    const [avoidTolls, setAvoidTolls] = useState(false);
    const [avoidLowClearance, setAvoidLowClearance] = useState(true);
    const [offlineMaps, setOfflineMaps] = useState(profile.preferences?.offlineMaps ?? true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                preferences: {
                    ...profile.preferences,
                    navigationApp: selectedApp,
                    offlineMaps,
                },
            });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            <TabHeader title="Navigation & Commercial Routing" icon={Navigation} />

            {/* 1. App Preference & Specifications */}
            <div className="space-y-1">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        GPS Application & Telematics Profile
                    </h3>
                    <span className="text-xs font-semibold text-[#ff4a1f]">
                        {selectedApp}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0.5">
                    <KeyValueItem 
                        label="Primary Truck GPS App" 
                        value={
                            <div className="w-48">
                                <Select
                                    value={selectedApp}
                                    onChange={(e) => setSelectedApp((e?.target?.value ?? e) as any)}
                                    size="sm"
                                    showSearch={false}
                                >
                                    {NAV_APPS.map(app => (
                                        <option key={app.id} value={app.id}>{app.name}</option>
                                    ))}
                                </Select>
                            </div>
                        }
                    />

                    <KeyValueItem 
                        label="Bridge Height Profile" 
                        value="13'6'' Standard Semi Clearance" 
                    />

                    <KeyValueItem 
                        label="Weight Class Limit" 
                        value="80,000 lbs Gross Interstate" 
                    />

                    <KeyValueItem 
                        label="Weigh Station PrePass" 
                        value="Active Electronic Bypass" 
                    />

                    <KeyValueItem 
                        label="Live Traffic Guidance" 
                        value="Enabled (Dynamic Rerouting)" 
                    />

                    <KeyValueItem 
                        label="HazMat Routing Mode" 
                        value="FMCSA Approved Commercial Lanes" 
                    />
                </div>
            </div>

            {/* 2. Routing Rules Checklist */}
            <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between pb-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Commercial Routing Preferences
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <label className="flex items-center justify-between py-2 px-2.5 rounded-[3px] bg-slate-50/70 dark:bg-[#161a22] border border-slate-100 dark:border-slate-800 cursor-pointer text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Strict Low Clearance Avoidance
                        </span>
                        <input
                            type="checkbox"
                            checked={avoidLowClearance}
                            onChange={(e) => setAvoidLowClearance(e.target.checked)}
                            className="w-4 h-4 text-[#ff4a1f] rounded accent-[#ff4a1f] cursor-pointer ml-2"
                        />
                    </label>

                    <label className="flex items-center justify-between py-2 px-2.5 rounded-[3px] bg-slate-50/70 dark:bg-[#161a22] border border-slate-100 dark:border-slate-800 cursor-pointer text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Avoid Tolls (if &lt;15% extra time)
                        </span>
                        <input
                            type="checkbox"
                            checked={avoidTolls}
                            onChange={(e) => setAvoidTolls(e.target.checked)}
                            className="w-4 h-4 text-[#ff4a1f] rounded accent-[#ff4a1f] cursor-pointer ml-2"
                        />
                    </label>

                    <label className="flex items-center justify-between py-2 px-2.5 rounded-[3px] bg-slate-50/70 dark:bg-[#161a22] border border-slate-100 dark:border-slate-800 cursor-pointer text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Offline Interstate Map Caching
                        </span>
                        <input
                            type="checkbox"
                            checked={offlineMaps}
                            onChange={(e) => setOfflineMaps(e.target.checked)}
                            className="w-4 h-4 text-[#ff4a1f] rounded accent-[#ff4a1f] cursor-pointer ml-2"
                        />
                    </label>

                    <label className="flex items-center justify-between py-2 px-2.5 rounded-[3px] bg-slate-50/70 dark:bg-[#161a22] border border-slate-100 dark:border-slate-800 cursor-pointer text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            Rest Stop & Scale Alerts
                        </span>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            className="w-4 h-4 text-[#ff4a1f] rounded accent-[#ff4a1f] cursor-pointer ml-2"
                        />
                    </label>
                </div>
            </div>

            {/* Save Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {saveSuccess ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <Check size={14} />
                        <span>Navigation preferences updated!</span>
                    </span>
                ) : <span />}

                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-8.5 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[3px] flex items-center gap-1.5 cursor-pointer shadow-2xs ml-auto"
                >
                    <Save size={13} />
                    <span>{isSaving ? 'Saving...' : 'Save Navigation Preferences'}</span>
                </Button>
            </div>
        </div>
    );
};
