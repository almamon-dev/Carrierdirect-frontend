import { RouteObject } from 'react-router-dom';
import { supplierDashboardRoutes } from './routes/supplierDashboardRoutes';
import { supplierQuoteRoutes } from './routes/supplierQuoteRoutes';
import { supplierOrderRoutes } from './routes/supplierOrderRoutes';
import { supplierAvailabilityRoutes } from './routes/supplierAvailabilityRoutes';
import { supplierFinanceRoutes } from './routes/supplierFinanceRoutes';
import { supplierTeamRoutes } from './routes/supplierTeamRoutes';

export const supplierRoutes: RouteObject[] = [
    ...supplierDashboardRoutes,
    ...supplierQuoteRoutes,
    ...supplierOrderRoutes,
    ...supplierAvailabilityRoutes,
    ...supplierFinanceRoutes,
    ...supplierTeamRoutes,
];
