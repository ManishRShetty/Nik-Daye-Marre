'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TicketCard from './TicketCard';
import RequestForm from './RequestForm';

export default function DashboardBento({ tickets = [] }: { tickets?: any[] }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-end p-8 overflow-hidden">
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsMinimized(!isMinimized)}
        className="pointer-events-auto absolute right-8 top-8 z-50 bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/[0.05] w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-[#2c2c2e]/80 transition-all shadow-lg"
      >
        <motion.svg 
          animate={{ rotate: isMinimized ? 180 : 0 }} 
          className="w-5 h-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ 
          opacity: isMinimized ? 0 : 1, 
          x: isMinimized ? 450 : 0,
          pointerEvents: isMinimized ? 'none' : 'auto' 
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] h-full max-h-[85vh] flex flex-col gap-6 mt-16 scrollbar-hide overflow-y-auto pb-24 relative"
      >
        {/* Bento Item 1: Stats / Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 p-6 rounded-[32px] bg-[#1c1c1e]/60 backdrop-blur-3xl border border-white/[0.05] flex flex-col justify-center relative overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-100" />
          <div className="relative z-10">
            <h2 className="text-[28px] font-semibold text-white mb-0.5 tracking-tight leading-none">Dashboard</h2>
            <p className="text-[#a1a1a6] text-[15px] tracking-tight font-medium">System operating normally.</p>
            
            <div className="flex gap-4 mt-6">
               <div className="flex-1 bg-[#2c2c2e]/50 rounded-[20px] p-4 border border-white/[0.02]">
                  <div className="text-[32px] leading-none font-bold text-[#0a84ff] tracking-tight">{tickets.filter(t => t.status === 'Pending' || t.status === 'Open' || t.status === 'In Progress').length}</div>
                  <div className="text-[12px] text-[#86868b] uppercase tracking-wide font-semibold mt-1.5">Active</div>
               </div>
               <div className="flex-1 bg-[#2c2c2e]/50 rounded-[20px] p-4 border border-white/[0.02]">
                  <div className="text-[32px] leading-none font-bold text-[#30d158] tracking-tight">{tickets.filter(t => t.status === 'Resolved' || t.status === 'Completed').length}</div>
                  <div className="text-[12px] text-[#86868b] uppercase tracking-wide font-semibold mt-1.5">Resolved</div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Bento Item 2: Request Form */}
        <div className="shrink-0">
          <RequestForm />
        </div>

        {/* Bento Item 3: Recent Activity / Tickets */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="shrink-0 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between px-2 mb-1">
             <h3 className="text-white font-semibold tracking-tight">Recent Activity</h3>
             <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
          </div>
          {tickets.map((ticket, idx) => (
            <TicketCard 
              key={ticket.id}
              {...ticket}
              delay={0.4 + (idx * 0.1)}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
