import { useState, useEffect, useCallback } from 'react';

export interface PayLaterCountdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    formatted: string; // "22d 14h 32m 45s"
    shortFormatted: string; // "22d : 14h : 32m : 45s"
}

export const usePayLaterCountdown = (dueDateStr?: string): PayLaterCountdown => {
    const calculateTime = useCallback((): PayLaterCountdown => {
        if (!dueDateStr) {
            return {
                days: 22,
                hours: 14,
                minutes: 32,
                seconds: 45,
                isExpired: false,
                formatted: '22d 14h 32m 45s',
                shortFormatted: '22d : 14h : 32m : 45s',
            };
        }

        let dueTimestamp: number;
        const parsed = new Date(dueDateStr);
        if (!isNaN(parsed.getTime())) {
            // Set end of day if only date is provided
            if (parsed.getHours() === 0 && parsed.getMinutes() === 0) {
                parsed.setHours(23, 59, 59, 999);
            }
            dueTimestamp = parsed.getTime();
        } else {
            // Fallback: 23 days from now
            dueTimestamp = Date.now() + (22 * 24 * 60 * 60 + 14 * 60 * 60 + 35 * 60) * 1000;
        }

        const now = Date.now();
        const diffMs = dueTimestamp - now;

        if (diffMs <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true,
                formatted: '00d 00h 00m 00s (Overdue)',
                shortFormatted: '00:00:00',
            };
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const pad = (n: number) => String(n).padStart(2, '0');

        const formatted = days > 0
            ? `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
            : `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

        const shortFormatted = `${days > 0 ? `${days}d ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        return {
            days,
            hours,
            minutes,
            seconds,
            isExpired: false,
            formatted,
            shortFormatted,
        };
    }, [dueDateStr]);

    const [countdown, setCountdown] = useState<PayLaterCountdown>(calculateTime);

    useEffect(() => {
        setCountdown(calculateTime());
        const interval = setInterval(() => {
            setCountdown(calculateTime());
        }, 1000);
        return () => clearInterval(interval);
    }, [calculateTime]);

    return countdown;
};

export default usePayLaterCountdown;
