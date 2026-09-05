import React from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface Step3SchemaViewProps {
    rows: any[];
    selectedRowIndex: number;
    setSelectedRowIndex: React.Dispatch<React.SetStateAction<number>>;
    currentReq: any;
}

const SCHEMA_FIELDS = [
    { label: "Request Title", col: "title / request_title", key: "requestTitle", altKeys: ["title", "request_title"] },
    { label: "Pickup Location", col: "pickup_city / origin", key: "pickupAddress", altKeys: ["pickup_address", "pickupCompany", "pickup_company", "pickup_city", "pickup"] },
    { label: "Delivery Location", col: "delivery_city / destination", key: "deliveryAddress", altKeys: ["delivery_address", "deliveryCompany", "delivery_company", "delivery_city", "delivery"] },
    { label: "Vehicle Type", col: "vehicle_type", key: "vehicleType", altKeys: ["vehicle_type", "vehicle"] },
    { label: "Load Type", col: "load_type", key: "cargoLoadType", altKeys: ["load_type", "pallet_type"] },
];

export const Step3SchemaView: React.FC<Step3SchemaViewProps> = ({
    rows,
    selectedRowIndex,
    setSelectedRowIndex,
    currentReq,
}) => {
    const getValue = (field: typeof SCHEMA_FIELDS[0]) => {
        if (currentReq?.[field.key]) return currentReq[field.key];
        for (const k of field.altKeys) {
            if (currentReq?.[k]) return currentReq[k];
        }
        return "-";
    };

    const weightVal = currentReq?.totalWeight || currentReq?.weight ? `${currentReq?.totalWeight || currentReq?.weight} KG` : "-";
    const rawBudget = currentReq?.budget || currentReq?.amount;
    const budgetVal = rawBudget ? `€${Number(String(rawBudget).replace(/[^0-9.]/g, "")).toLocaleString()}` : "-";

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <span>
                    Request <strong className="text-slate-900 dark:text-slate-100">#{selectedRowIndex + 1}</strong> of {rows.length}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={selectedRowIndex <= 0}
                        className="h-6 px-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center"
                        onClick={() => setSelectedRowIndex(prev => Math.max(0, prev - 1))}
                    >
                        <ChevronLeft size={12} />
                        <span>Prev</span>
                    </button>
                    <button
                        type="button"
                        disabled={selectedRowIndex >= rows.length - 1}
                        className="h-6 px-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-[3px] text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer inline-flex items-center"
                        onClick={() => setSelectedRowIndex(prev => Math.min(rows.length - 1, prev + 1))}
                    >
                        <span>Next</span>
                        <ChevronRight size={12} />
                    </button>
                </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-[3px] overflow-hidden bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[10.5px]">
                            <th className="py-2 px-3">Field Name</th>
                            <th className="py-2 px-3">Mapped Column</th>
                            <th className="py-2 px-3">Extracted Value</th>
                            <th className="py-2 px-3 text-right w-20">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11.5px] text-slate-700 dark:text-slate-300">
                        {SCHEMA_FIELDS.map((f) => (
                            <tr key={f.label}>
                                <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">{f.label}</td>
                                <td className="py-2 px-3 text-slate-400 font-mono text-[10.5px]">{f.col}</td>
                                <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{getValue(f)}</td>
                                <td className="py-2 px-3 text-right">
                                    <span className="text-emerald-700 dark:text-emerald-400 text-[10.5px] font-medium inline-flex items-center gap-0.5">
                                        <Check size={11} /> Mapped
                                    </span>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">Total Weight</td>
                            <td className="py-2 px-3 text-slate-400 font-mono text-[10.5px]">total_weight</td>
                            <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{weightVal}</td>
                            <td className="py-2 px-3 text-right">
                                <span className="text-emerald-700 dark:text-emerald-400 text-[10.5px] font-medium inline-flex items-center gap-0.5">
                                    <Check size={11} /> Mapped
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">Target Budget</td>
                            <td className="py-2 px-3 text-slate-400 font-mono text-[10.5px]">budget</td>
                            <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100">{budgetVal}</td>
                            <td className="py-2 px-3 text-right">
                                <span className="text-emerald-700 dark:text-emerald-400 text-[10.5px] font-medium inline-flex items-center gap-0.5">
                                    <Check size={11} /> Mapped
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
