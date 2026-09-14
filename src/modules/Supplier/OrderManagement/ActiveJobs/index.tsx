import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
    Eye, 
    Truck, 
    Navigation, 
    FileCheck, 
    MapPin, 
    Star, 
    RefreshCw, 
    RotateCcw, 
    UserCheck, 
    ArrowRight, 
    MoreVertical, 
    Copy, 
    Check 
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import RatingModal from '@/components/modals/rating-modal';
import { SupplierOrder, mapApiOrderToSupplierOrder } from '../data/ordersData';
import { apiClient } from '@/lib/axios';
import { formatDisplayDate } from '@/lib/utils';

// Row Actions component with 3-dots Menu
const ActiveJobRowActions = ({
    row,
    onOpenRating,
    navigate
}: {
    row: SupplierOrder;
    onOpenRating: (target: { id: string; customer: string; route: string }) => void;
    navigate: (path: string, options?: any) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [copied, setCopied] = useState(false);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        const handleScroll = () => handleClose();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const rawStatus = (row.status || '').toLowerCase().trim();
    const isCompleted = rawStatus === 'completed' || rawStatus === 'delivered' || rawStatus === 'pod accepted';
    const hasDriver = Boolean(row.driver && !row.driver.toLowerCase().includes('unassigned') && !row.driver.toLowerCase().includes('pending'));
    const isAssigned = hasDriver || rawStatus === 'driver assigned' || rawStatus === 'driver_assigned' || rawStatus === 'in transit' || rawStatus === 'in_transit';

    return (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Quick Assign Driver Button */}
            {!isCompleted && (
                <button
                    type="button"
                    onClick={() => navigate('/supplier/orders/assign-driver', { state: { selectedOrder: row } })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-all cursor-pointer whitespace-nowrap active:scale-95 bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs font-bold"
                    title={isAssigned ? "Reassign Driver & Vehicle" : "Assign Driver & Vehicle"}
                >
                    <UserCheck size={12} className="text-white shrink-0" />
                    <span>{isAssigned ? "Reassign" : "Assign"}</span>
                </button>
            )}

            {/* 3-Dots Menu Button */}
            <button
                type="button"
                onClick={handleToggle}
                className="h-7 w-7 p-0 flex items-center justify-center rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="More actions"
            >
                <MoreVertical size={15} />
            </button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    />

                    <div
                        className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate(`/supplier/orders/details/${row.slug}`);
                            }}
                        >
                            <Eye size={14} className="text-slate-400 shrink-0" />
                            <span>View Details</span>
                        </button>

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate(`/supplier/orders/details/${row.slug}`, { state: { openTab: "tracking" } });
                            }}
                        >
                            <Navigation size={14} className="text-slate-400 shrink-0" />
                            <span>Live Tracking</span>
                        </button>

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate(`/supplier/orders/pod/${row.slug}`);
                            }}
                        >
                            <FileCheck size={14} className="text-emerald-500 shrink-0" />
                            <span>Upload / View POD</span>
                        </button>

                        {!isCompleted && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    navigate('/supplier/orders/assign-driver', { state: { selectedOrder: row } });
                                }}
                            >
                                <UserCheck size={14} className="text-[#ff4a1f] shrink-0" />
                                <span>{isAssigned ? "Reassign Driver" : "Assign Driver"}</span>
                            </button>
                        )}

                        {isCompleted && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    onOpenRating({ id: row.id, customer: row.customer, route: `${row.pickup} → ${row.delivery}` });
                                }}
                            >
                                <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                                <span>Rate Customer</span>
                            </button>
                        )}

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(row.id);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                    handleClose();
                                }, 1000);
                            }}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="text-emerald-500 shrink-0" />
                                    <span className="text-emerald-600 font-semibold">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} className="text-slate-400 shrink-0" />
                                    <span>Copy Job ID</span>
                                </>
                            )}
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

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
            const response = await apiClient.get('/supplier/orders');
            let ordersList: any[] = [];
            if (response.data?.data?.orders && Array.isArray(response.data.data.orders)) {
                ordersList = response.data.data.orders;
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                ordersList = response.data.data;
            } else if (Array.isArray(response.data)) {
                ordersList = response.data;
            }

            const mappedOrders = ordersList.map((apiOrder: any) => mapApiOrderToSupplierOrder(apiOrder));
            setOrders(mappedOrders);
        } catch (error) {
            console.error('Failed to fetch supplier orders:', error);
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
    };

    // Filter Logic
    const filteredJobs = useMemo(() => {
        return orders.filter(job => {
            const jobStatus = (job.status || '').toLowerCase().trim();

            if (activeFilterTab === 'in_transit') {
                if (jobStatus !== 'in transit' && jobStatus !== 'in_transit') return false;
            } else if (activeFilterTab === 'scheduled') {
                if (jobStatus !== 'scheduled' && jobStatus !== 'confirmed' && jobStatus !== 'driver assigned' && jobStatus !== 'driver_assigned') return false;
            } else if (activeFilterTab === 'delivered') {
                if (jobStatus !== 'delivered' && jobStatus !== 'completed' && jobStatus !== 'pod accepted') return false;
            }

            if (statusFilter !== 'all') {
                if (statusFilter === 'in transit' && jobStatus !== 'in transit' && jobStatus !== 'in_transit') return false;
                if (statusFilter === 'scheduled' && jobStatus !== 'scheduled' && jobStatus !== 'confirmed') return false;
                if (statusFilter === 'delivered' && jobStatus !== 'delivered' && jobStatus !== 'completed') return false;
            }

            if (vehicleFilter !== 'all') {
                const vehicle = (job.vehicle || '').toLowerCase();
                if (vehicleFilter === 'van' && !vehicle.includes('van')) return false;
                if (vehicleFilter === 'truck' && !vehicle.includes('truck') && !vehicle.includes('trailer') && !vehicle.includes('pallet')) return false;
                if (vehicleFilter === 'refrigerated' && !vehicle.includes('refrig') && !vehicle.includes('temp')) return false;
            }

            if (startDate) {
                const jobDate = new Date(job.pickupDate || '').getTime();
                const fromDate = new Date(startDate).getTime();
                if (!isNaN(jobDate) && !isNaN(fromDate) && jobDate < fromDate) return false;
            }
            if (endDate) {
                const jobDate = new Date(job.pickupDate || '').getTime();
                const toDate = new Date(endDate).getTime();
                if (!isNaN(jobDate) && !isNaN(toDate) && jobDate > toDate) return false;
            }

            return true;
        });
    }, [orders, activeFilterTab, statusFilter, vehicleFilter, startDate, endDate]);

    // Tab counts
    const tabCounts = useMemo(() => {
        let all = orders.length;
        let in_transit = 0;
        let scheduled = 0;
        let delivered = 0;

        orders.forEach(j => {
            const st = (j.status || '').toLowerCase().trim();
            if (st === 'in transit' || st === 'in_transit') in_transit++;
            else if (st === 'delivered' || st === 'completed' || st === 'pod accepted') delivered++;
            else scheduled++;
        });

        return { all, in_transit, scheduled, delivered };
    }, [orders]);

    const tabs = [
        { id: 'all', label: 'All Jobs', count: tabCounts.all },
        { id: 'in_transit', label: 'In Transit', count: tabCounts.in_transit },
        { id: 'scheduled', label: 'Scheduled', count: tabCounts.scheduled },
        { id: 'delivered', label: 'Delivered', count: tabCounts.delivered },
    ];

    const columns: Column<SupplierOrder>[] = [
        { 
            id: 'id', 
            label: 'Job ID', 
            sortable: true,
            className: 'w-[120px] min-w-[110px] text-left',
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
            className: 'min-w-[140px]',
            render: (row) => {
                const initial = row.customer ? row.customer.charAt(0).toUpperCase() : 'C';
                return (
                    <div className="flex items-center gap-2 min-w-0 h-5" title={row.customer}>
                        <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                            {initial}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs whitespace-nowrap leading-tight">
                            {row.customer}
                        </span>
                    </div>
                );
            } 
        },
        {
            id: 'route',
            label: 'Route',
            sortable: true,
            className: 'min-w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap h-5" title={`${row.pickup} → ${row.delivery}`}>
                    <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                    <span>{row.pickup}</span>
                    <ArrowRight size={11} className="text-slate-400 shrink-0" />
                    <span>{row.delivery}</span>
                </div>
            )
        },
        { 
            id: 'date', 
            label: 'Schedule Date', 
            sortable: true,
            className: 'w-[110px] min-w-[105px] text-center',
            render: (row) => (
                <div className="flex items-center justify-center h-5">
                    <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                        {formatDisplayDate(row.pickupDate)}
                    </span>
                </div>
            )
        },
        {
            id: 'driver',
            label: 'Driver & Vehicle',
            sortable: true,
            className: 'min-w-[150px]',
            render: (row) => {
                const hasDriver = row.driver && !row.driver.toLowerCase().includes('unassigned');
                return (
                    <div className="flex items-center gap-1.5 h-5 min-w-0" title={`${row.driver} • ${row.vehicle || ''}`}>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                            hasDriver ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {hasDriver ? row.driver.charAt(0) : '?'}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap leading-none">
                            {row.driver || 'Pending'}
                        </span>
                    </div>
                );
            }
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[110px] min-w-[110px] text-center',
            render: (row) => {
                const st = (row.status || 'Confirmed').toLowerCase();
                let variant: any = 'info';
                if (st.includes('delivered') || st.includes('completed')) variant = 'success';
                else if (st.includes('transit')) variant = 'warning';
                else if (st.includes('cancel')) variant = 'critical';

                return (
                    <div className="flex items-center justify-center h-5">
                        <Badge variant={variant} showDot className="text-[10.5px] font-bold whitespace-nowrap">
                            {row.status || 'Confirmed'}
                        </Badge>
                    </div>
                );
            }
        },
        {
            id: 'payout',
            label: 'Net Payout',
            sortable: true,
            className: 'w-[105px] min-w-[100px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                        {row.netPayout || row.agreedPrice || '—'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Active Jobs & Deliveries
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">
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
                actions={(row) => (
                    <ActiveJobRowActions
                        row={row}
                        onOpenRating={(target) => setRatingTarget(target)}
                        navigate={navigate}
                    />
                )}
                actionsColumnClassName="w-[125px] min-w-[125px] text-right pr-3"
                headerTabs={
                    <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                        {tabs.map((tab) => {
                            const isActive = activeFilterTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveFilterTab(tab.id)}
                                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                                        isActive
                                            ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                                        {tab.label}
                                    </span>
                                    <span
                                        className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                                            isActive
                                                ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                        }`}
                                    >
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
                }
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
