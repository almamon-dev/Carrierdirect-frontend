import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab') as DriverShipmentFilterTab;
    const [activeTab, setActiveTab] = useState<DriverShipmentFilterTab>(
        tabFromUrl && ['all', 'new', 'awaiting_review', 'completed'].includes(tabFromUrl) ? tabFromUrl : 'all'
    );

    const handleSelectTab = (tab: DriverShipmentFilterTab) => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams);
        if (tab === 'all') {
            params.delete('tab');
        } else {
            params.set('tab', tab);
        }
        setSearchParams(params, { replace: true });
    };
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
            if (activeTab === 'new' && !['assigned', 'accepted', 'at_pickup', 'in_transit', 'at_delivery'].includes(item.status)) return false;
            if (activeTab === 'awaiting_review' && item.status !== 'delivered') return false;
            if (activeTab === 'completed' && item.status !== 'completed') return false;

            // 2. Dropdown Status Filter
            if (statusFilter !== 'all') {
                if (statusFilter === 'new' && !['assigned', 'accepted', 'at_pickup', 'in_transit', 'at_delivery'].includes(item.status)) return false;
                if (statusFilter === 'awaiting_review' && item.status !== 'delivered') return false;
                if (statusFilter === 'completed' && item.status !== 'completed') return false;
                if (statusFilter === 'assigned' && (item.status !== 'assigned' && item.status !== 'accepted')) return false;
                if (!['new', 'awaiting_review', 'completed', 'assigned'].includes(statusFilter) && item.status !== statusFilter) return false;
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
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header: Title & Quick Refresh */}
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Assigned Loads
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Live route tracking, delivery schedule, and milestone status management.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing || isLoading}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
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
                        onSelectTab={handleSelectTab}
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
                searchPlaceholder="Search assigned loads by ID, tracking, shipper, route..."
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
                tableLayout="fixed"
                tableClassName="min-w-[1240px]"
                actionsColumnClassName="w-[130px] min-w-[130px]"
                emptyState={
                    <EmptyState
                        icon={Truck}
                        title={
                            statusFilter !== 'all' || priorityFilter !== 'all' || freightTypeFilter !== 'all'
                                ? "No Shipments Matching Filters"
                                : activeTab === 'all'
                                ? "No Assigned Loads Found"
                                : activeTab === 'new'
                                ? "No New Loads"
                                : activeTab === 'awaiting_review'
                                ? "No Loads Awaiting Review"
                                : activeTab === 'completed'
                                ? "No Completed Loads"
                                : "No Shipments Found"
                        }
                        description={
                            statusFilter !== 'all' || priorityFilter !== 'all' || freightTypeFilter !== 'all'
                                ? "Try adjusting or resetting your filter criteria to view assigned shipments."
                                : activeTab === 'all'
                                ? "There are currently no active freight loads assigned to your driver profile. New dispatches will appear here automatically."
                                : activeTab === 'new'
                                ? "Driver assigned load পাবে এবং delivery শুরু করবে।"
                                : activeTab === 'awaiting_review'
                                ? "Delivery শেষ করে POD upload করলে load এই tab-এ যাবে।"
                                : activeTab === 'completed'
                                ? "Customer POD approve করলে load এখানে চলে যাবে।"
                                : "There are no shipments currently matching this category."
                        }
                    />
                }
            />
        </div>
    );
}
