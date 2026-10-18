import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import PermissionGuard from '@/components/common/PermissionGuard';

const Calendar = lazy(() => import('../Availability/Calendar'));
const Routes = lazy(() => import('../Availability/Routes'));
const AvailabilityDashboard = lazy(() => import('../Availability/Dashboard'));
const DriversAvailability = lazy(() => import('../Availability/DriversAvailability'));
const VehiclesAvailability = lazy(() => import('../Availability/VehiclesAvailability'));
const BlackoutDates = lazy(() => import('../Availability/BlackoutDates'));
const TimeSlots = lazy(() => import('../Availability/TimeSlots'));
const CapacityManagement = lazy(() => import('../Availability/CapacityManagement'));

export const supplierAvailabilityRoutes: RouteObject[] = [
    { 
        path: 'availability', 
        element: <Navigate to="/supplier/availability/dashboard" replace /> 
    },
    { 
        path: 'availability/dashboard', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <AvailabilityDashboard />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/calendar', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <Calendar />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/schedule', 
        element: <Navigate to="/supplier/availability/dashboard" replace />
    },
    { 
        path: 'availability/schedule/create', 
        element: <Navigate to="/supplier/availability/dashboard" replace />
    },
    { 
        path: 'availability/routes', 
        element: (
            <PermissionGuard requiredPermission="fleet.track">
                <Routes />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/service-areas', 
        element: (
            <PermissionGuard requiredPermission="fleet.track">
                <Routes />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/drivers', 
        element: (
            <PermissionGuard requiredPermission="fleet.manage_drivers">
                <DriversAvailability />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/vehicles', 
        element: (
            <PermissionGuard requiredPermission="fleet.manage_vehicles">
                <VehiclesAvailability />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/blackout-dates', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <BlackoutDates />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/time-slots', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <TimeSlots />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/capacity', 
        element: (
            <PermissionGuard requiredPermission="fleet.manage_vehicles">
                <CapacityManagement />
            </PermissionGuard>
        ),
    },
    { 
        path: 'availability/settings', 
        element: <Navigate to="/supplier/availability/dashboard" replace />
    },
];
