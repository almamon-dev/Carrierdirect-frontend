import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import PermissionGuard from '@/components/common/PermissionGuard';
import Notifications from '../Notifications';
import Messages from '../Messages';

const TeamManagement = lazy(() => import('../TeamManagement'));
const TeamMemberProfilePage = lazy(() => import('../TeamManagement/TeamMemberProfilePage'));
const Settings = lazy(() => import('../Settings'));

export const supplierTeamRoutes: RouteObject[] = [
    { 
        path: 'team', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/dashboard', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/members', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/roles', 
        element: (
            <PermissionGuard requiredPermission="team.edit_roles">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/invitations', 
        element: (
            <PermissionGuard requiredPermission="team.invite">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/logs', 
        element: (
            <PermissionGuard requiredPermission="team.activity_logs">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/activity-logs', 
        element: (
            <PermissionGuard requiredPermission="team.activity_logs">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/trash', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/trash-bin', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/member/:id', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamMemberProfilePage />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/members/:id', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamMemberProfilePage />
            </PermissionGuard>
        ),
    },
    { 
        path: 'team/:id', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamMemberProfilePage />
            </PermissionGuard>
        ),
    },
    { path: 'notifications', element: <Notifications /> },
    { path: 'messages', element: <Messages /> },
    { path: 'messages/:partnerId', element: <Messages /> },
    { path: 'messages/:partnerId/:sessionKey', element: <Messages /> },
    { 
        path: 'settings', 
        element: (
            <PermissionGuard requiredPermission="settings.company_profile">
                <Settings />
            </PermissionGuard>
        ),
    },
];
