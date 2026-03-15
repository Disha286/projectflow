const activities = [
  { id: 1, user: 'You', action: 'created task', target: 'Build login page', time: '2 min ago', icon: '✅' },
  { id: 2, user: 'You', action: 'created workspace', target: 'My Workspace', time: '5 min ago', icon: '🏢' },
  { id: 3, user: 'You', action: 'registered account', target: 'ProjectFlow', time: '10 min ago', icon: '🎉' },
];

const ActivityFeed = () => {
  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm flex-shrink-0">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-300">
              <span className="text-white font-medium">{activity.user}</span>
              {' '}{activity.action}{' '}
              <span className="text-indigo-400">{activity.target}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;