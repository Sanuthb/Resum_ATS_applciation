import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, LayoutDashboard, Zap, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-slate-200 shadow-sm' : 'bg-transparent border-b border-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100"
          >
            <Zap size={22} fill="currentColor" />
          </motion.div>
          <span className="tracking-tighter font-outfit text-slate-900">
            Resume<span className="text-blue-600">Architect</span>
          </span>
        </Link>
        
        {user && !isAuthPage && (
          <div className="hidden lg:flex items-center gap-10">
            <NavLink to="/dashboard" label="Terminal" active={location.pathname === '/dashboard'} />
            <NavLink to="/builder" label="Architect" active={location.pathname.includes('/builder')} />
          </div>
        )}
        
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserIcon size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active User</span>
                  <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                    {user.email.split('@')[0]}
                  </span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all border border-transparent shadow-sm"
                title="Disconnect"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : !isAuthPage && (
            <div className="flex items-center gap-8">
              <Link to="/login" className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors">
                Console
              </Link>
              <Link to="/register" className="btn-premium py-3 px-8 text-xs">
                Initialize
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, label, active }) => (
  <Link 
    to={to} 
    className={`relative text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-blue-600 ${active ? 'text-blue-600' : 'text-slate-500'}`}
  >
    {label}
    {active && (
      <motion.div 
        layoutId="nav-active"
        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
      />
    )}
  </Link>
);

export default Navbar;
