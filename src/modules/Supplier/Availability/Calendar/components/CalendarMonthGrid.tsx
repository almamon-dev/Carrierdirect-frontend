import React from 'react';
import { Card } from '@/components/ui/card';
import Select from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';

const AVAILABILITY = {
    '2026-07-04': { status: 'unavailable', reason: 'Holiday' },
    '2026-07-15': { status: 'booked', reason: 'Fully Booked' },
    '2026-07-16': { status: 'booked', reason: 'Fully Booked' },
    '2026-07-20': { status: 'partial', reason: 'Morning Only (8AM - 1PM)' },
    '2026-07-21': { status: 'partial', reason: 'Afternoon Only (1PM - 6PM)' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarMonthGridProps {
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    todayDate: Date;
}

export const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
    currentMonth,
    setCurrentMonth,
    todayDate,
}) => {
    const getDaysInMonth = (year: number, month: number) => {
        const days = [];
        const date = new Date(year, month, 1);
        const firstDay = date.getDay();
        for (let i = 0; i < firstDay; i++) days.push(null);
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        while (days.length % 7 !== 0) days.push(null);
        return days;
    };

    const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    const formatDateKey = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <Card className="lg:col-span-2 flex flex-col shadow-sm border-slate-200">
            {/* Calendar Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <div className="flex gap-2 items-center">
                    <Select
                        value={currentMonth.getMonth()}
                        onChange={(e) => setCurrentMonth(new Date(currentMonth.getFullYear(), parseInt(e.target.value), 1))}
                        options={Array.from({ length: 12 }).map((_, i) => ({
                            id: i,
                            name: new Date(todayDate.getFullYear(), i, 1).toLocaleString('default', { month: 'long' }),
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
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date(todayDate.getFullYear(), todayDate.getMonth(), 1))}
                        className="px-2 h-7 rounded border border-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-0 flex-1 flex flex-col">
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                    {WEEKDAYS.map((day, i) => (
                        <div key={i} className="py-1.5 text-center text-[10px] font-bold text-slate-500 border-r border-slate-100 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

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

                                <div className="flex-1 flex flex-col gap-1">
                                    {dayData ? (
                                        <div className={`group relative px-1.5 py-1 rounded-lg text-[9px] font-bold leading-tight flex items-start gap-1 cursor-help border ${
                                            dayData.status === 'unavailable'
                                                ? 'bg-red-50 border-red-100 text-red-700'
                                                : dayData.status === 'booked'
                                                ? 'bg-slate-100 border-slate-200 text-slate-700'
                                                : 'bg-amber-50 border-amber-100 text-amber-700'
                                        }`}>
                                            {dayData.status === 'unavailable' && <X size={10} className="shrink-0 mt-0.5" />}
                                            {dayData.status === 'booked' && <Check size={10} className="shrink-0 mt-0.5" />}
                                            {dayData.status === 'partial' && <Clock size={10} className="shrink-0 mt-0.5" />}
                                            <span className="truncate">{dayData.reason}</span>
                                        </div>
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
    );
};
