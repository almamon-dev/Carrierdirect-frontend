import React from 'react';
import { RouteObject } from 'react-router-dom';
import VerifyEmailPage from './pages/VerifyEmailPage';
import VerifyEmailNoticePage from './pages/VerifyEmailNoticePage';

export const verifyEmailRoutes: RouteObject[] = [
    {
        path: 'verify-email',
        element: <VerifyEmailPage />,
    },
    {
        path: 'verify-email-notice',
        element: <VerifyEmailNoticePage />,
    }
];
