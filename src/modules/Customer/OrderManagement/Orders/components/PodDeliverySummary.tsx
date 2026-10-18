import React from 'react';

interface PodDeliverySummaryProps {
    displayId: string;
    supplierName: string;
    driverName?: string;
    vehiclePlate?: string;
    routeDisplay: string;
    deliveryAddress?: string;
    receiverName?: string;
    uploadedAt?: string;
    amountFormatted: string;
}

export const PodDeliverySummary: React.FC<PodDeliverySummaryProps> = ({
    displayId,
    supplierName,
    driverName,
    vehiclePlate,
    routeDisplay,
    deliveryAddress,
    receiverName,
    uploadedAt,
    amountFormatted,
}) => {
    return (
        <div className="bg-slate-50 dark:bg-[#181d24] border border-slate-200/90 dark:border-slate-800 rounded-lg p-3 sm:p-3.5 text-xs font-sans">
            <div className="divide-y divide-slate-200/70 dark:divide-slate-700/60">
                {/* Order ID */}
                <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Order ID</span>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 pl-1">{displayId}</span>
                </div>

                {/* Carrier */}
                <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Carrier</span>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 pl-1">{supplierName}</span>
                </div>

                {/* Driver */}
                {(driverName || vehiclePlate) && (
                    <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Driver</span>
                        <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 pl-1">
                            {driverName || '-'}
                            {vehiclePlate && (
                                <span className="text-slate-500 dark:text-slate-400 font-normal font-mono ml-1.5 text-[11px]">
                                    (Vehicle: {vehiclePlate})
                                </span>
                            )}
                        </span>
                    </div>
                )}

                {/* Route */}
                <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Route</span>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 pl-1">{routeDisplay}</span>
                </div>

                {/* Delivery Point */}
                {deliveryAddress && (
                    <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-start">
                        <span className="text-slate-500 dark:text-slate-400 font-medium pt-0.5">Delivery Point</span>
                        <span className="text-slate-400 dark:text-slate-500 font-semibold text-center pt-0.5">:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug pl-1">
                            {deliveryAddress}
                        </span>
                    </div>
                )}

                {/* Recipient / Signee */}
                <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Recipient / Signee</span>
                    <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 pl-1">{receiverName || '-'}</span>
                </div>

                {/* Delivered On */}
                {uploadedAt && (
                    <div className="py-2 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Delivered On</span>
                        <span className="text-slate-400 dark:text-slate-500 font-semibold text-center">:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 pl-1">{uploadedAt}</span>
                    </div>
                )}

                {/* Escrow Payout */}
                <div className="py-2.5 grid grid-cols-[130px_16px_1fr] sm:grid-cols-[145px_16px_1fr] items-center bg-emerald-50/70 dark:bg-emerald-950/30 -mx-3 sm:-mx-3.5 px-3 sm:px-3.5 rounded-b-lg border-t border-emerald-200/70 dark:border-emerald-800/60">
                    <span className="text-emerald-900 dark:text-emerald-200 font-bold">Escrow Payout</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-center">:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[13px] pl-1">
                        {amountFormatted}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PodDeliverySummary;
