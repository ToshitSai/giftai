import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <footer className="bg-brand-black text-white border-t-[8px] border-white py-12 px-6 relative z-10 overflow-hidden">
      {/* Footer Doodles */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-50 50 Q100 150 200 50" fill="none" stroke="#E8FF00" strokeWidth="8" strokeLinecap="round" />
        <circle cx="90%" cy="40%" r="20" fill="#FF5A5F" />
      </svg>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-brand-red border-[3px] border-white shadow-[4px_4px_0_0_#FFF] px-4 py-1 rounded-full transform rotate-2">
            <span className="font-display font-black text-white text-2xl tracking-wider">GREETLY</span>
          </div>
        </div>
        
        <div className="flex gap-6 font-display font-bold uppercase tracking-wider text-sm z-50">
          <motion.button whileHover={{ y: -4, color: '#E8FF00' }} whileTap={{ scale: 0.9 }} onClick={() => setActiveModal('privacy')} className="transition-colors block text-white bg-transparent border-none outline-none">PRIVACY</motion.button>
          <motion.button whileHover={{ y: -4, color: '#E8FF00' }} whileTap={{ scale: 0.9 }} onClick={() => setActiveModal('terms')} className="transition-colors block text-white bg-transparent border-none outline-none">TERMS</motion.button>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t-[3px] border-white/20 text-center font-body font-bold text-sm text-white/60">
        &copy; {new Date().getFullYear()} Greetly. All rights reserved. Crafted with 💖 and a lot of ☕.
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="comic-panel p-8 bg-white w-full max-w-2xl relative text-left"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute -top-4 right-2 md:-right-4 bg-brand-red text-white w-10 h-10 rounded-full border-[3px] border-brand-black font-black text-xl flex items-center justify-center shadow-comic-sm z-10 hover:scale-110 transition-transform"
              >
                X
              </button>
              
              <h2 className="text-3xl font-black uppercase tracking-wider mb-6 text-brand-black border-b-[4px] border-brand-black pb-4">
                {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              
              <div className="font-body font-bold text-brand-black space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                {activeModal === 'privacy' ? (
                  <>
                    <p>Welcome to Greetly's Privacy Policy! We like to keep things simple and magical.</p>
                    <h3 className="text-xl font-display uppercase text-brand-purple mt-4">1. Data We Collect</h3>
                    <p>We collect the information you give us when you craft a message, including names, occasions, and your magical notes. We also use cookies to keep you logged in.</p>
                    <h3 className="text-xl font-display uppercase text-brand-cyan mt-4">2. Owner Access</h3>
                    <p className="bg-brand-yellow/30 p-2 rounded"><strong>Notice:</strong> Please note that the website owner has access to the data processed by the website to monitor usage, fix bugs, and ensure the AI is generating top-notch greetings!</p>
                    <h3 className="text-xl font-display uppercase text-brand-red mt-4">3. Data Sharing</h3>
                    <p>We do not sell your personal data. We only share it with our AI providers temporarily to generate your amazing messages.</p>
                  </>
                ) : (
                  <>
                    <p>Welcome to Greetly's Terms of Service! By using our magical message generator, you agree to these rules.</p>
                    <h3 className="text-xl font-display uppercase text-brand-purple mt-4">1. Acceptable Use</h3>
                    <p>Use Greetly to spread joy! Do not use our AI to generate hateful, harmful, or spammy messages. Keep it friendly!</p>
                    <h3 className="text-xl font-display uppercase text-brand-cyan mt-4">2. Website Ownership & Data</h3>
                    <p className="bg-brand-yellow/30 p-2 rounded"><strong>Notice:</strong> The website owner reserves the right to access website data, modify the service, or limit access if someone is abusing the magic.</p>
                    <h3 className="text-xl font-display uppercase text-brand-red mt-4">3. No Guarantees</h3>
                    <p>Our AI tries its best, but sometimes it might be a little *too* funny. We aren't responsible if a generated message gets you in trouble with your mother-in-law!</p>
                  </>
                )}
              </div>
              
              <div className="mt-8 pt-4 border-t-[4px] border-brand-black">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-brand-yellow border-[3px] border-brand-black py-3 rounded-xl font-display font-black uppercase tracking-wider text-brand-black shadow-comic-sm hover:-translate-y-1 hover:shadow-comic transition-all"
                >
                  I Understand!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
