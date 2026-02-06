import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { subscriptionService } from '../services/api';

const UpgradePrompt = ({ onClose, onSuccess, compact = false }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data } = await subscriptionService.createCheckoutSession();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.demo) {
        await subscriptionService.upgrade();
        onSuccess?.();
        onClose?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      {!compact && (
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-600" />
            <span className="font-medium text-amber-900">Upgrade to Pro</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 text-amber-600 hover:text-amber-800">
              <X size={16} />
            </button>
          )}
        </div>
      )}
      <p className="text-sm text-amber-800 mb-4">
        Unlock AI optimization, cover letters, and all premium templates.
      </p>
      <button onClick={handleUpgrade} disabled={loading} className="btn-primary text-sm py-2">
        {loading ? 'Loading...' : 'Upgrade to Pro — ₹129'}
      </button>
    </div>
  );
};

export default UpgradePrompt;
