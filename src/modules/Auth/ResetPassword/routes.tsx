import React from 'react';
import { RouteObject } from 'react-router-dom';
import ResetPasswordPage from './pages/ResetPasswordPage';

export const resetPasswordRoutes: RouteObject[] = [
    {
        path: 'reset-password',
        element: <ResetPasswordPage />,
    }
];
