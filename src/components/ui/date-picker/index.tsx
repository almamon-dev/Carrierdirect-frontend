import React from 'react';

export interface DatePickerProps {
    className?: string;
}

export default function DatePicker({ className = '' }: DatePickerProps) {
    return (
        <div className={`relative ${className}`}>
            <input type="date" className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
    );
}
