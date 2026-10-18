import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crosshair } from 'lucide-react';
import Skeleton from '@/components/ui/skeleton';
import { ServiceAreaSummary, CoverageMapData } from '../types/coverage.types';
import { getCoordinatesForArea } from '../utils/coverageCoordinates';

interface CoverageLeafletMapProps {
    serviceAreas?: ServiceAreaSummary[];
    coverageMap?: CoverageMapData | null;
    apiKey?: string | null;
    isLoading?: boolean;
    height?: string;
    totalNodesCount?: number;
    defaultCenter?: [number, number];
    defaultZoom?: number;
    autoFitBounds?: boolean;
    onHoverArea?: (areaId: string | number | null) => void;
    onSelectArea?: (area: ServiceAreaSummary) => void;
}

export function CoverageLeafletMap({
    serviceAreas = [],
    coverageMap,
    apiKey,
    isLoading = false,
    height = 'h-full min-h-[360px] sm:min-h-[380px]',
    totalNodesCount,
    defaultCenter,
    defaultZoom,
    autoFitBounds = false,
    onHoverArea,
    onSelectArea,
}: CoverageLeafletMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const targetCenterRef = useRef<L.LatLngTuple>([51.1657, 10.4515]);
    const targetZoomRef = useRef<number>(6);
    const [, setIsMapMounted] = useState(false);

    const activeAreasCount = totalNodesCount ?? serviceAreas.filter((a) => a.active).length;

    useEffect(() => {
        if (isLoading || !mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Collect all valid coordinates
        const validCoordsList: [number, number][] = [];
        serviceAreas.forEach((area) => {
            const coords = getCoordinatesForArea(area);
            if (coords && !isNaN(coords[0]) && !isNaN(coords[1])) {
                validCoordsList.push(coords);
            }
        });

        // Determine optimal center and zoom matching focused operational cluster (Image 2)
        let center: L.LatLngTuple = defaultCenter || [51.1657, 10.4515]; // Default Central Europe
        let zoom: number = defaultZoom ?? 6;

        if (coverageMap?.center && coverageMap.center.length === 2 && !isNaN(coverageMap.center[0]) && !isNaN(coverageMap.center[1])) {
            center = [coverageMap.center[0], coverageMap.center[1]];
            if (coverageMap.zoom) {
                zoom = coverageMap.zoom;
            }
        } else if (validCoordsList.length > 0) {
            if (validCoordsList.length === 1) {
                center = validCoordsList[0];
                zoom = defaultZoom ?? 10;
            } else {
                // Median coordinates identify the true hub/cluster center without being skewed by distant outliers
                const sortedLats = validCoordsList.map((c) => c[0]).sort((a, b) => a - b);
                const sortedLngs = validCoordsList.map((c) => c[1]).sort((a, b) => a - b);
                const medianLat = sortedLats[Math.floor(sortedLats.length / 2)];
                const medianLng = sortedLngs[Math.floor(sortedLngs.length / 2)];

                center = [medianLat, medianLng];
                zoom = defaultZoom ?? 6;
            }
        }

        targetCenterRef.current = center;
        targetZoomRef.current = zoom;

        const map = L.map(mapContainerRef.current, {
            center,
            zoom,
            minZoom: 2,
            maxZoom: 18,
            zoomControl: false,
            attributionControl: false,
            worldCopyJump: true,
        });

        // Map tile layer
        const effectiveKey = coverageMap?.google_maps_key || apiKey || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
        const tileUrl = effectiveKey
            ? `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${effectiveKey}`
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        const tileLayer = L.tileLayer(tileUrl, {
            maxZoom: 18,
            subdomains: effectiveKey ? ['0', '1', '2', '3'] : ['a', 'b', 'c'],
            attribution: effectiveKey ? '© Google' : '© OpenStreetMap contributors',
        }).addTo(map);

        tileLayer.on('load', () => {
            setIsMapMounted(true);
        });

        // Helper to construct custom teardrop map pin matching mockup
        const createPinIcon = (color: string) => {
            const haloColor = color === '#10b981' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(255, 74, 31, 0.22)';
            return L.divIcon({
                className: 'custom-carrier-pin',
                html: `
                    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; pointer-events: auto;">
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 38px;
                            height: 38px;
                            border-radius: 50%;
                            background-color: ${haloColor};
                            pointer-events: none;
                        "></div>
                        <div style="position: relative; z-index: 2; margin-top: 2px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25)); cursor: pointer;">
                            <svg width="22" height="26" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C5.37 0 0 5.37 0 12C0 20.25 12 28 12 28C12 28 24 20.25 24 12C24 5.37 18.63 0 12 0Z" fill="${color}" />
                                <circle cx="12" cy="11" r="4.2" fill="white" />
                            </svg>
                        </div>
                    </div>
                `,
                iconSize: [44, 44],
                iconAnchor: [22, 38],
                popupAnchor: [0, -32],
            });
        };

        const bounds = L.latLngBounds([]);
        let hasValidCoords = false;

        // Render dynamic service areas registered by the supplier
        serviceAreas.forEach((area, idx) => {
            const coords = getCoordinatesForArea(area);
            if (!coords || isNaN(coords[0]) || isNaN(coords[1])) return;

            hasValidCoords = true;
            bounds.extend(coords);

            const pinColor = area.active
                ? (idx % 2 === 0 ? '#ff4a1f' : '#10b981')
                : '#94a3b8';

            // Draw coverage radius circle
            const radiusKm = area.radius_km && area.radius_km > 0 ? area.radius_km : 25;
            L.circle(coords, {
                radius: radiusKm * 1000,
                color: area.active ? pinColor : '#94a3b8',
                fillColor: area.active ? pinColor : '#94a3b8',
                fillOpacity: 0.08,
                weight: 1.5,
                dashArray: '4, 4',
            }).addTo(map);

            const marker = L.marker(coords, {
                icon: createPinIcon(pinColor),
            }).addTo(map);

            const areaName = area.city
                ? `${area.city} Area`
                : (area.state ? `${area.state} Area` : (area.formatted || area.name));

            const ordersCount = area.orders_count ?? 0;
            const driversCount = area.drivers_count ?? 0;

            const popupContent = `
                <div style="font-family: inherit; font-size: 11.5px; border-radius: 4px; padding: 2px; min-width: 140px;">
                    <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px; font-size: 12px; line-height: 1.3;">
                        ${areaName}
                    </div>
                    <div style="color: #64748b; font-size: 11px; margin-bottom: 4px; font-weight: 500;">
                        ${ordersCount} active order${ordersCount === 1 ? '' : 's'} • ${driversCount} driver${driversCount === 1 ? '' : 's'} available
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; color: ${area.active ? '#059669' : '#d97706'};">
                        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${area.active ? '#10b981' : '#f59e0b'};"></span>
                        <span>${area.active ? 'Active Coverage' : 'Coverage Paused'}</span>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                className: 'custom-carrier-popup',
            });

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
        });

        // Fit map bounds dynamically only if autoFitBounds is explicitly requested
        if (autoFitBounds && hasValidCoords && bounds.isValid()) {
            if (serviceAreas.length === 1) {
                map.setView(bounds.getCenter(), 10);
            } else {
                map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
            }
        }

        mapInstanceRef.current = map;

        const timer = setTimeout(() => {
            map.invalidateSize();
            if (!autoFitBounds) {
                map.setView(center, zoom, { animate: false });
            }
            setIsMapMounted(true);
        }, 200);

        return () => {
            clearTimeout(timer);
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [serviceAreas, coverageMap, apiKey, isLoading, defaultCenter, defaultZoom, autoFitBounds, onHoverArea, onSelectArea]);

    // If loading, show dedicated clean skeleton instead of unrendered map
    if (isLoading) {
        return (
            <div className={`relative w-full ${height} rounded-[4px] overflow-hidden bg-slate-50 dark:bg-[#18202a] p-4 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800`}>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-48 rounded-[4px]" />
                </div>
                <div className="flex flex-col items-center justify-center gap-3 flex-1">
                    <div className="relative flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700/40 animate-ping opacity-25" />
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700/80 flex items-center justify-center text-slate-400">
                            <span className="w-3 h-3 rounded-full bg-[#ff4a1f] animate-pulse" />
                        </div>
                    </div>
                    <Skeleton className="h-3 w-36 rounded-[4px] mt-2" />
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-14 w-7 rounded-[4px]" />
                </div>
            </div>
        );
    }

    return (
        <div className={`relative w-full ${height} rounded-[4px] overflow-hidden bg-[#eaf4fb] dark:bg-[#10141a] select-none`}>
            {/* Custom Leaflet popup CSS for rounded-[4px] */}
            <style>{`
                .custom-carrier-popup .leaflet-popup-content-wrapper {
                    border-radius: 4px !important;
                    padding: 6px 8px !important;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.12) !important;
                    border: 1px solid rgba(226, 232, 240, 0.9) !important;
                }
                .custom-carrier-popup .leaflet-popup-tip {
                    box-shadow: 0 3px 8px rgba(0,0,0,0.08) !important;
                }
            `}</style>

            {/* Leaflet Map Target */}
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Top-Left Floating Badge: dynamic Active Operational Areas */}
            <div className="absolute top-3 left-3 z-[400] bg-white/95 dark:bg-[#18202a]/95 backdrop-blur-xs px-3 py-1.5 rounded-[4px] border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-2 pointer-events-none">
                <span className={`w-2 h-2 rounded-full ${activeAreasCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'} inline-block shadow-2xs`} />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
                    {activeAreasCount} Active Operational {activeAreasCount === 1 ? 'Area' : 'Areas'}
                </span>
            </div>

            {/* Bottom-Right Custom Zoom Controls (+, -, and reset to focused view) */}
            <div className="absolute bottom-4 right-4 z-[400] flex flex-col bg-white dark:bg-[#18202a] border border-slate-200/90 dark:border-slate-700 rounded-[4px] shadow-sm overflow-hidden">
                <button
                    type="button"
                    onClick={() => mapInstanceRef.current?.zoomIn()}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-200/90 dark:border-slate-700 text-sm font-bold transition-colors cursor-pointer"
                    title="Zoom in"
                >
                    +
                </button>
                <button
                    type="button"
                    onClick={() => mapInstanceRef.current?.zoomOut()}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-200/90 dark:border-slate-700 text-sm font-bold transition-colors cursor-pointer"
                    title="Zoom out"
                >
                    −
                </button>
                <button
                    type="button"
                    onClick={() => {
                        if (mapInstanceRef.current && targetCenterRef.current) {
                            mapInstanceRef.current.setView(targetCenterRef.current, targetZoomRef.current, { animate: true });
                        }
                    }}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
                    title="Reset to default focus view"
                >
                    <Crosshair size={13} className="text-slate-600 dark:text-slate-300" />
                </button>
            </div>
        </div>
    );
}

export default CoverageLeafletMap;
