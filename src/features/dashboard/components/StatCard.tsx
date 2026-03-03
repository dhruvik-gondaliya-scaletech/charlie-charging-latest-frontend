import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SecondaryStat {
  value: string | number;
  label: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bottomRightGlobe?: string;
  description?: string;
  secondary?: SecondaryStat;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bottomRightGlobe,
  description,
  secondary,
  loading = false,
  className,
}: StatCardProps) {
  // Calculate percentage if both primary and secondary are numbers
  const showProgress = typeof value === 'number' && typeof secondary?.value === 'number';
  const progressPercent = showProgress
    ? Math.min(100, Math.max(0, (Number(secondary.value) / Number(value)) * 100))
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn("h-full", className)}
    >
      <Card className="relative h-full overflow-hidden border-border/40 transition-all hover:bg-card/80 dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10 group bg-card/40 backdrop-blur-xl">
        <div className={cn(
          "absolute top-0 left-0 h-[2px] w-full bg-linear-to-r from-transparent via-current to-transparent opacity-20 group-hover:opacity-40 transition-opacity",
          color
        )} />

        <CardContent className="p-6">
          <div className="flex flex-col h-full justify-between gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-muted-foreground truncate uppercase tracking-wider">
                  {title}
                </span>
                {description && !loading && (
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight truncate">
                    {description}
                  </p>
                )}
              </div>

              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border border-border/10 shadow-sm transition-all group-hover:scale-110 bg-muted/20"
              )}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-3xl font-extrabold tracking-tight">
                    {loading ? (
                      <div className="h-9 w-24 animate-pulse rounded-md bg-muted/50" />
                    ) : (
                      <span className="bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {value}
                      </span>
                    )}
                  </div>
                  {secondary && !loading && (
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
                      Total
                    </p>
                  )}
                </div>

                {secondary && (
                  <div className="text-right space-y-1">
                    <div className="text-2xl font-black tracking-tight text-primary">
                      {loading ? (
                        <div className="h-7 w-16 animate-pulse rounded-md bg-muted/50 ml-auto" />
                      ) : (
                        secondary.value
                      )}
                    </div>
                    {!loading && (
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-70">
                        {secondary.label}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {secondary && !loading && showProgress && (
                <div className="space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-muted/40 overflow-hidden ring-1 ring-border/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full bg-linear-to-r from-primary/80 to-primary/100 shadow-[0_0_10px_rgba(var(--primary),0.3)] relative")}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              )}
              {loading && <div className="h-3 w-full animate-pulse rounded-full bg-muted/30" />}
            </div>
          </div>
        </CardContent>

        <div className={cn(
          "absolute -right-6 -bottom-6 h-28 w-28 rounded-full blur-3xl pointer-events-none opacity-5 transition-opacity group-hover:opacity-10",
          bottomRightGlobe
        )} />
      </Card>
    </motion.div>
  );
}
