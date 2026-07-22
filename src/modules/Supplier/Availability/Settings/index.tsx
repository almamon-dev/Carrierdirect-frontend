import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Switch from '@/components/ui/switch';
import Select from '@/components/ui/select';
import { Clock, Calendar, ShieldAlert, Zap, Bell, Save } from 'lucide-react';

export default function AvailabilitySettings() {
    const [selectedDay, setSelectedDay] = useState('Mon');
    const [workingHours, setWorkingHours] = useState({
        Mon: { active: true, start: '08:00', end: '18:00', break: '1' },
        Tue: { active: true, start: '08:00', end: '18:00', break: '1' },
        Wed: { active: true, start: '08:00', end: '18:00', break: '1' },
        Thu: { active: true, start: '08:00', end: '18:00', break: '1' },
        Fri: { active: true, start: '08:00', end: '18:00', break: '1' },
        Sat: { active: true, start: '10:00', end: '14:00', break: '0' },
        Sun: { active: false, start: '00:00', end: '00:00', break: '0' },
    });

    const handleUpdateDay = (field: string, value: any) => {
        setWorkingHours(prev => ({
            ...prev,
            [selectedDay]: { ...prev[selectedDay as keyof typeof prev], [field]: value }
        }));
    };

    // Generate real timezones using the native browser Intl API
    const timezones = React.useMemo(() => {
        try {
            const zones = (Intl as any).supportedValuesOf('timeZone');
            return zones.map((tz: string) => ({
                id: tz,
                name: tz.replace(/_/g, ' ')
            }));
        } catch (e) {
            return [
                { id: 'Europe/London', name: 'Europe/London (GMT)' },
                { id: 'Europe/Berlin', name: 'Europe/Berlin (CET)' },
                { id: 'America/New_York', name: 'America/New York (EST)' }
            ];
        }
    }, []);

    return (
        <div className="p-4 w-full mx-auto space-y-4 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">Availability Settings</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">Configure global rules, working hours, capacity limits, and automations.</p>
                </div>
                <Button variant="primary" className="h-8 text-[12px] px-4 gap-2 shadow-sm">
                    <Save size={14} />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Left Column: General Rules */}
                <div className="lg:col-span-2 space-y-4">
                    
                    {/* Working Hours & Days */}
                    <Card className="shadow-sm border-slate-200 overflow-visible">
                        <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center gap-2">
                            <Clock size={14} className="text-brand" />
                            <CardTitle className="text-[13px]">Working Hours & Days</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {/* Day Tabs */}
                            <div>
                                <label className="text-[11px] font-bold text-slate-700 mb-2 block">Select Day to Configure</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                                        const isActiveDay = workingHours[day as keyof typeof workingHours].active;
                                        return (
                                            <button 
                                                key={day} 
                                                onClick={() => setSelectedDay(day)}
                                                className={`flex items-center justify-center px-3 py-1.5 rounded-[3px] text-[11px] font-bold transition-colors ${selectedDay === day ? 'bg-[#FF4A1F] text-white shadow-sm' : isActiveDay ? 'bg-[#FFF0ED] text-[#FF4A1F] hover:bg-[#ffe4de]' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Configuration Panel for Selected Day */}
                            <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-sm space-y-2">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-0.5">
                                    <div>
                                        <h4 className="text-[13px] font-bold text-slate-800">Settings for {selectedDay}</h4>
                                        <p className="text-[10px] text-slate-500">Configure hours specifically for {selectedDay}days.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-slate-600">Working Day</span>
                                        <div onClickCapture={(e) => { e.preventDefault(); e.stopPropagation(); handleUpdateDay('active', !workingHours[selectedDay as keyof typeof workingHours].active); }}>
                                            <Switch 
                                                defaultChecked={workingHours[selectedDay as keyof typeof workingHours].active}
                                                key={`${selectedDay}-${workingHours[selectedDay as keyof typeof workingHours].active}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700">Start Time</label>
                                        <input 
                                            type="time" 
                                            value={workingHours[selectedDay as keyof typeof workingHours].start} 
                                            onChange={(e) => handleUpdateDay('start', e.target.value)}
                                            disabled={!workingHours[selectedDay as keyof typeof workingHours].active}
                                            className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700">End Time</label>
                                        <input 
                                            type="time" 
                                            value={workingHours[selectedDay as keyof typeof workingHours].end} 
                                            onChange={(e) => handleUpdateDay('end', e.target.value)}
                                            disabled={!workingHours[selectedDay as keyof typeof workingHours].active}
                                            className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-slate-700">Break Hours</label>
                                        <input 
                                            type="number" 
                                            value={workingHours[selectedDay as keyof typeof workingHours].break} 
                                            onChange={(e) => handleUpdateDay('break', e.target.value)}
                                            disabled={!workingHours[selectedDay as keyof typeof workingHours].active}
                                            className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700">Global Time Zone</label>
                                <div className="w-full h-8">
                                    <Select 
                                        value="Europe/London"
                                        options={timezones}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Booking & Capacity Rules */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center gap-2">
                            <ShieldAlert size={14} className="text-amber-600" />
                            <CardTitle className="text-[13px]">Booking & Capacity Rules</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-3">
                                
                                {/* Capacity */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 truncate" title="Max Orders Per Slot">Max Orders</label>
                                    <input type="number" defaultValue="5" className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 truncate" title="Max Trips Per Day">Max Trips</label>
                                    <input type="number" defaultValue="20" className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 truncate" title="Max Weight Capacity (kg)">Max Wt (kg)</label>
                                    <input type="number" defaultValue="3500" className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500" />
                                </div>

                                {/* Booking */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 truncate" title="Advance Booking Limit (Days)">Adv. Limit</label>
                                    <input type="number" defaultValue="30" className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 truncate" title="Same Day Booking Cutoff">Cutoff Time</label>
                                    <input type="time" defaultValue="14:00" className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 truncate" title="Buffer Between Trips (Mins)">Trip Buffer</label>
                                    <input type="number" defaultValue="30" className="w-full h-8 rounded-[3px] border border-slate-200 px-3 text-[12px] text-slate-800 outline-none focus:border-indigo-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Automation & Notifications */}
                <div className="space-y-4">
                    
                    {/* Auto Availability */}
                    <Card className="shadow-sm border-slate-200 bg-slate-50/50">
                        <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center gap-2">
                            <Zap size={14} className="text-emerald-600" />
                            <CardTitle className="text-[13px]">Automation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {[
                                { title: "Auto Repeat Weekly", desc: "Automatically clone schedules to the next week.", active: true },
                                { title: "Auto Approve Schedule", desc: "Approve driver shift requests automatically.", active: false },
                                { title: "Auto Close Full Capacity", desc: "Block dates when Max Trips is reached.", active: true },
                                { title: "Auto Block Holidays", desc: "Automatically block public holidays.", active: true }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Switch defaultChecked={item.active} />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-slate-800 leading-tight">{item.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="shadow-sm border-slate-200 bg-slate-50/50">
                        <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center gap-2">
                            <Bell size={14} className="text-brand" />
                            <CardTitle className="text-[13px]">Notifications</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {[
                                { title: "Schedule Reminders", desc: "Send drivers their shifts 24h prior." },
                                { title: "Capacity Alerts", desc: "Notify when capacity reaches 90%." },
                                { title: "Booking Notifications", desc: "Email on new confirmed bookings." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 flex items-center h-4">
                                        <Switch defaultChecked />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-slate-800 leading-tight">{item.title}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
