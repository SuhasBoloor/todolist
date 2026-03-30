import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-body">
      <div className="fixed top-8 right-8 z-[100]">
        <ThemeToggle />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="pinterest-card w-full max-w-md p-10 sm:p-14"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center shadow-lg transform rotate-6 hover:rotate-12 transition-transform duration-300">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mt-8">Focus Pin</h1>
          <p className="text-text-muted mt-3 text-lg">Log in to your pinboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-text-muted ml-2 uppercase tracking-widest">Email Pin</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors duration-300" />
              <input 
                type="email" 
                className="input-minimal pl-14 py-4" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-text-muted ml-2 uppercase tracking-widest">Secret Pin</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors duration-300" />
              <input 
                type="password" 
                className="input-minimal pl-14 py-4" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-[1rem] text-red-500 text-sm text-center font-bold"
            >
              {error}
            </motion.div>
          )}

          <button type="submit" className="btn-pinterest w-full py-5 text-xl mt-6 shadow-2xl hover:shadow-primary/40 transition-all duration-300">
            Sign In
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-border-color">
          <p className="text-center text-text-muted font-medium">
            New here?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-hover font-black text-lg transition-colors ml-1 decoration-primary underline-offset-4 hover:underline">
              Join the Board
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
