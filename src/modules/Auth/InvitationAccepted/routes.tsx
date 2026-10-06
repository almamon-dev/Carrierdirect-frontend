import React from "react";
import { RouteObject } from "react-router-dom";

const InvitationAcceptedPage = React.lazy(() => import("./pages/InvitationAcceptedPage"));

export const invitationAcceptedRoutes: RouteObject[] = [
    {
        path: "invitation-accepted",
        element: (
            <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading...</div>}>
                <InvitationAcceptedPage />
            </React.Suspense>
        ),
    },
    {
        path: "accept-invitation",
        element: (
            <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Loading...</div>}>
                <InvitationAcceptedPage />
            </React.Suspense>
        ),
    },
];
