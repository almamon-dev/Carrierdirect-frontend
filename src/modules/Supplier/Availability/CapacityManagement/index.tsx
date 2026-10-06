import React, { useState } from 'react';
import { Truck, Scale, Box, TrendingUp, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import FormLabel from '@/components/ui/label';
import MetricCard from '@/components/cards/metric-card';

export default function CapacityManagement() {
    const [maxTonnage, setMaxTonnage] = useState('50.0');
    const [allocatedTonnage, setAllocatedTonnage] = useState('32.5');
    const [activeVehiclesCount, setActiveVehiclesCount] = useState('12');

    const remainingTonnage = (parseFloat(maxTonnage) - parseFloat(allocatedTonnage)).toFixed(1);
    const utilizationPct = Math.min(100, Math.round((parseFloat(allocatedTonnage) / parseFloat(maxTonnage)) * 100));

    return (
        <div
    className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-6 bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">Fleet Capacity Management</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Real-time daily payload allocation, max tonnage thresholds, and fleet volume metrics.
                    </p>
                </div>
                <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => alert('Capacity allocation saved!')}>
                    <RefreshCw size={13} className="mr-1.5" /> Save Allocation Rules
                </Button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                <MetricCard
                    title="Max Daily Tonnage"
                    description="Maximum fleet payload limit per day"
                    value={`${maxTonnage} T`}
                    icon={Scale}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                    badge={<Badge variant="secondary" className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">Cap</Badge>}
                />
                <MetricCard
                    title="Allocated Tonnage"
                    description="Current scheduled booking weight"
                    value={`${allocatedTonnage} T`}
                    icon={Box}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Booked</Badge>}
                />
                <MetricCard
                    title="Remaining Capacity"
                    description="Available cargo capacity ready to assign"
                    value={`${remainingTonnage} T`}
                    icon={Truck}
                    colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    badge={<Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">Free</Badge>}
                />
                <MetricCard
                    title="Fleet Utilization"
                    description="Overall daily capacity efficiency"
                    value={`${utilizationPct}%`}
                    icon={TrendingUp}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                    badge={<Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">Optimal</Badge>}
                />
            </div>

            {/* Utilization Bar */}
            <div
    className="p-5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Fleet Capacity Utilization Progress</span>
                    <span className="font-bold text-slate-900">{allocatedTonnage} / {maxTonnage} Tons ({utilizationPct}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                        className={`h-full transition-all duration-500 ${
                            utilizationPct > 90 ? 'bg-red-500' : utilizationPct > 70 ? 'bg-[#ff4a1f]' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${utilizationPct}%` }}
                    />
                </div>
            </div>

            {/* Interactive Capacity Rule Adjustment Card */}
            <div
    className="p-6 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-4 max-w-2xl">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">Adjust Daily Capacity Thresholds</h3>

                <div className="space-y-4 text-xs">
                    <div>
                        <FormLabel className="text-xs">Maximum Fleet Daily Tonnage Limit (Tons)</FormLabel>
                        <Input 
                            type="number" 
                            step="1.0"
                            className="text-xs h-9 font-bold bg-white"
                            value={maxTonnage}
                            onChange={(e) => setMaxTonnage(e.target.value)}
                        />
                    </div>
                    <div>
                        <FormLabel className="text-xs">Active Operating Fleet Vehicles</FormLabel>
                        <Input 
                            type="number" 
                            className="text-xs h-9 font-bold bg-white"
                            value={activeVehiclesCount}
                            onChange={(e) => setActiveVehiclesCount(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
