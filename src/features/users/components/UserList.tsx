import { User } from '@/types';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
