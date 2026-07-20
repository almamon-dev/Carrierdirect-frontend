import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Dashboard = lazy(() => import('./Dashboard'));
const QuoteRequests = lazy(() => import('./QuoteManagement/QuoteRequests'));
const SubmitQuote = lazy(() => import('./QuoteManagement/SubmitQuote'));
const WonQuotes = lazy(() => import('./QuoteManagement/WonQuotes'));
const LostQuotes = lazy(() => import('./QuoteManagement/LostQuotes'));
const QuoteNegotiation = lazy(() => import('./QuoteManagement/Negotiation'));
const ActiveJobs = lazy(() => import('./OrderManagement/ActiveJobs'));
const POD = lazy(() => import('./OrderManagement/POD'));
const OrderDetails = lazy(() => import('./OrderManagement/Details'));
const Calendar = lazy(() => import('./Availability/Calendar'));
const Routes = lazy(() => import('./Availability/Routes'));
const CreateAvailability = lazy(() => import('./Availability/CreateAvailability'));
const EmployeeManagement = lazy(() => import('./EmployeeManagement'));
const Earnings = lazy(() => import('./Finance/Earnings'));
const Withdrawal = lazy(() => import('./Finance/Withdrawal'));
const Payments = lazy(() => import('./Finance/Payments'));
const Notifications = lazy(() => import('./Notifications'));
const Settings = lazy(() => import('./Settings'));

export const supplierRoutes: RouteObject[] = [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'quotes/requests', element: <QuoteRequests /> },
    { path: 'quotes/submit', element: <SubmitQuote /> },
    { path: 'quotes/won', element: <WonQuotes /> },
    { path: 'quotes/lost', element: <LostQuotes /> },
    { path: 'quotes/negotiation', element: <QuoteNegotiation /> },
    { path: 'orders/active-jobs', element: <ActiveJobs /> },
    { path: 'orders/pod', element: <POD /> },
    { path: 'orders/details', element: <OrderDetails /> },
    { path: 'availability/calendar', element: <Calendar /> },
    { path: 'availability/routes', element: <Routes /> },
    { path: 'availability/create', element: <CreateAvailability /> },
    { path: 'employees', element: <EmployeeManagement /> },
    { path: 'finance/earnings', element: <Earnings /> },
    { path: 'finance/withdrawal', element: <Withdrawal /> },
    { path: 'finance/payments', element: <Payments /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'settings', element: <Settings /> },
];
