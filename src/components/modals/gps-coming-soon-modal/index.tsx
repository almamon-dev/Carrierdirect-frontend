import React from "react";
import { Navigation, Sparkles, Compass, Radio, MapPin, Gauge } from "lucide-react";
import Modal from "@/components/modals/modal";
import Button from "@/components/ui/button";

export interface GPSComingSoonModalProps {
    isOpen: boolean;
    onClose: () => void;
    destination?: string;
    locationType?: "pickup" | "delivery" | "route" | "general";
}

export const GPSComingSoonModal: React.FC<GPSComingSoonModalProps> = ({
    isOpen,
    onClose,
    destination,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={true}
        >
            <div className="flex flex-col items-center text-center pt-2 pb-1 px-1 font-sans">
                {/* Visual Icon Badge */}
                <div className="relative mb-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/80 dark:border-orange-900/60 flex items-center justify-center shadow-md">
                        <Navigation size={28} className="rotate-45" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF4A1F] text-white flex items-center justify-center text-[10px] shadow-sm">
                        <Sparkles size={12} />
                    </span>
                </div>

                {/* Heading */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Live GPS Navigation Coming Soon
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-[290px]">
                    Integrated in-app truck navigation, real-time corridor telematics, and automated geo-fencing are currently under active development.
                </p>

                {/* Target Destination Preview if provided */}
                {destination && (
                    <div className="mt-3.5 w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg p-2.5 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-left">
                        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF4A1F] flex items-center justify-center shrink-0">
                            <MapPin size={12} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Waypoint</div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{destination}</div>
                        </div>
                    </div>
                )}

                {/* Feature preview bullets */}
                <div className="mt-3.5 w-full bg-slate-50 dark:bg-slate-900/40 rounded-lg p-3 border border-slate-200/70 dark:border-slate-800/80 text-left space-y-2">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <Gauge size={14} className="text-emerald-600 shrink-0" />
                        <span>Truck-safe low bridge & weight clearance</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <Radio size={14} className="text-[#FF4A1F] shrink-0" />
                        <span>Live traffic, weigh station & fuel radar</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <Compass size={14} className="text-blue-500 shrink-0" />
                        <span>Automated facility arrival geo-fencing</span>
                    </div>
                </div>

                {/* Action button */}
                <div className="mt-5 w-full">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="h-8.5 px-4 w-full bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold rounded-[4px] shadow-sm transition-all cursor-pointer inline-flex items-center justify-center"
                    >
                        Got it, thanks
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default GPSComingSoonModal;
