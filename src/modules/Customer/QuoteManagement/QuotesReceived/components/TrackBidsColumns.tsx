import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { formatDisplayDate } from '@/lib/utils';
import {
    AddressCell,
    BudgetCell,
} from '../../CreateRequest/components/CreateRequestCells';
import {
    TrackBidIdCell,
    TrackBidIdSkeleton,
    TrackBidSupplierCell,
    TrackBidSupplierSkeleton,
    TrackBidStatusCell
} from './TrackBidsCells';

export const getTrackBidsColumns = (
    navigate: (path: string) => void,
    quoteRequestDetails?: any
): Column<any>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => <TrackBidIdCell row={row} navigate={navigate} />,
        skeleton: () => <TrackBidIdSkeleton />
    },
    {
        id: 'supplier',
        label: 'Supplier Details',
        sortable: true,
        className: 'w-[180px] min-w-[170px]',
        render: (row) => <TrackBidSupplierCell row={row} />,
        skeleton: () => <TrackBidSupplierSkeleton />
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'w-[18%] min-w-[130px] max-w-[190px]',
        render: (row) => {
            const pickup = row.pickup_address || row.pickup_city || row.origin_city || (row.origin ? row.origin.split(',')[0]?.trim() : '') || quoteRequestDetails?.pickup_city || quoteRequestDetails?.pickup_address || 'Origin Location';
            return <AddressCell address={pickup} />;
        },
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[4px]" />
            </div>
        )
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'w-[18%] min-w-[130px] max-w-[190px]',
        render: (row) => {
            const delivery = row.delivery_address || row.delivery_city || row.destination_city || (row.destination ? row.destination.split(',')[0]?.trim() : '') || quoteRequestDetails?.delivery_city || quoteRequestDetails?.delivery_address || 'Destination Location';
            return <AddressCell address={delivery} />;
        },
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[4px]" />
            </div>
        )
    },
    {
        id: 'vehicle',
        label: 'Vehicle Type',
        sortable: true,
        className: 'w-[125px] min-w-[115px]',
        render: (row) => {
            const vehicle = row.vehicle || row.vehicle_type || row.truck_type || quoteRequestDetails?.vehicle_type || 'Covered Van (20ft)';
            return (
                <div className="flex items-center min-h-[26px]" title={vehicle}>
                    <span className="text-[12.5px] text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[120px]">
                        {vehicle}
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-3.5 w-20 rounded-[4px]" />
            </div>
        )
    },
    {
        id: 'transitTime',
        label: 'Transit Time',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
        render: (row) => {
            const transit = row.estimated_delivery || row.transit_time || row.estimated_time || row.transit_days || '48h';
            const displayTransit = String(transit).includes('h') || String(transit).includes('day') || String(transit).includes('d') ? transit : `${transit}h`;
            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    <span className="text-[12.5px] text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap">
                        {displayTransit}
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-12 rounded-[4px]" />
            </div>
        )
    },
    {
        id: 'amount',
        label: 'Quote Amount',
        sortable: true,
        className: 'w-[125px] min-w-[115px]',
        render: (row) => {
            const rawVal = row.amount_raw ?? row.amount ?? row.offer_amount ?? row.quote_amount;
            return <BudgetCell budget={rawVal} />;
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[4px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[130px] min-w-[125px] text-center whitespace-nowrap',
        render: (row) => <TrackBidStatusCell row={row} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-20 rounded-[4px] !bg-blue-100/70 dark:!bg-blue-950/50" />
            </div>
        )
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] min-w-[100px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center min-h-[26px]">
                <span className="whitespace-nowrap text-[13px] text-slate-600 dark:text-slate-400 font-medium leading-none">
                    {formatDisplayDate(row.created_at || row.date || row.received_at || row.submitted_at || row.quote_request?.created_at)}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-16 rounded-[4px]" />
            </div>
        )
    }
];

export { resolveTrackBidStatus } from './TrackBidsCells';
