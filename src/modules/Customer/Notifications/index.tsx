import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { 
    CheckCheck, MessageSquare, FileText, 
    Truck, Euro, ShieldCheck, ExternalLink, Trash2, Bell, CheckCircle2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';

export default function Notifications() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'quotes' | 'finance'>('all');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const fetchNotifications = async () => {
        try {
            const res = await apiClient.get('/customer/notifications');
            const list = res.data?.notifications || res.data?.data || res.data || [];
            setNotifications(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            setNotifications([]);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string | number) => {
        try {
            await apiClient.post(`/customer/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false, read_at: new Date().toISOString() } : n));
            showToast("Notification marked as read");
        } catch (error) {
            console.error('Failed to mark notification read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            await apiClient.post('/customer/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, unread: false, read_at: new Date().toISOString() })));
            showToast("All notifications marked as read");
        } catch (error) {
            console.error('Failed to mark all read:', error);
        }
    };

    const deleteNotification = (id: string | number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        showToast("Notification removed");
    };

    const unreadCount = notifications.filter(n => n.unread || !n.read_at).length;

    const filteredNotifications = notifications.filter(item => {
        const isUnread = item.unread || !item.read_at;
        if (activeTab === 'unread') return isUnread;
        const category = (item.category || item.type || '').toLowerCase();
        if (activeTab === 'quotes') return category.includes('quote') || category.includes('order') || category.includes('message');
        if (activeTab === 'finance') return category.includes('finance') || category.includes('invoice') || category.includes('payment');
        return true;
    });

    const columns: Column<any>[] = [
        {
            id: 'notification',
            label: 'Notification Detail',
            render: (row: any) => {
                const IconComponent = row.icon || Bell;
                const isUnread = row.unread || !row.read_at;
                return (
                    <div className="flex items-start gap-3 py-1">
                        <div className={`p-2.5 rounded-lg border shrink-0 ${row.bg || 'bg-orange-50 border-orange-200'}`}>
                            <IconComponent className={`w-4 h-4 ${row.color || 'text-[#ff4a1f]'}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className={`text-xs font-bold ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {row.title || row.data?.title || 'System Notification'}
                                </h4>
                                {isUnread && (
                                    <Badge className="bg-[#ff4a1f] text-white text-[9px] font-bold px-1.5 py-0 rounded">
                                        NEW
                                    </Badge>
                                )}
                            </div>
                            <p className={`text-[11.5px] leading-relaxed max-w-2xl ${isUnread ? 'text-slate-700 font-medium' : 'text-slate-500 font-normal'}`}>
                                {row.message || row.data?.message || row.data?.body || 'No detail provided.'}
                            </p>
                        </div>
                    </div>
                );
            }
        },
        { 
            id: 'time', 
            label: 'Time', 
            render: (row: any) => <span className="text-[11.5px] text-slate-500 font-medium whitespace-nowrap">{row.time || row.time_ago || row.created_at_formatted || 'Recently'}</span> 
        },
        {
            id: 'action',
            label: 'Actions',
            render: (row: any) => {
                const isUnread = row.unread || !row.read_at;
                return (
                    <div className="flex items-center justify-end gap-1">
                        {isUnread && (
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
                );
            }
        }
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 font-sans antialiased pb-20 min-h-screen relative">
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

            <Card className="shadow-2xs border-slate-200">
                <CardHeader className="py-2.5 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                        <span>Notification Activity History</span>
                        <span className="text-[11px] font-medium text-slate-500">({filteredNotifications.length} items)</span>
                    </CardTitle>

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
                        emptyState={
                            <EmptyState
                                icon={Bell}
                                title="No Notifications Found"
                                description="You don't have any notifications or alerts matching your filter."
                            />
                        }
                    />
                </div>
            </Card>

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
