import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/appRouter';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import GlobalToast from './components/ui/GlobalToast';
import ExportComingSoonModal from './components/modals/export-coming-soon-modal';

export default function App() {
  return (
    <ErrorBoundary>
      <GlobalToast />
      <ExportComingSoonModal />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
