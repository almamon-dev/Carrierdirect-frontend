import React, { useMemo } from 'react';
import { CustomerOrderItem, OrderFilterTab } from '../types';

interface OrderFilterTabsProps {
    orders: CustomerOrderItem[];
    stats?: {
        total?: number;
        confirmed?: number;
        driver_assigned?: number;
        in_transit?: number;
        delivered?: number;
        pod_pending?: number;
        completed?: number;
        cancelled?: number;
    } | null;
    activeTab: OrderFilterTab;
    onSelectTab: (tab: OrderFilterTab) => void;
}

export const OrderFilterTabs: React.FC<OrderFilterTabsProps> = ({
    orders,
    stats,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let confirmed = 0;
        let driverAssigned = 0;
        let inTransit = 0;
        let delivered = 0;
        let podPending = 0;
        let completed = 0;
        let cancelled = 0;

        orders.forEach((o) => {
            const st = String(o.status_raw || o.status || '').toLowerCase().trim();
            const statusLabel = String(o.status || '').toLowerCase().trim();
            const podSt = String(o.pod_status || (o as any).pod?.status || (o as any).pod?.pod_status || '').toLowerCase().trim();
            const hasPodDoc = Boolean(
                o.proof_of_delivery || 
                (o as any).proof || 
                (o as any).pod_url || 
                (o as any).pod_file || 
                (o as any).pod_document_url || 
                (o as any).signature || 
                (o as any).pod?.file_url || 
                (o as any).pod?.is_uploaded
            );

            const isCancelled = st.includes('cancel') || st.includes('reject');
            const isCompleted = st === 'completed' || st === 'pod accepted' || st === 'pod_accepted' || st === 'won';

            if (isCancelled) {
                cancelled++;
                return;
            }
            if (isCompleted) {
                completed++;
                return;
            }

            const isInTransit = st === 'in_transit' || st === 'picked_up' || st === 'on_the_way' || st === 'in_progress';
            const isDriverAssigned = !isInTransit && (st === 'driver_assigned' || st === 'assigned');
            const isConfirmed = !isInTransit && !isDriverAssigned && (st === 'confirmed' || st === 'booked' || st === 'pending' || st === 'scheduled' || st === 'order_booked');
            const isDelivered = !isInTransit && (st === 'delivered' || statusLabel === 'delivered');
            const isPodPending = !isInTransit && (
                st === 'pod_uploaded' || 
                st === 'pod_review' || 
                (isDelivered && (hasPodDoc || podSt === 'pending')) ||
                (podSt === 'pending' && hasPodDoc) ||
                statusLabel.includes('review')
            );

            if (isInTransit) inTransit++;
            if (isDriverAssigned) driverAssigned++;
            if (isConfirmed) confirmed++;
            if (isDelivered) delivered++;
            if (isPodPending) podPending++;
        });

        return {
            total: stats?.total ?? orders.length,
            confirmed: stats?.confirmed ?? confirmed,
            driver_assigned: stats?.driver_assigned ?? driverAssigned,
            in_transit: stats?.in_transit ?? inTransit,
            delivered: stats?.delivered ?? delivered,
            pod_pending: stats?.pod_pending ?? podPending,
            completed: stats?.completed ?? completed,
            cancelled: stats?.cancelled ?? cancelled,
        };
    }, [orders, stats]);

    const activeCount = counts.confirmed + counts.driver_assigned + counts.in_transit;
    const completedCount = counts.completed + counts.delivered;

    // Streamlined 4-5 Core Tabs: All Orders | Active & In Transit | POD Review | Completed | Cancelled
    const tabs: { id: OrderFilterTab; label: string; count: number; isPulse?: boolean; isAlert?: boolean }[] = [
        { id: 'all', label: 'All Orders', count: counts.total },
        { id: 'active', label: 'Active & In Transit', count: activeCount, isPulse: counts.in_transit > 0 },
        { id: 'pod_pending', label: 'POD Review', count: counts.pod_pending, isAlert: counts.pod_pending > 0 },
        { id: 'completed', label: 'Completed', count: completedCount },
        ...(counts.cancelled > 0 || activeTab === 'cancelled' ? [{ id: 'cancelled' as OrderFilterTab, label: 'Cancelled', count: counts.cancelled }] : []),
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-1.5 pb-2.5 border-b-2 transition-all whitespace-nowrap cursor-pointer px-2 py-1 rounded-t-[3px] text-left ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f] font-bold'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 font-medium'
                        }`}
                    >
                        {tab.isPulse && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                        )}
                        <span className="text-[13px] tracking-tight">
                            {tab.label}
                        </span>
                        <span
                            className={`text-[11px] font-bold px-1.5 py-0.25 rounded-[3px] transition-colors shrink-0 ${
                                isActive
                                    ? 'bg-orange-100/80 text-[#ff4a1f] dark:bg-[#ff4a1f]/20 dark:text-orange-300'
                                    : tab.isAlert
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-extrabold'
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

export default OrderFilterTabs;
