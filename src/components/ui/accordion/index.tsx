import React, { useState } from 'react';

export interface AccordionProps {
    className?: string;
    items?: { title: string; content: React.ReactNode }[];
}

export default function Accordion({ className = '', items = [] }: AccordionProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    return (
        <div className={`space-y-2 ${className}`}>
            {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                    <button 
                        className="w-full text-left px-4 py-3 font-medium bg-white hover:bg-gray-50 flex justify-between items-center transition-colors"
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    >
                        {item.title}
                        <span className={`transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {activeIndex === index && (
                        <div className="px-4 py-3 text-gray-600 bg-white border-t border-gray-200">
                            {item.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
