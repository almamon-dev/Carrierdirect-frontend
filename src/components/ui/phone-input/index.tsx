import React, { useMemo } from 'react';
import PhoneInputWithCountry, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './phone-input.css';
import enLabels from 'react-phone-number-input/locale/en.json';
import { cn } from '@/lib/utils';
import {
    CountryOption,
    PhoneInputProps,
    getFlagEmoji,
    resolveCountry
} from './phoneInputConstants';
import { CustomCountrySelect } from './CustomCountrySelect';
import { StripLeadingZeroInput } from './StripLeadingZeroInput';

export type { CountryOption, PhoneInputProps };

export const PhoneInput: React.FC<PhoneInputProps> = ({
    name = 'phone',
    value = '',
    onChange,
    onCountryChange,
    country,
    defaultCountry = 'BD',
    placeholder = '1711-234567',
    disabled = false,
    error,
    label,
    className,
    id
}) => {
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : name);

    const resolvedCountry = useMemo(() => resolveCountry(country), [country]);
    const resolvedDefault = useMemo(() => resolveCountry(defaultCountry) || 'BD', [defaultCountry]);

    const handleValueChange = (newVal?: string) => {
        const fullString = newVal || '';

        if (onChange) {
            onChange({
                target: {
                    name,
                    value: fullString
                }
            });
        }

        if (onCountryChange && fullString) {
            try {
                const parsed = parsePhoneNumber(fullString);
                if (parsed && parsed.country) {
                    const countryName = (enLabels as Record<string, string>)[parsed.country] || parsed.country;
                    onCountryChange({
                        code: parsed.country,
                        name: countryName,
                        callingCode: `+${parsed.countryCallingCode}`,
                        flag: getFlagEmoji(parsed.country)
                    });
                }
            } catch {
                // Ignore parse errors while typing
            }
        }
    };

    const renderLabel = (labelStr: string) => {
        if (labelStr.endsWith('*')) {
            const baseText = labelStr.slice(0, -1).trim();
            return (
                <>
                    {baseText} <span className="text-red-500 font-bold ml-0.5">*</span>
                </>
            );
        }
        return labelStr;
    };

    return (
        <div className={cn("flex flex-col gap-1 w-full font-sans antialiased", className)}>
            {label && (
                <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 font-sans">
                    {renderLabel(label)}
                </label>
            )}

            <div className={cn("custom-phone-input-wrapper w-full", error && "has-error")}>
                <PhoneInputWithCountry
                    id={inputId}
                    name={name}
                    value={value || undefined}
                    onChange={handleValueChange}
                    country={resolvedCountry}
                    defaultCountry={resolvedDefault}
                    countrySelectComponent={CustomCountrySelect as any}
                    inputComponent={StripLeadingZeroInput}
                    international={false}
                    disabled={disabled}
                    placeholder={placeholder}
                    labels={enLabels}
                    className="w-full"
                />
            </div>

            {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
        </div>
    );
};

export default PhoneInput;
