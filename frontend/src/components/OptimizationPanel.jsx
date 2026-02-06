import { useState } from 'react';
import { Sparkles, Target, FileCheck, Zap, Clipboard } from 'lucide-react';
import { jobService, aiService } from '../services/api';
import UpgradePrompt from './UpgradePrompt';
import { motion, AnimatePresence } from 'framer-motion';

const OptimizationPanel = ({ resumeData, onUpdate, isPro = true, onUpgrade }) => {
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [score, setScore] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await jobService.analyzeJD(jd);
      setAnalysis(res.data.analysis);
      let scoreRes = { data: { score: 0 } };
      if (resumeData.id && res.data.id) {
        try {
          scoreRes = await jobService.scoreResume(resumeData.id, res.data.id);
        } catch (_) {}
      }
      setScore(scoreRes.data.score);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!resumeData.experience?.length) return;
    setIsOptimizing(true);
    try {
      const bulletPoints = resumeData.experience.map((exp) => exp.description || '');
      const targetKeywords = analysis.keywords || [...(analysis.skills || []), ...(analysis.technologies || []), ...(analysis.focus_areas || [])];
      const res = await aiService.optimizeBullets(bulletPoints, targetKeywords);
      const arr = Array.isArray(res.data) ? res.data : (res.data?.optimized || res.data?.bullets || []);
      const newExp = [...resumeData.experience];
      arr.forEach((opt, idx) => {
        if (newExp[idx]) newExp[idx] = { ...newExp[idx], description: opt };
      });
      onUpdate({ ...resumeData, experience: newExp });
    } catch (error) {
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleGenerateCL = async () => {
    setIsGeneratingCL(true);
    try {
      const res = await aiService.generateCoverLetter(resumeData, jd);
      setCoverLetter(res.data.coverLetter || '');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h4 className="flex items-center gap-2 font-medium text-stone-900 mb-4">
          <Target size={18} className="text-emerald-600" /> Job description
        </h4>
        <textarea
          className="input min-h-[140px] text-sm resize-none"
          placeholder="Paste the job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <button onClick={handleAnalyze} disabled={loading || !jd.trim()} className="btn-primary w-full mt-4">
          {loading ? (
            <span className="flex items-center gap-2">
              <Zap size={18} className="animate-spin" /> Analyzing...
            </span>
          ) : (
            <>
              <Zap size={18} /> Analyze & score
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4 text-center">
                <p className="text-xs text-stone-500 mb-1">ATS match</p>
                <p className="text-2xl font-bold text-emerald-600">{score}%</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-xs text-stone-500 mb-1">Keywords found</p>
                <p className="text-2xl font-bold text-stone-900">{(analysis.keywords || []).length}</p>
              </div>
            </div>

            {!isPro ? (
              <UpgradePrompt onSuccess={onUpgrade} compact />
            ) : (
              <button
                onClick={handleOptimize}
                disabled={isOptimizing || !resumeData.experience?.length}
                className="btn-primary w-full"
              >
                <Sparkles size={18} />
                {isOptimizing ? 'Optimizing...' : 'Optimize bullet points'}
              </button>
            )}

            <div className="card p-5">
              <h4 className="flex items-center gap-2 font-medium text-stone-900 mb-4">
                <FileCheck size={18} className="text-emerald-600" /> Cover letter
              </h4>
              {coverLetter ? (
                <div className="space-y-4">
                  <textarea
                    className="input min-h-[180px] text-sm resize-none"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                  <button onClick={copyCoverLetter} className="btn-secondary w-full text-sm">
                    <Clipboard size={16} /> Copy to clipboard
                  </button>
                </div>
              ) : !isPro ? (
                <UpgradePrompt onSuccess={onUpgrade} compact />
              ) : (
                <button
                  onClick={handleGenerateCL}
                  disabled={isGeneratingCL}
                  className="btn-secondary w-full py-3 border-dashed"
                >
                  {isGeneratingCL ? 'Generating...' : 'Generate cover letter'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizationPanel;
