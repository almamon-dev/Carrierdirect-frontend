import React from 'react';
import { ChevronRight } from 'lucide-react';
import { QuoteFormData } from '../../CreateRequest/types/formTypes';

interface TabItem {
    id: string;
    label: string;
    icon: any;
}

interface EditSidebarProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    formData?: QuoteFormData;
    servicesCount?: number;
}

export const EditSidebar: React.FC<EditSidebarProps> = ({
    tabs,
    activeTab,
    onTabChange,
    servicesCount = 0,
}) => {
    return (
        <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Edit Sections
                </h3>
            </div>
            <div className="flex flex-col">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium transition-colors border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 cursor-pointer ${
                                isSelected
                                    ? 'border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-semibold'
                                    : 'border-l-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                <span>{tab.label}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {tab.id === 'load' && servicesCount > 0 && (
                                    <span className="bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                                        {servicesCount}
                                    </span>
                                )}
                                {isSelected && <ChevronRight size={14} className="text-[#ff4a1f]" />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
