import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Download, Sparkles, Layout, Palette, ChevronLeft } from 'lucide-react';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import OptimizationPanel from '../components/OptimizationPanel';
import TemplateSelector from '../components/TemplateSelector';
import { resumeService, pdfService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const DEFAULT_RESUME = {
  name: 'My Resume',
  personalInfo: { fullName: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', tagline: '' },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  summary: '',
  publications: [],
  interests: [],
  customSections: [],
  templateId: 'minimal',
  labels: {
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    publications: 'Publications',
    interests: 'Interests',
    tagline: 'Professional Tagline'
  }
};

const Builder = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [resumeData, setResumeData] = useState({ ...DEFAULT_RESUME });
  const [activeTab, setActiveTab] = useState('edit');
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
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
          customSections: content.customSections || [],
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
    setSaveError('');
    try {
      if (resumeData.id) {
        await resumeService.updateResume(resumeData.id, { name: resumeData.name, content: resumeData });
      } else {
        const { data } = await resumeService.createResume({ name: resumeData.name, content: resumeData });
        setResumeData((prev) => ({ ...prev, id: data.id }));
      }
    } catch (error) {
      const msg = error.response?.data?.error || 'Save failed';
      setSaveError(msg);
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
            <style>body { font-family: system-ui, sans-serif; }</style>
          </head>
          <body>${previewElement?.innerHTML || ''}</body>
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
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdate = (newData) => setResumeData(newData);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50 pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-stone-500">Loading resume...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'edit', label: 'Content', icon: Layout },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'optimize', label: 'Optimize', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-stone-50 pt-16 flex flex-col">
      <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-stone-100 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 -ml-2 text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <input
            className="font-semibold text-stone-900 bg-transparent border-none focus:outline-none focus:ring-0 min-w-[200px]"
            value={resumeData.name}
            onChange={(e) => handleUpdate({ ...resumeData, name: e.target.value })}
            placeholder="Resume name"
          />
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              resumeData.id ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
            }`}
          >
            {resumeData.id ? 'Saved' : 'Unsaved'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {saveError && <p className="text-sm text-red-600">{saveError}</p>}
          <button onClick={handleSave} disabled={isSaving} className="btn-secondary py-2 px-4 text-sm">
            <Save size={16} className={isSaving ? 'animate-spin' : ''} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={exportPDF} disabled={isExporting} className="btn-primary py-2 px-4 text-sm">
            <Download size={16} /> {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-16 flex flex-col items-center py-6 gap-2 bg-white border-r border-stone-100 shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                activeTab === id ? 'bg-emerald-50 text-emerald-600' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
              }`}
              title={label}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          ))}
        </aside>

        <div className="w-[420px] flex flex-col bg-white border-r border-stone-100 overflow-y-auto shrink-0">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'edit' && (
                <motion.div key="edit" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                  <h2 className="font-serif text-xl font-semibold text-stone-900">Content</h2>
                  <ResumeForm data={resumeData} onUpdate={handleUpdate} />
                </motion.div>
              )}
              {activeTab === 'design' && (
                <motion.div key="design" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                  <h2 className="font-serif text-xl font-semibold text-stone-900">Design</h2>
                  <TemplateSelector
                    selectedId={resumeData.templateId}
                    onSelect={(id) => handleUpdate({ ...resumeData, templateId: id })}
                    labels={resumeData.labels}
                    onLabelChange={(key, val) => handleUpdate({ ...resumeData, labels: { ...resumeData.labels, [key]: val } })}
                    isPro={user?.tier === 'pro'}
                    onUpgrade={refreshUser}
                  />
                </motion.div>
              )}
              {activeTab === 'optimize' && (
                <motion.div key="optimize" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                  <h2 className="font-serif text-xl font-semibold text-stone-900">Optimize</h2>
                  <OptimizationPanel resumeData={resumeData} onUpdate={handleUpdate} isPro={user?.tier === 'pro'} onUpgrade={refreshUser} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <main className="flex-1 bg-stone-100 p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[800px] resume-preview-container card shadow-lg">
            <ResumePreview data={resumeData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Builder;
