// Free: minimal only. Pro: all templates
export const FREE_TEMPLATE_IDS = ['minimal'];
export const TEMPLATES = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and spacious — Free',
    pro: false,
    styles: {
      container: 'font-sans bg-white text-stone-800',
      header: 'pb-8',
      accent: 'text-stone-600',
      sectionTitle: 'text-xs font-medium uppercase tracking-wider text-stone-500 mb-4',
      bodyText: 'text-stone-600',
      gridColor: 'transparent'
    }
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean with emerald accents',
    pro: true,
    styles: {
      container: 'font-sans bg-white',
      header: 'border-b border-stone-200 pb-8',
      accent: 'text-emerald-600',
      sectionTitle: 'text-xs font-semibold uppercase tracking-wider text-stone-500 border-l-4 border-emerald-600 pl-4',
      bodyText: 'text-stone-600',
      gridColor: '#059669'
    }
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional',
    pro: true,
    styles: {
      container: 'font-serif bg-white text-stone-900',
      header: 'border-b-2 border-stone-900 pb-6 mb-6',
      accent: 'text-stone-900',
      sectionTitle: 'text-sm font-semibold uppercase tracking-wide border-b border-stone-800 pb-1 mb-4',
      bodyText: 'text-stone-700',
      gridColor: 'transparent'
    }
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'Polished for corporate roles',
    pro: true,
    styles: {
      container: 'font-sans bg-white',
      header: 'border-b-2 border-indigo-600 pb-6 mb-6',
      accent: 'text-indigo-600',
      sectionTitle: 'text-xs font-semibold uppercase tracking-wider text-indigo-700 border-l-4 border-indigo-500 pl-4',
      bodyText: 'text-stone-600',
      gridColor: '#4f46e5'
    }
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Distinct design for creative fields',
    pro: true,
    styles: {
      container: 'font-sans bg-white',
      header: 'pb-8 border-l-4 border-amber-500 pl-6',
      accent: 'text-amber-600',
      sectionTitle: 'text-xs font-bold uppercase tracking-widest text-amber-600 mb-4',
      bodyText: 'text-stone-600',
      gridColor: '#d97706'
    }
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Bold layout for leadership roles',
    pro: true,
    styles: {
      container: 'font-serif bg-white text-stone-900',
      header: 'border-b-2 border-stone-900 pb-8',
      accent: 'text-stone-900',
      sectionTitle: 'text-sm font-bold uppercase tracking-wider text-stone-800 border-b-2 border-stone-300 pb-2 mb-4',
      bodyText: 'text-stone-700',
      gridColor: 'transparent'
    }
  }
};

export const DEFAULT_LABELS = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  publications: 'Publications',
  interests: 'Interests',
  tagline: 'Professional Tagline'
};
