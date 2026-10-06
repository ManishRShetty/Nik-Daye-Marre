'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      
      if (data.coordinates && data.intent) {
        onLocationFound(data.coordinates as [number, number, number], data.intent);
        setPrompt('');
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
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-10"
    >
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50 blur-xl pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Where would you like to go? (e.g. 'Take me to the library')"
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="bg-white text-black px-6 py-4 rounded-2xl font-semibold text-sm transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
              />
            ) : (
              'Navigate'
            )}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="text-red-400 text-xs px-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
