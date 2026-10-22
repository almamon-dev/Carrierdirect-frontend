import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodayOverviewCards } from './components/TodayOverviewCards';
import { DriverDashboardSkeleton } from './components/DriverDashboardSkeleton';
import { DriverDashboardHeader } from './components/DriverDashboardHeader';
import { ActiveShipmentCard } from './components/ActiveShipmentCard';
import { TodayScheduleSection } from './components/TodayScheduleSection';
import { DriverVerificationBanner } from './components/DriverVerificationBanner';
import { AssignedVehicleSupportCard } from './components/AssignedVehicleSupportCard';
import { DriverDashboardModals } from './components/DriverDashboardModals';
import { requireDriverCompliance, useDriverCompliance } from '../Compliance';
import { driverApi } from '../services/driverApi';
import { TOKEN_CONFIG } from '@/config/auth';
import { initialDashboardMetrics } from './data/dashboardData';

function getAuthUser() {
    try {
        const raw =
            localStorage.getItem(TOKEN_CONFIG.userKey) ||
            localStorage.getItem('carrierdirect_user_data') ||
            localStorage.getItem('user');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export default function DriverDashboard() {
    const navigate = useNavigate();
    const { isVerified, verificationStatus, complianceData, reloadCompliance, setIsVerificationModalOpen } = useDriverCompliance();
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);

    const [metrics, setMetrics] = useState(initialDashboardMetrics);
    const [activeShipment, setActiveShipment] = useState<any>(null);
    const [scheduleList, setScheduleList] = useState<any[]>([]);
    const [driverInfo, setDriverInfo] = useState({ vehiclePlate: '231-D-45892', vehicleType: 'Volvo FH16 750 Globetrotter' });
    const [isLoading, setIsLoading] = useState(true);

    const [isBOLOpen, setIsBOLOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isGPSOpen, setIsGPSOpen] = useState(false);
    const [gpsDestination, setGpsDestination] = useState<string | undefined>(undefined);

    const loadDashboard = async () => {
        try {
            const data = await driverApi.getDashboardData();
            if (data) {
                if (data.metrics) setMetrics(data.metrics);
                setActiveShipment(data.activeShipment);
                setScheduleList(data.scheduleList || []);
                if (data.driverInfo) setDriverInfo(data.driverInfo);
            }
        } catch (err) {
            console.error('Failed to load driver dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleRefreshStatus = async () => {
        setIsCheckingStatus(true);
        try {
            await reloadCompliance();
            await loadDashboard();
        } finally {
            setTimeout(() => setIsCheckingStatus(false), 500);
        }
    };

    const handleOpenLiveGPS = (dest?: any) => {
        requireDriverCompliance(() => {
            const finalDest = typeof dest === 'string' && dest.trim() ? dest.trim() : (activeShipment?.destination?.address || 'Gazipur, Bangladesh');
            setGpsDestination(finalDest);
            setIsGPSOpen(true);
        }, 'Live GPS Navigation');
    };

    const handleOpenBOL = () => {
        requireDriverCompliance(() => {
            setIsBOLOpen(true);
        }, 'Digital Bill of Lading (BOL)');
    };

    const handleOpenReports = () => {
        requireDriverCompliance(() => {
            setIsReportsOpen(true);
        }, 'Performance & Route Reports');
    };

    const authUser = getAuthUser();
    const driverName = authUser?.name || 'Commercial Driver';

    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            <DriverDashboardHeader
                driverName={driverName}
                isVerified={isVerified}
                verificationStatus={verificationStatus}
                isRefreshing={isCheckingStatus}
                onRefresh={handleRefreshStatus}
            />

            <DriverVerificationBanner
                isVerified={isVerified}
                verificationStatus={verificationStatus}
                rejectionReason={complianceData?.rejectionReason}
                isCheckingStatus={isCheckingStatus}
                onRefreshStatus={handleRefreshStatus}
                onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
            />

            {isLoading ? (
                <DriverDashboardSkeleton />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                    <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
                        <TodayOverviewCards metrics={metrics} />
                        <ActiveShipmentCard
                            shipment={activeShipment}
                            onOpenBOL={handleOpenBOL}
                            onOpenGPS={() => handleOpenLiveGPS(activeShipment?.destination?.address)}
                        />
                    </div>

                    <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
                        <TodayScheduleSection scheduleList={scheduleList} />
                        <AssignedVehicleSupportCard
                            driverInfo={driverInfo}
                            onOpenSupport={() => setIsSupportOpen(true)}
                        />
                    </div>
                </div>
            )}

            <DriverDashboardModals
                isBOLOpen={isBOLOpen}
                setIsBOLOpen={setIsBOLOpen}
                activeShipment={activeShipment}
                isReportsOpen={isReportsOpen}
                setIsReportsOpen={setIsReportsOpen}
                driverRating={metrics?.driverRating?.rating}
                completedOrders={metrics?.tripsCompleted?.count}
                isSupportOpen={isSupportOpen}
                setIsSupportOpen={setIsSupportOpen}
                isGPSOpen={isGPSOpen}
                setIsGPSOpen={setIsGPSOpen}
                gpsDestination={gpsDestination}
            />
        </div>
    );
}
