import React, { createContext, useContext, useState } from 'react';
import { SubscriptionLockModal } from '@/components/modals';

interface SubscriptionContextType {
    hasActiveSubscription: boolean;
    usedFreeQuotes: number;
    maxFreeQuotes: number;
    canCreateQuote: boolean;
    checkAndExecute: (action: () => void) => void;
    openLockModal: () => void;
    closeLockModal: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
    hasActiveSubscription: false,
    usedFreeQuotes: 2,
    maxFreeQuotes: 5,
    canCreateQuote: true,
    checkAndExecute: () => {},
    openLockModal: () => {},
    closeLockModal: () => {},
});

export const useSubscriptionMiddleware = () => useContext(SubscriptionContext);

interface SubscriptionGuardProps {
    children: React.ReactNode;
    hasActiveSubscription?: boolean;
    initialUsedQuotes?: number;
    maxFreeQuotes?: number;
}

export default function SubscriptionGuard({
    children,
    hasActiveSubscription = false,
    initialUsedQuotes = 2,
    maxFreeQuotes = 5,
}: SubscriptionGuardProps) {
    const [usedQuotes, setUsedQuotes] = useState(initialUsedQuotes);
    const [isLockModalOpen, setIsLockModalOpen] = useState(false);

    const canCreateQuote = hasActiveSubscription || usedQuotes < maxFreeQuotes;

    const checkAndExecute = (action: () => void) => {
        if (canCreateQuote) {
            action();
            if (!hasActiveSubscription) {
                setUsedQuotes((prev) => prev + 1);
            }
        } else {
            setIsLockModalOpen(true);
        }
    };

    const openLockModal = () => setIsLockModalOpen(true);
    const closeLockModal = () => setIsLockModalOpen(false);

    return (
        <SubscriptionContext.Provider
            value={{
                hasActiveSubscription,
                usedFreeQuotes: usedQuotes,
                maxFreeQuotes,
                canCreateQuote,
                checkAndExecute,
                openLockModal,
                closeLockModal,
            }}
        >
            {children}
            <SubscriptionLockModal
                isOpen={isLockModalOpen}
                onClose={closeLockModal}
                title="Free Quote Quota Limit Reached"
                description={`You have used all ${maxFreeQuotes} of your free quote requests. Upgrade your subscription plan to create unlimited requests.`}
            />
        </SubscriptionContext.Provider>
    );
}
