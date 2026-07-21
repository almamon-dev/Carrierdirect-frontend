import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Clock, MapPin, Calendar, Globe, Plus, ChevronRight, Settings } from 'lucide-react';
import TabHeader from '@/components/ui/tab-header';
import Switch from '@/components/ui/switch';

const SCHEDULE_TABS = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'hours', label: 'Business Hours Setup', icon: Clock },
];

export default function CreateAvailabilitySchedule() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [scheduleType, setScheduleType] = useState('recurring');
    const [validity, setValidity] = useState('permanent');

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-6 min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-50"
                        onClick={() => navigate('/supplier/availability/schedule')}
                    >
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <h1 className="text-[18px] font-bold text-slate-900">Create Schedule</h1>
                        <p className="text-[12px] text-slate-500 mt-0.5">Define working hours, locations, and validity periods.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-[12px] px-4 shadow-sm" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="h-8 text-[12px] px-4 gap-1.5 shadow-sm">
                        <Save size={14} />
                        Save Schedule
                    </Button>
                </div>
            </div>
            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-md overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-[15px] font-bold text-slate-800">Configuration</h3>
                    </div>
                    <div className="flex flex-col">
                        {SCHEDULE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[14px] font-medium transition-colors border-l-[3px] border-b border-slate-50 last:border-b-0 ${
                                        isSelected 
                                            ? 'border-l-indigo-600 bg-indigo-50/50 text-indigo-700' 
                                            : 'border-l-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                                        {tab.label}
                                    </div>
                                    {isSelected && <ChevronRight size={15} className="text-indigo-600" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-md shadow-sm w-full">
                    <div className="p-6 md:p-8">
                        {activeTab === 'general' && (
                            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                                <TabHeader title="General Settings" icon={Settings} />
                                {/* Basic Info */}
                                <Card className="shadow-sm border-slate-200">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                                        <CardTitle className="text-[13px] flex items-center gap-2">
                                            <Clock size={14} className="text-indigo-600" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Schedule Name <span className="text-red-500">*</span></label>
                                            <input type="text" placeholder="e.g., Summer Operations" className="w-full h-8 text-[12px] rounded border border-slate-300 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                                <MapPin size={12} className="text-slate-400"/> Location / Branch
                                            </label>
                                            <select className="w-full h-8 text-[12px] rounded border border-slate-300 px-3 focus:outline-none focus:border-indigo-500 bg-white">
                                                <option value="">Select a location</option>
                                                <option value="main">Main Warehouse</option>
                                                <option value="downtown">Downtown Hub</option>
                                                <option value="all">Apply to All Locations</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                                                <Globe size={12} className="text-slate-400"/> Timezone
                                            </label>
                                            <select className="w-full h-8 text-[12px] rounded border border-slate-300 px-3 focus:outline-none focus:border-indigo-500 bg-white">
                                                <option value="est">Eastern Time (EST) UTC-5</option>
                                                <option value="cst">Central Time (CST) UTC-6</option>
                                                <option value="pst">Pacific Time (PST) UTC-8</option>
                                            </select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Schedule Configuration */}
                                <Card className="shadow-sm border-slate-200">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                                        <CardTitle className="text-[13px] flex items-center gap-2">
                                            <Calendar size={14} className="text-indigo-600" />
                                            Schedule Configuration
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-5">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-2">Schedule Type</label>
                                            <div className="flex gap-3">
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="scheduleType" value="recurring" checked={scheduleType === 'recurring'} onChange={() => setScheduleType('recurring')} className="text-indigo-600 focus:ring-indigo-500" />
                                                    Recurring Weekly
                                                </label>
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="scheduleType" value="specific" checked={scheduleType === 'specific'} onChange={() => setScheduleType('specific')} className="text-indigo-600 focus:ring-indigo-500" />
                                                    Specific Dates
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-2">Validity</label>
                                            <div className="flex gap-3 mb-3">
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="validity" value="permanent" checked={validity === 'permanent'} onChange={() => setValidity('permanent')} className="text-indigo-600 focus:ring-indigo-500" />
                                                    Permanent
                                                </label>
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="validity" value="temporary" checked={validity === 'temporary'} onChange={() => setValidity('temporary')} className="text-indigo-600 focus:ring-indigo-500" />
                                                    Temporary (Date Range)
                                                </label>
                                            </div>
                                            {validity === 'temporary' && (
                                                <div className="grid grid-cols-2 gap-3 mt-2 bg-slate-50 p-3 rounded border border-slate-200">
                                                    <div>
                                                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Start Date</label>
                                                        <input type="date" className="w-full h-8 text-[12px] rounded border border-slate-300 px-2 focus:outline-none focus:border-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">End Date</label>
                                                        <input type="date" className="w-full h-8 text-[12px] rounded border border-slate-300 px-2 focus:outline-none focus:border-indigo-500" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <div className="flex justify-end pt-2">
                                    <Button variant="primary" className="h-8 text-[12px] px-6 shadow-sm" onClick={() => setActiveTab('hours')}>
                                        Next: Set Business Hours
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'hours' && (
                            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                                <TabHeader title="Business Hours Setup" icon={Clock} />
                                <Card className="shadow-sm border-slate-200 h-full">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                                        <CardTitle className="text-[13px] flex items-center gap-2">
                                            <Clock size={14} className="text-indigo-600" />
                                            Daily Time Slots
                                        </CardTitle>
                                        <Button variant="ghost" className="h-6 text-[11px] text-indigo-600 font-semibold px-2 hover:bg-indigo-50">Copy Monday to All</Button>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {scheduleType === 'recurring' ? (
                                            <div className="flex flex-col">
                                                {/* Header Row */}
                                                <div className="grid grid-cols-[110px_1fr_1fr_40px] gap-4 px-4 py-2 bg-slate-50/80 border-b border-slate-100 items-center">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Day</span>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Start Time</span>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">End Time</span>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</span>
                                                </div>

                                                <div className="divide-y divide-slate-100">
                                                    {daysOfWeek.map((day, idx) => (
                                                        <div key={day} className={`grid grid-cols-[110px_1fr_1fr_40px] gap-4 px-4 py-1.5 items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <Switch defaultChecked={day !== 'Sunday' && day !== 'Saturday'} />
                                                                <span className="text-[11px] font-semibold text-slate-700">{day.substring(0, 3)}</span>
                                                            </div>
                                                            
                                                            <div>
                                                                <input type="time" defaultValue="08:00" className="w-full max-w-[130px] h-[28px] text-[11px] rounded border border-slate-300 px-2 focus:outline-none focus:border-indigo-500 transition-colors" />
                                                            </div>
                                                            <div>
                                                                <input type="time" defaultValue="18:00" className="w-full max-w-[130px] h-[28px] text-[11px] rounded border border-slate-300 px-2 focus:outline-none focus:border-indigo-500 transition-colors" />
                                                            </div>

                                                            <div className="flex justify-end">
                                                                <Button variant="ghost" className="h-[24px] w-[24px] p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                                                                    <Plus size={13} />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-12 flex flex-col items-center justify-center text-center text-slate-500">
                                                <Calendar size={32} className="text-slate-300 mb-3" />
                                                <p className="text-[13px] font-semibold text-slate-700">Specific Dates Mode</p>
                                                <p className="text-[11px] mt-1 max-w-sm">You have selected to create a schedule for specific dates. You can define exact calendar days and their working hours below.</p>
                                                <Button variant="outline" className="mt-4 h-8 text-[12px] gap-2">
                                                    <Plus size={14} /> Add Date Override
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
