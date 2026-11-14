import React from 'react';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';
import { UnifiedShipmentTimeline } from '../../../../../components/shared/ShipmentTimeline/UnifiedShipmentTimeline';
import type { UnifiedTimelineInput } from '../../../../../components/shared/ShipmentTimeline/buildUnifiedTimeline';

interface SupplierTimelineSectionProps {
    order: NormalizedSupplierOrder;
}

export function buildSupplierTimelineInput(order: NormalizedSupplierOrder): UnifiedTimelineInput {
    const raw = order.raw || {};
    const rawApiStatus = String(raw.status_raw || raw.raw_status || raw.status || '').toLowerCase().trim();
    const hasLiveStatusOverride =
        Boolean(order.rawStatus) &&
        Boolean(rawApiStatus) &&
        order.rawStatus.toLowerCase().trim() !== rawApiStatus;

    const rawMilestone = hasLiveStatusOverride
        ? order.rawStatus
        : String(raw.raw_milestone_status || order.rawStatus || 'confirmed');

    const rawLegs = Array.isArray(order.shipment_legs) && order.shipment_legs.length > 0
        ? order.shipment_legs
        : Array.isArray(raw.shipment_legs) && raw.shipment_legs.length > 0
            ? raw.shipment_legs
            : Array.isArray(order.legs) && order.legs.length > 0
                ? order.legs
                : Array.isArray(raw.legs)
                    ? raw.legs
                    : [];

    const rawHistory = Array.isArray(order.trackingHistory) && order.trackingHistory.length > 0
        ? order.trackingHistory
        : Array.isArray(raw.tracking?.history)
            ? raw.tracking.history
            : Array.isArray(raw.updates)
                ? raw.updates
                : [];

    const handover = raw.handover && typeof raw.handover === 'object'
        ? {
              status: raw.handover.status,
              hubLocation: raw.handover.hub_location,
              driverToName: raw.handover.driver_to_name,
              handoverAt: raw.handover.handover_at,
              acceptedAt: raw.handover.accepted_at,
          }
        : null;

    return {
        status: order.rawStatus,
        rawMilestoneStatus: rawMilestone,
        orderStatus: raw.status,
        podStatus: order.podStatus || raw.pod_status,
        isRelay: Boolean(order.is_relay || raw.is_relay),
        currentActiveLeg: Number(raw.current_active_leg ?? 1),
        hubLocation: raw.hub_location,
        driverName: order.driver?.name,
        pickupCity: order.pickupCity,
        deliveryCity: order.deliveryCity,
        createdAt: order.createdAt || raw.created_at,
        podUploadedAt: raw.pod_uploaded_at || raw.pod?.uploaded_at,
        handover,
        legs: rawLegs.map((leg: any, index: number) => ({
            legNumber: Number(leg.leg_number ?? leg.legNumber ?? index + 1),
            legType: leg.leg_type ?? leg.legType,
            journeyLeg: leg.journey_leg ?? leg.journeyLeg,
            driverName: leg.driver_name ?? leg.driverName ?? leg.subcontractor_driver_name,
            driverPhone: leg.driver_phone ?? leg.driverPhone,
            vehiclePlate: leg.vehicle_plate ?? leg.vehiclePlate,
            status: leg.status,
            assignedAt: leg.assigned_at ?? leg.assignedAt,
            completedAt: leg.completed_at ?? leg.completedAt,
        })),
        history: rawHistory.map((item: any) => ({
            status: item.status,
            title: item.title,
            description: item.description,
            date: item.date,
            rawDate: item.raw_date,
            createdAt: item.created_at,
        })),
    };
}

export const SupplierTimelineSection: React.FC<SupplierTimelineSectionProps> = ({ order }) => {
    return <UnifiedShipmentTimeline data={buildSupplierTimelineInput(order)} />;
};

export default SupplierTimelineSection;
