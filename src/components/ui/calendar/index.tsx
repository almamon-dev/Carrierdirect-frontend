import React from 'react';

export interface CalendarProps {
    className?: string;
}

export default function Calendar({ className = '' }: CalendarProps) {
    return (
        <div className={`p-4 border rounded-md shadow-sm bg-white ${className}`}>
            <div className="text-center font-medium mb-4">Calendar</div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-gray-500 font-medium">{d}</div>)}
                {Array.from({length: 31}).map((_, i) => (
                    <div key={i} className="p-2 hover:bg-gray-100 rounded cursor-pointer">{i + 1}</div>
                ))}
            </div>
        </div>
    );
}
