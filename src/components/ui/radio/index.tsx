import React from 'react';

export interface RadioProps {
    className?: string;
    label?: string;
    name?: string;
}

export default function Radio({ className = '', label = 'Radio option', name = 'radio-group' }: RadioProps) {
    return (
        <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
            <input type="radio" name={name} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    );
}
