'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOCATIONS, LocationId } from '@/lib/constants';

interface AgenticInterfaceProps {
  onLocationFound: (coords: [number, number, number], intent: string) => void;
}

export default function AgenticInterface({ onLocationFound }: AgenticInterfaceProps) {
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

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      if (data.action && data.action.location_id) {
        const coords = LOCATIONS[data.action.location_id as LocationId];
        if (coords) {
          onLocationFound(coords as [number, number, number], data.action.intent || data.reply);
          setPrompt('');
        } else {
          throw new Error('Location ID not found in LOCATIONS');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to contact the spatial agent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-10 pointer-events-auto">
      <form 
        onSubmit={handleSubmit}
        className="bg-zinc-900/80 backdrop-blur-md p-4 rounded-xl border border-zinc-700/50 shadow-2xl flex gap-4"
      >
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          placeholder="Tell the AI where to go..."
          className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 min-w-[100px] flex justify-center items-center"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
            />
          ) : (
            'Send'
          )}
        </button>
      </form>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-400 text-xs mt-2 text-center bg-black/50 p-2 rounded-lg"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
