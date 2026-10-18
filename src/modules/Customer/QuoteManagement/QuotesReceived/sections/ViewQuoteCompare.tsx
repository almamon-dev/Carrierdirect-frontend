import React, { useMemo } from 'react';
import { Layers, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import TabHeader from '@/components/ui/tab-header';
import { getCustomerWonQuoteColumns } from '../../WonQuotes/components/columns';
import { CustomerWonRowActions } from '../../WonQuotes/components/CustomerWonRowActions';
import { QuoteData } from '../types/quoteViewDetailTypes';

interface ViewQuoteCompareProps {
    currentQuote: QuoteData;
    siblingQuotes: QuoteData[];
    onSelectQuote: (quote: QuoteData, targetTab?: string) => void;
    onAcceptQuote: (quote: QuoteData) => void;
}

export const ViewQuoteCompare: React.FC<ViewQuoteCompareProps> = ({
    currentQuote,
    siblingQuotes,
    onSelectQuote,
}) => {
    const navigate = useNavigate();

    // Format sibling quotes into exact columns format matching WonQuotes/QuotesReceived table
    const formattedQuotes = useMemo(() => {
        const list = (siblingQuotes && siblingQuotes.length > 0 ? siblingQuotes : [currentQuote]) as any[];

        return list.map((sq: any) => {
            const rawId = sq.rawId || sq.id;
            const quoteText = sq.quote_id || sq.quoteId || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');
            const reqIdVal = sq.quote_request_id || sq.quote_request?.id || currentQuote?.quote_request_id || (currentQuote?.quote_request as any)?.id;
            const reqIdText = reqIdVal ? (String(reqIdVal).startsWith('REQ-') ? reqIdVal : `REQ-${String(reqIdVal).padStart(4, '0')}`) : 'REQ-0000';
            const statusStr = String(sq.status_raw || sq.status || (sq.id === currentQuote.id ? (currentQuote.status_raw || currentQuote.status) : 'Confirmed')).toLowerCase();

            let deliveryStatus = 'Confirmed';
            if (statusStr === 'completed') deliveryStatus = 'Completed';
            else if (statusStr.includes('pod')) deliveryStatus = 'POD Pending';
            else if (statusStr === 'delivered') deliveryStatus = 'Delivered';
            else if (statusStr === 'in_transit' || statusStr === 'picked_up') deliveryStatus = 'In Transit';
            else if (statusStr.includes('driver')) deliveryStatus = 'Driver Assigned';
            else deliveryStatus = 'Confirmed';

            const origin = sq.pickup_address || sq.pickup_city || sq.origin || (sq.quote_request as any)?.pickup_city || (currentQuote?.quote_request as any)?.pickup_city || 'Gazipur, Dhaka';
            const destination = sq.delivery_address || sq.delivery_city || sq.destination || (sq.quote_request as any)?.delivery_city || (currentQuote?.quote_request as any)?.delivery_city || 'Chittagong Port';
            const routeText = origin && destination ? `${origin} → ${destination}` : (origin || destination || 'Plot 42, Gazipur Industrial Area, Dhaka');

            const rawAmt = sq.amount_raw || parseFloat(String(sq.amount || 0).replace(/[^0-9.]/g, '')) || 0;
            const ratingNum = Number(sq.rating ?? sq.supplier?.rating ?? 5.0);

            return {
                ...sq,
                rawId,
                quoteId: quoteText,
                requestId: reqIdText,
                quote_id: quoteText,
                request_id: reqIdText,
                quote_request_id: reqIdVal,
                pickup: origin,
                delivery: destination,
                route: routeText,
                vehicle: sq.vehicle || sq.vehicle_type || (sq.quote_request as any)?.vehicle_type || 'Covered Van (14ft)',
                vehicleType: sq.vehicle || sq.vehicle_type || (sq.quote_request as any)?.vehicle_type || 'Covered Van (14ft)',
                amount: sq.amount || (rawAmt ? `€${rawAmt.toLocaleString()} EUR` : '€120,000.00 EUR'),
                deliveryStatus: deliveryStatus as any,
                status: deliveryStatus,
                date: sq.created_at || sq.date || '06 Oct 2026',
                numericAmount: rawAmt,
                numericRating: ratingNum,
            };
        });
    }, [siblingQuotes, currentQuote]);

    const columns = useMemo(() => getCustomerWonQuoteColumns(navigate), [navigate]);

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            {/* Header Tab Title */}
            <TabHeader
                title={`Suppliers Quoted (${formattedQuotes.length})`}
                icon={Layers}
            />

            {/* Standard DataTable exactly matching Won Quotes & Quotes Received */}
            <DataTable
                data={formattedQuotes}
                columns={columns}
                actions={(row) => (
                    <CustomerWonRowActions
                        row={row}
                        onView={(r) => onSelectQuote(r as any, 'pricing')}
                    />
                )}
                actionsColumnClassName="w-[125px] min-w-[125px] text-right"
                searchPlaceholder="Search quotes by ID, supplier, route..."
                compact={true}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                onRowClick={(row) => onSelectQuote(row, 'pricing')}
                emptyState={
                    <EmptyState
                        icon={Trophy}
                        title="No Quotes Received"
                        description="There are currently no carrier quotes submitted for this request."
                    />
                }
            />
        </div>
    );
};
