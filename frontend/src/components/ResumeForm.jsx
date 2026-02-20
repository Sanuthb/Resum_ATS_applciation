import { User, Mail, Phone, MapPin, Globe, GraduationCap, Briefcase, Plus, Trash2, Layout, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeForm = ({ data, onUpdate }) => {
  const updatePersonalInfo = (field, value) => {
    onUpdate({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    onUpdate({
      ...data,
      experience: [...data.experience, { company: '', role: '', duration: '', description: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...data.experience];
    newExp[index][field] = value;
    onUpdate({ ...data, experience: newExp });
  };

  const removeExperience = (index) => {
    const newExp = [...data.experience];
    newExp.splice(index, 1);
    onUpdate({ ...data, experience: newExp });
  };

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Personal Info */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
          <User size={14} /> Personal Information
        </h2>
        <div className="grid grid-cols-1 gap-5">
          <InputPremium 
            label="Full Identity" 
            value={data.personalInfo.fullName} 
            onChange={(v) => updatePersonalInfo('fullName', v)} 
            placeholder="John Doe"
            icon={<User size={18} />}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputPremium 
              label="Email" 
              value={data.personalInfo.email} 
              onChange={(v) => updatePersonalInfo('email', v)} 
              placeholder="john@example.com"
              icon={<Mail size={18} />}
            />
            <InputPremium 
              label="Contact" 
              value={data.personalInfo.phone} 
              onChange={(v) => updatePersonalInfo('phone', v)} 
              placeholder="+1 234 567 890"
              icon={<Phone size={18} />}
            />
          </div>
          <InputPremium 
            label="Operational Base" 
            value={data.personalInfo.location} 
            onChange={(v) => updatePersonalInfo('location', v)} 
            placeholder="New York, NY"
            icon={<MapPin size={18} />}
          />
        </div>
      </section>

      {/* Summary */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
           <Sparkles size={14} /> Executive Summary
        </h2>
        <div className="relative group">
          <textarea
            className="input-premium-light min-h-[120px] pt-4 leading-relaxed bg-white border-slate-200 group-focus-within:border-blue-500 transition-all text-sm"
            placeholder="Describe your professional trajectory..."
            value={data.summary}
            onChange={(e) => onUpdate({ ...data, summary: e.target.value })}
          />
           <div className="absolute top-4 right-4 text-slate-200 group-focus-within:text-blue-500/20 transition-all">
            <Sparkles size={20} />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
            <Briefcase size={14} /> Experience Modules
          </h2>
          <button onClick={addExperience} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          {data.experience.map((exp, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 border border-slate-100 rounded-2xl bg-slate-50 relative group hover:border-blue-100 hover:bg-white transition-all"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <InputPremium 
                  label="Organization" 
                  value={exp.company} 
                  onChange={(v) => updateExperience(idx, 'company', v)} 
                />
                <InputPremium 
                  label="Role" 
                  value={exp.role} 
                  onChange={(v) => updateExperience(idx, 'role', v)} 
                />
              </div>
              <textarea
                className="input-premium-light bg-white border-slate-100 min-h-[100px] text-sm leading-relaxed"
                placeholder="Key achievements and technological impact..."
                value={exp.description}
                onChange={(e) => updateExperience(idx, 'description', e.target.value)}
              />
              <button 
                onClick={() => removeExperience(idx)}
                className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const InputPremium = ({ label, value, onChange, placeholder, icon }) => (
  <div className="flex flex-col gap-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
      )}
      <input
        type="text"
        className={`input-premium-light text-sm ${icon ? 'pl-12' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default ResumeForm;
