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
    orders_count?: number;
    active_orders_count?: number;
    drivers_count?: number;
    available_drivers_count?: number;
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

export interface ServiceAreaCoverageViewProps {
    serviceAreas: ServiceAreaSummary[];
    coverageMap?: CoverageMapData | null;
    hoveredAreaId?: string | number | null;
    onHoverArea?: (areaId: string | number | null) => void;
    onSelectArea?: (area: ServiceAreaSummary) => void;
}
