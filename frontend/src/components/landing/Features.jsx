import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎯',
    title: 'Task Management',
    description: 'Create, assign and track tasks with priorities, due dates, labels and subtasks. Keep your team aligned.'
  },
  {
    icon: '⚡',
    title: 'Real-time Collaboration',
    description: 'See updates instantly as your team works. Comments, mentions and live notifications keep everyone in sync.'
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Visualize team performance with burndown charts, workload distribution and sprint velocity metrics.'
  },
  {
    icon: '🏃',
    title: 'Sprint Planning',
    description: 'Plan and execute sprints with ease. Move tasks, set goals and track progress with burndown charts.'
  },
  {
    icon: '🔐',
    title: 'Role-based Access',
    description: 'Control who can see and do what. Owner, Admin, Member and Viewer roles for every workspace.'
  },
  {
    icon: '🔔',
    title: 'Smart Notifications',
    description: 'Get notified about what matters. Task assignments, comments, deadlines and more — in-app and email.'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4"
          >
            <span className="text-indigo-400 text-sm font-medium">Everything you need</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Built for modern teams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Everything your team needs to ship faster and stay organized
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;