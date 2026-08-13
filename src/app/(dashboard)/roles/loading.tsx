export default function RolesLoadingPage() {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white/5 animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-24 rounded-md bg-white/5 animate-pulse" />
            <div className="h-4 w-64 rounded-md bg-white/5 animate-pulse" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-lg bg-white/5 animate-pulse" />
      </div>

      {/* Section label */}
      <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />

      {/* Card grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-44 rounded-xl border border-white/10 bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
