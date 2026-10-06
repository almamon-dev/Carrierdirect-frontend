import apiClient from '@/lib/axios';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    PieChart as PieChartIcon,
    Map as MapIcon,
    Globe2,
    CheckCircle2,
    MapPin,
    Sparkles,
    Search,
    ExternalLink,
    X,
    Plus,
} from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { getCountryFlag } from '@/constants/countries';
import { useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
} from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface ServiceAreaSummary {
    id: number | string;
    name: string;
    country?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    flag?: string;
    formatted: string;
    type: string;
    active: boolean;
    latitude?: number;
    longitude?: number;
    radius_km?: number;
    percentage?: number;
    color?: string;
    coordinates?: [number, number];
}

export interface CoverageMapData {
    center?: [number, number];
    google_maps_key?: string;
    zoom?: number;
    total_areas?: number;
    active_areas?: number;
    overall_percentage?: number;
    markers?: ServiceAreaSummary[];
    breakdown?: Array<{
        id: string | number;
        name: string;
        short_name: string;
        value: number;
        color: string;
        active: boolean;
    }>;
}

interface ServiceAreaCoverageViewProps {
    serviceAreas: ServiceAreaSummary[];
    coverageMap?: CoverageMapData | null;
    hoveredAreaId?: string | number | null;
    onHoverArea?: (areaId: string | number | null) => void;
    onSelectArea?: (area: ServiceAreaSummary) => void;
}


let cachedGoogleKey: string | null = null;
const fetchGoogleMapsApiKey = async (): Promise<string | null> => {
    if (cachedGoogleKey) return cachedGoogleKey;
    try {
        const res = await apiClient.get('/maps-config', { silent: true });
        const key = res?.google_maps_key || res?.data?.google_maps_key;
        if (key) {
            cachedGoogleKey = key;
            return key;
        }
    } catch {
        // fallback
    }
    return null;
};

// Chart color palette
const CHART_COLORS = [
    '#ff4a1f', // Primary Orange
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#f59e0b', // Amber
    '#ec4899', // Pink
];

// Coordinate lookup for cities and countries
const COORDINATES: Record<string, [number, number]> = {
    // Bangladesh
    dhaka: [23.8103, 90.4125],
    chittagong: [22.3569, 91.7832],
    sylhet: [24.8949, 91.8687],
    bangladesh: [23.685, 90.3563],
    // United Kingdom
    london: [51.5074, -0.1278],
    manchester: [53.4808, -2.2426],
    birmingham: [52.4862, -1.8904],
    'united kingdom': [55.3781, -3.436],
    uk: [55.3781, -3.436],
    // Ireland
    dublin: [53.3498, -6.2603],
    cork: [51.8985, -8.4756],
    ireland: [53.1424, -7.6921],
    // France
    paris: [48.8566, 2.3522],
    lyon: [45.764, 4.8357],
    france: [46.2276, 2.2137],
    // Germany
    berlin: [52.52, 13.405],
    munich: [48.1351, 11.582],
    germany: [51.1657, 10.4515],
    // United States
    'new york': [40.7128, -74.006],
    chicago: [41.8781, -87.6298],
    'united states': [37.0902, -95.7129],
    usa: [37.0902, -95.7129],
};

const getCoordinatesForArea = (area: ServiceAreaSummary): [number, number] => {
    // 1. Direct coordinates from backend
    if (area.latitude !== undefined && area.longitude !== undefined && !isNaN(Number(area.latitude)) && !isNaN(Number(area.longitude))) {
        return [Number(area.latitude), Number(area.longitude)];
    }
    if (Array.isArray(area.coordinates) && area.coordinates.length === 2 && !isNaN(Number(area.coordinates[0])) && !isNaN(Number(area.coordinates[1]))) {
        return [Number(area.coordinates[0]), Number(area.coordinates[1])];
    }

    const cityKey = (area.city || '').toLowerCase().trim();
    if (cityKey && COORDINATES[cityKey]) return COORDINATES[cityKey];

    const countryKey = (area.country || area.name || '').toLowerCase().trim();
    if (countryKey && COORDINATES[countryKey]) return COORDINATES[countryKey];

    for (const [key, coords] of Object.entries(COORDINATES)) {
        if (area.formatted.toLowerCase().includes(key)) {
            return coords;
        }
    }

    return [23.8103, 90.4125]; // Default to Dhaka, Bangladesh
};

