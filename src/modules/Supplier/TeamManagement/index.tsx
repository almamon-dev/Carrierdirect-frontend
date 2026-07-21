import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Shield, UserPlus, Clock, Settings, LayoutDashboard, Plus, Mail } from 'lucide-react';
import Button from '@/components/ui/button';

import DashboardTab from './components/DashboardTab';
import TeamMembersTab from './components/TeamMembersTab';
import RolesTab from './components/RolesTab';
import InvitationsTab from './components/InvitationsTab';
import ActivityLogsTab from './components/ActivityLogsTab';
import CreateTeamMemberModal from './components/CreateTeamMemberModal';

export default function TeamManagement() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'dashboard';
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleTabChange = (tabId: string) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', tabId);
        newParams.set('teamMember', 'dsfsdjf87f87ds78fdsfds7fydfdsnyfdsy7');
        if (!newParams.has('session_id')) {
            newParams.set('session_id', 'sess_' + Math.random().toString(36).substr(2, 9));
        }
        setSearchParams(newParams);
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'members', label: 'Team Members', icon: Users },
        { id: 'roles', label: 'Roles & Permissions', icon: Shield },
        { id: 'invitations', label: 'Invitations', icon: UserPlus },
        { id: 'logs', label: 'Activity Logs', icon: Clock },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Team Management</h1>
                    <p className="text-sm text-slate-500">Manage your organization's staff, roles, and permissions.</p>
                </div>

                {activeTab === 'members' && (
                    <Button variant="primary" className="gap-2" onClick={() => setIsCreateModalOpen(true)}>
                        <UserPlus size={16} />
                        <span>Create Team Member</span>
                    </Button>
                )}
                {activeTab === 'roles' && (
                    <Button variant="primary" className="gap-2">
                        <Plus size={16} />
                        <span>Create Custom Role</span>
                    </Button>
                )}
                {activeTab === 'invitations' && (
                    <Button variant="primary" className="gap-2">
                        <Mail size={16} />
                        <span>Invite Member</span>
                    </Button>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 overflow-x-auto border-b border-slate-200 mb-6 [&::-webkit-scrollbar]:hidden">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 pb-3 border-b-2 font-medium text-[13px] whitespace-nowrap transition-colors ${
                                isActive 
                                ? 'border-indigo-600 text-indigo-700' 
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                            }`}
                        >
                            <Icon size={16} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'members' && <TeamMembersTab />}
                {activeTab === 'roles' && <RolesTab />}
                {activeTab === 'invitations' && <InvitationsTab />}
                {activeTab === 'logs' && <ActivityLogsTab />}
            </div>

            {/* Modals */}
            {isCreateModalOpen && <CreateTeamMemberModal onClose={() => setIsCreateModalOpen(false)} />}
        </div>
    );
}
