import { NormalizedCustomerOrder, TimelineItem } from "../types/orderDetail.types";

const formatTimestamp = (raw: any): string => {
    if (!raw) return "";
    if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}/.test(trimmed)) {
            return trimmed;
        }
        const parsed = new Date(trimmed);
        if (!isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }
        return trimmed;
    }
    if (raw instanceof Date && !isNaN(raw.getTime())) {
        return raw.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
    return "";
};

const findHistoryEntry = (history: any[], keys: string[]) => {
    if (!Array.isArray(history) || history.length === 0) return null;
    const lowerKeys = keys.map((k) => k.toLowerCase().replace(/[\s_-]+/g, ""));
    for (const key of lowerKeys) {
        for (const item of history) {
            const itemStatus = String(item?.status || "").toLowerCase().replace(/[\s_-]+/g, "");
            const itemTitle = String(item?.title || "").toLowerCase().replace(/[\s_-]+/g, "");
            if (itemStatus.includes(key) || itemTitle.includes(key)) {
                return item;
            }
        }
    }
    return null;
};

export const buildCustomerOrderTimeline = (order: NormalizedCustomerOrder): TimelineItem[] => {
    const rawStatus = (order.rawStatus || "").toLowerCase().trim();
    const isPodAccepted = Boolean(order.pod?.isAccepted);

    const history: any[] = Array.isArray(order.trackingHistory)
        ? order.trackingHistory
        : (Array.isArray(order.updates) ? order.updates : []);

    let currentStep = 2;

    if (rawStatus === "pending") {
        currentStep = 1;
    } else if (rawStatus === "confirmed" || rawStatus === "scheduled" || rawStatus === "new") {
        currentStep = order.driver ? 3 : 2;
    } else if (rawStatus === "driver_assigned" || rawStatus === "assigned" || rawStatus === "dispatched") {
        currentStep = 3;
    } else if (rawStatus === "picked_up" || rawStatus === "in_progress") {
        currentStep = 4;
    } else if (rawStatus === "in_transit" || rawStatus === "on_the_way") {
        currentStep = 4;
    } else if (rawStatus === "arrived" || rawStatus === "destination_reached") {
        currentStep = 5;
    } else if (rawStatus === "delivered" || rawStatus === "pod_uploaded" || rawStatus === "pod_review") {
        currentStep = isPodAccepted ? 8 : 6;
    } else if (rawStatus === "completed" || rawStatus === "pod_accepted" || isPodAccepted) {
        currentStep = 8;
    }

    const isAllCompleted = currentStep >= 8;

    const getTimeForStep = (
        keys: string[],
        isStepCompleted: boolean,
        isActive: boolean,
        fallbackIfCompleted: string,
        fallbackIfActive: string,
        fallbackIfPending: string
    ): string => {
        const entry = findHistoryEntry(history, keys);
        if (entry) {
            const formatted = formatTimestamp(entry.date || entry.created_at || entry.created_at_formatted);
            if (formatted) return formatted;
        }
        if (isStepCompleted) {
            return fallbackIfCompleted || "Completed";
        }
        if (isActive) {
            return fallbackIfActive || "In Progress";
        }
        return fallbackIfPending || "Pending";
    };

    const bookedFallbackTime = formatTimestamp(order.createdAt) || (order.pickup?.date ? `${order.pickup.date} 10:00 AM` : "");
    const driverFallbackTime = order.driver ? (bookedFallbackTime || "Assigned") : "Pending Carrier";
    const pickupFallbackTime = formatTimestamp(order.pickup?.date) || bookedFallbackTime || "Scheduled Date";
    const deliveryFallbackTime = formatTimestamp(order.delivery?.date) || (order.estArrival || "Estimated");
    const podFallbackTime = formatTimestamp(order.pod?.uploadedAt) || deliveryFallbackTime || "Completed";

    return [
        {
            id: 1,
            status: "Order Confirmed & Booked",
            time: getTimeForStep(
                ["confirmed", "booked", "pending", "payment"],
                currentStep > 1 || isAllCompleted,
                currentStep === 1,
                bookedFallbackTime,
                "In Progress",
                "Pending"
            ),
            completed: currentStep > 1 || isAllCompleted,
            active: currentStep === 1,
            location: `${order.pickup.city} Logistics Registry`,
            description: "Quotation accepted and carrier booking confirmed in Escrow.",
        },
        {
            id: 2,
            status: order.driver ? "Driver & Fleet Assigned" : "Driver Assignment",
            time: getTimeForStep(
                ["driver_assigned", "driver", "assigned", "dispatched"],
                currentStep > 2 || isAllCompleted,
                currentStep === 2,
                driverFallbackTime,
                "In Progress",
                order.driver ? "Assigned" : "Pending Carrier"
            ),
            completed: currentStep > 2 || isAllCompleted,
            active: currentStep === 2,
            location: order.driver ? `${order.driver.name} (${order.vehicle.number})` : "",
            description: order.driver ? `Assigned driver ${order.driver.name} with vehicle plate ${order.vehicle.number}` : "",
        },
        {
            id: 3,
            status: "Goods Picked Up",
            time: getTimeForStep(
                ["picked_up", "pickup", "cargo loaded", "goods picked up"],
                currentStep > 3 || isAllCompleted,
                currentStep === 3,
                pickupFallbackTime,
                "In Progress",
                "Scheduled Date"
            ),
            completed: currentStep > 3 || isAllCompleted,
            active: currentStep === 3,
            location: order.pickup.address,
            description: "Cargo verified, secured, and departed pickup facility.",
        },
        {
            id: 4,
            status: "In Transit on Route",
            time: getTimeForStep(
                ["in_transit", "transit", "on the way"],
                currentStep > 4 || isAllCompleted,
                currentStep === 4,
                pickupFallbackTime,
                "Live GPS Tracking",
                "Estimated En Route"
            ),
            completed: currentStep > 4 || isAllCompleted,
            active: currentStep === 4,
            location: `Highway Route: ${order.pickup.city} ➔ ${order.delivery.city}`,
            description: "Live GPS tracked on designated corridor.",
        },
        {
            id: 5,
            status: "Arrived at Destination",
            time: getTimeForStep(
                ["arrived", "destination reached", "delivered"],
                currentStep > 5 || isAllCompleted,
                currentStep === 5,
                deliveryFallbackTime,
                "Arrived",
                order.estArrival || "Scheduled"
            ),
            completed: currentStep > 5 || isAllCompleted,
            active: currentStep === 5,
            location: order.delivery.address,
            description: "Vehicle arrived at recipient unloading dock.",
        },
        {
            id: 6,
            status: isPodAccepted || isAllCompleted ? "POD Verified & Approved" : "Review & Accept POD",
            time: getTimeForStep(
                ["completed", "pod accepted", "pod verified", "pod review", "delivered"],
                isPodAccepted || isAllCompleted,
                currentStep === 6 && !isPodAccepted,
                podFallbackTime,
                "Action Required",
                "Awaiting Delivery"
            ),
            completed: isPodAccepted || isAllCompleted,
            active: currentStep === 6 && !isPodAccepted,
            location: "Customer Verification",
            description: (isPodAccepted || isAllCompleted)
                ? "Proof of delivery verified and Escrow payment settled."
                : "Signed delivery receipt uploaded by driver for customer approval.",
        },
        {
            id: 7,
            status: "Order Completed",
            time: getTimeForStep(
                ["completed", "released", "settled"],
                isPodAccepted || isAllCompleted,
                false,
                podFallbackTime,
                "Pending Final POD",
                "Pending Final POD"
            ),
            completed: isPodAccepted || isAllCompleted,
            active: false,
            location: "Settled & Closed",
            description: "Freight lifecycle successfully concluded.",
        },
    ];
};

export default buildCustomerOrderTimeline;
