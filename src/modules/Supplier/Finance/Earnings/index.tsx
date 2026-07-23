import React, { useState } from 'react';
import { Euro, TrendingUp, Clock, Calendar, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import DataTable, { Column } from '@/components/tables/data-table';
import Select from '@/components/ui/select';
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

export interface EarningItem {
    id: string;
    customer: string;
    date: string;
    gross: string;
    fee: string;
    net: string;
    status: 'Cleared' | 'Pending Clearance';
}

export default function Earnings() {
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

    // Dummy job earnings history
    const history: EarningItem[] = [
        { id: 'JOB-9021', customer: 'Acme Corp', date: 'Jul 20, 2026', gross: '€1,200.00', fee: '€60.00', net: '€1,140.00', status: 'Cleared' },
        { id: 'JOB-9018', customer: 'TechFlow Inc', date: 'Jul 18, 2026', gross: '€3,500.00', fee: '€175.00', net: '€3,325.00', status: 'Cleared' },
        { id: 'JOB-9015', customer: 'Global Logistics', date: 'Jul 15, 2026', gross: '€850.00', fee: '€42.50', net: '€807.50', status: 'Pending Clearance' },
        { id: 'JOB-9010', customer: 'Nexus Solutions', date: 'Jul 12, 2026', gross: '€2,100.00', fee: '€105.00', net: '€1,995.00', status: 'Cleared' },
    ];

    const filteredHistory = history.filter(item => {
        if (selectedStatusFilter === 'all') return true;
        return item.status.toLowerCase().includes(selectedStatusFilter.toLowerCase());
    });

    const columns: Column<EarningItem>[] = [
        { id: 'id', label: 'Job ID', render: (row) => <span className="font-bold text-slate-900">{row.id}</span> },
        { id: 'customer', label: 'Customer', render: (row) => <span className="font-semibold text-slate-800">{row.customer}</span> },
        { id: 'date', label: 'Completed', render: (row) => <span className="text-xs text-slate-500">{row.date}</span> },
        { id: 'gross', label: 'Gross Rate', render: (row) => <span className="font-semibold text-slate-800">{row.gross}</span> },
        { id: 'fee', label: 'Platform Fee (5%)', render: (row) => <span className="font-semibold text-red-600">-{row.fee}</span> },
        { id: 'net', label: 'Net Earned', render: (row) => <span className="font-bold text-emerald-600">{row.net}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row) => (
                <Badge variant="secondary" className={
                    row.status === 'Cleared' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    'bg-amber-50 text-amber-700 font-semibold'
                }>
                    {row.status}
                </Badge>
            )
        },
    ];

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Clearance Status</label>
                <Select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Statuses</option>
                    <option value="cleared">Cleared</option>
                    <option value="pending">Pending Clearance</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-5 min-h-screen font-sans antialiased">
            {/* Header matching Active Jobs & Team Management */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Earnings Dashboard</h1>
                    <p className="text-xs text-slate-500 font-medium">Track your job revenue, platform fees, and clearance status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 px-3 text-xs font-semibold gap-1.5 shadow-2xs">
                        <Calendar size={14} />
                        This Month
                    </Button>
                    <Button variant="primary" size="sm" className="h-9 px-3 text-xs font-semibold gap-1.5 shadow-2xs">
                        <Download size={14} />
                        Download Report
                    </Button>
                </div>
            </div>

            {/* Top Stats Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* This Month */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 text-[#ff4a1f]">
                            <Euro size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€12,450.00</h3>
                        <p className="text-xs font-medium text-slate-500">Earned This Month</p>
                    </div>
                </div>

                {/* Last Month */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-600">
                            <Calendar size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€11,200.00</h3>
                        <p className="text-xs font-medium text-slate-500">Last Month</p>
                    </div>
                </div>

                {/* Pending Clearance */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
                            <Clock size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€3,200.00</h3>
                        <p className="text-xs font-medium text-slate-500">Pending Clearance</p>
                    </div>
                </div>

                {/* Lifetime Earnings */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <TrendingUp size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 mb-0.5">€145,280.00</h3>
                        <p className="text-xs font-medium text-slate-500">Lifetime Earnings</p>
                    </div>
                </div>
            </div>

            {/* Chart & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Earnings Chart */}
                <Card className="lg:col-span-1 flex flex-col min-h-[300px] border-slate-200 shadow-2xs rounded-xl overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold text-slate-900">Revenue Trend</CardTitle>
                        <Badge variant="secondary" className="bg-orange-50 text-[#ff4a1f] font-semibold text-[10px]">July</Badge>
                    </CardHeader>
                    <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1 w-full h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={earningsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ff4a1f" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#ff4a1f" stopOpacity={0}/>
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
                                        stroke="#ff4a1f" 
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
                <div className="lg:col-span-2 p-0">
                    <DataTable 
                        columns={columns} 
                        data={filteredHistory} 
                        compact={true} 
                        searchPlaceholder="Search earnings by job ID, customer..."
                        hideViewToggle={true} 
                        filterContent={filterContent}
                    />
                </div>
                
            </div>
        </div>
    );
}
