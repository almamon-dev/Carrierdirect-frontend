import React, { useMemo } from 'react';
import { WithdrawalItem } from '../index';

export type WithdrawalTabType = 'all' | 'completed' | 'processing' | 'failed';

interface WithdrawalFilterTabsProps {
    withdrawals: WithdrawalItem[];
    activeTab: WithdrawalTabType;
    onSelectTab: (tab: WithdrawalTabType) => void;
}

export const WithdrawalFilterTabs: React.FC<WithdrawalFilterTabsProps> = ({
    withdrawals,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        let completedCount = 0;
        let processingCount = 0;
        let failedCount = 0;

        withdrawals.forEach((w) => {
            const s = (w.status || '').toLowerCase();
            if (s === 'completed') completedCount++;
            else if (s === 'processing' || s === 'pending') processingCount++;
            else if (s === 'failed' || s === 'rejected') failedCount++;
        });

        return [
            { id: 'all' as WithdrawalTabType, label: 'All Payouts', count: withdrawals.length },
            { id: 'completed' as WithdrawalTabType, label: 'Completed', count: completedCount },
            { id: 'processing' as WithdrawalTabType, label: 'Processing', count: processingCount },
            { id: 'failed' as WithdrawalTabType, label: 'Failed', count: failedCount },
        ];
    }, [withdrawals]);

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
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
                        <span className={`text-[13px] sm:text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[11px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
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
