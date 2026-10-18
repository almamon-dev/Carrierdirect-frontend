import React from 'react';
import { Calendar as CalendarIcon, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpcomingDay {
    id: string;
    day: string;
    date: string;
    full_date: string;
    is_today: boolean;
    is_weekend?: boolean;
    status: 'Available' | 'Unavailable' | string;
    hours: string;
    available_drivers?: number;
    available_vehicles?: number;
}

interface UpcomingAvailabilityStripProps {
    upcomingDays: UpcomingDay[];
}

export function UpcomingAvailabilityStrip({
    upcomingDays,
}: UpcomingAvailabilityStripProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#18202a] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 sm:p-4 shadow-2xs font-sans">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center">
                        <CalendarIcon size={15} />
                    </div>
                    <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Upcoming Week Availability
                        </h3>
                        <p className="text-[11px] text-slate-500 font-normal">
                            Daily operational capacity and active dispatch hours for the next 7 days.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/supplier/availability/calendar')}
                    className="text-xs font-semibold text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer"
                >
                    <span>Full Schedule</span>
                    <ArrowUpRight size={13} />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {upcomingDays.map((day) => {
                    const isAvail = day.status === 'Available';
                    return (
                        <div
                            key={day.id}
                            className={`p-2.5 rounded-[4px] border text-center transition-all ${
                                day.is_today
                                    ? 'border-[#ff4a1f] bg-orange-50/40 dark:bg-[#ff4a1f]/10 shadow-2xs'
                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
                            }`}
                        >
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                {day.day}
                            </span>
                            <span className={`text-base font-extrabold block my-0.5 ${
                                day.is_today ? 'text-[#ff4a1f]' : 'text-slate-800 dark:text-slate-200'
                            }`}>
                                {day.date}
                            </span>
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[9.5px] font-bold ${
                                isAvail
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60'
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                            }`}>
                                {day.status}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1 truncate">
                                {day.hours}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
