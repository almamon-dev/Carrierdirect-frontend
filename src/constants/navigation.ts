import {
    LayoutDashboard, Users, ShoppingCart, Package,
    FileText, Settings, Briefcase, Calculator, PieChart, Receipt, Truck, Building2, Brain,
    Calendar, FileBarChart, HandCoins, UserCircle, UserPlus, Boxes, FileSpreadsheet, Map, ClipboardList, ShieldCheck,
    Network, Globe, Mail, Webhook, HardDrive, Lock, RefreshCcw, CreditCard, Bell, Key, Activity, Clock, Shield, Database, Phone, CheckCircle, RotateCcw, Tags, Layers, Home, Target, FileCheck, Smartphone, Euro, Languages, Cloud, MessageSquare, Link, Workflow, ListTree, Zap, TrendingUp, ListPlus, TextCursorInput, FileCode, MapPin, FolderOpen, UploadCloud, Image, Printer, Bot, TerminalSquare, Gauge, Cpu, Type, Wrench, ListOrdered, Timer, Terminal, Server, AlertTriangle, LineChart, ShieldAlert
} from 'lucide-react';

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
            items: [
                { name: 'Quote Requests', path: '/supplier/quotes/requests', icon: FileText },
                { name: 'Submit Quote', path: '/supplier/quotes/submit', icon: FileText },
                { name: 'Won Quotes', path: '/supplier/quotes/won', icon: FileText },
                { name: 'Lost Quotes', path: '/supplier/quotes/lost', icon: FileText },
                { name: 'Negotiation', path: '/supplier/quotes/negotiation', icon: FileText },
            ]
        },
        {
            category: 'Main Menu',
            group: 'Order Management',
            icon: Package,
            items: [
                { name: 'Active Jobs', path: '/supplier/orders/active-jobs', icon: Activity },
                { name: 'POD', path: '/supplier/orders/pod', icon: FileCheck },
            ]
        },
        {
            category: 'Main Menu',
            group: 'Availability',
            icon: Calendar,
            items: [
                { name: 'Dashboard', path: '/supplier/availability/dashboard', icon: LayoutDashboard },
                { name: 'Calendar', path: '/supplier/availability/calendar', icon: Calendar },
                { name: 'Availability Schedule', path: '/supplier/availability/schedule', icon: Calendar },
                { name: 'Routes', path: '/supplier/availability/routes', icon: Map },
                { name: 'Drivers Availability', path: '/supplier/availability/drivers', icon: UserCircle },
                { name: 'Vehicles Availability', path: '/supplier/availability/vehicles', icon: Truck },
                { name: 'Blackout Dates', path: '/supplier/availability/blackout-dates', icon: Calendar },
                { name: 'Time Slots', path: '/supplier/availability/time-slots', icon: Clock },
                { name: 'Capacity Management', path: '/supplier/availability/capacity', icon: PieChart },
                { name: 'Settings', path: '/supplier/availability/settings', icon: Settings },
            ]
        },
        { category: 'Main Menu', name: 'Team Management', path: '/supplier/team', icon: Users },
        {
            category: 'Main Menu',
            group: 'Finance',
            icon: Euro,
            items: [
                { name: 'Earnings', path: '/supplier/finance/earnings', icon: HandCoins },
                { name: 'Withdrawal', path: '/supplier/finance/withdrawal', icon: CreditCard },
                { name: 'Payments', path: '/supplier/finance/payments', icon: Receipt },
            ]
        },
        { category: 'Main Menu', name: 'Subscription', path: '/supplier/subscription', icon: ShieldCheck },
        { category: 'Main Menu', name: 'Notifications', path: '/supplier/notifications', icon: Bell },
        { category: 'Main Menu', name: 'Settings', path: '/supplier/settings', icon: Settings },
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
        { category: 'Main Menu', name: 'Settings', path: '/customer/settings', icon: Settings },
    ],
};
