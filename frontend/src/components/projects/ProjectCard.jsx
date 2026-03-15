import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-gray-900 rounded-2xl p-5 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{
            backgroundColor: project.color + '20',
            border: `1px solid ${project.color}40`
          }}
        >
          {project.icon}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            project.visibility === 'public'
              ? 'bg-green-500/10 text-green-400'
              : 'bg-gray-700 text-gray-400'
          }`}>
            {project.visibility === 'public' ? '🌐 Public' : '🔒 Private'}
          </span>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-indigo-400 transition-colors">
        {project.name}
      </h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {project.description || 'No description'}
      </p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>0%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: '0%', backgroundColor: project.color }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Members */}
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((member, i) => (
            <div
              key={i}
              className="w-7 h-7 bg-indigo-600 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold"
            >
              {member.user?.name?.[0] || 'U'}
            </div>
          ))}
          {project.members?.length > 4 && (
            <div className="w-7 h-7 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs">
              +{project.members.length - 4}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="capitalize">{project.type}</span>
          <span>·</span>
          <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;