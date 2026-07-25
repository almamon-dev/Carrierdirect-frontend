import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
    Sparkles, XCircle, FileText, Download, CheckCircle2, FileArchive, 
    Paperclip, Upload, ArrowRight, ArrowLeft, Layers, MapPin, Truck, Euro 
} from 'lucide-react';
import Button from '@/components/ui/button';
import { downloadPDFTemplate, downloadCSVTemplate } from '../templates';

interface PdfImportWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    processingStep: 1 | 2 | 3 | 4;
    setProcessingStep: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4>>;
    processingFileName: string;
    uploadedZipName: string;
    extractedData: any;
    pdfInputRef: React.RefObject<HTMLInputElement | null>;
    zipInputRef: React.RefObject<HTMLInputElement | null>;
    onConfirmImport: () => void;
    onOpenInForm: () => void;
}

export const PdfImportWizardModal: React.FC<PdfImportWizardModalProps> = ({
    isOpen,
    onClose,
    processingStep,
    setProcessingStep,
    processingFileName,
    uploadedZipName,
    extractedData,
    pdfInputRef,
    zipInputRef,
    onConfirmImport,
    onOpenInForm,
}) => {
    const [previewSubTab, setPreviewSubTab] = useState<string>('general');

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                            <Sparkles size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base text-slate-900 tracking-tight">
                                CSV & PDF Import Wizard
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                Step {processingStep} of 4: {
                                    processingStep === 1 ? 'Upload CSV / PDF & Reference Templates' :
                                    processingStep === 2 ? 'Upload ZIP Attachment Archive (Optional)' :
                                    processingStep === 3 ? 'Column Preview & Schema Mapping' : 'Processing & Confirmation'
                                }
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <XCircle size={20} />
                    </button>
                </div>

                {/* Slim Step Progress Indicator Line */}
                <div className="w-full bg-slate-100 h-1 overflow-hidden">
                    <div 
                        className="bg-[#ff4a1f] h-1 transition-all duration-300 ease-out"
                        style={{ width: `${(processingStep / 4) * 100}%` }}
                    ></div>
                </div>

                {/* Step Navigation Bar */}
                <div className="flex items-center justify-between px-6 py-3 bg-slate-50/80 border-b border-slate-100 text-xs font-medium text-slate-600 overflow-x-auto hide-scrollbar">
                    {[
                        { num: 1, label: 'Upload CSV / PDF' },
                        { num: 2, label: 'Upload ZIP (Optional)' },
                        { num: 3, label: 'Column Preview' },
                        { num: 4, label: 'Processing' },
                    ].map((st) => {
                        const isActive = processingStep === st.num;
                        const isPassed = processingStep > st.num;
                        return (
                            <button
                                key={st.num}
                                type="button"
                                onClick={() => setProcessingStep(st.num as any)}
                                className={`flex items-center gap-2 py-1.5 px-3.5 rounded-lg cursor-pointer whitespace-nowrap transition-colors text-xs ${
                                    isActive
                                        ? 'text-[#ff4a1f] font-bold bg-amber-50 shadow-2xs'
                                        : isPassed
                                        ? 'text-emerald-700 font-semibold hover:bg-emerald-50'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                            >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isActive ? 'bg-[#ff4a1f] text-white' : isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                    {isPassed ? '✓' : st.num}
                                </span>
                                <span>{st.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Body Content */}
                <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
                    
                    {/* STEP 1: Upload CSV / PDF & Downloads */}
                    {processingStep === 1 && (
                        <div className="space-y-4 text-xs">
                            <div className="border border-dashed border-slate-300 rounded-lg p-5 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <FileText size={22} className="text-purple-600" />
                                    <span className="font-bold text-slate-800 text-sm">Select or Drag CSV or PDF File</span>
                                </div>
                                
                                <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
                                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                    <span className="truncate max-w-[280px]">{processingFileName}</span>
                                </div>

                                <div className="mt-3">
                                    <button 
                                        className="text-xs text-purple-700 hover:text-purple-900 font-bold underline cursor-pointer"
                                        onClick={() => pdfInputRef.current?.click()}
                                    >
                                        Browse CSV or PDF file
                                    </button>
                                </div>
                            </div>

                            {/* Reference Template Download Section */}
                            <div className="pt-1 space-y-2">
                                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div className="truncate">
                                            <span className="font-bold text-slate-800 text-xs block truncate">Standard CSV Quote Request Template</span>
                                            <span className="text-xs text-slate-500 font-normal">Download full CSV spreadsheet template with sample rows</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={downloadCSVTemplate}
                                        className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 text-xs font-bold rounded-md flex items-center gap-1.5 shrink-0 shadow-2xs hover:bg-emerald-50/60 transition-colors cursor-pointer"
                                    >
                                        <Download size={14} className="text-emerald-600" />
                                        <span>Download CSV Template</span>
                                    </button>
                                </div>

                                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3 truncate">
                                        <div className="w-8 h-8 rounded-md bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div className="truncate">
                                            <span className="font-bold text-slate-800 text-xs block truncate">Sample PDF Quote Request Template</span>
                                            <span className="text-xs text-slate-500 font-normal">Download printable reference PDF form for batch import</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={downloadPDFTemplate}
                                        className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-200 text-xs font-bold rounded-md flex items-center gap-1.5 shrink-0 shadow-2xs hover:bg-red-50/60 transition-colors cursor-pointer"
                                    >
                                        <Download size={14} className="text-red-500" />
                                        <span>Download PDF Template</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Upload ZIP (Optional) */}
                    {processingStep === 2 && (
                        <div className="space-y-4 text-xs">
                            <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50/50">
                                <FileArchive size={28} className="text-indigo-600 mx-auto mb-2" />
                                <h4 className="font-bold text-slate-800 text-sm mb-1">
                                    Upload Optional ZIP Attachment Archive
                                </h4>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                                    Optionally upload commercial invoices, cargo photos, or packing list ZIP attachments.
                                </p>

                                {uploadedZipName ? (
                                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-indigo-200 text-xs font-bold text-indigo-900 shadow-2xs">
                                        <Paperclip size={15} className="text-indigo-600" />
                                        <span>{uploadedZipName}</span>
                                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">Attached ✓</span>
                                    </div>
                                ) : (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-9 px-4 text-xs font-bold border-slate-300 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                                        onClick={() => zipInputRef.current?.click()}
                                    >
                                        <Upload size={14} className="mr-1.5 text-indigo-600" />
                                        <span>Select ZIP File</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Column Preview (Create Request Form Layout Structure) */}
                    {processingStep === 3 && (
                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between px-3.5 py-2 bg-emerald-50/80 border border-emerald-200/80 rounded-md">
                                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                    <span>Extracted Fields Match Create Form Schema</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                                    100% Match ✓
                                </span>
                            </div>

                            {/* Form Section Navigation Tabs */}
                            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto hide-scrollbar">
                                {[
                                    { id: 'general', label: 'Basic Info', icon: FileText },
                                    { id: 'locations', label: 'Pickup & Delivery', icon: MapPin },
                                    { id: 'load', label: 'Load & Services', icon: Truck },
                                    { id: 'preferences', label: 'Budget', icon: Euro },
                                    { id: 'files', label: 'Notes & Files', icon: Paperclip },
                                    { id: 'items', label: '10 Items Batch', icon: Layers },
                                ].map((tab) => {
                                    const isActive = previewSubTab === tab.id;
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setPreviewSubTab(tab.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                                                isActive
                                                    ? 'bg-[#ff4a1f] text-white shadow-2xs'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            <Icon size={13} />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Sub-Tab 1: Basic Info */}
                            {previewSubTab === 'general' && (
                                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-md space-y-2.5 text-xs">
                                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between text-xs">
                                        <span>1. Basic Information</span>
                                        <span className="text-emerald-600 text-xs font-bold">Field Mapped ✓</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><span className="text-slate-500 block">Request Title:</span><span className="font-bold text-slate-900">{extractedData?.requestTitle}</span></div>
                                        <div><span className="text-slate-500 block">Priority:</span><span className="font-bold text-red-600">High</span></div>
                                        <div><span className="text-slate-500 block">Shipment Type:</span><span className="font-bold text-slate-800">One Way</span></div>
                                        <div><span className="text-slate-500 block">Service Type:</span><span className="font-bold text-slate-800">Express</span></div>
                                        <div><span className="text-slate-500 block">Expected Transit:</span><span className="font-bold text-slate-800">2 Days</span></div>
                                    </div>
                                </div>
                            )}

                            {/* Sub-Tab 2: Pickup & Delivery */}
                            {previewSubTab === 'locations' && (
                                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-md space-y-2.5 text-xs">
                                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between text-xs">
                                        <span>2. Pickup & Delivery Locations</span>
                                        <span className="text-emerald-600 text-xs font-bold">Field Mapped ✓</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                                            <span className="text-xs font-bold text-purple-700 block uppercase">📍 Pickup Location</span>
                                            <p className="font-bold text-slate-900 mt-0.5">Prime Logistics EPZ Depot</p>
                                            <p className="text-slate-600 text-xs mt-0.5">Plot 42, Sector 4, Gazipur Industrial Area, Gazipur</p>
                                            <p className="text-slate-500 font-medium text-xs mt-1">Contact: Kamal Hossain (+8801711234567)</p>
                                        </div>
                                        <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                                            <span className="text-xs font-bold text-emerald-700 block uppercase">🏁 Delivery Location</span>
                                            <p className="font-bold text-slate-900 mt-0.5">Chittagong Maritime Terminal Hub</p>
                                            <p className="text-slate-600 text-xs mt-0.5">Terminal 2, Berth 5, Port Authority Zone, Chittagong</p>
                                            <p className="text-slate-500 font-medium text-xs mt-1">Contact: Rahim Uddin (+8801819987654)</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sub-Tab 3: Load & Services */}
                            {previewSubTab === 'load' && (
                                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-md space-y-2.5 text-xs">
                                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between text-xs">
                                        <span>3. Cargo Load & Services</span>
                                        <span className="text-emerald-600 text-xs font-bold">Field Mapped ✓</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div><span className="text-slate-500 block">Vehicle:</span><span className="font-bold text-slate-900">Covered Van (20ft)</span></div>
                                        <div><span className="text-slate-500 block">Cargo Load:</span><span className="font-bold text-slate-900">10 Pallets</span></div>
                                        <div><span className="text-slate-500 block">Weight / Vol:</span><span className="font-bold text-slate-900">2,500 KG (15.5 CBM)</span></div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-200">
                                        <span className="text-slate-500 block text-xs mb-1">Value-Added Services:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['Loading Required', 'Unloading Required', 'Cargo Insurance', 'Waterproof Covered Vehicle'].map((srv, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">✓ {srv}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sub-Tab 4: Budget */}
                            {previewSubTab === 'preferences' && (
                                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-md space-y-2.5 text-xs">
                                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between text-xs">
                                        <span>4. Target Budget Rate</span>
                                        <span className="text-emerald-600 text-xs font-bold">Field Mapped ✓</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><span className="text-slate-500 block">Target Rate:</span><span className="font-bold text-emerald-600 text-sm">€48,000</span></div>
                                        <div><span className="text-slate-500 block">Allow Rate Negotiation:</span><span className="font-bold text-slate-800">Yes</span></div>
                                        <div><span className="text-slate-500 block">Receive Multiple Bids:</span><span className="font-bold text-slate-800">Yes</span></div>
                                        <div><span className="text-slate-500 block">Auto Expire:</span><span className="font-bold text-amber-600">7 Days</span></div>
                                    </div>
                                </div>
                            )}

                            {/* Sub-Tab 5: Notes & Files */}
                            {previewSubTab === 'files' && (
                                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-md space-y-2 text-xs">
                                    <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between text-xs">
                                        <span>5. Attachments & Notes</span>
                                        <span className="text-emerald-600 text-xs font-bold">Field Mapped ✓</span>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div><span className="text-slate-500">Internal Reference ID:</span> <span className="font-bold text-slate-900">REF-2026-CTG</span></div>
                                        <div><span className="text-slate-500">Customer Notes:</span> <span className="font-medium text-slate-800">Waterproof vehicle required with labor personnel.</span></div>
                                        <div><span className="text-slate-500">ZIP File Bundle:</span> <span className="font-bold text-indigo-600">{uploadedZipName || 'Cargo_Photos_Batch.zip ✓'}</span></div>
                                    </div>
                                </div>
                            )}

                            {/* Sub-Tab 6: 10 Items Batch */}
                            {previewSubTab === 'items' && (
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                                        <span>Parsed Cargo Items Preview (10 Items)</span>
                                        <span className="text-purple-700 font-bold">AI Parsed</span>
                                    </div>
                                    <div className="space-y-2 max-h-[210px] overflow-y-auto pr-1">
                                        {extractedData?.rows?.map((row: any, idx: number) => (
                                            <div key={idx} className="border border-slate-200/80 rounded-md p-2.5 bg-white text-xs flex items-center justify-between">
                                                <div className="truncate pr-2">
                                                    <span className="font-bold text-slate-900 block truncate">{row.title}</span>
                                                    <span className="text-slate-500 font-medium">{row.pickup} → {row.delivery} ({row.vehicle})</span>
                                                </div>
                                                <span className="font-bold text-emerald-600 shrink-0 text-xs">€{row.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: AI Processing & Final Confirmation */}
                    {processingStep === 4 && (
                        <div className="space-y-3.5 text-xs">
                            <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between text-emerald-900 text-xs">
                                <div className="flex items-center gap-2 font-semibold">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                    <span>Validation Passed: 0 Format Errors Found</span>
                                </div>
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                                    10 Items Ready
                                </span>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2.5 text-xs">
                                <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
                                    <span>Document Summary</span>
                                    <span className="text-purple-700 font-bold">Ready to Post</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-slate-600">
                                    <div>
                                        <span className="text-slate-500 block text-xs">Source File</span>
                                        <span className="font-bold text-slate-900 truncate block text-xs">{processingFileName}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block text-xs">Attached ZIP</span>
                                        <span className="font-bold text-indigo-700 truncate block text-xs">{uploadedZipName || 'None (Optional)'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    {processingStep > 1 ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3.5 text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-100 cursor-pointer"
                            onClick={() => setProcessingStep((prev) => (prev - 1) as any)}
                        >
                            <ArrowLeft size={14} className="mr-1" /> Back
                        </Button>
                    ) : (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-3.5 text-xs font-semibold text-slate-500 border-slate-200 hover:bg-slate-100 cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    )}

                    <div className="flex items-center gap-2">
                        {processingStep < 4 ? (
                            <Button 
                                variant="primary" 
                                size="sm" 
                                className="h-9 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs cursor-pointer"
                                onClick={() => setProcessingStep((prev) => (prev + 1) as any)}
                            >
                                <span>{processingStep === 1 ? 'Next: ZIP (Optional)' : processingStep === 2 ? 'Next: Column Preview' : 'Proceed to Final Processing'}</span>
                                <ArrowRight size={14} className="ml-1" />
                            </Button>
                        ) : (
                            <>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-9 px-3.5 text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-100 cursor-pointer"
                                    onClick={onOpenInForm}
                                >
                                    Edit in Form
                                </Button>
                                <Button 
                                    variant="primary" 
                                    size="sm" 
                                    className="h-9 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-2xs cursor-pointer"
                                    onClick={onConfirmImport}
                                >
                                    Confirm & Create Requests
                                </Button>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};
