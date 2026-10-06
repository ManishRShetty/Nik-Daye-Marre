'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TicketCardProps {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  time: string;
  description: string;
  delay?: number;
}

export default function TicketCard({ id, title, status, time, description, delay = 0 }: TicketCardProps) {
  const statusColors = {
    'Open': 'bg-pink-500/20 text-pink-300 border-pink-500/50',
    'In Progress': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    'Resolved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          {id}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {time}
        </span>
      </div>
    </motion.div>
  );
}
