import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import {
  ShipmentOrderIdCell,
  ShipmentRouteCell,
  ShipmentCarrierCell,
  ShipmentVehicleCell,
  ShipmentStatusCell,
  ShipmentDeliveryCell,
  ShipmentProgressCell,
} from './LiveActiveShipmentsCells';

export const getLiveActiveShipmentsColumns = (): Column<any>[] => [
  {
    id: 'id',
    label: 'Order ID',
    sortable: true,
    className: 'w-[105px] min-w-[95px]',
    render: (row) => <ShipmentOrderIdCell row={row} />,
    skeleton: () => (
      <div className="flex items-center min-h-[22px]">
        <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
      </div>
    ),
  },
  {
    id: 'route',
    label: 'Route & Checkpoint',
    sortable: false,
    className: 'w-[210px] min-w-[170px]',
    render: (row) => <ShipmentRouteCell row={row} />,
    skeleton: () => (
      <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
        <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
        <Skeleton className="h-2.5 w-20 rounded-[3px]" />
      </div>
    ),
  },
  {
    id: 'carrier',
    label: 'Carrier',
    sortable: true,
    className: 'w-[140px] min-w-[125px]',
    render: (row) => <ShipmentCarrierCell row={row} />,
    skeleton: () => (
      <div className="flex items-center gap-2 min-h-[22px]">
        <Skeleton className="w-5 h-5 rounded-full shrink-0" />
        <Skeleton className="h-3.5 w-20 rounded-[3px]" />
      </div>
    ),
  },
  {
    id: 'vehicle',
    label: 'Vehicle',
    sortable: true,
    className: 'w-[120px] min-w-[110px]',
    render: (row) => <ShipmentVehicleCell row={row} />,
    skeleton: () => (
      <div className="flex items-center min-h-[22px]">
        <Skeleton className="h-3.5 w-20 rounded-[3px]" />
      </div>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    className: 'w-[100px] min-w-[95px] text-center',
    render: (row) => <ShipmentStatusCell row={row} />,
    skeleton: () => (
      <div className="flex items-center justify-center min-h-[22px]">
        <Skeleton className="h-5 w-16 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
      </div>
    ),
  },
  {
    id: 'delivery',
    label: 'Est. Delivery',
    sortable: true,
    className: 'w-[105px] min-w-[95px] text-center',
    render: (row) => <ShipmentDeliveryCell row={row} />,
    skeleton: () => (
      <div className="flex items-center justify-center min-h-[22px]">
        <Skeleton className="h-3.5 w-16 rounded-[3px]" />
      </div>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    sortable: true,
    className: 'w-[125px] min-w-[115px]',
    render: (row) => <ShipmentProgressCell row={row} />,
    skeleton: () => (
      <div className="flex items-center gap-2 min-h-[22px] w-full max-w-[120px]">
        <Skeleton className="h-1.5 w-16 rounded-full" />
        <Skeleton className="h-3 w-6 rounded-[3px]" />
      </div>
    ),
  },
];
