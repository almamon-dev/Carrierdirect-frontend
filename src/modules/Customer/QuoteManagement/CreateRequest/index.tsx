/**
 * Customer Quote Management - CreateRequest / RequestList Main Page
 * Orchestrator component displaying user quote requests with filter tabs,
 * real-data skeleton loader, and PDF/CSV AI batch import wizard.
 */

import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { PdfImportWizardModal } from './components/PdfImportWizardModal';
import { useCustomerQuoteRequests } from './hooks/useCustomerQuoteRequests';
import { getCustomerColumns } from './components/columns';
import { FilterTabs } from './components/FilterTabs';
import { RowActions } from './components/RowActions';
import { HeaderActions } from './components/HeaderActions';
import { FilterTabId } from './types';

export default function RequestList() {
    const navigate = useNavigate();
    const [activeFilterTab, setActiveFilterTab] = useState<FilterTabId>('All');

    // Data fetching & operations hook
    const {
        requestData,
        setRequestData,
        isLoading,
        isRepeating,
        fetchQuoteRequests,
        handleDeleteRequest,
        handleDeleteSelected,
        handleRepeatRequest,
    } = useCustomerQuoteRequests();

    // File input refs for CSV / PDF import
    const csvInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const zipInputRef = useRef<HTMLInputElement>(null);

    // AI Import Modal State
    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
    const [processingStep, setProcessingStep] = useState<1 | 2 | 3 | 4>(1);
    const [processingFileName, setProcessingFileName] = useState('Shipping_Request_Order_Batch.pdf');
    const [uploadedZipName, setUploadedZipName] = useState('');
    const [, setProcessingFileType] = useState<'csv' | 'pdf'>('pdf');
    const [extractedData, setExtractedData] = useState<any>(null);

    const openImportWizard = (type: 'csv' | 'pdf' = 'pdf') => {
        setProcessingFileType(type);
        setProcessingFileName(type === 'csv' ? 'GetItMoving_Quote_Request_Batch.csv' : 'Shipping_Request_Order_Batch.pdf');
        setProcessingStep(1);
        setIsProcessingModalOpen(true);
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
                    rawId: Math.floor(1000 + Math.random() * 9000 + i),
                    slug: `req-${Math.floor(1000 + Math.random() * 9000 + i)}`,
                    date: new Date().toISOString().split('T')[0],
                    pickup: row.pickup,
                    delivery: row.delivery,
                    distance: '250 km',
                    budget: row.amount || '45,000',
                    priority: 'Normal',
                    status: 'Active',
                    quotesReceived: 0,
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

    // Filter data based on active tab
    const filteredData = useMemo(() => {
        if (activeFilterTab === 'Active') {
            return requestData.filter(r => r.status === 'Active' || r.status === 'Bidding Active' || r.status === 'active');
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

    const columns = useMemo(() => getCustomerColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            {/* Hidden file inputs for direct uploads */}
            <input type="file" ref={csvInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileChange(e, 'csv')} />
            <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf,.csv,.doc,.docx" onChange={(e) => e.target.files && setProcessingFileName(e.target.files[0].name)} />
            <input type="file" ref={zipInputRef} className="hidden" accept=".zip,.rar,.7z" onChange={(e) => e.target.files && setUploadedZipName(e.target.files[0].name)} />

            {/* Header & Action Bar */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 tracking-tight">Quote Requests</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage, track, or import transportation quote requests.</p>
                </div>

                <HeaderActions 
                    isLoading={isLoading}
                    onRefresh={() => fetchQuoteRequests(true)}
                    onUploadCsv={() => openImportWizard('csv')}
                    onUploadPdfZip={() => openImportWizard('pdf')}
                    onCreateNew={() => navigate('/customer/quotes/create/new')}
                />
            </div>

            {/* Main Data Table */}
            <DataTable 
                data={filteredData} 
                columns={columns} 
                actions={(row) => (
                    <RowActions 
                        row={row} 
                        isRepeating={isRepeating === row.id} 
                        onRepeatRequest={handleRepeatRequest} 
                        onDeleteRequest={handleDeleteRequest} 
                    />
                )}
                headerTabs={
                    <FilterTabs 
                        requestData={requestData} 
                        activeTab={activeFilterTab} 
                        onSelectTab={setActiveFilterTab} 
                    />
                }
                searchPlaceholder="Search by ID, pickup, or delivery address..."
                compact={true}
                isLoading={isLoading}
                skeletonCount={filteredData.length > 0 ? filteredData.length : 3}
                onDeleteSelected={handleDeleteSelected}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                emptyState={
                    <EmptyState
                        icon={Inbox}
                        title="No Quote Requests Found"
                        description={activeFilterTab === 'All' 
                            ? "You haven't created any freight quote requests yet. Click 'Create New Request' to get started." 
                            : `No quote requests match the '${activeFilterTab}' filter.`
                        }
                        actionLabel={activeFilterTab === 'All' ? "Create New Request" : "Refresh Requests"}
                        onAction={activeFilterTab === 'All' ? () => navigate('/customer/quotes/create/new') : () => fetchQuoteRequests(true)}
                    />
                }
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
