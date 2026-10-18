import React, { useMemo } from 'react';
import { OrderFilterTab, SupplierOrderItem } from '../types';

interface OrderFilterTabsProps {
    orders: SupplierOrderItem[];
    activeTab: OrderFilterTab;
    onSelectTab: (tab: OrderFilterTab) => void;
}

export const OrderFilterTabs: React.FC<OrderFilterTabsProps> = ({
    orders,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let all = 0;
        let newJobs = 0;
        let driverAssigned = 0;
        let inTransit = 0;

        orders.forEach((o) => {
            const rawStatus = String(o.status_raw || o.status || '').toLowerCase().trim();
            const ps = String(o.pod_status || (o as any).tracking?.pod_status || '').toLowerCase().trim();
            const isCompleted = rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'pod_accepted' || ps === 'confirmed' || ps === 'approved';
            if (isCompleted) return;

            all++;
            const isInTransit = rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'on_the_way' || rawStatus === 'in_progress' || rawStatus === 'arrived' || rawStatus === 'delivered' || rawStatus === 'pod_uploaded';
            const isDriverAssigned = rawStatus === 'driver_assigned' || rawStatus === 'assigned' || Boolean(o.driver);

            if (isInTransit) {
                inTransit++;
            } else if (isDriverAssigned) {
                driverAssigned++;
            } else {
                newJobs++;
            }
        });

        return {
            all,
            new_jobs: newJobs,
            driver_assigned: driverAssigned,
            in_transit: inTransit,
        };
    }, [orders]);

    const tabs: { id: OrderFilterTab; label: string; count: number }[] = [
        { id: 'all', label: 'All Active', count: counts.all },
        { id: 'new', label: 'New Jobs', count: counts.new_jobs },
        { id: 'driver_assigned', label: 'Assigned', count: counts.driver_assigned },
        { id: 'in_transit', label: 'In Transit', count: counts.in_transit },
    ];

    return (
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 rounded-[3px] ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-medium px-2 py-0.5 rounded-[3px] transition-colors ${
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
    );
};

export default OrderFilterTabs;
