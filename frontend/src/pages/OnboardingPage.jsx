import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useWorkspaceStore from '../store/workspaceStore';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Logo from '../components/ui/Logo';

const steps = [
  { id: 1, title: 'Create your workspace', subtitle: 'A workspace is where your team collaborates' },
  { id: 2, title: 'Invite your team', subtitle: 'Add teammates to get started together' },
  { id: 3, title: "You're all set!", subtitle: 'Your workspace is ready to use' }
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { createWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workspace, setWorkspace] = useState({ name: '', description: '' });
  const [inviteEmail, setInviteEmail] = useState('');
  const [createdWorkspace, setCreatedWorkspace] = useState(null);

  const handleCreateWorkspace = async () => {
    if (!workspace.name) return toast.error('Workspace name is required');
    setLoading(true);
    const result = await createWorkspace(workspace);
    setLoading(false);
    if (result.success) {
      setCreatedWorkspace(result.workspace);
      toast.success('Workspace created!');
      setStep(2);
    } else {
      toast.error('Failed to create workspace');
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <Logo />
      </div>

      {/* Progress */}
      <div className="max-w-lg mx-auto w-full px-6 mt-8">
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > s.id ? 'bg-indigo-600 text-white' :
                step === s.id ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/30' :
                'bg-gray-800 text-gray-500'
              }`}>
                {step > s.id ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s.id}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 transition-all ${step > s.id ? 'bg-indigo-600' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{steps[0].title}</h1>
                <p className="text-gray-400">{steps[0].subtitle}</p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Workspace name"
                  placeholder="e.g. Acme Corp, My Startup"
                  value={workspace.name}
                  onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })}
                />
                <Input
                  label="Description (optional)"
                  placeholder="What does your team work on?"
                  value={workspace.description}
                  onChange={(e) => setWorkspace({ ...workspace, description: e.target.value })}
                />

                {/* Workspace preview */}
                {workspace.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-xl p-4 border border-gray-800"
                  >
                    <p className="text-gray-400 text-xs mb-2">Preview</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {workspace.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-medium">{workspace.name}</div>
                        <div className="text-gray-400 text-xs">{user?.email}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCreateWorkspace}
                  loading={loading}
                >
                  Create Workspace →
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">{steps[1].title}</h1>
                <p className="text-gray-400">{steps[1].subtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="teammate@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button variant="secondary" size="md">
                    Invite
                  </Button>
                </div>

                <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.[0]}
                    </div>
                    <div>
                      <div className="text-white text-sm">{user?.name}</div>
                      <div className="text-gray-400 text-xs">{user?.email} · Owner</div>
                    </div>
                  </div>
                </div>

                <Button variant="primary" size="lg" className="w-full" onClick={() => setStep(3)}>
                  Continue →
                </Button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="text-8xl mb-6"
              >
                🎉
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">You're all set!</h1>
              <p className="text-gray-400 mb-2">
                <span className="text-indigo-400 font-medium">{createdWorkspace?.name}</span> is ready!
              </p>
              <p className="text-gray-500 text-sm mb-8">
                Start by creating your first project and adding tasks
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '📋', label: 'Create a project' },
                  { icon: '✅', label: 'Add your first task' },
                  { icon: '👥', label: 'Invite teammates' },
                  { icon: '🚀', label: 'Start a sprint' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-gray-300 text-sm">{item.label}</div>
                  </div>
                ))}
              </div>

              <Button variant="primary" size="xl" className="w-full" onClick={handleFinish}>
                Go to Dashboard 🚀
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;