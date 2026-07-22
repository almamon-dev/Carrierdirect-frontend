import React from 'react';

export interface TimePickerProps {
    className?: string;
}

export default function TimePicker({ className = '' }: TimePickerProps) {
    return (
        <div className={`relative ${className}`}>
            <input type="time" className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
    );
}
