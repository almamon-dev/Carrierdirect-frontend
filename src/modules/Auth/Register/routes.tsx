import React from 'react';
import { RouteObject } from 'react-router-dom';
import RegisterPage from './pages/SelectRolePage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import SupplierRegisterPage from './pages/SupplierRegisterPage';

export const registerRoutes: RouteObject[] = [
    {
        path: 'register',
        element: <RegisterPage />,
    },
    {
        path: 'select-role',
        element: <RegisterPage />,
    },
    {
        path: 'register/customer',
        element: <CustomerRegisterPage />,
    },
    {
        path: 'register/supplier',
        element: <SupplierRegisterPage />,
    }
];
