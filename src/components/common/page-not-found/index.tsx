import React from 'react';

export interface PageNotFoundProps {
    className?: string;
}

export default function PageNotFound({ className = '' }: PageNotFoundProps) {
    return (
        <div className={`min-h-[400px] flex flex-col items-center justify-center text-center px-4 ${className}`}>
            <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
            <p className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</p>
            <p className="text-gray-500 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
            <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
                Go Back Home
            </button>
        </div>
    );
}
