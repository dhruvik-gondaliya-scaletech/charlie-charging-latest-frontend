'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    href?: string;
    onClick?: () => void;
    label?: string;
    className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
    href,
    onClick,
    label = "Return to Previous",
    className
}) => {
    const router = useRouter();

    const handleNavigate = () => {
        if (onClick) {
            onClick();
            return;
        }

        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleNavigate}
            className={cn(
                "flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors group cursor-pointer",
                className
            )}
        >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            {label}
        </button>
    );
};
