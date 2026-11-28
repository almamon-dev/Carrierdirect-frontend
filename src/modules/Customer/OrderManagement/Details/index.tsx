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
import { CustomerOrderDetailsSkeleton } from './components/CustomerOrderDetailsSkeleton';

export default function CustomerOrderDetailPage() {
    const {
        order,
        timeline,
        isLoading,
        actionMessage,
        isRatingOpen,
        setIsRatingOpen,
        handleRepeatOrder,
        handleDownloadInvoice,
        handlePrint,
        handleOpenChat,
        handleApprovePOD,
        handleRejectPOD,
        handleReportIssue,
        handleCancelPayLater,
        handleRatingSubmit,
    } = useOrderDetails();

    const [isCancelPlOpen, setIsCancelPlOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancellingPl, setIsCancellingPl] = useState(false);

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
        liveRemainingDistanceText,
        liveRemainingDurationText,
        liveDriverAddress,
        focusOnProduct,
        fitFullRoute,
    } = useCustomerOrderMap({
        pickupLat: order.pickupLat ?? order.pickup?.lat,
        pickupLng: order.pickupLng ?? order.pickup?.lng,
        deliveryLat: order.deliveryLat ?? order.delivery?.lat,
        deliveryLng: order.deliveryLng ?? order.delivery?.lng,
        driverLat: order.driverLat,
        driverLng: order.driverLng,
        hubLat: order.hubLat,
        hubLng: order.hubLng,
        hubLocation: order.hubLocation,
        isRelay: order.isRelay,
        currentActiveLeg: order.currentActiveLeg,
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
        hasLiveGps,
        isGpsFresh,
        gpsUpdatedHuman,
        progressSteps,
    } = computeTrackingDisplayMetrics(order, timeline, liveDistanceText, liveDurationText, {
        liveRemainingDistanceText,
        liveRemainingDurationText,
        liveDriverAddress,
    });

    if (isLoading) {
        return <CustomerOrderDetailsSkeleton />;
    }

    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-3 text-slate-800 dark:text-slate-200 antialiased">
            {/* Top Action Notification Banner */}
            {actionMessage && (
                <div className="p-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-[4px] text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xs">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>{actionMessage}</span>
                </div>
            )}

            {/* POD Review / Approval / Rejected / Disputed Banner */}
            {(order.pod.isAvailable || order.pod.isAccepted || order.pod.isRejected || order.pod.replacementRequested || order.activeDispute) && (
                <CustomerOrderPODAction
                    order={order}
                    onApprovePOD={handleApprovePOD}
                    onRejectPOD={handleRejectPOD}
                    onReportIssue={handleReportIssue}
                />
            )}

            {/* Net-30 Pay Later Cancellation Bar (Pre-Completion) */}
            {order.isPayLater && !['completed', 'cancelled'].includes(order.rawStatus) && !order.activeDispute && (
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-900 dark:text-slate-100">Net-30 Pay Later Policy:</strong>{' '}
                        Free cancellation before carrier assignment; cancellation fee applies after assignment prior to pickup; post-pickup cancellations enter dispute review.
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCancelPlOpen(true)}
                        className="h-7 px-2.5 text-[11px] font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 shrink-0 cursor-pointer"
                    >
                        Cancel Pay Later Order
                    </Button>
                </div>
            )}

            {isCancelPlOpen && (
                <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-[4px] p-3 space-y-2 text-xs">
                    <p className="font-bold text-rose-900 dark:text-rose-200">Cancel Net-30 Order — Provide Reason</p>
                    <textarea
                        rows={2}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="State why this shipment needs to be cancelled..."
                        className="w-full p-2 rounded border border-rose-200 dark:border-rose-800 bg-white dark:bg-[#12161c] text-xs"
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsCancelPlOpen(false)} className="h-7 px-3 text-xs">
                            Keep Order
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={!cancelReason.trim() || isCancellingPl}
                            onClick={async () => {
                                setIsCancellingPl(true);
                                try {
                                    await handleCancelPayLater(cancelReason.trim());
                                    setIsCancelPlOpen(false);
                                    setCancelReason('');
                                } finally {
                                    setIsCancellingPl(false);
                                }
                            }}
                            className="h-7 px-3 text-xs bg-rose-600 hover:bg-rose-700 text-white"
                        >
                            {isCancellingPl ? 'Processing...' : 'Confirm Cancellation'}
                        </Button>
                    </div>
                </div>
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
                hasLiveGps={hasLiveGps}
                isGpsFresh={isGpsFresh}
                gpsUpdatedHuman={gpsUpdatedHuman}
                progressSteps={progressSteps}
                mapContainerRef={mapContainerRef}
                mapLoaded={mapLoaded}
                mapError={mapError}
                mapType={mapType}
                onChangeMapType={setMapType}
                onFocusDriver={focusOnProduct}
                onFitRoute={fitFullRoute}
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
