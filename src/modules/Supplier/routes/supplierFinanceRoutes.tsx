import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import PermissionGuard from '@/components/common/PermissionGuard';

const SupplierWallet = lazy(() => import('../Wallet'));
const WithdrawFundsPage = lazy(() => import('../Wallet/WithdrawFundsPage'));
const ConnectedAccount = lazy(() => import('../Wallet/ConnectedAccount'));
const TransactionHistory = lazy(() => import('../Wallet/TransactionHistory'));
const Billing = lazy(() => import('../Finance/Billing'));
const Earnings = lazy(() => import('../Finance/Earnings'));
const Payments = lazy(() => import('../Finance/Payments'));
const Invoices = lazy(() => import('../Finance/Invoices'));
const Subscription = lazy(() => import('../Subscription'));
const SubscriptionCheckout = lazy(() => import('../Subscription/Checkout'));

export const supplierFinanceRoutes: RouteObject[] = [
    { 
        path: 'wallet', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <SupplierWallet />
            </PermissionGuard>
        ),
    },
    { 
        path: 'wallet/overview', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <SupplierWallet />
            </PermissionGuard>
        ),
    },
    { 
        path: 'wallet/withdraw', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <WithdrawFundsPage />
            </PermissionGuard>
        ),
    },
    { 
        path: 'wallet/connected-account', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <ConnectedAccount />
            </PermissionGuard>
        ),
    },
    { 
        path: 'wallet/transactions', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <TransactionHistory />
            </PermissionGuard>
        ),
    },
    { 
        path: 'finance', 
        element: <Navigate to="/supplier/wallet" replace /> 
    },
    { 
        path: 'finance/billing', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <Billing />
            </PermissionGuard>
        ),
    },
    { 
        path: 'finance/withdrawals', 
        element: <Navigate to="/supplier/wallet" replace /> 
    },
    { 
        path: 'finance/payouts', 
        element: <Navigate to="/supplier/wallet" replace /> 
    },
    { 
        path: 'finance/invoices', 
        element: (
            <PermissionGuard requiredPermission="finance.invoices">
                <Invoices />
            </PermissionGuard>
        ),
    },
    { 
        path: 'finance/payments', 
        element: (
            <PermissionGuard requiredPermission="finance.invoices">
                <Payments />
            </PermissionGuard>
        ),
    },
    { 
        path: 'finance/earnings', 
        element: (
            <PermissionGuard requiredPermission="finance.view_earnings">
                <Earnings />
            </PermissionGuard>
        ),
    },
    { 
        path: 'finance/withdrawal', 
        element: <Navigate to="/supplier/wallet" replace /> 
    },
    { 
        path: 'subscription', 
        element: (
            <PermissionGuard ownerOnly={true}>
                <Subscription />
            </PermissionGuard>
        ),
    },
    { 
        path: 'subscription/checkout', 
        element: (
            <PermissionGuard ownerOnly={true}>
                <SubscriptionCheckout />
            </PermissionGuard>
        ),
    },
    { 
        path: 'subscription/checkout/:planId', 
        element: (
            <PermissionGuard ownerOnly={true}>
                <SubscriptionCheckout />
            </PermissionGuard>
        ),
    },
];
