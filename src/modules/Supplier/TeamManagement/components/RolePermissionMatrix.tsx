import React from 'react';
import { Loader2, ShieldOff, Layers } from 'lucide-react';
import Switch from '@/components/ui/switch';
import { ModulePermission } from '../utils/permissionParser';

interface RolePermissionMatrixProps {
    modules: ModulePermission[];
    isLoadingModules: boolean;
    permissions: Record<string, boolean>;
    togglePermission: (id: string) => void;
}

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
    modules,
    isLoadingModules,
    permissions,
    togglePermission,
}) => {
    return (
        <div className="flex-1 w-full min-w-0 bg-white dark:bg-[#12161c] rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-none overflow-hidden h-auto">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/50 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Module Access & Permissions Matrix
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Enable or restrict operational modules and visibility for this access role.
                    </p>
                </div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#12161c] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {modules.length} Modules Available
                </span>
            </div>

            {isLoadingModules ? (
                <div className="p-12 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                    <Loader2 size={22} className="animate-spin text-[#FF4A1F]" />
                    <span className="text-xs font-medium">Fetching permission modules from database...</span>
                </div>
            ) : modules.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                        <ShieldOff size={18} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Permissions Found</h4>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 max-w-xs">
                        No permission modules found in the database.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-800">
                    {modules.map((module) => {
                        const Icon = module.icon || Layers;
                        const isAllowed = permissions[module.id] ?? false;

                        return (
                            <div
                                key={module.id}
                                className="flex items-center justify-between p-3.5 border-b border-r border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors gap-3"
                            >
                                <div className="flex items-start gap-2.5 min-w-0 pr-2">
                                    <div
                                        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                            isAllowed
                                                ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f]'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                        }`}
                                    >
                                        <Icon size={15} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                                {module.name}
                                            </h4>
                                            {isAllowed && (
                                                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
                                                    Allowed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 mt-0.5">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="scale-90 shrink-0">
                                    <Switch
                                        checked={isAllowed}
                                        onCheckedChange={() => togglePermission(module.id)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
