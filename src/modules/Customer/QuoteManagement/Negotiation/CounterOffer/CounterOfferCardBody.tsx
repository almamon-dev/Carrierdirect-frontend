import React from 'react';
import { RefreshCw, Tag, MapPin, Package, Landmark, Receipt, Truck, ChevronRight } from 'lucide-react';
import { getServiceIcon } from '@/modules/Customer/QuoteManagement/Negotiation/Actions/components/CounterOfferModal';

interface CounterOfferCardBodyProps {
    isRevised: boolean;
    isSupplierOffer: boolean;
    isSentByMe: boolean;
    quoteNum: string;
    time?: string;
    pickupLoc: string;
    deliveryLoc: string;
    distanceStr: string;
    currency: string;
    basePrice: number;
    extraList: any[];
    prevPrice: number;
    proposedPrice: number;
    palletType: string;
    vehicleType: string;
    pickupDate: string;
    deliveryDate: string;
    notesText: string;
    isDetailsOpen: boolean;
    setIsDetailsOpen: (val: boolean) => void;
}

export const CounterOfferCardBody: React.FC<CounterOfferCardBodyProps> = ({
    isRevised,
    isSupplierOffer,
    isSentByMe,
    quoteNum,
    time,
    pickupLoc,
    deliveryLoc,
    distanceStr,
    currency,
    basePrice,
    extraList,
    prevPrice,
    proposedPrice,
    palletType,
    vehicleType,
    pickupDate,
    deliveryDate,
    notesText,
    isDetailsOpen,
    setIsDetailsOpen,
}) => {
    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#FF6A00] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-900/40">
                        {isRevised ? <RefreshCw className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                            {isRevised
                                ? (isSentByMe ? "Revised Offer Details" : "Revised Offer Received")
                                : isSupplierOffer
                                    ? (isSentByMe ? "Quotation Offer Details" : "Quotation Offer Received")
                                    : (isSentByMe ? "Counter Offer Details" : "Counter Offer Received")
                            }
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{time || '-'}</p>
                    </div>
                </div>

                <span className="text-[11px] font-semibold text-[#FF6A00] bg-orange-50/70 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-[2px] border border-[#FF6A00]/40 shrink-0">
                    #{String(quoteNum).replace(/^#+/, '')}
                </span>
            </div>

            {/* Route */}
            <div className="py-1 text-[11.5px]">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#FF6A00] bg-white dark:bg-slate-900 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{pickupLoc}</span>
                    </div>
                    <span className="text-[10.5px] font-medium text-slate-400 shrink-0 ml-2">{distanceStr}</span>
                </div>

                <div className="ml-[4px] pl-3.5 border-l-2 border-dotted border-slate-300 dark:border-slate-700 h-3.5 my-0.5" />

                <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={13} className="text-[#2563EB] shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{deliveryLoc}</span>
                </div>
            </div>

            {/* Itemized Breakdown */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-1.5 text-[11.5px]">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                        <Package size={13} className="text-slate-400 shrink-0" />
                        <span>Base Freight Rate</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                        {currency} {basePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                {extraList.length > 0 && extraList.map((ext: any, idx: number) => {
                    const label = ext.customName || ext.custom_name || ext.label || ext.type || "Extra Fee";
                    const isToll = label.toLowerCase().includes('toll');
                    const isCustoms = label.toLowerCase().includes('custom');
                    const IconComponent = isToll ? Landmark : isCustoms ? Receipt : getServiceIcon(label);

                    return (
                        <div key={idx} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                                <IconComponent size={13} className="text-slate-400 shrink-0" />
                                <span>{label}</span>
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                +{currency} {Number(ext.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Total Offer Row */}
            <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between">
                <div>
                    {prevPrice > 0 && prevPrice !== proposedPrice && (
                        <span className="text-[10px] text-slate-400 block line-through leading-none">
                            Prev: {currency} {prevPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    )}
                    <span className="font-bold text-slate-900 dark:text-white text-[12.5px] leading-tight mt-0.5 block">
                        {isRevised
                            ? (isSentByMe ? "Total Revised Rate" : "Revised Offer Rate")
                            : isSupplierOffer
                                ? "Total Offered Rate"
                                : (isSentByMe ? "Total Offered Rate" : "Counter Offer Rate")
                        }
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                        {currency} {proposedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* Cargo Footer Row */}
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
                    <span>{isDetailsOpen ? "Close Details" : "View Details"}</span>
                    <ChevronRight size={13} className={`transition-transform duration-150 ${isDetailsOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>

            {isDetailsOpen && (
                <div className="pt-1.5 space-y-1.5 w-full min-w-0">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Pickup Date:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{pickupDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Delivery Date:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300">{deliveryDate}</span>
                        </div>
                        {notesText && (
                            <div className="pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                                <span className="text-slate-400 block text-[10px]">Notes:</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300 italic break-words whitespace-normal leading-relaxed">{notesText}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
