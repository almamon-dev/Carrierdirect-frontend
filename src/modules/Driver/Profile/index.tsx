/**
 * Driver Profile Main Page
 * Layout driven by Global Sidebar navigation (via hash routes #general / #credentials).
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Loader2, RotateCcw, ShieldCheck, CheckCircle2
} from 'lucide-react';
import Button from '@/components/ui/button';
import { useDriverProfile } from './hooks/useDriverProfile';
import { OverviewSection } from './components/sections/OverviewSection';
import { CredentialsSection } from './components/sections/CredentialsSection';

export default function DriverProfilePage() {
    const { profile, isLoading, updateProfile, toggleDuty, reloadProfile } = useDriverProfile();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('general');

    // Sync active tab with URL hash
    useEffect(() => {
        if (location.hash === '#credentials') {
            setActiveTab('credentials');
        } else {
            setActiveTab('general');
        }
    }, [location.hash]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 size={32} className="animate-spin text-[#FF4A1F]" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 mx-auto bg-[#f8fafc] dark:bg-[#12161c] min-h-screen pb-16 font-sans antialiased w-full">
            {/* Flat Layout: Content Area based on Sub-menu selection */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-md shadow-sm w-full p-5 sm:p-6">
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
            
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-6">
                Driver Portal Version 2.4.1
            </div>
        </div>
    );
}
