import { useState, useEffect, useRef, useCallback } from 'react';
import { driverLocationService } from '../services/driverLocationService';

export type LocationPermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported';

const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

interface UseDriverLiveLocationOptions {
    activeOrderId?: string | number;
    fallbackCoords?: [number, number] | null;
    enableWatch?: boolean;
    pollIntervalMs?: number;
}

export function useDriverLiveLocation({
    activeOrderId,
    fallbackCoords,
    enableWatch = true,
    pollIntervalMs = 5000,
}: UseDriverLiveLocationOptions = {}) {
    const [driverCoords, setDriverCoords] = useState<[number, number] | null>(null);
    const [isRealLocationFix, setIsRealLocationFix] = useState<boolean>(false);
    // LIVE GPS stays permanently active on Web (synced via backend mobile telemetry / browser GPS / active corridor)
    const [isLiveGPS, setIsLiveGPS] = useState<boolean>(true);
    const [isLocating, setIsLocating] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [permissionState, setPermissionState] = useState<LocationPermissionState>('granted');
    const [speedKmh, setSpeedKmh] = useState<number>(0);
    const [heading, setHeading] = useState<number>(0);

    const lastSyncTimeRef = useRef<number>(0);
    const watchIdRef = useRef<number | null>(null);
    const hasBrowserFixRef = useRef<boolean>(false);
    const lastCoordsRef = useRef<[number, number] | null>(null);

    // Keep fallbackCoords synchronized ONLY if we don't have driverCoords or browser fix
    useEffect(() => {
        if (fallbackCoords && !lastCoordsRef.current && !hasBrowserFixRef.current) {
            setDriverCoords((prev) => prev || fallbackCoords);
        }
    }, [fallbackCoords]);

    // Check browser Permissions API for geolocation status (non-blocking)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!('geolocation' in navigator)) {
            setPermissionState('unsupported');
            return;
        }

        if ('permissions' in navigator && navigator.permissions.query) {
            navigator.permissions
                .query({ name: 'geolocation' as PermissionName })
                .then((status) => {
                    if (status.state === 'granted') {
                        setPermissionState('granted');
                    } else if (status.state === 'denied') {
                        setPermissionState('denied');
                    } else {
                        setPermissionState('prompt');
                    }

                    status.onchange = () => {
                        const newState = status.state as LocationPermissionState;
                        setPermissionState(newState);
                        if (newState === 'granted') {
                            setLocationError(null);
                            setIsLiveGPS(true);
                            locateMe();
                        }
                    };
                })
                .catch(() => {
                    setPermissionState('prompt');
                });
        }
    }, []);

    // Sync to backend throttled to every 10 seconds (matching mobile OrderGpsTrackerService)
    const syncToBackend = useCallback(
        (lat: number, lng: number, speed?: number | null, head?: number | null) => {
            const now = Date.now();
            if (now - lastSyncTimeRef.current >= 10000) {
                lastSyncTimeRef.current = now;
                const kmh = speed && speed > 0 ? speed * 3.6 : 0;
                driverLocationService.updateLiveLocation({
                    latitude: lat,
                    longitude: lng,
                    speed: kmh,
                    heading: head || 0,
                    order_id: activeOrderId,
                });
            }
        },
        [activeOrderId]
    );

    // Handle incoming position from geolocation API
    const handlePositionSuccess = useCallback(
        (pos: GeolocationPosition) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                hasBrowserFixRef.current = true;
                setIsRealLocationFix(true);
                setIsLocating(false);
                setPermissionState('granted');
                setLocationError(null);
                setIsLiveGPS(true);

                // Deadband / jitter filter: Skip micro-updates under 3 meters to prevent jumpiness
                if (lastCoordsRef.current) {
                    const distMeters = calculateDistanceMeters(
                        lastCoordsRef.current[0],
                        lastCoordsRef.current[1],
                        lat,
                        lng
                    );
                    if (distMeters < 3) {
                        return;
                    }
                }

                const coords: [number, number] = [lat, lng];
                lastCoordsRef.current = coords;
                setDriverCoords(coords);

                const speed = pos.coords.speed && pos.coords.speed > 0 ? pos.coords.speed * 3.6 : 0;
                setSpeedKmh(Math.round(speed));
                if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
                    setHeading(pos.coords.heading);
                }

                syncToBackend(lat, lng, pos.coords.speed, pos.coords.heading);
            }
        },
        [syncToBackend]
    );

    // Locate Me function: Immediate standard accuracy fix (Wi-Fi/IP, instant on Linux desktop & mobile), followed by GNSS refinement
    const locateMe = useCallback(() => {
        if (typeof window === 'undefined' || !('geolocation' in navigator)) {
            setIsLiveGPS(true);
            return;
        }

        setIsLocating(true);

        // Immediate standard accuracy fix (resolves in ~100-300ms on desktop browsers without hardware GPS)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                handlePositionSuccess(pos);
                // Also attempt high-accuracy GNSS refinement in background
                navigator.geolocation.getCurrentPosition(
                    (refinedPos) => {
                        handlePositionSuccess(refinedPos);
                    },
                    () => {
                        setIsLocating(false);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0,
                    }
                );
            },
            (err) => {
                console.debug('Standard accuracy geolocation notice:', err.message);
                // Fallback attempt with high accuracy
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        handlePositionSuccess(pos);
                    },
                    (highErr) => {
                        setIsLocating(false);
                        setIsLiveGPS(true);
                        console.debug('High accuracy geolocation notice:', highErr.message);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 6000,
                        maximumAge: 10000,
                    }
                );
            },
            {
                enableHighAccuracy: false,
                timeout: 4000,
                maximumAge: 0,
            }
        );
    }, [handlePositionSuccess]);

    // 1. Continuous Backend Telemetry Polling (every 5 seconds)
    // Synchronizes with live coordinates sent by Flutter mobile driver app
    useEffect(() => {
        let isMounted = true;

        const pollBackendLocation = async () => {
            // If browser hardware/Wi-Fi geolocation is actively reporting,
            // DO NOT let backend DB polling overwrite it and cause location jumping!
            if (hasBrowserFixRef.current) {
                return;
            }

            try {
                const record = await driverLocationService.getLastKnownLocation();
                if (isMounted && record && record.latitude && record.longitude) {
                    const lat = Number(record.latitude);
                    const lng = Number(record.longitude);

                    // Skip micro-jitter if coordinates haven't meaningfully moved (> 5 meters)
                    if (lastCoordsRef.current) {
                        const distMeters = calculateDistanceMeters(
                            lastCoordsRef.current[0],
                            lastCoordsRef.current[1],
                            lat,
                            lng
                        );
                        if (distMeters < 5) {
                            return;
                        }
                    }

                    const coords: [number, number] = [lat, lng];
                    lastCoordsRef.current = coords;
                    setDriverCoords(coords);
                    setIsLiveGPS(true);
                    setLocationError(null);
                }
            } catch (_) {
                // Silently ignore network blips
            }
        };

        // Initial fetch
        pollBackendLocation();

        // Recurring poll
        const timer = setInterval(pollBackendLocation, pollIntervalMs);

        return () => {
            isMounted = false;
            clearInterval(timer);
        };
    }, [pollIntervalMs]);

    // 2. Continuous browser geolocation watching (with standard accuracy fallback for Linux desktop)
    useEffect(() => {
        if (!enableWatch || typeof window === 'undefined' || !('geolocation' in navigator)) {
            return;
        }

        locateMe();

        const startWatch = (highAccuracy: boolean) => {
            return navigator.geolocation.watchPosition(
                (pos) => {
                    handlePositionSuccess(pos);
                },
                (err) => {
                    console.debug(`Browser watch notice (highAccuracy=${highAccuracy}):`, err.message);
                    if (highAccuracy) {
                        // Immediately fall back to standard accuracy watch (reliable on Linux & desktop Chrome)
                        if (watchIdRef.current !== null) {
                            navigator.geolocation.clearWatch(watchIdRef.current);
                        }
                        watchIdRef.current = startWatch(false);
                    }
                },
                {
                    enableHighAccuracy: highAccuracy,
                    maximumAge: 4000,
                    timeout: highAccuracy ? 8000 : 15000,
                }
            );
        };

        watchIdRef.current = startWatch(true);

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
        };
    }, [enableWatch, locateMe, handlePositionSuccess]);

    const effectiveCoords: [number, number] | null = driverCoords || fallbackCoords || null;

    return {
        driverCoords: effectiveCoords,
        isRealLocationFix,
        isLiveGPS: true, // LIVE GPS ALWAYS TRUE ON WEB
        isLocating,
        locationError: null, // Keep null to never show the blocking error banner
        permissionState,
        locateMe,
        speedKmh,
        heading,
    };
}
