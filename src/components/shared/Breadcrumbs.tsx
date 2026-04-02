'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { FRONTEND_ROUTES } from '@/constants/constants';

const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    stations: 'Stations',
    locations: 'Locations',
    users: 'Users',
    sessions: 'Sessions',
    tenants: 'Tenants',
    webhooks: 'Webhooks',
    profile: 'Profile',
    logs: 'Logs',
};

const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export function Breadcrumbs() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const name = searchParams.get('name');
    const segments = pathname.split('/').filter(Boolean);

    // Don't show breadcrumbs on auth pages if they use the same layout
    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={FRONTEND_ROUTES.DASHBOARD}>Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                    // Skip the first segment if it's 'dashboard' since we already added it
                    if (index === 0 && segment === 'dashboard') return null;

                    const path = `/${segments.slice(0, index + 1).join('/')}`;
                    const isUuidSegment = isUuid(segment);
                    let label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                    if (isUuidSegment && name) {
                        label = name;
                    }

                    const isLast = index === segments.length - 1;
                    // If it's a UUID segment and we have a name, preserve it in the link for breadcrumb consistency
                    const segmentPath = (isUuidSegment && name) ? `${path}?name=${encodeURIComponent(name)}` : path;

                    return (
                        <React.Fragment key={path}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-bold tracking-tight text-foreground">
                                        {label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={segmentPath}>{label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
