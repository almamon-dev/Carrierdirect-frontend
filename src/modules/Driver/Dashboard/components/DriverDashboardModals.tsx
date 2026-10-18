import React from 'react';
import { DigitalBOLModal } from './DigitalBOLModal';
import { ReportsModal } from './ReportsModal';
import { DispatcherSupportModal } from '../../Profile/components/DispatcherSupportModal';
import { GPSComingSoonModal } from '@/components/modals';

interface DriverDashboardModalsProps {
    isBOLOpen: boolean;
    setIsBOLOpen: (val: boolean) => void;
    activeShipment: any;
    isReportsOpen: boolean;
    setIsReportsOpen: (val: boolean) => void;
    driverRating?: number;
    completedOrders?: number;
    isSupportOpen: boolean;
    setIsSupportOpen: (val: boolean) => void;
    isGPSOpen: boolean;
    setIsGPSOpen: (val: boolean) => void;
    gpsDestination?: string;
}

export const DriverDashboardModals: React.FC<DriverDashboardModalsProps> = ({
    isBOLOpen,
    setIsBOLOpen,
    activeShipment,
    isReportsOpen,
    setIsReportsOpen,
    driverRating,
    completedOrders,
    isSupportOpen,
    setIsSupportOpen,
    isGPSOpen,
    setIsGPSOpen,
    gpsDestination,
}) => {
    return (
        <>
            <DigitalBOLModal
                isOpen={isBOLOpen}
                onClose={() => setIsBOLOpen(false)}
                bolData={activeShipment}
            />

            <ReportsModal
                isOpen={isReportsOpen}
                onClose={() => setIsReportsOpen(false)}
                rating={driverRating}
                completedOrders={completedOrders}
            />

            <DispatcherSupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
            />

            <GPSComingSoonModal
                isOpen={isGPSOpen}
                destination={gpsDestination}
                onClose={() => setIsGPSOpen(false)}
            />
        </>
    );
};
