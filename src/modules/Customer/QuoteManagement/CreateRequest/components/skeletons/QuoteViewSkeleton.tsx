import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { 
    FileText, MapPin, Truck, Euro, Paperclip, CheckCircle2, ChevronRight, Activity 
} from 'lucide-react';

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
            {/* Header - Identical to View.tsx */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900">View Quote Request</h1>
                        <p className="text-[14px] font-medium text-brand mt-1">Review the details of your quote request.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-[32px] w-20 rounded-md" />
                    <Skeleton className="h-[32px] w-28 rounded-md" />
                </div>
            </div>

            {/* Layout: Sidebar + Main Content - Identical structure to View.tsx */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                
                {/* Left Sidebar Navigation */}
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

                {/* Right Main Content Area - Identical padding & gaps to View.tsx */}
                <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-sm w-full">
                    <div className="p-6 md:p-8">
                        
                        {/* 1. Basic Information Tab Skeleton */}
                        {activeTab === 'general' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    {/* Section Title */}
                                    <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                                        <FileText size={18} className="text-brand" />
                                        <span>Basic Information</span>
                                    </div>

                                    {/* ViewFields */}
                                    <div className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start">
                                        <p className="text-[14px] text-slate-500 font-medium">Request Title</p>
                                        <p className="text-[14px] text-slate-400">:</p>
                                        <Skeleton className="h-5 w-3/4 rounded" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start">
                                        <p className="text-[14px] text-slate-500 font-medium">Request Number</p>
                                        <p className="text-[14px] text-slate-400">:</p>
                                        <Skeleton className="h-5 w-24 rounded" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start">
                                        <p className="text-[14px] text-slate-500 font-medium">Priority</p>
                                        <p className="text-[14px] text-slate-400">:</p>
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start">
                                        <p className="text-[14px] text-slate-500 font-medium">Shipment Type</p>
                                        <p className="text-[14px] text-slate-400">:</p>
                                        <Skeleton className="h-5 w-24 rounded" />
                                    </div>

                                    <div className="grid grid-cols-[160px_10px_1fr] items-start">
                                        <p className="text-[14px] text-slate-500 font-medium">Service Type</p>
                                        <p className="text-[14px] text-slate-400">:</p>
                                        <Skeleton className="h-5 w-24 rounded" />
                                    </div>

                                    {/* Schedule Section */}
                                    <div className="col-span-1 md:col-span-2 mt-4 pt-3 border-t border-slate-100 mb-2">
                                        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                                            <Activity size={16} className="text-slate-400" /> Schedule
                                        </h3>
                                    </div>

                                    {['Pickup Date', 'Pickup Time', 'Delivery Date', 'Delivery Time', 'Transit Time (Days)'].map((label) => (
                                        <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start">
                                            <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                                            <p className="text-[14px] text-slate-400">:</p>
                                            <Skeleton className="h-5 w-28 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Locations Tab Skeleton */}
                        {activeTab === 'locations' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                                        <MapPin size={18} className="text-brand" />
                                        <span>Location Information</span>
                                    </div>

                                    {/* Pickup Info */}
                                    <div className="col-span-1 md:col-span-2 border-b border-slate-100 pb-5 mb-2">
                                        <h3 className="text-[13px] font-bold text-brand mb-4 flex items-center gap-2">
                                            <MapPin size={16} /> Pickup Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                            {['Company Name', 'Contact Person', 'Phone Number', 'Email', 'Country', 'State/Division', 'City', 'ZIP Code'].map(label => (
                                                <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start">
                                                    <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                                                    <p className="text-[14px] text-slate-400">:</p>
                                                    <Skeleton className="h-5 w-32 rounded" />
                                                </div>
                                            ))}
                                            <div className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start">
                                                <p className="text-[14px] text-slate-500 font-medium">Full Address</p>
                                                <p className="text-[14px] text-slate-400">:</p>
                                                <Skeleton className="h-5 w-full rounded" />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start">
                                                <p className="text-[14px] text-slate-500 font-medium">Google Map URL</p>
                                                <p className="text-[14px] text-slate-400">:</p>
                                                <Skeleton className="h-5 w-48 rounded" />
                                            </div>
                                            <div className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start">
                                                <p className="text-[14px] text-slate-500 font-medium">Instructions</p>
                                                <p className="text-[14px] text-slate-400">:</p>
                                                <Skeleton className="h-12 w-full rounded" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="col-span-1 md:col-span-2">
                                        <h3 className="text-[13px] font-bold text-emerald-600 mb-4 flex items-center gap-2">
                                            <MapPin size={16} /> Delivery Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                            {['Company Name', 'Contact Person', 'Phone Number', 'Email', 'Country', 'State/Division', 'City', 'ZIP Code'].map(label => (
                                                <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start">
                                                    <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                                                    <p className="text-[14px] text-slate-400">:</p>
                                                    <Skeleton className="h-5 w-32 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. Load & Services Tab Skeleton */}
                        {activeTab === 'load' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                                        <Truck size={18} className="text-brand" />
                                        <span>Load & Cargo Specifications</span>
                                    </div>
                                    {['Vehicle Type', 'Load Type', 'Items Count', 'Pallets Count', 'Weight', 'Volume'].map(label => (
                                        <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start">
                                            <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                                            <p className="text-[14px] text-slate-400">:</p>
                                            <Skeleton className="h-5 w-28 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 4. Budget & Preferences Tab Skeleton */}
                        {activeTab === 'preferences' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                                        <Euro size={18} className="text-brand" />
                                        <span>Budget & Bidding Preferences</span>
                                    </div>
                                    {['Target Budget', 'Currency', 'Negotiation Allowed', 'Multiple Quotes', 'Expiration Time'].map(label => (
                                        <div key={label} className="grid grid-cols-[160px_10px_1fr] items-start">
                                            <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                                            <p className="text-[14px] text-slate-400">:</p>
                                            <Skeleton className="h-5 w-28 rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. Attachments & Notes Tab Skeleton */}
                        {activeTab === 'files' && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    <div className="col-span-1 md:col-span-2 pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                                        <Paperclip size={18} className="text-brand" />
                                        <span>Notes & References</span>
                                    </div>
                                    {['Customer Notes', 'Special Instructions', 'Internal Reference'].map(label => (
                                        <div key={label} className="col-span-1 md:col-span-2 grid grid-cols-[160px_10px_1fr] items-start">
                                            <p className="text-[14px] text-slate-500 font-medium">{label}</p>
                                            <p className="text-[14px] text-slate-400">:</p>
                                            <Skeleton className="h-10 w-full rounded" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 6. Review & Submit Tab Skeleton */}
                        {activeTab === 'review' && (
                            <div className="space-y-3">
                                <div className="pb-2 mb-2 border-b border-slate-100 flex items-center gap-2 text-base font-bold text-slate-800">
                                    <CheckCircle2 size={18} className="text-brand" />
                                    <span>Review Summary</span>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                                    <Skeleton className="h-6 w-60 rounded" />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Skeleton className="h-20 w-full rounded" />
                                        <Skeleton className="h-20 w-full rounded" />
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};
