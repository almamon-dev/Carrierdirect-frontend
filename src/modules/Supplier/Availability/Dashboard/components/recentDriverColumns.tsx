import React from 'react';
import { Phone, Mail, Truck, MapPin } from 'lucide-react';
import { Column } from '@/components/tables/data-table';

export function getRecentDriverColumns(): Column<any>[] {
    return [
        {
            id: 'name',
            label: 'Driver',
            sortable: true,
            className: 'w-[22%] min-w-[180px]',
            render: (driver) => {
                const initials = (driver.name || '')
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase() || '';

                return (
                    <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                            {initials}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#ff4a1f] transition-colors text-xs whitespace-nowrap">
                            {driver.name}
                        </span>
                        {driver.employee_id && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                                #{driver.employee_id}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'contact',
            label: 'Contact',
            sortable: false,
            className: 'w-[25%] min-w-[220px]',
            render: (driver) => (
                <div className="flex items-center gap-2 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 min-w-0">
                    {driver.phone && (
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Phone size={11} className="text-slate-400 shrink-0" />
                            <span>{driver.phone}</span>
                        </span>
                    )}
                    {driver.phone && driver.email && (
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                    )}
                    {driver.email && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap" title={driver.email}>
                            <Mail size={11} className="text-slate-400 shrink-0" />
                            <span>{driver.email}</span>
                        </span>
                    )}
                    {!driver.phone && !driver.email && (
                        <span className="text-slate-400 italic text-[11px]">-</span>
                    )}
                </div>
            ),
        },
        {
            id: 'assignedVehicle',
            label: 'Assigned Vehicle',
            sortable: false,
            className: 'w-[25%] min-w-[220px]',
            render: (driver) => {
                const vehicleText = driver.assignedVehicle || (driver.vehicle?.plate ? `${driver.vehicle?.name || 'Vehicle'} (${driver.vehicle.plate})` : null);
                if (!vehicleText) {
                    return (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 italic whitespace-nowrap">
                            Unassigned
                        </span>
                    );
                }
                return (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <div className="w-5 h-5 rounded bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <Truck size={12} />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">
                            {vehicleText}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'assignedServiceArea',
            label: 'Assigned Service Area',
            sortable: false,
            className: 'w-[18%] min-w-[160px]',
            render: (driver) => {
                const areaText = driver.assignedServiceArea || driver.service_area?.formatted || (driver.service_area?.city ? `${driver.service_area.city}, ${driver.service_area.country}` : null);
                if (!areaText) {
                    return (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 italic whitespace-nowrap">
                            Unassigned
                        </span>
                    );
                }
                return (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-500 flex items-center justify-center shrink-0">
                            <MapPin size={12} />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">
                            {areaText}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[10%] min-w-[110px] text-center',
            render: (driver) => {
                const isAvail = driver.status === 'Available';
                const isOnJob = driver.status === 'On Job';
                return (
                    <div className="flex justify-center">
                        <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border whitespace-nowrap ${isAvail
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60'
                                : isOnJob
                                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60'
                                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60'
                                }`}
                        >
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${isAvail ? 'bg-emerald-500' : isOnJob ? 'bg-amber-500' : 'bg-rose-500'
                                    }`}
                            />
                            <span>{driver.status}</span>
                        </span>
                    </div>
                );
            },
        },
    ];
}
