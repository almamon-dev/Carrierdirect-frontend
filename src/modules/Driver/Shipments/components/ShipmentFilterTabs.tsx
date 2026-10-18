import React, { useMemo } from 'react';
import { ShipmentItem } from '../../types';

export type DriverShipmentFilterTab = 'all' | 'new' | 'awaiting_review' | 'completed';

interface Props {
    shipments: ShipmentItem[];
    activeTab: DriverShipmentFilterTab;
    onSelectTab: (tab: DriverShipmentFilterTab) => void;
}

export const ShipmentFilterTabs: React.FC<Props> = ({
    shipments,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        const counts: Record<DriverShipmentFilterTab, number> = {
            all: shipments.length,
            new: shipments.filter(s => ['assigned', 'accepted', 'at_pickup', 'in_transit', 'at_delivery'].includes(s.status)).length,
            awaiting_review: shipments.filter(s => s.status === 'delivered').length,
            completed: shipments.filter(s => s.status === 'completed').length,
        };

        return [
            { id: 'all' as DriverShipmentFilterTab, label: 'All Loads', count: counts.all },
            { id: 'new' as DriverShipmentFilterTab, label: 'New', count: counts.new },
            { id: 'awaiting_review' as DriverShipmentFilterTab, label: 'Awaiting Review', count: counts.awaiting_review },
            { id: 'completed' as DriverShipmentFilterTab, label: 'Completed', count: counts.completed },
        ];
    }, [shipments]);

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${isActive
                            ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${isActive
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
