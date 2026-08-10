import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { 
    CheckCheck, MessageSquare, FileText, 
    Truck, Euro, ShieldCheck, ExternalLink, Trash2, Bell, CheckCircle2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'quotes' | 'finance'>('all');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const [notifications, setNotifications] = useState([
        { 
            id: 1, 
            type: 'Quote', 
            title: 'New Counter-Offer Received', 
            message: 'DHL Freight submitted a counter-offer of €850 for RFQ-9042 (Frankfurt to Paris).', 
            time: '10 mins ago', 
            unread: true, 
            icon: FileText, 
            color: 'text-[#ff4a1f]', 
            bg: 'bg-orange-50 border-orange-200',
            category: 'quotes',
            link: '/customer/quotes/create'
        },
        { 
            id: 2, 
            type: 'Message', 
            title: 'New Carrier Message', 
            message: 'Express Logistics: "Driver is currently 15 mins away from origin pickup point."', 
            time: '45 mins ago', 
            unread: true, 
            icon: MessageSquare, 
            color: 'text-[#ff4a1f]', 
            bg: 'bg-orange-50 border-orange-200',
            category: 'quotes',
            link: '/customer/quotes/create'
        },
        { 
            id: 3, 
            type: 'Order', 
            title: 'Shipment In Transit', 
            message: 'Order ORDER-4921 has been picked up and is actively tracked via live GPS.', 
            time: '2 hours ago', 
            unread: true, 
            icon: Truck, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50 border-blue-200',
            category: 'quotes',
            link: '/customer/orders'
        },
        { 
            id: 4, 
            type: 'Finance', 
            title: 'Escrow Funds Reserved', 
            message: '€1,188.00 has been placed in secure escrow for accepted quote #Q-8821.', 
            time: '5 hours ago', 
            unread: false, 
            icon: Euro, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50 border-emerald-200',
            category: 'finance',
            link: '/customer/subscription'
        },
        { 
            id: 5, 
            type: 'Order', 
            title: 'Proof of Delivery Uploaded', 
            message: 'Driver uploaded POD signature for ORDER-4890. Please confirm delivery.', 
            time: '1 day ago', 
            unread: false, 
            icon: CheckCheck, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50 border-emerald-200',
            category: 'quotes',
            link: '/customer/orders'
        },
        { 
            id: 6, 
            type: 'System', 
            title: 'Subscription Active', 
            message: 'Your Enterprise Shipper plan (Annual) is active. Auto-renewal scheduled for Jul 2027.', 
            time: '3 days ago', 
            unread: false, 
            icon: ShieldCheck, 
            color: 'text-purple-600', 
            bg: 'bg-purple-50 border-purple-200',
            category: 'finance',
            link: '/customer/subscription'
        },
    ]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        showToast('All notifications marked as read.');
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
        showToast('Notification marked as read.');
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        showToast('Notification deleted.');
    };

    const unreadCount = notifications.filter(n => n.unread).length;

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'unread') return n.unread;
        if (activeTab === 'quotes') return n.category === 'quotes';
        if (activeTab === 'finance') return n.category === 'finance';
        return true;
    });

    const columns = [
        { 
            id: 'type', 
            label: 'Type', 
            render: (row: any) => {
                const Icon = row.icon;
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${row.bg} ${row.color}`}>
                            <Icon size={14} strokeWidth={2.2} />
                        </div>
                        <span className="text-[12px] font-bold text-slate-800">{row.type}</span>
                    </div>
                );
            } 
        },
        { 
            id: 'title', 
            label: 'Title & Summary', 
            render: (row: any) => (
                <div className="space-y-0.5 py-0.5">
                    <div className="flex items-center gap-2">
                        <span className={`text-[13px] ${row.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                            {row.title}
                        </span>
                        {row.unread && (
                            <Badge className="bg-[#ff4a1f] text-white text-[9px] font-bold px-1.5 py-0 h-4 border-none">
                                NEW
                            </Badge>
                        )}
                    </div>
                    <p className={`text-[11.5px] leading-relaxed max-w-2xl ${row.unread ? 'text-slate-700 font-medium' : 'text-slate-500 font-normal'}`}>
                        {row.message}
                    </p>
                </div>
            ) 
        },
        { 
            id: 'time', 
            label: 'Time', 
            render: (row: any) => <span className="text-[11.5px] text-slate-500 font-medium">{row.time}</span> 
        },
        {
            id: 'action',
            label: 'Actions',
            render: (row: any) => (
                <div className="flex items-center justify-end gap-1">
                    {row.unread && (
                        <button 
                            onClick={() => markAsRead(row.id)}
                            className="text-[11px] font-bold text-[#ff4a1f] hover:underline px-2 py-1 rounded hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Mark as read"
                        >
                            Mark Read
                        </button>
                    )}
                    {row.link && (
                        <button 
                            onClick={() => {
                                markAsRead(row.id);
                                navigate(row.link);
                            }}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:text-[#ff4a1f] hover:bg-orange-50 transition-colors cursor-pointer"
                            title="View details"
                        >
                            <ExternalLink size={14} />
                        </button>
                    )}
                    <button 
                        onClick={() => deleteNotification(row.id)}
                        className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete notification"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 font-sans antialiased pb-20 min-h-screen relative">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Bell className="w-4.5 h-4.5 text-[#ff4a1f]" />
                        Customer Notifications
                        {unreadCount > 0 && (
                            <Badge className="bg-orange-50 text-[#ff4a1f] border border-orange-200 h-5 px-2 text-[10px] font-bold">
                                {unreadCount} Unread
                            </Badge>
                        )}
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Manage all quote counter-offers, active shipment updates, escrow guarantees, and invoice alerts.
                    </p>
                </div>

                <Button 
                    variant="outline" 
                    className="h-8 text-xs px-3 gap-1.5 shadow-2xs cursor-pointer" 
                    onClick={markAllRead} 
                    disabled={unreadCount === 0}
                >
                    <CheckCheck size={14} />
                    Mark all as read
                </Button>
            </div>

            {/* Main Notifications Card with Filter Header Tabs */}
            <Card className="shadow-2xs border-slate-200">
                <CardHeader className="py-2.5 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                        <span>Notification Activity History</span>
                        <span className="text-[11px] font-medium text-slate-500">({filteredNotifications.length} items)</span>
                    </CardTitle>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200 shadow-2xs text-xs">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                activeTab === 'all' ? 'bg-[#ff4a1f] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('unread')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                activeTab === 'unread' ? 'bg-[#ff4a1f] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('quotes')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                activeTab === 'quotes' ? 'bg-[#ff4a1f] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Quotes & Orders
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('finance')}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                activeTab === 'finance' ? 'bg-[#ff4a1f] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Finance
                        </button>
                    </div>
                </CardHeader>

                <div className="p-0">
                    <DataTable 
                        columns={columns} 
                        data={filteredNotifications} 
                        searchPlaceholder="Search notification history..."
                        hideViewToggle={true}
                    />
                </div>
            </Card>

            {/* Toast Notification Alert */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                    <button 
                        onClick={() => setToastMessage(null)} 
                        className="ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
