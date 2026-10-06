'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TicketCard from './TicketCard';
import RequestForm from './RequestForm';

export default function DashboardBento() {
  const [mockTickets, setMockTickets] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('/api/requests');
        const text = await res.text();
        if (!res.ok || !text) throw new Error("Supabase fetch failed or empty");
        
        const json = JSON.parse(text);
        
        if (Array.isArray(json)) {
          setMockTickets(json);
        } else if (json.data && Array.isArray(json.data)) {
          setMockTickets(json.data);
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        console.warn("Falling back to local data...", err);
        // Phase 3: Swap to local file to save the demo if Supabase fails
        try {
          const fallbackRes = await fetch('/fallbackData.json');
          const fallbackJson = await fallbackRes.json();
          if (fallbackJson.data) setMockTickets(fallbackJson.data);
        } catch (fallbackErr) {
          console.error("Fallback also failed", fallbackErr);
        }
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-end p-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-[420px] h-full max-h-[85vh] flex flex-col gap-6 pointer-events-auto mt-16 scrollbar-hide overflow-y-auto pb-24"
      >
        {/* Bento Item 1: Stats / Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">Dashboard</h2>
          <p className="text-gray-400 text-sm">System operating normally.</p>
          
          <div className="flex gap-4 mt-6">
             <div className="flex-1 bg-black/30 rounded-2xl p-4 border border-white/5">
                <div className="text-3xl font-bold text-indigo-400">{mockTickets.filter(t => t.status === 'Pending' || t.status === 'Open' || t.status === 'In Progress').length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Active</div>
             </div>
             <div className="flex-1 bg-black/30 rounded-2xl p-4 border border-white/5">
                <div className="text-3xl font-bold text-emerald-400">{mockTickets.filter(t => t.status === 'Resolved' || t.status === 'Completed').length}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Resolved</div>
             </div>
          </div>
        </motion.div>

        {/* Bento Item 2: Request Form */}
        <RequestForm />

        {/* Bento Item 3: Recent Activity / Tickets */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between px-2 mb-1">
             <h3 className="text-white font-semibold tracking-tight">Recent Activity</h3>
             <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
          </div>
          {mockTickets.map((ticket, idx) => (
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
