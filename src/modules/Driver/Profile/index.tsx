import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    Loader2, User, ShieldCheck
} from 'lucide-react';
import { useDriverProfile } from './hooks/useDriverProfile';
import { OverviewSection } from './components/sections/OverviewSection';
import { CredentialsSection } from './components/sections/CredentialsSection';

export default function DriverProfilePage() {
    const { profile, isLoading, updateProfile, toggleDuty } = useDriverProfile();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'general' | 'credentials'>('general');

    // Sync active tab with URL hash
    useEffect(() => {
        if (location.hash === '#credentials') {
            setActiveTab('credentials');
        } else {
            setActiveTab('general');
        }
    }, [location.hash]);

    const handleTabChange = (tab: 'general' | 'credentials') => {
        setActiveTab(tab);
        navigate(`/driver/profile#${tab}`, { replace: true });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3 font-sans">
                <Loader2 size={32} className="animate-spin text-[#FF4A1F]" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading driver profile...</span>
            </div>
        );
    }

    return (
        <div className="p-2.5 sm:p-4 mx-auto bg-[#f8fafc] dark:bg-[#12161c] h-auto pb-12 font-sans antialiased w-full space-y-4">
            {/* Pill Tabs Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-[#1e2329] rounded-[6px] w-fit shadow-2xs">
                <button
                    type="button"
                    onClick={() => handleTabChange('general')}
                    className={`h-8 px-3.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-[4px] transition-all cursor-pointer ${
                        activeTab === 'general'
                            ? 'bg-white dark:bg-[#12161c] text-[#FF4A1F] shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <User size={13} />
                    <span>General Information</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleTabChange('credentials')}
                    className={`h-8 px-3.5 inline-flex items-center gap-1.5 text-xs font-bold rounded-[4px] transition-all cursor-pointer ${
                        activeTab === 'credentials'
                            ? 'bg-white dark:bg-[#12161c] text-[#FF4A1F] shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                    <ShieldCheck size={13} />
                    <span>Credentials & Compliance</span>
                </button>
            </div>

            {/* Tab Content Panels */}
            <div className="w-full">
                {activeTab === 'general' && (
                    <OverviewSection
                        profile={profile}
                        onUpdateAvatar={async (newAvatar) => {
                            await updateProfile({ avatar: newAvatar });
                        }}
                        onUpdateProfile={async (updates) => {
                            await updateProfile(updates);
                        }}
                        onToggleDuty={async (status) => {
                            await toggleDuty(status);
                        }}
                    />
                )}

                {activeTab === 'credentials' && (
                    <CredentialsSection
                        profile={profile}
                    />
                )}
            </div>
            
            <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-4">
                CarrierDirect Driver Portal • Compliant Dispatch Hub
            </div>
        </div>
    );
}
