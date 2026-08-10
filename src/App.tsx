import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { authRoutes } from './modules/Auth';
import { supportRoutes } from './modules/Support/routes';
import CustomerLayout from './layouts/CustomerLayout';
import SupplierLayout from './layouts/SupplierLayout';
import { customerRoutes } from './modules/Customer/routes';
import { supplierRoutes } from './modules/Supplier/routes';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './modules/LandingPages/Home';
import ContactUs from './modules/LandingPages/ContactUs';
import PrivacyPolicy from './modules/LandingPages/PrivacyPolicy';
import TermsAndConditions from './modules/LandingPages/TermsAndConditions';
import PayLaterFacility from './modules/LandingPages/PayLaterFacility';

const SupplierCompleteProfilePage = React.lazy(() => import('./modules/Supplier/CompleteProfile/CompleteProfilePage'));

// Error boundary to catch lazy import failures (e.g., during hot reload)
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
          <p className="text-slate-600 font-medium">Something went wrong loading this page.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-4 py-2 bg-[#FF4A1F] text-white rounded-md text-sm font-bold hover:bg-[#E03E15] transition-colors cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    path: '/select-role',
    element: <Navigate to="/web/register" replace />,
  },
  {
    path: '/web/select-role',
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
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <h1 className="text-2xl font-bold text-red-500">404 - Page Not Found</h1>
      </div>
    ),
  },
]);

import GlobalToast from './components/ui/GlobalToast';

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalToast />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
