import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { TEMPLATES, DEFAULT_LABELS } from '../config/templates';

const ResumePreview = ({ data }) => {
  const {
    personalInfo,
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    publications = [],
    interests = [],
    customSections = [],
    templateId = 'modern',
    labels = DEFAULT_LABELS
  } = data;
  const template = TEMPLATES[templateId] || TEMPLATES.minimal;
  const s = template.styles;

  return (
    <div className={`w-full min-h-[1000px] p-[10%] flex flex-col gap-8 leading-relaxed relative overflow-hidden transition-all ${s.container}`}>
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${s.gridColor} 0.5px, transparent 0.5px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <header className={`flex flex-col gap-5 relative ${s.header}`}>
        <div className={`flex flex-col gap-1 ${['classic', 'executive'].includes(templateId) ? 'items-center' : 'items-start'}`}>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900">
            {personalInfo?.fullName || 'Your Name'}
          </h1>
          <p className={`${s.accent} text-sm font-medium`}>{personalInfo?.tagline || labels.tagline || DEFAULT_LABELS.tagline}</p>
        </div>
        <div className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600 ${['classic', 'executive'].includes(templateId) ? 'justify-center' : 'justify-start'}`}>
          {personalInfo?.email && (
            <span className="flex items-center gap-2">
              <Mail size={14} /> {personalInfo.email}
            </span>
          )}
          {personalInfo?.phone && (
            <span className="flex items-center gap-2">
              <Phone size={14} /> {personalInfo.phone}
            </span>
          )}
          {personalInfo?.location && (
            <span className="flex items-center gap-2">
              <MapPin size={14} /> {personalInfo.location}
            </span>
          )}
          {personalInfo?.linkedin && (
            <span className="flex items-center gap-2">
              <Linkedin size={14} /> {String(personalInfo.linkedin).replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
          {personalInfo?.github && (
            <span className="flex items-center gap-2">
              <Github size={14} /> {String(personalInfo.github).replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </header>

      {summary && (
        <section>
          <h2 className={s.sectionTitle}>{labels.summary || DEFAULT_LABELS.summary}</h2>
          <p className={`text-[15px] leading-relaxed ${s.bodyText}`}>{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <h2 className={s.sectionTitle}>{labels.experience || DEFAULT_LABELS.experience}</h2>
          <div className="flex flex-col gap-6 mt-4">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-semibold text-stone-900">{exp.role || 'Role'}</h3>
                  <span className={`text-xs font-medium shrink-0 ${s.accent}`}>{exp.duration || 'Dates'}</span>
                </div>
                <p className="text-sm text-stone-600">{exp.company || 'Company'}</p>
                <p className={`text-sm leading-relaxed mt-2 whitespace-pre-line ${s.bodyText}`}>{exp.description || ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section>
          <h2 className={s.sectionTitle}>{labels.education || DEFAULT_LABELS.education}</h2>
          <div className="flex flex-col gap-4 mt-4">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline gap-4">
                <div>
                  <h3 className="font-semibold text-stone-900">{edu.degree || 'Degree'}</h3>
                  <p className="text-sm text-stone-600">{edu.school || 'School'}</p>
                </div>
                <span className={`text-xs font-medium shrink-0 ${s.accent}`}>{edu.duration || 'Dates'}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <h2 className={s.sectionTitle}>{labels.projects || DEFAULT_LABELS.projects}</h2>
          <div className="flex flex-col gap-4 mt-4">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-semibold text-stone-900">{proj.name || 'Project'}</h3>
                  <span className={`text-xs font-medium shrink-0 ${s.accent}`}>{proj.duration || ''}</span>
                </div>
                <p className={`text-sm leading-relaxed mt-1 ${s.bodyText}`}>{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {customSections.filter((s) => s.title || s.content).length > 0 && (
        <>
          {customSections.map((sec, idx) =>
            sec.title || sec.content ? (
              <section key={idx}>
                <h2 className={s.sectionTitle}>{sec.title || 'Custom'}</h2>
                <p className={`text-sm leading-relaxed mt-2 whitespace-pre-line ${s.bodyText}`}>{sec.content}</p>
              </section>
            ) : null
          )}
        </>
      )}

      {publications.length > 0 && (
        <section>
          <h2 className={s.sectionTitle}>{labels.publications || DEFAULT_LABELS.publications}</h2>
          <div className="flex flex-col gap-4 mt-4">
            {publications.map((pub, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-stone-900">{pub.title}</h3>
                <p className={`text-sm italic ${s.bodyText}`}>{pub.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-auto pt-8 border-t border-stone-100 space-y-6">
        {skills.length > 0 && (
          <div>
            <h2 className={s.sectionTitle}>{labels.skills || DEFAULT_LABELS.skills}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((sk) => (
                <span
                  key={sk}
                  className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
                    templateId === 'modern' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}
        {interests.length > 0 && (
          <div>
            <h2 className={s.sectionTitle}>{labels.interests || DEFAULT_LABELS.interests}</h2>
            <p className={`text-sm mt-2 ${s.bodyText}`}>{interests.join(' · ')}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ResumePreview;
