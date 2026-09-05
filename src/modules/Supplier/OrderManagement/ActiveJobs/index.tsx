import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Truck, MapPin, Star, RefreshCw, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import RatingModal from '@/components/modals/rating-modal';
import { SupplierOrder, mapApiOrderToSupplierOrder } from '../data/ordersData';
import { apiClient } from '@/lib/axios';

export default function ActiveJobs() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [activeFilterTab, setActiveFilterTab] = useState<string>('all');

    // Advanced Dropdown Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleFilter, setVehicleFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const [ratingTarget, setRatingTarget] = useState<{ id: string; customer: string; route: string } | null>(null);

    const fetchOrders = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const res = await apiClient.get('/supplier/orders');
            const raw = res.data?.data?.orders || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];
            const mapped: SupplierOrder[] = resArray.map(mapApiOrderToSupplierOrder);
            setOrders(mapped);
        } catch (err) {
            console.error('Failed to fetch supplier orders:', err);
            setOrders([]);
        } finally {
            setIsLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setStartDate('');
        setEndDate('');
        setActiveFilterTab('all');
    };

    const filteredJobs = useMemo(() => {
        return orders.filter(job => {
            const st = (job.status || '').toLowerCase();

            // 1. Top Filter Tab
            if (activeFilterTab === 'in_transit' && st !== 'in transit') return false;
            if (activeFilterTab === 'scheduled' && st !== 'scheduled') return false;
            if (activeFilterTab === 'delivered' && st !== 'delivered') return false;

            // 2. Status Dropdown Filter
            if (statusFilter !== 'all' && !st.includes(statusFilter.toLowerCase())) return false;

            // 3. Vehicle Filter
            if (vehicleFilter !== 'all') {
                const rowVehicle = (job.vehicle || '').toLowerCase();
                if (!rowVehicle.includes(vehicleFilter.toLowerCase())) return false;
            }

            // 4. Date Filter
            if (startDate || endDate) {
                const dateVal = job.pickupDate;
                if (dateVal) {
                    try {
                        const itemTime = new Date(dateVal).getTime();
                        if (!isNaN(itemTime)) {
                            if (startDate) {
                                const start = new Date(startDate);
                                start.setHours(0, 0, 0, 0);
                                if (itemTime < start.getTime()) return false;
                            }
                            if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                if (itemTime > end.getTime()) return false;
                            }
                        }
                    } catch {}
                }
            }

            return true;
        });
    }, [orders, activeFilterTab, statusFilter, vehicleFilter, startDate, endDate]);

    // Top Filter Tabs with Live Count Badges
    const FilterTabs = () => {
        const counts = useMemo(() => {
            let inTransitCount = 0;
            let scheduledCount = 0;
            let deliveredCount = 0;

            orders.forEach((o) => {
                const s = (o.status || '').toLowerCase();
                if (s === 'in transit') inTransitCount++;
                else if (s === 'scheduled') scheduledCount++;
                else if (s === 'delivered') deliveredCount++;
            });

            return {
                all: orders.length,
                inTransit: inTransitCount,
                scheduled: scheduledCount,
                delivered: deliveredCount,
            };
        }, [orders]);

        const tabs = [
            { id: 'all', label: 'All Jobs', count: counts.all },
            { id: 'in_transit', label: 'In Transit', count: counts.inTransit },
            { id: 'scheduled', label: 'Scheduled', count: counts.scheduled },
            { id: 'delivered', label: 'Delivered', count: counts.delivered },
        ];

        return (
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                {tabs.map((tab) => {
                    const isActive = activeFilterTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFilterTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${isActive
                                    ? 'border-[#ff4a1f] text-[#ff4a1f] font-bold'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                                }`}
                        >
                            <span className="text-[13.5px]">{tab.label}</span>
                            <span
                                className={`text-[11.5px] font-semibold px-2 py-0.5 rounded-full ${isActive
                                        ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    const columns: Column<SupplierOrder>[] = [
        { 
            id: 'id', 
            label: 'Job ID', 
            sortable: true,
            className: 'w-[85px] min-w-[85px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supplier/orders/details/${row.slug}`);
                        }}
                        className="font-bold text-[#ff4a1f] hover:underline text-left cursor-pointer text-xs leading-none whitespace-nowrap"
                    >
                        {row.id}
                    </button>
                </div>
            )
        },
        { 
            id: 'customer', 
            label: 'Customer', 
            sortable: true,
            className: 'w-[140px] min-w-[140px]',
            render: (row) => (
                <div className="flex flex-col min-w-0" title={row.customer}>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate leading-tight">{row.customer}</p>
                    <p className="text-[11px] text-slate-400 truncate leading-tight">{row.customerPhone}</p>
                </div>
            ) 
        },
        {
            id: 'route',
            label: 'Route',
            className: 'min-w-0',
            render: (row) => (
                <div className="space-y-0.5 min-w-0 pr-1">
                    <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-medium text-xs truncate">
                        <MapPin size={12} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{row.pickup}</span>
                        <span className="text-slate-400 shrink-0">→</span>
                        <span className="truncate">{row.delivery}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate">{row.distance} • {row.estimatedDuration}</p>
                </div>
            )
        },
        { 
            id: 'date', 
            label: 'Schedule Date', 
            sortable: true,
            className: 'w-[125px] min-w-[125px]',
            render: (row) => (
                <div className="flex flex-col">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight whitespace-nowrap">{row.pickupDate}</p>
                    <p className="text-[11px] text-slate-400 leading-tight whitespace-nowrap">{row.pickupTimeWindow}</p>
                </div>
            )
        },
        {
            id: 'driver',
            label: 'Driver & Vehicle',
            className: 'w-[150px] min-w-[150px]',
            render: (row) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">{row.driver}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate leading-tight">
                        <Truck size={11} className="text-slate-400 shrink-0" /> {row.vehicle} ({row.vehiclePlate})
                    </span>
                </div>
            )
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[105px] min-w-[105px] text-center',
            render: (row) => (
                <div className="flex items-center justify-center h-5">
                    <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                        row.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60' :
                        row.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' :
                        row.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' :
                        'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60'
                    }`}>
                        {row.status}
                    </Badge>
                </div>
            )
        },
        {
            id: 'netPayout',
            label: 'Net Payout',
            sortable: true,
            className: 'w-[100px] min-w-[100px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs leading-none whitespace-nowrap">{row.netPayout}</span>
                </div>
            )
        }
    ];

    const renderActions = (row: SupplierOrder) => (
        <div className="flex items-center justify-end gap-1.5">
            {row.status === 'Delivered' && (
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 font-bold text-[11px] cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setRatingTarget({ id: row.id, customer: row.customer, route: `${row.pickup} → ${row.delivery}` });
                    }}
                    title="Rate Customer"
                >
                    <Star size={12} className="mr-1 fill-amber-400 text-amber-400" /> Rate
                </Button>
            )}
            <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs px-2.5 font-semibold cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/supplier/orders/details/${row.slug}`);
                }}
            >
                <Eye size={13} className="mr-1 text-slate-500" /> Details
            </Button>
        </div>
    );

    const filterContent = (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Status Filter</label>
                    <Select value={statusFilter} onChange={(val) => setStatusFilter(val)} showSearch={false}>
                        <option value="all">All Jobs</option>
                        <option value="in transit">In Transit</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="delivered">Delivered</option>
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
                <div className="min-w-0 hidden md:block" />
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">End Date</label>
                        {(statusFilter !== 'all' || vehicleFilter !== 'all' || startDate || endDate) && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                className="text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                                title="Reset filters"
                            >
                                <RotateCcw size={10} /> Reset
                            </button>
                        )}
                    </div>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5 bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Active Jobs & Deliveries
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Monitor active deliveries, submit PODs, and rate customer shippers.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrders(true)}
                        disabled={isRefreshing}
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                actions={renderActions}
                headerTabs={<FilterTabs />}
                filterContent={filterContent}
                isLoading={isLoading || isRefreshing}
                onRowClick={(row) => navigate(`/supplier/orders/details/${row.slug}`)}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
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

            {/* Rating Modal for Supplier Rating Customer */}
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
