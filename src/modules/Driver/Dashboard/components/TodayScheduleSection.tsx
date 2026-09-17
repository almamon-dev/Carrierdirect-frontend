import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, ChevronRight } from 'lucide-react';

interface ScheduleTrip {
    id: string;
    tripId: string;
    time: string;
    cargoType: string;
    origin: string;
    destination: string;
    status: string;
}

interface Props {
    scheduleList: ScheduleTrip[];
}

export const TodayScheduleSection: React.FC<Props> = ({ scheduleList }) => {
    return (
        <div className="space-y-3">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    Today's Schedule
                </h3>
                <Link
                    to="/driver/shipments"
                    className="text-[12px] font-bold text-[#FF4A1F] hover:underline flex items-center gap-0.5"
                >
                    <span>View All</span>
                    <ChevronRight size={13} />
                </Link>
            </div>

            {/* Schedule Cards - Compact rounded-[4px] */}
            <div className="space-y-2.5">
                {scheduleList.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-2xs space-y-2.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                        {/* Top row: Time + Trip ID + Cargo Type */}
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-[10.5px] font-bold bg-orange-50 dark:bg-orange-950/50 text-[#FF4A1F] rounded-[4px] border border-orange-200/80 dark:border-orange-900/60 flex items-center gap-1">
                                    <Clock size={11} />
                                    <span>{item.time}</span>
                                </span>
                                <span className="font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
                                    {item.tripId}
                                </span>
                            </div>

                            <span className="text-[11px] font-bold text-[#FF4A1F] dark:text-orange-400">
                                {item.cargoType}
                            </span>
                        </div>

                        {/* Origin & Destination */}
                        <div className="space-y-2.5 relative pl-0.5">
                            {/* Origin */}
                            <div className="flex items-start gap-2.5 relative">
                                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FF4A1F] bg-white dark:bg-[#1e2329] flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="w-1 h-1 rounded-full bg-[#FF4A1F]" />
                                </div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                    {item.origin}
                                </div>
                            </div>

                            {/* Connecting Line */}
                            <div className="absolute left-[6.5px] top-3.5 bottom-3.5 w-0.5 border-l-2 border-dashed border-slate-300 dark:border-slate-700 pointer-events-none" />

                            {/* Destination */}
                            <div className="flex items-start gap-2.5 relative pt-0.5">
                                <div className="w-3.5 h-3.5 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin size={15} className="fill-emerald-500 text-white" />
                                </div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                                    {item.destination}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Status Tag */}
                        <div className="flex justify-end pt-0.5">
                            <span className="px-2.5 py-0.5 text-[10.5px] font-bold text-[#FF4A1F] border border-orange-200 dark:border-orange-900/60 bg-orange-50/60 dark:bg-orange-950/30 rounded-[4px]">
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
