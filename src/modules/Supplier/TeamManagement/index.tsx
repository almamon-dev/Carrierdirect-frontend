import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Button from '@/components/ui/button';

import DashboardTab from './components/DashboardTab';
import TeamMembersTab from './components/TeamMembersTab';
import RolesTab from './components/RolesTab';
import InvitationsTab from './components/InvitationsTab';
import ActivityLogsTab from './components/ActivityLogsTab';
import TrashBinTab from './components/TrashBinTab';
import CreateTeamMemberModal from './components/CreateTeamMemberModal';
import { TeamNavigationTabs, TeamNavTab } from './components/TeamNavigationTabs';

export default function TeamManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'members';
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleTabChange = (tabId: TeamNavTab) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', tabId);
        setSearchParams(newParams);
    };

    const headerTabsNode = (
        <TeamNavigationTabs
            activeTab={activeTab}
            onSelectTab={handleTabChange}
        />
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header Title & Actions matching Negotiation / QuoteRequests */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Team Management
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage your organization staff, access roles, and permissions.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {(activeTab === 'members' || activeTab === 'invitations') && (
                        <Button
                            variant="primary"
                            size="sm"
                            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs rounded"
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            <UserPlus size={14} />
                            <span>Create Team Member</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Tab Content with Header Tabs embedded inside card top */}
            <div>
                {activeTab === 'dashboard' && <DashboardTab key={refreshKey} headerTabs={headerTabsNode} />}
                {activeTab === 'members' && <TeamMembersTab key={refreshKey} headerTabs={headerTabsNode} />}
                {activeTab === 'roles' && <RolesTab key={refreshKey} headerTabs={headerTabsNode} />}
                {activeTab === 'invitations' && <InvitationsTab key={refreshKey} headerTabs={headerTabsNode} />}
                {activeTab === 'logs' && <ActivityLogsTab key={refreshKey} headerTabs={headerTabsNode} />}
                {activeTab === 'trash' && <TrashBinTab key={refreshKey} headerTabs={headerTabsNode} />}
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateTeamMemberModal 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onSuccess={() => setRefreshKey(k => k + 1)}
                />
            )}
        </div>
    );
}
