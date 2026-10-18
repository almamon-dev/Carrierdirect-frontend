import React from 'react';
import { Search, MapPin, ExternalLink, Globe2 } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { getCountryFlag } from '@/constants/countries';
import { useNavigate } from 'react-router-dom';

interface CoverageBreakdownModalProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    onSearchChange: (v: string) => void;
    filteredItems: any[];
    totalCount: number;
    activeCount: number;
    onSelectArea?: (area: any) => void;
}

export function CoverageBreakdownModal({
    isOpen,
    onClose,
    searchTerm,
    onSearchChange,
    filteredItems,
    totalCount,
    activeCount,
    onSelectArea,
}: CoverageBreakdownModalProps) {
    const navigate = useNavigate();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="p-4 sm:p-5 flex flex-col max-h-[85vh] font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[4px] bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center">
                            <Globe2 size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Operational Coverage Breakdown
                            </h3>
                            <p className="text-[11px] text-slate-500">
                                {totalCount} total configured service areas ({activeCount} active).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative my-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search service areas by country, city or region..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4px] focus:outline-none focus:border-[#ff4a1f]"
                    />
                </div>

                {/* List Container */}
                <div className="overflow-y-auto flex-1 space-y-1.5 pr-1 max-h-[360px]">
                    {filteredItems.length === 0 ? (
                        <div className="py-8 text-center text-xs text-slate-400">
                            No service areas found matching "{searchTerm}"
                        </div>
                    ) : (
                        filteredItems.map((item) => {
                            const flag = item.area?.flag || (item.area?.country ? getCountryFlag(item.area.country) : '🌍');
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        if (item.area && onSelectArea) onSelectArea(item.area);
                                        onClose();
                                    }}
                                    className="p-2.5 rounded-[4px] border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="text-base shrink-0">{flag}</span>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                    {item.name}
                                                </span>
                                                <span
                                                    className="w-2 h-2 rounded-full shrink-0"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 text-[10.5px] text-slate-400 mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={10} className="text-[#ff4a1f]" />
                                                    {item.area?.type || 'Standard Coverage'}
                                                </span>
                                                {item.area?.postal_code && (
                                                    <span>• ZIP: {item.area.postal_code}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 shrink-0 pl-2">
                                        <div className="text-right">
                                            <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100">
                                                {item.value}%
                                            </span>
                                            <span className="block text-[9.5px] text-slate-400">
                                                Share
                                            </span>
                                        </div>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                            item.area?.active ?? true
                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {item.area?.active ?? true ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">
                        Showing {filteredItems.length} of {totalCount} areas
                    </span>
                    <Button
                        size="sm"
                        onClick={() => {
                            onClose();
                            navigate('/supplier/availability/routes');
                        }}
                        className="h-7 px-3 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5"
                    >
                        <span>Manage Service Areas</span>
                        <ExternalLink size={12} />
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
export default CoverageBreakdownModal;
