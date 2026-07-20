import { loginRoutes } from './Login';
import { registerRoutes } from './Register';
import { forgotPasswordRoutes } from './ForgotPassword';
import { resetPasswordRoutes } from './ResetPassword';
import { verifyEmailRoutes } from './VerifyEmail';
import { twoFactorRoutes } from './TwoFactor';
import { lockScreenRoutes } from './LockScreen';
import { sessionExpiredRoutes } from './SessionExpired';
import { unauthorizedRoutes } from './Unauthorized';
import { RouteObject } from 'react-router-dom';

export const authRoutes: RouteObject[] = [
    {
        path: 'web',
        children: [
            ...loginRoutes,
            ...registerRoutes,
            ...forgotPasswordRoutes,
            ...resetPasswordRoutes,
            ...verifyEmailRoutes,
            ...twoFactorRoutes,
            ...lockScreenRoutes,
            ...sessionExpiredRoutes,
            ...unauthorizedRoutes,
        ]
    }
];
