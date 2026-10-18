export type ServiceAreaCoverageType = 'Whole Country' | 'Selected Cities' | 'Regional Zone' | 'Postal Codes';

export interface ServiceAreaItem {
    id: string;
    country: string;
    countryCode?: string;
    flag: string;
    state?: string;
    city?: string;
    postal_code?: string;
    citiesRegions: string;
    coverageType: ServiceAreaCoverageType;
    isActive: boolean;
    routeCode?: string;
    distance?: string;
    ratePerKm?: string;
    assignedFleet?: string;
}

export type ServiceAreaTabKey = 'countries' | 'cities' | 'regions' | 'postal_codes';
