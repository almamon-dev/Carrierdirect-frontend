import React from 'react';
import { AlertCircle, RefreshCw, Search, X } from 'lucide-react';
import Button from '@/components/ui/button';

interface TrackShipmentEmptyStateProps {
    searchInput: string;
    onSearchInputChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onClear: () => void;
    isSearching: boolean;
    errorMessage: string | null;
}

export const TrackShipmentEmptyState: React.FC<TrackShipmentEmptyStateProps> = ({
    searchInput,
    onSearchInputChange,
    onSubmit,
    onClear,
    isSearching,
    errorMessage,
}) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs w-full min-h-[76vh] flex flex-col items-center justify-center p-6 sm:p-10 font-sans">
            <div className="w-full max-w-xl mx-auto text-center space-y-5">
                {/* Map + Route + Pin Illustration */}
                <div className="mx-auto w-28 h-24 flex items-center justify-center">
                    <svg viewBox="0 0 140 115" className="w-full h-full" fill="none">
                        <path
                            d="M18 28L52 16L88 28L122 16V88L88 100L52 88L18 100V28Z"
                            fill="#FFF3ED"
                            stroke="#FDBA8C"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <path d="M52 16V88" stroke="#FDBA8C" strokeWidth="1.5" strokeDasharray="3 3" />
                        <path d="M88 28V100" stroke="#FDBA8C" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx="36" cy="48" r="9" fill="#FFE4D6" />
                        <circle cx="104" cy="70" r="11" fill="#FFE4D6" />
                        <path
                            d="M34 78C46 60 58 65 72 52C82 43 92 44 100 36"
                            stroke="#FF4A1F"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="5 5"
                        />
                        <path
                            d="M98 8C87.5 8 79 16.5 79 27C79 41.2 98 58 98 58C98 58 117 41.2 117 27C117 16.5 108.5 8 98 8Z"
                            fill="#FF4A1F"
                        />
                        <circle cx="98" cy="27" r="7" fill="#FFFFFF" />
                    </svg>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Track Your Shipment
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                        Enter your tracking ID to see real-time location, route, distance, and delivery status.
                    </p>
                </div>

                {/* System-Matched Search Bar */}
                <form
                    onSubmit={onSubmit}
                    className="bg-slate-50 dark:bg-[#14181f] border border-slate-200 dark:border-slate-800 rounded-[4px] p-1.5 shadow-2xs flex items-center gap-2 max-w-lg mx-auto"
                >
                    <div className="relative flex-1 flex items-center">
                        <Search size={15} className="ml-2.5 text-slate-400 shrink-0 pointer-events-none" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => onSearchInputChange(e.target.value)}
                            placeholder="Enter tracking ID (e.g. ORD-0001)"
                            className="w-full h-8.5 pl-2.5 pr-7 text-xs font-semibold bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                title="Clear"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSearching}
                        className="h-8.5 px-5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                    >
                        {isSearching ? (
                            <>
                                <RefreshCw size={13} className="animate-spin" />
                                <span>Tracking...</span>
                            </>
                        ) : (
                            <span>Track</span>
                        )}
                    </Button>
                </form>

                {errorMessage && (
                    <div className="max-w-lg mx-auto p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[4px] text-red-700 dark:text-red-300 text-xs font-semibold flex items-center justify-center gap-2">
                        <AlertCircle size={14} className="shrink-0 text-red-600" />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackShipmentEmptyState;

