import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { authRoutes } from './modules/Auth';
import { supportRoutes } from './modules/Support/routes';
import ModulesSelectorPage from './modules/Dashboard/pages/ModulesSelectorPage';
import CustomerLayout from './layouts/CustomerLayout';
import SupplierLayout from './layouts/SupplierLayout';
import { customerRoutes } from './modules/Customer/routes';
import { supplierRoutes } from './modules/Supplier/routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/web/login" replace />,
  },
  ...authRoutes,
  ...supportRoutes,
  {
    path: '/modules',
    element: <ModulesSelectorPage />,
  },
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: customerRoutes,
  },
  {
    path: '/supplier',
    element: <SupplierLayout />,
    children: supplierRoutes,
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <h1 className="text-2xl font-bold text-red-500">404 - Page Not Found</h1>
      </div>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
