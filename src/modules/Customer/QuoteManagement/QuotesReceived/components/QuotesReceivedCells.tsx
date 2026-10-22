import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { formatStandardAddress, formatStandardRoute, formatCompactRoute } from "@/utils/addressFormatter";
import React from 'react';
import { formatDisplayDate } from '@/lib/utils';
import {
  getQuoteStatusInfo,
  QuotesReceivedStatusCell,
  QuotesReceivedStatusBadgeCell,
} from './quoteStatusHelpers';
import {
  QuotesReceivedQuoteIdCell,
  QuotesReceivedRequestIdCell,
} from './QuotesReceivedIdCells';

export {
  getQuoteStatusInfo,
  QuotesReceivedStatusCell,
  QuotesReceivedStatusBadgeCell,
  QuotesReceivedQuoteIdCell,
  QuotesReceivedRequestIdCell,
};

export const QuotesReceivedSupplierCell: React.FC<{ row: any }> = ({ row }) => {
  const name =
    row.supplier?.full_name ||
    row.supplier?.name ||
    row.supplier_full_name ||
    row.supplier_name ||
    row.supplier?.company_name ||
    row.carrier_name ||
    row.customer ||
    row.supplier ||
    'Supplier';
  const avatar =
    row.supplier?.profile_picture || row.supplier_avatar || row.customerAvatar || row.supplierAvatar;

  return (
    <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]" title={name}>
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
          onError={(e) => {
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="font-bold text-slate-900 dark:text-slate-100 text-[13px] whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

export const QuotesReceivedRouteCell: React.FC<{ row: any }> = ({ row }) => {
    return <StandardRouteCell row={row} />;
};

export const QuotesReceivedAddressCell: React.FC<{ address?: string; row?: any; type?: "pickup" | "delivery" }> = ({ address, row, type = "pickup" }) => {
  const displayAddr = row ? formatStandardAddress(row, type) : formatStandardAddress(address);
  return (
    <div className="flex items-center min-w-0 w-full overflow-hidden pr-1 min-h-[26px]" title={displayAddr}>
      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px] whitespace-nowrap block leading-normal">
        {displayAddr}
      </span>
    </div>
  );
};

export const QuotesReceivedVehicleCell: React.FC<{ vehicle: string }> = ({ vehicle }) => (
  <div className="flex items-center min-h-[26px]" title={vehicle}>
    <span className="text-[12.5px] text-slate-800 dark:text-slate-200 font-semibold whitespace-nowrap">
      {vehicle || 'Covered Van (20ft)'}
    </span>
  </div>
);

export const QuotesReceivedTransitCell: React.FC<{ transit?: string; time?: string }> = ({
  transit,
  time,
}) => {
  const displayTransit = transit || time || '48h';
  return (
    <div className="flex items-center justify-center min-h-[26px]" title={displayTransit}>
      <span className="text-[12.5px] text-slate-700 dark:text-slate-200 font-bold whitespace-nowrap">
        {displayTransit}
      </span>
    </div>
  );
};

export const QuotesReceivedTransitTimeCell = QuotesReceivedTransitCell;

export const QuotesReceivedAmountCell: React.FC<{ row?: any; amount?: any }> = ({ row, amount }) => {
  const rawVal =
    row?.amount_raw ??
    row?.amount ??
    row?.offer_amount ??
    row?.quote_amount ??
    row?.budget ??
    row?.currentOffer ??
    row?.originalAmount ??
    amount;
  const rawStr = String(rawVal || '').trim();
  const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
  const isNegotiable =
    !rawVal ||
    rawStr === 'Negotiable' ||
    rawStr === '0' ||
    rawStr === '0.00' ||
    rawStr === '€0.00' ||
    rawStr === '€0' ||
    num === 0;

  if (isNegotiable) {
    return (
      <div className="flex items-center min-h-[26px]">
        <span className="whitespace-nowrap font-bold text-[12.5px] text-slate-500 dark:text-slate-400">
          Negotiable
        </span>
      </div>
    );
  }

  const formattedNum = isNaN(num)
    ? rawStr
    : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex items-center min-h-[26px]">
      <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[13px]">
        {formattedNum} <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">EUR</span>
      </span>
    </div>
  );
};

export const QuotesReceivedDateCell: React.FC<{ row?: any; date?: any }> = ({ row, date }) => {
  const dateVal =
    row?.created_at ||
    row?.request_date ||
    row?.requestDate ||
    row?.date ||
    row?.received_at ||
    row?.quote_request?.created_at ||
    date;

  return (
    <div className="flex items-center justify-center min-h-[26px]">
      <span className="whitespace-nowrap text-[12.5px] text-slate-700 dark:text-slate-300 font-semibold leading-none">
        {formatDisplayDate(dateVal)}
      </span>
    </div>
  );
};
