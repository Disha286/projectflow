import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Logo from '../../components/ui/Logo';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password
    });
    if (result.success) {
      toast.success('Account created! Welcome to ProjectFlow!');
      navigate('/onboarding');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-8">
            <Logo />
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-gray-400">Start managing projects like a pro</p>
          </div>
          <a
            href="http://localhost:5000/api/auth/google"
            className="flex items-center justify-center gap-3 w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </a>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Enter Your Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" loading={isLoading}>
              Create account
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-500 text-xs">
            By signing up, you agree to our{' '}
            <a href="#" className="text-indigo-400 hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
          </p>
          <p className="mt-4 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gray-900 border-l border-gray-800 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="text-8xl mb-6">✨</div>
          <h2 className="text-3xl font-bold text-white mb-4">Everything your team needs</h2>
          <p className="text-gray-400 text-lg mb-8">
            Tasks, sprints, analytics and real-time collaboration in one beautiful workspace.
          </p>
          {[
            '✅ Unlimited tasks and projects',
            '✅ Real-time team collaboration',
            '✅ Kanban, List and Calendar views',
            '✅ Sprint planning and analytics',
            '✅ Role-based access control',
          ].map((feature) => (
            <div key={feature} className="text-left text-gray-300 text-sm py-2 border-b border-gray-800">
              {feature}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;