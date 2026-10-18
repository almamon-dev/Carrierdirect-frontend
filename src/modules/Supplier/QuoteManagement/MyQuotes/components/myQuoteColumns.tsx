import { Column } from '@/components/tables/data-table';
import { encryptId } from '@/lib/encryption';
import { MyQuoteItem } from '../hooks/useSupplierMyQuotes';
import {
    SupplierAddressCell,
    SupplierDistanceCell,
    SupplierDateCell,
} from '../../QuoteRequests/components/SupplierQuoteRequestCells';

interface MyQuoteColumnsOptions {
    onNavigate: (path: string, state?: any) => void;
}

export const getMyQuoteColumns = ({ onNavigate }: MyQuoteColumnsOptions): Column<MyQuoteItem>[] => [
    {
        id: 'quoteId',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => {
            const rawQuoteId = String(row.quoteRawId || row.rawId || row.id).replace('QT-', '').replace('REQ-', '').trim();
            const quoteText = row.quoteId || (row.id ? `QT-${String(row.id).padStart(4, '0')}` : 'QT-0000');
            return (
                <div className="flex items-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={() => onNavigate(`/supplier/quotes/my-quotes/${encryptId(rawQuoteId)}`, { from: 'my-quotes' })}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
                    >
                        {quoteText}
                    </button>
                </div>
            );
        },
    },
    {
        id: 'id',
        label: 'Request ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => {
            const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
            const reqText = row.id ? (String(row.id).startsWith('REQ-') ? row.id : `REQ-${String(row.id).padStart(4, '0')}`) : 'REQ-0000';
            return (
                <div className="flex items-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={() => onNavigate(`/supplier/quotes/requests/${encryptId(rawId)}`)}
                        className="font-medium text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13px] tracking-tight transition-colors leading-none"
                    >
                        {reqText}
                    </button>
                </div>
            );
        },
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[140px] min-w-[130px] max-w-[170px]',
        render: (row) => (
            <div className="flex items-center gap-2 min-w-0 pr-1 min-h-[26px]" title={row.customer}>
                {row.customerAvatar ? (
                    <img
                        src={row.customerAvatar}
                        alt={row.customer}
                        className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full object-cover shrink-0 aspect-square border border-slate-200 dark:border-slate-700 shadow-2xs"
                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {row.customer.charAt(0).toUpperCase()}
                    </div>
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] truncate">
                    {row.customer}
                </span>
            </div>
        ),
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'w-[16%] min-w-[120px] max-w-[180px]',
        render: (row) => <SupplierAddressCell address={row.pickup} />,
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'w-[16%] min-w-[120px] max-w-[180px]',
        render: (row) => <SupplierAddressCell address={row.delivery} />,
    },
    {
        id: 'distance',
        label: 'Distance',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
        render: (row) => <SupplierDistanceCell distance={row.distance} />,
    },
    {
        id: 'budget',
        label: 'Quoted Amount',
        sortable: true,
        className: 'w-[130px] min-w-[120px]',
        render: (row) => {
            const offerVal = row.my_quote?.amount ?? row.myQuote?.amount ?? row.amount;
            const revVal = row.revisedAmount;
            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    {offerVal ? (
                        <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[13.5px] leading-tight">
                            €{Number(offerVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">EUR</span>
                        </span>
                    ) : (
                        <span className="whitespace-nowrap font-semibold text-[13px] text-slate-500 dark:text-slate-400">
                            {row.budget || 'Negotiable'}
                        </span>
                    )}
                    {revVal && (
                        <span className="text-[10.5px] text-orange-600 dark:text-orange-400 font-semibold leading-tight">
                            Counter: €{Number(revVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[100px] min-w-[95px] text-center',
        render: (row) => {
            const st = (row.supplierStatus || row.status || 'submitted').toLowerCase();
            let colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            let label = 'Submitted';

            if (st === 'negotiation' || st === 'negotiating') {
                colorClasses = 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
                label = 'Negotiation';
            } else if (st === 'completed') {
                colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                label = 'Completed';
            } else if (st === 'booked') {
                colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
                label = 'Booked';
            } else if (st === 'accepted' || st === 'won') {
                colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
                label = 'Accepted';
            } else if (st === 'rejected' || st === 'lost' || st === 'declined' || st === 'cancelled') {
                colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
                label = 'Rejected';
            } else if (st === 'expired' || row.isExpired) {
                colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
                label = 'Expired';
            }

            return (
                <div className="flex items-center justify-center min-h-[26px]">
                    <span className={`inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap border ${colorClasses}`}>
                        {label}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'requestDate',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] min-w-[100px] text-center',
        render: (row) => <SupplierDateCell row={row as any} />,
    },
];
