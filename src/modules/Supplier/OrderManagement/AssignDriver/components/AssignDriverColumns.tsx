import React from "react";
import { Column } from "@/components/tables/data-table";
import Badge from "@/components/ui/badge";
import { SupplierOrderItem } from "../../ActiveJobs/types";
import { formatDisplayDate } from "@/lib/utils";
import { MapPin, ArrowRight, Clock } from "lucide-react";

export const getAssignDriverColumns = (
    navigate: (path: string, options?: any) => void,
    onNavigateDetails: (order: SupplierOrderItem) => void
): Column<SupplierOrderItem>[] => [
    {
        id: "id",
        label: "Job ID",
        sortable: true,
        className: "w-[95px] min-w-[95px] text-left",
        render: (row) => {
            const displayId = row.order_id || row.order_no || (row.id ? "ORD-" + String(row.id).padStart(4, "0") : "ORD-0000");

            return (
                <div className="flex items-center h-5">
                    <button
                        type="button"
                        onClick={() => navigate(`/supplier/orders/details/${row.slug || row.id}`, { state: { orderData: row } })}
                        className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs leading-none"
                    >
                        {displayId}
                    </button>
                </div>
            );
        }
    },
    {
        id: "customer",
        label: "Customer / Shipper",
        sortable: true,
        className: "w-[150px] min-w-[140px]",
        render: (row) => {
            const rawCust = row.customer;
            const name: string = typeof rawCust === "string" 
                ? (row.customer_name || rawCust) 
                : (typeof rawCust === "object" && rawCust?.name ? rawCust.name : (row.customer_name || "Shipper Client"));
            const initial = name ? name.charAt(0).toUpperCase() : "C";

            return (
                <div className="flex items-center gap-2 min-w-0 h-5">
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {initial}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs whitespace-nowrap leading-tight" title={name}>
                        {name}
                    </span>
                </div>
            );
        }
    },
    {
        id: "route",
        label: "Route",
        sortable: true,
        className: "min-w-[180px]",
        render: (row) => {
            const origin = row.pickup_city || (row.pickup_address ? row.pickup_address.split(",")[0]?.trim() : "") || "Origin";
            const destination = row.delivery_city || (row.delivery_address ? row.delivery_address.split(",")[0]?.trim() : "") || "Destination";

            return (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap h-5" title={origin + " → " + destination}>
                    <MapPin size={12} className="text-[#ff4a1f] shrink-0" />
                    <span>{origin}</span>
                    <ArrowRight size={11} className="text-slate-400 shrink-0" />
                    <span>{destination}</span>
                </div>
            );
        }
    },
    {
        id: "vehicle",
        label: "Vehicle / Spec",
        sortable: true,
        className: "min-w-[120px]",
        render: (row) => {
            const vehicle = row.vehicle || row.vehicle_type || row.truck_type || row.service || "Covered Van";
            return (
                <div className="flex items-center h-5">
                    <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-medium" title={vehicle}>
                        {vehicle}
                    </span>
                </div>
            );
        }
    },
    {
        id: "cargo",
        label: "Cargo / Load",
        className: "min-w-[115px]",
        render: (row) => {
            const rawWeight = row.weight || row.cargo_weight || row.total_weight || "—";
            const rawPallets = row.type_of_pallets || row.pallets || row.load_type || "Pallets";

            return (
                <div className="flex items-center gap-1.5 text-xs h-5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{rawWeight}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">({rawPallets})</span>
                </div>
            );
        }
    },
    {
        id: "pickup_date",
        label: "Pickup Date",
        sortable: true,
        className: "w-[105px] min-w-[105px] text-center",
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {formatDisplayDate(row.pickup_date || row.created_at || row.date || row.order_date)}
                </span>
            </div>
        )
    },
    {
        id: "delivery_eta",
        label: "Delivery ETA",
        sortable: true,
        className: "w-[110px] min-w-[110px] text-center",
        render: (row) => {
            const delivery = row.delivery_date || row.estimated_delivery || row.eta;
            return (
                <div className="flex items-center justify-center gap-1.5 h-5">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap text-xs text-slate-700 dark:text-slate-300 font-semibold leading-none">
                        {delivery ? formatDisplayDate(delivery, "Scheduled") : "Scheduled"}
                    </span>
                </div>
            );
        }
    },
    {
        id: "payout",
        label: "Net Payout",
        sortable: true,
        className: "w-[105px] min-w-[105px]",
        render: (row) => {
            let formattedAmt = "—";
            const raw = row.amount_raw ?? row.amount ?? row.total_amount ?? row.net_payout;
            if (typeof raw === "number") {
                formattedAmt = "€ " + raw.toLocaleString("de-DE", { minimumFractionDigits: 2 });
            } else if (typeof raw === "string" && raw) {
                formattedAmt = raw.startsWith("€") || raw.startsWith("EUR") || raw.startsWith("$") ? raw : "€ " + raw;
            }
            return (
                <div className="flex items-center h-5">
                    <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                        {formattedAmt}
                    </span>
                </div>
            );
        }
    },
    {
        id: "driver_allocation",
        label: "Driver Allocation",
        sortable: true,
        className: "min-w-[160px]",
        render: (row) => {
            const rawStatus = (row.status_raw || row.status || "confirmed").toLowerCase().trim();
            const dName = row.driver_name || (typeof row.driver === "string" ? row.driver : (row.driver as any)?.name);
            const hasRealDriver = dName && !dName.toLowerCase().includes("assigned driver") && !dName.toLowerCase().includes("unassigned");
            const isAssigned = (rawStatus === "driver_assigned" || rawStatus === "assigned" || rawStatus === "in_transit" || rawStatus === "picked_up") || hasRealDriver;

            if (isAssigned && hasRealDriver) {
                return (
                    <div className="flex items-center gap-1.5 h-5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[9px] font-bold shrink-0">
                            {dName.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate leading-none" title={dName}>
                            {dName}
                        </span>
                    </div>
                );
            }

            return (
                <div className="flex items-center h-5">
                    <Badge variant="warning" className="text-[10.5px] font-bold whitespace-nowrap">
                        Pending Dispatch
                    </Badge>
                </div>
            );
        }
    },
    {
        id: "status",
        label: "Status",
        sortable: true,
        className: "w-[110px] min-w-[110px] text-center",
        render: (row) => {
            const rawStatus = String(row.status_raw || row.status || "confirmed").toLowerCase().trim();
            let displayStatus = "Confirmed";
            let variant: any = "info";

            if (rawStatus === "completed" || rawStatus === "pod accepted") {
                displayStatus = "Completed";
                variant = "success";
            } else if (rawStatus.includes("review") || rawStatus === "delivered") {
                displayStatus = "POD Review";
                variant = "secondary";
            } else if (rawStatus === "in_transit") {
                displayStatus = "In Transit";
                variant = "warning";
            } else if (rawStatus === "picked_up") {
                displayStatus = "Picked Up";
                variant = "warning";
            } else if (rawStatus === "driver_assigned" || rawStatus === "assigned") {
                displayStatus = "Assigned";
                variant = "info";
            } else {
                displayStatus = "Confirmed";
                variant = "info";
            }

            return (
                <div className="flex items-center justify-center h-5">
                    <Badge variant={variant} showDot className="text-[10.5px] font-bold whitespace-nowrap">
                        {displayStatus}
                    </Badge>
                </div>
            );
        }
    }
];

export default getAssignDriverColumns;
