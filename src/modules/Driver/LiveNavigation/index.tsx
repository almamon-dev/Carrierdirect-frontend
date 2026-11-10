import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Navigation,
    ExternalLink,
    AlertTriangle,
    RotateCcw,
    Volume2,
    VolumeX,
    CornerUpRight,
    ArrowUp,
    Flag,
    Crosshair,
    ShieldAlert,
} from 'lucide-react';
import { driverShipmentService } from '../services/driverApi';
import { extractCoordinatesFromAddress } from '@/utils/knownCoordinates';
import { geocodeAddressWithGooglePlaces } from '@/utils/googlePlacesGeocoding';
import { calculateAirDistanceKm } from '@/utils/geoDistance';
import { DriverGoogleMapView } from '../components/DriverGoogleMapView';
import { NavigationPageSkeleton } from '../components/NavigationPageSkeleton';
import { useDriverLiveLocation } from '../hooks/useDriverLiveLocation';
import { ShipmentItem } from '../types';



export default function DriverLiveNavigationPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [shipment, setShipment] = useState<ShipmentItem | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
    const [resolvedOrigin, setResolvedOrigin] = useState<[number, number] | null>(null);
    const [resolvedDest, setResolvedDest] = useState<[number, number] | null>(null);
    const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(true);
    const [autoCenter, setAutoCenter] = useState<boolean>(true);
    const [recenterTrigger, setRecenterTrigger] = useState<number>(0);
    // Simulation is OFF by default so real driver GPS is shown without phantom auto-movement
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [simulatedCoords, setSimulatedCoords] = useState<[number, number] | null>(null);
    const [simulatedSpeed, setSimulatedSpeed] = useState<number>(0);
    const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
    const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);
    const lastSpokenInstructionRef = useRef<string>('');
    const simProgressRef = useRef<number>(0.05);

    useEffect(() => {
        let isCancelled = false;

        const loadShipmentData = async () => {
            try {
                if (id && id !== 'active') {
                    const cleanId = String(id).replace(/^ORD-0*/i, '');
                    const fetched = await driverShipmentService.getShipmentById(cleanId);
                    if (fetched && !isCancelled) {
                        setShipment(fetched);
                        setIsInitialLoading(false);
                        return;
                    }
                }

                // If not found by direct ID, check active shipments list
                const allShipments = await driverShipmentService.getShipments();
                if (Array.isArray(allShipments) && allShipments.length > 0 && !isCancelled) {
                    const match = id
                        ? allShipments.find((s) => s.id === id || s.orderNumber?.includes(id)) || allShipments[0]
                        : allShipments[0];
                    setShipment(match);
                    setIsInitialLoading(false);
                    return;
                }
            } catch (err) {
                console.warn('Navigation page shipment load error:', err);
            }

            if (!isCancelled) {
                setShipment(null);
                setIsInitialLoading(false);
            }
        };

        loadShipmentData();

        return () => {
            isCancelled = true;
        };
    }, [id]);

    const activeShipment = shipment;

    // Origin & Destination City labels
    const originCity =
        activeShipment?.shipper?.city ||
        activeShipment?.pickup_city ||
        (activeShipment as any)?.origin?.name ||
        'Gazipur';

    const destCity =
        activeShipment?.consignee?.city ||
        activeShipment?.delivery_city ||
        (activeShipment as any)?.destination?.name ||
        'Dhaka';

    const pickupAddress =
        activeShipment?.shipper?.address ||
        activeShipment?.pickup_address ||
        `${originCity} Industrial Area`;

    const deliveryAddress =
        activeShipment?.consignee?.address ||
        activeShipment?.delivery_address ||
        `${destCity} Commercial Center`;

    // Dynamic Geocoding via Google Places API
    useEffect(() => {
        let isCancelled = false;

        geocodeAddressWithGooglePlaces(pickupAddress, originCity).then((coords) => {
            if (!isCancelled && coords) setResolvedOrigin(coords);
        });

        geocodeAddressWithGooglePlaces(deliveryAddress, destCity).then((coords) => {
            if (!isCancelled && coords) setResolvedDest(coords);
        });

        return () => {
            isCancelled = true;
        };
    }, [pickupAddress, deliveryAddress, originCity, destCity]);

    // Local synchronous fallback coordinates (inspects backend pickup_lat, delivery_lat & route coordinates)
    const fallbackOrigin = useMemo<[number, number]>(() => {
        const rawAny = activeShipment as any;
        if (rawAny?.pickup_lat && rawAny?.pickup_lng) {
            return [Number(rawAny.pickup_lat), Number(rawAny.pickup_lng)];
        }
        const rc = activeShipment?.route?.originCoords || rawAny?.route?.origin_coords;
        if (rc?.lat && rc?.lng && !isNaN(Number(rc.lat)) && Number(rc.lat) !== 0) {
            return [Number(rc.lat), Number(rc.lng)];
        }
        const fromAddr = extractCoordinatesFromAddress(pickupAddress) || extractCoordinatesFromAddress(originCity);
        if (fromAddr) return fromAddr;
        return [23.8981, 90.3972];
    }, [activeShipment, pickupAddress, originCity]);

    const fallbackDest = useMemo<[number, number]>(() => {
        const rawAny = activeShipment as any;
        if (rawAny?.delivery_lat && rawAny?.delivery_lng) {
            return [Number(rawAny.delivery_lat), Number(rawAny.delivery_lng)];
        }
        const rc = activeShipment?.route?.destinationCoords || rawAny?.route?.destination_coords;
        if (rc?.lat && rc?.lng && !isNaN(Number(rc.lat)) && Number(rc.lat) !== 0) {
            return [Number(rc.lat), Number(rc.lng)];
        }
        const fromAddr = extractCoordinatesFromAddress(deliveryAddress) || extractCoordinatesFromAddress(destCity);
        if (fromAddr) return fromAddr;
        return [23.7534, 90.3698];
    }, [activeShipment, deliveryAddress, destCity]);

    const originCoords: [number, number] = useMemo(() => {
        return resolvedOrigin || fallbackOrigin;
    }, [resolvedOrigin, fallbackOrigin]);

    const destCoords: [number, number] = useMemo(() => {
        return resolvedDest || fallbackDest;
    }, [resolvedDest, fallbackDest]);

    // Active Corridor waypoint fallback
    const corridorFallback = useMemo<[number, number]>(() => {
        return [
            originCoords[0] + (destCoords[0] - originCoords[0]) * 0.42,
            originCoords[1] + (destCoords[1] - originCoords[1]) * 0.42,
        ];
    }, [originCoords, destCoords]);

    // Live Driver Location tracking (Browser GPS + Backend API last known)
    const {
        driverCoords,
        isRealLocationFix,
        locateMe,
        isLocating,
        isLiveGPS,
        locationError,
        permissionState,
        speedKmh,
    } = useDriverLiveLocation({
        activeOrderId: activeShipment?.id || activeShipment?.orderNumber,
        fallbackCoords: corridorFallback,
        enableWatch: true,
    });

    // Stable route points listener (prevents re-render feedback loop)
    const handleRoutesLoaded = useCallback((loadedRoutes: any[]) => {
        if (loadedRoutes && loadedRoutes.length > 0) {
            setAvailableRoutes(loadedRoutes);
            const activeR = loadedRoutes[selectedRouteIndex] || loadedRoutes[0];
            if (activeR?.points?.length > 1) {
                const newPoints = activeR.points;
                setRoutePoints((prev) => {
                    if (prev.length === newPoints.length) return prev;
                    return newPoints;
                });
            }
        }
    }, [selectedRouteIndex]);

    // Simulated drive progress along real road route polylines
    useEffect(() => {
        if (!isSimulating) {
            setSimulatedSpeed(0);
            return;
        }

        setSimulatedSpeed(52);
        const interval = setInterval(() => {
            simProgressRef.current += 0.008;
            if (simProgressRef.current > 0.98) {
                simProgressRef.current = 0.05;
            }

            if (routePoints && routePoints.length > 2) {
                const total = routePoints.length;
                const floatIndex = simProgressRef.current * (total - 1);
                const i1 = Math.floor(floatIndex);
                const i2 = Math.min(i1 + 1, total - 1);
                const fraction = floatIndex - i1;
                const p1 = routePoints[i1];
                const p2 = routePoints[i2];
                const lat = p1[0] + (p2[0] - p1[0]) * fraction;
                const lng = p1[1] + (p2[1] - p1[1]) * fraction;
                setSimulatedCoords([lat, lng]);
            } else {
                const t = simProgressRef.current;
                const lat = originCoords[0] + (destCoords[0] - originCoords[0]) * t;
                const lng = originCoords[1] + (destCoords[1] - originCoords[1]) * t;
                setSimulatedCoords([lat, lng]);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isSimulating, routePoints, originCoords, destCoords]);

    const effectiveDriverCoords = (isSimulating && simulatedCoords) ? simulatedCoords : driverCoords;
    const effectiveSpeedKmh = isSimulating ? simulatedSpeed : speedKmh;

    // Dynamic distance and ETA calculation
    const remainingKm = useMemo(() => {
        if (effectiveDriverCoords && destCoords) {
            const air = calculateAirDistanceKm(effectiveDriverCoords[0], effectiveDriverCoords[1], destCoords[0], destCoords[1]);
            if (air) return Number((air * 1.25).toFixed(1));
        }
        const totalAir = calculateAirDistanceKm(originCoords[0], originCoords[1], destCoords[0], destCoords[1]);
        return totalAir ? Number((totalAir * 1.25).toFixed(1)) : 24.8;
    }, [effectiveDriverCoords, originCoords, destCoords]);

    const estimatedRemainingMins = useMemo(() => {
        // Average commercial driving speed in mixed city traffic (~36 km/h)
        const mins = Math.max(5, Math.round((remainingKm / 36) * 60));
        return mins;
    }, [remainingKm]);

    const etaClockString = useMemo(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + estimatedRemainingMins);
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, [estimatedRemainingMins]);

    // Simulated Next Maneuver for Turn-by-turn HUD matching mobile app
    const currentManeuver = useMemo(() => {
        if (remainingKm <= 1.2) {
            return {
                distance: 'In 300 m',
                instruction: `Arrive at destination: ${destCity}`,
                road: deliveryAddress,
                type: 'arrive',
            };
        }
        return {
            distance: 'In 450 m',
            instruction: 'Continue towards highway corridor',
            road: `${originCity} - ${destCity} Main Route`,
            type: 'straight',
        };
    }, [remainingKm, originCity, destCity, deliveryAddress]);

    // Optional Voice Directions using Web Speech API
    const speakInstruction = useCallback(
        (text: string) => {
            if (isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
            if (lastSpokenInstructionRef.current === text) return;
            lastSpokenInstructionRef.current = text;
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                window.speechSynthesis.speak(utterance);
            } catch (_) {}
        },
        [isVoiceMuted]
    );

    useEffect(() => {
        if (!isVoiceMuted && currentManeuver) {
            speakInstruction(`${currentManeuver.distance}, ${currentManeuver.instruction}`);
        }
    }, [currentManeuver, isVoiceMuted, speakInstruction]);

    // Direct Google Maps URL for Mobile / Turn-by-turn Navigation in new window
    const googleMapsDirectUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoords[0]},${originCoords[1]}&destination=${destCoords[0]},${destCoords[1]}&travelmode=driving`;

    const handleCloseOrBack = () => {
        if (window.opener && window.history.length <= 1) {
            window.close();
        } else {
            navigate('/driver/dashboard');
        }
    };

    if (isInitialLoading) {
        return <NavigationPageSkeleton />;
    }

    if (!shipment) {
        return (
            <div className="fixed inset-0 w-screen h-screen z-50 bg-[#0F172A] flex flex-col items-center justify-center font-sans p-6 text-center">
                <div className="w-16 h-16 rounded-[5px] bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-sm">
                    <ShieldAlert size={32} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Shipment Not Found</h2>
                <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                    {id ? `The requested shipment #${id} could not be retrieved from the backend API or is not assigned to your driver account.` : 'No active shipment currently assigned for navigation.'}
                </p>
                <button
                    type="button"
                    onClick={handleCloseOrBack}
                    className="px-5 py-2.5 rounded-[5px] bg-[#FF5722] hover:bg-[#E03E15] active:scale-95 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-screen h-screen z-50 bg-slate-950 flex flex-col font-sans select-none overflow-hidden">
            {/* 1. Sleek Top Header */}
            <header className="h-12 bg-[#161B22] border-b border-slate-800 text-white flex items-center justify-between px-3 sm:px-4 shrink-0 z-30 shadow-xs">
                {/* Left: Back button & Order Info */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button
                        type="button"
                        onClick={handleCloseOrBack}
                        className="px-2.5 py-1 rounded-[5px] bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-700/80"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={13} />
                        <span>Back</span>
                    </button>

                    <div className="h-4 w-px bg-slate-800 shrink-0 hidden sm:block" />

                    <div className="flex items-center gap-2 min-w-0">
                        <span className="font-extrabold text-xs sm:text-[13px] text-white tracking-tight truncate">
                            {activeShipment?.orderNumber || (id ? `#ORD-${id}` : '#ORD-LIVE')}
                        </span>

                        {/* Live GPS Active Status Badge */}
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-[4px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {isRealLocationFix ? 'REAL GPS ACTIVE' : 'LIVE GPS ACTIVE'}
                        </span>

                        <span className="text-[11px] text-slate-400 hidden md:flex items-center gap-1 truncate">
                            <span>•</span>
                            <span className="text-slate-300 font-semibold">{originCity} ➔ {destCity}</span>
                        </span>
                    </div>
                </div>

                {/* Right: Simulation toggle + External Google Maps App Button */}
                <div className="flex items-center shrink-0 gap-2">
                    <button
                        type="button"
                        onClick={() => setIsSimulating((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-[5px] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isSimulating
                                ? 'bg-emerald-600 border-emerald-500 text-white shadow-xs'
                                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
                        }`}
                        title={isSimulating ? 'Stop live drive simulation' : 'Start live driving simulation (Demo GPS)'}
                    >
                        <span>{isSimulating ? '⏹ Stop Drive' : '▶ Simulate Drive'}</span>
                    </button>

                    <a
                        href={googleMapsDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 sm:px-3 py-1 rounded-[5px] bg-[#FF5722] hover:bg-[#E03E15] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        title="Open in Google Maps Application"
                    >
                        <Navigation size={12} />
                        <span className="hidden sm:inline">Google Maps App</span>
                        <ExternalLink size={11} className="opacity-80" />
                    </a>
                </div>
            </header>

            {/* 2. Main Full-Screen Map Container */}
            <main className="flex-1 w-full h-[calc(100vh-48px)] relative bg-slate-950 overflow-hidden">
                <DriverGoogleMapView
                    originCoords={originCoords}
                    destCoords={destCoords}
                    driverCoords={effectiveDriverCoords}
                    originTitle={originCity}
                    originAddress={pickupAddress}
                    destTitle={destCity}
                    destAddress={deliveryAddress}
                    selectedRouteIndex={selectedRouteIndex}
                    onRouteChange={(idx) => {
                        setSelectedRouteIndex(idx);
                        if (availableRoutes && availableRoutes[idx]?.points) {
                            const newR = availableRoutes[idx];
                            setRoutePoints(newR.points);
                            speakInstruction(`Switched to ${newR.label || 'alternative route'}. ${newR.duration}, ${newR.distance}.`);
                        }
                    }}
                    showFloatingCard={false}
                    showRouteSummaryCards={false}
                    showStartNavigationButton={false}
                    onLocateMe={locateMe}
                    isLocating={isLocating}
                    autoCenterDriver={autoCenter}
                    recenterTrigger={recenterTrigger}
                    onRoutesLoaded={handleRoutesLoaded}
                    height="100%"
                    className="w-full h-full"
                />

                {/* 3. Top Turn-by-Turn Instruction Banner (Green Navigation HUD - Mobile App Style) */}
                <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-auto sm:max-w-md z-30 pointer-events-auto">
                    <div className="bg-[#15803D] text-white p-3 rounded-[5px] shadow-lg border border-emerald-500/40 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[5px] bg-emerald-900/80 border border-emerald-400/40 flex items-center justify-center shrink-0 text-white shadow-xs">
                            {currentManeuver.type === 'arrive' ? (
                                <Flag size={20} className="text-amber-300" />
                            ) : currentManeuver.type === 'turnRight' ? (
                                <CornerUpRight size={22} className="text-white" />
                            ) : (
                                <ArrowUp size={22} className="text-white" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-[12px] font-black text-emerald-200 tracking-wide uppercase">
                                {currentManeuver.distance}
                            </div>
                            <div className="text-sm font-extrabold text-white truncate leading-snug">
                                {currentManeuver.instruction}
                            </div>
                            <div className="text-[10.5px] text-emerald-100/80 truncate mt-0.5">
                                {currentManeuver.road}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Speedometer HUD (Floating Left) */}
                <div className="absolute bottom-24 left-3 sm:left-4 z-30 pointer-events-auto">
                    <div className="bg-[#161B22]/95 backdrop-blur-xs border border-slate-800 rounded-[5px] p-2 px-3 shadow-lg flex flex-col items-center min-w-[68px]">
                        <span className="text-[9px] font-black text-slate-400 tracking-wider">SPEED</span>
                        <span className="text-xl font-black text-white leading-tight">
                            {effectiveSpeedKmh || 0}
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-400">km/h</span>
                    </div>
                </div>

                {/* 6. Bottom Navigation Floating HUD (Duration, Remaining Distance, ETA & Controls) */}
                <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 max-w-2xl mx-auto z-30 pointer-events-auto">
                    <div className="bg-[#161B22]/95 backdrop-blur-md border border-slate-800 text-white p-3 sm:p-3.5 rounded-[5px] shadow-2xl flex items-center justify-between gap-3">
                        {/* Left: ETA & Distance stats */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                            <div>
                                <div className="text-xl sm:text-2xl font-black text-[#FF5722] tracking-tight leading-none">
                                    {estimatedRemainingMins} min
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mt-1">
                                    <span>{remainingKm} km remaining</span>
                                    <span>•</span>
                                    <span className="text-emerald-400">ETA {etaClockString}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Quick Action Buttons (Voice Audio, Recenter, Exit) */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Voice Navigation Toggle */}
                            <button
                                type="button"
                                onClick={() => setIsVoiceMuted((prev) => !prev)}
                                title={isVoiceMuted ? 'Unmute voice navigation' : 'Mute voice navigation'}
                                className={`p-2 rounded-[5px] border transition-colors cursor-pointer ${
                                    isVoiceMuted
                                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                        : 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300'
                                }`}
                            >
                                {isVoiceMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>

                            {/* Recenter / Auto-Track Toggle */}
                            <button
                                type="button"
                                onClick={() => {
                                    setAutoCenter(true);
                                    setRecenterTrigger((prev) => prev + 1);
                                    locateMe();
                                }}
                                title="Center camera on vehicle"
                                className={`px-2.5 py-1.5 rounded-[5px] border transition-colors cursor-pointer flex items-center gap-1.5 ${
                                    autoCenter
                                        ? 'bg-blue-600/30 border-blue-500/60 text-blue-300'
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                                }`}
                            >
                                <Crosshair size={15} />
                                <span className="text-xs font-bold hidden sm:inline">My Location</span>
                            </button>

                            {/* Exit Navigation */}
                            <button
                                type="button"
                                onClick={handleCloseOrBack}
                                className="px-3 py-2 rounded-[5px] bg-red-600/90 hover:bg-red-600 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                            >
                                <span>Exit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
