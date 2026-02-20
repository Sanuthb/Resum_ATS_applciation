import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Download, Sparkles, Layout, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import OptimizationPanel from '../components/OptimizationPanel';
import TemplateSelector from '../components/TemplateSelector';
import { resumeService, pdfService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const DEFAULT_RESUME = {
  name: 'Untitled Architecture',
  personalInfo: { fullName: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '' },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  summary: '',
  publications: [],
  interests: [],
  templateId: 'modern',
  labels: {
    summary: "Operational Summary",
    experience: "Career Trajectory",
    education: "Knowledge Foundations",
    skills: "Core Expertise",
    projects: "Project Modules",
    publications: "Publications & Patents",
    interests: "Interests",
    tagline: "Professional Portfolio Module"
  }
};

const Builder = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [resumeData, setResumeData] = useState({
    ...DEFAULT_RESUME
  });

  const [activeTab, setActiveTab] = useState('edit');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    const fetchResume = async () => {
      try {
        const { data } = await resumeService.getResume(id);
        const content = data.content || {};
        setResumeData({
          ...DEFAULT_RESUME,
          id: data.id,
          name: data.name || DEFAULT_RESUME.name,
          personalInfo: { ...DEFAULT_RESUME.personalInfo, ...content.personalInfo },
          education: content.education || [],
          experience: content.experience || [],
          projects: content.projects || [],
          skills: content.skills || [],
          summary: content.summary || '',
          publications: content.publications || [],
          interests: content.interests || [],
          templateId: content.templateId || 'modern',
          labels: { ...DEFAULT_RESUME.labels, ...content.labels }
        });
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (resumeData.id) {
        await resumeService.updateResume(resumeData.id, { 
          name: resumeData.name, 
          content: resumeData 
        });
      } else {
        const { data } = await resumeService.createResume({ 
          name: resumeData.name, 
          content: resumeData 
        });
        setResumeData({ ...resumeData, id: data.id });
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const previewElement = document.querySelector('.resume-preview-container');
      const html = `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; }
              ${document.querySelector('style')?.innerHTML || ''}
            </style>
          </head>
          <body>${previewElement.innerHTML}</body>
        </html>
      `;
      
      const response = await pdfService.generatePDF(html);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdate = (newData) => {
    setResumeData(newData);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading architecture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 pt-20">
      {/* Top Bar - Architectural Console */}
      <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200 relative z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex flex-col">
            <input
              className="text-lg font-black tracking-tight bg-transparent border-none focus:ring-0 p-0 text-slate-900 min-w-[240px] placeholder:text-slate-300"
              value={resumeData.name}
              onChange={(e) => handleUpdate({ ...resumeData, name: e.target.value })}
              placeholder="Module Name..."
            />
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${resumeData.id ? 'bg-green-500' : 'bg-blue-600'}`} />
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                {resumeData.id ? 'Secure Session Active' : 'Local Sandbox Mode'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-outline-blue py-3 px-6 text-xs flex items-center gap-2 border-slate-200"
          >
            <Save size={14} className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Syncing...' : 'Save Architecture'}</span>
          </button>
          <button 
            onClick={exportPDF}
            disabled={isExporting}
            className="btn-premium py-3 px-8 text-xs shadow-md"
          >
            <Download size={14} className={isExporting ? 'animate-bounce' : ''} /> 
            <span>{isExporting ? 'Synthesizing...' : 'Generate PDF'}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar Navigation */}
        <div className="w-20 flex flex-col items-center py-10 gap-6 border-r border-slate-200 bg-white">
          <SidebarIcon 
            active={activeTab === 'edit'} 
            onClick={() => setActiveTab('edit')} 
            icon={<Layout size={20} />} 
          />
          <SidebarIcon 
            active={activeTab === 'design'} 
            onClick={() => setActiveTab('design')} 
            icon={<Layout size={20} />} 
          />
          <SidebarIcon 
            active={activeTab === 'optimize'} 
            onClick={() => setActiveTab('optimize')} 
            icon={<Sparkles size={20} />} 
          />
        </div>

        {/* Dynamic Panel */}
        <div className="w-[500px] flex flex-col bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar p-10 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'edit' ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: 'spring', damping: 25 }}
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Architecture</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Core Professional Components</p>
                </div>
                <ResumeForm data={resumeData} onUpdate={handleUpdate} />
              </motion.div>
            ) : activeTab === 'design' ? (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col gap-6"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Aesthetics</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Visual Logic & Identity</p>
                </div>
                <TemplateSelector 
                  selectedId={resumeData.templateId} 
                  onSelect={(id) => handleUpdate({ ...resumeData, templateId: id })}
                  labels={resumeData.labels}
                  onLabelChange={(key, val) => handleUpdate({ 
                    ...resumeData, 
                    labels: { ...resumeData.labels, [key]: val } 
                  })}
                />
              </motion.div>
            ) : (
              <motion.div
                key="optimize"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ type: 'spring', damping: 25 }}
                className="flex flex-col gap-6"
              >
                <div className="mb-12">
                  <h2 className="text-4xl font-black mb-2 tracking-tight text-blue-600">Intelligence</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Optimizing for Protocols</p>
                </div>
                <OptimizationPanel resumeData={resumeData} onUpdate={handleUpdate} isPro={user?.tier === 'pro'} onUpgrade={refreshUser} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Preview Console */}
        <div className="flex-1 bg-slate-100 p-16 overflow-y-auto custom-scrollbar flex justify-center items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-[850px] w-full resume-preview-container shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 bg-white"
          >
            <ResumePreview data={resumeData} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const SidebarIcon = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-2xl transition-all relative group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}
  >
    {icon}
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute inset-0 rounded-2xl border border-blue-400/20"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
      />
    )}
  </button>
);

export default Builder;
