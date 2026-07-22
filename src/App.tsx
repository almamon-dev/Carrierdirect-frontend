import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { authRoutes } from './modules/Auth';
import { supportRoutes } from './modules/Support/routes';
import CustomerLayout from './layouts/CustomerLayout';
import SupplierLayout from './layouts/SupplierLayout';
import { customerRoutes } from './modules/Customer/routes';
import { supplierRoutes } from './modules/Supplier/routes';

import Home from './modules/LandingPages/Home';
import ContactUs from './modules/LandingPages/ContactUs';
import PrivacyPolicy from './modules/LandingPages/PrivacyPolicy';
import TermsAndConditions from './modules/LandingPages/TermsAndConditions';
import PayLaterFacility from './modules/LandingPages/PayLaterFacility';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/contact-us',
    element: <ContactUs />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/terms-and-conditions',
    element: <TermsAndConditions />,
  },
  {
    path: '/pay-later-facility',
    element: <PayLaterFacility />,
  },
  /* Direct Auth Aliases */
  {
    path: '/login',
    element: <Navigate to="/web/login" replace />,
  },
  {
    path: '/register',
    element: <Navigate to="/web/register" replace />,
  },
  {
    path: '/auth/login',
    element: <Navigate to="/web/login" replace />,
  },
  {
    path: '/auth/register',
    element: <Navigate to="/web/register" replace />,
  },
  ...authRoutes,
  ...supportRoutes,
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
