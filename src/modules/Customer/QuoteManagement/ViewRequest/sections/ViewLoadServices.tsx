import React from 'react';
import { 
    Truck, Box, Settings, Layers, Wine, AlertTriangle, 
    Thermometer, Maximize2, Clock, ArrowUpCircle, ArrowDownCircle, 
    Package, ShieldCheck, Sparkles, Wrench, DoorOpen, Warehouse 
} from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import { ViewField, SectionHeader } from '../components/ViewField';
import { useCargoServices, isServiceChecked, CargoServiceItem } from '@/hooks/useCargoServices';

const ICON_MAP: Record<string, any> = {
    Layers, Wine, AlertTriangle, Thermometer, Maximize2, Clock,
    ArrowUpCircle, ArrowDownCircle, Package, ShieldCheck, Truck,
    Sparkles, Wrench, DoorOpen, Warehouse, Settings
};

interface ViewLoadServicesProps {
    formData: any;
}

export const ViewLoadServices: React.FC<ViewLoadServicesProps> = ({ formData }) => {
    const { careRequirements, logisticServices } = useCargoServices();

    const activeCare = careRequirements.filter(srv => isServiceChecked(formData, srv.key));
    const activeLogistics = logisticServices.filter(srv => isServiceChecked(formData, srv.key));

    const renderActiveBadge = (srv: CargoServiceItem, badgeTheme: 'care' | 'logistic') => {
        const Icon = (srv.icon && ICON_MAP[srv.icon]) ? ICON_MAP[srv.icon] : (badgeTheme === 'care' ? Box : Truck);

        return (
            <span
                key={srv.key || srv.id}
                title={srv.description || srv.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    badgeTheme === 'care'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800 shadow-2xs'
                }`}
            >
                <Icon size={13} className={badgeTheme === 'care' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'} />
                <span>{srv.label}</span>
            </span>
        );
    };

    return (
        <div className="space-y-3 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <TabHeader title="Cargo & Service Requirements" icon={Truck} />

                <ViewField label="Vehicle Type" value={formData.vehicleType} />
                <ViewField label="Load Type" value={formData.loadType} />
                <ViewField label="Total Items (Qty)" value={formData.itemsCount} />
                <ViewField label="Total Pallets" value={formData.palletsCount} />
                <ViewField label="Total Weight" value={`${formData.weight} KG`} />
                <ViewField label="Total Volume" value={`${formData.volume} CBM`} />

                <SectionHeader title="Cargo Item Dimensions" icon={Box} />
                <div className="col-span-1 md:col-span-2 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold">
                                <th className="p-2.5">#</th>
                                <th className="p-2.5">Length (L)</th>
                                <th className="p-2.5">Width (W)</th>
                                <th className="p-2.5">Height (H)</th>
                                <th className="p-2.5">Unit</th>
                                <th className="p-2.5">Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-800 dark:text-slate-200">
                            {formData.dimensions && formData.dimensions.map((dim: any, idx: number) => (
                                <tr key={dim.id || idx}>
                                    <td className="p-2.5 text-slate-400 font-bold">{idx + 1}</td>
                                    <td className="p-2.5">{dim.length}</td>
                                    <td className="p-2.5">{dim.width}</td>
                                    <td className="p-2.5">{dim.height}</td>
                                    <td className="p-2.5">{dim.unit}</td>
                                    <td className="p-2.5 font-bold">{dim.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <SectionHeader title="Special Care Requirements" icon={Settings} />
                <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 pt-1 pb-1">
                    {activeCare.length > 0 ? (
                        activeCare.map(srv => renderActiveBadge(srv, 'care'))
                    ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs italic">
                            None required (Standard Care)
                        </span>
                    )}
                </div>

                <SectionHeader title="Additional Logistic Services" icon={Settings} />
                <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 pt-1">
                    {activeLogistics.length > 0 ? (
                        activeLogistics.map(srv => renderActiveBadge(srv, 'logistic'))
                    ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs italic">
                            None requested
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
