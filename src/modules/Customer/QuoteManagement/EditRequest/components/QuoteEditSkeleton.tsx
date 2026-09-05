import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, ChevronRight } from 'lucide-react';
import {
    QuoteEditGeneralTabSkeleton,
    QuoteEditLocationsTabSkeleton,
    QuoteEditOtherTabSkeleton,
} from './QuoteEditSkeletonTabs';

interface QuoteEditSkeletonProps {
    activeTab?: string;
}

const EDIT_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export const QuoteEditSkeleton: React.FC<QuoteEditSkeletonProps> = ({ activeTab = 'general' }) => {
    return (
        <div className="p-4 md:p-6 mx-auto bg-[#f8f9fa] dark:bg-[#12161b] min-h-screen pb-24 animate-in fade-in duration-200 font-sans antialiased">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 dark:text-slate-100">Edit Quote Request</h1>
                    <p className="text-[13px] font-medium text-[#ff4a1f] mt-0.5">Update the required information to modify the request.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-[34px] w-36 rounded-md" />
                    <Skeleton className="h-[34px] w-28 rounded-md" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Edit Sections</h3>
                    </div>
                    <div className="flex flex-col">
                        {EDIT_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <div
                                    key={tab.id}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 ${
                                        isSelected
                                            ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                                            : 'border-l-transparent text-slate-600 dark:text-slate-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        <span>{tab.label}</span>
                                    </div>
                                    {isSelected && <ChevronRight size={14} className="text-[#ff4a1f]" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs w-full p-5 md:p-6 space-y-6">
                    {activeTab === 'general' && <QuoteEditGeneralTabSkeleton />}
                    {activeTab === 'locations' && <QuoteEditLocationsTabSkeleton />}
                    {activeTab !== 'general' && activeTab !== 'locations' && <QuoteEditOtherTabSkeleton />}
                </div>
            </div>
        </div>
    );
};
