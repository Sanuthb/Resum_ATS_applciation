import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, ExternalLink, Trash2, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const FREE_RESUME_LIMIT = 3;

const Dashboard = () => {
  const { user } = useAuth();
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
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">My Resumes</h1>
            <p className="text-stone-600 mt-1">
              {resumes.length} of {user?.tier === 'pro' ? '∞' : FREE_RESUME_LIMIT} resumes
              {user?.tier !== 'pro' && resumes.length >= FREE_RESUME_LIMIT && (
                <span className="ml-2 text-amber-600 text-sm">· Upgrade for unlimited</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user?.tier !== 'pro' && resumes.length >= FREE_RESUME_LIMIT ? (
              <Link to="/pricing" className="btn-primary shrink-0">
                <Sparkles size={18} /> Upgrade to add more
              </Link>
            ) : (
              <Link to="/builder" className="btn-primary shrink-0">
                <Plus size={18} /> New resume
              </Link>
            )}
          </div>
        </header>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, skills, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 max-w-md"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-8 h-64 animate-pulse">
                <div className="h-12 w-12 rounded-xl bg-stone-200 mb-6" />
                <div className="h-6 bg-stone-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-stone-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-stone-400" />
            </div>
            <p className="text-stone-600 font-medium">
              {searchQuery ? 'No resumes match your search' : 'No resumes yet'}
            </p>
            <p className="text-stone-500 text-sm mt-1">
              {searchQuery ? 'Try a different search' : 'Create your first resume to get started'}
            </p>
            {!searchQuery && (
              <Link to="/builder" className="btn-primary mt-6 inline-flex">
                <Plus size={18} /> Create resume
              </Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredResumes.map((resume, index) => (
                <ResumeCard key={resume.id} resume={resume} index={index} onDelete={fetchResumes} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const ResumeCard = ({ resume, index, onDelete }) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="card p-6 group hover:shadow-md transition-shadow relative"
    >
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-4 right-4 p-2 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <FileText size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-900 truncate">{resume.name}</h3>
          <p className="text-sm text-stone-500 mt-0.5 flex items-center gap-1.5">
            <Clock size={14} />
            Updated {(resume.updated_at || resume.updatedAt)
              ? new Date(resume.updated_at || resume.updatedAt).toLocaleDateString()
              : '—'}
          </p>
        </div>
        {resume.score != null && (
          <div className="text-right shrink-0">
            <p className="text-xs text-stone-500">ATS score</p>
            <p className="font-semibold text-emerald-600">{resume.score}%</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Link
          to={`/builder/${resume.id}`}
          className="btn-primary flex-1 py-2.5 text-sm justify-center"
        >
          Edit <ExternalLink size={14} />
        </Link>
        <Link
          to={`/builder/${resume.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex-1 py-2.5 text-sm justify-center"
        >
          View
        </Link>
      </div>
    </motion.div>
  );
};

export default Dashboard;
