'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATIONS, LocationId } from '@/lib/constants';

interface AgenticInterfaceProps {
  onLocationFound: (coords: [number, number, number], intent: string) => void;
  onRefreshNeeded?: () => void;
}

export default function AgenticInterface({ onLocationFound, onRefreshNeeded }: AgenticInterfaceProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch(e) {}
        throw new Error(errData?.error || 'Network response was not ok');
      }

      const data = await response.json();

      if (data.action && data.action.location_id) {
        const coords = LOCATIONS[data.action.location_id as LocationId];
        if (coords) {
          onLocationFound(coords as [number, number, number], data.action.intent || data.reply);
          
          // --- Automatically create a real ticket in Supabase ---
          const lowerP = prompt.toLowerCase();
          const isProblemReport = lowerP.includes("urgent") || lowerP.includes("leak") || lowerP.includes("broken") || lowerP.includes("issue") || lowerP.includes("fix") || lowerP.includes("help") || lowerP.includes("problem") || prompt.length > 15;

          if (isProblemReport) {
            try {
              const assignedPriority = (data.action.priority || 'medium').toLowerCase();
              const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: prompt.length > 35 ? prompt.substring(0, 35) + '...' : prompt,
                  description: data.reply,
                  department: data.action.department || 'facilities',
                  priority: assignedPriority,
                  location_id: data.action.location_id
                })
              });
              if (res.ok && onRefreshNeeded) {
                onRefreshNeeded(); // Immediate refresh
                setTimeout(() => onRefreshNeeded(), 400); // DB propagation sync
              }
            } catch (ticketErr) {
              console.error("Failed to auto-create ticket:", ticketErr);
            }
          }

          setPrompt('');
        } else {
          throw new Error('Location ID not found in LOCATIONS');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to contact the spatial agent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-[500px] z-10 pointer-events-auto">
      <form 
        onSubmit={handleSubmit}
        className="bg-[#1c1c1e]/80 backdrop-blur-2xl p-2 rounded-full border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-2"
      >
        <div className="pl-4 text-white/40">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          placeholder="Ask Spatial AI..."
          className="flex-1 bg-transparent border-none px-2 py-3 text-white placeholder-[#86868b] text-[17px] font-medium tracking-tight focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="bg-white hover:bg-[#e5e5ea] text-black w-10 h-10 rounded-full flex justify-center items-center transition-colors disabled:opacity-30 disabled:hover:bg-white mr-1"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
            />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[#ff453a] text-sm font-medium mt-3 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
