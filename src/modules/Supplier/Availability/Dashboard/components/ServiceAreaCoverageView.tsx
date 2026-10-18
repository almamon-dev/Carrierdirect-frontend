import React, { useState, useEffect, useMemo } from 'react';
import {
    PieChart as PieChartIcon,
    Map as MapIcon,
    Globe2,
    CheckCircle2,
    MapPin,
    Sparkles,
    Plus,
} from 'lucide-react';
import { ServiceAreaCoverageViewProps } from '../types/coverage.types';
import { fetchGoogleMapsApiKey, CHART_COLORS } from '../utils/coverageCoordinates';
import { CoverageLeafletMap } from './CoverageLeafletMap';
import { CoverageDonutChart } from './CoverageDonutChart';
import { CoverageBreakdownModal } from './CoverageBreakdownModal';

export type { ServiceAreaSummary, CoverageMapData } from '../types/coverage.types';

export const ServiceAreaCoverageView: React.FC<ServiceAreaCoverageViewProps> = ({
    serviceAreas,
    coverageMap,
    hoveredAreaId,
    onHoverArea,
    onSelectArea,
}) => {
    const [viewType, setViewType] = useState<'graph' | 'map'>('graph');
    const [apiKey, setApiKey] = useState<string | null>(coverageMap?.google_maps_key || null);
    const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
    const [modalSearchTerm, setModalSearchTerm] = useState('');

    useEffect(() => {
        if (coverageMap?.google_maps_key) {
            setApiKey(coverageMap.google_maps_key);
        } else if (!apiKey) {
            fetchGoogleMapsApiKey().then((k) => {
                if (k) setApiKey(k);
            });
        }
    }, [coverageMap?.google_maps_key]);

    const chartData = useMemo(() => {
        if (coverageMap?.breakdown && coverageMap.breakdown.length > 0) {
            return coverageMap.breakdown.map((item, idx) => ({
                id: item.id,
                name: item.name,
                shortName: item.short_name,
                value: item.value,
                color: item.color || CHART_COLORS[idx % CHART_COLORS.length],
                area: serviceAreas.find((a) => String(a.id) === String(item.id)),
            }));
        }

        if (serviceAreas.length === 0) return [];
        const activeAreas = serviceAreas.filter((a) => a.active);
        const source = activeAreas.length > 0 ? activeAreas : serviceAreas;
        const total = source.length;
        const equalShare = Math.round(100 / total);

        return source.map((area, index) => ({
            id: area.id,
            name: area.formatted || area.name,
            shortName: area.city || area.country || area.name,
            value: area.percentage !== undefined ? area.percentage : (index === total - 1 ? 100 - equalShare * (total - 1) : equalShare),
            color: area.color || CHART_COLORS[index % CHART_COLORS.length],
            area,
        }));
    }, [serviceAreas, coverageMap]);

    const visibleTags = useMemo(() => chartData.slice(0, 4), [chartData]);
    const remainingCount = Math.max(0, chartData.length - visibleTags.length);

    const filteredModalItems = useMemo(() => {
        if (!modalSearchTerm.trim()) return chartData;
        const term = modalSearchTerm.toLowerCase().trim();
        return chartData.filter((item) => {
            const name = (item.name || '').toLowerCase();
            const shortName = (item.shortName || '').toLowerCase();
            const city = (item.area?.city || '').toLowerCase();
            const country = (item.area?.country || '').toLowerCase();
            return name.includes(term) || shortName.includes(term) || city.includes(term) || country.includes(term);
        });
    }, [chartData, modalSearchTerm]);

    const totalCount = serviceAreas.length;
    const activeCount = serviceAreas.filter((a) => a.active).length;
    const overallPercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100;

    return (
        <div className="w-full h-full flex flex-col justify-between select-none">
            {/* View Switcher Header */}
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff4a1f] animate-pulse" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {viewType === 'graph' ? 'Coverage Share (Graph)' : 'Operating Map View'}
                    </span>
                </div>

                <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-[4px] border border-slate-200/80 dark:border-slate-700/80">
                    <button
                        type="button"
                        onClick={() => setViewType('graph')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
                            viewType === 'graph'
                                ? 'bg-white dark:bg-[#18202a] text-[#ff4a1f] shadow-2xs font-bold'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                        }`}
                    >
                        <PieChartIcon size={12} />
                        <span>Graph View</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewType('map')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[3px] text-xs font-semibold transition-all cursor-pointer ${
                            viewType === 'map'
                                ? 'bg-white dark:bg-[#18202a] text-[#ff4a1f] shadow-2xs font-bold'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                        }`}
                    >
                        <MapIcon size={12} />
                        <span>Map View</span>
                    </button>
                </div>
            </div>

            {/* View Body */}
            {viewType === 'graph' ? (
                <CoverageDonutChart
                    chartData={chartData}
                    hoveredAreaId={hoveredAreaId}
                    overallPercentage={overallPercentage}
                    activeCount={activeCount}
                    totalCount={totalCount}
                    onHoverArea={onHoverArea}
                />
            ) : (
                <CoverageLeafletMap
                    serviceAreas={serviceAreas}
                    coverageMap={coverageMap}
                    apiKey={apiKey}
                    onHoverArea={onHoverArea}
                    onSelectArea={onSelectArea}
                />
            )}

            {/* Bottom Tag Strip */}
            <div className="mt-3 flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1 flex-wrap min-w-0">
                    {visibleTags.map((t) => (
                        <div
                            key={t.id}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-medium"
                        >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                            <span className="truncate max-w-[80px]">{t.shortName}</span>
                            <span className="font-bold text-[#ff4a1f]">{t.value}%</span>
                        </div>
                    ))}
                    {remainingCount > 0 && (
                        <button
                            type="button"
                            onClick={() => setIsBreakdownModalOpen(true)}
                            className="px-1.5 py-0.5 rounded-[3px] bg-orange-50 dark:bg-[#ff4a1f]/15 border border-orange-200 dark:border-orange-800 text-[10px] font-bold text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                            <Plus size={9} />
                            <span>{remainingCount} More</span>
                        </button>
                    )}
                </div>
            </div>

            <CoverageBreakdownModal
                isOpen={isBreakdownModalOpen}
                onClose={() => setIsBreakdownModalOpen(false)}
                searchTerm={modalSearchTerm}
                onSearchChange={setModalSearchTerm}
                filteredItems={filteredModalItems}
                totalCount={totalCount}
                activeCount={activeCount}
                onSelectArea={onSelectArea}
            />
        </div>
    );
};
export default ServiceAreaCoverageView;
