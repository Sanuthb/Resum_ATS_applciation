import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, ExternalLink, Trash2, Search, Filter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { resumeService } from '../services/api';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await resumeService.getResumes();
        setResumes(data);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl font-black mb-2 tracking-tight text-slate-900">System Terminal</h1>
            <p className="text-slate-500 font-medium">Curating <span className="text-blue-600 font-bold">{resumes.length}</span> high-performance professional architectures.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link to="/builder" className="btn-premium py-4 px-10 shadow-lg group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span>Initialize New Architecture</span>
            </Link>
          </motion.div>
        </header>

        {/* Dynamic Stats Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <StatCard title="Overall Precision" value="78%" icon={<Sparkles className="text-blue-600" size={20} />} />
          <StatCard title="System Credits" value="12" icon={<Zap className="text-blue-600" size={20} />} />
          <StatCard title="Domain Ranking" value="Senior" icon={<FileText className="text-blue-600" size={20} />} />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="relative flex-1 w-full max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Query architectures..." 
              className="input-premium-light pl-14 py-4"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="btn-outline-blue py-4 px-8 text-sm flex items-center justify-center gap-2 flex-1 md:flex-none">
              <Filter size={18} /> Parameters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => <div key={i} className="glass-card-light h-64 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 flex flex-col gap-8 group shadow-sm hover:shadow-xl hover:border-blue-100 transition-all relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 group-hover:scale-110 transition-transform shadow-inner">
                      <FileText size={32} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">ATS Protocol</span>
                      <span className="text-3xl font-black text-blue-600">{resume.score || '85'}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black mb-2 group-hover:text-blue-600 transition-colors tracking-tight text-slate-900">{resume.name}</h3>
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                      <Clock size={14} className="text-blue-500/50" />
                      <span>Updated {resume.updatedAt || 'Recently'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Link to={`/builder/${resume.id}`} className="btn-premium py-3 justify-center text-xs shadow-none">
                      Optimize
                    </Link>
                    <button className="btn-outline-blue py-3 justify-center text-xs border-slate-200">
                      View PDF
                    </button>
                  </div>

                  <button className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center justify-between group shadow-sm hover:shadow-md transition-all"
  >
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{title}</p>
      <p className="text-4xl font-black tracking-tight text-slate-900">{value}</p>
    </div>
    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
      {icon}
    </div>
  </motion.div>
);

export default Dashboard;
