import React from 'react';
import { RouteObject } from 'react-router-dom';
import VerifyEmailPage from './pages/VerifyEmailPage';

export const verifyEmailRoutes: RouteObject[] = [
    {
        path: 'verify-email',
        element: <VerifyEmailPage />,
    }
];
