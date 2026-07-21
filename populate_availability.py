import os

base_dir = r"c:\Users\mamun\Herd\new persona\getitmovin-frontend\src\modules\Supplier\Availability"

modules = {
    "AvailabilitySchedule": {
        "title": "Availability Schedule",
        "desc": "Manage your regular and recurring working schedules.",
        "columns": "[{ id: 'id', label: 'ID', render: (r: any) => <span className='font-semibold text-slate-800'>{r.id}</span> }, { id: 'type', label: 'Type' }, { id: 'days', label: 'Working Days' }, { id: 'hours', label: 'Hours' }, { id: 'status', label: 'Status', render: (r: any) => <span className='text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded'>{r.status}</span> }]",
        "data": "[{ id: 'SCH-001', type: 'Recurring Weekly', days: 'Mon-Fri', hours: '08:00 AM - 06:00 PM', status: 'Active' }, { id: 'SCH-002', type: 'Weekend', days: 'Sat', hours: '09:00 AM - 02:00 PM', status: 'Active' }]"
    },
    "Routes": {
        "title": "Routes Management",
        "desc": "Define and manage your service routes and zones.",
        "columns": "[{ id: 'code', label: 'Route Code', render: (r: any) => <span className='font-semibold text-slate-800'>{r.code}</span> }, { id: 'pickup', label: 'Pickup Zone' }, { id: 'delivery', label: 'Delivery Zone' }, { id: 'distance', label: 'Distance' }, { id: 'status', label: 'Status', render: (r: any) => <span className='text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded'>{r.status}</span> }]",
        "data": "[{ code: 'RT-LDN-PRS', pickup: 'London, UK', delivery: 'Paris, FR', distance: '470 km', status: 'Active' }, { code: 'RT-BER-MUN', pickup: 'Berlin, DE', delivery: 'Munich, DE', distance: '580 km', status: 'Active' }]"
    },
    "DriversAvailability": {
        "title": "Drivers Availability",
        "desc": "Track and manage the availability of your driving team.",
        "columns": "[{ id: 'driver', label: 'Driver Name', render: (r: any) => <span className='font-semibold text-slate-800'>{r.driver}</span> }, { id: 'assigned', label: 'Assigned Trips' }, { id: 'shift', label: 'Current Shift' }, { id: 'status', label: 'Status', render: (r: any) => <span className='text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded'>{r.status}</span> }]",
        "data": "[{ driver: 'John Smith', assigned: '3 Trips', shift: 'Morning', status: 'Available' }, { driver: 'Sarah Connor', assigned: '1 Trip', shift: 'Afternoon', status: 'On Trip' }, { driver: 'Mike Davis', assigned: '0 Trips', shift: 'Off', status: 'Off Duty' }]"
    },
    "VehiclesAvailability": {
        "title": "Vehicles Availability",
        "desc": "Monitor your fleet capacity and maintenance schedules.",
        "columns": "[{ id: 'vehicle', label: 'Vehicle', render: (r: any) => <span className='font-semibold text-slate-800'>{r.vehicle}</span> }, { id: 'type', label: 'Type' }, { id: 'capacity', label: 'Capacity' }, { id: 'status', label: 'Status', render: (r: any) => <span className='text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded'>{r.status}</span> }]",
        "data": "[{ vehicle: 'Ford Transit - ABC 123', type: 'Van', capacity: '1500 kg', status: 'Available' }, { vehicle: 'Mercedes Sprinter - XYZ 789', type: 'Large Van', capacity: '2000 kg', status: 'Maintenance' }]"
    },
    "BlackoutDates": {
        "title": "Blackout Dates",
        "desc": "Set specific dates where operations are paused.",
        "columns": "[{ id: 'date', label: 'Date Range', render: (r: any) => <span className='font-semibold text-slate-800'>{r.date}</span> }, { id: 'type', label: 'Type' }, { id: 'reason', label: 'Reason' }, { id: 'impact', label: 'Impact', render: (r: any) => <span className='text-[10px] bg-red-50 text-red-700 px-2 py-1 rounded'>{r.impact}</span> }]",
        "data": "[{ date: 'Dec 24 - Dec 26', type: 'Public Holiday', reason: 'Christmas Break', impact: 'Full Closure' }, { date: 'Aug 15', type: 'Company Event', reason: 'Annual Retreat', impact: 'Partial Closure' }]"
    },
    "TimeSlots": {
        "title": "Time Slots",
        "desc": "Configure standard operational windows for bookings.",
        "columns": "[{ id: 'slot', label: 'Time Slot', render: (r: any) => <span className='font-semibold text-slate-800'>{r.slot}</span> }, { id: 'duration', label: 'Duration' }, { id: 'max_orders', label: 'Max Orders' }, { id: 'status', label: 'Status', render: (r: any) => <span className='text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded'>{r.status}</span> }]",
        "data": "[{ slot: '08:00 AM - 10:00 AM', duration: '2 Hours', max_orders: '5', status: 'Active' }, { slot: '10:00 AM - 12:00 PM', duration: '2 Hours', max_orders: '5', status: 'Active' }]"
    },
    "CapacityManagement": {
        "title": "Capacity Management",
        "desc": "Monitor and adjust your operational limits.",
        "columns": "[{ id: 'metric', label: 'Metric', render: (r: any) => <span className='font-semibold text-slate-800'>{r.metric}</span> }, { id: 'limit', label: 'Maximum Limit' }, { id: 'current', label: 'Current Usage' }, { id: 'status', label: 'Health', render: (r: any) => <span className='text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded'>{r.status}</span> }]",
        "data": "[{ metric: 'Daily Trips', limit: '20 Trips', current: '15 Trips', status: 'Healthy' }, { metric: 'Daily Weight Vol.', limit: '10,000 kg', current: '9,500 kg', status: 'Warning' }]"
    },
    "Settings": {
        "title": "Availability Settings",
        "desc": "Configure global rules, working hours, and automation.",
        "columns": "[{ id: 'setting', label: 'Configuration Rule', render: (r: any) => <span className='font-semibold text-slate-800'>{r.setting}</span> }, { id: 'value', label: 'Current Value' }, { id: 'category', label: 'Category' }, { id: 'status', label: 'Status', render: (r: any) => <span className='text-[10px] bg-slate-100 text-slate-700 px-2 py-1 rounded'>{r.status}</span> }]",
        "data": "[{ setting: 'Advance Booking Limit', value: '30 Days', category: 'Booking Rules', status: 'Enabled' }, { setting: 'Buffer Time Between Trips', value: '30 Minutes', category: 'Time Rules', status: 'Enabled' }]"
    }
}

