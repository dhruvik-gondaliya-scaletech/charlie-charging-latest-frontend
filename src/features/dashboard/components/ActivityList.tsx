import { RecentActivity } from '@/types';
import { formatTimeAgo } from '@/lib/date';

interface ActivityListProps {
  activities: RecentActivity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
          <div className="flex-1">
            <p className="font-medium">{activity.event}</p>
            <p className="text-sm text-muted-foreground">
              Station: {activity.station} • User: {activity.user}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatTimeAgo(activity.eventTime)}
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            activity.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
            activity.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}>
            {activity.status}
          </div>
        </div>
      ))}
    </div>
  );
}
