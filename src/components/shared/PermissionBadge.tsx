import { cn } from '@/lib/utils';
import { PermissionModule } from '@/lib/permissions';

// ─── Module color config ──────────────────────────────────────────────────────

const MODULE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  location: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  station: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  connector: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
  },
  session: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  ocpp: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  users: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  reports: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
  },
  tariff: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
  },
  driver: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
  id_tag: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
};

const DEFAULT_COLORS = {
  bg: 'bg-slate-500/10',
  text: 'text-slate-400',
  border: 'border-slate-500/30',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface PermissionBadgeProps {
  code: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function PermissionBadge({ code, size = 'sm', className }: PermissionBadgeProps) {
  const module = code.split('.')[0] as PermissionModule;
  const action = code.split('.').slice(1).join('.');
  const colors = MODULE_COLORS[module] ?? DEFAULT_COLORS;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-mono',
        colors.bg,
        colors.text,
        colors.border,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className,
      )}
      title={code}
    >
      <span className="font-medium opacity-70">{module}</span>
      <span className="opacity-40">·</span>
      <span>{action}</span>
    </span>
  );
}
