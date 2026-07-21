import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { 
    CheckCheck, MessageSquare, FileText, 
    Truck, Euro, AlertTriangle, ExternalLink
} from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'Quote', title: 'New Quote Request', message: 'You have received a new quote request from Acme Corp for a 3-bedroom house move.', time: '10 mins ago', unread: true, icon: FileText, color: 'text-brand', bg: 'bg-brand-light' },
        { id: 2, type: 'Message', title: 'New Message', message: 'TechFlow Inc replied to your quote: "Can we adjust the pickup time?"', time: '1 hour ago', unread: true, icon: MessageSquare, color: 'text-brand', bg: 'bg-brand-light' },
        { id: 3, type: 'Order', title: 'Job Assigned', message: 'Congratulations! Global Logistics has accepted your quote for JOB-9021.', time: '3 hours ago', unread: false, icon: Truck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 4, type: 'Finance', title: 'Payout Processed', message: 'Your payout of €4,225.00 has been successfully processed via Stripe.', time: '1 day ago', unread: false, icon: Euro, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 5, type: 'System', title: 'System Maintenance', message: 'GetItMoving will undergo scheduled maintenance on July 25th at 2:00 AM UTC.', time: '2 days ago', unread: false, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 6, type: 'Order', title: 'Proof of Delivery Approved', message: 'The customer has approved the POD for JOB-9018. Funds are now clearing.', time: '3 days ago', unread: false, icon: CheckCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const columns = [
        { 
            id: 'type', 
            label: 'Type', 
            render: (row: any) => {
                const Icon = row.icon;
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${row.bg} ${row.color}`}>
                            <Icon size={12} strokeWidth={2.5} />
                        </div>
                        <span className="text-[12px] font-semibold text-slate-700">{row.type}</span>
                    </div>
                );
            } 
        },
        { 
            id: 'title', 
            label: 'Title', 
            render: (row: any) => (
                <span className={`text-[13px] ${row.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {row.title}
                </span>
            ) 
        },
        { 
            id: 'message', 
            label: 'Message', 
            className: 'whitespace-normal min-w-[300px]',
            render: (row: any) => (
                <span className={`text-[12px] leading-relaxed ${row.unread ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>
                    {row.message}
                </span>
            ) 
        },
        { 
            id: 'time', 
            label: 'Time', 
            render: (row: any) => <span className="text-[12px] text-slate-500 font-medium">{row.time}</span> 
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row: any) => (
                row.unread ? 
                <Badge className="bg-brand text-white h-5 px-1.5 text-[9px] font-bold border-none">NEW</Badge> : 
                <span className="text-[11px] text-slate-400 font-medium">Read</span>
            )
        },
        {
            id: 'action',
            label: '',
            render: (row: any) => (
                <div className="flex justify-end">
                     <button className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-brand hover:bg-brand-light transition-colors" title="View details">
                        <ExternalLink size={14} />
                    </button>
                </div>
            )
        }
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                            <Badge className="bg-brand-light text-blue-700 h-5 px-1.5 text-[10px] font-bold">{unreadCount} Unread</Badge>
                        )}
                    </h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Manage all your alerts, messages, and system updates.</p>
                </div>
                <Button variant="outline" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm" onClick={markAllRead} disabled={unreadCount === 0}>
                    <CheckCheck size={14} />
                    Mark all as read
                </Button>
            </div>

            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-slate-100">
                    <CardTitle className="text-[13px]">Notification History</CardTitle>
                </CardHeader>
                <div className="p-0">
                    <DataTable 
                        columns={columns} 
                        data={notifications} 
                        searchPlaceholder="Search notifications..."
                        hideViewToggle={true}
                    />
                </div>
            </Card>
        </div>
    );
}
