import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';
import { signInWithEmail } from '../firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 shadow-2xl relative z-10"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        
        {error && <p className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm">{error}</p>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium opacity-70">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky-400 outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium opacity-70">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky-400 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 py-3 rounded-xl font-bold text-white transition-all neon-blue flex items-center justify-center gap-2 mt-4"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>

        <div className="mt-8 relative text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <span className="relative px-4 bg-[#0a0f1e] text-xs uppercase opacity-50">Or continue with</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full mt-6 bg-white py-3 rounded-xl font-bold text-black hover:bg-white/90 transition-all flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="google" className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-sm opacity-70">
          Don't have an account? <Link to="/register" className="text-sky-400 hover:underline font-semibold">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
