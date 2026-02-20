import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Zap, Shield, FileCheck, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="relative isolate overflow-hidden bg-white min-h-screen">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 sm:pt-40 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-blue-100 bg-blue-50/50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-10 shadow-sm"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>AI Resume Evolution v2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-900"
          >
            Design Your <br />
            <span className="text-blue-600">Elite Future</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mb-14 leading-relaxed font-medium"
          >
            Experience the gold standard of career management. Our intelligence engine 
            re-engineers your professional narrative for total market dominance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex flex-wrap justify-center gap-8"
          >
            <Link to="/register" className="btn-premium px-12 py-5 text-base group">
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-outline-blue px-12 py-5 text-base shadow-sm">
              Console Access
            </Link>
          </motion.div>

          {/* Feature Grid with staggering */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10 w-full"
          >
            <FeatureCard 
              icon={<Zap className="text-blue-600" size={24} />}
              title="Quantum Speed"
              desc="Real-time optimization feedback at the speed of thought."
            />
            <FeatureCard 
              icon={<Shield className="text-blue-600" size={24} />}
              title="ATS Mastery"
              desc="Pass the most stringent automated screening protocols."
            />
            <FeatureCard 
              icon={<FileCheck className="text-blue-600" size={24} />}
              title="Perfect Fit"
              desc="Precise semantic alignment with job-specific requirements."
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 30 },
      show: { opacity: 1, y: 0 }
    }}
    whileHover={{ y: -10, transition: { type: 'spring' } }}
    className="bg-white border border-slate-100 flex flex-col items-start text-left group p-10 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-100 transition-all"
  >
    <div className="mb-8 p-5 rounded-2xl bg-blue-50 border border-blue-100 transition-all group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 shadow-sm">
      {icon}
    </div>
    <h3 className="text-xl font-black mb-4 uppercase tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export default Landing;
