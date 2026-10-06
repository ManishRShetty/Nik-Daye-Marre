'use client';

import { useState } from 'react';
import CampusMap from '@/components/CampusMap';
import AgenticInterface from '@/components/AgenticInterface';
import { motion } from 'framer-motion';

export default function Home() {
  const [targetCoords, setTargetCoords] = useState<[number, number, number] | null>(null);
  const [intent, setIntent] = useState<string | null>(null);

  const handleLocationFound = (coords: [number, number, number], newIntent: string) => {
    setTargetCoords(coords);
    setIntent(newIntent);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black selection:bg-indigo-500/30">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <CampusMap targetCoordinates={targetCoords} intent={intent} />
      </div>

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 w-full p-8 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Spatial AI</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-sm">
            Powered by Agentic Bridge. Just tell the AI where you want to go.
          </p>
        </motion.div>
      </div>

      {/* Agentic Input */}
      <AgenticInterface onLocationFound={handleLocationFound} />
    </main>
  );
}
