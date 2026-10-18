import React, { useState } from 'react';
import { ChevronRight, Truck } from 'lucide-react';
import { QuoteRequestCardDetails } from './QuoteRequestCardDetails';

interface QuoteBubbleCargoFooterProps {
    palletType: string;
    vehicleType: string;
    pickupDate: string;
    deliveryDate: string;
    notesText: string;
}

export const QuoteBubbleCargoFooter: React.FC<QuoteBubbleCargoFooterProps> = ({
    palletType,
    vehicleType,
    pickupDate,
    deliveryDate,
    notesText,
}) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    return (
        <>
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0 truncate">
                    <Truck size={13} className="text-slate-500 shrink-0" />
                    <span className="truncate">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Cargo: </span>
                        {palletType} • {vehicleType}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    className="font-semibold text-[#FF6A00] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 ml-2"
                >
                    <span>{isDetailsOpen ? 'Close Details' : 'View Details'}</span>
                    <ChevronRight
                        size={13}
                        className={`transition-transform duration-150 ${isDetailsOpen ? 'rotate-90' : ''}`}
                    />
                </button>
            </div>

            {isDetailsOpen && (
                <div className="pt-1.5 space-y-1.5">
                    <QuoteRequestCardDetails
                        isOpen={isDetailsOpen}
                        pickupDate={pickupDate}
                        deliveryDate={deliveryDate}
                        palletType={palletType}
                        vehicleType={vehicleType}
                        notes={notesText}
                    />
                </div>
            )}
        </>
    );
};
