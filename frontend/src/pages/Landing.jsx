import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Target, FileCheck, PenLine, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-emerald-50/30">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="inline-flex items-center gap-2 text-emerald-600 font-medium text-sm mb-6">
            <Sparkles size={16} /> AI-powered resume builder
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-stone-900 mb-6 leading-tight">
            Build resumes that <br />
            <span className="text-emerald-600">get you hired</span>
          </h1>
          <p className="text-lg text-stone-600 mb-10 leading-relaxed">
            Create professional resumes, optimize for ATS, and generate tailored cover letters. 
            All in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary px-8 py-4 text-base">
              Get started free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-4 text-base">Sign in</Link>
            <Link to="/pricing" className="btn-secondary px-8 py-4 text-base">Pricing</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-24 grid sm:grid-cols-3 gap-6"
        >
          <Feature icon={<PenLine />} title="Build" text="Add experience, education, skills with a clean editor and live preview." />
          <Feature icon={<Target />} title="Optimize" text="Paste job descriptions and let AI align your resume with keywords." />
          <Feature icon={<FileCheck />} title="Export" text="Download print-ready PDFs and tailored cover letters." />
        </motion.div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card p-8 text-left"
  >
    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
      {icon}
    </div>
    <h3 className="font-serif font-semibold text-lg text-stone-900 mb-2">{title}</h3>
    <p className="text-stone-600 text-sm leading-relaxed">{text}</p>
  </motion.div>
);

export default Landing;
