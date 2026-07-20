import React from 'react';
import { RouteObject } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

export const loginRoutes: RouteObject[] = [
    {
        path: 'login',
        element: <LoginPage />,
    }
];
