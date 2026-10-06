/**
 * NegotiationFilterTabs Component
 * Dynamic top header tabs with live count indicators for Quote Negotiations:
 * All, Open, Counter Offers, Accepted, Booked, and Closed.
 */

import React, { useMemo } from 'react';
import { NegotiationItem } from '../types';

export type NegotiationFilterTab = 'all' | 'open' | 'counter' | 'accepted' | 'booked' | 'closed';

interface NegotiationFilterTabsProps {
    negotiations: NegotiationItem[];
    activeTab: NegotiationFilterTab;
    onSelectTab: (tab: NegotiationFilterTab) => void;
}

export function isNegotiationBooked(item: NegotiationItem): boolean {
    const s = (item.statusRaw || item.status || '').toLowerCase().trim();
    return s === 'booked' || Boolean((item as any).isPaid) || Boolean((item as any).hasOrder) || Boolean((item as any).orderId) || Boolean((item as any).orderNumber);
}

export function isNegotiationAccepted(item: NegotiationItem): boolean {
    if (isNegotiationBooked(item)) return false;
    const s = (item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revisionStatus || '').toLowerCase().trim();
    return s === 'accepted' || rev === 'accepted';
}

export function isNegotiationClosed(item: NegotiationItem): boolean {
    if (isNegotiationBooked(item) || isNegotiationAccepted(item)) return false;
    const s = (item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revisionStatus || '').toLowerCase().trim();
    return s === 'closed' || s === 'rejected' || s === 'expired' || s === 'lost' || s === 'declined' || s === 'cancelled' || Boolean((item as any).isExpired);
}

export function isNegotiationCounter(item: NegotiationItem): boolean {
    if (isNegotiationBooked(item) || isNegotiationAccepted(item) || isNegotiationClosed(item)) return false;
    const s = (item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revisionStatus || '').toLowerCase().trim();
    return s === 'counter_offers' || s === 'counter' || s.includes('counter') || rev === 'pending';
}

export function isNegotiationOpen(item: NegotiationItem): boolean {
    if (isNegotiationBooked(item) || isNegotiationAccepted(item) || isNegotiationClosed(item) || isNegotiationCounter(item)) return false;
    return true;
}

// Backwards compatibility helpers
export const isNegotiationActive = isNegotiationOpen;
export const isNegotiationHistory = isNegotiationClosed;

export const NegotiationFilterTabs: React.FC<NegotiationFilterTabsProps> = ({
    negotiations,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        let openCount = 0;
        let counterCount = 0;
        let acceptedCount = 0;
        let bookedCount = 0;
        let closedCount = 0;

        negotiations.forEach((n) => {
            if (isNegotiationBooked(n)) bookedCount++;
            else if (isNegotiationAccepted(n)) acceptedCount++;
            else if (isNegotiationClosed(n)) closedCount++;
            else if (isNegotiationCounter(n)) counterCount++;
            else openCount++;
        });

        return [
            { id: 'all' as NegotiationFilterTab, label: 'All', count: negotiations.length },
            { id: 'open' as NegotiationFilterTab, label: 'Open', count: openCount },
            { id: 'counter' as NegotiationFilterTab, label: 'Counter Offers', count: counterCount },
            { id: 'accepted' as NegotiationFilterTab, label: 'Accepted', count: acceptedCount },
            { id: 'booked' as NegotiationFilterTab, label: 'Booked', count: bookedCount },
            { id: 'closed' as NegotiationFilterTab, label: 'Closed', count: closedCount },
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
