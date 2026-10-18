import RatingModal from '@/components/modals/rating-modal';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import apiClient from '@/lib/axios';
import { RefreshCw, RotateCcw, Truck } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveJobColumns } from './components/ActiveJobColumns';
import { ActiveJobRowActions } from './components/ActiveJobRowActions';
import { useActiveJobsState } from './hooks/useActiveJobsState';

export default function ActiveJobs() {
    const navigate = useNavigate();
    const {
        isLoading,
        isRefreshing,
        activeFilterTab,
        setActiveFilterTab,
        statusFilter,
        setStatusFilter,
        vehicleFilter,
        setVehicleFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        ratingTarget,
        setRatingTarget,
        fetchOrders,
        handleResetFilters,
        filteredJobs,
        tabCounts,
    } = useActiveJobsState();

    const tabs = useMemo(() => [
        { id: 'new', label: 'New Jobs', count: tabCounts.new_jobs },
        { id: 'driver_assigned', label: 'Assigned', count: tabCounts.driver_assigned },
        { id: 'unassigned', label: 'Unassigned', count: tabCounts.unassigned },
        { id: 'in_transit', label: 'In Transit', count: tabCounts.in_transit },
    ], [tabCounts]);

    const columns = useMemo(() => getActiveJobColumns(navigate), [navigate]);

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Active Jobs & Deliveries
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Monitor active deliveries, submit PODs, and assign fleet drivers.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrders(true)}
                        disabled={isRefreshing}
                        className="h-8 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredJobs}
                compact={true}
                searchPlaceholder="Search by Job ID, customer, route..."
                hideViewToggle={false}
                banner={
                    activeFilterTab === 'unassigned' && tabCounts.unassigned > 0 ? (
                        <div className="flex items-center gap-2.5 px-3 py-2 bg-[#fffbea] dark:bg-amber-950/25 border border-[#feedae] dark:border-amber-800/60 rounded-[4px] text-[12px] text-amber-900 dark:text-amber-200">
                            <svg className="w-4 h-4 text-amber-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="flex items-center gap-1 flex-wrap leading-tight">
                                <span className="font-bold text-amber-900 dark:text-amber-100">
                                    {tabCounts.unassigned} shipment{tabCounts.unassigned > 1 ? 's' : ''} needs a driver.
                                </span>
                                <span className="text-amber-800 dark:text-amber-200">
                                    Assign a driver to move this job into Assigned.
                                </span>
                            </div>
                        </div>
                    ) : undefined
                }
                actions={(row) => (
                    <ActiveJobRowActions
                        row={row}
                        onOpenRating={(target) => setRatingTarget(target)}
                        navigate={navigate}
                    />
                )}
                actionsColumnClassName="w-[140px] min-w-[135px] text-right pr-3"
                headerTabs={
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                        {tabs.map((tab) => {
                            const isActive = activeFilterTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveFilterTab(tab.id)}
                                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${isActive
                                            ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>{tab.label}</span>
                                    <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${isActive ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                }
                filterContent={
                    <div className="w-full mb-3.5 font-sans">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 items-end">
                            <div className="min-w-0">
                                <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Status Filter</label>
                                <Select value={statusFilter} onChange={(val) => setStatusFilter(val)} showSearch={false}>
                                    <option value="all">All Active Jobs</option>
                                    <option value="new">New Jobs</option>
                                    <option value="assigned">Driver Assigned</option>
                                    <option value="unassigned">Unassigned</option>
                                    <option value="in transit">In Transit</option>
                                </Select>
                            </div>
                            <div className="min-w-0">
                                <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vehicle Type</label>
                                <Select value={vehicleFilter} onChange={(val) => setVehicleFilter(val)} showSearch={false}>
                                    <option value="all">All Vehicles</option>
                                    <option value="van">Covered Van</option>
                                    <option value="truck">Truck / Trailer</option>
                                    <option value="refrigerated">Refrigerated</option>
                                </Select>
                            </div>
                            <div className="min-w-0">
                                <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-9 text-xs" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                                    {(statusFilter !== 'all' || vehicleFilter !== 'all' || startDate || endDate) && (
                                        <button type="button" onClick={handleResetFilters} className="text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer" title="Reset filters">
                                            <RotateCcw size={10} /> Reset
                                        </button>
                                    )}
                                </div>
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-9 text-xs" />
                            </div>
                        </div>
                    </div>
                }
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => navigate(`/supplier/orders/details/${row.slug}`)}
                tableClassName="w-full min-w-[1250px]"
                emptyState={
                    <EmptyState
                        icon={Truck}
                        title="No Active Jobs Found"
                        description={activeFilterTab === 'all'
                            ? "You do not have any active shipments or assigned jobs at the moment."
                            : `No active jobs match the '${activeFilterTab}' status filter.`
                        }
                    />
                }
            />

            {ratingTarget && (
                <RatingModal
                    isOpen={Boolean(ratingTarget)}
                    onClose={() => setRatingTarget(null)}
                    orderId={ratingTarget.id}
                    targetName={ratingTarget.customer}
                    targetRole="Customer"
                    orderTitle={ratingTarget.route}
                    onSubmit={async (data) => {
                        try {
                            await apiClient.post('/supplier/reviews', data);
                        } catch (err) {
                            console.error('Failed to submit review:', err);
                        }
                    }}
                />
            )}
        </div>
    );
}
