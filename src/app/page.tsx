'use client';

import { useState, useEffect } from 'react';
import CampusMap from '@/components/CampusMap';
import AgenticInterface from '@/components/AgenticInterface';
import DashboardBento from '@/components/DashboardBento';
import IntroSplash from '@/components/IntroSplash';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [targetCoords, setTargetCoords] = useState<[number, number, number] | null>(null);
  const [intent, setIntent] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
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
    fetchTickets();
  }, []);

  const handleLocationFound = (coords: [number, number, number], newIntent: string) => {
    setTargetCoords(coords);
    setIntent(newIntent);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
      <AnimatePresence>
        {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <CampusMap targetCoordinates={targetCoords} intent={intent} tickets={tickets} />
      </div>

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 w-full p-10 z-10 pointer-events-none">
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
      </div>

      {/* Agentic Input */}
      <AgenticInterface onLocationFound={handleLocationFound} />

      {/* Bento Dashboard */}
      <DashboardBento tickets={tickets} />
    </main>
  );
}
