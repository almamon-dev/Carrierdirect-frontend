import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import Select from '@/components/ui/select';

export default function AvailabilitySettings() {
    const [autoAccept, setAutoAccept] = useState(false);
    const [bufferHours, setBufferHours] = useState('2');
    const [dispatchNoticeHours, setDispatchNoticeHours] = useState('4');
    const [weekendOperations, setWeekendOperations] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-6 bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Availability & Dispatch Settings</h1>
                    <p className="text-xs text-slate-500 font-medium">Configure auto-booking rules, buffer times between trips, and dispatch notices.</p>
                </div>
            </div>

            {saved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Availability settings updated successfully!</span>
                </div>
            )}

            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6 shadow-2xs">
                
                {/* Section 1: Trip Buffer & Dispatch Rules */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Clock size={16} className="text-slate-600" /> Trip Buffer & Dispatch Notice
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                            <FormLabel className="text-xs font-semibold text-slate-700">Minimum Buffer Between Trips (Hours)</FormLabel>
                            <Select value={bufferHours} onChange={e => setBufferHours(e.target.value)} showSearch={false} className="text-xs h-9">
                                <option value="1">1 Hour Buffer</option>
                                <option value="2">2 Hours Buffer</option>
                                <option value="4">4 Hours Buffer</option>
                                <option value="6">6 Hours Buffer</option>
                            </Select>
                            <p className="text-[11px] text-slate-400 mt-1">Rest and vehicle check time required between consecutive assignments.</p>
                        </div>

                        <div>
                            <FormLabel className="text-xs font-semibold text-slate-700">Advance Dispatch Notice (Hours)</FormLabel>
                            <Select value={dispatchNoticeHours} onChange={e => setDispatchNoticeHours(e.target.value)} showSearch={false} className="text-xs h-9">
                                <option value="2">2 Hours Minimum Notice</option>
                                <option value="4">4 Hours Minimum Notice</option>
                                <option value="12">12 Hours Minimum Notice</option>
                                <option value="24">24 Hours Minimum Notice</option>
                            </Select>
                            <p className="text-[11px] text-slate-400 mt-1">Minimum lead time required before a job pickup time.</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Automation & Operating Days */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <ShieldCheck size={16} className="text-slate-600" /> Operating Days & Auto Rules
                    </h3>

                    <div className="space-y-3 text-xs">
                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={weekendOperations} 
                                onChange={e => setWeekendOperations(e.target.checked)} 
                                className="w-4 h-4 accent-[#ff4a1f] rounded"
                            />
                            <div>
                                <span className="font-bold text-slate-900 block">Weekend Operations Enabled (Friday & Saturday)</span>
                                <span className="text-slate-500">Allow customers to request quote schedules on weekend dates.</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={autoAccept} 
                                onChange={e => setAutoAccept(e.target.checked)} 
                                className="w-4 h-4 accent-[#ff4a1f] rounded"
                            />
                            <div>
                                <span className="font-bold text-slate-900 block">Auto-Assign Matching Drivers</span>
                                <span className="text-slate-500">Automatically assign available drivers when a quote request matches fleet capacity.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                    <Button variant="primary" type="submit" className="h-10 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                        <Save size={14} className="mr-1.5" /> Save Preferences
                    </Button>
                </div>
            </form>
        </div>
    );
}
