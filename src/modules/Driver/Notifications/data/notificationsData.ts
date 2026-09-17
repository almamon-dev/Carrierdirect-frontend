import { DriverNotification } from '../../types';

export const initialDriverNotifications: DriverNotification[] = [
    {
        id: 'notif-1',
        title: 'New Freight Load Assigned',
        message: 'Order ORD-99415 (Philadelphia ➔ Baltimore) has been assigned to your truck.',
        type: 'trip_assigned',
        timestamp: '15 mins ago',
        isRead: false,
        actionUrl: '/driver/shipments/SHP-8822',
        priority: 'high',
    },
    {
        id: 'notif-2',
        title: 'Route Traffic Alert',
        message: 'Heavy congestion reported on I-95 South near exit 26. Dispatcher suggests exit 22 reroute.',
        type: 'route_update',
        timestamp: '45 mins ago',
        isRead: false,
        actionUrl: '/driver/chat',
        priority: 'urgent',
    },
    {
        id: 'notif-3',
        title: 'POD Approved & Payout Credited',
        message: 'POD for order ORD-99380 has been verified. $820.00 added to your driver balance.',
        type: 'payout',
        timestamp: '2 hours ago',
        isRead: true,
        actionUrl: '/driver/profile',
        priority: 'normal',
    },
    {
        id: 'notif-4',
        title: 'Daily Safety Inspection Logged',
        message: 'Your vehicle pre-trip safety checklist for Cascadia ABC-987654 was verified.',
        type: 'safety_alert',
        timestamp: 'Today, 07:15 AM',
        isRead: true,
        actionUrl: '/driver/profile',
        priority: 'normal',
    },
];
