/**
 * NegotiationFilterTabs Component
 * Dynamic top header tabs with live count indicators for Quote Negotiations:
 * All, Active, Counter Offers, Accepted, and History / Closed.
 */

import React, { useMemo } from 'react';
import { NegotiationItem } from '../types';

export type NegotiationFilterTab = 'all' | 'active' | 'counter' | 'accepted' | 'history';

interface NegotiationFilterTabsProps {
    negotiations: NegotiationItem[];
    activeTab: NegotiationFilterTab;
    onSelectTab: (tab: NegotiationFilterTab) => void;
}

export function isNegotiationActive(item: NegotiationItem): boolean {
    const s = (item.statusRaw || item.status || '').toLowerCase();
    const rev = (item.revisionStatus || '').toLowerCase();
    if (s === 'accepted' || s === 'rejected' || s === 'expired' || s === 'closed') return false;
    return true;
}

export function isNegotiationCounter(item: NegotiationItem): boolean {
    const s = (item.statusRaw || item.status || '').toLowerCase();
    const rev = (item.revisionStatus || '').toLowerCase();
    return s.includes('counter') || rev === 'pending' || (item.unreadCount !== undefined && item.unreadCount > 0);
}

export function isNegotiationAccepted(item: NegotiationItem): boolean {
    const s = (item.statusRaw || item.status || '').toLowerCase();
    const rev = (item.revisionStatus || '').toLowerCase();
    return s === 'accepted' || rev === 'accepted';
}

export function isNegotiationHistory(item: NegotiationItem): boolean {
    const s = (item.statusRaw || item.status || '').toLowerCase();
    const rev = (item.revisionStatus || '').toLowerCase();
    return s === 'rejected' || s === 'expired' || s === 'closed' || s === 'lost';
}

export const NegotiationFilterTabs: React.FC<NegotiationFilterTabsProps> = ({
    negotiations,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        let activeCount = 0;
        let counterCount = 0;
        let acceptedCount = 0;
        let historyCount = 0;

        negotiations.forEach((n) => {
            if (isNegotiationActive(n)) activeCount++;
            if (isNegotiationCounter(n)) counterCount++;
            if (isNegotiationAccepted(n)) acceptedCount++;
            if (isNegotiationHistory(n)) historyCount++;
        });

        return [
            { id: 'all' as NegotiationFilterTab, label: 'All', count: negotiations.length },
            { id: 'active' as NegotiationFilterTab, label: 'Active', count: activeCount },
            { id: 'counter' as NegotiationFilterTab, label: 'Counter Offers', count: counterCount },
            { id: 'accepted' as NegotiationFilterTab, label: 'Accepted', count: acceptedCount },
            { id: 'history' as NegotiationFilterTab, label: 'Closed / History', count: historyCount },
        ];
    }, [negotiations]);

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
