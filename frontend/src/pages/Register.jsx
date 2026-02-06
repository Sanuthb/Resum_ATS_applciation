import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await signUp({ email, password, fullName });
      if (data?.error) throw new Error(data.error);
      setSuccessData(data);
      setSuccess(true);
      setTimeout(() => navigate(data?.token ? '/dashboard' : '/login'), data?.token ? 500 : 5000);
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md p-8 sm:p-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-stone-900">Create your account</h1>
          <p className="text-stone-600 mt-2 text-sm">Start building better resumes in minutes</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
              {successData?.token ? "You're all set" : 'Check your inbox'}
            </h2>
            <p className="text-stone-600 text-sm">
              {successData?.token
                ? 'Taking you to your dashboard...'
                : `We sent a confirmation link to ${email}. Redirecting to sign in...`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input pl-11"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Creating account...' : 'Create account'} <ArrowRight size={18} />
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
