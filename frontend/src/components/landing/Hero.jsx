import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gray-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
          <span className="text-indigo-400 text-sm font-medium">Now in public beta — free to use</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
        >
          Manage projects
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            like a pro team
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          ProjectFlow brings your team together with powerful task management,
          real-time collaboration, and smart analytics — all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link to="/register">
            <Button variant="primary" size="xl">
              Start for free
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="xl">Sign in to workspace</Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 mb-16"
        >
          {[
            { value: '10k+', label: 'Teams using ProjectFlow' },
            { value: '500k+', label: 'Tasks completed' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl shadow-indigo-500/10">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 bg-gray-700 rounded-md h-6 flex items-center px-3">
                <span className="text-gray-400 text-xs">app.projectflow.io/dashboard</span>
              </div>
            </div>

            {/* Fake dashboard */}
            <div className="p-6 grid grid-cols-12 gap-4 min-h-64">
              {/* Sidebar */}
              <div className="col-span-2 space-y-2">
                {['Dashboard', 'Projects', 'Tasks', 'Team', 'Analytics'].map((item, i) => (
                  <div key={item} className={`h-8 rounded-lg flex items-center px-3 ${i === 0 ? 'bg-indigo-600/30 border border-indigo-500/30' : 'bg-gray-800/50'}`}>
                    <div className={`w-16 h-2 rounded ${i === 0 ? 'bg-indigo-400/60' : 'bg-gray-600/60'}`} />
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="col-span-10 grid grid-cols-3 gap-4">
                {/* Stat cards */}
                {[
                  { label: 'Total Tasks', value: '248', color: 'indigo' },
                  { label: 'In Progress', value: '32', color: 'yellow' },
                  { label: 'Completed', value: '184', color: 'green' },
                ].map((card) => (
                  <div key={card.label} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <div className="text-xs text-gray-500 mb-1">{card.label}</div>
                    <div className={`text-2xl font-bold text-${card.color}-400`}>{card.value}</div>
                    <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full bg-${card.color}-500 rounded-full`} style={{ width: `${Math.random() * 60 + 30}%` }} />
                    </div>
                  </div>
                ))}

                {/* Kanban preview */}
                <div className="col-span-3 grid grid-cols-4 gap-3">
                  {['Backlog', 'In Progress', 'In Review', 'Done'].map((col, i) => (
                    <div key={col} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                      <div className="text-xs text-gray-500 mb-2 font-medium">{col}</div>
                      {[...Array(i === 1 ? 3 : i === 3 ? 2 : 1)].map((_, j) => (
                        <div key={j} className="bg-gray-700/50 rounded-md p-2 mb-2 border border-gray-600/30">
                          <div className="h-2 bg-gray-500/50 rounded w-3/4 mb-1" />
                          <div className="h-2 bg-gray-600/50 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-4 bg-indigo-500/5 rounded-3xl blur-xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;