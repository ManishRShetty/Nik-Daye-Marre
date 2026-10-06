'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function RequestForm({ onRefreshNeeded }: { onRefreshNeeded?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          department: formData.get('department'),
          priority: formData.get('priority'),
          location_id: 'ADMIN_BLOCK' // Hardcoded default for the form
        })
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        if (onRefreshNeeded) {
          onRefreshNeeded();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/[0.05] p-6 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden"
    >
      {/* Subtle glow instead of loud gradient */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10">
        <div className="mb-6">
          <h2 className="text-[22px] font-semibold text-white tracking-tight mb-1">New Request</h2>
          <p className="text-[#a1a1a6] text-[15px] font-medium tracking-tight">Report an issue on campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <input 
              type="text" 
              name="title"
              required
              className="w-full bg-[#2c2c2e]/60 border border-white/[0.04] rounded-[16px] px-4 py-3.5 text-white placeholder-[#86868b] focus:outline-none focus:bg-[#2c2c2e] focus:border-[#0a84ff]/50 transition-all text-[15px] font-medium tracking-tight"
              placeholder="Title (e.g. Broken projector)"
            />
          </div>

          <div className="space-y-1.5">
            <textarea 
              name="description"
              required
              rows={3}
              className="w-full bg-[#2c2c2e]/60 border border-white/[0.04] rounded-[16px] px-4 py-3.5 text-white placeholder-[#86868b] focus:outline-none focus:bg-[#2c2c2e] focus:border-[#0a84ff]/50 transition-all text-[15px] font-medium tracking-tight resize-none"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select name="department" className="w-full bg-[#2c2c2e]/60 border border-white/[0.04] rounded-[16px] px-4 py-3.5 text-white focus:outline-none focus:bg-[#2c2c2e] transition-all appearance-none cursor-pointer text-[15px] font-medium tracking-tight">
              <option value="it">IT Support</option>
              <option value="facilities">Facilities</option>
              <option value="hr">Human Resources</option>
            </select>
            <select name="priority" className="w-full bg-[#2c2c2e]/60 border border-white/[0.04] rounded-[16px] px-4 py-3.5 text-white focus:outline-none focus:bg-[#2c2c2e] transition-all appearance-none cursor-pointer text-[15px] font-medium tracking-tight">
              <option value="urgent">Urgent Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-3 bg-white hover:bg-[#f5f5f7] text-black font-semibold tracking-tight text-[17px] py-3.5 rounded-full shadow-[0_4px_14px_rgba(255,255,255,0.15)] transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
              />
            ) : (
              <span>Submit Request</span>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
