import { Activity } from 'lucide-react';

export function EmptyActivity() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p>No recent activity</p>
    </div>
  );
}
