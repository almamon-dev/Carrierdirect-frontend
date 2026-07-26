import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { 
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, ChevronRight, Save 
} from 'lucide-react';

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
        <div className="p-6 md:p-8 mx-auto bg-[#f8f9fa] min-h-screen pb-24 animate-in fade-in duration-200">
            {/* Header - Identical to Edit.tsx */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900">Edit Quote Request</h1>
                        <p className="text-[14px] font-medium text-brand mt-1">Update the required information to modify the request.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-[32px] w-20 rounded-md" />
                    <Skeleton className="h-[32px] w-32 rounded-md" />
                </div>
            </div>

            {/* Layout: Sidebar + Main Form Content Area */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* Left Sidebar Navigation */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-[13px] font-bold text-slate-800">Categories</h3>
                    </div>
                    <div className="flex flex-col">
                        {EDIT_TABS.map((tab) => {
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

                {/* Right Main Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-sm w-full">
                    <div className="p-6 md:p-8 space-y-6">
                        
                        {/* 1. Basic Information Tab Skeleton */}
                        {activeTab === 'general' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                                        <FileText size={18} className="text-brand" />
                                        <span>Basic Information</span>
                                    </div>

                                    <div className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                        <p className="text-[14px] text-slate-700 font-medium mt-2">Request Title</p>
                                        <p className="text-[14px] text-slate-400 mt-2">:</p>
                                        <Skeleton className="h-9 w-full rounded-md" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                        <p className="text-[14px] text-slate-700 font-medium mt-2">Request Number</p>
                                        <p className="text-[14px] text-slate-400 mt-2">:</p>
                                        <Skeleton className="h-9 w-full rounded-md" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                        <p className="text-[14px] text-slate-700 font-medium mt-2">Priority</p>
                                        <p className="text-[14px] text-slate-400 mt-2">:</p>
                                        <Skeleton className="h-9 w-full rounded-md" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                        <p className="text-[14px] text-slate-700 font-medium mt-2">Shipment Type</p>
                                        <p className="text-[14px] text-slate-400 mt-2">:</p>
                                        <Skeleton className="h-9 w-full rounded-md" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                        <p className="text-[14px] text-slate-700 font-medium mt-2">Service Type</p>
                                        <p className="text-[14px] text-slate-400 mt-2">:</p>
                                        <Skeleton className="h-9 w-full rounded-md" />
                                    </div>

                                    {/* Schedule Section */}
                                    <div className="col-span-1 md:col-span-2 mt-4 pt-3 border-t border-slate-100 mb-2">
                                        <h3 className="text-[13px] font-bold text-slate-800">Schedule</h3>
                                    </div>

                                    {['Pickup Date', 'Pickup Time', 'Delivery Date', 'Delivery Time', 'Transit Time (Days)'].map((label) => (
                                        <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                            <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                                            <p className="text-[14px] text-slate-400 mt-2">:</p>
                                            <Skeleton className="h-9 w-full rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Locations Tab Skeleton */}
                        {activeTab === 'locations' && (
                            <div className="space-y-6">
                                <div className="border-b border-slate-100 pb-6">
                                    <h3 className="text-[13px] font-bold text-brand mb-4 flex items-center gap-2">
                                        <MapPin size={16} /> Pickup Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        {['Company Name', 'Contact Person', 'Phone Number', 'Email', 'Country', 'State/Division', 'City', 'ZIP Code'].map(label => (
                                            <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                                <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                                                <p className="text-[14px] text-slate-400 mt-2">:</p>
                                                <Skeleton className="h-9 w-full rounded-md" />
                                            </div>
                                        ))}
                                        <div className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                            <p className="text-[14px] text-slate-700 font-medium mt-2">Full Address</p>
                                            <p className="text-[14px] text-slate-400 mt-2">:</p>
                                            <Skeleton className="h-16 w-full rounded-md" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[13px] font-bold text-emerald-600 mb-4 flex items-center gap-2">
                                        <MapPin size={16} /> Delivery Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        {['Company Name', 'Contact Person', 'Phone Number', 'Email', 'Country', 'State/Division', 'City', 'ZIP Code'].map(label => (
                                            <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                                <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                                                <p className="text-[14px] text-slate-400 mt-2">:</p>
                                                <Skeleton className="h-9 w-full rounded-md" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Load & Services Tab Skeleton */}
                        {activeTab === 'load' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    {['Vehicle Type', 'Load Type', 'Items Count', 'Pallets Count', 'Weight', 'Volume'].map(label => (
                                        <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                            <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                                            <p className="text-[14px] text-slate-400 mt-2">:</p>
                                            <Skeleton className="h-9 w-full rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Budget & Preferences Tab Skeleton */}
                        {activeTab === 'preferences' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                {['Target Budget', 'Currency', 'Negotiation Allowed', 'Multiple Quotes', 'Expiration Time'].map(label => (
                                    <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                        <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                                        <p className="text-[14px] text-slate-400 mt-2">:</p>
                                        <Skeleton className="h-9 w-full rounded-md" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 5. Attachments & Notes Tab Skeleton */}
                        {activeTab === 'files' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                    {['Customer Notes', 'Special Instructions', 'Internal Reference'].map(label => (
                                        <div key={label} className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start gap-3">
                                            <p className="text-[14px] text-slate-700 font-medium mt-2">{label}</p>
                                            <p className="text-[14px] text-slate-400 mt-2">:</p>
                                            <Skeleton className="h-16 w-full rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 6. Review & Submit Tab Skeleton */}
                        {activeTab === 'review' && (
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-4">
                                    <Skeleton className="h-6 w-60 rounded" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Skeleton className="h-24 w-full rounded-md" />
                                        <Skeleton className="h-24 w-full rounded-md" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Action Footer */}
                        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                            <Skeleton className="h-9 w-20 rounded-md" />
                            <div className="flex gap-3">
                                <Skeleton className="h-9 w-28 rounded-md" />
                                <Skeleton className="h-9 w-32 rounded-md" />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
