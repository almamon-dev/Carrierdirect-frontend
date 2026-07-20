import React from 'react';
import { RouteObject } from 'react-router-dom';
import LockScreenPage from './pages/LockScreenPage';

export const lockScreenRoutes: RouteObject[] = [
    {
        path: 'lock-screen',
        element: <LockScreenPage />,
    }
];
