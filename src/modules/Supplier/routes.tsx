import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import QuoteRequests from './QuoteManagement/QuoteRequests';
import WonQuotes from './QuoteManagement/WonQuotes';
import PermissionGuard from '@/components/common/PermissionGuard';

// Role Specific Dashboards
const DriverDashboard = lazy(() => import('./Dashboard/DriverDashboard'));
const FinanceDashboard = lazy(() => import('./Dashboard/FinanceDashboard'));
const OperationsDashboard = lazy(() => import('./Dashboard/OperationsDashboard'));
const SalesDashboard = lazy(() => import('./Dashboard/SalesDashboard'));
const SupportDashboard = lazy(() => import('./Dashboard/SupportDashboard'));

const SubmitQuote = lazy(() => import('./QuoteManagement/SubmitQuote'));
const QuoteNegotiation = lazy(() => import('./QuoteManagement/Negotiation'));
const QuoteNegotiationChat = lazy(() => import('./QuoteManagement/Negotiation/Chat'));
const ActiveJobs = lazy(() => import('./OrderManagement/ActiveJobs'));
const AssignDriver = lazy(() => import('./OrderManagement/AssignDriver'));
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
const TeamMemberProfilePage = lazy(() => import('./TeamManagement/TeamMemberProfilePage'));
const Earnings = lazy(() => import('./Finance/Earnings'));
const Withdrawal = lazy(() => import('./Finance/Withdrawal'));
const Payments = lazy(() => import('./Finance/Payments'));
const Subscription = lazy(() => import('./Subscription'));
import Notifications from './Notifications';
import Messages from './Messages';
const Settings = lazy(() => import('./Settings'));

export const supplierRoutes: RouteObject[] = [
    { index: true, element: <Navigate to="/supplier/dashboard" replace /> },
    { path: '', element: <Navigate to="/supplier/dashboard" replace /> },
    
    // Executive / Default Dashboard
    { path: 'dashboard', element: <Dashboard /> },

    // Role-Specific Dedicated Dashboards
    { 
        path: 'driver/dashboard', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <DriverDashboard />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'finance/dashboard', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <FinanceDashboard />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'operations/dashboard', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OperationsDashboard />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'sales/dashboard', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <SalesDashboard />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'support/dashboard', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <SupportDashboard />
            </PermissionGuard>
        ) 
    },

    // Quotes & Bidding
    { 
        path: 'quotes', 
        element: <Navigate to="/supplier/quotes/requests" replace /> 
    },
    { 
        path: 'quotes/requests', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteRequests />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/requests/:slug', 
        element: (
            <PermissionGuard requiredPermission="quotes.submit">
                <SubmitQuote />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/submit', 
        element: (
            <PermissionGuard requiredPermission="quotes.submit">
                <SubmitQuote />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/submit/:slug', 
        element: (
            <PermissionGuard requiredPermission="quotes.submit">
                <SubmitQuote />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/won', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <WonQuotes />
            </PermissionGuard>
        ) 
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
        ) 
    },
    { 
        path: 'quotes/negotiation/conversation/:id', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/negotiation/conversation/:id/:sessionKey', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/negotiation/view/:id', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/negotiation/view/:id/:sessionKey', 
        element: (
            <PermissionGuard requiredPermission="quotes.view">
                <QuoteNegotiationChat />
            </PermissionGuard>
        ) 
    },

    // Order Management
    { 
        path: 'orders', 
        element: <Navigate to="/supplier/orders/active-jobs" replace /> 
    },
    { 
        path: 'orders/active-jobs', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <ActiveJobs />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'orders/assign-driver', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <AssignDriver />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'orders/pod', 
        element: (
            <PermissionGuard requiredPermission="orders.upload_pod">
                <POD />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'orders/pod/:slug', 
        element: (
            <PermissionGuard requiredPermission="orders.upload_pod">
                <POD />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'orders/details', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'orders/details/:slug', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'orders/track/:slug', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'quotes/processing/track/:id', 
        element: (
            <PermissionGuard requiredPermission="orders.view">
                <OrderDetails />
            </PermissionGuard>
        ) 
    },

    // Availability & Fleet Management
    { 
        path: 'availability', 
        element: <Navigate to="/supplier/availability/dashboard" replace /> 
    },
    { 
        path: 'availability/dashboard', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <AvailabilityDashboard />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/calendar', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <Calendar />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/schedule', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <AvailabilitySchedule />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/schedule/create', 
        element: (
            <PermissionGuard requiredPermission="fleet.manage_vehicles">
                <CreateAvailabilitySchedule />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/routes', 
        element: (
            <PermissionGuard requiredPermission="fleet.track">
                <Routes />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/drivers', 
        element: (
            <PermissionGuard requiredPermission="fleet.manage_drivers">
                <DriversAvailability />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/vehicles', 
        element: (
            <PermissionGuard requiredPermission="fleet.manage_vehicles">
                <VehiclesAvailability />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/blackout-dates', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <BlackoutDates />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/time-slots', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <TimeSlots />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/capacity', 
        element: (
            <PermissionGuard requiredPermission="fleet.manage_vehicles">
                <CapacityManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'availability/settings', 
        element: (
            <PermissionGuard requiredPermission="fleet.view">
                <AvailabilitySettings />
            </PermissionGuard>
        ) 
    },

    // Team Management
    { 
        path: 'team', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/dashboard', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/members', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/roles', 
        element: (
            <PermissionGuard requiredPermission="team.edit_roles">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/invitations', 
        element: (
            <PermissionGuard requiredPermission="team.invite">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/logs', 
        element: (
            <PermissionGuard requiredPermission="team.activity_logs">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/activity-logs', 
        element: (
            <PermissionGuard requiredPermission="team.activity_logs">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/trash', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/trash-bin', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamManagement />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/member/:id', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamMemberProfilePage />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/members/:id', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamMemberProfilePage />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'team/:id', 
        element: (
            <PermissionGuard requiredPermission="team.view">
                <TeamMemberProfilePage />
            </PermissionGuard>
        ) 
    },

    // Finance & Billing
    { 
        path: 'finance', 
        element: <Navigate to="/supplier/finance/withdrawal" replace /> 
    },
    { 
        path: 'finance/earnings', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <Earnings />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'finance/withdrawal', 
        element: (
            <PermissionGuard requiredPermission="finance.withdraw">
                <Withdrawal />
            </PermissionGuard>
        ) 
    },
    { 
        path: 'finance/payments', 
        element: (
            <PermissionGuard requiredPermission="finance.invoices">
                <Payments />
            </PermissionGuard>
        ) 
    },

    // Owner only subscription
    { 
        path: 'subscription', 
        element: (
            <PermissionGuard ownerOnly={true}>
                <Subscription />
            </PermissionGuard>
        ) 
    },

    // Notifications & Messages
    { path: 'notifications', element: <Notifications /> },
    { path: 'messages', element: <Messages /> },
    { path: 'messages/:partnerId', element: <Messages /> },
    { path: 'messages/:partnerId/:sessionKey', element: <Messages /> },

    // Settings
    { 
        path: 'settings', 
        element: (
            <PermissionGuard requiredPermission="settings.company_profile">
                <Settings />
            </PermissionGuard>
        ) 
    },
];
