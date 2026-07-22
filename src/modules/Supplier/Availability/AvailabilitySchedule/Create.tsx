import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
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
    const [activeTab, setActiveTab] = useState('hours');
    const [scheduleType, setScheduleType] = useState('recurring');
    const [validity, setValidity] = useState('permanent');

    const leftColumnDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const rightColumnDays = ['Friday', 'Saturday', 'Sunday'];

    const locationOptions = [
        { id: '', name: 'Select a location' },
        { id: 'main', name: 'Main Warehouse' },
        { id: 'downtown', name: 'Downtown Hub' },
        { id: 'all', name: 'Apply to All Locations' },
    ];

    const timezoneOptions = [
        { id: 'est', name: 'Eastern Time (EST) UTC-5' },
        { id: 'cst', name: 'Central Time (CST) UTC-6' },
        { id: 'pst', name: 'Pacific Time (PST) UTC-8' },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-6 min-h-screen pb-20 font-sans antialiased">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 bg-white border border-slate-200 text-slate-500 rounded hover:bg-slate-50 cursor-pointer"
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
                    <Button variant="outline" className="h-8 text-[12px] px-4 shadow-xs cursor-pointer" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button variant="primary" className="h-8 text-[12px] px-4 gap-1.5 shadow-xs cursor-pointer bg-[#ff4a1f] hover:bg-[#e63d15]">
                        <Save size={14} />
                        Save Schedule
                    </Button>
                </div>
            </div>

            {/* Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-[260px] flex-shrink-0 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <h3 className="text-[13px] font-bold text-slate-800">Configuration</h3>
                    </div>
                    <div className="flex flex-col">
                        {SCHEDULE_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isSelected = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-[13px] font-medium transition-colors border-l-[3px] border-b border-slate-100 last:border-b-0 cursor-pointer ${
                                        isSelected 
                                            ? 'border-l-[#ff4a1f] bg-orange-50/60 text-[#ff4a1f] font-bold' 
                                            : 'border-l-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon size={15} className={isSelected ? 'text-[#ff4a1f]' : 'text-slate-400'} />
                                        {tab.label}
                                    </div>
                                    {isSelected && <ChevronRight size={15} className="text-[#ff4a1f]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-2xs w-full">
                    <div className="p-5 md:p-6">
                        {activeTab === 'general' && (
                            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                                <TabHeader title="General Settings" icon={Settings} />
                                
                                {/* Basic Info */}
                                <Card className="shadow-2xs border-slate-200">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                                        <CardTitle className="text-[13px] font-bold flex items-center gap-2">
                                            <Clock size={14} className="text-[#ff4a1f]" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                        <Input 
                                            label="Schedule Name *" 
                                            placeholder="e.g., Summer Operations" 
                                            className="h-8.5 text-[12px] border-slate-300 focus:border-[#ff4a1f] rounded-md" 
                                            required
                                        />
                                        
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[12px] font-bold text-[#202223] flex items-center gap-1">
                                                <MapPin size={12} className="text-slate-400"/> Location / Branch
                                            </label>
                                            <Select
                                                options={locationOptions}
                                                placeholder="Select a location..."
                                                showSearch={false}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="text-[12px] font-bold text-[#202223] flex items-center gap-1">
                                                <Globe size={12} className="text-slate-400"/> Timezone
                                            </label>
                                            <Select
                                                options={timezoneOptions}
                                                value="est"
                                                showSearch={false}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Schedule Configuration */}
                                <Card className="shadow-2xs border-slate-200">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                                        <CardTitle className="text-[13px] font-bold flex items-center gap-2">
                                            <Calendar size={14} className="text-[#ff4a1f]" />
                                            Schedule Configuration
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-5">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-2">Schedule Type</label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="scheduleType" value="recurring" checked={scheduleType === 'recurring'} onChange={() => setScheduleType('recurring')} className="accent-[#ff4a1f]" />
                                                    Recurring Weekly
                                                </label>
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="scheduleType" value="specific" checked={scheduleType === 'specific'} onChange={() => setScheduleType('specific')} className="accent-[#ff4a1f]" />
                                                    Specific Dates
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold text-slate-700 mb-2">Validity</label>
                                            <div className="flex gap-4 mb-3">
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="validity" value="permanent" checked={validity === 'permanent'} onChange={() => setValidity('permanent')} className="accent-[#ff4a1f]" />
                                                    Permanent
                                                </label>
                                                <label className="flex items-center gap-2 text-[12px] cursor-pointer">
                                                    <input type="radio" name="validity" value="temporary" checked={validity === 'temporary'} onChange={() => setValidity('temporary')} className="accent-[#ff4a1f]" />
                                                    Temporary (Date Range)
                                                </label>
                                            </div>
                                            {validity === 'temporary' && (
                                                <div className="grid grid-cols-2 gap-3 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                    <Input
                                                        label="Start Date"
                                                        type="date"
                                                        className="h-8 text-[12px] border-slate-300 focus:border-[#ff4a1f] rounded"
                                                    />
                                                    <Input
                                                        label="End Date"
                                                        type="date"
                                                        className="h-8 text-[12px] border-slate-300 focus:border-[#ff4a1f] rounded"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                <div className="flex justify-end pt-2">
                                    <Button variant="primary" className="h-8.5 text-[12px] px-6 shadow-xs bg-[#ff4a1f] hover:bg-[#e63d15] cursor-pointer" onClick={() => setActiveTab('hours')}>
                                        Next: Set Business Hours
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'hours' && (
                            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                                <TabHeader title="Business Hours Setup" icon={Clock} />
                                <Card className="shadow-2xs border-slate-200 h-full">
                                    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                                        <CardTitle className="text-[13px] font-bold flex items-center gap-2">
                                            <Clock size={14} className="text-[#ff4a1f]" />
                                            Daily Time Slots
                                        </CardTitle>
                                        <Button variant="ghost" className="h-7 text-[11px] text-[#ff4a1f] font-semibold px-2.5 hover:bg-orange-50 cursor-pointer">
                                            Copy Monday to All
                                        </Button>
                                    </CardHeader>
                                    
                                    <CardContent className="p-4 sm:p-5">
                                        {scheduleType === 'recurring' ? (
                                            /* Ultra-Minimal 2-Column Split Table (No Cards, No Plus Icons) */
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                                
                                                {/* Left Column - 4 Days (Mon, Tue, Wed, Thu) */}
                                                <div className="space-y-1">
                                                    <div className="grid grid-cols-[90px_1fr_1fr] gap-3 px-3 py-2 bg-slate-50/90 rounded-md border border-slate-200/60 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                        <span>Day</span>
                                                        <span>Start Time</span>
                                                        <span>End Time</span>
                                                    </div>
                                                    
                                                    <div className="space-y-1">
                                                        {leftColumnDays.map((day, idx) => (
                                                            <div key={day} className={`grid grid-cols-[90px_1fr_1fr] gap-3 items-center px-3 py-1.5 rounded-md hover:bg-slate-50/80 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <Switch defaultChecked={true} />
                                                                    <span className="text-[12px] font-bold text-slate-800">{day.substring(0, 3)}</span>
                                                                </div>

                                                                <div>
                                                                    <Input 
                                                                        type="time" 
                                                                        defaultValue="08:00" 
                                                                        className="w-full h-8 text-[11.5px] font-semibold text-slate-800 rounded border border-slate-200 px-2 bg-white focus:outline-none focus:border-[#ff4a1f] transition-colors" 
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Input 
                                                                        type="time" 
                                                                        defaultValue="18:00" 
                                                                        className="w-full h-8 text-[11.5px] font-semibold text-slate-800 rounded border border-slate-200 px-2 bg-white focus:outline-none focus:border-[#ff4a1f] transition-colors" 
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right Column - 3 Days (Fri, Sat, Sun) */}
                                                <div className="space-y-1">
                                                    <div className="grid grid-cols-[90px_1fr_1fr] gap-3 px-3 py-2 bg-slate-50/90 rounded-md border border-slate-200/60 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                        <span>Day</span>
                                                        <span>Start Time</span>
                                                        <span>End Time</span>
                                                    </div>
                                                    
                                                    <div className="space-y-1">
                                                        {rightColumnDays.map((day, idx) => (
                                                            <div key={day} className={`grid grid-cols-[90px_1fr_1fr] gap-3 items-center px-3 py-1.5 rounded-md hover:bg-slate-50/80 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                                                <div className="flex items-center gap-2">
                                                                    <Switch defaultChecked={day === 'Friday'} />
                                                                    <span className="text-[12px] font-bold text-slate-800">{day.substring(0, 3)}</span>
                                                                </div>

                                                                <div>
                                                                    <Input 
                                                                        type="time" 
                                                                        defaultValue="08:00" 
                                                                        className="w-full h-8 text-[11.5px] font-semibold text-slate-800 rounded border border-slate-200 px-2 bg-white focus:outline-none focus:border-[#ff4a1f] transition-colors" 
                                                                    />
                                                                </div>

                                                                <div>
                                                                    <Input 
                                                                        type="time" 
                                                                        defaultValue="18:00" 
                                                                        className="w-full h-8 text-[11.5px] font-semibold text-slate-800 rounded border border-slate-200 px-2 bg-white focus:outline-none focus:border-[#ff4a1f] transition-colors" 
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                        ) : (
                                            <div className="p-12 flex flex-col items-center justify-center text-center text-slate-500">
                                                <Calendar size={32} className="text-slate-300 mb-3" />
                                                <p className="text-[13px] font-semibold text-slate-700">Specific Dates Mode</p>
                                                <p className="text-[11px] mt-1 max-w-sm">You have selected to create a schedule for specific dates. You can define exact calendar days and their working hours below.</p>
                                                <Button variant="outline" className="mt-4 h-8 text-[12px] gap-2 cursor-pointer">
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
