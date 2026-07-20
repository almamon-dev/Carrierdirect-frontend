import React from 'react';
import { RouteObject } from 'react-router-dom';
import SessionExpiredPage from './pages/SessionExpiredPage';

export const sessionExpiredRoutes: RouteObject[] = [
    {
        path: 'session-expired',
        element: <SessionExpiredPage />,
    }
];
