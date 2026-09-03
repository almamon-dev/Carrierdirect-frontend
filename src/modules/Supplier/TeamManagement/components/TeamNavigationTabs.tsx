import React from 'react';

export type TeamNavTab = 'dashboard' | 'members' | 'roles' | 'invitations' | 'logs';

interface TeamNavigationTabsProps {
    activeTab: TeamNavTab | string;
    onSelectTab: (tab: TeamNavTab) => void;
    counts?: {
        members?: number;
        roles?: number;
        invitations?: number;
        logs?: number;
    };
}

export const TeamNavigationTabs: React.FC<TeamNavigationTabsProps> = ({
    activeTab,
    onSelectTab,
    counts,
}) => {
    const tabs = [
        { id: 'members' as TeamNavTab, label: 'Team Members', count: counts?.members },
        { id: 'roles' as TeamNavTab, label: 'Roles & Permissions', count: counts?.roles },
        { id: 'invitations' as TeamNavTab, label: 'Invitations', count: counts?.invitations },
        { id: 'logs' as TeamNavTab, label: 'Activity Logs', count: counts?.logs },
        { id: 'dashboard' as TeamNavTab, label: 'Dashboard' },
    ];

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
                        <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        {tab.count !== undefined && (
                            <span
                                className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                                    isActive
                                        ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
