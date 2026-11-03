import { NormalizedSupplierOrder } from "./supplierOrderTrackUtils";

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

export const buildSupplierOrderTimeline = (
    isPodAccepted: boolean,
    order?: NormalizedSupplierOrder
) => {
    const rawStatus = (order?.rawStatus || order?.status || "confirmed").toLowerCase().trim();
    const s = rawStatus.replace(/_/g, " ");

    const history: any[] = Array.isArray(order?.trackingHistory)
        ? order.trackingHistory
        : (Array.isArray(order?.updates) ? order.updates : []);

    const fromCity = order?.from || "Origin";
    const toCity = order?.to || "Destination";

    const hasRealDriver = Boolean(
        order?.driver?.name &&
        order.driver.name !== "Unassigned" &&
        order.driver.name !== "Assigned Driver" &&
        order.driver.name !== "Assigned Fleet Driver"
    );

    let currentStep = 1;
    let isDelivered = false;

    if (s === "completed" || s === "pod accepted" || isPodAccepted || s === "delivered" || s === "pod uploaded" || s === "pod review") {
        currentStep = 4;
        isDelivered = true;
    } else if (s === "in transit" || s === "on the way" || s === "arrived" || s === "out for delivery") {
        currentStep = 3;
    } else if (s === "picked up" || s === "cargo loaded" || s === "goods picked up" || s === "in progress") {
        currentStep = 2;
    } else {
        currentStep = 1;
    }

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

    const bookedFallback = formatTimestamp(order?.createdAt || order?.date) || (order?.pickupDate ? `${order.pickupDate} 08:30 AM` : "");
    const pickupFallback = formatTimestamp(order?.pickupDate) || bookedFallback || "Pending";
    const deliveryFallback = formatTimestamp(order?.deliveryDate) || "Pending";

    return [
        {
            id: 1,
            status: "Assigned",
            time: getTimeForStep(
                ["driver_assigned", "driver", "assigned", "confirmed"],
                currentStep > 1 || isDelivered,
                currentStep === 1 && !isDelivered,
                bookedFallback || "Assigned",
                "In Progress",
                "Pending"
            ),
            completed: currentStep > 1 || isDelivered,
            active: currentStep === 1 && !isDelivered,
            location: hasRealDriver ? `${order?.driver?.name} assigned (${order?.vehicle?.number || "Fleet Vehicle"})` : "Driver assigned for dispatch"
        },
        {
            id: 2,
            status: "Pickup",
            time: getTimeForStep(
                ["picked_up", "pickup", "cargo loaded", "goods picked up"],
                currentStep > 2 || isDelivered,
                currentStep === 2 && !isDelivered,
                pickupFallback,
                "In Progress",
                "Pending"
            ),
            completed: currentStep > 2 || isDelivered,
            active: currentStep === 2 && !isDelivered,
            location: `Pickup facility: ${order?.pickupFullAddress || fromCity}`
        },
        {
            id: 3,
            status: "In Transit",
            time: getTimeForStep(
                ["in_transit", "transit", "on the way"],
                currentStep > 3 || isDelivered,
                currentStep === 3 && !isDelivered,
                pickupFallback,
                "Live",
                "Pending"
            ),
            completed: currentStep > 3 || isDelivered,
            active: currentStep === 3 && !isDelivered,
            location: `Corridor: ${fromCity} ➔ ${toCity}`
        },
        {
            id: 4,
            status: "Delivered",
            time: getTimeForStep(
                ["delivered", "completed", "pod accepted", "pod uploaded", "pod review"],
                isDelivered,
                currentStep === 4 && !isDelivered,
                deliveryFallback,
                "Pending",
                "Pending"
            ),
            completed: isDelivered,
            active: currentStep === 4 && !isDelivered,
            location: isDelivered ? "Proof of delivery verified and order delivered" : `${order?.deliveryFullAddress || toCity}`
        },
    ];
};

export default buildSupplierOrderTimeline;
