import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, MessageSquare, MoreVertical, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';
import RatingModal from '@/components/modals/rating-modal';

import { useOrderDetails } from './hooks/useOrderDetails';
import useCustomerOrderMap from './hooks/useCustomerOrderMap';
import CustomerOrderHeaderMenu from './components/CustomerOrderHeaderMenu';
import CustomerOrderPODAction from './components/CustomerOrderPODAction';

import TrackShipmentMainCard from '../TrackOrder/components/TrackShipmentMainCard';
import TrackShipmentBottomCards from '../TrackOrder/components/TrackShipmentBottomCards';
import { computeTrackingDisplayMetrics } from '../TrackOrder/utils/trackingViewUtils';

export default function CustomerOrderDetailPage() {
    const {
        order,
        timeline,
        actionMessage,
        isRatingOpen,
        setIsRatingOpen,
        handleRepeatOrder,
        handleDownloadInvoice,
        handlePrint,
        handleOpenChat,
        handleApprovePOD,
        handleRatingSubmit,
    } = useOrderDetails();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleCopyId = () => {
        navigator.clipboard.writeText(order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isMenuOpen) {
            setIsMenuOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180),
            });
            setIsMenuOpen(true);
        }
    };

    const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleCloseMenu();
        };
        const handleScroll = () => handleCloseMenu();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isMenuOpen, handleCloseMenu]);

    const fromCity = order.pickup.city || 'Origin';
    const toCity = order.delivery.city || 'Destination';
    const productLoc = order.productLocation || {
        stage: 'at_pickup' as const,
        statusLabel: 'At Pickup Facility',
        currentAddress: fromCity,
        currentCity: fromCity,
        hasLiveGps: false,
        updatedHuman: 'Just now',
    };

    const {
        mapContainerRef,
        mapLoaded,
        mapError,
        mapType,
        setMapType,
        googleMapsUrl,
        embedMapSrc,
        liveDistanceText,
        liveDurationText,
        focusOnProduct,
    } = useCustomerOrderMap({
        pickupLat: order.pickupLat ?? order.pickup?.lat,
        pickupLng: order.pickupLng ?? order.pickup?.lng,
        deliveryLat: order.deliveryLat ?? order.delivery?.lat,
        deliveryLng: order.deliveryLng ?? order.delivery?.lng,
        driverLat: order.driverLat,
        driverLng: order.driverLng,
        fromCity,
        toCity,
        pickupAddress: order.pickup.address || fromCity,
        deliveryAddress: order.delivery.address || toCity,
        rawStatus: order.rawStatus,
        productStage: productLoc.stage,
        productStatusLabel: productLoc.statusLabel,
        productCurrentAddress: productLoc.currentAddress,
        cargoSummary: order.vehicle?.goodsType !== '-' ? order.vehicle.goodsType : order.loadType,
        driverName: order.driver?.name,
        vehiclePlate: order.driver?.plate || order.vehicle?.number,
        updatedHuman: productLoc.updatedHuman,
    });

    const {
        displayDistance,
        displayEta,
        remainingDistance,
        displayExpectedDelivery,
        driverLocationLabel,
        pickupStatusLabel,
        isPickupCompleted,
        progressSteps,
    } = computeTrackingDisplayMetrics(order, timeline, liveDistanceText, liveDurationText);

    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-3 text-slate-800 dark:text-slate-200 antialiased">
            {/* Top Action Notification Banner */}
            {actionMessage && (
                <div className="p-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[4px] text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>{actionMessage}</span>
                </div>
            )}

            {/* POD Review / Approval Banner (Shown when POD is uploaded or approved) */}
            {(order.pod.isAvailable || order.pod.isAccepted) && (
                <CustomerOrderPODAction order={order} onApprovePOD={handleApprovePOD} />
            )}

            {/* Main Unified Card (Header + 4 Metrics + Map + Shipment Progress) */}
            <TrackShipmentMainCard
                order={order}
                fromCity={fromCity}
                toCity={toCity}
                displayDistance={displayDistance}
                displayEta={displayEta}
                remainingDistance={remainingDistance}
                displayExpectedDelivery={displayExpectedDelivery}
                driverLocationLabel={driverLocationLabel}
                pickupStatusLabel={pickupStatusLabel}
                isPickupCompleted={isPickupCompleted}
                progressSteps={progressSteps}
                mapContainerRef={mapContainerRef}
                mapLoaded={mapLoaded}
                mapError={mapError}
                mapType={mapType}
                onChangeMapType={setMapType}
                onFocusDriver={focusOnProduct}
                embedMapSrc={embedMapSrc}
                googleMapsUrl={googleMapsUrl}
                headerActions={
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenChat}
                            className="h-8 px-2.5 text-xs font-semibold bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shadow-2xs rounded-[4px]"
                        >
                            <MessageSquare size={12} className="text-[#ff4a1f]" />
                            <span>Chat</span>
                        </Button>

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleRepeatOrder}
                            className="h-8 px-3 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-[4px]"
                        >
                            <RotateCcw size={12} />
                            <span>Repeat</span>
                        </Button>

                        <Button
                            ref={triggerRef}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 flex items-center justify-center shrink-0 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-2xs rounded-[4px]"
                            onClick={handleToggleMenu}
                            title="More options"
                        >
                            <MoreVertical size={13} />
                        </Button>

                        <CustomerOrderHeaderMenu
                            isOpen={isMenuOpen}
                            dropdownPos={dropdownPos}
                            order={order}
                            copied={copied}
                            onClose={handleCloseMenu}
                            onDownloadInvoice={handleDownloadInvoice}
                            onPrint={handlePrint}
                            onOpenRating={() => setIsRatingOpen(true)}
                            onCopyId={handleCopyId}
                        />
                    </div>
                }
            />

            {/* Bottom 4-Column Details Grid (Pickup | Destination | Vehicle & Cargo | Payment Breakdown) */}
            <TrackShipmentBottomCards order={order} />

            {/* Carrier Rating & Review Modal */}
            {isRatingOpen && (
                <RatingModal
                    isOpen={isRatingOpen}
                    onClose={() => setIsRatingOpen(false)}
                    orderId={String(order.rawId || order.id)}
                    targetName={order.supplier.name}
                    targetRole="Supplier"
                    orderTitle={order.route}
                    onSubmit={handleRatingSubmit}
                />
            )}
        </div>
    );
}
