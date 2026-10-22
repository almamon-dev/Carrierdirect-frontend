import React, { useMemo } from 'react';
import { CustomerQuoteRequestItem, FilterTabId } from '../types';

interface FilterTabsProps {
    requestData: CustomerQuoteRequestItem[];
    activeTab: FilterTabId;
    onSelectTab: (tabId: FilterTabId) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    requestData,
    activeTab,
    onSelectTab,
}) => {
    // Spec: All | Drafts | In Progress | Booked | Completed
    const counts = useMemo(() => {
        let all = 0;
        let drafts = 0;
        let inProgress = 0;
        let booked = 0;
        let completed = 0;

        (requestData || []).forEach((r: any) => {
            all++;
            const s = String(r.status || r.rawStatus || r.raw_status || "").toLowerCase().trim();
            const isComp = Boolean(
                r.isCompleted ||
                s === "completed" ||
                String(r.raw_status || "").toLowerCase() === "completed" ||
                String(r.order_status || "").toLowerCase() === "completed"
            );
            const isBooked = !isComp && Boolean(
                s === "booked" ||
                s === "confirmed" ||
                r.is_booked ||
                r.has_order ||
                (s === "accepted" && (r.is_paid || r.has_order))
            );

            if (isComp) {
                completed++;
            } else if (isBooked) {
                booked++;
            } else if (s === "draft") {
                drafts++;
            } else {
                // In Progress: submitted requests that are still collecting quotes or undergoing review
                inProgress++;
            }
        });

        return {
            all,
            drafts,
            inProgress,
            booked,
            completed,
        };
    }, [requestData]);

    const tabs: { id: FilterTabId; label: string; count: number }[] = [
        { id: "All", label: "All", count: counts.all },
        { id: "Drafts", label: "Drafts", count: counts.drafts },
        { id: "In Progress", label: "In Progress", count: counts.inProgress },
        { id: "Booked", label: "Booked", count: counts.booked },
        { id: "Completed", label: "Completed", count: counts.completed },
    ];

    // Normalize activeTab comparison
    const isTabActive = (tabId: FilterTabId) => {
        if (activeTab === tabId) return true;
        if (tabId === "Drafts" && (activeTab === "Draft" as FilterTabId)) return true;
        if (tabId === "In Progress" && (activeTab === "Active" as FilterTabId)) return true;
        return false;
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = isTabActive(tab.id);
                return (
                    <button 
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b transition-colors whitespace-nowrap cursor-pointer ${
                            isActive 
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]' 
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${
                            isActive 
                                ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
