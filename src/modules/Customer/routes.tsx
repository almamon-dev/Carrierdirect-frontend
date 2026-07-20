import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Dashboard = lazy(() => import('./Dashboard'));
const CreateRequest = lazy(() => import('./QuoteManagement/CreateRequest'));
const CreateRequestNew = lazy(() => import('./QuoteManagement/CreateRequest/Create'));
const CreateRequestEdit = lazy(() => import('./QuoteManagement/CreateRequest/Edit'));
const CreateRequestView = lazy(() => import('./QuoteManagement/CreateRequest/View'));
const Processing = lazy(() => import('./QuoteManagement/Processing'));
const QuotesReceived = lazy(() => import('./QuoteManagement/QuotesReceived'));
const QuoteNegotiation = lazy(() => import('./QuoteManagement/Negotiation'));
const Orders = lazy(() => import('./OrderManagement/Orders'));
const Tracking = lazy(() => import('./OrderManagement/Tracking'));
const OrderDetails = lazy(() => import('./OrderManagement/Details'));
const Billing = lazy(() => import('./Finance/Billing'));
const Invoices = lazy(() => import('./Finance/Invoices'));
const Payments = lazy(() => import('./Finance/Payments'));
const Notifications = lazy(() => import('./Notifications'));
const Settings = lazy(() => import('./Settings'));

export const customerRoutes: RouteObject[] = [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'quotes/create', element: <CreateRequest /> },
    { path: 'quotes/create/new', element: <CreateRequestNew /> },
    { path: 'quotes/create/edit/:id', element: <CreateRequestEdit /> },
    { path: 'quotes/create/view/:id', element: <CreateRequestView /> },
    { path: 'quotes/processing', element: <Processing /> },
    { path: 'quotes/received', element: <QuotesReceived /> },
    { path: 'quotes/negotiation', element: <QuoteNegotiation /> },
    { path: 'orders', element: <Orders /> },
    { path: 'orders/tracking', element: <Tracking /> },
    { path: 'orders/details', element: <OrderDetails /> },
    { path: 'finance/billing', element: <Billing /> },
    { path: 'finance/invoices', element: <Invoices /> },
    { path: 'finance/payments', element: <Payments /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'settings', element: <Settings /> },
];
