import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { SupplierOrderItem } from '../ActiveJobs/types';
import { getOrderColumns } from '../ActiveJobs/components/columns';
import { OrderRowActions } from '../ActiveJobs/components/OrderRowActions';
import { apiClient } from '@/lib/axios';

export default function CompletedOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchOrders = async (refresh = false) => {
        if (refresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const res = await apiClient.get('/supplier/orders', { params: { tab: 'completed' } });
            const list =
                (Array.isArray(res?.data?.orders) && res.data.orders) ||
                (Array.isArray(res?.data?.data?.orders) && res.data.data.orders) ||
                (Array.isArray(res?.data?.data) && res.data.data) ||
                (Array.isArray(res?.orders) && res.orders) ||
                (Array.isArray(res?.data) && res.data) ||
                (Array.isArray(res) && res) ||
                [];
            if (Array.isArray(list)) {
                setOrders(list);
            }
        } catch (err) {
            console.error('Failed to load completed orders:', err);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter to completed status (only when POD is approved or order completed)
    const completedOrdersList = useMemo(() => {
        return orders.filter((o) => {
            const s = String(o.status_raw || o.status || '').toLowerCase().trim();
            const ps = String(o.pod_status || (o as any).tracking?.pod_status || '').toLowerCase().trim();
            const isPodApproved = ps === 'confirmed' || ps === 'approved' || ps === 'accepted';
            return s === 'completed' || s === 'pod accepted' || s === 'pod_accepted' || isPodApproved;
        });
    }, [orders]);

    const columns = useMemo(() => getOrderColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Completed Orders
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Historical archive of successfully executed and POD-approved delivery jobs.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchOrders(true)}
                        disabled={isRefreshing}
                        className="rounded-[3px] h-8 text-xs flex items-center gap-1.5"
                    >
                        <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
                        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
                    </Button>
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                columns={columns}
                data={completedOrdersList}
                compact={true}
                searchPlaceholder="Search completed orders by ID, customer, route..."
                headerTabs={
                    <div className="flex items-center gap-2 pb-2.5 border-b-2 border-[#ff4a1f] w-fit px-1">
                        <span className="text-[13px] font-bold text-[#ff4a1f]">
                            Completed Orders
                        </span>
                        <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-[3px] bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f]">
                            {completedOrdersList.length}
                        </span>
                    </div>
                }
                actions={(row: SupplierOrderItem) => (
                    <OrderRowActions
                        row={row}
                        onOpenRating={() => {}}
                        navigate={navigate}
                    />
                )}
                actionsColumnClassName="w-[125px] min-w-[125px] text-right pr-3"
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={CheckCircle2}
                        title="No Completed Orders"
                        description="You do not have any completed transportation deliveries in your archive yet."
                    />
                }
            />
        </div>
    );
}
