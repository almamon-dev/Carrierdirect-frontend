import React from 'react';
import { RouteObject } from 'react-router-dom';
import TicketsPage from './pages/TicketsPage';

export const ticketsRoutes: RouteObject[] = [
    {
        path: 'tickets',
        element: <TicketsPage />,
    }
];
