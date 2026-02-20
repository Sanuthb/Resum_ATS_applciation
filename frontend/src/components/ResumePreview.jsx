import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const ResumePreview = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <div className="bg-white w-full min-h-[1000px] p-[8%] flex flex-col gap-10 text-slate-700 font-inter leading-relaxed relative overflow-hidden">
      {/* Subtle Blueprint Grid (Decorative) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {/* Header - Modern Minimalist */}
      <header className="flex flex-col items-start gap-6 border-b-2 border-slate-900 pb-10 relative">
        <div className="flex flex-col gap-2">
           <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            {personalInfo.fullName || 'Architecture Lead'}
          </h1>
          <p className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Professional Architecture Module</p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {personalInfo.email && (
            <div className="flex items-center gap-2 group">
              <Mail size={14} className="text-blue-500" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-blue-500" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="flex flex-col gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-l-4 border-blue-600 pl-4">Operational Summary</h2>
          <p className="text-[15px] text-slate-600 font-medium leading-relaxed italic pr-10">{summary}</p>
        </section>
      )}

      {/* Experience */}
      <section className="flex flex-col gap-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-l-4 border-blue-600 pl-4">Career Trajectory</h2>
        <div className="flex flex-col gap-10">
          {experience.length > 0 ? experience.map((exp, idx) => (
            <div key={idx} className="flex flex-col gap-3 relative">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">{exp.role || 'Designation'}</h3>
                <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">{exp.duration || 'Temporal Range'}</span>
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{exp.company || 'Enterprise Identification'}</div>
              <p className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-line mt-2 text-justify">
                {exp.description || 'Define your operative impact...'}
              </p>
            </div>
          )) : (
            <div className="text-sm text-slate-300 italic font-medium">System awaiting data input...</div>
          )}
        </div>
      </section>

      {/* Skills / Expertise */}
      <section className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-end">
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Core Expertise</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
             {['Systems Strategy', 'Optimization', 'Architecture'].map(s => (
               <span key={s} className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1 h-1 bg-blue-600 rounded-full" /> {s}
               </span>
             ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end opacity-50">
           <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">Timestamp</p>
           <p className="text-[9px] font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        </div>
      </section>
    </div>
  );
};

export default ResumePreview;
