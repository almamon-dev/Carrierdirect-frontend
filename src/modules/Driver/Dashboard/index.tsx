import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, RefreshCw } from 'lucide-react';
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
    const [dutyStatus, setDutyStatus] = useState<string>('online');
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
                const duty = (data as any)?.driverInfo?.dutyStatus || (data as any)?.driverInfo?.duty_status || (data as any)?.dutyStatus || (data as any)?.duty_status;
                if (duty) setDutyStatus(duty);
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
    const nonCancelledShipments = effectiveShipments.filter(s =>
        !['cancelled', 'canceled'].includes(s.status)
    );
    const activeShipmentsList = nonCancelledShipments.filter(s =>
        !['delivered', 'completed'].includes(s.status)
    );
    const effectiveActiveShipment = (activeShipment && !['cancelled', 'canceled'].includes(activeShipment.status))
        ? activeShipment
        : (activeShipmentsList.length > 0 ? activeShipmentsList[0] : (nonCancelledShipments.length > 0 ? nonCancelledShipments[0] : null));

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
                dutyStatus={dutyStatus}
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
            ) : !isVerified ? (
                /* LOCKED COMPLIANCE STATE: Disallow Dashboard Access until documents are verified */
                <div className="bg-white dark:bg-[#1a1f26] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 text-center shadow-xs max-w-4xl mx-auto my-6 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#FF4A1F] flex items-center justify-center mx-auto mb-4 border border-orange-200/60 dark:border-orange-900/40 shadow-xs">
                        {verificationStatus === 'expired' ? <ShieldAlert size={32} /> : <Lock size={30} />}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60">
                        {verificationStatus === 'expired' ? 'Documents Expired' : 'Verification Required'}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                        {verificationStatus === 'expired'
                            ? 'Compliance Documents Expired - Dashboard Access Restricted'
                            : 'Driver Verification Pending - Dashboard Access Locked'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6 leading-relaxed">
                        {verificationStatus === 'expired'
                            ? 'Your Commercial Driver\'s License (CDL) or DOT Medical Certificate has expired. In accordance with transport safety regulations, live dashboard metrics, active assignments, and load dispatches are locked until renewed documents are submitted and verified.'
                            : 'Your driver credentials and compliance documentation are currently pending approval. Full dashboard access, active shipment tracking, and route assignments will be automatically unlocked once approved by the carrier administrator.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/driver/profile')}
                            className="px-5 py-2.5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white rounded-xl text-sm font-bold shadow-sm transition-all duration-150 flex items-center gap-2 cursor-pointer hover:shadow-md"
                        >
                            <span>Go to Driver Profile & Upload Documents</span>
                            <ArrowRight size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRefreshStatus}
                            disabled={isCheckingStatus}
                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <RefreshCw size={14} className={isCheckingStatus ? 'animate-spin text-[#FF4A1F]' : ''} />
                            <span>{isCheckingStatus ? 'Checking Status...' : 'Check Status Again'}</span>
                        </button>
                    </div>
                </div>
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
