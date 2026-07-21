import React from 'react';
import { Activity, LogIn, Lock, CheckCircle, Package, Truck, CreditCard, Settings } from 'lucide-react';
import Select from '@/components/ui/select';

export default function ActivityLogsTab() {
    const logs = [
        { id: 1, user: 'John Doe', action: 'Accepted Quote', target: 'QT-8822', time: '10:30 AM, Today', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 2, user: 'Jane Smith', action: 'Assigned Driver', target: 'Order #1023', time: '09:15 AM, Today', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 3, user: 'Sarah Lee', action: 'Updated Shipment', target: 'SH-4421', time: 'Yesterday, 04:30 PM', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 4, user: 'John Doe', action: 'Login History', target: 'System Access', time: 'Yesterday, 09:00 AM', icon: LogIn, color: 'text-slate-600', bg: 'bg-slate-100' },
        { id: 5, user: 'Mike Ross', action: 'Password Changed', target: 'Security', time: 'Jul 15, 10:00 AM', icon: Lock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 6, user: 'Admin', action: 'Settings Updated', target: 'Company Profile', time: 'Jul 10, 02:00 PM', icon: Settings, color: 'text-slate-600', bg: 'bg-slate-100' },
    ];

    return (
        <div className="p-4 h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Activity Logs</h2>
                    <p className="text-[13px] text-slate-500 mt-1">Recent actions performed by your team members.</p>
                </div>
                <div className="flex gap-2">
                    <Select 
                        className="w-[140px]"
                        value="all"
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Members' },
                            { id: 'john', name: 'John Doe' },
                            { id: 'jane', name: 'Jane Smith' },
                        ]}
                    />
                    <Select 
                        className="w-[140px]"
                        value="all_activity"
                        showSearch={false}
                        options={[
                            { id: 'all_activity', name: 'All Activity' },
                            { id: 'orders', name: 'Orders' },
                            { id: 'security', name: 'Security' },
                        ]}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                    {logs.map(log => {
                        const Icon = log.icon;
                        return (
                            <div key={log.id} className="flex items-start gap-3 p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-white hover:border-slate-200 transition-colors shadow-sm">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.bg}`}>
                                    <Icon size={14} className={log.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] text-slate-800 leading-tight">
                                        <span className="font-bold text-slate-900">{log.user}</span> {log.action.toLowerCase()} <span className="font-medium text-indigo-600">{log.target}</span>
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{log.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
