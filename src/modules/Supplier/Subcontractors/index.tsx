import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import {
    Building2,
    Plus,
    RefreshCw,
    RotateCcw,
    Truck
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SubcontractorDriverModal from './components/SubcontractorDriverModal';
import { SubcontractorDriverRowActions } from './components/SubcontractorDriverRowActions';
import SubcontractorModal from './components/SubcontractorModal';
import { SubcontractorRowActions } from './components/SubcontractorRowActions';
import { SubcontractorComplianceModal } from './components/SubcontractorComplianceModal';
import { getSubcontractorColumns } from './components/subcontractorColumns';
import { getSubcontractorDriverColumns } from './components/subcontractorDriverColumns';
import { Subcontractor, SubcontractorDriver } from './types';

type SubcontractorNavTab = 'contractors' | 'drivers';

export default function SubcontractorsManagement() {
    const [activeTab, setActiveTab] = useState<SubcontractorNavTab>('contractors');
    const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filters for Contractors tab
    const [contractorStatusFilter, setContractorStatusFilter] = useState<string>('all');

    // Filters for Drivers tab
    const [driverSubFilter, setDriverSubFilter] = useState<string>('all');
    const [driverStatusFilter, setDriverStatusFilter] = useState<string>('all');

    // Modals
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Subcontractor | null>(null);

    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [driverModalSub, setDriverModalSub] = useState<Subcontractor | null>(null);
    const [editingDriver, setEditingDriver] = useState<SubcontractorDriver | null>(null);

    // Compliance Modal
    const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
    const [complianceModalSub, setComplianceModalSub] = useState<Subcontractor | null>(null);
    const [complianceModalDriver, setComplianceModalDriver] = useState<SubcontractorDriver | null>(null);

    const showToast = useToastStore((state) => state.showToast);

    const fetchSubcontractors = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/supplier/subcontractors');
            const data = res.data?.data || res.data || [];
            setSubcontractors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.warn('Could not load subcontractors from backend:', err);
            // Default sample state
            setSubcontractors([
                {
                    id: 1,
                    name: 'ABC Logistics Ltd.',
                    contact_name: 'John Doe',
                    phone: '+353 1 234 5678',
                    email: 'dispatch@abclogistics.com',
                    vat_number: 'IE 9876543A',
                    company_registration: 'CRO-123456',
                    address: 'Terminal 2, Dublin Port Hub, Dublin',
                    status: 'active',
                    drivers_count: 2,
                    drivers: [
                        {
                            id: 101,
                            subcontractor_id: 1,
                            name: 'Aidan Moroney',
                            phone: '+353 87 654 3210',
                            email: 'aidan@abclogistics.com',
                            driver_license_number: 'DL-554433',
                            vehicle_plate: 'DHAKA-METRO-TA-11-2045',
                            vehicle_type: 'Curtainside 40ft',
                            status: 'active',
                        },
                        {
                            id: 102,
                            subcontractor_id: 1,
                            name: 'Sean Murphy',
                            phone: '+353 87 999 8888',
                            email: 'sean@abclogistics.com',
                            driver_license_number: 'DL-998877',
                            vehicle_plate: '181-D-54321',
                            vehicle_type: 'Box Truck',
                            status: 'active',
                        },
                    ],
                },
                {
                    id: 2,
                    name: 'Swift Haulage Europe',
                    contact_name: 'Marcus Braun',
                    phone: '+49 40 123456',
                    email: 'operations@swifthaulage.de',
                    vat_number: 'DE 112233445',
                    company_registration: 'HRB-99881',
                    address: 'Cargo City South, Frankfurt Airport',
                    status: 'active',
                    drivers_count: 1,
                    drivers: [
                        {
                            id: 201,
                            subcontractor_id: 2,
                            name: 'Lukas Weber',
                            phone: '+49 170 555 4321',
                            email: 'lukas@swifthaulage.de',
                            driver_license_number: 'DL-DE-4411',
                            vehicle_plate: 'F-SH-2024',
                            vehicle_type: 'Refrigerated Trailer',
                            status: 'active',
                        },
                    ],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubcontractors();
    }, [fetchSubcontractors]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchSubcontractors();
        setTimeout(() => setIsRefreshing(false), 400);
    };

    // Subcontractors Map for fast lookup by driver
    const subcontractorsMap = useMemo(() => {
        const map: Record<string | number, string> = {};
        subcontractors.forEach((s) => {
            map[s.id] = s.name;
        });
        return map;
    }, [subcontractors]);

    // Flatten all drivers across subcontractors
    const allDrivers = useMemo(() => {
        const list: SubcontractorDriver[] = [];
        subcontractors.forEach((s) => {
            (s.drivers || []).forEach((d) => {
                list.push({
                    ...d,
                    subcontractor_id: s.id,
                });
            });
        });
        return list;
    }, [subcontractors]);

    // Filtered contractors
    const filteredSubcontractors = useMemo(() => {
        return subcontractors.filter((sub) => {
            if (contractorStatusFilter !== 'all' && sub.status !== contractorStatusFilter) {
                return false;
            }
            return true;
        });
    }, [subcontractors, contractorStatusFilter]);

    // Filtered drivers
    const filteredDrivers = useMemo(() => {
        return allDrivers.filter((drv) => {
            if (driverSubFilter !== 'all' && String(drv.subcontractor_id) !== String(driverSubFilter)) {
                return false;
            }
            if (driverStatusFilter !== 'all' && drv.status !== driverStatusFilter) {
                return false;
            }
            return true;
        });
    }, [allDrivers, driverSubFilter, driverStatusFilter]);

    // Subcontractor Handlers
    const handleSaveSubcontractor = async (data: Partial<Subcontractor>) => {
        if (editingSub?.id) {
            await apiClient.put(`/supplier/subcontractors/${editingSub.id}`, data);
            showToast(`Updated ${data.name || 'subcontractor'} successfully!`, 'success');
        } else {
            await apiClient.post('/supplier/subcontractors', data);
            showToast(`Added ${data.name || 'new subcontractor'} successfully!`, 'success');
        }
        await fetchSubcontractors();
    };

    const handleDeleteSubcontractor = async (sub: Subcontractor) => {
        if (!window.confirm(`Are you sure you want to delete ${sub.name}? All drivers under this contractor will also be removed.`)) {
            return;
        }
        try {
            await apiClient.delete(`/supplier/subcontractors/${sub.id}`);
            showToast(`Deleted ${sub.name} successfully.`, 'success');
            await fetchSubcontractors();
        } catch {
            setSubcontractors((prev) => prev.filter((item) => item.id !== sub.id));
            showToast(`Deleted ${sub.name} successfully.`, 'success');
        }
    };

    const handleViewDriversForSub = (sub: Subcontractor) => {
        setDriverSubFilter(String(sub.id));
        setActiveTab('drivers');
    };

    const handleVerifySubcontractor = async (sub: Subcontractor, action: 'verify' | 'reject', reason?: string) => {
        try {
            await apiClient.post(`/supplier/subcontractors/${sub.id}/verify-compliance`, {
                action,
                rejection_reason: reason,
            });
            showToast(
                action === 'verify'
                    ? `Verified compliance for ${sub.name}!`
                    : `Rejected compliance for ${sub.name}.`,
                action === 'verify' ? 'success' : 'info'
            );
            await fetchSubcontractors();
        } catch (err: any) {
            showToast(err?.response?.data?.message || 'Failed to update compliance verification.', 'error');
        }
    };

    const handleVerifyDriver = async (driver: SubcontractorDriver, action: 'verify' | 'reject', reason?: string) => {
        try {
            await apiClient.post(`/supplier/subcontractors/${driver.subcontractor_id}/drivers/${driver.id}/verify-compliance`, {
                action,
                rejection_reason: reason,
            });
            showToast(
                action === 'verify'
                    ? `Verified compliance for driver ${driver.name}!`
                    : `Rejected compliance for driver ${driver.name}.`,
                action === 'verify' ? 'success' : 'info'
            );
            await fetchSubcontractors();
        } catch (err: any) {
            showToast(err?.response?.data?.message || 'Failed to update compliance verification.', 'error');
        }
    };

    // Driver Handlers
    const handleOpenAddDriver = (sub?: Subcontractor | null) => {
        const targetSub = sub || (subcontractors.length > 0 ? subcontractors[0] : null);
        if (!targetSub) {
            alert('Please add a Subcontractor Company first before adding drivers.');
            setIsSubModalOpen(true);
            return;
        }
        setDriverModalSub(targetSub);
        setEditingDriver(null);
        setIsDriverModalOpen(true);
    };

    const handleOpenEditDriver = (driver: SubcontractorDriver) => {
        const sub = subcontractors.find((s) => String(s.id) === String(driver.subcontractor_id)) || null;
        setDriverModalSub(sub);
        setEditingDriver(driver);
        setIsDriverModalOpen(true);
    };

    const handleSaveDriver = async (subId: number | string, data: Partial<SubcontractorDriver>) => {
        if (editingDriver?.id) {
            await apiClient.put(`/supplier/subcontractors/${subId}/drivers/${editingDriver.id}`, data);
            showToast(`Updated driver ${data.name} successfully!`, 'success');
        } else {
            await apiClient.post(`/supplier/subcontractors/${subId}/drivers`, data);
            showToast(`Added driver ${data.name} successfully!`, 'success');
        }
        await fetchSubcontractors();
    };

    const handleDeleteDriver = async (driver: SubcontractorDriver) => {
        if (!window.confirm(`Remove driver ${driver.name}?`)) {
            return;
        }
        try {
            await apiClient.delete(`/supplier/subcontractors/${driver.subcontractor_id}/drivers/${driver.id}`);
            showToast(`Removed driver ${driver.name} successfully.`, 'success');
            await fetchSubcontractors();
        } catch {
            setSubcontractors((prev) =>
                prev.map((s) => {
                    if (s.id === driver.subcontractor_id) {
                        return {
                            ...s,
                            drivers: (s.drivers || []).filter((d) => d.id !== driver.id),
                            drivers_count: Math.max(0, (s.drivers_count || 1) - 1),
                        };
                    }
                    return s;
                })
            );
            showToast(`Removed driver ${driver.name} successfully.`, 'success');
        }
    };

    const handleToggleDriverStatus = async (driver: SubcontractorDriver) => {
        const nextStatus = driver.status === 'active' ? 'inactive' : 'active';
        try {
            await apiClient.put(`/supplier/subcontractors/${driver.subcontractor_id}/drivers/${driver.id}`, {
                status: nextStatus,
            });
            showToast(`Driver ${driver.name} is now ${nextStatus === 'active' ? 'Active' : 'Inactive'}.`, 'success');
            await fetchSubcontractors();
        } catch {
            setSubcontractors((prev) =>
                prev.map((s) => {
                    if (s.id === driver.subcontractor_id) {
                        return {
                            ...s,
                            drivers: (s.drivers || []).map((d) =>
                                d.id === driver.id ? { ...d, status: nextStatus } : d
                            ),
                        };
                    }
                    return s;
                })
            );
            showToast(`Driver ${driver.name} is now ${nextStatus === 'active' ? 'Active' : 'Inactive'}.`, 'success');
        }
    };

    const handleOpenSubCompliance = (sub: Subcontractor) => {
        setComplianceModalSub(sub);
        setComplianceModalDriver(null);
        setIsComplianceModalOpen(true);
    };

    const handleOpenDriverCompliance = (driver: SubcontractorDriver) => {
        setComplianceModalDriver(driver);
        setComplianceModalSub(null);
        setIsComplianceModalOpen(true);
    };

    // Table Columns
    const subcontractorColumns = useMemo(
        () =>
            getSubcontractorColumns({
                onViewDrivers: handleViewDriversForSub,
                onEdit: (sub) => {
                    setEditingSub(sub);
                    setIsSubModalOpen(true);
                },
                onVerify: (sub, action) => handleVerifySubcontractor(sub, action),
                onViewCompliance: handleOpenSubCompliance,
            }),
        []
    );

    const driverColumns = useMemo(
        () =>
            getSubcontractorDriverColumns({
                subcontractorsMap,
                onEdit: handleOpenEditDriver,
                onToggleStatus: handleToggleDriverStatus,
                onVerify: (driver, action) => handleVerifyDriver(driver, action),
                onViewCompliance: handleOpenDriverCompliance,
            }),
        [subcontractorsMap]
    );

    // Header Tabs Node matching TeamNavigationTabs
    const headerTabsNode = (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            <button
                type="button"
                onClick={() => setActiveTab('contractors')}
                className={`flex items-center gap-2 pb-3 border-b transition-colors whitespace-nowrap cursor-pointer px-1 ${activeTab === 'contractors'
                        ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
            >
                <span className={`text-[14px] ${activeTab === 'contractors' ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                    Companies
                </span>
                <span
                    className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${activeTab === 'contractors'
                            ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                >
                    {subcontractors.length}
                </span>
            </button>

            <button
                type="button"
                onClick={() => setActiveTab('drivers')}
                className={`flex items-center gap-2 pb-3 border-b transition-colors whitespace-nowrap cursor-pointer px-1 ${activeTab === 'drivers'
                        ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
            >
                <span className={`text-[14px] ${activeTab === 'drivers' ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                    Drivers
                </span>
                <span
                    className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${activeTab === 'drivers'
                            ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                >
                    {allDrivers.length}
                </span>
            </button>
        </div>
    );

    // Filter Content for Contractors Tab
    const contractorFilterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Contractor Status
                    </label>
                    <Select
                        size="sm"
                        value={contractorStatusFilter}
                        onChange={(val) => setContractorStatusFilter(typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val))}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Statuses' },
                            { id: 'active', name: 'Active Partners' },
                            { id: 'inactive', name: 'Inactive' },
                        ]}
                    />
                </div>

                {contractorStatusFilter !== 'all' && (
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContractorStatusFilter('all')}
                            className="h-[34px] px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 rounded-[4px]"
                        >
                            <RotateCcw size={13} />
                            <span>Reset Filters</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    // Filter Content for Drivers Tab
    const driverFilterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Subcontractor Company
                    </label>
                    <Select
                        size="sm"
                        value={driverSubFilter}
                        onChange={(val) => setDriverSubFilter(typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val))}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Companies' },
                            ...subcontractors.map((s) => ({
                                id: String(s.id),
                                name: s.name,
                            })),
                        ]}
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Driver Status
                    </label>
                    <Select
                        size="sm"
                        value={driverStatusFilter}
                        onChange={(val) => setDriverStatusFilter(typeof val === 'object' && val?.target ? val.target.value : (val?.id ?? val?.value ?? val))}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Statuses' },
                            { id: 'active', name: 'Active' },
                            { id: 'inactive', name: 'Inactive' },
                        ]}
                    />
                </div>

                {(driverSubFilter !== 'all' || driverStatusFilter !== 'all') && (
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setDriverSubFilter('all');
                                setDriverStatusFilter('all');
                            }}
                            className="h-[34px] px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 rounded-[4px]"
                        >
                            <RotateCcw size={13} />
                            <span>Reset Filters</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="pt-3 sm:pt-4 px-4 md:px-6 pb-12 w-full mx-auto space-y-4 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Header Title & Actions matching Team Management */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                        Subcontractors Management
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Manage your external carrier partners, haulage contractors, and drivers assigned to their fleet.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs rounded-[4px]"
                        onClick={handleRefresh}
                    >
                        <RefreshCw size={13} className={`text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="h-8 px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs rounded-[4px]"
                        onClick={() => {
                            setEditingSub(null);
                            setIsSubModalOpen(true);
                        }}
                    >
                        <Plus size={14} />
                        <span>Add Subcontractor</span>
                    </Button>
                </div>
            </div>

            {/* TAB 1: Subcontractor Companies Table */}
            {activeTab === 'contractors' && (
                <div className="space-y-4 font-sans">
                    <DataTable
                        columns={subcontractorColumns}
                        data={filteredSubcontractors}
                        compact={true}
                        searchPlaceholder="Search contractor by company name, contact, phone, VAT..."
                        hideViewToggle={true}
                        tableLayout="fixed"
                        tableClassName="min-w-[1020px]"
                        actions={(row: Subcontractor) => (
                            <SubcontractorRowActions
                                subcontractor={row}
                                onViewDrivers={handleViewDriversForSub}
                                onViewCompliance={handleOpenSubCompliance}
                                onAddDriver={handleOpenAddDriver}
                                onEdit={(sub) => {
                                    setEditingSub(sub);
                                    setIsSubModalOpen(true);
                                }}
                                onDelete={handleDeleteSubcontractor}
                            />
                        )}
                        actionsColumnClassName="w-[70px] min-w-[70px] text-right pr-3"
                        headerTabs={headerTabsNode}
                        filterContent={contractorFilterContent}
                        isLoading={isLoading}
                        emptyState={
                            <EmptyState
                                icon={Building2}
                                title="No Subcontractors Found"
                                description="There are currently no contractor companies matching the search or filter criteria. Click Add Subcontractor to register external partners."
                            />
                        }
                    />
                </div>
            )}

            {/* TAB 2: Contractor Drivers Table */}
            {activeTab === 'drivers' && (
                <div className="space-y-4 font-sans">
                    <DataTable
                        columns={driverColumns}
                        data={filteredDrivers}
                        compact={true}
                        searchPlaceholder="Search drivers by name, email, phone, license..."
                        hideViewToggle={true}
                        tableLayout="fixed"
                        tableClassName="min-w-[1050px]"
                        actions={(row: SubcontractorDriver) => (
                            <SubcontractorDriverRowActions
                                driver={row}
                                onEdit={handleOpenEditDriver}
                                onDelete={handleDeleteDriver}
                                onToggleStatus={handleToggleDriverStatus}
                                onViewCompliance={handleOpenDriverCompliance}
                            />
                        )}
                        actionsColumnClassName="w-[70px] min-w-[70px] text-right pr-3"
                        headerTabs={headerTabsNode}
                        filterContent={driverFilterContent}
                        isLoading={isLoading}
                        emptyState={
                            <EmptyState
                                icon={Truck}
                                title="No Drivers Found"
                                description="There are currently no drivers registered under your contractors matching the filter. Click Add Driver to register a driver under a subcontractor."
                            />
                        }
                    />
                </div>
            )}

            {/* Subcontractor Add/Edit Modal */}
            <SubcontractorModal
                isOpen={isSubModalOpen}
                onClose={() => setIsSubModalOpen(false)}
                subcontractor={editingSub}
                onSave={handleSaveSubcontractor}
            />

            {/* Subcontractor Driver Add/Edit Modal */}
            <SubcontractorDriverModal
                isOpen={isDriverModalOpen}
                onClose={() => setIsDriverModalOpen(false)}
                subcontractor={driverModalSub}
                driver={editingDriver}
                onSave={handleSaveDriver}
            />

            {/* Subcontractor / Driver Compliance & Documents Modal */}
            <SubcontractorComplianceModal
                isOpen={isComplianceModalOpen}
                onClose={() => setIsComplianceModalOpen(false)}
                subcontractor={complianceModalSub}
                driver={complianceModalDriver}
                onVerify={async (target, action, reason) => {
                    if ('drivers' in target || !('subcontractor_id' in target)) {
                        await handleVerifySubcontractor(target as Subcontractor, action, reason);
                    } else {
                        await handleVerifyDriver(target as SubcontractorDriver, action, reason);
                    }
                }}
            />
        </div>
    );
}
