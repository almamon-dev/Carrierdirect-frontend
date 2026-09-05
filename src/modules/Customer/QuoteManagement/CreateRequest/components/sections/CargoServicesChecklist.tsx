import React from 'react';
import { 
    Truck, Box, Layers, Wine, AlertTriangle, 
    Thermometer, Maximize2, Clock, ArrowUpCircle, ArrowDownCircle, 
    Package, ShieldCheck, Sparkles, Wrench, DoorOpen, Warehouse, Settings 
} from 'lucide-react';
import Checkbox from '@/components/ui/checkbox';
import { SectionHeader } from '../FormHelpers';
import { QuoteFormData } from '../../types/formTypes';
import { useCargoServices, isServiceChecked, toCamelCase, CargoServiceItem } from '@/hooks/useCargoServices';

const ICON_MAP: Record<string, any> = {
    Layers, Wine, AlertTriangle, Thermometer, Maximize2, Clock,
    ArrowUpCircle, ArrowDownCircle, Package, ShieldCheck, Truck,
    Sparkles, Wrench, DoorOpen, Warehouse, Settings
};

interface CargoServicesChecklistProps {
    formData: QuoteFormData;
    handleCheckboxChange: (name: keyof QuoteFormData, checked: boolean) => void;
}

export const CargoServicesChecklist: React.FC<CargoServicesChecklistProps> = ({
    formData,
    handleCheckboxChange,
}) => {
    const { careRequirements, logisticServices, loading: servicesLoading } = useCargoServices();

    const onServiceToggle = (srv: CargoServiceItem, checked: boolean) => {
        handleCheckboxChange(srv.key as any, checked);
        const camel = toCamelCase(srv.key);
        if (camel !== srv.key) {
            handleCheckboxChange(camel as any, checked);
        }
    };

    const renderServiceCheckbox = (srv: CargoServiceItem) => {
        const isChecked = isServiceChecked(formData, srv.key);
        const Icon = (srv.icon && ICON_MAP[srv.icon]) ? ICON_MAP[srv.icon] : (srv.category === 'care_requirement' ? Box : Truck);

        return (
            <label 
                key={srv.key || srv.id} 
                title={srv.description || srv.label}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-all cursor-pointer select-none ${
                    isChecked
                        ? 'bg-orange-50/70 dark:bg-orange-950/25 border-orange-300 dark:border-orange-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                        : 'bg-white dark:bg-[#181d24] border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
            >
                <div className="shrink-0 flex items-center">
                    <Checkbox checked={isChecked} onChange={(e) => onServiceToggle(srv, e.target.checked)} />
                </div>
                <Icon size={13} className={isChecked ? 'text-[#ff4a1f] shrink-0' : 'text-slate-400 dark:text-slate-500 shrink-0'} />
                <span className="truncate text-[11.5px] leading-tight" title={srv.label}>{srv.label}</span>
            </label>
        );
    };

    return (
        <>
            <div className="col-span-1 md:col-span-2 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                <SectionHeader title="Special Care Requirements" icon={Box} />
                {servicesLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                        {careRequirements.map(renderServiceCheckbox)}
                    </div>
                )}
            </div>

            <div className="col-span-1 md:col-span-2 mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-800">
                <SectionHeader title="Additional Logistic Services" icon={Truck} />
                {servicesLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 mt-2">
                        {logisticServices.map(renderServiceCheckbox)}
                    </div>
                )}
            </div>
        </>
    );
};
