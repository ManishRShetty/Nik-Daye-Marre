import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 1-second total sequence
    const t1 = setTimeout(() => setStage(1), 300); // Show spatial data text
    const t2 = setTimeout(() => setStage(2), 700); // Start fade out
    const t3 = setTimeout(onComplete, 1000); // Unmount

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, backdropFilter: 'blur(20px)' }}
      animate={
        stage === 2
          ? { opacity: 0, backdropFilter: 'blur(0px)', transition: { duration: 0.3, ease: 'easeInOut' } }
          : { opacity: 1, backdropFilter: 'blur(20px)' }
      }
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-white pointer-events-none"
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Signature Animation */}
        <motion.div
          initial={{ opacity: 0, pathLength: 0, y: 15 }}
          animate={{ opacity: 1, pathLength: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-5xl md:text-7xl tracking-tight flex gap-3"
          style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
        >
          <span className="font-bold text-white">Campus</span>
          <span className="font-semibold text-[#8a8a8e]">Spatial AI</span>
        </motion.div>

        {/* Spatial Data Status */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(5px)' }}
          animate={
            stage >= 1
              ? { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.8 } }
              : { opacity: 0, filter: 'blur(5px)' }
          }
          className="text-[#a1a1a6] text-sm tracking-widest uppercase flex items-center space-x-3"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Loading Spatial Data...</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
