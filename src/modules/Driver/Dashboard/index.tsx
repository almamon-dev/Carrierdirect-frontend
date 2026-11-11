import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TodayOverviewCards } from './components/TodayOverviewCards';
import { DriverDashboardSkeleton } from './components/DriverDashboardSkeleton';
import { DriverDashboardHeader } from './components/DriverDashboardHeader';
import { MyShipmentsSection } from './components/MyShipmentsSection';
import { DriverRouteMapCard } from './components/DriverRouteMapCard';
import { DriverVerificationBanner } from './components/DriverVerificationBanner';
import { AssignedVehicleSupportCard } from './components/AssignedVehicleSupportCard';
import { DriverDashboardModals } from './components/DriverDashboardModals';
import { requireDriverCompliance, useDriverCompliance } from '../Compliance';
import { driverApi, driverShipmentService } from '../services/driverApi';
import { TOKEN_CONFIG } from '@/config/auth';
import { initialDashboardMetrics } from './data/dashboardData';
import { ShipmentItem } from '../types';

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
    const [allShipments, setAllShipments] = useState<ShipmentItem[]>([]);
    const [driverInfo, setDriverInfo] = useState({ vehiclePlate: '231-D-45892', vehicleType: 'Volvo FH16 750 Globetrotter' });
    const [isLoading, setIsLoading] = useState(true);

    const [isBOLOpen, setIsBOLOpen] = useState(false);
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isGPSOpen, setIsGPSOpen] = useState(false);
    const [gpsDestination, setGpsDestination] = useState<string | undefined>(undefined);

    const loadDashboard = async () => {
        try {
            const [data, shipments] = await Promise.all([
                driverApi.getDashboardData(),
                driverShipmentService.getShipments(),
            ]);

            if (data) {
                if (data.metrics) setMetrics(data.metrics);
                if (data.activeShipment) setActiveShipment(data.activeShipment);
                if (data.driverInfo) setDriverInfo(data.driverInfo);
            }

            if (shipments && Array.isArray(shipments) && shipments.length > 0) {
                setAllShipments(shipments);
                if (!data?.activeShipment) {
                    const firstActive = shipments.find(s => !['delivered', 'completed', 'cancelled', 'canceled'].includes(s.status));
                    setActiveShipment(firstActive || null);
                }
            } else {
                setAllShipments([]);
                if (!data?.activeShipment) {
                    setActiveShipment(null);
                }
            }
        } catch (err) {
            console.error('Failed to load driver dashboard data:', err);
            setAllShipments([]);
            setActiveShipment(null);
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

    const effectiveShipments = allShipments;
    const activeShipmentsList = effectiveShipments.filter(s =>
        !['delivered', 'completed', 'cancelled', 'canceled'].includes(s.status)
    );
    const effectiveActiveShipment = (activeShipment && !['delivered', 'completed', 'cancelled', 'canceled'].includes(activeShipment.status))
        ? activeShipment
        : (activeShipmentsList.length > 0 ? activeShipmentsList[0] : null);

    const handleSelectShipment = (shipment: ShipmentItem) => {
        setActiveShipment(shipment);
    };

    const handleOpenLiveGPS = (dest?: any) => {
        const shipmentId = effectiveActiveShipment?.id || 'active';
        navigate(`/driver/navigation/${shipmentId}`);
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
    const driverName = authUser?.name || 'Billy Smith';

    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* Top Driver Header */}
            <DriverDashboardHeader
                driverName={driverName}
                isVerified={isVerified}
                verificationStatus={verificationStatus}
                isRefreshing={isCheckingStatus}
                onRefresh={handleRefreshStatus}
            />

            {/* Compliance Banner */}
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
                /* Main 2-Column Dashboard Grid matching Mockup */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                    {/* Left Column (Mockup Left: Today's Overview + My Shipments) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-3.5 sm:space-y-4">
                        <TodayOverviewCards metrics={metrics} />

                        <MyShipmentsSection
                            allShipments={effectiveShipments}
                            activeShipmentId={effectiveActiveShipment?.id}
                            onSelectShipment={handleSelectShipment}
                            onOpenGPS={handleOpenLiveGPS}
                        />
                    </div>

                    {/* Right Column (Mockup Right: Live Route Map + Assigned Vehicle & Equipment) */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-3.5 sm:space-y-4">
                        <DriverRouteMapCard
                            activeShipment={effectiveActiveShipment}
                            onOpenGPS={() => handleOpenLiveGPS(effectiveActiveShipment?.consignee?.address || effectiveActiveShipment?.delivery_address)}
                        />

                        <AssignedVehicleSupportCard
                            driverInfo={driverInfo}
                            onOpenSupport={() => setIsSupportOpen(true)}
                            onOpenReports={handleOpenReports}
                        />
                    </div>
                </div>
            )}

            {/* Modals: Live GPS, BOL, Reports, Support */}
            <DriverDashboardModals
                isBOLOpen={isBOLOpen}
                setIsBOLOpen={setIsBOLOpen}
                activeShipment={effectiveActiveShipment}
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
