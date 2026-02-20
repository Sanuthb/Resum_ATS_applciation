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
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await signUp({
        email,
        password,
        fullName
      });
      if (data.error) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-200/50 rounded-full blur-3xl pointer-events-none translate-y-1/2 translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-lg p-10 rounded-3xl border border-slate-100 shadow-xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-6 shadow-inner">
            <User size={24} />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight text-slate-900">Join the Architecture</h2>
          <p className="text-slate-500 text-sm font-medium">Create your professional profile in seconds.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-bold flex items-center gap-3"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-green-50 text-green-500 shadow-inner">
                <CheckCircle size={48} />
              </div>
            </div>
            <h3 className="text-2xl font-black mb-3 text-slate-900 tracking-tight">Check your inbox</h3>
            <p className="text-slate-500 text-sm font-medium">We've sent a confirmation link to <span className="text-blue-600">{email}</span>. Redirecting to login...</p>
          </motion.div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="input-premium-light pl-12"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Console Identifier</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="input-premium-light pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="input-premium-light pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="py-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                By initializing this profile, you agree to our 
                <a href="#" className="text-blue-600 hover:underline mx-1">Protocols</a> and 
                <a href="#" className="text-blue-600 hover:underline ml-1">Privacy</a>.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-premium w-full py-4 justify-center text-sm shadow-lg group"
            >
              {loading ? 'Creating Profile...' : 'Initialize Account'} 
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Already have an account? 
          <Link to="/login" className="text-blue-600 ml-2 hover:underline">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
