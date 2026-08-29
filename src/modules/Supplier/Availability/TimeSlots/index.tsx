import React, { useState } from 'react';
import { Plus, Clock, Trash2, Edit2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import FormLabel from '@/components/ui/label';
import DataTable, { Column } from '@/components/tables/data-table';

type TimeSlotItem = {
    id: string;
    slotName: string;
    timeWindow: string;
    maxBookingsPerDay: number;
    cutoffHours: string;
    status: 'Active' | 'Inactive';
};

export default function TimeSlots() {
    const [slots, setSlots] = useState<TimeSlotItem[]>([
        { id: '1', slotName: 'Early Morning Express', timeWindow: '06:00 AM - 10:00 AM', maxBookingsPerDay: 5, cutoffHours: '12 hrs before', status: 'Active' },
        { id: '2', slotName: 'Standard Morning Slot', timeWindow: '08:00 AM - 12:00 PM', maxBookingsPerDay: 12, cutoffHours: '6 hrs before', status: 'Active' },
        { id: '3', slotName: 'Afternoon Delivery Slot', timeWindow: '02:00 PM - 06:00 PM', maxBookingsPerDay: 10, cutoffHours: '4 hrs before', status: 'Active' },
        { id: '4', slotName: 'Night Cargo Dispatch', timeWindow: '09:00 PM - 02:00 AM', maxBookingsPerDay: 4, cutoffHours: '8 hrs before', status: 'Inactive' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [slotName, setSlotName] = useState('');
    const [timeWindow, setTimeWindow] = useState('');
    const [maxBookings, setMaxBookings] = useState('');
    const [cutoff, setCutoff] = useState('');

    const handleAddSlot = (e: React.FormEvent) => {
        e.preventDefault();
        const created: TimeSlotItem = {
            id: String(Date.now()),
            slotName,
            timeWindow,
            maxBookingsPerDay: Number(maxBookings) || 5,
            cutoffHours: cutoff,
            status: 'Active',
        };
        setSlots([created, ...slots]);
        setShowModal(false);
        setSlotName(''); setTimeWindow(''); setMaxBookings(''); setCutoff('');
    };

    const columns: Column<TimeSlotItem>[] = [
        { 
            id: 'slotName', 
            label: 'Slot Name', 
            render: (r) => (
                <div className="flex items-center gap-2">
                    <Clock size={15} className="text-[#ff4a1f]" />
                    <span className="font-bold text-slate-900">{r.slotName}</span>
                </div>
            )
        },
        { 
            id: 'timeWindow', 
            label: 'Allowed Time Window', 
            render: (r) => <span className="font-semibold text-slate-800 text-xs">{r.timeWindow}</span> 
        },
        { 
            id: 'maxBookingsPerDay', 
            label: 'Max Daily Capacity', 
            render: (r) => <span className="font-bold text-slate-900 text-xs">{r.maxBookingsPerDay} Shipments</span> 
        },
        { 
            id: 'cutoffHours', 
            label: 'Booking Cut-off', 
            render: (r) => <span className="text-slate-600 text-xs">{r.cutoffHours}</span> 
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (r) => (
                <Badge variant="secondary" className={
                    r.status === 'Active' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-slate-100 text-slate-600 font-semibold'
                }>
                    {r.status}
                </Badge>
            )
        },
    ];

    const renderActions = (row: TimeSlotItem) => (
        <div className="flex items-center justify-end gap-1">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-slate-800"
                onClick={() => alert(`Edit slot ${row.slotName}`)}
            >
                <Edit2 size={13} />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-slate-400 hover:text-red-600"
                onClick={() => setSlots(slots.filter(s => s.id !== row.id))}
            >
                <Trash2 size={13} />
            </Button>
        </div>
    );

    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5 bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Time Slots & Schedule Windows</h1>
                    <p className="text-xs text-slate-500 font-medium">Configure allowed pickup and delivery time windows and daily volume limits.</p>
                </div>
                <Button variant="primary" size="sm" className="h-9 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03e15] text-white" onClick={() => setShowModal(true)}>
                    <Plus size={13} className="mr-1.5" /> Add Time Slot
                </Button>
            </div>

            <DataTable 
                columns={columns} 
                data={slots} 
                compact={true}
                searchPlaceholder="Search time slots..."
                hideViewToggle={true}
                actions={renderActions}
            />

            {/* Add Time Slot Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleAddSlot} className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-200 shadow-md space-y-4">
                        <h3 className="text-sm font-bold text-slate-900">Define New Time Slot</h3>
                        
                        <div className="space-y-3">
                            <div>
                                <FormLabel className="text-xs">Slot Name</FormLabel>
                                <Input required placeholder="e.g. Afternoon Delivery Slot" className="text-xs h-8" value={slotName} onChange={e => setSlotName(e.target.value)} />
                            </div>
                            <div>
                                <FormLabel className="text-xs">Time Range (e.g. 02:00 PM - 06:00 PM)</FormLabel>
                                <Input required placeholder="02:00 PM - 06:00 PM" className="text-xs h-8" value={timeWindow} onChange={e => setTimeWindow(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <FormLabel className="text-xs">Max Bookings / Day</FormLabel>
                                    <Input required type="number" placeholder="10" className="text-xs h-8" value={maxBookings} onChange={e => setMaxBookings(e.target.value)} />
                                </div>
                                <div>
                                    <FormLabel className="text-xs">Cut-off Notice</FormLabel>
                                    <Input required placeholder="e.g. 6 hrs before" className="text-xs h-8" value={cutoff} onChange={e => setCutoff(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-200">
                            <Button variant="outline" size="sm" type="button" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" size="sm" type="submit" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                                Save Time Slot
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
