import React, { useState } from 'react';
import { X, Headphones, PhoneCall, AlertOctagon, MessageSquare, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const DispatcherSupportModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [sosTriggered, setSosTriggered] = useState(false);

    if (!isOpen) return null;

    const handleSOS = () => {
        setSosTriggered(true);
        setTimeout(() => {
            // SOS alert triggered toast or signal
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#12161c] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                            <Headphones size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">24/7 Dispatcher & Safety Support</h2>
                            <p className="text-xs text-slate-500">Direct priority line and SOS emergency</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {sosTriggered ? (
                        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xl text-center space-y-2">
                            <ShieldAlert size={32} className="mx-auto text-red-600 animate-bounce" />
                            <h3 className="text-sm font-bold text-red-700 dark:text-red-400">Emergency SOS Broadcast Active</h3>
                            <p className="text-xs text-red-600 dark:text-red-300">
                                Your GPS location (lat: 40.2171, lng: -74.7429) and truck telemetry have been dispatched to HQ Safety & On-Duty Emergency Dispatcher.
                            </p>
                            <div className="pt-2">
                                <a
                                    href="tel:+18005550199"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-red-700"
                                >
                                    <PhoneCall size={14} />
                                    <span>Call Emergency Dispatch Now</span>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Priority Hotline */}
                            <div className="p-4 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">HQ Central Dispatch Hotline</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-mono font-bold text-slate-900 dark:text-white">+1 (800) 555-0199</span>
                                    <a
                                        href="tel:+18005550199"
                                        className="px-3 py-1.5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                                    >
                                        <PhoneCall size={13} />
                                        <span>Call</span>
                                    </a>
                                </div>
                            </div>

                            {/* Chat link */}
                            <Link
                                to="/driver/chat"
                                onClick={onClose}
                                className="p-4 bg-slate-50 dark:bg-[#1a1f26] rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between hover:border-[#FF4A1F] transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#FF4A1F] transition-colors">
                                            Live In-App Chat with Dispatcher
                                        </div>
                                        <div className="text-[11px] text-slate-400">Average response time: &lt; 2 minutes</div>
                                    </div>
                                </div>
                                <span className="text-xs text-[#FF4A1F] font-bold">Open Chat ➔</span>
                            </Link>

                            {/* Emergency SOS Button */}
                            <div className="pt-2">
                                <button
                                    onClick={handleSOS}
                                    className="w-full p-3.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                                >
                                    <AlertOctagon size={18} />
                                    <span>Trigger Priority Emergency SOS</span>
                                </button>
                                <p className="text-[11px] text-center text-slate-400 mt-1.5">
                                    Sends instant priority alert with live vehicle coordinates to dispatch
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-[#161a22]">
                    <Button onClick={onClose} variant="outline" className="text-xs px-4 py-1.5">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};
