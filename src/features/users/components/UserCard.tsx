import { User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Shield } from 'lucide-react';
import { formatDate } from '@/lib/date';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">
            {user.firstName} {user.lastName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            {user.email}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <Badge variant="outline" className="mb-1">
            <Shield className="h-3 w-3 mr-1" />
            {user.role}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
        <Badge variant={user.isActive ? 'default' : 'secondary'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
    </div>
  );
}
