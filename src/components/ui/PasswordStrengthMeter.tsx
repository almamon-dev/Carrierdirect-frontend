import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
    password: string;
    confirmPassword?: string;
    showMatchStatus?: boolean;
}

export const PasswordMatchIndicator: React.FC<{
    password: string;
    confirmPassword?: string;
}> = ({ password, confirmPassword }) => {
    if (!confirmPassword || confirmPassword.length === 0) {
        return null;
    }

    const isMatching = password.length > 0 && password === confirmPassword;

    return (
        <div
            className={`flex items-center gap-1.5 mt-1.5 text-[11px] font-medium transition-colors ${
                isMatching
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-500 dark:text-rose-400'
            }`}
        >
            <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isMatching
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400'
                }`}
            >
                {isMatching ? (
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                ) : (
                    <X className="w-2 h-2 stroke-[2.5]" />
                )}
            </span>
            <span>{isMatching ? 'Passwords match' : 'Passwords do not match'}</span>
        </div>
    );
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
    password,
    confirmPassword,
    showMatchStatus = true,
}) => {
    if (!password && (!confirmPassword || confirmPassword.length === 0)) {
        return null;
    }

    const rules = [
        { key: 'length', label: '8+ chars', valid: password.length >= 8 },
        { key: 'uppercase', label: 'Uppercase', valid: /[A-Z]/.test(password) },
        { key: 'lowercase', label: 'Lowercase', valid: /[a-z]/.test(password) },
        { key: 'number', label: 'Number', valid: /[0-9]/.test(password) },
        { key: 'symbol', label: 'Symbol', valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const passedCount = rules.filter((r) => r.valid).length;

    const getStrengthConfig = () => {
        if (passedCount <= 2) {
            return {
                step: 1,
                label: 'Weak',
                barColor: 'bg-rose-500',
                textColor: 'text-rose-500 dark:text-rose-400',
            };
        }
        if (passedCount === 3) {
            return {
                step: 2,
                label: 'Fair',
                barColor: 'bg-amber-500',
                textColor: 'text-amber-500 dark:text-amber-400',
            };
        }
        if (passedCount === 4) {
            return {
                step: 3,
                label: 'Good',
                barColor: 'bg-blue-500',
                textColor: 'text-blue-500 dark:text-blue-400',
            };
        }
        return {
            step: 4,
            label: 'Excellent',
            barColor: 'bg-emerald-500',
            textColor: 'text-emerald-500 dark:text-emerald-400',
        };
    };

    const strength = getStrengthConfig();
    const hasConfirm = typeof confirmPassword === 'string' && confirmPassword.length > 0;

    return (
        <div className="mt-1.5 space-y-1.5 text-xs">
            {password.length > 0 && (
                <div>
                    {/* Header: Label + Strength level */}
                    <div className="flex items-center justify-between mb-1 text-[11px] font-medium">
                        <span className="text-gray-400 dark:text-gray-500">Strength:</span>
                        <span className={`font-bold ${strength.textColor}`}>{strength.label}</span>
                    </div>

                    {/* Sleek Segmented Progress Bars (Weak -> Fair -> Good -> Excellent) */}
                    <div className="grid grid-cols-4 gap-1.5 h-1 w-full my-1">
                        {[1, 2, 3, 4].map((stepNumber) => (
                            <div
                                key={stepNumber}
                                className={`h-full rounded-full transition-all duration-300 ${
                                    strength.step >= stepNumber
                                        ? strength.barColor
                                        : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Compact Clean Requirement Chips / Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {rules.map((rule) => (
                            <span
                                key={rule.key}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] transition-all ${
                                    rule.valid
                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-medium border border-emerald-200/50 dark:border-emerald-800/40'
                                        : 'bg-slate-50 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500 border border-slate-200/50 dark:border-slate-700/40'
                                }`}
                            >
                                {rule.valid ? (
                                    <Check className="w-2.5 h-2.5 stroke-[2.5] text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                )}
                                <span>{rule.label}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Optional integrated match status (if confirmPassword is passed to same component) */}
            {showMatchStatus && hasConfirm && (
                <PasswordMatchIndicator password={password} confirmPassword={confirmPassword} />
            )}
        </div>
    );
};

export default PasswordStrengthMeter;
