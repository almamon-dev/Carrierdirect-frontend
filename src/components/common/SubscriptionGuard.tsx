import React, { createContext, useContext } from 'react';
import { SubscriptionLockModal } from '@/components/modals';
import { useSubscriptionQuota } from '@/hooks/useSubscriptionQuota';

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
    usedFreeQuotes: 0,
    maxFreeQuotes: 3,
    canCreateQuote: true,
    checkAndExecute: () => {},
    openLockModal: () => {},
    closeLockModal: () => {},
});

export const useSubscriptionMiddleware = () => useContext(SubscriptionContext);

interface SubscriptionGuardProps {
    children: React.ReactNode;
}

export default function SubscriptionGuard({
    children,
}: SubscriptionGuardProps) {
    const {
        isPaidUnlimited,
        quotesUsed,
        quotesLimit,
        canCreateQuote,
        isLockModalOpen,
        setIsLockModalOpen,
        modalTitle,
        modalDescription,
        checkOrLock,
        handleUpgradeRedirect,
    } = useSubscriptionQuota();

    const checkAndExecute = (action: () => void) => {
        checkOrLock(action);
    };

    const openLockModal = () => setIsLockModalOpen(true);
    const closeLockModal = () => setIsLockModalOpen(false);

    return (
        <SubscriptionContext.Provider
            value={{
                hasActiveSubscription: isPaidUnlimited,
                usedFreeQuotes: quotesUsed,
                maxFreeQuotes: quotesLimit,
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
                onUpgrade={handleUpgradeRedirect}
                userType="customer"
                title={modalTitle}
                description={modalDescription}
            />
        </SubscriptionContext.Provider>
    );
}
