import React from 'react';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export default function SearchBar({ className = '', ...props }: SearchBarProps) {
    return (
        <div className={`relative ${className}`}>
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                🔍
            </span>
            <input 
                type="text" 
                placeholder="Search..." 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out" 
                {...props} 
            />
        </div>
    );
}
