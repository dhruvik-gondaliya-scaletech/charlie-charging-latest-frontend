import { MapPin } from 'lucide-react';

export function EmptyLocations() {
  return (
    <div className="text-center py-12">
      <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground">No locations found</p>
    </div>
  );
}
