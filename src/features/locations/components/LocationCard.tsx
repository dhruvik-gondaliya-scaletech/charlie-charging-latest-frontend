import { Location } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Pencil, Trash2 } from 'lucide-react';

interface LocationCardProps {
  location: Location;
  onDelete: (id: string) => void;
}

export function LocationCard({ location, onDelete }: LocationCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{location.name}</h3>
          </div>
          <Badge variant={location.isActive ? 'default' : 'secondary'}>
            {location.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {location.address}, {location.city}, {location.state} {location.zipCode}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {location.stationCount || 0} stations
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm('Delete this location?')) {
                  onDelete(location.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
