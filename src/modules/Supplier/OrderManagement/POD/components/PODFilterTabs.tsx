import React, { useMemo } from 'react';
import { PODFilterTab, PODOrderItem } from '../types';

interface PODFilterTabsProps {
    orders: PODOrderItem[];
    activeTab: PODFilterTab;
    onSelectTab: (tab: PODFilterTab) => void;
}

export const PODFilterTabs: React.FC<PODFilterTabsProps> = ({
    orders,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let needsUpload = 0;
        let inReview = 0;
        let approved = 0;
        let rejected = 0;

        orders.forEach((o) => {
            if (o.pod_status === 'Approved') approved++;
            else if (o.pod_status === 'Pending Review') inReview++;
            else if (o.pod_status === 'Rejected') rejected++;
            else needsUpload++;
        });

        return {
            all: orders.length,
            needs_upload: needsUpload,
            in_review: inReview,
            approved: approved,
            rejected: rejected,
        };
    }, [orders]);

    const tabs: { id: PODFilterTab; label: string; count: number }[] = [
        { id: 'all', label: 'All Records', count: counts.all },
        { id: 'needs_upload', label: 'Needs Upload', count: counts.needs_upload },
        { id: 'in_review', label: 'In Review', count: counts.in_review },
        { id: 'approved', label: 'Approved', count: counts.approved },
        { id: 'rejected', label: 'Rejected', count: counts.rejected },
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

export default PODFilterTabs;
