import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { DriverItem } from '../types/driverAvailability.types';
import {
    DriverNameCell,
    DriverContactCell,
    DriverAreaCell,
    DriverAssignmentCell,
    DriverDutyStatusCell,
    DriverJobStatusCell,
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
}: GetDriverColumnsProps): Column<DriverItem>[] {
    return [
        {
            id: 'name',
            label: 'Driver',
            sortable: true,
            className: 'w-[18%] min-w-[160px]',
            render: (driver) => <DriverNameCell driver={driver} onNavigate={navigate} />,
            skeleton: () => (
                <div className="flex items-center gap-2.5 min-h-[26px]">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-24 rounded" />
                </div>
            ),
        },
        {
            id: 'contact',
            label: 'Contact',
            sortable: false,
            className: 'w-[20%] min-w-[180px]',
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
            className: 'w-[16%] min-w-[140px]',
            render: (driver) => (
                <DriverAreaCell
                    driver={driver}
                    onOpenServiceAreaModal={onOpenServiceAreaModal}
                />
            ),
            skeleton: () => (
                <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-24 rounded" />
                </div>
            ),
        },
        {
            id: 'current_assignment',
            label: 'Current Assignment',
            sortable: false,
            className: 'w-[24%] min-w-[210px]',
            render: (driver) => (
                <DriverAssignmentCell
                    driver={driver}
                    onNavigate={navigate}
                />
            ),
            skeleton: () => (
                <div className="min-h-[26px]">
                    <Skeleton className="h-9 w-full rounded-[6px]" />
                </div>
            ),
        },
        {
            id: 'duty_status',
            label: 'Duty Status',
            sortable: true,
            className: 'w-[11%] min-w-[100px] text-center',
            render: (driver) => <DriverDutyStatusCell driver={driver} />,
            skeleton: () => (
                <div className="flex items-center justify-center min-h-[26px]">
                    <Skeleton className="h-5 w-18 rounded-[4px] !bg-emerald-100/60 dark:!bg-emerald-950/40" />
                </div>
            ),
        },
        {
            id: 'job_status',
            label: 'Job Status',
            sortable: true,
            className: 'w-[11%] min-w-[100px] text-center',
            render: (driver) => <DriverJobStatusCell driver={driver} />,
            skeleton: () => (
                <div className="flex items-center justify-center min-h-[26px]">
                    <Skeleton className="h-5 w-18 rounded-[4px] !bg-blue-100/60 dark:!bg-blue-950/40" />
                </div>
            ),
        },
    ];
}

export default getDriverAvailabilityColumns;
