import React from 'react';
import { RouteObject } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

export const registerRoutes: RouteObject[] = [
    {
        path: 'register',
        element: <RegisterPage />,
    }
];
