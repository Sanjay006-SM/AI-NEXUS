"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const AnimatedStat = ({ endNum, suffix = "", label }: { endNum: number, suffix?: string, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const duration = 1500; // ms
    // Simple easing
    const startTime = performance.now();
    let animationFrame: number;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * endNum));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, endNum]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center text-center px-4 w-full sm:w-auto">
      <div className="font-[family-name:var(--font-jakarta)] font-bold text-4xl landing-text-primary mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="landing-text-secondary text-sm uppercase tracking-[0.06em] font-normal">
        {label}
      </div>
    </div>
  );
};

export default function StatsBar() {
  return (
    <section 
      className="landing-stats-bar w-full py-10 relative z-10"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 items-center justify-between">
          <AnimatedStat endNum={14239} suffix="+" label="Identities Protected" />
          
          <div className="hidden md:block w-px h-12 bg-[rgba(203,213,225,0.40)] mx-auto" />
          
          <AnimatedStat endNum={38} suffix="s" label="Mean Time to Detect" />
          
          <div className="hidden md:block w-px h-12 bg-[rgba(203,213,225,0.40)] mx-auto" />
          
          {/* For 99.8, we cheat the counter to just animate the integer part or use fixed decimals */}
          <div className="flex flex-col items-center justify-center text-center px-4 w-full sm:w-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-[family-name:var(--font-jakarta)] font-bold text-4xl landing-text-primary mb-1"
            >
              99.8%
            </motion.div>
            <div className="landing-text-secondary text-sm uppercase tracking-[0.06em] font-normal">
              Threat Detection Rate
            </div>
          </div>
          
          <div className="hidden md:block w-px h-12 bg-[rgba(203,213,225,0.40)] mx-auto" />
          
          <AnimatedStat endNum={612} label="Auto-Remediated This Month" />
        </div>
      </div>
    </section>
  );
}
