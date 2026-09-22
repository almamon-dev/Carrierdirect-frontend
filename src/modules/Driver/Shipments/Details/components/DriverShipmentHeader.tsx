import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Navigation } from 'lucide-react';
import { ShipmentItem } from '../../../types';
import { ShipmentStatusBadge } from '../../components/ShipmentStatusBadge';
import { requireDriverCompliance } from '../../../Compliance';

interface Props {
    shipment: ShipmentItem;
    onOpenPOD?: () => void;
    onUpdateStatus?: (nextStatus: any) => void;
    onOpenGPS?: () => void;
}

export const DriverShipmentHeader: React.FC<Props> = ({ shipment, onOpenGPS }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleCopyId = () => {
        navigator.clipboard.writeText(shipment.orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLaunchGPS = () => {
        requireDriverCompliance(() => {
            if (onOpenGPS) {
                onOpenGPS();
            } else {
                const dest = `${shipment.consignee.address}, ${shipment.consignee.city}`;
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`, '_blank');
            }
        }, 'Live GPS Navigation & Location Tracking');
    };

    return (
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 font-sans pb-1">
            {/* Left: Back Link + Order ID + Tracking Badge + Status */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <button
                    type="button"
                    onClick={() => navigate('/driver/shipments')}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-colors font-medium cursor-pointer mr-1"
                >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                </button>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
                    {shipment.orderNumber}
                </h1>

                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1e2329] px-2 py-0.5 rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs">
                    {shipment.trackingNumber}
                </span>

                <ShipmentStatusBadge status={shipment.status} />

                {shipment.priority === 'Urgent' && (
                    <span className="h-6.5 px-2.5 text-[11px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 rounded-[4px] border border-red-200/60 dark:border-red-900/40 inline-flex items-center">
                        Urgent Dispatch
                    </span>
                )}
            </div>

            {/* Right: Live GPS Tracking & Copy ID */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {/* Live GPS Tracking Button */}
                <button
                    type="button"
                    onClick={handleLaunchGPS}
                    className="h-8 px-3.5 inline-flex items-center gap-2 bg-orange-50 hover:bg-orange-100/80 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/60 dark:border-orange-900/40 rounded-[4px] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    title="Live Driver GPS Location Tracking"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4A1F] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4A1F]"></span>
                    </span>
                    <Navigation size={12} />
                    <span>Live GPS Tracking</span>
                </button>

                {/* Copy Load ID Button */}
                <button
                    type="button"
                    onClick={handleCopyId}
                    className="h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-[4px] transition-colors cursor-pointer shadow-2xs"
                    title="Copy Load ID"
                >
                    {copied ? (
                        <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy size={13} className="text-slate-400" />
                            <span>Copy Load ID</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DriverShipmentHeader;
