import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordSuccessView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="text-center py-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Reset Successfully!</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Your password has been updated successfully. You can now log in using your new credentials.
            </p>

            <button
                type="button"
                onClick={() => navigate('/web/login')}
                className="w-full h-[42px] flex items-center justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#FF4A1F] hover:bg-[#E03E15] transition-all cursor-pointer"
            >
                Back to Log In
            </button>
        </div>
    );
};
