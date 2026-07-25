import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    Eye, Edit, Plus, Activity, MoreHorizontal, FileDown, Copy, XCircle, 
    Trash2, Sparkles, FileSpreadsheet, 
    FileText, CheckCircle2, Download, ChevronDown, Paperclip,
    Upload, ArrowRight, ArrowLeft, FileArchive, Layers, MapPin, Truck, Euro
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { downloadCSVTemplate, downloadPDFTemplate, downloadSpecSheet } from './utils/templateHelpers';
import { PdfImportWizardModal } from './components/PdfImportWizardModal';

const initialMockData = [
    { 
        id: 'REQ-9234', date: '2026-07-20', type: 'FTL', 
        pickup: 'Dhaka', delivery: 'Chittagong', 
        load: 'Pallets', vehicle: 'Covered Van', weight: '15 Tons',
        status: 'Draft', quotesReceived: 0, contacted: 0, lowestBid: null, expiresIn: null,
        suppliersList: [], hasNew: false
    },
    { 
        id: 'REQ-9233', date: '2026-07-19', type: 'LTL', 
        pickup: 'Sylhet', delivery: 'Rajshahi', 
        load: 'Boxes', vehicle: 'Open Truck', weight: '5 Tons',
        status: 'Bidding Active', quotesReceived: 3, contacted: 15, lowestBid: 42500, expiresIn: '1d 4h',
        suppliersList: ['Express Logistics', 'Prime Movers', 'Fast Track BD'], hasNew: true
    },
    { 
        id: 'REQ-9230', date: '2026-07-18', type: 'FTL',
        pickup: 'Chittagong', delivery: 'Dhaka', 
        load: 'Container', vehicle: 'Trailer', weight: '22 Tons',
        status: 'Negotiating', quotesReceived: 4, contacted: 12, lowestBid: 48000, expiresIn: 'Ended',
        suppliersList: ['Global Transport', 'Speedy Cargo', 'BD Logistics', 'TransCom'], hasNew: false
    },
    { 
        id: 'REQ-9105', date: '2026-07-15', type: 'Heavy Haul',
        pickup: 'Khulna', delivery: 'Dhaka', 
        load: 'Machinery', vehicle: 'Flatbed', weight: '35 Tons',
        status: 'Accepted', quotesReceived: 6, contacted: 20, lowestBid: 85000, expiresIn: 'Ended',
        suppliersList: ['HeavyHaul BD', 'Prime Movers'], hasNew: false
    },
];

