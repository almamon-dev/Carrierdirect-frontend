import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, RefreshCw } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import { useDriverShipments } from './hooks/useDriverShipments';
import { getShipmentColumns } from './components/columns';
import { ShipmentFilterTabs, DriverShipmentFilterTab } from './components/ShipmentFilterTabs';
import { TableFilterContent } from './components/TableFilterContent';
import { ShipmentRowActions } from './components/ShipmentRowActions';
import { DriverShipmentInfiniteGrid } from './components/DriverShipmentInfiniteGrid';
import { ShipmentItem } from '../types';

export default function DriverShipmentsPage() {
    const navigate = useNavigate();
    const {
        allShipments,
        isLoading,
        reload,
    } = useDriverShipments();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<DriverShipmentFilterTab>('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [freightTypeFilter, setFreightTypeFilter] = useState('all');

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await reload();
        } finally {
            setTimeout(() => setIsRefreshing(false), 300);
        }
    };

    const handleResetFilters = () => {
        setStatusFilter('all');
        setPriorityFilter('all');
        setFreightTypeFilter('all');
    };

    // Filter shipments based on tab and advanced dropdown filters
    const filteredShipments = useMemo(() => {
        return allShipments.filter((item: ShipmentItem) => {
            // 1. Tab Filter
            if (activeTab === 'in_transit' && item.status !== 'in_transit') return false;
            if (activeTab === 'at_pickup' && item.status !== 'at_pickup') return false;
            if (activeTab === 'at_delivery' && item.status !== 'at_delivery') return false;
            if (activeTab === 'assigned' && item.status !== 'assigned' && item.status !== 'accepted') return false;
            if (activeTab === 'delivered' && item.status !== 'delivered') return false;

            // 2. Dropdown Status Filter
            if (statusFilter !== 'all') {
                if (statusFilter === 'assigned' && (item.status !== 'assigned' && item.status !== 'accepted')) return false;
                if (statusFilter !== 'assigned' && item.status !== statusFilter) return false;
            }

            // 3. Dropdown Priority Filter
            if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;

            // 4. Dropdown Freight Type Filter
            if (freightTypeFilter !== 'all') {
                if (freightTypeFilter === 'Hazardous / ADR' && !item.cargo.hazardous) return false;
                if (freightTypeFilter !== 'Hazardous / ADR' && !item.cargo.freightType.toLowerCase().includes(freightTypeFilter.toLowerCase())) return false;
            }

            return true;
        });
    }, [allShipments, activeTab, statusFilter, priorityFilter, freightTypeFilter]);

    const columns = useMemo(() => getShipmentColumns(navigate), [navigate]);

    return (
        <div className="p-3 sm:p-4 md:p-5 w-full mx-auto space-y-3.5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header: Title & Quick Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Assigned Loads
                    </h1>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Live route tracking, delivery schedule, and milestone status management.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing || isLoading}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:border-[#ff4a1f] dark:hover:border-[#ff4a1f] hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-slate-700 dark:text-slate-200 rounded-[3px] shadow-2xs transition-colors"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f] shrink-0" : "text-slate-500 shrink-0"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {/* Standard Professional Data Table with Header Tabs, Filters, Table/Grid toggle */}
            <DataTable
                data={filteredShipments}
                columns={columns}
                actions={(row) => <ShipmentRowActions row={row} />}
                onRowClick={(row) => navigate(`/driver/shipments/${row.id}`)}
                headerTabs={
                    <ShipmentFilterTabs
                        shipments={allShipments}
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                    />
                }
                filterContent={
                    <TableFilterContent
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        priorityFilter={priorityFilter}
                        setPriorityFilter={setPriorityFilter}
                        freightTypeFilter={freightTypeFilter}
                        setFreightTypeFilter={setFreightTypeFilter}
                        onResetFilters={handleResetFilters}
                    />
                }
                keyExtractor={(item) => item.id}
                searchPlaceholder="Search by load #, tracking, shipper, consignee, city..."
                compact={true}
                hideViewToggle={false}
                renderGridView={(gridProps) => (
                    <DriverShipmentInfiniteGrid
                        shipments={gridProps.allData || gridProps.data}
                        isLoading={isLoading || isRefreshing}
                        emptyState={gridProps.emptyState}
                    />
                )}
                isLoading={isLoading || isRefreshing}
                tableLayout="auto"
                tableClassName="w-full min-w-[980px]"
                emptyState={
                    <EmptyState
                        icon={Truck}
                        title={
                            statusFilter !== 'all' || priorityFilter !== 'all' || freightTypeFilter !== 'all'
                                ? "No Shipments Matching Filters"
                                : activeTab === 'all'
                                ? "No Assigned Loads Found"
                                : `No Loads in "${activeTab.replace('_', ' ').toUpperCase()}"`
                        }
                        description={
                            statusFilter !== 'all' || priorityFilter !== 'all' || freightTypeFilter !== 'all'
                                ? "Try adjusting or resetting your filter criteria to view assigned shipments."
                                : activeTab === 'all'
                                ? "There are currently no active freight loads assigned to your driver profile. New dispatches will appear here automatically."
                                : `There are no shipments currently matching the "${activeTab.replace('_', ' ')}" status.`
                        }
                    />
                }
            />
        </div>
    );
}
