import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

const DriverDashboard = lazy(() => import('./Dashboard'));
const DriverShipments = lazy(() => import('./Shipments'));
const ShipmentDetails = lazy(() => import('./Shipments/Details'));
const DriverChat = lazy(() => import('./Chat'));
const DriverNotifications = lazy(() => import('./Notifications'));
const DriverProfile = lazy(() => import('./Profile'));

export const driverRoutes: RouteObject[] = [
    { index: true, element: <Navigate to="/driver/dashboard" replace /> },
    { path: 'dashboard', element: <DriverDashboard /> },
    { path: 'shipments', element: <DriverShipments /> },
    { path: 'shipments/:id', element: <ShipmentDetails /> },
    { path: 'chat', element: <DriverChat /> },
    { path: 'chat/:partnerId', element: <DriverChat /> },
    { path: 'chat/:partnerId/:sessionKey', element: <DriverChat /> },
    { path: 'messages', element: <Navigate to="/driver/chat" replace /> },
    { path: 'messages/:partnerId', element: <DriverChat /> },
    { path: 'messages/:partnerId/:sessionKey', element: <DriverChat /> },
    { path: 'notifications', element: <DriverNotifications /> },
    { path: 'profile', element: <DriverProfile /> },
];

