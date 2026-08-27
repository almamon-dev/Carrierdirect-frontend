import React from 'react';
import { MapPin, FileText, Download, Upload } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { SupplierOrder } from '../../types/order.types';

interface OrderRouteAndPODProps {
    order: SupplierOrder;
    podUploaded: boolean;
    onOpenUploadModal: () => void;
}

export const OrderRouteAndPOD: React.FC<OrderRouteAndPODProps> = ({
    order,
    podUploaded,
    onOpenUploadModal,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Pickup & Delivery Cards (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-2xs">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">Location Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pickup Box */}
                        <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                    <MapPin size={14} className="text-slate-600 dark:text-slate-400" /> Pickup Point
                                </span>
                                <span className="text-xs text-slate-500">{order.pickupDate}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{order.pickup}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{order.pickupFullAddress}</p>
                            <p className="text-xs text-slate-500 pt-1">Time Slot: <strong className="text-slate-700 dark:text-slate-300">{order.pickupTimeWindow}</strong></p>
                        </div>

                        {/* Delivery Box */}
                        <div className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                    <MapPin size={14} className="text-slate-600 dark:text-slate-400" /> Delivery Destination
                                </span>
                                <span className="text-xs text-slate-500">{order.deliveryDate}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{order.delivery}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{order.deliveryFullAddress}</p>
                            <p className="text-xs text-slate-500 pt-1">Time Slot: <strong className="text-slate-700 dark:text-slate-300">{order.deliveryTimeWindow}</strong></p>
                        </div>
                    </div>
                </div>

                {/* Cargo Specs Box */}
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-2xs">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">Cargo Specification</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded">
                            <span className="text-slate-500 font-medium block">Load Type</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block text-xs">{order.loadType}</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded">
                            <span className="text-slate-500 font-medium block">Weight</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block text-xs">{order.weight}</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded">
                            <span className="text-slate-500 font-medium block">Volume</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block text-xs">{order.volume}</span>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded">
                            <span className="text-slate-500 font-medium block">Cargo Items</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block text-xs">{order.cargoItemsCount} Units</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Proof of Delivery (POD) (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Proof of Delivery (POD)</h3>
                    <Badge 
                        variant="secondary" 
                        className={
                            podUploaded ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-amber-50 text-amber-700 font-semibold'
                        }
                    >
                        {podUploaded ? 'POD Attached' : 'Pending POD'}
                    </Badge>
                </div>

                {podUploaded ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-md space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-md">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Signed_POD_{order.id}.pdf</h4>
                                <p className="text-[11px] text-slate-500">{order.podUploadDate || 'Uploaded recently'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-xs h-8 cursor-pointer"
                                onClick={() => {
                                    if (order.podFileUrl) window.open(order.podFileUrl, '_blank');
                                    else alert(`Downloading POD for ${order.id}...`);
                                }}
                            >
                                <Download size={13} className="mr-1" /> View POD
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 text-xs h-8 cursor-pointer"
                                onClick={onOpenUploadModal}
                            >
                                Re-upload
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-md text-center space-y-3">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                            <Upload size={18} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">No POD Document Uploaded</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">Signed delivery receipt required for payment settlement</p>
                        </div>
                        <Button 
                            variant="primary" 
                            size="sm" 
                            className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs h-8 cursor-pointer"
                            onClick={onOpenUploadModal}
                        >
                            Upload POD Document
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
