import React from 'react';
import { Search, Truck, Loader2 } from 'lucide-react';
import { useDriverShipments } from './hooks/useDriverShipments';
import { ShipmentFilterTabs } from './components/ShipmentFilterTabs';
import { ShipmentCard } from './components/ShipmentCard';

export default function DriverShipmentsPage() {
    const {
        shipments,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        counts,
        isLoading,
    } = useDriverShipments();

    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#FF4A1F] flex items-center justify-center shrink-0">
                        <Truck size={18} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-900 dark:text-white">
                            Assigned Freight Loads
                        </h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Manage trips, verify route waypoints, update delivery milestones, and upload POD documents.
                        </p>
                    </div>
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search order #, city, customer..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700/80 rounded-[4px] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FF4A1F]"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <ShipmentFilterTabs
                activeTab={activeTab}
                counts={counts}
                onTabChange={setActiveTab}
            />

            {/* Shipment List */}
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 size={28} className="animate-spin text-[#FF4A1F]" />
                </div>
            ) : shipments.length === 0 ? (
                <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 p-8 text-center space-y-2">
                    <Truck size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Shipments Found</h3>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                        No loads match your current filter. When the dispatcher assigns you new freight, it will appear here immediately.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {shipments.map((shipment) => (
                        <ShipmentCard key={shipment.id} shipment={shipment} />
                    ))}
                </div>
            )}
        </div>
    );
}
