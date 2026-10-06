import React from "react";

interface VerifiedBadgeProps {
    size?: number;
    className?: string;
    title?: string;
    variant?: "emerald" | "blue" | "primary";
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
    size = 14,
    className = "",
    title = "Verified Account",
    variant = "emerald"
}) => {
    const fillColor = variant === "blue" ? "#2563EB" : variant === "primary" ? "#FF4A1F" : "#10B981";

    return (
        <span
            title={title}
            className={`inline-flex items-center justify-center shrink-0 align-middle select-none ${className}`}
            style={{ width: size, height: size, minWidth: size, minHeight: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 block"
            >
                {/* Official smooth Lucide scalloped badge */}
                <path
                    d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
                    fill={fillColor}
                />
                {/* Sharp clean white checkmark */}
                <path
                    d="m9 12 2 2 4-4"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
};

export default VerifiedBadge;
