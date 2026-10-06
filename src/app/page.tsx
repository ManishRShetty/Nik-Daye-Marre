'use client';

import { useState, useEffect } from 'react';
import CampusMap from '@/components/CampusMap';
import AgenticInterface from '@/components/AgenticInterface';
import DashboardBento from '@/components/DashboardBento';
import { motion } from 'framer-motion';

export default function Home() {
  const [targetCoords, setTargetCoords] = useState<[number, number, number] | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  const [userRole, setUserRole] = useState<'admin' | 'student'>('admin');

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/requests');
      const text = await res.text();
      if (!res.ok || !text) throw new Error("Fetch failed");
      const json = JSON.parse(text);
      setTickets(Array.isArray(json) ? json : (json.data || []));
    } catch (err) {
      try {
        const fRes = await fetch('/fallbackData.json');
        const fJson = await fRes.json();
        setTickets(fJson.data || []);
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleLocationFound = (coords: [number, number, number], newIntent: string) => {
    setTargetCoords(coords);
    setIntent(newIntent);
  };

  // If student, filter tickets to simulate their personal history (just pick the first 3 for demo)
  const displayedTickets = userRole === 'student' ? tickets.slice(0, 3) : tickets;

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <CampusMap targetCoordinates={targetCoords} intent={intent} tickets={displayedTickets} />
      </div>

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 w-full p-10 z-10 pointer-events-none flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[2.5rem] font-semibold tracking-tighter text-white mb-2 leading-none">
            Campus <span className="text-white/60">Spatial AI</span>
          </h1>
          <p className="text-[#a1a1a6] font-medium text-sm max-w-sm tracking-wide">
            Powered by Agentic Bridge. Just tell the AI where you want to go.
          </p>
        </motion.div>

        {/* Role Switcher (Hackathon Demo feature) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pointer-events-auto bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/[0.05] p-2 rounded-full flex items-center gap-2 shadow-lg"
        >
          <span className="text-[#86868b] text-xs font-medium pl-3 uppercase tracking-wider">Role:</span>
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as 'admin' | 'student')}
            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer pr-2"
          >
            <option value="admin" className="bg-[#1c1c1e]">Admin / Faculty</option>
            <option value="student" className="bg-[#1c1c1e]">Student A</option>
          </select>
        </motion.div>
      </div>

      {/* Agentic Input */}
      <AgenticInterface onLocationFound={handleLocationFound} onRefreshNeeded={fetchTickets} />

      {/* Bento Dashboard */}
      <DashboardBento tickets={displayedTickets} userRole={userRole} onRefreshNeeded={fetchTickets} />
    </main>
  );
}
