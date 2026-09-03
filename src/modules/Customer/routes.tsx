import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

import RequestList from './QuoteManagement/RequestList';
const Dashboard = lazy(() => import('./Dashboard'));
const CreateRequest = lazy(() => import('./QuoteManagement/CreateRequest'));
const EditRequest = lazy(() => import('./QuoteManagement/EditRequest'));
const ViewRequest = lazy(() => import('./QuoteManagement/ViewRequest'));
const Processing = lazy(() => import('./QuoteManagement/Processing'));
const ProcessingTrack = lazy(() => import('./QuoteManagement/Processing/Track'));
const QuotesReceived = lazy(() => import('./QuoteManagement/QuotesReceived'));
const TrackBids = lazy(() => import('./QuoteManagement/QuotesReceived/Track'));
const QuoteView = lazy(() => import('./QuoteManagement/QuotesReceived/View'));
const QuoteAcceptCheckout = lazy(() => import('./QuoteManagement/QuotesReceived/AcceptCheckout'));
const QuoteNegotiation = lazy(() => import('./QuoteManagement/Negotiation'));
const QuoteNegotiationChat = lazy(() => import('./QuoteManagement/Negotiation/Chat'));
const Orders = lazy(() => import('./OrderManagement/Orders'));

const OrderDetails = lazy(() => import('./OrderManagement/Details'));
const Billing = lazy(() => import('./Finance/Billing'));
const Invoices = lazy(() => import('./Finance/Invoices'));
const Payments = lazy(() => import('./Finance/Payments'));
const PayLater = lazy(() => import('./Finance/PayLater'));
const Subscription = lazy(() => import('./Subscription'));
const SubscriptionCheckout = lazy(() => import('./Subscription/Checkout'));
import Notifications from './Notifications';
import Messages from './Messages';
const Settings = lazy(() => import('./Settings'));

export const customerRoutes: RouteObject[] = [
    { index: true, element: <Navigate to="/customer/dashboard" replace /> },
    { path: '', element: <Navigate to="/customer/dashboard" replace /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'quotes', element: <Navigate to="/customer/quotes/received" replace /> },
    { path: 'quotes/create', element: <RequestList /> },
    { path: 'quotes/create/new', element: <CreateRequest /> },
    { path: 'quotes/create/edit/:id', element: <EditRequest /> },
    { path: 'quotes/create/view/:id', element: <ViewRequest /> },
    { path: 'quotes/processing', element: <Processing /> },
    { path: 'quotes/processing/track/:id', element: <ProcessingTrack /> },
    { path: 'quotes/received', element: <QuotesReceived /> },
    { path: 'quotes/received/track/:id', element: <TrackBids /> },
    { path: 'quotes/received/bids/:id', element: <TrackBids /> },
    { path: 'quotes/received/:id', element: <TrackBids /> },
    { path: 'quotes/received/view/:quoteId', element: <QuoteView /> },
    { path: 'quotes/received/checkout/:quoteId', element: <QuoteAcceptCheckout /> },
    { path: 'quotes/negotiation', element: <QuoteNegotiation /> },
    { path: 'quotes/negotiation/conversation/:id', element: <QuoteNegotiationChat /> },
    { path: 'quotes/negotiation/view/:id', element: <QuoteNegotiationChat /> },
    { path: 'orders', element: <Orders /> },

    { path: 'orders/:id', element: <OrderDetails /> },
    { path: 'finance', element: <Navigate to="/customer/finance/invoices" replace /> },
    { path: 'finance/billing', element: <Billing /> },
    { path: 'finance/invoices', element: <Invoices /> },
    { path: 'finance/payments', element: <Payments /> },
    { path: 'finance/pay-later', element: <PayLater /> },
    { path: 'subscription', element: <Subscription /> },
    { path: 'subscription/checkout', element: <SubscriptionCheckout /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'messages', element: <Messages /> },
    { path: 'messages/:partnerId', element: <Messages /> },
    { path: 'messages/:partnerId/:sessionKey', element: <Messages /> },
    { path: 'settings', element: <Settings /> },
];
