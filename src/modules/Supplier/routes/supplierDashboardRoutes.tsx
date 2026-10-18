import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard';
import PermissionGuard from '@/components/common/PermissionGuard';

const DriverDashboard = lazy(() => import('../Dashboard/DriverDashboard'));
const FinanceDashboard = lazy(() => import('../Dashboard/FinanceDashboard'));
const OperationsDashboard = lazy(() => import('../Dashboard/OperationsDashboard'));
const SalesDashboard = lazy(() => import('../Dashboard/SalesDashboard'));
const SupportDashboard = lazy(() => import('../Dashboard/SupportDashboard'));

export const supplierDashboardRoutes: RouteObject[] = [
    { index: true, element: <Navigate to="/supplier/dashboard" replace /> },
    { path: '', element: <Navigate to="/supplier/dashboard" replace /> },
    { path: 'dashboard', element: <Dashboard /> },
    { 
        path: 'driver/dashboard', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <DriverDashboard />
            </PermissionGuard>
        ),
    },
    { 
        path: 'finance/dashboard', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <FinanceDashboard />
            </PermissionGuard>
        ),
    },
    { 
        path: 'operations/dashboard', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OperationsDashboard />
            </PermissionGuard>
        ),
    },
    { 
        path: 'sales/dashboard', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <SalesDashboard />
            </PermissionGuard>
        ),
    },
    { 
        path: 'support/dashboard', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <SupportDashboard />
            </PermissionGuard>
        ),
    },
];
