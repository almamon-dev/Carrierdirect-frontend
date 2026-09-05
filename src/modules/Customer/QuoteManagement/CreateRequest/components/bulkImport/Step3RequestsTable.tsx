import React from "react";
import { Eye } from "lucide-react";

interface Step3RequestsTableProps {
    rows: any[];
    selectedRowIndex: number;
    setSelectedRowIndex: (idx: number) => void;
    onViewSchema: (idx: number) => void;
}

export const Step3RequestsTable: React.FC<Step3RequestsTableProps> = ({
    rows,
    selectedRowIndex,
    setSelectedRowIndex,
    onViewSchema,
}) => {
    return (
        <div className="border border-slate-200 dark:border-slate-800 rounded-[3px] overflow-hidden bg-white dark:bg-slate-900">
            <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 z-10 bg-slate-50/90 dark:bg-slate-800/80 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[10.5px]">
                        <tr>
                            <th className="py-2 px-2.5 text-center w-8">#</th>
                            <th className="py-2 px-3">Title / Shipment</th>
                            <th className="py-2 px-3">Origin</th>
                            <th className="py-2 px-3">Destination</th>
                            <th className="py-2 px-2.5">Vehicle</th>
                            <th className="py-2 px-2 text-center">Items</th>
                            <th className="py-2 px-3 text-right">Budget</th>
                            <th className="py-2 px-2 text-center w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11.5px]">
                        {rows.map((row: any, idx: number) => {
                            const isSelected = selectedRowIndex === idx;
                            const title = row.requestTitle || row.title || row.request_title || `Quote Request #${idx + 1}`;
                            const pickupStr = row.pickupCity || row.pickup_city || row.pickupCompany || row.pickup_company || row.pickup || "-";
                            const deliveryStr = row.deliveryCity || row.delivery_city || row.deliveryCompany || row.delivery_company || row.delivery || "-";
                            const vehicle = row.vehicleType || row.vehicle_type || row.vehicle || "-";
                            const rawBudget = row.budget || row.amount || "";
                            const budgetNum = Number(String(rawBudget).replace(/[^0-9.]/g, ""));
                            const itemsCount = row.items?.length || row.items_count || row.itemsCount || 1;

                            return (
                                <tr
                                    key={row.id || idx}
                                    className={`transition-colors cursor-pointer ${
                                        isSelected 
                                            ? "bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-medium" 
                                            : "hover:bg-slate-50/70 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                                    }`}
                                    onClick={() => setSelectedRowIndex(idx)}
                                >
                                    <td className="py-2 px-2.5 text-center text-slate-400 font-mono text-[10.5px]">
                                        {idx + 1}
                                    </td>
                                    <td className="py-2 px-3 max-w-[200px] truncate font-medium text-slate-900 dark:text-slate-100">
                                        {title}
                                    </td>
                                    <td className="py-2 px-3 max-w-[130px] truncate text-slate-600 dark:text-slate-400">
                                        {pickupStr}
                                    </td>
                                    <td className="py-2 px-3 max-w-[130px] truncate text-slate-600 dark:text-slate-400">
                                        {deliveryStr}
                                    </td>
                                    <td className="py-2 px-2.5 whitespace-nowrap text-slate-600 dark:text-slate-400 text-[11px]">
                                        {vehicle}
                                    </td>
                                    <td className="py-2 px-2 text-center text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                                        {itemsCount} {itemsCount === 1 ? "item" : "items"}
                                    </td>
                                    <td className="py-2 px-3 text-right font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                        {budgetNum > 0 ? `€${budgetNum.toLocaleString()}` : "-"}
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <button
                                            type="button"
                                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-[3px] transition-colors cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewSchema(idx);
                                            }}
                                        >
                                            <Eye size={13} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="px-3 py-1.5 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] flex items-center justify-between">
                <span>Showing {rows.length} extracted quote request{rows.length !== 1 ? 's' : ''}</span>
                <span>Click row to view schema</span>
            </div>
        </div>
    );
};
