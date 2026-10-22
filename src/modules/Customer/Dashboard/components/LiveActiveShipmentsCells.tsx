import { formatCompactRoute, formatStandardAddress } from "@/utils/addressFormatter";
import React from 'react';
import { Link } from 'react-router-dom';
import { encryptId } from '@/lib/encryption';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getOrderProgress, getOrderStatusConfig } from '../utils/dashboardUtils';

export const ShipmentOrderIdCell: React.FC<{ row: any }> = ({ row }) => {
  const rawId = row.rawId || row.id;
  const orderIdDisplay =
    row.orderIdDisplay ||
    row.order_id ||
    row.order_number ||
    (rawId ? (String(rawId).startsWith('ORD-') ? rawId : `ORD-${rawId}`) : 'ORD-0000');
  const encrypted = rawId ? encryptId(rawId) : '';

  return (
    <div className="flex items-center min-h-[26px]">
      <Link
        to={encrypted ? `/customer/orders/${encrypted}` : '/customer/orders'}
        onClick={(e) => e.stopPropagation()}
        className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-[12.5px] tracking-tight leading-none transition-colors"
      >
        {orderIdDisplay}
      </Link>
    </div>
  );
};

export const ShipmentRouteCell: React.FC<{ row: any }> = ({ row }) => {
  const origin = formatStandardAddress(row, 'pickup');
  const destination = formatStandardAddress(row, 'delivery');
  const routeDisplay = (origin !== '—' && destination !== '—')
    ? `${origin} → ${destination}`
    : (row.routeDisplay || row.route || formatCompactRoute(row, 'In Transit'));
  const locationDisplay =
    row.locationDisplay || row.last_location || row.checkpoint || row.current_location || row.pickup_city || 'In Route';

  return (
    <div className="flex flex-col justify-center min-w-0 pr-1 min-h-[26px]" title={`${routeDisplay} (${locationDisplay})`}>
      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[12.5px] truncate block max-w-full leading-tight">
        {routeDisplay}
      </span>
      <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium truncate block mt-0.5 leading-tight">
        ({locationDisplay})
      </span>
    </div>
  );
};

export const ShipmentCarrierCell: React.FC<{ row: any }> = ({ row }) => {
  const avatarUrl = row.customerAvatar || row.supplierAvatar || row.carrier_avatar || row.supplier?.profile_picture;
  const hasValidUrl = Boolean(
    avatarUrl &&
      (avatarUrl.startsWith('http') ||
        avatarUrl.startsWith('/storage') ||
        avatarUrl.startsWith('data:') ||
        avatarUrl.includes('.'))
  );
  const name =
    row.carrierDisplay ||
    row.supplier_name ||
    row.supplier?.company_name ||
    row.supplier?.name ||
    row.carrier_name ||
    'Carrier';
  const initial = name ? name.charAt(0).toUpperCase() : 'C';

  return (
    <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]" title={name}>
      <div className="w-5 h-5 min-w-[20px] min-h-[20px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden">
        {hasValidUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
      <span className="font-bold text-slate-900 dark:text-slate-100 text-[12.5px] truncate max-w-[110px]">
        {name}
      </span>
    </div>
  );
};

export const ShipmentVehicleCell: React.FC<{ row: any }> = ({ row }) => {
  const vehicle = row.vehicleDisplay || row.vehicle || row.vehicle_type || row.truck_type || 'Standard Truck';
  return (
    <div className="flex items-center min-h-[26px]" title={vehicle}>
      <span className="text-[12px] text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[125px]">
        {vehicle}
      </span>
    </div>
  );
};

export const ShipmentStatusCell: React.FC<{ row: any }> = ({ row }) => {
  const raw = row.status || row.status_raw || 'In Transit';
  const statusCfg = getOrderStatusConfig(raw);
  return (
    <div className="flex items-center justify-center min-h-[26px]">
      <StatusBadge status={raw} label={statusCfg.label} />
    </div>
  );
};

export const ShipmentDeliveryCell: React.FC<{ row: any }> = ({ row }) => {
  const etaDisplay = row.etaDisplay || row.eta || row.delivery_date || row.estimated_time || 'Upcoming';
  return (
    <div className="flex items-center justify-center min-h-[26px]" title={etaDisplay}>
      <span className="text-[12px] text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap">
        {etaDisplay}
      </span>
    </div>
  );
};

export const ShipmentProgressCell: React.FC<{ row: any }> = ({ row }) => {
  const statusCfg = getOrderStatusConfig(row.status || row.status_raw || '');
  const progress = getOrderProgress(row.status || row.status_raw || '');

  return (
    <div className="flex items-center gap-2 min-h-[26px] w-full max-w-[130px]">
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full ${statusCfg.progressColor} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
        {progress}%
      </span>
    </div>
  );
};

export const LiveActiveShipmentRowActions: React.FC<{
  row: any;
  onTrack: (data: { isOpen: boolean; destination: string }) => void;
}> = ({ row, onTrack }) => {
  const origin = row.pickup_address || row.pickup_city || 'Origin';
  const dest = row.delivery_address || row.delivery_city || 'Destination';
  const destination = row.routeDisplay || row.route || `${origin} → ${dest}`;

  return (
    <div className="flex items-center justify-end w-full">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTrack({ isOpen: true, destination });
        }}
        className="text-[11px] font-bold text-brand hover:text-brand-dark px-2.5 py-1 rounded-md bg-brand-light/60 dark:bg-[#ff4a1f]/20 hover:bg-brand-light dark:hover:bg-[#ff4a1f]/30 transition-colors whitespace-nowrap cursor-pointer"
      >
        Track
      </button>
    </div>
  );
};
