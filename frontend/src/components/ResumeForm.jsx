import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Plus, Trash2, Layout, Linkedin, Github, Award, Heart, FilePlus } from 'lucide-react';

const ResumeForm = ({ data, onUpdate }) => {
  const addExperience = () => {
    onUpdate({ ...data, experience: [...data.experience, { company: '', role: '', duration: '', description: '' }] });
  };
  const updateExperience = (i, field, value) => {
    const exp = [...data.experience];
    exp[i][field] = value;
    onUpdate({ ...data, experience: exp });
  };
  const removeExperience = (i) => {
    onUpdate({ ...data, experience: data.experience.filter((_, idx) => idx !== i) });
  };

  const addEducation = () => {
    onUpdate({ ...data, education: [...data.education, { school: '', degree: '', duration: '', description: '' }] });
  };
  const updateEducation = (i, field, value) => {
    const edu = [...data.education];
    edu[i][field] = value;
    onUpdate({ ...data, education: edu });
  };
  const removeEducation = (i) => {
    onUpdate({ ...data, education: data.education.filter((_, idx) => idx !== i) });
  };

  const addProject = () => {
    onUpdate({ ...data, projects: [...data.projects, { name: '', description: '', duration: '' }] });
  };
  const updateProject = (i, field, value) => {
    const p = [...data.projects];
    p[i][field] = value;
    onUpdate({ ...data, projects: p });
  };
  const removeProject = (i) => {
    onUpdate({ ...data, projects: data.projects.filter((_, idx) => idx !== i) });
  };

  const addPublication = () => {
    onUpdate({ ...data, publications: [...data.publications, { title: '', description: '' }] });
  };
  const updatePublication = (i, field, value) => {
    const pub = [...data.publications];
    pub[i][field] = value;
    onUpdate({ ...data, publications: pub });
  };
  const removePublication = (i) => {
    onUpdate({ ...data, publications: data.publications.filter((_, idx) => idx !== i) });
  };

  const addSkill = (s) => {
    if (!s || data.skills.includes(s)) return;
    onUpdate({ ...data, skills: [...data.skills, s] });
  };
  const removeSkill = (s) => onUpdate({ ...data, skills: data.skills.filter((x) => x !== s) });

  const addInterest = (i) => {
    if (!i || data.interests.includes(i)) return;
    onUpdate({ ...data, interests: [...data.interests, i] });
  };
  const removeInterest = (i) => onUpdate({ ...data, interests: data.interests.filter((x) => x !== i) });

  const updatePersonalInfo = (field, value) => {
    onUpdate({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const addCustomSection = () => {
    onUpdate({ ...data, customSections: [...(data.customSections || []), { title: '', content: '' }] });
  };
  const updateCustomSection = (i, field, value) => {
    const sections = [...(data.customSections || [])];
    sections[i] = { ...sections[i], [field]: value };
    onUpdate({ ...data, customSections: sections });
  };
  const removeCustomSection = (i) => {
    onUpdate({ ...data, customSections: (data.customSections || []).filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-10">
      <Section title="Personal info" icon={<User size={16} />}>
        <div className="grid gap-4">
          <Input label="Full name" value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo('fullName', v)} placeholder="John Doe" />
          <Input label="Tagline" value={data.personalInfo.tagline} onChange={(v) => updatePersonalInfo('tagline', v)} placeholder="e.g. Software Engineer | Full-Stack Developer" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" value={data.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} placeholder="john@example.com" />
            <Input label="Phone" value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} placeholder="+1 234 567 890" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="LinkedIn" value={data.personalInfo.linkedin} onChange={(v) => updatePersonalInfo('linkedin', v)} placeholder="linkedin.com/in/johndoe" />
            <Input label="GitHub" value={data.personalInfo.github} onChange={(v) => updatePersonalInfo('github', v)} placeholder="github.com/johndoe" />
          </div>
          <Input label="Location" value={data.personalInfo.location} onChange={(v) => updatePersonalInfo('location', v)} placeholder="City, Country" />
        </div>
      </Section>

      <Section title="Summary" icon={<Layout size={16} />}>
        <textarea
          className="input min-h-[100px] resize-none"
          placeholder="Brief professional summary..."
          value={data.summary}
          onChange={(e) => onUpdate({ ...data, summary: e.target.value })}
        />
      </Section>

      <Section title="Experience" icon={<Briefcase size={16} />} onAdd={addExperience}>
        {data.experience.map((exp, i) => (
          <Block key={i} onRemove={() => removeExperience(i)}>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Company" value={exp.company} onChange={(v) => updateExperience(i, 'company', v)} />
              <Input label="Role" value={exp.role} onChange={(v) => updateExperience(i, 'role', v)} />
            </div>
            <Input label="Duration" value={exp.duration} onChange={(v) => updateExperience(i, 'duration', v)} placeholder="Jan 2020 – Present" />
            <textarea
              className="input min-h-[80px] text-sm resize-none"
              placeholder="Key achievements..."
              value={exp.description}
              onChange={(e) => updateExperience(i, 'description', e.target.value)}
            />
          </Block>
        ))}
      </Section>

      <Section title="Education" icon={<GraduationCap size={16} />} onAdd={addEducation}>
        {data.education.map((edu, i) => (
          <Block key={i} onRemove={() => removeEducation(i)}>
            <div className="grid grid-cols-2 gap-4">
              <Input label="School" value={edu.school} onChange={(v) => updateEducation(i, 'school', v)} />
              <Input label="Degree" value={edu.degree} onChange={(v) => updateEducation(i, 'degree', v)} />
            </div>
            <Input label="Duration" value={edu.duration} onChange={(v) => updateEducation(i, 'duration', v)} />
          </Block>
        ))}
      </Section>

      <Section title="Projects" icon={<Layout size={16} />} onAdd={addProject}>
        {data.projects.map((proj, i) => (
          <Block key={i} onRemove={() => removeProject(i)}>
            <Input label="Project name" value={proj.name} onChange={(v) => updateProject(i, 'name', v)} />
            <Input label="Duration" value={proj.duration} onChange={(v) => updateProject(i, 'duration', v)} />
            <textarea
              className="input min-h-[60px] text-sm resize-none"
              placeholder="Description..."
              value={proj.description}
              onChange={(e) => updateProject(i, 'description', e.target.value)}
            />
          </Block>
        ))}
      </Section>

      <Section title="Skills" icon={<Layout size={16} />}>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.skills?.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="hover:text-emerald-900">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="input"
          placeholder="Add skill (press Enter)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addSkill(e.target.value.trim());
              e.target.value = '';
            }
          }}
        />
      </Section>

      <Section title="Publications" icon={<Award size={16} />} onAdd={addPublication}>
        {data.publications?.map((pub, i) => (
          <Block key={i} onRemove={() => removePublication(i)}>
            <Input label="Title" value={pub.title} onChange={(v) => updatePublication(i, 'title', v)} />
            <textarea
              className="input min-h-[60px] text-sm resize-none"
              placeholder="Details..."
              value={pub.description}
              onChange={(e) => updatePublication(i, 'description', e.target.value)}
            />
          </Block>
        ))}
      </Section>

      <Section title="Custom sections" icon={<FilePlus size={16} />} onAdd={addCustomSection}>
        {(data.customSections || []).map((sec, i) => (
          <Block key={i} onRemove={() => removeCustomSection(i)}>
            <Input label="Section heading" value={sec.title} onChange={(v) => updateCustomSection(i, 'title', v)} placeholder="e.g. Certifications, Languages, Volunteer Work" />
            <textarea
              className="input min-h-[80px] text-sm resize-none"
              placeholder="Section content or details..."
              value={sec.content}
              onChange={(e) => updateCustomSection(i, 'content', e.target.value)}
            />
          </Block>
        ))}
      </Section>

      <Section title="Interests" icon={<Heart size={16} />}>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.interests?.map((i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-sm">
              {i}
              <button type="button" onClick={() => removeInterest(i)} className="hover:text-stone-900">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          className="input"
          placeholder="Add interest (press Enter)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addInterest(e.target.value.trim());
              e.target.value = '';
            }
          }}
        />
      </Section>
    </div>
  );
};

const Section = ({ title, icon, onAdd, children }) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h3 className="flex items-center gap-2 font-medium text-stone-900">
        <span className="text-emerald-600">{icon}</span>
        {title}
      </h3>
      {onAdd && (
        <button type="button" onClick={onAdd} className="p-1.5 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
          <Plus size={18} />
        </button>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Block = ({ onRemove, children }) => (
  <div className="relative p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-4 group">
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-3 right-3 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
    >
      <Trash2 size={14} />
    </button>
    {children}
  </div>
);

const Input = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="label">{label}</label>
    <input type="text" className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

export default ResumeForm;
