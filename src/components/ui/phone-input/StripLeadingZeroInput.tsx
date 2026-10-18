import React, { useMemo } from 'react';

export const StripLeadingZeroInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ value, onChange, onKeyDown, ...props }, ref) => {
        const displayValue = useMemo(() => {
            if (typeof value !== 'string') return value;
            if (value.startsWith('0')) {
                return value.replace(/^0+/, '');
            }
            return value;
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let val = e.target.value;
            if (val.startsWith('0')) {
                val = val.replace(/^0+/, '');
                e.target.value = val;
            }
            if (onChange) {
                onChange(e);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === '0' && (!e.currentTarget.value || e.currentTarget.selectionStart === 0)) {
                e.preventDefault();
                return;
            }
            if (onKeyDown) {
                onKeyDown(e);
            }
        };

        return (
            <input
                ref={ref}
                {...props}
                value={displayValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
        );
    }
);

StripLeadingZeroInput.displayName = 'StripLeadingZeroInput';
