import React from 'react';
import { RouteObject } from 'react-router-dom';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import FeedbackPage from './pages/FeedbackPage';

export const supportRoutes: RouteObject[] = [
  {
    path: '/support',
    children: [
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: 'feedback',
        element: <FeedbackPage />,
      },
    ],
  },
];
