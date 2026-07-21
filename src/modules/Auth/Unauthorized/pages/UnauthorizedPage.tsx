import React from 'react';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <div>
                    <h2 className="text-[15px] font-bold text-slate-800 mt-6 text-center">
                        Unauthorized
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please fill in your details to continue.
                    </p>
                </div>
            </div>
        </div>
    );
}
