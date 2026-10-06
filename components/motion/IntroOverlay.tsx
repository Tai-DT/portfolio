'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '@/lib/portfolio-data';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function IntroOverlay() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);

  // Reduced-motion users get a quick fade only; everyone else ~2s staged intro
  const holdMs = reduce ? 350 : 2100;
  useEffect(() => {
    const t = setTimeout(() => setShow(false), holdMs);
    return () => clearTimeout(t);
  }, [holdMs]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
          initial={false}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.3 } }
              : { y: '-100%', transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }
          }
        >
          {/* Ambient aurora blobs (reuse global classes) */}
          <div className="aurora-blob aurora-blob-1" aria-hidden />
          <div className="aurora-blob aurora-blob-3" aria-hidden />

          {/* Monogram mark */}
          <motion.div
            className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl btn-gradient flex items-center justify-center shadow-2xl"
            initial={reduce ? false : { scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="text-4xl md:text-5xl font-black text-primary-foreground tracking-tight">TD</span>
          </motion.div>

          {/* Name + role, staggered up */}
          <motion.h1
            className="mt-7 text-3xl md:text-4xl font-bold text-gradient"
            initial={reduce ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.55, ease: EASE }}
          >
            {PERSONAL_INFO.fullName}
          </motion.h1>
          <motion.p
            className="mt-2 text-xs md:text-sm font-mono tracking-[0.25em] uppercase text-muted-foreground"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: reduce ? 0 : 0.8, ease: EASE }}
          >
            Full-Stack Developer &amp; AI Engineer
          </motion.p>

          {/* Progress line sweeping under everything */}
          <motion.div
            className="mt-9 h-px w-44 md:w-56 origin-left bg-linear-to-r from-[var(--aurora-1)] via-[var(--aurora-3)] to-[var(--aurora-2)]"
            initial={reduce ? false : { scaleX: 0, opacity: 0.9 }}
            animate={{ scaleX: 1, opacity: 0.9 }}
            transition={{ duration: reduce ? 0.2 : 0.9, delay: reduce ? 0 : 1.05, ease: 'easeInOut' }}
          />
          <motion.p
            className="mt-3 text-[10px] font-mono text-muted-foreground/70"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 1.15 }}
          >
            {PERSONAL_INFO.domain}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
