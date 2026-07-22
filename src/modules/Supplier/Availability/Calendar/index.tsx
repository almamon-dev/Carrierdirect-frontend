import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable from '@/components/tables/data-table';
import { ChevronLeft, ChevronRight, Plus, Check, X, Clock, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Dummy availability data for July 2026
const AVAILABILITY = {
    '2026-07-04': { status: 'unavailable', reason: 'Holiday' },
    '2026-07-15': { status: 'booked', reason: 'Fully Booked' },
    '2026-07-16': { status: 'booked', reason: 'Fully Booked' },
    '2026-07-20': { status: 'partial', reason: 'Morning Only (8AM - 1PM)' },
    '2026-07-21': { status: 'partial', reason: 'Afternoon Only (1PM - 6PM)' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Dummy graph data
const GRAPH_DATA = [
    { name: 'Jul 1', jobs: 2 },
    { name: 'Jul 5', jobs: 5 },
    { name: 'Jul 10', jobs: 3 },
    { name: 'Jul 15', jobs: 8 },
    { name: 'Jul 20', jobs: 6 },
    { name: 'Jul 25', jobs: 4 },
    { name: 'Jul 30', jobs: 7 },
];

// Dummy history data
const HISTORY_DATA = [
    { id: 'ACT-991', date: 'Jul 21, 2026 09:30 AM', action: 'Added Exception', details: 'Marked Jul 21 as Afternoon Only.', user: 'Admin' },
    { id: 'ACT-990', date: 'Jul 20, 2026 04:15 PM', action: 'System Update', details: 'Jul 20 automatically marked as Partial (Job Overlap).', user: 'System' },
    { id: 'ACT-989', date: 'Jul 15, 2026 11:00 AM', action: 'System Update', details: 'Jul 15 and 16 marked Fully Booked due to max capacity.', user: 'System' },
    { id: 'ACT-988', date: 'Jul 01, 2026 10:00 AM', action: 'Added Exception', details: 'Marked Jul 4 as Holiday.', user: 'Admin' },
    { id: 'ACT-987', date: 'Jun 28, 2026 02:20 PM', action: 'Schedule Changed', details: 'Updated standard working hours for Fridays.', user: 'Admin' },
    { id: 'ACT-986', date: 'Jun 25, 2026 09:10 AM', action: 'System Update', details: 'Cleared expired exceptions for previous month.', user: 'System' },
];

const HISTORY_COLUMNS = [
    { id: 'date', label: 'Date & Time', render: (row: any) => <span className="text-[12px] font-medium text-slate-700">{row.date}</span> },
    { id: 'action', label: 'Action Type', render: (row: any) => <Badge className="bg-slate-100 text-slate-700 h-5 px-1.5 text-[10px]">{row.action}</Badge> },
    { id: 'details', label: 'Details', render: (row: any) => <span className="text-[12px] text-slate-600">{row.details}</span> },
    { id: 'user', label: 'Initiated By', render: (row: any) => <span className="text-[12px] font-semibold text-slate-800">{row.user}</span> },
];

export default function Calendar() {
    const navigate = useNavigate();
    const todayDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1));

    // Helper to generate days for the calendar grid
    const getDaysInMonth = (year: number, month: number) => {
        const days = [];
        const date = new Date(year, month, 1);
        const firstDay = date.getDay(); // 0 (Sun) to 6 (Sat)
        
        // Pad with empty days for alignment
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        
        // Add actual days
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        
        // Pad end of grid
        while (days.length % 7 !== 0) {
            days.push(null);
        }
        
        return days;
    };

    const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    
    // Formatting helper
    const formatDateKey = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleToday = () => {
        const today = new Date();
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    return (
        <div className="p-3 md:p-4 w-full mx-auto space-y-3 min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                        Availability Calendar
                    </h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Manage your working days, time-offs, and booking capacity.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm" onClick={() => navigate('/supplier/availability/settings')}>
                        <CalendarIcon size={14} />
                        Working Hours
                    </Button>
                    <Button variant="primary" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm" onClick={() => navigate('/supplier/availability/schedule/create')}>
                        <Plus size={14} />
                        Add Exception
                    </Button>
                </div>
            </div>

            {/* Top Grid: Calendar (Left) & Graph (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Left Side: Calendar (Span 2) */}
                <Card className="lg:col-span-2 flex flex-col shadow-sm border-slate-200">
                    {/* Calendar Toolbar */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                        <div className="flex gap-2 items-center">
                            <Select 
                                value={currentMonth.getMonth()}
                                onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1))}
                                options={Array.from({ length: 12 }).map((_, i) => ({
                                    id: i,
                                    name: new Date(todayDate.getFullYear(), i, 1).toLocaleString('default', { month: 'long' })
                                }))}
                                showSearch={false}
                                className="w-32"
                            />
                            <Select
                                value={currentMonth.getFullYear()}
                                onChange={(e) => setCurrentMonth(new Date(parseInt(e.target.value), currentMonth.getMonth(), 1))}
                                options={Array.from({ length: 5 }, (_, i) => {
                                    const year = todayDate.getFullYear() - 1 + i;
                                    return { id: year, name: year.toString() };
                                })}
                                showSearch={false}
                                className="w-24"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevMonth} className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <ChevronLeft size={14} />
                            </button>
                            <button onClick={handleToday} className="px-2 h-7 rounded border border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                Today
                            </button>
                            <button onClick={handleNextMonth} className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="p-0 flex-1 flex flex-col">
                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                            {WEEKDAYS.map((day, i) => (
                                <div key={i} className="py-1.5 text-center text-[10px] font-bold text-slate-500 border-r border-slate-100 last:border-r-0">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 border-b border-slate-100 bg-white flex-1">
                            {days.map((date, i) => {
                                if (!date) {
                                    return <div key={i} className="min-h-[70px] bg-slate-50/50 border-b border-r border-slate-100 last:border-r-0"></div>;
                                }
                                
                                const dateKey = formatDateKey(date);
                                const dayData = AVAILABILITY[dateKey as keyof typeof AVAILABILITY];
                                const isToday = dateKey === formatDateKey(todayDate);
                                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                
                                return (
                                    <div key={i} className={`min-h-[70px] p-1 flex flex-col border-b border-r border-slate-100 last:border-r-0 transition-colors hover:bg-slate-50 cursor-pointer ${isWeekend && !dayData ? 'bg-slate-50/30' : 'bg-white'}`}>
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${isToday ? 'bg-brand text-white' : 'text-slate-700'}`}>
                                                {date.getDate()}
                                            </span>
                                        </div>

                                        {/* Status Indicator */}
                                        <div className="flex-1 flex flex-col gap-1">
                                            {dayData ? (
                                                <>
                                                    {dayData.status === 'unavailable' && (
                                                        <div className="group relative bg-red-50 border border-red-100 text-red-700 px-1.5 py-1 rounded-[3px] text-[9px] font-bold leading-tight flex items-start gap-1 cursor-help">
                                                            <X size={10} className="shrink-0 mt-0.5" />
                                                            <span className="truncate">{dayData.reason}</span>
                                                            
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 w-max max-w-[150px] bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-md whitespace-normal break-words">
                                                                {dayData.reason}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dayData.status === 'booked' && (
                                                        <div className="group relative bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-1 rounded-[3px] text-[9px] font-bold leading-tight flex items-start gap-1 cursor-help">
                                                            <Check size={10} className="shrink-0 mt-0.5" />
                                                            <span className="truncate">{dayData.reason}</span>
                                                            
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 w-max max-w-[150px] bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-md whitespace-normal break-words">
                                                                {dayData.reason}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {dayData.status === 'partial' && (
                                                        <div className="group relative bg-amber-50 border border-amber-100 text-amber-700 px-1.5 py-1 rounded-[3px] text-[9px] font-bold leading-tight flex items-start gap-1 cursor-help">
                                                            <Clock size={10} className="shrink-0 mt-0.5" />
                                                            <span className="truncate">{dayData.reason}</span>
                                                            
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 w-max max-w-[150px] bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-md whitespace-normal break-words">
                                                                {dayData.reason}
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                !isWeekend && (
                                                    <div className="text-[9px] text-emerald-600 font-semibold px-1 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        + Exception
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="px-3 py-2 bg-white flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 border border-emerald-600"></div>
                            <span className="text-[10px] font-semibold text-slate-600">Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-amber-500 border border-amber-600"></div>
                            <span className="text-[10px] font-semibold text-slate-600">Partial</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-500 border border-slate-600"></div>
                            <span className="text-[10px] font-semibold text-slate-600">Booked</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-[2px] bg-red-500 border border-red-600"></div>
                            <span className="text-[10px] font-semibold text-slate-600">Unavailable</span>
                        </div>
                    </div>
                </Card>

                {/* Right Side: Graph (Span 1) */}
                <Card className="lg:col-span-1 flex flex-col shadow-sm border-slate-200">
                    <CardHeader className="border-b border-slate-100 py-2.5 px-3">
                        <CardTitle className="text-[13px] flex items-center gap-2">
                            <TrendingUp size={14} className="text-brand" />
                            Booking Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 flex-1 flex flex-col">
                        <p className="text-[10px] text-slate-500 mb-3 leading-tight">
                            Visualizes assigned jobs this month. Peaks indicate near full capacity.
                        </p>
                        
                        {/* Stats Box */}
                        <div className="bg-brand-light/50 border border-indigo-100 rounded-sm p-2 mb-3 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-900">Peak Volume Date</span>
                            <span className="text-[11px] font-bold text-indigo-700">July 15th (8 Jobs)</span>
                        </div>

                        {/* Recharts Area Chart */}
                        <div className="flex-1 min-h-[140px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={GRAPH_DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="jobs" stroke="#FF4A1F" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: History (Span 3) */}
            <Card className="flex flex-col shadow-sm border-slate-200">
                <CardHeader className="border-b border-slate-100 py-2 px-3">
                    <CardTitle className="text-[13px] flex items-center justify-between w-full">
                        <span>Availability Audit Log</span>
                        <Button variant="ghost" className="h-6 text-[11px] font-bold text-brand px-2 py-0 hover:bg-brand-light">
                            See All
                        </Button>
                    </CardTitle>
                </CardHeader>
                <div className="p-0 border-t border-slate-100">
                    <DataTable 
                        compact={true}
                        columns={HISTORY_COLUMNS} 
                        data={HISTORY_DATA.slice(0, 6)} 
                        hideViewToggle={true} 
                        hidePagination={true}
                        searchPlaceholder="Search audit log..."
                    />
                </div>
            </Card>
        </div>
    );
}
