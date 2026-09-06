import React, { useState, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { UserPlus, Plus, RefreshCw } from 'lucide-react';
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
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const activeTab = useMemo<TeamNavTab>(() => {
        const path = location.pathname.toLowerCase();
        if (path.endsWith('/roles') || path.endsWith('/roles-permissions')) return 'roles';
        if (path.endsWith('/invitations') || path.endsWith('/invites')) return 'invitations';
        if (path.endsWith('/logs') || path.endsWith('/activity-logs')) return 'logs';
        if (path.endsWith('/trash') || path.endsWith('/trash-bin')) return 'trash';
        if (path.endsWith('/dashboard')) return 'dashboard';
        if (path.endsWith('/members')) return 'members';

        const tabParam = searchParams.get('tab');
        if (tabParam === 'roles' || tabParam === 'invitations' || tabParam === 'logs' || tabParam === 'trash' || tabParam === 'dashboard' || tabParam === 'members') {
            return tabParam as TeamNavTab;
        }
        return 'members';
    }, [location.pathname, searchParams]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleTabChange = (tabId: TeamNavTab) => {
        const search = searchParams.toString();
        const query = search ? `?${search}` : '';
        navigate(`/supplier/team/${tabId}${query}`);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setRefreshKey(k => k + 1);
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const headerTabsNode = (
        <TeamNavigationTabs
            activeTab={activeTab}
            onSelectTab={handleTabChange}
        />
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header Title & Actions matching RequestList */}
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
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs rounded"
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={13} className={`text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </Button>

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

                    {activeTab === 'roles' && (
                        <Button
                            variant="primary"
                            size="sm"
                            className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs rounded"
                            onClick={() => setIsCreatingRole(true)}
                        >
                            <Plus size={14} />
                            <span>Create New Role</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Tab Content with Header Tabs embedded inside card top */}
            <div>
                {activeTab === 'dashboard' && <DashboardTab key={refreshKey} headerTabs={headerTabsNode} />}
                {activeTab === 'members' && <TeamMembersTab key={refreshKey} headerTabs={headerTabsNode} />}
                {activeTab === 'roles' && (
                    <RolesTab 
                        key={refreshKey} 
                        headerTabs={headerTabsNode} 
                        isCreatingRole={isCreatingRole}
                        onResetCreating={() => setIsCreatingRole(false)}
                    />
                )}
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
