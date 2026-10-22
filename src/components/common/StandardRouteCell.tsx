import React from 'react';
import { MapPin } from 'lucide-react';
import { formatStandardAddress, formatStandardRoute } from '@/utils/addressFormatter';

interface StandardRouteCellProps {
    row: any;
    fallbackTransit?: string;
    showPriority?: boolean;
    showCargo?: boolean;
    extraSubInfo?: string | null;
}

export const StandardRouteCell: React.FC<StandardRouteCellProps> = ({
    row,
    fallbackTransit,
    showPriority = true,
    showCargo = true,
    extraSubInfo
}) => {
    const origin = formatStandardAddress(row, 'pickup');
    const destination = formatStandardAddress(row, 'delivery');
    const fullRoute = `${origin} → ${destination}`;
    const displayRoute = formatStandardRoute(row, fullRoute);

    // Split route into origin and destination for crisp rendering with styled arrow
    const arrowParts = displayRoute.includes('→')
        ? displayRoute.split('→').map(s => s.trim())
        : (displayRoute.includes('⇆') ? displayRoute.split('⇆').map(s => s.trim()) : null);

    const fromPart = arrowParts ? arrowParts[0] : origin;
    const toPart = arrowParts ? arrowParts[1] : destination;

    const rawDist = row.distance;
    const cleanDistance = rawDist
        ? (String(rawDist).toLowerCase().includes('km') ? String(rawDist) : `${rawDist} km`)
        : null;

    const transit = row.transit || row.transit_time || row.deliveryDate || row.estimated_delivery || fallbackTransit;
    const cargo = showCargo ? (row.items_summary || row.itemsSummary || (row.pallets_count ? `${row.pallets_count} Pallets` : null)) : null;
    const priority = showPriority && row.priority && row.priority !== 'Standard' && row.priority !== 'Normal' ? `${row.priority} Priority` : null;

    const otherSubParts = [
        cargo,
        transit ? `${transit} transit` : null,
        priority,
        extraSubInfo
    ].filter(Boolean);

    const hasSubInfo = Boolean(cleanDistance || otherSubParts.length > 0);

    return (
        <div className="flex flex-col justify-center min-w-0 max-w-full overflow-hidden pr-2 min-h-[30px]" title={displayRoute}>
            <div className="flex items-center gap-1.5 min-w-0 max-w-full text-[13.5px] font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                <span className="truncate" title={fromPart}>{fromPart}</span>
                <span
                    className="text-[#ff4a1f] dark:text-[#ff4a1f] font-black shrink-0 text-[15.5px] select-none leading-none mx-0.5 inline-flex items-center tracking-normal font-bold"
                    aria-hidden="true"
                >
                    ⇆
                </span>
                <span className="truncate" title={toPart}>{toPart}</span>
            </div>
            {hasSubInfo && (
                <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5 leading-tight">
                    {cleanDistance && (
                        <span className="inline-flex items-center gap-1 shrink-0 text-slate-600 dark:text-slate-300 font-medium">
                            <MapPin size={11.5} className="text-[#ff4a1f] shrink-0" />
                            <span>{cleanDistance}</span>
                        </span>
                    )}
                    {otherSubParts.map((item, idx) => (
                        <React.Fragment key={idx}>
                            {(!cleanDistance && idx === 0) ? null : (
                                <span className="text-slate-300 dark:text-slate-600 select-none">•</span>
                            )}
                            <span className="truncate">{item}</span>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StandardRouteCell;
