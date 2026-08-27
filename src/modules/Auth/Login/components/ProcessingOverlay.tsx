import React from 'react';

interface ProcessingOverlayProps {
    userType: string | null;
}

export default function ProcessingOverlay({ userType }: ProcessingOverlayProps) {
    const label =
        userType === 'supplier'
            ? 'Redirecting to Supplier Dashboard…'
            : userType === 'admin'
                ? 'Redirecting to Admin Panel…'
                : 'Redirecting to Customer Dashboard…';

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#0e1117]">
            {/* Animated ring */}
            <div className="relative flex items-center justify-center mb-8">
                {/* Outer slow pulse ring */}
                <span className="absolute inline-flex h-24 w-24 rounded-full bg-[#FF4A1F] opacity-10 animate-ping" />
                {/* Spinner ring */}
                <svg
                    className="animate-spin h-16 w-16 text-[#FF4A1F]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                    <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
                {/* Center logo dot */}
                <span className="absolute h-8 w-8 rounded-full bg-[#FF4A1F] flex items-center justify-center shadow-lg">
                    <span className="h-3 w-3 rounded-full bg-white" />
                </span>
            </div>

            <h2 className="text-slate-800 dark:text-white text-lg font-bold tracking-tight mb-1">
                Login Successful!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                {label}
            </p>

            {/* Progress bar */}
            <div className="mt-8 w-48 h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF4A1F] rounded-full animate-[progress_1.2s_ease-in-out_forwards]" />
            </div>

            <style>{`
                @keyframes progress {
                    from { width: 0% }
                    to   { width: 100% }
                }
            `}</style>
        </div>
    );
}
