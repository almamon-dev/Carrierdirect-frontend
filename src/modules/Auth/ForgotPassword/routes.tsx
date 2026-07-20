import React from 'react';
import { RouteObject } from 'react-router-dom';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

export const forgotPasswordRoutes: RouteObject[] = [
    {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
    }
];
