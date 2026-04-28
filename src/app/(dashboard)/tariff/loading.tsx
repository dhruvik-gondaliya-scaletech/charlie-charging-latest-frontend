export default function Loading() {
  return (
    <div className="space-y-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="space-y-2">
        <div className="h-10 w-56 bg-muted/40 rounded-xl" />
        <div className="h-4 w-96 bg-muted/30 rounded-lg" />
      </div>
      <div className="h-[520px] bg-card/20 border border-border/40 rounded-3xl" />
    </div>
  );
}
