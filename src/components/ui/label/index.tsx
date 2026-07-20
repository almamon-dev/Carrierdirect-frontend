import React from 'react';
import { cn } from '@/lib/utils';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export default function FormLabel({ children, required, className, ...props }: FormLabelProps) {
    return (
        <label className={cn("text-[13px] font-bold text-slate-700 mb-1.5 block", className)} {...props}>
            {children} {required && <span className="text-red-500">*</span>}
        </label>
    );
}
