import React from 'react';
import { RouteObject } from 'react-router-dom';
import FaqPage from './pages/FaqPage';

export const faqRoutes: RouteObject[] = [
    {
        path: 'faq',
        element: <FaqPage />,
    }
];
