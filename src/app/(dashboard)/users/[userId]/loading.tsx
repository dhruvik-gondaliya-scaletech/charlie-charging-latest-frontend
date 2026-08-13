export default function UserRbacLoadingPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-8">
      {/* Back skeleton */}
      <div className="h-8 w-28 rounded-lg bg-white/5 animate-pulse" />

      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-white/5 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-36 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-56 rounded bg-white/5 animate-pulse" />
        </div>
      </div>

      {/* Tab bar skeleton */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-6">
        <div className="flex gap-2">
          {[80, 96, 108].map((w) => (
            <div key={w} className={`h-9 w-${w} rounded-lg bg-white/5 animate-pulse`} />
          ))}
        </div>
        {/* Content skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
