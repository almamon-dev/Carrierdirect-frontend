import React from 'react';
import { DRIVER_SETTINGS_TABS } from './profileConstants';

interface Props {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export const ProfileNavigationTabs: React.FC<Props> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-0.5 overflow-x-auto overflow-y-hidden hide-scrollbar no-scrollbar w-full">
            {DRIVER_SETTINGS_TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer -mb-px ${
                            idx === 0 ? 'pl-0.5 pr-3' : 'px-3'
                        } ${
                            isActive
                                ? 'border-[#FF4A1F] text-[#FF4A1F]'
                                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                        <Icon
                            size={13}
                            className={isActive ? 'text-[#FF4A1F]' : 'text-slate-400 dark:text-slate-500'}
                        />
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
