import React, { useMemo, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import Select from '@/components/ui/select';
import { ServiceAreaRowActions } from './components/ServiceAreaRowActions';
import { ServiceAreaModal } from './components/ServiceAreaModal';
import { getServiceAreaColumns } from './components/serviceAreaColumns';
import { useServiceAreas } from './hooks/useServiceAreas';
import { ServiceAreaItem } from './types/serviceArea.types';

export type { ServiceAreaItem } from './types/serviceArea.types';

export default function Routes() {
    const {
        areas, loading, submitting, showAddModal, setShowAddModal,
        editingItem, setEditingItem, formCountry, setFormCountry, formState, setFormState,
        formCity, setFormCity, formPostalCode, setFormPostalCode, isCustomState, setIsCustomState,
        isCustomCity, setIsCustomCity, countryOptions, availableCities, stateOptions, cityOptions,
        handleSaveArea, openEditModal, handleToggleStatus, handleDeleteArea,
    } = useServiceAreas();

    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

    const filteredAreas = useMemo(() => {
        return areas.filter((item) => {
            if (statusFilter === 'active') return item.isActive;
            if (statusFilter === 'paused') return !item.isActive;
            return true;
        });
    }, [areas, statusFilter]);

    const columns = useMemo(() => getServiceAreaColumns(handleToggleStatus), [handleToggleStatus]);

    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormCountry('United Kingdom');
        setFormState('');
        setFormCity('');
        setFormPostalCode('');
        setIsCustomState(false);
        setIsCustomCity(false);
        setShowAddModal(true);
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">


            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Service Areas
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Manage the areas where you provide transport and collection services.
                    </p>
                </div>

                <Button
                    onClick={handleOpenAdd}
                    className="h-8 px-3.5 bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer rounded-[4px] transition-colors self-start sm:self-auto"
                >
                    <Plus size={15} strokeWidth={2.5} />
                    <span>Add Service Area</span>
                </Button>
            </div>

            {/* Standard Project DataTable */}
            <DataTable
                data={filteredAreas}
                columns={columns}
                actions={(area: ServiceAreaItem) => (
                    <ServiceAreaRowActions
                        row={area}
                        onEdit={openEditModal}
                        onToggleStatus={() => handleToggleStatus(area)}
                        onDelete={() => handleDeleteArea(area.id)}
                    />
                )}
                filterContent={
                    <div className="flex items-center gap-3">
                        <div className="w-48">
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                                Status Filter
                            </label>
                            <Select
                                value={statusFilter}
                                onChange={(val: any) => setStatusFilter(val)}
                                showSearch={false}
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Only</option>
                                <option value="paused">Paused Only</option>
                            </Select>
                        </div>
                    </div>
                }
                searchPlaceholder="Search service area..."
                actionsColumnClassName="w-[60px] min-w-[60px] text-right pr-3.5"
                compact={true}
                hideViewToggle={true}
                tableLayout="fixed"
                tableClassName="min-w-[850px]"
                isLoading={loading}
                emptyState={
                    <EmptyState
                        icon={MapPin}
                        title="No Service Areas Found"
                        description="Add your first service area to start receiving loads in your coverage region."
                        actionLabel="Add Service Area"
                        onAction={handleOpenAdd}
                    />
                }
            />

            {/* Add / Edit Modal */}
            <ServiceAreaModal
                isOpen={showAddModal}
                editingItem={editingItem}
                submitting={submitting}
                countryOptions={countryOptions}
                stateOptions={stateOptions}
                cityOptions={cityOptions}
                availableCities={availableCities}
                formCountry={formCountry}
                onCountryChange={(c) => {
                    setFormCountry(c);
                    setFormState('');
                    setFormCity('');
                    setFormPostalCode('');
                }}
                formState={formState}
                setFormState={setFormState}
                formCity={formCity}
                setFormCity={setFormCity}
                formPostalCode={formPostalCode}
                setFormPostalCode={setFormPostalCode}
                isCustomState={isCustomState}
                setIsCustomState={setIsCustomState}
                isCustomCity={isCustomCity}
                setIsCustomCity={setIsCustomCity}
                onSelectState={(s) => {
                    setFormState(s);
                    setFormCity('');
                }}
                onSelectCity={(c) => {
                    setFormCity(c.name);
                    if (c.zip) setFormPostalCode(c.zip);
                }}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                }}
                onSave={handleSaveArea}
            />
        </div>
    );
}
