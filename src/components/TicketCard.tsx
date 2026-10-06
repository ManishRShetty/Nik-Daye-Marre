'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TicketCardProps {
  id: string;
  title: string;
  status: 'Open' | 'Pending' | 'In Progress' | 'Resolved' | 'Completed';
  time: string;
  description: string;
  delay?: number;
  userRole?: 'admin' | 'student';
}

export default function TicketCard({ id, title, status, time, description, delay = 0, userRole = 'student' }: TicketCardProps) {
  const [currentStatus, setCurrentStatus] = React.useState(status);

  const statusColors: Record<string, string> = {
    'Open': 'text-[#ff9f0a] bg-[#ff9f0a]/10',
    'Pending': 'text-[#ff9f0a] bg-[#ff9f0a]/10',
    'In Progress': 'text-[#0a84ff] bg-[#0a84ff]/10',
    'Resolved': 'text-[#30d158] bg-[#30d158]/10',
    'Completed': 'text-[#30d158] bg-[#30d158]/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.01, y: -1 }}
      className="p-5 rounded-[24px] bg-[#1c1c1e]/60 backdrop-blur-3xl border border-white/[0.05] hover:bg-[#1c1c1e]/80 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-semibold text-[17px] tracking-tight leading-tight transition-colors pr-2">
          {title}
        </h3>
        
        {userRole === 'admin' ? (
          <select 
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as any)}
            onClick={(e) => e.stopPropagation()}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase cursor-pointer outline-none border border-white/10 ${statusColors[currentStatus] || statusColors['Open']}`}
          >
            <option value="Pending" className="bg-[#1c1c1e] text-white">Pending</option>
            <option value="In Progress" className="bg-[#1c1c1e] text-white">In Progress</option>
            <option value="Completed" className="bg-[#1c1c1e] text-white">Completed</option>
          </select>
        ) : (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${statusColors[currentStatus] || statusColors['Open']}`}>
            {currentStatus}
          </span>
        )}
      </div>
      <p className="text-[#a1a1a6] text-[15px] tracking-tight line-clamp-2 mb-4 leading-snug font-medium">
        {description}
      </p>
      <div className="flex justify-between items-center text-[13px] text-[#86868b] font-medium tracking-tight">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          {id}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {time}
        </span>
      </div>
    </motion.div>
  );
}
