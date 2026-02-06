import { useState } from 'react';
import { TEMPLATES, FREE_TEMPLATE_IDS } from '../config/templates';
import { Check, Lock } from 'lucide-react';
import UpgradePrompt from './UpgradePrompt';

const TemplateSelector = ({ selectedId, onSelect, labels, onLabelChange, isPro, onUpgrade }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const mainLabels = Object.entries(labels).filter(([key]) => !['tagline', 'timestampLabel'].includes(key));

  const handleSelect = (t) => {
    if (t.pro && !isPro) {
      setShowUpgrade(true);
      return;
    }
    setShowUpgrade(false);
    onSelect(t.id);
  };

  const templatePreviewColor = (id) => {
    if (id === 'modern') return 'bg-emerald-600';
    if (id === 'classic' || id === 'executive') return 'bg-stone-800';
    if (id === 'professional') return 'bg-indigo-600';
    if (id === 'creative') return 'bg-amber-500';
    return 'bg-stone-300';
  };

  return (
    <div className="space-y-8">
      {showUpgrade && (
        <UpgradePrompt onClose={() => setShowUpgrade(false)} onSuccess={() => { onUpgrade?.(); setShowUpgrade(false); }} />
      )}
      <div>
        <h3 className="font-medium text-stone-900 mb-2">Templates</h3>
        <p className="text-sm text-stone-500 mb-4">
          {isPro ? 'All templates unlocked' : 'Upgrade to Pro to unlock all templates'}
        </p>
        <div className="space-y-3">
          {Object.values(TEMPLATES).map((t) => {
            const locked = t.pro && !isPro;
            const selected = selectedId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                  selected ? 'border-emerald-500 bg-emerald-50' : locked ? 'border-stone-100 bg-stone-50/50' : 'border-stone-100 hover:border-stone-200 bg-white'
                } ${locked ? 'opacity-90' : ''}`}
              >
                <div
                  className={`w-14 h-18 rounded-lg border shrink-0 flex flex-col p-1.5 gap-1 ${
                    selected ? 'border-emerald-300 bg-emerald-100' : 'border-stone-200 bg-stone-50'
                  }`}
                >
                  <div className={`h-2 rounded ${templatePreviewColor(t.id)}`} />
                  <div className="h-1 w-2/3 rounded bg-stone-200" />
                  <div className="h-1 w-full rounded bg-stone-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-stone-900">{t.name}</p>
                    {locked && <Lock size={14} className="text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{t.description}</p>
                </div>
                {selected && !locked && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                )}
                {locked && (
                  <span className="text-xs font-medium text-amber-600 shrink-0">Pro</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-stone-900 mb-4">Section labels</h3>
        <div className="space-y-3">
          {mainLabels.map(([key, value]) => (
            <div key={key}>
              <label className="label capitalize">{key}</label>
              <input
                type="text"
                className="input"
                value={value}
                onChange={(e) => onLabelChange(key, e.target.value)}
                placeholder={`${key}...`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
