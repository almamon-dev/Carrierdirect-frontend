import React from 'react';
import { Euro, TrendingUp, Clock, Calendar, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable from '@/components/tables/data-table';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const earningsData = [
    { name: 'Jul 1', earnings: 1200 },
    { name: 'Jul 5', earnings: 1800 },
    { name: 'Jul 10', earnings: 1500 },
    { name: 'Jul 15', earnings: 3200 },
    { name: 'Jul 20', earnings: 2800 },
    { name: 'Jul 25', earnings: 4500 },
    { name: 'Jul 31', earnings: 3800 },
];

export default function Earnings() {
    // Dummy job earnings history
    const history = [
        { id: 'JOB-9021', customer: 'Acme Corp', date: 'Jul 20, 2026', gross: '€1,200.00', fee: '€60.00', net: '€1,140.00', status: 'Cleared' },
        { id: 'JOB-9018', customer: 'TechFlow Inc', date: 'Jul 18, 2026', gross: '€3,500.00', fee: '€175.00', net: '€3,325.00', status: 'Cleared' },
        { id: 'JOB-9015', customer: 'Global Logistics', date: 'Jul 15, 2026', gross: '€850.00', fee: '€42.50', net: '€807.50', status: 'Pending Clearance' },
        { id: 'JOB-9010', customer: 'Nexus Solutions', date: 'Jul 12, 2026', gross: '€2,100.00', fee: '€105.00', net: '€1,995.00', status: 'Cleared' },
    ];

    const columns = [
        { id: 'id', label: 'Job ID', render: (row: any) => <span className="text-[13px] font-semibold text-slate-800">{row.id}</span> },
        { id: 'customer', label: 'Customer', render: (row: any) => <span className="text-[12px] font-medium text-slate-700">{row.customer}</span> },
        { id: 'date', label: 'Completed', render: (row: any) => <span className="text-[12px] text-slate-500">{row.date}</span> },
        { id: 'gross', label: 'Gross Rate', render: (row: any) => <span className="text-[12px] font-medium text-slate-700">{row.gross}</span> },
        { id: 'fee', label: 'Platform Fee (5%)', render: (row: any) => <span className="text-[12px] text-red-600">-{row.fee}</span> },
        { id: 'net', label: 'Net Earned', render: (row: any) => <span className="text-[13px] font-bold text-emerald-600">{row.net}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row: any) => (
                <Badge variant="secondary" className={`h-5 px-1.5 text-[9px] font-bold ${
                    row.status === 'Cleared' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                    {row.status}
                </Badge>
            )
        },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">Earnings Dashboard</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Track your job revenue, platform fees, and clearance status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
                        <Calendar size={14} />
                        This Month
                    </Button>
                    <Button variant="primary" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
                        <Download size={14} />
                        Download Report
                    </Button>
                </div>
            </div>

            {/* Top Stats Strip - Ultra Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* This Month */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#FFF0ED] text-[#FF4A1F]">
                            <Euro size={14} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">€12,450.00</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Earned This Month</p>
                    </div>
                </div>

                {/* Last Month */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-slate-100 text-slate-600">
                            <Calendar size={14} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">€11,200.00</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Last Month</p>
                    </div>
                </div>

                {/* Pending Clearance */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-amber-50 text-amber-600">
                            <Clock size={14} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">€3,200.00</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Pending Clearance</p>
                    </div>
                </div>

                {/* Lifetime Earnings */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <TrendingUp size={14} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">€145,280.00</h3>
                        <p className="text-[10px] font-semibold text-slate-500">Lifetime Earnings</p>
                    </div>
                </div>
            </div>

            {/* Chart & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Earnings Chart */}
                <Card className="lg:col-span-1 flex flex-col min-h-[300px]">
                    <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <CardTitle className="text-[13px]">Revenue Trend</CardTitle>
                        <Badge className="bg-brand-light text-indigo-700 h-5 px-1.5 text-[9px]">July</Badge>
                    </CardHeader>
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1 w-full h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={earningsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                        tickFormatter={(value) => `€${value}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number) => [`€${value}`, 'Earnings']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="earnings" 
                                        stroke="#6366f1" 
                                        strokeWidth={2}
                                        fillOpacity={1} 
                                        fill="url(#colorEarnings)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>

                {/* Job Earnings Table */}
                <Card className="lg:col-span-2 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <CardTitle className="text-[13px]">Recent Job Earnings</CardTitle>
                    </CardHeader>
                    <div className="p-0 border-t border-slate-100 flex-1">
                        <DataTable columns={columns} data={history} hideViewToggle={true} />
                    </div>
                </Card>
                
            </div>
        </div>
    );
}
