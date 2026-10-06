import React from 'react';
import { Phone, Building, User, Headphones, MessageSquare } from 'lucide-react';
import { ShipmentItem } from '../../../types';
import { Link } from 'react-router-dom';

interface Props {
    shipment: ShipmentItem;
}

export const DriverShipmentContactsCard: React.FC<Props> = ({ shipment }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 font-sans">
            <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Headphones size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Direct Dispatch Contacts
                    </h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                    24/7 Support
                </span>
            </div>

            <div className="space-y-2 text-xs">
                {/* Shipper Facility */}
                <div className="p-2 bg-slate-50 dark:bg-[#161a22] rounded border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Shipper Dock</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block text-[11.5px]">
                            {shipment.shipper.company}
                        </span>
                    </div>
                    <a
                        href={`tel:${shipment.shipper.phone}`}
                        className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-200 hover:text-[#FF4A1F] border border-slate-200 dark:border-slate-700 rounded text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                        <Phone size={10} className="text-[#FF4A1F]" />
                        <span>Call</span>
                    </a>
                </div>

                {/* Consignee Receiver */}
                <div className="p-2 bg-slate-50 dark:bg-[#161a22] rounded border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Consignee Receiver</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block text-[11.5px]">
                            {shipment.consignee.company}
                        </span>
                    </div>
                    <a
                        href={`tel:${shipment.consignee.phone}`}
                        className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-slate-700 dark:text-slate-200 hover:text-[#FF4A1F] border border-slate-200 dark:border-slate-700 rounded text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                    >
                        <Phone size={10} className="text-[#FF4A1F]" />
                        <span>Call</span>
                    </a>
                </div>

                {/* Emergency Carrier Hotline */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Emergency Driver Helpline:</span>
                    <a href="tel:+18005550199" className="font-mono font-bold text-[#FF4A1F] hover:underline">
                        1-800-CARRIER
                    </a>
                </div>
            </div>
        </div>
    );
};
