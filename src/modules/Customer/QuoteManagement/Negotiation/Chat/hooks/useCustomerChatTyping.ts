import { useState, useRef, useCallback, useEffect } from 'react';
import { fetchCustomerTypingStatusApi, notifyCustomerTypingApi } from './customerChatMessageApi';

export function useCustomerChatTyping(activeChatId: string | number) {
    const [isSupplierTyping, setIsSupplierTyping] = useState(false);
    const typingInactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastTypingSentRef = useRef<number>(0);
    const typingAutoClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notifyTyping = useCallback((isTyping = true) => {
        if (!activeChatId) return;

        if (!isTyping) {
            if (typingInactivityTimerRef.current) {
                clearTimeout(typingInactivityTimerRef.current);
                typingInactivityTimerRef.current = null;
            }
            lastTypingSentRef.current = 0;
            notifyCustomerTypingApi(activeChatId, false);
            return;
        }

        const now = Date.now();
        if (now - lastTypingSentRef.current >= 1500) {
            lastTypingSentRef.current = now;
            notifyCustomerTypingApi(activeChatId, true);
        }

        if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
        typingInactivityTimerRef.current = setTimeout(() => {
            lastTypingSentRef.current = 0;
            notifyCustomerTypingApi(activeChatId, false);
        }, 2500);
    }, [activeChatId]);

    const pollTypingStatus = useCallback(async () => {
        if (!activeChatId) return;
        try {
            const res = await fetchCustomerTypingStatusApi(activeChatId);
            const raw = res?.data?.data || res?.data || res;
            if (raw?.is_supplier_typing !== undefined || raw?.is_typing !== undefined) {
                const isTypingNow = Boolean(raw?.is_supplier_typing ?? raw?.is_typing);
                setIsSupplierTyping(isTypingNow);
                if (isTypingNow) {
                    if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
                    typingAutoClearTimerRef.current = setTimeout(() => {
                        setIsSupplierTyping(false);
                    }, 3500);
                }
            }
        } catch {}
    }, [activeChatId]);

    useEffect(() => {
        setIsSupplierTyping(false);
        if (typingAutoClearTimerRef.current) clearTimeout(typingAutoClearTimerRef.current);
        if (typingInactivityTimerRef.current) clearTimeout(typingInactivityTimerRef.current);
    }, [activeChatId]);

    return {
        isSupplierTyping,
        setIsSupplierTyping,
        notifyTyping,
        pollTypingStatus,
        typingAutoClearTimerRef,
        typingInactivityTimerRef
    };
}
