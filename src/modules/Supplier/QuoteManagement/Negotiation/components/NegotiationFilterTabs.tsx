/**
 * NegotiationFilterTabs Component
 * Navigation tabs for switching between Active Negotiations and Negotiation History.
 */

import React from 'react';
import { Clock, History } from 'lucide-react';
import { NegotiationTab } from '../types';

interface NegotiationFilterTabsProps {
    activeTab: NegotiationTab;
    activeCount: number;
    historyCount: number;
    onSelectTab: (tab: NegotiationTab) => void;
}

export const NegotiationFilterTabs: React.FC<NegotiationFilterTabsProps> = ({
    activeTab,
    activeCount,
    historyCount,
    onSelectTab,
}) => {
    return (
        <div className="flex items-center bg-slate-100 dark:bg-[#1e2329] p-1 rounded-full border border-slate-200 dark:border-slate-700 shrink-0">
            <button
                type="button"
                onClick={() => onSelectTab('active')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'active'
                        ? 'bg-white dark:bg-[#282f38] text-[#ff4a1f] shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
                <Clock size={13} />
                <span>Active Negotiations ({activeCount})</span>
            </button>

            <button
                type="button"
                onClick={() => onSelectTab('history')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'history'
                        ? 'bg-white dark:bg-[#282f38] text-[#ff4a1f] shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
            >
                <History size={13} />
                <span>Negotiation History ({historyCount})</span>
            </button>
        </div>
    );
};
