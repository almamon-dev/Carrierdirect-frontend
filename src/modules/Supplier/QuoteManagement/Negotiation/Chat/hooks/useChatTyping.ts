import { useState, useRef, useCallback } from 'react';
import apiClient from '@/lib/axios';

export function useChatTyping(activeRawId: string | number) {
    const [isCustomerTyping, setIsCustomerTyping] = useState(false);
    const typingInactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastTypingSentRef = useRef<number>(0);
    const typingAutoClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notifyTyping = useCallback(
        (isTyping = true) => {
            if (!activeRawId) return;

            if (!isTyping) {
                if (typingInactivityTimerRef.current) {
                    clearTimeout(typingInactivityTimerRef.current);
                    typingInactivityTimerRef.current = null;
                }
                lastTypingSentRef.current = 0;
                apiClient
                    .post(`/supplier/negotiations/${activeRawId}/typing`, { is_typing: false })
                    .catch(() => apiClient.post(`/negotiations/${activeRawId}/typing`, { is_typing: false }).catch(() => {}));
                return;
            }

            const now = Date.now();
            if (now - lastTypingSentRef.current >= 1500) {
                lastTypingSentRef.current = now;
                apiClient
                    .post(`/supplier/negotiations/${activeRawId}/typing`, { is_typing: true })
                    .catch(() => apiClient.post(`/negotiations/${activeRawId}/typing`, { is_typing: true }).catch(() => {}));
            }

            if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
            typingInactivityTimerRef.current = setTimeout(() => {
                lastTypingSentRef.current = 0;
                apiClient
                    .post(`/supplier/negotiations/${activeRawId}/typing`, { is_typing: false })
                    .catch(() => apiClient.post(`/negotiations/${activeRawId}/typing`, { is_typing: false }).catch(() => {}));
            }, 2500);
        },
        [activeRawId]
    );

    return {
        isCustomerTyping,
        setIsCustomerTyping,
        notifyTyping,
        typingAutoClearTimerRef,
        typingInactivityTimerRef,
    };
}
