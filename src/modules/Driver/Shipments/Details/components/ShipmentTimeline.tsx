import React from 'react';
import { ShipmentItem } from '../../../types/shipmentTypes';
import { UnifiedShipmentTimeline } from '../../../../../components/shared/ShipmentTimeline/UnifiedShipmentTimeline';
import type { UnifiedTimelineInput } from '../../../../../components/shared/ShipmentTimeline/buildUnifiedTimeline';

interface Props {
    shipment: ShipmentItem;
}

export function buildDriverTimelineInput(shipment: ShipmentItem): UnifiedTimelineInput {
    return {
        status: shipment.status,
        rawMilestoneStatus: shipment.rawMilestoneStatus || shipment.status,
        orderStatus: shipment.orderStatus,
        podStatus: shipment.podStatus,
        isRelay: shipment.isRelay,
        currentActiveLeg: shipment.currentActiveLeg,
        hubLocation: shipment.hubLocation,
        driverName: shipment.driver?.name,
        pickupCity: shipment.pickup_city || shipment.shipper?.city,
        deliveryCity: shipment.delivery_city || shipment.consignee?.city,
        createdAt: shipment.createdAt,
        podUploadedAt: shipment.podData?.uploadedAt,
        handover: shipment.handover
            ? {
                  status: shipment.handover.status,
                  hubLocation: shipment.handover.hub_location,
                  driverToName: shipment.handover.driver_to_name,
                  handoverAt: shipment.handover.handover_at,
                  acceptedAt: shipment.handover.accepted_at,
              }
            : null,
        legs: (shipment.relayLegs || []).map((leg) => ({
            legNumber: leg.leg_number,
            legType: leg.leg_type,
            journeyLeg: leg.journey_leg,
            driverName: leg.driver_name,
            driverPhone: leg.driver_phone,
            vehiclePlate: leg.vehicle_plate,
            status: leg.status,
            assignedAt: leg.assigned_at,
            completedAt: leg.completed_at,
        })),
        history: (shipment.history || []).map((item) => ({
            status: item.status,
            title: item.title,
            description: item.description,
            date: item.date,
            rawDate: item.raw_date,
            createdAt: item.time,
        })),
    };
}

export const ShipmentTimeline: React.FC<Props> = ({ shipment }) => {
    return <UnifiedShipmentTimeline data={buildDriverTimelineInput(shipment)} />;
};

export default ShipmentTimeline;