for module_name, config in modules.items():
    dir_path = os.path.join(base_dir, module_name)
    os.makedirs(dir_path, exist_ok=True)
    
    file_path = os.path.join(dir_path, "index.tsx")
    
    content = f"""import React from 'react';
import {{ Card, CardHeader, CardTitle, CardContent }} from '@/components/ui/card';
import Button from '@/components/ui/button';
import DataTable from '@/components/tables/data-table';
import {{ Plus, Download }} from 'lucide-react';

export default function {module_name}() {{
    const data = {config['data']};
    const columns = {config['columns']};

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-[18px] font-bold text-slate-900">{config['title']}</h1>
                    <p className="text-[12px] text-slate-500 mt-0.5">{config['desc']}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
                        <Download size={{14}} />
                        Export
                    </Button>
                    <Button variant="primary" className="h-8 text-[12px] px-3 gap-1.5 shadow-sm">
                        <Plus size={{14}} />
                        Create New
                    </Button>
                </div>
            </div>

            <Card className="flex flex-col shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4 border-b border-slate-100">
                    <CardTitle className="text-[13px]">Overview</CardTitle>
                </CardHeader>
                <div className="p-0 flex-1">
                    <DataTable 
                        columns={{columns}} 
                        data={{data}} 
                        hideViewToggle={{true}}
                        searchPlaceholder="Search records..."
                    />
                </div>
            </Card>
        </div>
    );
}}
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("All module pages successfully populated with complete UI elements.")
