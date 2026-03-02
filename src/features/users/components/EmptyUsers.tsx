import { User as UsersIcon } from 'lucide-react';

export function EmptyUsers() {
  return (
    <div className="text-center py-12">
      <UsersIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground">No users found</p>
    </div>
  );
}
