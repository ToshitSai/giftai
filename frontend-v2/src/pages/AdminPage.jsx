import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Users, Activity, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not logged in or not admin, redirect
    if (!currentUser) {
      navigate('/login');
      return;
    }
    // Since roles are managed via backend tokens, we will just try to fetch admin data.
    // If it fails with 403, we redirect or show error.

    const loadAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [custRes, statsRes, diagRes] = await Promise.all([
          api.getCustomers(),
          api.getDashboardStats(),
          api.getDiagnostics()
        ]);

        setCustomers(custRes.data || custRes || []);
        setStats(statsRes.data || statsRes);
        setDiagnostics(diagRes.data || diagRes);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin console data. You may not have admin privileges.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMostPopularTone = () => {
    if (!stats || !stats.messages_by_tone || stats.messages_by_tone.length === 0) return 'None';
    return stats.messages_by_tone.reduce((prev, current) => (prev.count > current.count) ? prev : current).tone;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-3xl font-black uppercase tracking-widest text-brand-black animate-pulse">
          Loading Admin Console...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="comic-panel p-8 bg-brand-red text-white text-center max-w-lg">
          <h2 className="text-3xl font-black uppercase mb-4">Access Denied</h2>
          <p className="font-bold text-lg mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-comic bg-brand-yellow text-brand-black border-brand-black w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-20 relative z-10 max-w-6xl mx-auto flex flex-col items-center">

      {/* Header */}
      <div className="w-full flex justify-between items-center mb-12">
        <Link to="/">
          <div className="bg-brand-red border-[3px] border-brand-black shadow-comic-sm px-4 py-1 rounded-full transform -rotate-2 hover:scale-105 transition-transform">
            <span className="font-display font-black text-white text-xl tracking-wider">GREETLY</span>
          </div>
        </Link>

        <div className="flex gap-4 items-center">
          <div className="bg-brand-yellow border-[3px] border-brand-black shadow-comic-sm px-4 py-2 rounded-lg font-bold">
            Admin Console 👑
          </div>
          <button onClick={handleLogout} className="bg-white border-[3px] border-brand-black shadow-comic-sm p-2 rounded-full hover:-translate-y-1 hover:shadow-comic transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col gap-8"
      >
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="comic-panel p-6 bg-brand-cyan relative transform hover:-rotate-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <span className="font-black uppercase tracking-wider">Total Customers</span>
              <Users size={24} />
            </div>
            <h2 className="text-4xl font-black">{customers.length}</h2>
          </div>

          <div className="comic-panel p-6 bg-brand-purple text-white relative transform hover:rotate-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <span className="font-black uppercase tracking-wider">Messages (Total / Today)</span>
              <MessageSquare size={24} />
            </div>
            <h2 className="text-4xl font-black">
              {stats?.total_messages || 0} <span className="text-2xl text-white/70">/ {stats?.messages_today || 0}</span>
            </h2>
          </div>

          <div className="comic-panel p-6 bg-brand-yellow relative transform hover:-rotate-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <span className="font-black uppercase tracking-wider">Popular Tone</span>
              <Activity size={24} />
            </div>
            <h2 className="text-3xl font-black">{getMostPopularTone()}</h2>
          </div>
        </div>

        {/* Two column layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Customers Table */}
          <div className="comic-panel p-6 bg-white relative overflow-hidden flex flex-col">
            <div className="absolute -top-4 -left-4 bg-brand-red text-white border-[3px] border-brand-black px-4 py-1 rounded-full font-black uppercase text-sm shadow-comic-sm transform -rotate-3 z-10">
              Users
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6 mt-4">Customer Directory</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-[3px] border-brand-black">
                    <th className="pb-2 font-black uppercase">ID</th>
                    <th className="pb-2 font-black uppercase">Name</th>
                    <th className="pb-2 font-black uppercase">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-4 text-center font-bold">No customers found.</td>
                    </tr>
                  ) : (
                    customers.map(c => (
                      <tr key={c.id} className="border-b border-brand-black/20 hover:bg-brand-yellow/10">
                        <td className="py-3 font-bold">#{c.id}</td>
                        <td className="py-3 font-bold">{c.name}</td>
                        <td className="py-3">{c.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Diagnostics Console */}
          <div className="comic-panel p-6 bg-brand-black text-brand-green font-mono text-sm relative overflow-hidden flex flex-col">
             <div className="absolute -top-4 -right-4 bg-[#06D6A0] text-brand-black border-[3px] border-brand-black px-4 py-1 rounded-full font-black uppercase text-sm shadow-comic-sm transform rotate-3 z-10">
              Live Systems
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6 mt-4 text-white">Diagnostics</h2>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b border-brand-green/30 pb-2">
                <span>SDK Version:</span>
                <span className="font-bold text-white">{diagnostics?.sdk_version || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-brand-green/30 pb-2">
                <span>Endpoint:</span>
                <span className="font-bold text-white truncate max-w-[200px]">{diagnostics?.endpoint_url || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-brand-green/30 pb-2">
                <span>Active Key Prefix:</span>
                <span className="font-bold text-white">{diagnostics?.active_key_prefix || 'N/A'}</span>
              </div>

              <div className="mt-4">
                <span className="block mb-2 text-white font-bold">Raw Provider Response Log:</span>
                <div className="bg-black/50 p-4 rounded overflow-auto max-h-48 whitespace-pre-wrap">
                  {diagnostics?.raw_provider_response || 'No recent API calls found in cache.'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
