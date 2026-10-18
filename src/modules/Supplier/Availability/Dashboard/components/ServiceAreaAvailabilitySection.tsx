import Skeleton from '@/components/ui/skeleton';
import { useAvailabilityDashboardData } from '../hooks/useAvailabilityDashboardData';
import { CoverageMapData, ServiceAreaSummary } from '../types/coverage.types';
import { CoverageLeafletMap } from './CoverageLeafletMap';
import { UpcomingAvailabilityCard } from './UpcomingAvailabilityCard';

interface ServiceAreaAvailabilitySectionProps {
    serviceAreas?: ServiceAreaSummary[];
    coverageMap?: CoverageMapData | null;
    isLoading?: boolean;
    totalRegionsCount?: number;
    className?: string;
    defaultCenter?: [number, number];
    defaultZoom?: number;
}

export function ServiceAreaAvailabilitySection(props: ServiceAreaAvailabilitySectionProps) {
    // If not passed explicitly from parent, fetch data through useAvailabilityDashboardData
    const hasPropsData = props.serviceAreas !== undefined;
    const hookData = useAvailabilityDashboardData();

    const serviceAreas = hasPropsData ? (props.serviceAreas || []) : hookData.serviceAreas;
    const coverageMap = hasPropsData ? props.coverageMap : hookData.coverageMap;
    const isLoading = props.isLoading !== undefined ? props.isLoading : hookData.isLoading;

    const activeCount = serviceAreas.filter((a) => a.active).length;
    const regionsCount = props.totalRegionsCount ?? (serviceAreas.length > 0 ? activeCount : 0);

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch ${props.className || ''}`}>
            {/* Left (approx 2/3): Service Area Coverage Map */}
            <div className="lg:col-span-8 bg-white dark:bg-[#18202a] border border-slate-200/80 dark:border-slate-800 rounded-md p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Service Area Coverage
                    </h3>
                    {isLoading ? (
                        <Skeleton className="h-4 w-40 rounded-[4px]" />
                    ) : (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {regionsCount} Active Operational {regionsCount === 1 ? 'Region' : 'Regions'}
                        </span>
                    )}
                </div>

                <div className="w-full flex-1 min-h-[360px] sm:min-h-[380px] rounded-[4px] overflow-hidden">
                    <CoverageLeafletMap
                        serviceAreas={serviceAreas}
                        coverageMap={coverageMap}
                        totalNodesCount={regionsCount}
                        isLoading={isLoading}
                        height="h-full min-h-[360px] sm:min-h-[380px]"
                        defaultCenter={props.defaultCenter}
                        defaultZoom={props.defaultZoom}
                    />
                </div>
            </div>

            {/* Right (approx 1/3): Upcoming Availability */}
            <div className="lg:col-span-4 min-w-0 overflow-hidden">
                <UpcomingAvailabilityCard
                    serviceAreas={serviceAreas}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export default ServiceAreaAvailabilitySection;
