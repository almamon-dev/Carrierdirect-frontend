import { useState } from 'react';

export const useBulkImportConfirm = (onConfirmImport: () => void | Promise<void>) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmProgress, setConfirmProgress] = useState(0);
    const [confirmStatus, setConfirmStatus] = useState('');

    const handleExecuteConfirm = async () => {
        setIsConfirming(true);
        setConfirmProgress(0);
        setConfirmStatus('Validating shipment batch payload & parameters...');

        const startTime = Date.now();
        const minDurationMs = 3000;

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(92, Math.floor((elapsed / minDurationMs) * 90));
            setConfirmProgress(pct);

            if (pct < 25) {
                setConfirmStatus('Validating shipment batch payload & parameters...');
            } else if (pct < 60) {
                setConfirmStatus('Creating quote requests in database server...');
            } else if (pct < 90) {
                setConfirmStatus('Linking cargo routes, service types & attached documents...');
            }
        }, 30);

        try {
            await Promise.all([
                Promise.resolve(onConfirmImport()),
                new Promise((resolve) => setTimeout(resolve, minDurationMs)),
            ]);

            clearInterval(progressInterval);
            setConfirmProgress(100);
            setConfirmStatus('Quote requests created successfully! Finalizing marketplace broadcast...');
        } catch (err: any) {
            console.error('Batch confirm error:', err);
            clearInterval(progressInterval);
            setIsConfirming(false);
        } finally {
            clearInterval(progressInterval);
        }
    };

    const resetConfirm = () => {
        setIsConfirming(false);
        setConfirmProgress(0);
    };

    return {
        isConfirming,
        confirmProgress,
        confirmStatus,
        handleExecuteConfirm,
        resetConfirm,
    };
};
