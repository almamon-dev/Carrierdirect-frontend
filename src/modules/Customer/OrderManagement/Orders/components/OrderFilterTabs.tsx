import React, { useMemo } from 'react';
import { CustomerOrderItem, OrderFilterTab } from '../types';

interface OrderFilterTabsProps {
    orders: CustomerOrderItem[];
    activeTab: OrderFilterTab;
    onSelectTab: (tab: OrderFilterTab) => void;
}

export const OrderFilterTabs: React.FC<OrderFilterTabsProps> = ({
    orders,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let inTransit = 0;
        let podReview = 0;
        let completed = 0;
        let cancelled = 0;

        orders.forEach((o) => {
            const st = String(o.status_raw || o.status || '').toLowerCase();
            if (st === 'completed' || st === 'pod accepted') {
                completed++;
            } else if (st.includes('review') || st.includes('pod') || st.includes('delivered')) {
                podReview++;
            } else if (st.includes('cancel')) {
                cancelled++;
            } else {
                inTransit++;
            }
        });

        return {
            all: orders.length,
            in_transit: inTransit,
            pod_review: podReview,
            completed: completed,
            cancelled: cancelled,
        };
    }, [orders]);

    const tabs: { id: OrderFilterTab; label: string; count: number }[] = [
        { id: 'all', label: 'All Orders', count: counts.all },
        { id: 'in_transit', label: 'In Transit', count: counts.in_transit },
        { id: 'pod_review', label: 'POD Review', count: counts.pod_review },
        { id: 'completed', label: 'Completed', count: counts.completed },
        { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
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
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-medium px-2 py-0.5 rounded-full transition-colors ${
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
