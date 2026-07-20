import React from 'react';
import { RouteObject } from 'react-router-dom';
import TwoFactorPage from './pages/TwoFactorPage';

export const twoFactorRoutes: RouteObject[] = [
    {
        path: 'two-factor',
        element: <TwoFactorPage />,
    }
];
