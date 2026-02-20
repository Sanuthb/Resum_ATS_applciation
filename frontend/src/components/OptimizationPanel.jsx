import { useState } from 'react';
import { Sparkles, Target, AlertCircle, CheckCircle2, FileCheck, Zap, ArrowRight, Clipboard } from 'lucide-react';
import { jobService, aiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const OptimizationPanel = ({ resumeData, onUpdate }) => {
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
      
      // We still need to pass a valid resume_id. For now, we'll use a placeholder or ID from props if available.
      const scoreRes = await jobService.scoreResume(resumeData.id || 'mock-id', res.data.id);
      setScore(scoreRes.data.score);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const bulletPoints = resumeData.experience.map(exp => exp.description);
      const targetKeywords = analysis.technical_skills.concat(analysis.keywords);
      
      const res = await aiService.optimizeBullets(bulletPoints, targetKeywords);
      
      const newExperience = [...resumeData.experience];
      res.data.forEach((optimized, idx) => {
        if (newExperience[idx]) newExperience[idx].description = optimized;
      });

      onUpdate({ ...resumeData, experience: newExperience });
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
      setCoverLetter(res.data.coverLetter);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingCL(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* JD Processor */}
      <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 relative overflow-hidden group shadow-sm">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl group-focus-within:bg-blue-200/50 transition-all" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Target Objective</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Operational Parameters</p>
          </div>
        </div>

        <textarea
          className="input-premium-light min-h-[180px] bg-white border-blue-100 text-sm leading-relaxed"
          placeholder="Paste requirements architecture here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        
        <button 
          onClick={handleAnalyze}
          disabled={loading || !jd}
          className="btn-premium w-full mt-6 py-4 justify-center shadow-lg"
        >
          {loading ? (
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Zap size={20} />
             </motion.div>
          ) : (
            <div className="flex items-center gap-2">
               <Zap size={20} />
               <span>Initiate Deep Scan</span>
            </div>
          )}
        </button>
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Analysis Result */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Systems Match</span>
                <span className="text-4xl font-black text-blue-600">{score}%</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Keywords Synced</span>
                <span className="text-4xl font-black text-slate-900">{analysis.technical_skills.length}</span>
              </div>
            </div>

            <button 
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="btn-premium w-full bg-slate-900 text-white py-4 shadow-xl hover:bg-slate-800"
            >
              {isOptimizing ? 'Re-engineering...' : 'Auto-Optimize Content'} <Sparkles size={20} className="ml-2" />
            </button>

            {/* Cover Letter Panel */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                       <FileCheck size={18} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Synthesis Output</h4>
                 </div>
              </div>

              {coverLetter ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <textarea 
                    className="input-premium-light bg-slate-50 border-slate-100 min-h-[220px] text-xs leading-relaxed"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                  <button className="btn-outline-blue w-full py-3 text-sm flex items-center justify-center gap-2">
                    <Clipboard size={16} /> Copy Synthesis
                  </button>
                </motion.div>
              ) : (
                <button 
                  onClick={handleGenerateCL}
                  disabled={isGeneratingCL}
                  className="btn-outline-blue w-full py-4 text-sm border-dashed border-blue-200 bg-blue-50/20 hover:bg-blue-50 transition-all font-bold"
                >
                  {isGeneratingCL ? 'Synthesizing...' : 'Generate Contextual Letter'}
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
