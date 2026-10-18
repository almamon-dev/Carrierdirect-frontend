import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResetPasswordInvalidLinkView: React.FC = () => {
    return (
        <div className="text-center py-6">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid Reset Link</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
                The password reset link appears to be missing required verification parameters. Please request a fresh reset link.
            </p>
            <Link
                to="/web/forgot-password"
                className="w-full h-[42px] flex items-center justify-center px-4 rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] transition-all cursor-pointer"
            >
                Request New Reset Link
            </Link>
        </div>
    );
};
