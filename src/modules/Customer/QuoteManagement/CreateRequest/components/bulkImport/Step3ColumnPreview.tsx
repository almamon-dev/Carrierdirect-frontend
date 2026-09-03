import React, { useState } from "react";
import { FileText, ArrowLeft, CheckCircle2, List, Layers, Eye } from "lucide-react";

interface Step3ColumnPreviewProps {
    extractedData: any;
    processingFileName: string;
    activeRequest: any;
    onBackToStep1: () => void;
}

export const Step3ColumnPreview: React.FC<Step3ColumnPreviewProps> = ({
    extractedData,
    processingFileName,
    activeRequest,
    onBackToStep1,
}) => {
    const rows = extractedData?.rows || (extractedData ? [extractedData] : []);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
    const [previewMode, setPreviewMode] = useState<"rows" | "schema">("rows");

    if (!extractedData && !processingFileName) {
        return (
            <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-sans">
                <FileText size={26} className="text-slate-400 mx-auto" />
                <h4 className="font-semibold text-slate-800 text-xs">No Document Uploaded</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Please go back to Step 1 and upload a CSV or PDF quote request file to preview mapped columns.
                </p>
                <button
                    type="button"
                    className="h-8 px-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md inline-flex items-center gap-1.5 cursor-pointer"
                    onClick={onBackToStep1}
                >
                    <ArrowLeft size={13} />
                    <span>Back to Step 1: Upload File</span>
                </button>
            </div>
        );
    }

    const currentReq = rows[selectedRowIndex] || activeRequest || {};

    return (
        <div className="space-y-3 text-xs font-sans">
            {/* Header with Stats & Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span className="font-semibold">
                            {rows.length} Shipping Quote Request{rows.length !== 1 ? "s" : ""} Extracted
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {rows.length} Ready
                    </span>
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-md self-start sm:self-auto">
                    <button
                        type="button"
                        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                            previewMode === "rows"
                                ? "bg-white text-slate-900 shadow-xs font-semibold"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                        onClick={() => setPreviewMode("rows")}
                    >
                        <List size={12} />
                        <span>All Requests Table ({rows.length})</span>
                    </button>
                    <button
                        type="button"
                        className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                            previewMode === "schema"
                                ? "bg-white text-slate-900 shadow-xs font-semibold"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                        onClick={() => setPreviewMode("schema")}
                    >
                        <Layers size={12} />
                        <span>Schema Mapping</span>
                    </button>
                </div>
            </div>

            {/* View 1: All Extracted Requests Table */}
            {previewMode === "rows" && (
                <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs">
                    <div className="max-h-[320px] overflow-y-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead className="sticky top-0 z-10 bg-slate-100/95 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                                <tr>
                                    <th className="py-2 px-2.5 text-center w-10">#</th>
                                    <th className="py-2 px-3">Title / Shipment</th>
                                    <th className="py-2 px-3">Pickup</th>
                                    <th className="py-2 px-3">Delivery</th>
                                    <th className="py-2 px-2.5">Vehicle</th>
                                    <th className="py-2 px-2.5 text-center">Items</th>
                                    <th className="py-2 px-2.5 text-right">Budget</th>
                                    <th className="py-2 px-2.5 text-center w-16">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 text-[11.5px]">
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
                                                isSelected ? "bg-amber-50/60 font-medium" : "hover:bg-slate-50"
                                            }`}
                                            onClick={() => setSelectedRowIndex(idx)}
                                        >
                                            <td className="py-2 px-2.5 text-center text-slate-500 font-mono text-[11px]">
                                                {idx + 1}
                                            </td>
                                            <td className="py-2 px-3 max-w-[200px] truncate font-medium text-slate-900" title={title}>
                                                {title}
                                            </td>
                                            <td className="py-2 px-3 max-w-[130px] truncate text-slate-600" title={pickupStr}>
                                                {pickupStr}
                                            </td>
                                            <td className="py-2 px-3 max-w-[130px] truncate text-slate-600" title={deliveryStr}>
                                                {deliveryStr}
                                            </td>
                                            <td className="py-2 px-2.5 whitespace-nowrap text-slate-600 text-[11px]">
                                                {vehicle}
                                            </td>
                                            <td className="py-2 px-2.5 text-center whitespace-nowrap">
                                                <span className="bg-slate-100 text-slate-700 font-medium px-1.5 py-0.5 rounded text-[10.5px]">
                                                    {itemsCount} {itemsCount === 1 ? "item" : "items"}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2.5 text-right font-semibold text-slate-900 whitespace-nowrap">
                                                {budgetNum > 0 ? `€${budgetNum.toLocaleString()}` : "-"}
                                            </td>
                                            <td className="py-2 px-2.5 text-center">
                                                <button
                                                    type="button"
                                                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded"
                                                    title="View Field Schema"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRowIndex(idx);
                                                        setPreviewMode("schema");
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
                    <div className="p-2 bg-slate-50/90 border-t border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                        <span>Showing {rows.length} of {rows.length} extracted quote request(s)</span>
                        <span className="text-emerald-700 font-medium">Click any row to inspect schema details</span>
                    </div>
                </div>
            )}

            {/* View 2: Schema Mapping for Selected Row */}
            {previewMode === "schema" && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                        <span>
                            Viewing Schema for: <strong className="text-slate-900">Request #{selectedRowIndex + 1}</strong> of {rows.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={selectedRowIndex <= 0}
                                className="px-2 py-0.5 border border-slate-300 rounded text-slate-700 disabled:opacity-40 hover:bg-white cursor-pointer"
                                onClick={() => setSelectedRowIndex(prev => Math.max(0, prev - 1))}
                            >
                                ← Prev
                            </button>
                            <span className="font-mono text-[10.5px] px-1.5">{selectedRowIndex + 1}/{rows.length}</span>
                            <button
                                type="button"
                                disabled={selectedRowIndex >= rows.length - 1}
                                className="px-2 py-0.5 border border-slate-300 rounded text-slate-700 disabled:opacity-40 hover:bg-white cursor-pointer"
                                onClick={() => setSelectedRowIndex(prev => Math.min(rows.length - 1, prev + 1))}
                            >
                                Next →
                            </button>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-[11.5px]">
                                    <th className="py-2 px-3">Field Name</th>
                                    <th className="py-2 px-3">Mapped Column</th>
                                    <th className="py-2 px-3">Extracted Value</th>
                                    <th className="py-2 px-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                <tr>
                                    <td className="py-2 px-3 font-medium text-slate-900">Request Title</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">Title / Name</td>
                                    <td className="py-2 px-3 font-semibold text-slate-900">
                                        {currentReq?.requestTitle || currentReq?.title || currentReq?.request_title || "-"}
                                    </td>
                                    <td className="py-2 px-3 text-right"><span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">✓ Mapped</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-slate-900">Pickup Location</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">Pickup Location / Origin</td>
                                    <td className="py-2 px-3 font-medium">
                                        {currentReq?.pickupAddress || currentReq?.pickup_address || currentReq?.pickupCompany || currentReq?.pickup_company || currentReq?.pickup_city || currentReq?.pickup || "-"}
                                    </td>
                                    <td className="py-2 px-3 text-right"><span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">✓ Mapped</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-slate-900">Delivery Location</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">Delivery Location / Destination</td>
                                    <td className="py-2 px-3 font-medium">
                                        {currentReq?.deliveryAddress || currentReq?.delivery_address || currentReq?.deliveryCompany || currentReq?.delivery_company || currentReq?.delivery_city || currentReq?.delivery || "-"}
                                    </td>
                                    <td className="py-2 px-3 text-right"><span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">✓ Mapped</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-slate-900">Vehicle Type</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">Vehicle Type / Vehicle</td>
                                    <td className="py-2 px-3 font-medium">
                                        {currentReq?.vehicleType || currentReq?.vehicle_type || currentReq?.vehicle || "-"}
                                    </td>
                                    <td className="py-2 px-3 text-right"><span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">✓ Mapped</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-slate-900">Load Type</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">Load Type / Cargo Type</td>
                                    <td className="py-2 px-3 font-medium">
                                        {currentReq?.cargoLoadType || currentReq?.load_type || currentReq?.pallet_type || "-"}
                                    </td>
                                    <td className="py-2 px-3 text-right"><span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">✓ Mapped</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-slate-900">Weight</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">Weight / Total Weight</td>
                                    <td className="py-2 px-3 font-medium">
                                        {currentReq?.totalWeight || currentReq?.weight ? `${currentReq?.totalWeight || currentReq?.weight} KG` : "-"}
                                    </td>
                                    <td className="py-2 px-3 text-right"><span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">✓ Mapped</span></td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-3 font-medium text-slate-900">Target Budget</td>
                                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">Budget / Target Price</td>
                                    <td className="py-2 px-3 font-semibold text-slate-900">
                                        {currentReq?.budget || currentReq?.amount ? `€${Number(String(currentReq?.budget || currentReq?.amount).replace(/[^0-9.]/g, "")).toLocaleString()}` : "-"}
                                    </td>
                                    <td className="py-2 px-3 text-right"><span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">✓ Mapped</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
