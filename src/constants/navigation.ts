import {
    Activity,
    Bell,
    Calendar,
    Clock,
    CreditCard,
    Euro,
    FileBarChart,
    FileCheck,
    FileText,
    HandCoins,
    LayoutDashboard,
    Map,
    MessageSquare,
    Package,
    PieChart, Receipt,
    RotateCcw,
    Settings,
    ShieldCheck,
    ShoppingCart,
    Truck,
    UserCircle,
    UserCheck,
    Users
} from 'lucide-react';

export interface NavItem {
    name: string;
    path: string;
    icon: any;
    permission?: string;
    ownerOnly?: boolean;
}

export interface NavGroupItem {
    category?: string;
    name?: string;
    path?: string;
    group?: string;
    icon: any;
    permission?: string;
    ownerOnly?: boolean;
    items?: NavItem[];
}

export const navigationMap: Record<string, any[]> = {
    'dashboard': [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', path: '/dashboard/analytics', icon: FileBarChart },
    ],

    'sales': [
        { category: 'Main Menu', name: 'Customers', path: '/sales/customers', icon: Users },
        { category: 'Main Menu', name: 'Quotations', path: '/sales/quotations', icon: FileText },
        { category: 'Main Menu', name: 'Orders', path: '/sales/orders', icon: ShoppingCart },
        { category: 'Main Menu', name: 'Invoices', path: '/sales/invoices', icon: Receipt },
        { category: 'Main Menu', name: 'Payments', path: '/sales/payments', icon: CreditCard },
        { category: 'Main Menu', name: 'Returns', path: '/sales/returns', icon: RotateCcw },
    ],

    'supplier': [
        { category: 'Main Menu', name: 'Dashboard', path: '/supplier/dashboard', icon: LayoutDashboard },
        {
            category: 'Main Menu',
            group: 'Quote Management',
            icon: FileText,
            permission: 'quotes.view',
            items: [
                { name: 'Quote Requests', path: '/supplier/quotes/requests', icon: FileText, permission: 'quotes.view' },
                { name: 'Won Quotes', path: '/supplier/quotes/won', icon: FileText, permission: 'quotes.view' },
                { name: 'Negotiation', path: '/supplier/quotes/negotiation', icon: FileText, permission: 'quotes.view' },
            ]
        },
        {
            category: 'Main Menu',
            group: 'Order Management',
            icon: Package,
            permission: 'orders.view',
            items: [
                { name: 'Active Jobs', path: '/supplier/orders/active-jobs', icon: Activity, permission: 'orders.view' },
                { name: 'Assign Driver', path: '/supplier/orders/assign-driver', icon: UserCheck, permission: 'orders.view' },
                { name: 'POD', path: '/supplier/orders/pod', icon: FileCheck, permission: 'orders.upload_pod' },
            ]
        },
        {
            category: 'Main Menu',
            group: 'Availability',
            icon: Calendar,
            permission: 'fleet.view',
            items: [
                { name: 'Dashboard', path: '/supplier/availability/dashboard', icon: LayoutDashboard, permission: 'fleet.view' },
                { name: 'Calendar', path: '/supplier/availability/calendar', icon: Calendar, permission: 'fleet.view' },
                { name: 'Availability Schedule', path: '/supplier/availability/schedule', icon: Calendar, permission: 'fleet.view' },
                { name: 'Routes', path: '/supplier/availability/routes', icon: Map, permission: 'fleet.track' },
                { name: 'Drivers Availability', path: '/supplier/availability/drivers', icon: UserCircle, permission: 'fleet.manage_drivers' },
                { name: 'Vehicles Availability', path: '/supplier/availability/vehicles', icon: Truck, permission: 'fleet.manage_vehicles' },
                { name: 'Blackout Dates', path: '/supplier/availability/blackout-dates', icon: Calendar, permission: 'fleet.view' },
                { name: 'Time Slots', path: '/supplier/availability/time-slots', icon: Clock, permission: 'fleet.view' },
                { name: 'Capacity Management', path: '/supplier/availability/capacity', icon: PieChart, permission: 'fleet.manage_vehicles' },
                { name: 'Settings', path: '/supplier/availability/settings', icon: Settings, permission: 'fleet.view' },
            ]
        },
        { category: 'Main Menu', name: 'Team Management', path: '/supplier/team', icon: Users, permission: 'team.view' },
        {
            category: 'Main Menu',
            group: 'Finance',
            icon: Euro,
            permission: 'finance.view_earnings',
            items: [
                { name: 'Earnings', path: '/supplier/finance/earnings', icon: HandCoins, permission: 'finance.view_earnings' },
                { name: 'Withdrawal', path: '/supplier/finance/withdrawal', icon: CreditCard, permission: 'finance.withdraw' },
                { name: 'Payments', path: '/supplier/finance/payments', icon: Receipt, permission: 'finance.invoices' },
            ]
        },
        { category: 'Main Menu', name: 'Subscription', path: '/supplier/subscription', icon: ShieldCheck, ownerOnly: true },
        { category: 'Main Menu', name: 'Notifications', path: '/supplier/notifications', icon: Bell },
        { category: 'Main Menu', name: 'Messages', path: '/supplier/messages', icon: MessageSquare },
        { category: 'Main Menu', name: 'Settings', path: '/supplier/settings', icon: Settings, permission: 'settings.company_profile' },
    ],
    'customer': [
        { category: 'Main Menu', name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
        {
            category: 'Main Menu',
            group: 'Quote Management',
            icon: FileText,
            items: [
                { name: 'Create Request', path: '/customer/quotes/create', icon: FileText },
                { name: 'Processing', path: '/customer/quotes/processing', icon: Activity },
                { name: 'Quotes Received', path: '/customer/quotes/received', icon: FileText },
                { name: 'Negotiation', path: '/customer/quotes/negotiation', icon: FileText },
            ]
        },
        {
            category: 'Main Menu',
            group: 'Order Management',
            icon: Package,
            items: [
                { name: 'Orders', path: '/customer/orders', icon: Package },
            ]
        },
        {
            category: 'Main Menu',
            group: 'Finance',
            icon: Euro,
            items: [
                { name: 'Billing', path: '/customer/finance/billing', icon: Receipt },
                { name: 'Invoices', path: '/customer/finance/invoices', icon: FileText },
                { name: 'Payments', path: '/customer/finance/payments', icon: CreditCard },
                { name: 'Pay Later Facility', path: '/customer/finance/pay-later', icon: Euro },
            ]
        },
        { category: 'Main Menu', name: 'Subscription', path: '/customer/subscription', icon: ShieldCheck },
        { category: 'Main Menu', name: 'Notifications', path: '/customer/notifications', icon: Bell },
        { category: 'Main Menu', name: 'Messages', path: '/customer/messages', icon: MessageSquare },
        { category: 'Main Menu', name: 'Settings', path: '/customer/settings', icon: Settings },
    ],
};
