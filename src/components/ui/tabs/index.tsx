import React, { useState } from 'react';

export interface TabsProps {
    className?: string;
    tabs?: string[];
}

export default function Tabs({ className = '', tabs = ['Tab 1', 'Tab 2', 'Tab 3'] }: TabsProps) {
    const [active, setActive] = useState(0);
    return (
        <div className={`w-full ${className}`}>
            <div className="flex border-b border-gray-200">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        className={`px-4 py-2 font-medium text-sm transition-colors ${active === i ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActive(i)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-white">
                Content for {tabs[active]}
            </div>
        </div>
    );
}
