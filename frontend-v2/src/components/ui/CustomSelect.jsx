import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function CustomSelect({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      {label && <label className="font-display font-bold px-2">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="input-comic bg-white cursor-pointer flex justify-between items-center select-none"
      >
        <span className="font-body font-bold text-sm md:text-base truncate flex-1 text-left mr-2">{value}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="flex-shrink-0">
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[100%] left-0 min-w-full mt-2 bg-white border-[3px] border-brand-black rounded-lg shadow-comic-sm z-50 overflow-hidden flex flex-col"
          >
            {options.map((option, idx) => (
              <div
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer font-bold font-body text-sm whitespace-nowrap transition-colors border-b-2 border-brand-black/20 last:border-b-0
                  ${value === option ? 'bg-brand-yellow text-brand-black' : 'hover:bg-brand-purple hover:text-white text-brand-black'}`}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
