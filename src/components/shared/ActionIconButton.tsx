'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ActionTone =
  | 'default'
  | 'primary'
  | 'destructive'
  | 'info'
  | 'warning'
  | 'success';

type ButtonProps = React.ComponentProps<typeof Button>;

const toneClasses: Record<ActionTone, string> = {
  default: 'hover:bg-muted/30 hover:text-foreground',
  primary: 'hover:bg-primary/10 hover:text-primary',
  destructive: 'hover:bg-destructive/10 hover:text-destructive',
  info: 'hover:bg-blue-500/10 hover:text-blue-500',
  warning: 'hover:bg-amber-500/10 hover:text-amber-500',
  success: 'hover:bg-emerald-500/10 hover:text-emerald-500',
};

export interface ActionIconButtonProps extends Omit<ButtonProps, 'size' | 'variant' | 'asChild'> {
  tooltip?: React.ReactNode;
  tone?: ActionTone;
  href?: string;
  icon: React.ReactNode;
}

export function ActionIconButton({
  tooltip,
  tone = 'default',
  href,
  icon,
  className,
  disabled,
  onClick,
  ...props
}: ActionIconButtonProps) {
  const button = (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        'h-8 w-8 rounded-lg border-border/50 bg-background/20 transition-colors',
        toneClasses[tone],
        className
      )}
      disabled={disabled}
      onClick={onClick}
      asChild={!!href}
      {...props}
    >
      {href ? <Link href={href}>{icon}</Link> : icon}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          {typeof tooltip === 'string' ? <p className="text-xs">{tooltip}</p> : tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
