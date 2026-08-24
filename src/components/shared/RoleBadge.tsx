import { cn } from '@/lib/utils';
import { ROLE_META } from '@/lib/permissions';

const ROLE_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  SUPER_ADMIN: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
  ADMIN: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    dot: 'bg-purple-400',
  },
  SITE_MANAGER: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  VIEWER: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
    dot: 'bg-slate-400',
  },
};

const DEFAULT_STYLE = {
  bg: 'bg-slate-500/10',
  text: 'text-slate-300',
  border: 'border-slate-500/30',
  dot: 'bg-slate-400',
};

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export function RoleBadge({
  role,
  size = 'sm',
  showDot = true,
  className,
}: RoleBadgeProps) {
  const styles = ROLE_STYLES[role] ?? DEFAULT_STYLE;
  const meta = ROLE_META[role];
  const label = meta?.label ?? role;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        styles.bg,
        styles.text,
        styles.border,
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
      title={meta?.description}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} aria-hidden="true" />
      )}
      {label}
    </span>
  );
}
