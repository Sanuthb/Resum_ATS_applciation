import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { subscriptionService } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setError('Missing session. Return to dashboard.');
      return;
    }
    const verify = async () => {
      try {
        await subscriptionService.verifySession(sessionId);
        await refreshUser();
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.error || 'Verification failed');
      }
    };
    verify();
  }, [sessionId, refreshUser]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="card p-12 text-center max-w-md">
          <Loader2 size={48} className="animate-spin text-emerald-600 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">Activating Pro</h2>
          <p className="text-stone-600 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
        <div className="card p-12 text-center max-w-md">
          <p className="text-red-600 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="card p-12 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">You&apos;re now Pro!</h2>
        <p className="text-stone-600 mb-8">All premium features are unlocked. Start building better resumes.</p>
        <Link to="/dashboard" className="btn-primary">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
