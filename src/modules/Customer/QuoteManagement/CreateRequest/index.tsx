import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    Eye, Edit, Plus, Activity, MoreHorizontal, FileDown, Copy, XCircle, 
    Trash2, Sparkles, FileSpreadsheet, 
    FileText, CheckCircle2, Download, ChevronDown, Paperclip,
    Upload, ArrowRight, ArrowLeft, FileArchive, Layers, MapPin, Truck, Euro, Clock
} from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { downloadCSVTemplate, downloadPDFTemplate, downloadSpecSheet } from './utils/templateHelpers';
import { PdfImportWizardModal } from './components/PdfImportWizardModal';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

const formatTime12h = (timeStr?: string) => {
    if (!timeStr) return '01:55 PM';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    const parts = timeStr.split(':');
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1] || '00';
    if (isNaN(hours)) return timeStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = hours < 10 ? `0${hours}` : `${hours}`;
    return `${strHours}:${minutes} ${ampm}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr === '--') return '--';
    // already formatted like "26 Jul, 2026"
    if (/[a-zA-Z]/.test(dateStr)) return dateStr;
    // ISO: YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (!isNaN(month) && !isNaN(day) && MONTHS[month]) {
            return `${day} ${MONTHS[month]}, ${year}`;
        }
    }
    return dateStr;
};

export default function RequestList() {
    const navigate = useNavigate();
    const [requestData, setRequestData] = useState<any[]>(() => {
        try {
            const cached = localStorage.getItem('customer_quote_requests_cache');
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [activeFilterTab, setActiveFilterTab] = useState('All');
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [isLoading, setIsLoading] = useState(true);

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
    const [isRepeating, setIsRepeating] = useState<string | null>(null);
    const showToast = useToastStore(state => state.showToast);

    useEffect(() => {
        async function fetchQuoteRequests() {
            try {
                const res = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS);
                const rawItems = res.data?.data || res.data || res.items || res;
                if (Array.isArray(rawItems)) {
                    const mapped = rawItems.map((q: any) => {
                        const rawTime = q.pickup_time_from || q.pickup_time || (q.created_at && q.created_at.includes('T') ? q.created_at.split('T')[1]?.substring(0, 5) : '');
                        return {
                            id: `REQ-${q.id}`,
                            date: formatDate(q.pickup_date || (q.created_at ? q.created_at.split('T')[0] : '--')),
                            time: formatTime12h(rawTime),
                            type: q.shipment_type || '--',
                            pickup: q.pickup_city || q.pickup_address || '--',
                            delivery: q.delivery_city || q.delivery_address || '--',
                            load: q.load_type || q.type_of_pallets || '--',
                            vehicle: q.vehicle_type || '--',
                            weight: q.weight ? `${q.weight} KG` : '--',
                            status: q.status === 'active' ? 'Bidding Active' : (q.status === 'pending' ? 'Draft' : (q.status || '--')),
                            quotesReceived: q.quotes_count || 0,
                            contacted: 10,
                            lowestBid: q.budget ? q.budget : null,
                            expiresIn: q.auto_expire || '2d 0h',
                            suppliersList: [],
                            hasNew: false,
                        };
                    });
                    setRequestData(mapped);
                    localStorage.setItem('customer_quote_requests_cache', JSON.stringify(mapped));
                }
            } catch {
                // Keep cached data if offline/error
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuoteRequests();

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

    const filteredData = React.useMemo(() => {
        if (activeFilterTab === 'Active') {
            return requestData.filter(r => r.status === 'Bidding Active' || r.status === 'active');
        }
        if (activeFilterTab === 'Waiting') {
            return requestData.filter(r => r.quotesReceived === 0 || r.status === 'Draft' || r.status === 'pending');
        }
        if (activeFilterTab === 'Review') {
            return requestData.filter(r => r.quotesReceived > 0 || r.status === 'Negotiating');
        }
        if (activeFilterTab === 'Accepted') {
            return requestData.filter(r => r.status === 'Accepted' || r.status === 'completed');
        }
        return requestData;
    }, [requestData, activeFilterTab]);

    const FilterTabs = () => {
        const counts = React.useMemo(() => ({
            all: requestData.length,
            active: requestData.filter(r => r.status === 'Bidding Active' || r.status === 'active').length,
            waiting: requestData.filter(r => r.quotesReceived === 0 || r.status === 'Draft' || r.status === 'pending').length,
            review: requestData.filter(r => r.quotesReceived > 0 || r.status === 'Negotiating').length,
            accepted: requestData.filter(r => r.status === 'Accepted' || r.status === 'completed').length,
        }), [requestData]);

        const tabs = [
            { id: 'All', label: 'All', count: counts.all },
            { id: 'Active', label: 'Active', count: counts.active },
            { id: 'Waiting', label: 'Waiting Quotes', count: counts.waiting },
            { id: 'Review', label: 'To Review', count: counts.review },
            { id: 'Accepted', label: 'Accepted', count: counts.accepted },
        ];

        return (
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
                {tabs.map((tab) => {
                    const isActive = activeFilterTab === tab.id;
                    return (
                        <button 
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFilterTab(tab.id)}
                            className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${isActive ? 'border-[#008060] text-[#008060]' : 'border-transparent text-slate-600 hover:text-slate-800'}`}
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
            label: 'Date & Time', 
            render: (row) => (
                <div className="text-[13px] whitespace-nowrap flex flex-col">
                    <span className="font-semibold text-slate-800">{row.date}</span>
                    {row.time && (
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock size={11} className="text-slate-400" />
                            {row.time}
                        </span>
                    )}
                </div>
            )
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

    const handleRepeatRequest = async (row: any) => {
        const rawId = String(row.id).replace('REQ-', '');
        setIsRepeating(row.id);
        setOpenDropdown(null);
        try {
            const res = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTE_REQUEST_DETAIL(rawId));
            const q = res.data?.data || res.data || res;
            const repeatData = {
                id: row.id,
                requestTitle: q.request_title ? `Repeat: ${q.request_title}` : `Repeat of ${row.id}`,
                priority: q.priority || 'High',
                shipmentType: q.shipment_type || row.type || 'One Way',
                serviceType: q.service_type || 'Express',
                pickupDate: '',
                pickupTime: q.pickup_time_from || '',
                deliveryDate: '',
                deliveryTime: q.delivery_time_from || q.delivery_time_till || '',
                expectedTransitTime: q.expected_transit_time || '',

                pickupCompany: q.pickup_company || '',
                pickupContactName: q.pickup_contact_name || '',
                pickupPhone: q.pickup_phone || '',
                pickupEmail: q.pickup_email || '',
                pickupCountry: q.pickup_country || 'Bangladesh',
                pickupState: q.pickup_state || '',
                pickupCity: q.pickup_city || row.pickup || '',
                pickupZip: q.pickup_zip || '',
                pickupAddress: q.pickup_address || '',
                pickupMapUrl: q.pickup_map_url || '',
                pickupInstructions: q.pickup_instructions || '',

                deliveryCompany: q.delivery_company || '',
                deliveryContactName: q.delivery_contact_name || '',
                deliveryPhone: q.delivery_phone || '',
                deliveryEmail: q.delivery_email || '',
                deliveryCountry: q.delivery_country || 'Bangladesh',
                deliveryState: q.delivery_state || '',
                deliveryCity: q.delivery_city || row.delivery || '',
                deliveryZip: q.delivery_zip || '',
                deliveryAddress: q.delivery_address || '',
                deliveryMapUrl: q.delivery_map_url || '',
                deliveryInstructions: q.delivery_instructions || '',

                vehicleType: q.vehicle_type || row.vehicle || '',
                loadType: q.load_type || row.load || '',
                itemsCount: q.items_count ? String(q.items_count) : '',
                palletsCount: q.pallets_count ? String(q.pallets_count) : '',
                weight: q.weight ? String(q.weight) : '',
                volume: q.volume ? String(q.volume) : '',

                stackable: Boolean(q.stackable),
                fragile: Boolean(q.fragile),
                hazardous: Boolean(q.hazardous),
                tempControlled: Boolean(q.temp_controlled),
                oversized: Boolean(q.oversized),
                perishable: Boolean(q.perishable),
                loadingRequired: Boolean(q.loading_required ?? true),
                unloadingRequired: Boolean(q.unloading_required ?? true),
                packaging: Boolean(q.packaging),
                insurance: Boolean(q.insurance ?? true),
                liftGate: Boolean(q.lift_gate),
                whiteGlove: Boolean(q.white_glove),
                assembly: Boolean(q.assembly),
                insideDelivery: Boolean(q.inside_delivery),
                storage: Boolean(q.storage),

                budget: q.budget ? String(q.budget) : '',
                currency: q.currency || '৳',
                allowNegotiation: Boolean(q.allow_negotiation ?? true),
                receiveMultiple: Boolean(q.receive_multiple ?? true),
                autoExpire: q.auto_expire || '48 Hours',

                customerNotes: q.customer_notes || '',
                specialInstructions: q.special_instructions || '',
                internalReference: `REPEAT-${row.id}`,
            };
            navigate('/customer/quotes/create/new', { state: { repeatData } });
            showToast(`Repeat request created from ${row.id}!`, 'success');
        } catch {
            // Fallback: use row data only
            navigate('/customer/quotes/create/new', { state: { repeatData: { ...row, requestTitle: `Repeat: ${row.id}`, internalReference: `REPEAT-${row.id}` } } });
            showToast(`Opened repeat request with available data.`, 'info');
        } finally {
            setIsRepeating(null);
        }
    };

    const handleDeleteRequest = async (row: any) => {
        const rawId = String(row.id).replace('REQ-', '');
        setOpenDropdown(null);
        if (!window.confirm(`Are you sure you want to delete/cancel quote request ${row.id}?`)) {
            return;
        }

        try {
            await apiClient.delete(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}`);
            setRequestData(prev => {
                const next = prev.filter(item => item.id !== row.id);
                localStorage.setItem('customer_quote_requests_cache', JSON.stringify(next));
                return next;
            });
            showToast(`Quote request ${row.id} has been cancelled/deleted.`, 'success');
        } catch (err: any) {
            // Still clean up locally if non-existent or network fallback
            setRequestData(prev => {
                const next = prev.filter(item => item.id !== row.id);
                localStorage.setItem('customer_quote_requests_cache', JSON.stringify(next));
                return next;
            });
            showToast(`Quote request ${row.id} removed.`, 'info');
        }
    };

    const handleDeleteSelected = async (selectedIds: (number | string)[]) => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected request(s)?`)) {
            return;
        }

        for (const id of selectedIds) {
            const rawId = String(id).replace('REQ-', '');
            try {
                await apiClient.delete(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}`);
            } catch {
                // Ignore single failure
            }
        }

        setRequestData(prev => {
            const next = prev.filter(item => !selectedIds.includes(item.id));
            localStorage.setItem('customer_quote_requests_cache', JSON.stringify(next));
            return next;
        });
        showToast(`${selectedIds.length} request(s) deleted.`, 'success');
    };

    const actions = (row: any) => (
        <div className="flex items-center justify-end gap-2 relative">
            {row.status !== 'Draft' && (
                <Button variant="primary" size="sm" className="h-7 px-3 bg-brand hover:bg-brand-hover" onClick={(e) => { e.stopPropagation(); navigate('/customer/quotes/received'); }}>
                    <Activity size={14} className="mr-1.5" /> Track Bids
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
                        <button className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => { setOpenDropdown(null); navigate(`/customer/quotes/create/edit/${row.id}`); }}>
                            <Edit size={14} className="text-indigo-500" /> Edit
                        </button>
                        <button 
                            className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium disabled:opacity-50" 
                            disabled={isRepeating === row.id}
                            onClick={() => handleRepeatRequest(row)}
                        >
                            {isRepeating === row.id ? (
                                <svg className="animate-spin w-3.5 h-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                            ) : (
                                <Copy size={14} className="text-blue-500" />
                            )}
                            {isRepeating === row.id ? 'Loading...' : 'Repeat Request'}
                        </button>
                        <button className="w-full text-left px-3 py-1.5 text-[13px] text-slate-700 hover:bg-slate-50 flex items-center gap-2" onClick={() => setOpenDropdown(null)}>
                            <FileDown size={14} className="text-slate-400" /> Download PDF
                        </button>
                        <div className="h-px bg-slate-100 my-1"></div>
                        {row.status === 'Bidding Active' || row.status === 'active' ? (
                            <button className="w-full text-left px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium" onClick={() => handleDeleteRequest(row)}>
                                <XCircle size={14} className="text-red-500" /> Cancel Request
                            </button>
                        ) : (
                            <button className="w-full text-left px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer font-medium" onClick={() => handleDeleteRequest(row)}>
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
                data={filteredData} 
                columns={columns} 
                actions={actions}
                headerTabs={<FilterTabs />}
                searchPlaceholder="Search by ID or Route (e.g. Dhaka)..."
                compact={true}
                isLoading={isLoading}
                onDeleteSelected={handleDeleteSelected}
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
