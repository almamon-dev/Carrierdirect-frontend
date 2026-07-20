import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Dashboard = lazy(() => import('./Dashboard'));
const CreateRequest = lazy(() => import('./QuoteManagement/CreateRequest'));
const CreateRequestNew = lazy(() => import('./QuoteManagement/CreateRequest/Create'));
const CreateRequestEdit = lazy(() => import('./QuoteManagement/CreateRequest/Edit'));
const CreateRequestView = lazy(() => import('./QuoteManagement/CreateRequest/View'));
const Processing = lazy(() => import('./QuoteManagement/Processing'));
const ProcessingTrack = lazy(() => import('./QuoteManagement/Processing/Track'));
const QuotesReceived = lazy(() => import('./QuoteManagement/QuotesReceived'));
const TrackBids = lazy(() => import('./QuoteManagement/QuotesReceived/Track'));
const QuoteView = lazy(() => import('./QuoteManagement/QuotesReceived/View'));
const QuoteNegotiation = lazy(() => import('./QuoteManagement/Negotiation'));
const QuoteNegotiationChat = lazy(() => import('./QuoteManagement/Negotiation/Chat'));
const Orders = lazy(() => import('./OrderManagement/Orders'));

const OrderDetails = lazy(() => import('./OrderManagement/Details'));
const Billing = lazy(() => import('./Finance/Billing'));
const Invoices = lazy(() => import('./Finance/Invoices'));
const Payments = lazy(() => import('./Finance/Payments'));
const PayLater = lazy(() => import('./Finance/PayLater'));
const Notifications = lazy(() => import('./Notifications'));
const Settings = lazy(() => import('./Settings'));

export const customerRoutes: RouteObject[] = [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'quotes/create', element: <CreateRequest /> },
    { path: 'quotes/create/new', element: <CreateRequestNew /> },
    { path: 'quotes/create/edit/:id', element: <CreateRequestEdit /> },
    { path: 'quotes/create/view/:id', element: <CreateRequestView /> },
    { path: 'quotes/processing', element: <Processing /> },
    { path: 'quotes/processing/track/:id', element: <ProcessingTrack /> },
    { path: 'quotes/received', element: <QuotesReceived /> },
    { path: 'quotes/received/:id', element: <TrackBids /> },
    { path: 'quotes/received/view/:quoteId', element: <QuoteView /> },
    { path: 'quotes/negotiation', element: <QuoteNegotiation /> },
    { path: 'quotes/negotiation/view/:id', element: <QuoteNegotiationChat /> },
    { path: 'orders', element: <Orders /> },

    { path: 'orders/details', element: <OrderDetails /> },
    { path: 'finance/billing', element: <Billing /> },
    { path: 'finance/invoices', element: <Invoices /> },
    { path: 'finance/payments', element: <Payments /> },
    { path: 'finance/pay-later', element: <PayLater /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'settings', element: <Settings /> },
];
