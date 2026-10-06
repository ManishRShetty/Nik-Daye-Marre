'use client';
import React from 'react';

const AgenticInterface = ({ onLocationFound }: { onLocationFound: (coords: [number, number, number], intent: string) => void }) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-10 pointer-events-auto">
      <div className="bg-zinc-900/80 backdrop-blur-md p-4 rounded-xl border border-zinc-700/50 shadow-2xl flex gap-4">
         <input 
            type="text" 
            placeholder="Tell the AI where to go..." 
            className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
         />
         <button 
            type="button"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
         >
            Send
         </button>
      </div>
    </div>
  );
};

export default AgenticInterface;
