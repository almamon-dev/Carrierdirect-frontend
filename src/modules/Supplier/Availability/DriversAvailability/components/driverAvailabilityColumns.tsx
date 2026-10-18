import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { DriverItem } from '../types/driverAvailability.types';
import {
    DriverNameCell,
    DriverContactCell,
    DriverAreaCell,
    DriverStatusBadgeCell,
} from './driverAvailabilityCells';

interface GetDriverColumnsProps {
    navigate?: (path: string) => void;
    onOpenVehicleModal?: (driver: DriverItem) => void;
    onOpenServiceAreaModal: (driver: DriverItem) => void;
    onStatusChange?: (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => void;
}

export function getDriverAvailabilityColumns({
    navigate,
    onOpenServiceAreaModal,
    onStatusChange,
}: GetDriverColumnsProps): Column<DriverItem>[] {
    return [
        {
            id: 'index',
            label: '#',
            className: 'w-[50px] min-w-[50px] text-slate-400 font-mono text-xs',
            render: (row, index) => (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {(index !== undefined ? index + 1 : (row as any).id) || 1}
                </span>
            ),
            skeleton: () => (
                <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-4 rounded" />
                </div>
            ),
        },
        {
            id: 'name',
            label: 'Driver',
            sortable: true,
            className: 'w-[220px] min-w-[200px]',
            render: (driver) => <DriverNameCell driver={driver} onNavigate={navigate} />,
            skeleton: () => (
                <div className="flex items-center gap-2.5 min-h-[26px]">
                    <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-24 rounded" />
                </div>
            ),
        },
        {
            id: 'contact',
            label: 'Contact',
            sortable: false,
            className: 'w-[230px] min-w-[200px]',
            render: (driver) => <DriverContactCell driver={driver} />,
            skeleton: () => (
                <div className="flex flex-col gap-1 min-h-[26px] justify-center">
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-2.5 w-36 rounded" />
                </div>
            ),
        },
        {
            id: 'assignedServiceArea',
            label: 'Assigned Areas',
            sortable: true,
            className: 'w-[260px] min-w-[200px]',
            render: (driver) => (
                <DriverAreaCell
                    driver={driver}
                    onOpenServiceAreaModal={onOpenServiceAreaModal}
                />
            ),
            skeleton: () => (
                <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-28 rounded" />
                </div>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[120px] min-w-[110px] text-center',
            render: (driver) => (
                <DriverStatusBadgeCell
                    driver={driver}
                    onStatusChange={onStatusChange}
                />
            ),
            skeleton: () => (
                <div className="flex items-center justify-center min-h-[26px]">
                    <Skeleton className="h-5 w-18 rounded-[4px] !bg-emerald-100/60 dark:!bg-emerald-950/40" />
                </div>
            ),
        },
    ];
}

export default getDriverAvailabilityColumns;