export const ServiceAreaCoverageView: React.FC<ServiceAreaCoverageViewProps> = ({
    serviceAreas,
    coverageMap,
    hoveredAreaId,
    onHoverArea,
    onSelectArea,
}) => {
    const navigate = useNavigate();
    const [viewType, setViewType] = useState<'graph' | 'map'>('graph');
    const [apiKey, setApiKey] = useState<string | null>(coverageMap?.google_maps_key || cachedGoogleKey);
    const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (coverageMap?.google_maps_key) {
            setApiKey(coverageMap.google_maps_key);
            cachedGoogleKey = coverageMap.google_maps_key;
        } else if (!apiKey) {
            fetchGoogleMapsApiKey().then((k) => {
                if (k) setApiKey(k);
            });
        }
    }, [coverageMap?.google_maps_key]);

    // Calculate chart data slices from backend breakdown or areas
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

    // Show first 4 tags in bottom bar, rest in +More modal
    const visibleTags = useMemo(() => chartData.slice(0, 4), [chartData]);
    const remainingCount = Math.max(0, chartData.length - visibleTags.length);

    // Filtered items for modal search
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

    // Active counts
    const totalCount = serviceAreas.length;
    const activeCount = serviceAreas.filter((a) => a.active).length;
    const overallPercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 100;

    // Initialize or update Leaflet map when map view is active
    useEffect(() => {
        if (viewType !== 'map' || !mapContainerRef.current) return;

        // Cleanup existing map instance if any
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const centerCoords: L.LatLngTuple = coverageMap?.center && coverageMap.center.length === 2
            ? [coverageMap.center[0], coverageMap.center[1]]
            : (serviceAreas.length > 0 ? getCoordinatesForArea(serviceAreas[0]) : [23.8103, 90.4125]);

        const zoomLevel = coverageMap?.zoom ?? (serviceAreas.length > 1 ? 7 : 11);

        // Create Leaflet Map instance
        const map = L.map(mapContainerRef.current, {
            center: centerCoords,
            zoom: zoomLevel,
            zoomControl: false,
            attributionControl: false,
        });

        // Tile layer powered by backend Google Maps key (or clean OpenStreetMap fallback)
        const effectiveKey = coverageMap?.google_maps_key || apiKey || cachedGoogleKey;
        const tileUrl = effectiveKey
            ? `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${effectiveKey}`
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        L.tileLayer(tileUrl, {
            maxZoom: 20,
            subdomains: effectiveKey ? ['0', '1', '2', '3'] : ['a', 'b', 'c'],
            attribution: effectiveKey ? '© Google' : '© OpenStreetMap contributors',
        }).addTo(map);

        // Add zoom control at bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markers: L.Marker[] = [];
        const latLngs: L.LatLngExpression[] = [];

        serviceAreas.forEach((area) => {
            const coords = getCoordinatesForArea(area);
            latLngs.push(coords);

            // Add coverage radius circle from backend radius_km
            if (area.radius_km && area.radius_km > 0) {
                L.circle(coords, {
                    radius: area.radius_km * 1000,
                    color: area.active ? '#ff4a1f' : '#94a3b8',
                    fillColor: area.active ? '#ff4a1f' : '#94a3b8',
                    fillOpacity: 0.08,
                    weight: 1.5,
                    dashArray: '4, 4',
                }).addTo(map);
            }

            // Custom pulsing radar marker HTML
            const customIcon = L.divIcon({
                className: 'custom-carrier-marker',
                html: `
                    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                        <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: rgba(255, 74, 31, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                        <div style="position: absolute; width: 14px; height: 14px; border-radius: 50%; background-color: #ff4a1f; border: 2.5px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.25);"></div>
                    </div>
                `,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
            });

            const marker = L.marker(coords, { icon: customIcon }).addTo(map);

            // Clean custom popup
            const popupContent = `
                <div style="font-family: inherit; font-size: 11.5px; padding: 2px;">
                    <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px;">
                        ${area.formatted}
                    </div>
                    <div style="color: #64748b; font-size: 10px; display: flex; align-items: center; gap: 4px;">
                        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: #10b981;"></span>
                        <span>${area.type} • Active Coverage</span>
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);

            marker.on('mouseover', () => {
                marker.openPopup();
                if (onHoverArea) onHoverArea(area.id);
            });
            marker.on('mouseout', () => {
                if (onHoverArea) onHoverArea(null);
            });
            marker.on('click', () => {
                if (onSelectArea) onSelectArea(area);
            });

            markers.push(marker);
        });

        // Fit bounds if multiple locations exist
        if (latLngs.length > 1) {
            map.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30] });
        }

        mapInstanceRef.current = map;

        // Invalidate size after layout settles
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 150);

        return () => {
            clearTimeout(timer);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [viewType, serviceAreas, coverageMap, apiKey, onHoverArea, onSelectArea]);

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

                {/* Switcher Toggle Buttons */}
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
                /* GRAPH VIEW: Recharts Donut / Coverage Breakdown */
                <div className="relative w-full h-[220px] rounded-[4px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#12161c] p-2 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <RechartsTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-slate-900/95 text-white px-2.5 py-1.5 rounded-[4px] shadow-lg border border-slate-700 text-xs font-sans">
                                                <div className="font-bold flex items-center gap-1.5">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: data.color }}
                                                    />
                                                    <span>{data.name}</span>
                                                </div>
                                                <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                                                    <span>Coverage:</span>
                                                    <span className="text-[#ff4a1f] font-bold font-mono">
                                                        {data.value}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={82}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="transparent"
                                onMouseEnter={(entry: any) => {
                                    if (onHoverArea && entry?.id) onHoverArea(entry.id);
                                }}
                                onMouseLeave={() => {
                                    if (onHoverArea) onHoverArea(null);
                                }}
                            >
                                {chartData.map((entry) => {
                                    const isHovered = String(entry.id) === String(hoveredAreaId);
                                    return (
                                        <Cell
                                            key={entry.id}
                                            fill={entry.color}
                                            opacity={isHovered ? 1 : 0.9}
                                            style={{
                                                filter: isHovered
                                                    ? 'drop-shadow(0 0 6px rgba(255, 74, 31, 0.6))'
                                                    : undefined,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                            }}
                                        />
                                    );
                                })}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Metric in Donut Hole */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-extrabold text-[#ff4a1f] tracking-tight">
                            {overallPercentage}%
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                            Coverage
                        </span>
                    </div>
                </div>
            ) : (
                /* MAP VIEW: Real Interactive Leaflet Tile Map */
                <div
                    ref={mapContainerRef}
                    className="relative w-full h-[220px] rounded-[4px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xs z-0"
                />
            )}

            {/* Bottom Legend Tags (Max 4 inline + More button) */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                {visibleTags.map((item) => {
                    const isHovered = String(item.id) === String(hoveredAreaId);
                    return (
                        <div
                            key={item.id}
                            onMouseEnter={() => {
                                if (onHoverArea) onHoverArea(item.id);
                            }}
                            onMouseLeave={() => {
                                if (onHoverArea) onHoverArea(null);
                            }}
                            onClick={() => {
                                if (item.area && onSelectArea) onSelectArea(item.area);
                            }}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-xs cursor-pointer transition-all ${
                                isHovered
                                    ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] font-bold ring-1 ring-[#ff4a1f]/40'
                                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                            title={item.name}
                        >
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="truncate max-w-[110px] sm:max-w-[130px] font-medium">
                                {item.shortName}
                            </span>
                            <span className="font-mono text-[10.5px] font-bold text-[#ff4a1f]">
                                {item.value}%
                            </span>
                        </div>
                    );
                })}

                {/* + More Button */}
                {remainingCount > 0 && (
                    <button
                        type="button"
                        onClick={() => setIsBreakdownModalOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-xs font-bold text-[#ff4a1f] bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 border border-orange-200/80 dark:border-orange-800/80 transition-all cursor-pointer shadow-2xs group"
                        title={`View all ${chartData.length} operating coverage zones`}
                    >
                        <Plus size={11} className="group-hover:rotate-90 transition-transform duration-200" />
                        <span>+{remainingCount} More</span>
                    </button>
                )}
            </div>

            {/* Modal: All Coverage Areas Breakdown with Scrollable List */}
            <Modal
                isOpen={isBreakdownModalOpen}
                onClose={() => {
                    setIsBreakdownModalOpen(false);
                    setModalSearchTerm('');
                }}
                title="All Operating Coverage Areas"
                description={`${chartData.length} active service regions configured with live coverage allocation`}
                size="lg"
                footer={
                    <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-slate-400 font-medium">
                            {filteredModalItems.length} of {chartData.length} regions shown
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsBreakdownModalOpen(false);
                                    setModalSearchTerm('');
                                }}
                                className="text-xs h-8 px-3 rounded-[4px] cursor-pointer"
                            >
                                Close
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setIsBreakdownModalOpen(false);
                                    navigate('/supplier/availability/routes');
                                }}
                                className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold h-8 px-3.5 rounded-[4px] gap-1.5 cursor-pointer"
                            >
                                <span>Manage Service Areas</span>
                                <ExternalLink size={12} />
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-3 font-sans">
                    {/* Search & Quick Filter Bar */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={modalSearchTerm}
                            onChange={(e) => setModalSearchTerm(e.target.value)}
                            placeholder="Search service area, city or country..."
                            className="w-full pl-9 pr-8 py-2 text-xs rounded-[4px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#ff4a1f] focus:border-[#ff4a1f] transition-all"
                        />
                        {modalSearchTerm && (
                            <button
                                type="button"
                                onClick={() => setModalSearchTerm('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Scrollable Service Areas List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 pr-1 rounded-[4px] border border-slate-100 dark:border-slate-800/60">
                        {filteredModalItems.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5">
                                <Globe2 size={24} className="text-slate-300 dark:text-slate-600" />
                                <span>No service areas matching &quot;{modalSearchTerm}&quot;</span>
                            </div>
                        ) : (
                            filteredModalItems.map((item) => {
                                const area = item.area;
                                const isHovered = String(item.id) === String(hoveredAreaId);
                                const flag = area?.flag && area.flag !== '🌐' ? area.flag : (area ? getCountryFlag(area.country || area.name) : '🌐');

                                return (
                                    <div
                                        key={item.id}
                                        onMouseEnter={() => {
                                            if (onHoverArea) onHoverArea(item.id);
                                        }}
                                        onMouseLeave={() => {
                                            if (onHoverArea) onHoverArea(null);
                                        }}
                                        onClick={() => {
                                            if (area && onSelectArea) onSelectArea(area);
                                            setIsBreakdownModalOpen(false);
                                            navigate('/supplier/availability/routes');
                                        }}
                                        className={`p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-colors cursor-pointer group ${
                                            isHovered
                                                ? 'bg-orange-50/80 dark:bg-orange-950/30'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        {/* Left: Flag & Location Details */}
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <span className="text-xl shrink-0 select-none" role="img" aria-label={area?.country || area?.name}>
                                                {flag}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold transition-colors truncate ${
                                                        isHovered ? 'text-[#ff4a1f]' : 'text-slate-800 dark:text-slate-200 group-hover:text-[#ff4a1f]'
                                                    }`}>
                                                        {item.name}
                                                    </span>
                                                    {area?.type && (
                                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                                                            {area.type}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                                                    {area?.radius_km && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={10} className="text-slate-400 shrink-0" />
                                                            <span>{area.radius_km} km radius</span>
                                                        </span>
                                                    )}
                                                    {area?.postal_code && (
                                                        <span>• Postal: {area.postal_code}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Allocation Share & Status */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            {/* Share Percentage with Mini Progress Bar */}
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <span
                                                        className="w-2 h-2 rounded-full shrink-0"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                                                        {item.value}%
                                                    </span>
                                                </div>
                                                <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-300"
                                                        style={{ width: `${Math.min(100, Math.max(5, item.value))}%`, backgroundColor: item.color }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-[3px] font-semibold shrink-0 ${
                                                    area?.active ?? true
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                {area?.active ?? true ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};
