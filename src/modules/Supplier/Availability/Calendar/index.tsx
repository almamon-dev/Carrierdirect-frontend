import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarMonthGrid } from './components/CalendarMonthGrid';
import { CalendarVolumeChart } from './components/CalendarVolumeChart';
import { CalendarAuditLog } from './components/CalendarAuditLog';

export default function Calendar() {
    const navigate = useNavigate();
    const todayDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(
        new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
    );

    return (
        <div className="p-3 md:p-4 w-full mx-auto space-y-3 min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Availability Calendar
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage your working days, time-offs, and booking capacity.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-8 text-[12px] px-3 gap-1.5 shadow-sm"
                        onClick={() => navigate('/supplier/availability/dashboard')}
                    >
                        <CalendarIcon size={14} />
                        Working Hours
                    </Button>
                    <Button
                        variant="primary"
                        className="h-8 text-[12px] px-3 gap-1.5 shadow-sm"
                        onClick={() => navigate('/supplier/availability/dashboard')}
                    >
                        <Plus size={14} />
                        Add Exception
                    </Button>
                </div>
            </div>

            {/* Top Grid: Calendar (Left) & Graph (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CalendarMonthGrid
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    todayDate={todayDate}
                />
                <CalendarVolumeChart />
            </div>

            {/* Bottom Row: History */}
            <CalendarAuditLog />
        </div>
    );
}
