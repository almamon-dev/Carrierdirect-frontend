import React, { useState } from 'react';
import { GPSComingSoonModal } from '@/components/modals';
import { Phone, MessageSquare, MapPin, Building2, User, Clock, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PartyInfo {
    name: string;
    company: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    timeWindow?: string;
    notes?: string;
}

interface Props {
    title: string;
    type: 'shipper' | 'consignee';
    party: PartyInfo;
}

export const ContactPartyCard: React.FC<Props> = ({ title, type, party }) => {
    const isShipper = type === 'shipper';
    const [isGPSOpen, setIsGPSOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-6 h-6 rounded-[3px] flex items-center justify-center text-xs ${
                            isShipper
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                : 'bg-orange-100 text-[#FF4A1F] dark:bg-orange-950/40 dark:text-orange-400'
                        }`}
                    >
                        {isShipper ? <Building2 size={13} /> : <MapPin size={13} />}
                    </div>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {title}
                    </h3>
                </div>
            </div>

            <div className="space-y-1">
                <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">{party.company}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <User size={11} className="text-slate-400" />
                    <span>Contact: {party.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {party.address}, {party.city}, {party.state} {party.zip}
                </div>
                {party.timeWindow && (
                    <div className="text-[11px] font-semibold text-[#FF4A1F] pt-0.5 flex items-center gap-1">
                        <Clock size={11} />
                        <span>Scheduled: {party.timeWindow}</span>
                    </div>
                )}
                {party.notes && (
                    <div className="text-[10.5px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-[3px] border border-amber-200/60 dark:border-amber-900/40 mt-1.5">
                        <span className="font-bold">Instructions:</span> {party.notes}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <a
                    href={`tel:${party.phone}`}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#161a22] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-[4px] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                    <Phone size={12} className="text-[#FF4A1F]" />
                    <span>Call</span>
                </a>

                <Link
                    to="/driver/chat"
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#161a22] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-[4px] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                    <MessageSquare size={12} className="text-blue-500" />
                    <span>Chat</span>
                </Link>

                <button
                    type="button"
                    onClick={() => setIsGPSOpen(true)}
                    className="py-1.5 px-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/60 dark:border-orange-900/50 rounded-[4px] text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                    <Navigation size={12} />
                    <span>GPS</span>
                </button>
            </div>

            <GPSComingSoonModal
                isOpen={isGPSOpen}
                destination={`${party.address}, ${party.city}`}
                onClose={() => setIsGPSOpen(false)}
            />
        </div>
    );
};
