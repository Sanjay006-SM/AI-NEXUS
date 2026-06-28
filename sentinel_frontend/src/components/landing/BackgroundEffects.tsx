"use client";

import { motion } from "framer-motion";
import { Sparkles, Target, MousePointer2, Globe, Plus, Hexagon, CircleDashed } from "lucide-react";

export default function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* --- GLOWING ORBS (Soft Ambient Background) --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] dark:bg-blue-600/10" />
      <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[150px] dark:bg-indigo-600/10" />
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-cyan-500/20 blur-[100px] dark:bg-cyan-500/10" />

      {/* --- INTENSE NEON SHAPES (Framer-style glowing layout) --- */}
      
      {/* 1. Large Center Sparkle */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
        className="absolute top-[30%] left-[50%] -translate-x-1/2"
      >
        <Sparkles 
          className="w-40 h-40 text-blue-400 opacity-90" 
          style={{ 
            filter: "drop-shadow(0 0 30px rgba(59,130,246,0.9)) drop-shadow(0 0 60px rgba(59,130,246,0.6))" 
          }}
          strokeWidth={1} 
        />
      </motion.div>

      {/* 2. Medium Target/Crosshair (Left of Center) */}
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -45, 0]
        }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        className="absolute top-[38%] left-[25%]"
      >
        <Target 
          className="w-24 h-24 text-cyan-400 opacity-80" 
          style={{ filter: "drop-shadow(0 0 25px rgba(6,182,212,0.8))" }}
          strokeWidth={1.5} 
        />
      </motion.div>

      {/* 3. Small Plus (Far Left) */}
      <motion.div
        animate={{ 
          scale: [0.9, 1.1, 0.9],
          rotate: [0, 90, 180]
        }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 2 }}
        className="absolute top-[45%] left-[10%]"
      >
        <Plus 
          className="w-12 h-12 text-indigo-400 opacity-90" 
          style={{ filter: "drop-shadow(0 0 15px rgba(99,102,241,0.9))" }}
          strokeWidth={2} 
        />
      </motion.div>

      {/* 4. Medium Pointer (Right of Center) */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          x: [0, 10, 0],
          rotate: [-15, 0, -15]
        }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
        className="absolute top-[35%] right-[25%]"
      >
        <MousePointer2 
          className="w-28 h-28 text-blue-400 opacity-80" 
          style={{ filter: "drop-shadow(0 0 25px rgba(59,130,246,0.8))" }}
          strokeWidth={1} 
        />
      </motion.div>

      {/* 5. Medium Globe (Far Right) */}
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
        className="absolute top-[42%] right-[10%]"
      >
        <Globe 
          className="w-20 h-20 text-indigo-300 opacity-70" 
          style={{ filter: "drop-shadow(0 0 20px rgba(99,102,241,0.8))" }}
          strokeWidth={1.2} 
        />
      </motion.div>

      {/* 6. Extra Small Hexagon (Top Right Floating) */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, -90, -180]
        }}
        transition={{ duration: 12, ease: "linear", repeat: Infinity, delay: 3 }}
        className="absolute top-[15%] right-[15%]"
      >
        <Hexagon 
          className="w-10 h-10 text-cyan-300 opacity-60" 
          style={{ filter: "drop-shadow(0 0 12px rgba(6,182,212,0.6))" }}
          strokeWidth={1.5} 
        />
      </motion.div>

      {/* 7. Extra Large Dashed Circle (Background Bottom Left) */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        className="absolute bottom-[-10%] left-[-5%]"
      >
        <CircleDashed 
          className="w-96 h-96 text-blue-500 opacity-20" 
          style={{ filter: "drop-shadow(0 0 40px rgba(59,130,246,0.4))" }}
          strokeWidth={0.5} 
        />
      </motion.div>
      
    </div>
  );
}
