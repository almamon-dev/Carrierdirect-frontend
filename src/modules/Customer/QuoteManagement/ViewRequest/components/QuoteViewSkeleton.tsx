import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, ChevronRight } from 'lucide-react';
import {
    QuoteViewGeneralTabSkeleton,
    QuoteViewLocationsTabSkeleton,
    QuoteViewOtherTabSkeleton,
} from './QuoteViewSkeletonTabs';

interface QuoteViewSkeletonProps {
    activeTab?: string;
}

const VIEW_TABS = [
    { id: 'general', label: 'Basic Information', icon: FileText },
    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
    { id: 'load', label: 'Load & Services', icon: Truck },
    { id: 'preferences', label: 'Budget & Preferences', icon: Euro },
    { id: 'files', label: 'Attachments & Notes', icon: Paperclip },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle2 },
];

export const QuoteViewSkeleton: React.FC<QuoteViewSkeletonProps> = ({ activeTab = 'general' }) => {
    return (
        <div className="p-6 md:p-8 mx-auto bg-[#f8f9fa] min-h-screen pb-24 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">View Quote Request</h1>
                    <p className="text-[14px] font-medium text-brand mt-1">Review the details of your quote request.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-[32px] w-20 rounded-[2px]" />
                    <Skeleton className="h-[32px] w-28 rounded-[2px]" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-[13px] font-bold text-slate-800">Categories</h3>
                    </div>
                    <div className="flex flex-col">
                        {VIEW_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <div
                                    key={tab.id}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[14px] font-medium border-l-[3px] border-b border-slate-50 last:border-b-0 ${
                                        isSelected
                                            ? 'border-l-indigo-600 bg-brand-light/50 text-indigo-700'
                                            : 'border-l-transparent text-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-brand' : 'text-slate-400'} />
                                        <span>{tab.label}</span>
                                    </div>
                                    {isSelected && <ChevronRight size={15} className="text-brand" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-sm w-full">
                    <div className="p-6 md:p-8">
                        {activeTab === 'general' && <QuoteViewGeneralTabSkeleton />}
                        {activeTab === 'locations' && <QuoteViewLocationsTabSkeleton />}
                        {activeTab !== 'general' && activeTab !== 'locations' && <QuoteViewOtherTabSkeleton />}
                    </div>
                </div>
            </div>
        </div>
    );
};
