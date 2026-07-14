import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';
import { InteractiveButton } from '../components/ui/InteractiveButton';

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.register(formData.name, formData.email, formData.password);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      <Link to="/" className="absolute top-6 left-6 z-20" aria-label="Go back">
        <InteractiveButton variant="white" className="px-4 py-2 flex items-center gap-2">
          <ArrowLeft size={20} /> Back
        </InteractiveButton>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
        animate={{ opacity: 1, scale: 1, rotate: -2 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Neo-brutalist Form Card */}
        <div className="bg-[#E8FF00] border-[6px] border-black p-8 rounded-[32px] shadow-[12px_12px_0_0_#0F0A1A] w-full relative">
          {/* Playful tilted badge */}
          <div className="absolute -top-5 left-6 bg-[#6E00FF] text-white border-3 border-black px-4 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl shadow-[3px_3px_0_0_#000] -rotate-6">
            NEW HERE?
          </div>

          <h2 className="text-4xl font-black uppercase tracking-tight text-center mb-8 mt-2 text-[#0F0A1A] drop-shadow-[2px_2px_0_#FFF]">
            Sign Up
          </h2>

          {error && <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-600 font-bold font-body">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Full Name Input Container */}
            <div className="relative flex flex-col gap-2 w-full">
              {/* ACCESSIBLE LABEL: Fixed position with native association via 'htmlFor' */}
              <label
                htmlFor="name"
                className={`absolute left-3 px-2 font-display font-black origin-left pointer-events-none z-10 transition-all duration-200 bg-white rounded-full border-2 border-black ${
                  focusedField === "name" || formData.name
                    ? "-translate-y-4 scale-90 text-[#6E00FF] shadow-[2px_2px_0_0_#000]"
                    : "translate-y-3.5 scale-100 text-[#0F0A1A]"
                }`}
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. John Doe" // ADDED: Native placeholder fallback for screen readers & password managers
                autoComplete="name" // ADDED: Standard browser autocomplete
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className="input-comic z-0 w-full px-4 py-3.5 border-4 border-black rounded-xl font-body font-bold text-[#0F0A1A] bg-white placeholder-gray-400 focus:outline-none focus:ring-0 shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#6E00FF] transition-all"
              />
            </div>

            {/* Email Address Input Container */}
            <div className="relative flex flex-col gap-2 w-full">
              <label
                htmlFor="email"
                className={`absolute left-3 px-2 font-display font-black origin-left pointer-events-none z-10 transition-all duration-200 bg-white rounded-full border-2 border-black ${
                  focusedField === "email" || formData.email
                    ? "-translate-y-4 scale-90 text-[#6E00FF] shadow-[2px_2px_0_0_#000]"
                    : "translate-y-3.5 scale-100 text-[#0F0A1A]"
                }`}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="name@example.com" // ADDED: Native placeholder fallback
                autoComplete="email" // ADDED: Standard browser autocomplete
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="input-comic z-0 w-full px-4 py-3.5 border-4 border-black rounded-xl font-body font-bold text-[#0F0A1A] bg-white placeholder-gray-400 focus:outline-none focus:ring-0 shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#6E00FF] transition-all"
              />
            </div>

            {/* Password Input Container */}
            <div className="relative flex flex-col gap-2 w-full">
              <label
                htmlFor="password"
                className={`absolute left-3 px-2 font-display font-black origin-left pointer-events-none z-10 transition-all duration-200 bg-white rounded-full border-2 border-black ${
                  focusedField === "password" || formData.password
                    ? "-translate-y-4 scale-90 text-[#6E00FF] shadow-[2px_2px_0_0_#000]"
                    : "translate-y-3.5 scale-100 text-[#0F0A1A]"
                }`}
              >
                Create Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••" // ADDED: Native placeholder fallback
                autoComplete="new-password" // ADDED: Standard browser autocomplete for new passwords
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="input-comic z-0 w-full px-4 py-3.5 border-4 border-black rounded-xl font-body font-bold text-[#0F0A1A] bg-white placeholder-gray-400 focus:outline-none focus:ring-0 shadow-[4px_4px_0_0_#000] focus:shadow-[6px_6px_0_0_#6E00FF] transition-all"
              />
            </div>

            {/* Submit Button with Active Tap Animation */}
            <button
              type="submit"
              disabled={loading}
              className="btn-comic flex items-center justify-center font-black relative bg-[#FF5A5F] text-white border-4 border-black w-full py-4 text-xl mt-4 rounded-xl shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] hover:bg-[#ff444a] transition-all uppercase tracking-wider"
            >
              {loading ? "CREATING..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 font-bold text-[#0F0A1A]/80 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#6E00FF] underline hover:text-[#5200c4] font-black transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