export default function RequestList() {
    const navigate = useNavigate();
    const [requestData, setRequestData] = useState(initialMockData);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [activeFilterTab, setActiveFilterTab] = useState('All');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const csvInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const zipInputRef = useRef<HTMLInputElement>(null);

    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
    const [processingStep, setProcessingStep] = useState<1 | 2 | 3 | 4>(1);
    const [processingFileName, setProcessingFileName] = useState('Shipping_Request_Order_Batch.pdf');
    const [uploadedZipName, setUploadedZipName] = useState('');
    const [processingFileType, setProcessingFileType] = useState<'csv' | 'pdf'>('pdf');
    const [extractedData, setExtractedData] = useState<any>(null);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const [previewSubTab, setPreviewSubTab] = useState<string>('general');

    useEffect(() => {
        const closeDropdown = () => {
            setOpenDropdown(null);
            setShowTemplateDropdown(false);
        };
        window.addEventListener('scroll', closeDropdown, true);
        window.addEventListener('resize', closeDropdown);
        return () => {
            window.removeEventListener('scroll', closeDropdown, true);
            window.removeEventListener('resize', closeDropdown);
        };
    }, []);

    const handleDownloadCSVTemplate = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowTemplateDropdown(false);
        downloadCSVTemplate();
    };

    const handleDownloadPDFTemplate = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowTemplateDropdown(false);
        downloadPDFTemplate();
    };

    const handleDownloadSpecSheet = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowTemplateDropdown(false);
        downloadSpecSheet();
    };

    const openImportWizard = (type: 'csv' | 'pdf' = 'pdf') => {
        setProcessingFileType(type);
        setProcessingFileName(type === 'csv' ? 'GetItMoving_Quote_Request_Batch.csv' : 'Shipping_Request_Order_Batch.pdf');
        setProcessingStep(1);
        setIsProcessingModalOpen(true);
        
        if (!extractedData) {
            setExtractedData({
                id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
                requestTitle: `AI Imported: Shipping_Request_Order_Batch - Gazipur to Chittagong`,
                date: new Date().toISOString().split('T')[0],
                type: 'FTL',
                pickup: 'Dhaka (Gazipur)',
                delivery: 'Chittagong Port',
                load: '10 Pallets (Machinery Parts)',
                vehicle: 'Covered Van (20ft)',
                weight: '2,500 KG',
                status: 'Bidding Active',
                quotesReceived: 0,
                contacted: 12,
                lowestBid: null,
                expiresIn: '2d 0h',
                suppliersList: [],
                hasNew: true,
                amount: '48,000',
                rows: [
                    { title: 'Item 1: 5 Pallets Machinery Parts - Gazipur to Chittagong', pickup: 'Dhaka (Gazipur)', delivery: 'Chittagong Port', vehicle: 'Covered Van (20ft)', load: '5 Pallets (2,500 KG)', amount: '48,000' },
                    { title: 'Item 2: 50 Cartons Consumer Electronics - Dhaka to Rajshahi', pickup: 'Dhaka (Banani)', delivery: 'Rajshahi City', vehicle: 'Open Truck (14ft)', load: '50 Boxes (1,200 KG)', amount: '32,500' },
                    { title: 'Item 3: 20 Wooden Crates Auto Parts - Narayanganj to Khulna', pickup: 'Narayanganj', delivery: 'Khulna EPZ', vehicle: 'Covered Truck (24ft)', load: '20 Crates (4,100 KG)', amount: '54,000' },
                    { title: 'Item 4: 10 Drums Industrial Chemical - Chittagong to Bogra', pickup: 'Chittagong EPZ', delivery: 'Bogra Depot', vehicle: 'Hazmat Truck (18ft)', load: '10 Drums (1,800 KG)', amount: '41,000' },
                    { title: 'Item 5: 100 Garment Fabric Rolls - Savar to Comilla Hub', pickup: 'Savar EPZ', delivery: 'Comilla Hub', vehicle: 'Covered Van (20ft)', load: '100 Rolls (3,200 KG)', amount: '38,000' },
                    { title: 'Item 6: 15 Pallets Medical Supplies - Dhaka to Sylhet Depot', pickup: 'Dhaka (Tejgaon)', delivery: 'Sylhet Depot', vehicle: 'Reefer Van (20ft)', load: '15 Pallets (2,100 KG)', amount: '46,500' },
                    { title: 'Item 7: 8 Heavy Equipment Valves - Gazipur to Barisal Port', pickup: 'Gazipur EPZ', delivery: 'Barisal Port', vehicle: 'Trailer Truck (40ft)', load: '8 Valves (8,500 KG)', amount: '75,000' },
                    { title: 'Item 8: 30 Boxes Solar Panel Inverters - Tongi to Rangpur', pickup: 'Tongi Industrial Area', delivery: 'Rangpur City', vehicle: 'Open Truck (18ft)', load: '30 Boxes (2,400 KG)', amount: '42,000' },
                    { title: 'Item 9: 12 Pallets Beverage Bottles - Mymensingh to Dhaka', pickup: 'Mymensingh', delivery: 'Dhaka (Dhanmondi)', vehicle: 'Covered Van (20ft)', load: '12 Pallets (3,600 KG)', amount: '29,000' },
                    { title: 'Item 10: 4 Wooden Cases Generator Spares - Chittagong to Jessore', pickup: 'Chittagong Port', delivery: 'Jessore Hub', vehicle: 'Covered Truck (24ft)', load: '4 Cases (5,200 KG)', amount: '62,000' }
                ]
            });
        }
    };

    const triggerFileSelect = (type: 'csv' | 'pdf') => {
        openImportWizard(type);
    };

    const startAIProcessing = (file: File, type: 'csv' | 'pdf') => {
        setProcessingFileName(file.name);
        setProcessingFileType(type);
        openImportWizard(type);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'pdf') => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setProcessingFileName(files[0].name);
            openImportWizard(type);
        }
        e.target.value = '';
    };

    const handleConfirmImport = () => {
        if (extractedData) {
            if (extractedData.rows && extractedData.rows.length > 0) {
                const newItems = extractedData.rows.map((row: any, i: number) => ({
                    id: `REQ-${Math.floor(1000 + Math.random() * 9000 + i)}`,
                    requestTitle: row.title,
                    date: new Date().toISOString().split('T')[0],
                    type: 'FTL',
                    pickup: row.pickup,
                    delivery: row.delivery,
                    load: row.load,
                    vehicle: row.vehicle,
                    weight: row.load,
                    status: 'Bidding Active',
                    quotesReceived: 0,
                    contacted: 12,
                    lowestBid: null,
                    expiresIn: '2d 0h',
                    suppliersList: [],
                    hasNew: true,
                    amount: row.amount
                }));
                setRequestData(prev => [...newItems, ...prev]);
            } else {
                setRequestData(prev => [extractedData, ...prev]);
            }
            setIsProcessingModalOpen(false);
        }
    };

    const handleOpenInForm = () => {
        if (extractedData) {
            setIsProcessingModalOpen(false);
            navigate('/customer/quotes/create/new', { state: { repeatData: extractedData } });
        }
    };

    const FilterTabs = () => {
        const tabs = [
            { id: 'All', label: 'All', count: requestData.length + 8 },
            { id: 'Active', label: 'Active', count: 7 },
            { id: 'Waiting', label: 'Waiting Quotes', count: 4 },
            { id: 'Review', label: 'To Review', count: 18 },
            { id: 'Accepted', label: 'Accepted', count: 5 },
        ];

        return (
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar mb-[-1px]">
                {tabs.map((tab) => {
                    const isActive = activeFilterTab === tab.id;
                    return (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveFilterTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${isActive ? 'border-[#008060] text-[#008060]' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
                        >
                            <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                            <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-[#eaf5f0] text-[#008060]' : 'bg-slate-100 text-slate-500'}`}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    };

    const columns: Column<any>[] = [
        { 
            id: 'id', 
            label: 'Request', 
            render: (row) => (
                <span className="text-brand font-semibold whitespace-nowrap flex items-center gap-2">
                    {row.id}
                    {row.hasNew && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="New activity"></span>}
                </span>
            ) 
        },
        { 
            id: 'date', 
            label: 'Date', 
            render: (row) => <span className="text-[13px] text-slate-500 whitespace-nowrap">{row.date}</span>
        },
        { 
            id: 'type', 
            label: 'Type', 
            render: (row) => <span className="text-[13px] font-medium text-slate-700">{row.type}</span>
        },
        { 
            id: 'pickup', 
            label: 'Route', 
            render: (row) => (
                <div className="text-[13px] whitespace-nowrap">
                    <span className="font-semibold text-slate-900">{row.pickup}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="font-semibold text-slate-900">{row.delivery}</span>
                </div>
            ) 
        },
        { 
            id: 'load', 
            label: 'Load / Cargo', 
            render: (row) => (
                <div className="text-[13px] whitespace-nowrap">
                    <span className="font-medium text-slate-800">{row.load}</span>
                    <span className="text-slate-400 text-xs ml-1">({row.weight})</span>
                </div>
            ) 
        },
        { 
            id: 'vehicle', 
            label: 'Vehicle', 
            render: (row) => <span className="text-[13px] text-slate-600 whitespace-nowrap">{row.vehicle}</span>
        },
        { 
            id: 'quotesReceived', 
            label: 'Quotes', 
            render: (row) => (
                <span className={`text-[13px] font-bold ${row.quotesReceived > 0 ? 'text-brand' : 'text-slate-400'}`}>
                    {row.quotesReceived} Bids
                </span>
            ) 
        },
        { 
            id: 'status', 
            label: 'Status',
            render: (row) => {
                let variant: any = 'default';
                if (row.status === 'Draft') variant = 'secondary';
                if (row.status === 'Bidding Active') variant = 'info';
                if (row.status === 'Negotiating') variant = 'warning';
                if (row.status === 'Accepted') variant = 'success';
                
                return (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <Badge variant={variant}>{row.status}</Badge>
                        {row.expiresIn && row.expiresIn !== 'Ended' && (
                            <span className="text-[11px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                {row.expiresIn}
                            </span>
                        )}
                    </div>
                );
            }
        }
    ];

    const actions = (row: any) => (
        <div className="flex items-center justify-end gap-2 relative">
            {row.status !== 'Draft' ? (
                <Button variant="primary" size="sm" className="h-7 px-3 bg-brand hover:bg-brand-hover" onClick={(e) => { e.stopPropagation(); navigate('/customer/quotes/received'); }}>
                    <Activity size={14} className="mr-1.5" /> Track Bids
                </Button>
            ) : (
                <Button variant="outline" size="sm" className="h-7 px-3 border-indigo-200 text-indigo-700 hover:bg-brand-light" onClick={(e) => { e.stopPropagation(); navigate(`/customer/quotes/create/edit/${row.id}`); }}>
                    <Edit size={14} className="mr-1.5" /> Edit Draft
                </Button>
            )}

            <div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-slate-500 border-slate-200"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (openDropdown === row.id) {
                            setOpenDropdown(null);
                        } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setDropdownPos({
                                top: rect.bottom + 4,
                                left: rect.right - 160
                            });
                            setOpenDropdown(row.id);
                        }
                    }}
                >
                    <MoreHorizontal size={14} />
                </Button>

                {openDropdown === row.id && createPortal(
                    <div 
                        className="fixed w-40 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => { setOpenDropdown(null); navigate(`/customer/quotes/create/view/${row.id}`); }}>
                            <Eye size={14} className="text-slate-400" /> View Details
                        </button>
                        <button 
                            className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium" 
                            onClick={() => { 
                                setOpenDropdown(null); 
                                navigate('/customer/quotes/create/new', { state: { repeatData: row } }); 
                            }}
                        >
                            <Copy size={14} className="text-blue-500" /> Repeat Request
                        </button>
                        <button className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                            <FileDown size={14} className="text-slate-400" /> Download PDF
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        {row.status === 'Bidding Active' ? (
                            <button className="w-full text-left px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                                <XCircle size={14} className="text-red-500" /> Cancel Request
                            </button>
                        ) : (
                            <button className="w-full text-left px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                                <Trash2 size={14} className="text-red-500" /> Delete
                            </button>
                        )}
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen" onClick={() => { setOpenDropdown(null); setShowTemplateDropdown(false); }}>
            
            <input 
                type="file" 
                ref={csvInputRef} 
                className="hidden" 
                accept=".csv" 
                onChange={(e) => handleFileChange(e, 'csv')} 
            />
            <input 
                type="file" 
                ref={pdfInputRef} 
                className="hidden" 
                accept=".pdf,.csv,.doc,.docx" 
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        setProcessingFileName(e.target.files[0].name);
                    }
                }} 
            />
            <input 
                type="file" 
                ref={zipInputRef} 
                className="hidden" 
                accept=".zip,.rar,.7z" 
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        setUploadedZipName(e.target.files[0].name);
                    }
                }} 
            />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Quote Requests</h1>
                    <p className="text-sm text-slate-500">Manage, track, or import transportation quote requests.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    
                    <div className="relative">
                        <Button 
                            variant="outline" 
                            size="sm"
                            className="h-9 px-3 text-xs font-semibold text-slate-700 bg-white border-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowTemplateDropdown(!showTemplateDropdown);
                            }}
                        >
                            <Download size={14} className="text-slate-500" />
                            <span>Download Template</span>
                            <ChevronDown size={13} className="text-slate-400 ml-0.5" />
                        </Button>

                        {showTemplateDropdown && (
                            <div className="absolute right-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Format</div>
                                <button 
                                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                                    onClick={handleDownloadCSVTemplate}
                                >
                                    <FileSpreadsheet size={15} className="text-emerald-600" />
                                    <div>
                                        <div className="font-bold text-slate-900">CSV Template</div>
                                        <div className="text-[11px] text-slate-500">Formatted spreadsheet table</div>
                                    </div>
                                </button>
                                <button 
                                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium border-t border-slate-100"
                                    onClick={handleDownloadPDFTemplate}
                                >
                                    <FileText size={15} className="text-red-500" />
                                    <div>
                                        <div className="font-bold text-slate-900">PDF Template</div>
                                        <div className="text-[11px] text-slate-500">Standard PDF request form</div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-3 text-xs font-semibold border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1.5 shadow-2xs"
                        onClick={() => triggerFileSelect('csv')}
                    >
                        <FileSpreadsheet size={14} className="text-emerald-600" />
                        <span>Upload CSV</span>
                    </Button>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 px-3 text-xs font-bold border-purple-300 text-purple-900 bg-purple-50 hover:bg-purple-100 flex items-center gap-1.5 shadow-2xs"
                        onClick={() => openImportWizard('pdf')}
                    >
                        <Sparkles size={14} className="text-purple-600 animate-pulse" />
                        <span>Upload PDF / ZIP Bundle</span>
                    </Button>

                    <Button 
                        variant="primary" 
                        size="sm" 
                        className="h-9 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                        onClick={() => navigate('/customer/quotes/create/new')}
                    >
                        <Plus size={15} />
                        <span>Create New Request</span>
                    </Button>

                </div>
            </div>
            
            <DataTable 
                data={requestData} 
                columns={columns} 
                actions={actions}
                headerTabs={<FilterTabs />}
                searchPlaceholder="Search by ID or Route (e.g. Dhaka)..."
                compact={true}
            />

            {/* Modular 4-Step PDF & ZIP Import Wizard Modal */}
            <PdfImportWizardModal 
                isOpen={isProcessingModalOpen}
                onClose={() => setIsProcessingModalOpen(false)}
                processingStep={processingStep}
                setProcessingStep={setProcessingStep}
                processingFileName={processingFileName}
                uploadedZipName={uploadedZipName}
                extractedData={extractedData}
                pdfInputRef={pdfInputRef}
                zipInputRef={zipInputRef}
                onConfirmImport={handleConfirmImport}
                onOpenInForm={handleOpenInForm}
            />

        </div>
    );
}
