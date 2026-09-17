import React, { useState } from 'react';
import { X, Navigation, Check, Compass, Map, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/button';
import { DriverProfile } from '../../types';

interface Props {
    isOpen: boolean;
    currentApp: DriverProfile['preferences']['navigationApp'];
    onClose: () => void;
    onSelect: (appName: DriverProfile['preferences']['navigationApp']) => Promise<void>;
}

const navOptions: { name: DriverProfile['preferences']['navigationApp']; desc: string; icon: string; badge?: string }[] = [
    {
        name: 'Google Truck GPS',
        desc: 'Commercial truck routing, bridge heights, hazardous cargo restrictions & live traffic.',
        icon: '🚛',
        badge: 'Recommended for Freight',
    },
    {
        name: 'Waze',
        desc: 'Real-time police traps, road construction, hazard warnings & community alerts.',
        icon: '🚙',
    },
    {
        name: 'Apple Maps',
        desc: 'Clean 3D navigation, lane guidance and detailed city junction views.',
        icon: '🍎',
    },
    {
        name: 'HERE WeGo',
        desc: 'Offline truck maps, heavy vehicle speed limit warnings and toll cost estimates.',
        icon: '🗺️',
    },
];

export const NavPreferencesModal: React.FC<Props> = ({ isOpen, currentApp, onClose, onSelect }) => {
    const [selected, setSelected] = useState<DriverProfile['preferences']['navigationApp']>(currentApp);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSelect(selected);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#12161c] rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                            <Navigation size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">Navigation App</h2>
                            <p className="text-xs text-slate-500">Choose default GPS app for one-click route launching</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 space-y-2.5">
                    {navOptions.map((opt) => {
                        const isChosen = selected === opt.name;
                        return (
                            <div
                                key={opt.name}
                                onClick={() => setSelected(opt.name)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                                    isChosen
                                        ? 'bg-orange-50/70 dark:bg-orange-950/20 border-[#FF4A1F] dark:border-orange-600 ring-1 ring-[#FF4A1F]/30'
                                        : 'bg-slate-50/60 dark:bg-[#1a1f26] border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                            >
                                <span className="text-2xl shrink-0 mt-0.5">{opt.icon}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{opt.name}</span>
                                            {opt.badge && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-100 dark:bg-orange-950/60 text-[#FF4A1F] rounded-full">
                                                    {opt.badge}
                                                </span>
                                            )}
                                        </div>
                                        {isChosen && (
                                            <div className="w-5 h-5 rounded-full bg-[#FF4A1F] text-white flex items-center justify-center shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-[#161a22]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-xs"
                    >
                        Set as Default GPS
                    </Button>
                </div>
            </div>
        </div>
    );
};
