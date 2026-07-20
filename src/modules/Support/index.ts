import { ticketsRoutes } from './Tickets';
import { knowledgeBaseRoutes } from './KnowledgeBase';
import { faqRoutes } from './Faq';
import { RouteObject } from 'react-router-dom';

export const supportRoutes: RouteObject[] = [
    {
        path: 'support',
        children: [
            ...ticketsRoutes,
            ...knowledgeBaseRoutes,
            ...faqRoutes,
        ]
    }
];
