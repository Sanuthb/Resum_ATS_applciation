import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, PenLine } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { subscriptionService } from '../services/api';

const UpgradeButton = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await subscriptionService.createCheckoutSession();
      if (data.url) window.location.href = data.url;
      else if (data.demo) {
        await subscriptionService.upgrade();
        window.location.reload();
      }
    } catch (e) {}
    setLoading(false);
  };
  return (
    <button onClick={handleClick} disabled={loading} className={`btn-primary ${className}`}>
      {loading ? 'Loading...' : 'Upgrade to Pro'}
    </button>
  );
};

const Pricing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl font-bold text-stone-900 mb-4">Simple pricing</h1>
          <p className="text-lg text-stone-600">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center">
                <PenLine size={24} className="text-stone-600" />
              </div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Free</h2>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-6">$0<span className="text-base font-normal text-stone-500">/month</span></p>
            <ul className="space-y-4 mb-8">
              {['Up to 3 resumes', 'Minimal template', 'Live preview & save', 'JD analysis & ATS score', 'PDF export'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-stone-600">
                  <Check size={18} className="text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
              <li className="flex items-center gap-3 text-stone-400">
                <span className="w-[18px] shrink-0" />
                AI bullet optimization — Pro
              </li>
              <li className="flex items-center gap-3 text-stone-400">
                <span className="w-[18px] shrink-0" />
                Cover letter generation — Pro
              </li>
              <li className="flex items-center gap-3 text-stone-400">
                <span className="w-[18px] shrink-0" />
                5 premium templates — Pro
              </li>
            </ul>
            {user ? (
              <Link to="/builder" className="btn-secondary w-full justify-center">Current plan</Link>
            ) : (
              <Link to="/register" className="btn-secondary w-full justify-center">Get started</Link>
            )}
          </div>

          <div className="card p-8 border-2 border-emerald-500 relative overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              Best value
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Sparkles size={24} className="text-emerald-600" />
              </div>
              <h2 className="font-serif text-xl font-bold text-stone-900">Pro</h2>
            </div>
            <p className="text-3xl font-bold text-stone-900 mb-6">₹129<span className="text-base font-normal text-stone-500"> one-time</span></p>
            <ul className="space-y-4 mb-8">
              {['Unlimited resumes', 'All 6 templates', 'AI bullet optimization', 'Cover letter generation', 'Unlimited PDF exports', 'Priority support'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-stone-600">
                  <Check size={18} className="text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {user?.tier === 'pro' ? (
              <div className="btn-primary w-full justify-center opacity-75 cursor-default">Current plan</div>
            ) : user ? (
              <UpgradeButton className="w-full justify-center" />
            ) : (
              <Link to="/register" className="btn-primary w-full justify-center">Get started</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
