import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import PermissionGuard from '@/components/common/PermissionGuard';

const ActiveJobs = lazy(() => import('../OrderManagement/ActiveJobs'));
const AssignDriver = lazy(() => import('../OrderManagement/AssignDriver'));
const POD = lazy(() => import('../OrderManagement/POD'));
const CompletedOrders = lazy(() => import('../OrderManagement/Completed'));
const OrderDetails = lazy(() => import('../OrderManagement/Details'));

export const supplierOrderRoutes: RouteObject[] = [
    { 
        path: 'orders', 
        element: <Navigate to="/supplier/orders/active-jobs" replace /> 
    },
    { 
        path: 'orders/active-jobs', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <ActiveJobs />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/assign-driver', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <AssignDriver />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/pod', 
        element: (
            <PermissionGuard requiredPermission="orders.upload_pod">
                <POD />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/completed', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <CompletedOrders />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/pod/:slug', 
        element: (
            <PermissionGuard requiredPermission="orders.upload_pod">
                <POD />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/details', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/details/:slug', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/details/:id', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/track/:slug', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ),
    },
    { 
        path: 'orders/:slug', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/processing/track/:id', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ),
    },
];
