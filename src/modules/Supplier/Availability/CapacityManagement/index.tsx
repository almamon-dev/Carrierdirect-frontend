import React, { useState } from 'react';
import { Truck, Scale, Box, TrendingUp, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import FormLabel from '@/components/ui/label';

export default function CapacityManagement() {
    const [maxTonnage, setMaxTonnage] = useState('50.0');
    const [allocatedTonnage, setAllocatedTonnage] = useState('32.5');
    const [activeVehiclesCount, setActiveVehiclesCount] = useState('12');

    const remainingTonnage = (parseFloat(maxTonnage) - parseFloat(allocatedTonnage)).toFixed(1);
    const utilizationPct = Math.min(100, Math.round((parseFloat(allocatedTonnage) / parseFloat(maxTonnage)) * 100));

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Fleet Capacity Management</h1>
                    <p className="text-xs text-slate-500 font-medium">Real-time daily payload allocation, max tonnage thresholds, and fleet volume metrics.</p>
                </div>
                <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => alert('Capacity allocation saved!')}>
                    <RefreshCw size={13} className="mr-1.5" /> Save Allocation Rules
                </Button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Max Daily Tonnage Capacity</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-slate-900">{maxTonnage}</span>
                        <span className="text-xs text-slate-500 font-semibold">Tons</span>
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Allocated / Booked Tonnage</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-emerald-700">{allocatedTonnage}</span>
                        <span className="text-xs text-slate-500 font-semibold">Tons</span>
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Available Remaining Capacity</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-blue-700">{remainingTonnage}</span>
                        <span className="text-xs text-slate-500 font-semibold">Tons</span>
                    </div>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-1">
                    <span className="text-xs text-slate-500 font-medium">Fleet Utilization</span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-slate-900">{utilizationPct}%</span>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] ml-1">Optimal</Badge>
                    </div>
                </div>
            </div>

            {/* Utilization Bar */}
            <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-3">
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
            <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-4 max-w-2xl">
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
