import React, { useState } from "react";
import { FileText, ArrowLeft } from "lucide-react";
import { Step3RequestsTable } from "./Step3RequestsTable";
import { Step3SchemaView } from "./Step3SchemaView";

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
            <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-[3px] space-y-2 font-sans">
                <FileText size={24} className="text-slate-400 mx-auto" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs">No File Uploaded</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Please upload a CSV or PDF file in Step 2 to preview extracted quote requests.
                </p>
                <button
                    type="button"
                    className="h-8 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 rounded-[3px] inline-flex items-center gap-1.5 cursor-pointer mt-2"
                    onClick={onBackToStep1}
                >
                    <ArrowLeft size={13} />
                    <span>Back to Upload</span>
                </button>
            </div>
        );
    }

    const currentReq = rows[selectedRowIndex] || activeRequest || {};

    return (
        <div className="space-y-2.5 text-xs font-sans">
            <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight">Extracted Requests</span>
                    <span className="text-[10.5px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-[3px]">
                        {rows.length} {rows.length === 1 ? 'order' : 'orders'}
                    </span>
                </div>

                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-[3px] text-[11px]">
                    <button
                        type="button"
                        className={`px-2.5 py-1 font-semibold rounded-[3px] transition-all cursor-pointer ${
                            previewMode === "rows"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                        onClick={() => setPreviewMode("rows")}
                    >
                        Table ({rows.length})
                    </button>
                    <button
                        type="button"
                        className={`px-2.5 py-1 font-semibold rounded-[3px] transition-all cursor-pointer ${
                            previewMode === "schema"
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                        onClick={() => setPreviewMode("schema")}
                    >
                        Schema Details
                    </button>
                </div>
            </div>

            {previewMode === "rows" && (
                <Step3RequestsTable
                    rows={rows}
                    selectedRowIndex={selectedRowIndex}
                    setSelectedRowIndex={setSelectedRowIndex}
                    onViewSchema={(idx) => {
                        setSelectedRowIndex(idx);
                        setPreviewMode("schema");
                    }}
                />
            )}

            {previewMode === "schema" && (
                <Step3SchemaView
                    rows={rows}
                    selectedRowIndex={selectedRowIndex}
                    setSelectedRowIndex={setSelectedRowIndex}
                    currentReq={currentReq}
                />
            )}
        </div>
    );
};
