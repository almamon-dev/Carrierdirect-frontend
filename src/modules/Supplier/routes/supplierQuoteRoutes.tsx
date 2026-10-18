import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import QuoteRequests from '../QuoteManagement/QuoteRequests';
import WonQuotes from '../QuoteManagement/WonQuotes';
import PermissionGuard from '@/components/common/PermissionGuard';

const SubmitQuote = lazy(() => import('../QuoteManagement/SubmitQuote'));
const MyQuotes = lazy(() => import('../QuoteManagement/MyQuotes'));
const QuoteNegotiation = lazy(() => import('../QuoteManagement/Negotiation'));
const QuoteNegotiationChat = lazy(() => import('../QuoteManagement/Negotiation/Chat'));

export const supplierQuoteRoutes: RouteObject[] = [
    { 
        path: 'quotes', 
        element: <Navigate to="/supplier/quotes/requests" replace /> 
    },
    {
        path: 'quotes/my-quotes',
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <MyQuotes />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/my-quotes/:slug', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <SubmitQuote />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/requests', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteRequests />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/requests/:slug', 
        element: (
            <PermissionGuard requiredPermission="quotes.submit">
                <SubmitQuote />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/submit', 
        element: (
            <PermissionGuard requiredPermission="quotes.submit">
                <SubmitQuote />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/submit/:slug', 
        element: (
            <PermissionGuard requiredPermission="quotes.submit">
                <SubmitQuote />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/won', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <WonQuotes />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/expired', 
        element: <Navigate to="/supplier/quotes/requests" replace /> 
    },
    { 
        path: 'quotes/lost', 
        element: <Navigate to="/supplier/quotes/requests" replace /> 
    },
    { 
        path: 'quotes/negotiation', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiation />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/negotiation/conversation/:id', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/negotiation/conversation/:id/:sessionKey', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/negotiation/view/:id', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ),
    },
    { 
        path: 'quotes/negotiation/view/:id/:sessionKey', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ),
    },
];
