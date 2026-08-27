/**
 * Edit Quote Sidebar Navigation Component
 * Renders the vertical tab navigation for editing quote sections.
 */

import React from 'react';
import { ChevronRight, LucideIcon } from 'lucide-react';

export interface EditTabItem {
    id: string;
    label: string;
    icon: LucideIcon | React.ComponentType<{ size?: number | string; className?: string }>;
}

interface EditSidebarProps {
    tabs: EditTabItem[];
    activeTab: string;
    onSelectTab: (tabId: string) => void;
}

export const EditSidebar: React.FC<EditSidebarProps> = ({
    tabs,
    activeTab,
    onSelectTab,
}) => {
    return (
        <div className="w-full md:w-[260px] flex-shrink-0 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#181d24]">
                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Categories</h3>
            </div>
            <div className="flex flex-col">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onSelectTab(tab.id)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-[14px] font-medium transition-colors border-l-[3px] border-b border-slate-50 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${
                                isSelected
                                    ? 'border-l-[#ff4a1f] bg-orange-50/60 dark:bg-[#ff4a1f]/10 text-[#ff4a1f] font-bold'
                                    : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                <span>{tab.label}</span>
                            </div>
                            {isSelected && <ChevronRight size={15} className="text-[#ff4a1f]" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
