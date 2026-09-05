import React from 'react';
import { Layers } from 'lucide-react';
import { DimensionsItem } from '../../data/quoteRequestsData';

export const CargoDimensionsTable: React.FC<{ dimensionsList: DimensionsItem[] }> = ({ dimensionsList }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Layers size={12.5} className="text-slate-400" /> Cargo Dimensions
            </h4>
            <span className="text-[11px] text-slate-400 font-normal">
                {dimensionsList.length} item{dimensionsList.length > 1 ? 's' : ''}
            </span>
        </div>
        <div className="border border-slate-200/90 dark:border-slate-800 rounded-[3px] overflow-hidden">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-[#181d24] text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                        <th className="py-1.5 px-2.5 text-left w-9 font-medium">#</th>
                        <th className="py-1.5 px-2.5 text-left font-medium">Length</th>
                        <th className="py-1.5 px-2.5 text-left font-medium">Width</th>
                        <th className="py-1.5 px-2.5 text-left font-medium">Height</th>
                        <th className="py-1.5 px-2.5 text-center font-medium">Qty</th>
                        <th className="py-1.5 px-2.5 text-center font-medium">Unit</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-[#1e2329]">
                    {dimensionsList.map((dim, i) => (
                        <tr key={dim.id || i}>
                            <td className="py-1.5 px-2.5 text-slate-500 dark:text-slate-400 font-medium text-xs">#{i + 1}</td>
                            <td className="py-1.5 px-2.5 text-slate-700 dark:text-slate-300 font-normal">{dim.length}</td>
                            <td className="py-1.5 px-2.5 text-slate-700 dark:text-slate-300 font-normal">{dim.width}</td>
                            <td className="py-1.5 px-2.5 text-slate-700 dark:text-slate-300 font-normal">{dim.height}</td>
                            <td className="py-1.5 px-2.5 text-center text-slate-800 dark:text-slate-200 font-medium">{dim.qty}</td>
                            <td className="py-1.5 px-2.5 text-center text-slate-400 text-[11px] font-normal">{dim.unit ? dim.unit.toLowerCase() : 'cm'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
