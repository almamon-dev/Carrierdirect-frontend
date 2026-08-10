import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

const Dashboard = lazy(() => import('./Dashboard'));
const QuoteRequests = lazy(() => import('./QuoteManagement/QuoteRequests'));
const SubmitQuote = lazy(() => import('./QuoteManagement/SubmitQuote'));
const WonQuotes = lazy(() => import('./QuoteManagement/WonQuotes'));
const LostQuotes = lazy(() => import('./QuoteManagement/LostQuotes'));
const QuoteNegotiation = lazy(() => import('./QuoteManagement/Negotiation'));
const QuoteNegotiationChat = lazy(() => import('./QuoteManagement/Negotiation/Chat'));
const ActiveJobs = lazy(() => import('./OrderManagement/ActiveJobs'));
const POD = lazy(() => import('./OrderManagement/POD'));
const OrderDetails = lazy(() => import('./OrderManagement/Details'));
const Calendar = lazy(() => import('./Availability/Calendar'));
const Routes = lazy(() => import('./Availability/Routes'));
const AvailabilityDashboard = lazy(() => import('./Availability/Dashboard'));
const AvailabilitySchedule = lazy(() => import('./Availability/AvailabilitySchedule'));
const CreateAvailabilitySchedule = lazy(() => import('./Availability/AvailabilitySchedule/Create'));
const DriversAvailability = lazy(() => import('./Availability/DriversAvailability'));
const VehiclesAvailability = lazy(() => import('./Availability/VehiclesAvailability'));
const BlackoutDates = lazy(() => import('./Availability/BlackoutDates'));
const TimeSlots = lazy(() => import('./Availability/TimeSlots'));
const CapacityManagement = lazy(() => import('./Availability/CapacityManagement'));
const AvailabilitySettings = lazy(() => import('./Availability/Settings'));
const TeamManagement = lazy(() => import('./TeamManagement'));
const Earnings = lazy(() => import('./Finance/Earnings'));
const Withdrawal = lazy(() => import('./Finance/Withdrawal'));
const Payments = lazy(() => import('./Finance/Payments'));
const Subscription = lazy(() => import('./Subscription'));
const Notifications = lazy(() => import('./Notifications'));
const Settings = lazy(() => import('./Settings'));
const CompleteProfile = lazy(() => import('./CompleteProfile/CompleteProfilePage'));

export const supplierRoutes: RouteObject[] = [
    { index: true, element: <Navigate to="/supplier/dashboard" replace /> },
    { path: '', element: <Navigate to="/supplier/dashboard" replace /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'quotes/requests', element: <QuoteRequests /> },
    { path: 'quotes/requests/:slug', element: <SubmitQuote /> },
    { path: 'quotes/submit', element: <SubmitQuote /> },
    { path: 'quotes/submit/:slug', element: <SubmitQuote /> },
    { path: 'quotes/won', element: <WonQuotes /> },
    { path: 'quotes/lost', element: <LostQuotes /> },
    { path: 'quotes/negotiation', element: <QuoteNegotiation /> },
    { path: 'quotes/negotiation/view/:id', element: <QuoteNegotiationChat /> },
    { path: 'orders/active-jobs', element: <ActiveJobs /> },
    { path: 'orders/pod', element: <POD /> },
    { path: 'orders/pod/:slug', element: <POD /> },
    { path: 'orders/details', element: <OrderDetails /> },
    { path: 'orders/details/:slug', element: <OrderDetails /> },
    { path: 'availability/dashboard', element: <AvailabilityDashboard /> },
    { path: 'availability/calendar', element: <Calendar /> },
    { path: 'availability/schedule', element: <AvailabilitySchedule /> },
    { path: 'availability/schedule/create', element: <CreateAvailabilitySchedule /> },
    { path: 'availability/routes', element: <Routes /> },
    { path: 'availability/drivers', element: <DriversAvailability /> },
    { path: 'availability/vehicles', element: <VehiclesAvailability /> },
    { path: 'availability/blackout-dates', element: <BlackoutDates /> },
    { path: 'availability/time-slots', element: <TimeSlots /> },
    { path: 'availability/capacity', element: <CapacityManagement /> },
    { path: 'availability/settings', element: <AvailabilitySettings /> },
    { path: 'team', element: <TeamManagement /> },
    { path: 'finance/earnings', element: <Earnings /> },
    { path: 'finance/withdrawal', element: <Withdrawal /> },
    { path: 'finance/payments', element: <Payments /> },
    { path: 'subscription', element: <Subscription /> },
    { path: 'notifications', element: <Notifications /> },
    { path: 'settings', element: <Settings /> },
];
