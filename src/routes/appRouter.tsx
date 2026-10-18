import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import CustomerLayout from '@/layouts/CustomerLayout';
import SupplierLayout from '@/layouts/SupplierLayout';
import DriverLayout from '@/layouts/DriverLayout';
import { authRoutes } from '@/modules/Auth';
import { customerRoutes } from '@/modules/Customer/routes';
import { supplierRoutes } from '@/modules/Supplier/routes';
import { driverRoutes } from '@/modules/Driver/routes';
import { supportRoutes } from '@/modules/Support/routes';

import ContactUs from '@/modules/LandingPages/ContactUs';
import Home from '@/modules/LandingPages/Home';
import PayLaterFacility from '@/modules/LandingPages/PayLaterFacility';
import PrivacyPolicy from '@/modules/LandingPages/PrivacyPolicy';
import TermsAndConditions from '@/modules/LandingPages/TermsAndConditions';

const SupplierCompleteProfilePage = React.lazy(
  () => import('@/modules/Supplier/CompleteProfile/CompleteProfilePage')
);

const RedirectWithQuery: React.FC<{ to: string }> = ({ to }) => {
  const search = typeof window !== 'undefined' ? window.location.search : '';
  return <Navigate to={`${to}${search}`} replace />;
};

const PaymentRedirect: React.FC<{ status: 'success' | 'cancel' }> = ({ status }) => {
  const search = typeof window !== 'undefined' ? window.location.search : '';
  const params = new URLSearchParams(search);
  const type = params.get('type') || 'subscription';

  if (type === 'quote' || type === 'invoice' || type === 'order') {
    return <Navigate to={`/customer/finance/invoices?payment=${status}`} replace />;
  }
  return <Navigate to={`/customer/subscription?payment=${status}`} replace />;
};

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/contact-us', element: <ContactUs /> },
  { path: '/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/terms-and-conditions', element: <TermsAndConditions /> },
  { path: '/pay-later-facility', element: <PayLaterFacility /> },
  { path: '/payment/success', element: <PaymentRedirect status="success" /> },
  { path: '/payment/cancel', element: <PaymentRedirect status="cancel" /> },
  { path: '/invite/accept', element: <RedirectWithQuery to="/web/invitation-accepted" /> },
  { path: '/accept-invitation', element: <RedirectWithQuery to="/web/invitation-accepted" /> },
  { path: '/login', element: <RedirectWithQuery to="/web/login" /> },
  { path: '/register', element: <RedirectWithQuery to="/web/register" /> },
  { path: '/select-role', element: <RedirectWithQuery to="/web/register" /> },
  { path: '/web/select-role', element: <RedirectWithQuery to="/web/register" /> },
  { path: '/auth/login', element: <RedirectWithQuery to="/web/login" /> },
  { path: '/auth/register', element: <RedirectWithQuery to="/web/register" /> },
  { path: '/client-dashboard/*', element: <RedirectWithQuery to="/customer/dashboard" /> },
  { path: '/client-dashboard', element: <RedirectWithQuery to="/customer/dashboard" /> },
  { path: '/customer-dashboard/*', element: <RedirectWithQuery to="/customer/dashboard" /> },
  { path: '/customer-dashboard', element: <RedirectWithQuery to="/customer/dashboard" /> },
  { path: '/supplier-dashboard/*', element: <RedirectWithQuery to="/supplier/dashboard" /> },
  { path: '/supplier-dashboard', element: <RedirectWithQuery to="/supplier/dashboard" /> },
  ...authRoutes,
  ...supportRoutes,
  {
    path: '/customer',
    element: (
      <ProtectedRoute allowedRole="customer">
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: customerRoutes,
  },
  {
    path: '/supplier/complete-profile',
    element: (
      <ProtectedRoute allowedRole="supplier">
        <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500 font-medium">Loading...</div>}>
          <SupplierCompleteProfilePage />
        </React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/supplier',
    element: (
      <ProtectedRoute allowedRole="supplier">
        <SupplierLayout />
      </ProtectedRoute>
    ),
    children: supplierRoutes,
  },
  {
    path: '/driver',
    element: (
      <ProtectedRoute allowedRole="driver">
        <DriverLayout />
      </ProtectedRoute>
    ),
    children: driverRoutes,
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
