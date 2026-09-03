import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { getCustomerColumns } from '../CreateRequest/components/columns';
import { FilterTabs } from '../CreateRequest/components/FilterTabs';
import { HeaderActions } from '../CreateRequest/components/HeaderActions';
import { BulkImportModal } from '../CreateRequest/components/BulkImportModal';
import { RowActions } from '../CreateRequest/components/RowActions';
import { useCustomerQuoteRequests } from '../CreateRequest/hooks/useCustomerQuoteRequests';
import { FilterTabId } from '../CreateRequest/types';
import { buildBulkQuoteRequestsPayload } from './utils/bulkConfirmHelpers';

export default function RequestList() {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);
    const [activeFilterTab, setActiveFilterTab] = useState<FilterTabId>('All');

    const {
        requestData,
        isLoading,
        isRepeating,
        fetchQuoteRequests,
        handleDeleteRequest,
        handleDeleteSelected,
        handleRepeatRequest,
    } = useCustomerQuoteRequests();

    const csvInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const zipInputRef = useRef<HTMLInputElement>(null);

    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
    const [processingStep, setProcessingStep] = useState<1 | 2 | 3 | 4>(1);
    const [processingFileName, setProcessingFileName] = useState('');
    const [uploadedZipName, setUploadedZipName] = useState('');
    const [processingFileType, setProcessingFileType] = useState<'csv' | 'pdf'>('pdf');
    const [extractedData, setExtractedData] = useState<any>(null);

    const openImportWizard = (type: 'csv' | 'pdf' = 'pdf') => {
        setProcessingFileType(type);
        setProcessingFileName('');
        setUploadedZipName('');
        setExtractedData(null);
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

    const handleConfirmImport = async () => {
        if (!extractedData) return;

        try {
            const requestsPayload = buildBulkQuoteRequestsPayload(extractedData);
            const res = await apiClient.post(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS_BULK_CONFIRM, {
                requests: requestsPayload,
                attachment_path: extractedData.attachment_path || null,
            });

            const count = res.data?.data?.total_created || requestsPayload.length;
            showToast(`🎉 Successfully created ${count} quote request(s) in database!`, 'success');
            fetchQuoteRequests(true);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to save requests to database.';
            showToast(`Error saving to database: ${msg}`, 'error');
            throw err;
        }
    };

    const handleOpenInForm = () => {
        if (extractedData) {
            setIsProcessingModalOpen(false);
            navigate('/customer/quotes/create/new', { state: { repeatData: extractedData } });
        }
    };

    const filteredData = useMemo(() => {
        if (activeFilterTab === 'Active') {
            return requestData.filter(r => r.status === 'Active' || r.status === 'Bidding Active' || r.status === 'active');
        }
        if (activeFilterTab === 'Waiting') {
            return requestData.filter(r => (r.quotesReceived || r.bidsCount || r.bids_count || 0) === 0 || r.status === 'Draft' || r.status === 'pending');
        }
        if (activeFilterTab === 'Review') {
            return requestData.filter(r => (r.quotesReceived || r.bidsCount || r.bids_count || 0) > 0 || r.status === 'Negotiating');
        }
        if (activeFilterTab === 'Accepted') {
            return requestData.filter(r => r.status === 'Accepted' || r.status === 'completed');
        }
        return requestData;
    }, [requestData, activeFilterTab]);

    const columns = useMemo(() => getCustomerColumns(navigate), [navigate]);

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
            <input type="file" ref={csvInputRef} className="hidden" accept=".csv" onChange={(e) => handleFileChange(e, 'csv')} />
            <input type="file" ref={pdfInputRef} className="hidden" accept=".pdf,.csv,.doc,.docx" onChange={(e) => e.target.files && setProcessingFileName(e.target.files[0].name)} />
            <input type="file" ref={zipInputRef} className="hidden" accept=".zip,.rar,.7z" onChange={(e) => e.target.files && setUploadedZipName(e.target.files[0].name)} />

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

            <DataTable
                data={filteredData}
                columns={columns}
                actions={(row) => (
                    <RowActions
                        row={row}
                        isRepeating={isRepeating === String(row.id)}
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
                onDeleteSelected={handleDeleteSelected}
                onRowClick={(row) => navigate(buildSecureQuoteUrl('view', row.rawId || row.id))}
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
                    />
                }
            />

            <BulkImportModal
                isOpen={isProcessingModalOpen}
                onClose={() => setIsProcessingModalOpen(false)}
                importType={processingFileType}
                setImportType={setProcessingFileType}
                processingStep={processingStep}
                setProcessingStep={setProcessingStep}
                processingFileName={processingFileName}
                setProcessingFileName={setProcessingFileName}
                uploadedZipName={uploadedZipName}
                setUploadedZipName={setUploadedZipName}
                extractedData={extractedData}
                setExtractedData={setExtractedData}
                pdfInputRef={pdfInputRef}
                zipInputRef={zipInputRef}
                onConfirmImport={handleConfirmImport}
                onOpenInForm={handleOpenInForm}
            />
        </div>
    );
}
