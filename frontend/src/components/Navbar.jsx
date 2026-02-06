import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, LayoutGrid, LogOut, PenLine } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all ${
        scrolled ? 'bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
            <PenLine size={18} />
          </div>
          <span className="font-serif font-semibold text-stone-900 text-lg">
            Resume<span className="text-emerald-600">Architect</span>
          </span>
        </Link>

        {user && !isAuthPage && (
          <div className="hidden sm:flex items-center gap-1">
            <NavLink to="/dashboard" label="Dashboard" active={location.pathname === '/dashboard'} />
            <NavLink to="/builder" label="Builder" active={location.pathname.includes('/builder')} />
            <NavLink to="/pricing" label="Pricing" active={location.pathname === '/pricing'} />
          </div>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-sm">
                <span className="font-medium">{user?.email?.split('@')[0]}</span>
                {user?.tier === 'pro' && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium">
                    Pro
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-3">
                <Link to="/pricing" className="text-sm font-medium text-stone-600 hover:text-stone-900">
                  Pricing
                </Link>
                <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-stone-900">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary py-2.5 px-5 text-sm">
                  Get started
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, active }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-emerald-50 text-emerald-700' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
