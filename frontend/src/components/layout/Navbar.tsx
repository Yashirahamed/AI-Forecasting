import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Moon, Sun, Globe, Bell, User as UserIcon, LogOut } from 'lucide-react';

// Responsive Navbar with Glassmorphism and Auth state
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-400 rounded-lg neon-blue" />
          <span className="text-xl font-bold tracking-tight">WeatherCast <span className="text-sky-400">AI</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/dashboard" className="hover:text-sky-400 transition-colors">Dashboard</Link>
          <Link to="/forecast" className="hover:text-sky-400 transition-colors">Forecast</Link>
          <Link to="/travel" className="hover:text-sky-400 transition-colors">Travel</Link>
          <Link to="/community" className="hover:text-sky-400 transition-colors">Community</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-[10px] uppercase opacity-50">{connected ? 'Live' : 'Offline'}</span>
          </div>

          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Globe size={18} /></button>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><Moon size={18} /></button>
          
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <img src={user.photoURL || ''} alt="avatar" className="w-8 h-8 rounded-full bg-white/10 border border-white/20" />
                <button onClick={logout} className="p-2 hover:bg-white/10 rounded-full transition-colors"><LogOut size={18} /></button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="px-5 py-2 bg-sky-500 hover:bg-sky-600 rounded-xl font-semibold transition-all neon-blue">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
