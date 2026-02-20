import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, ExternalLink, Trash2, Search, Filter, Sparkles,Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeService } from '../services/api';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    fetchResumes();
  }, []);

  const filteredResumes = resumes.filter((r) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    const name = (r.name || '').toLowerCase();
    const content = JSON.stringify(r.content || {}).toLowerCase();
    return name.includes(q) || content.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden text-white font-inter">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[70%] bg-blue-600/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[60%] bg-indigo-600/10 blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Universal Control</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter leading-none text-white">
              System <span className="text-blue-500">Terminal</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-md leading-relaxed mt-2">
              Managing <span className="text-white font-bold">{resumes.length}</span> high-performance professional architectures for global deployment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Link to="/builder" className="group relative overflow-hidden px-10 py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 border border-blue-400/20">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              <span>Initialize New Architecture</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
          </motion.div>
        </header>

        {/* Premium Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <StatCard title="Total Resumes" value={resumes.length} icon={<FileText size={24} />} color="blue" delay={0.1} />
          <StatCard title="System Credits" value="∞" icon={<Zap size={24} />} color="indigo" delay={0.2} />
          <StatCard title="Plan" value="Pro" icon={<Sparkles size={24} />} color="blue" delay={0.3} />
        </div>

        {/* Search & Filter - Glassmorphic */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div className="relative flex-1 w-full max-w-2xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search resumes by name, skills, or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-5 pl-16 pr-8 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-slate-600 backdrop-blur-xl"
            />
          </div>
          <button className="flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all backdrop-blur-xl shrink-0 group">
            <Filter size={18} className="group-hover:text-blue-500 transition-colors" />
            <span>Parameters</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-[32px] bg-white/[0.01] border border-white/[0.05] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredResumes.length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-500">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-bold">{searchQuery ? 'No resumes match your search' : 'No resumes yet. Create your first one!'}</p>
                </div>
              ) : (
                filteredResumes.map((resume, index) => (
                  <ArchiveCard key={resume.id} resume={resume} index={index} onDelete={fetchResumes} />
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className="bg-white/[0.02] border border-white/[0.08] p-10 rounded-[40px] flex items-center justify-between group backdrop-blur-2xl hover:border-blue-500/30 transition-all"
  >
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">{title}</p>
      <p className="text-5xl font-black tracking-tighter text-white group-hover:text-blue-500 transition-colors">{value}</p>
    </div>
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color === 'blue' ? 'bg-blue-600/10 text-blue-500' : 'bg-indigo-600/10 text-indigo-500'} border border-white/5 shadow-inner group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500`}>
      {icon}
    </div>
  </motion.div>
);

const ArchiveCard = ({ resume, index, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this resume? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await resumeService.deleteResume(resume.id);
      onDelete?.();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="relative group h-[340px]"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/5 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    <div className="relative h-full bg-white/[0.03] border border-white/[0.08] p-10 rounded-[40px] flex flex-col gap-8 backdrop-blur-3xl group-hover:border-blue-500/50 transition-all duration-500 shadow-2xl overflow-hidden">
      {/* Decorative Gradient Overlay */}
      <div className="absolute -top-[20%] -right-[20%] w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all"></div>
      
      <div className="flex justify-between items-start z-10">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-blue-500 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
          <FileText size={32} />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mb-2">ATS Efficiency</span>
          <div className="relative flex items-center justify-center w-14 h-14">
             <svg className="w-full h-full -rotate-90">
               <circle cx="28" cy="28" r="24" fill="none" strokeWidth="4" className="stroke-white/[0.05]" />
               <motion.circle 
                 cx="28" cy="28" r="24" fill="none" strokeWidth="4" 
                 className="stroke-blue-600" 
                 strokeDasharray="150" 
                 initial={{ strokeDashoffset: 150 }}
                 animate={{ strokeDashoffset: 150 - (150 * (resume.score || 85) / 100) }}
                 transition={{ duration: 1.5, delay: index * 0.1 }}
               />
             </svg>
             <span className="absolute text-xs font-black text-white">{resume.score || '85'}</span>
          </div>
        </div>
      </div>
      
      <div className="z-10 flex-1">
        <h3 className="text-3xl font-black text-white mb-3 group-hover:text-blue-500 transition-colors tracking-tight truncate">{resume.name}</h3>
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <Clock size={12} className="text-blue-500" />
          <span>Updated {(resume.updated_at || resume.updatedAt) ? new Date(resume.updated_at || resume.updatedAt).toLocaleDateString() : '—'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 z-10">
        <Link to={`/builder/${resume.id}`} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
          <span>Edit</span>
          <ExternalLink size={12} />
        </Link>
        <Link to={`/builder/${resume.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.1] hover:text-white transition-all">
          <span>View</span>
        </Link>
      </div>

      <button onClick={handleDelete} disabled={deleting} className="absolute top-8 right-8 p-2 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-125 disabled:opacity-50">
        <Trash2 size={16} />
      </button>
    </div>
  </motion.div>
  );
};

export default Dashboard;
