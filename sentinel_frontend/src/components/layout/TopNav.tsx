"use client";

import { Bell, Search, MessageSquare, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function TopNav() {
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const topNavVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" as const, delay: prefersReducedMotion ? 0 : 0.1 }
    }
  };

  const buttonVariants = {
    hover: { scale: prefersReducedMotion ? 1 : 1.05, y: prefersReducedMotion ? 0 : -2 },
    tap: { scale: prefersReducedMotion ? 1 : 0.95 }
  };

  return (
    <motion.header 
      initial="hidden"
      animate="visible"
      variants={topNavVariants}
      className="h-[80px] z-40 flex items-center justify-between px-6 mb-2 glass-premium rounded-[24px]"
    >
      <div className="flex items-center gap-6">
        {/* Floating Glass Search Pill */}
        <div className="relative group flex items-center">
          <div className="absolute left-4 text-text-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search Here..."
            className="search-pill h-11 w-64 md:w-80 rounded-[20px] pl-10 pr-12 text-sm text-text-primary placeholder:text-gray-500 bg-white/20 border border-white/40 backdrop-blur-md focus:outline-none transition-all shadow-sm"
          />
          <div className="absolute right-2 flex items-center">
            <kbd className="inline-flex items-center justify-center h-7 px-2 rounded-xl text-[10px] font-bold bg-white/30 text-text-secondary border border-white/50 shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Settings Icon */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/50 text-text-secondary hover:text-blue-600 hover:bg-white/50 transition-colors backdrop-blur-md shadow-sm"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* Message Icon */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/50 text-text-secondary hover:text-blue-600 hover:bg-white/50 transition-colors backdrop-blur-md shadow-sm"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>

        {/* Notification Icon */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/50 text-text-secondary hover:text-blue-600 hover:bg-white/50 transition-colors backdrop-blur-md shadow-sm"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)] border-2 border-white"></span>
        </motion.button>
        
        {/* User Profile Glass Capsule */}
        <motion.div 
          whileHover={{ y: prefersReducedMotion ? 0 : -2, scale: prefersReducedMotion ? 1 : 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="h-12 pl-1.5 pr-4 rounded-full flex items-center gap-3 bg-white/30 border border-white/50 backdrop-blur-md cursor-pointer hover:bg-white/40 transition-colors shadow-sm ml-2 relative"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center overflow-hidden text-blue-600 font-bold text-xs shadow-inner">
              DO
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-text-primary leading-tight">David Owner</span>
            <span className="text-[10px] font-medium text-text-muted">Administrator</span>
          </div>
          <div className="ml-1 w-4 h-4 flex items-center justify-center text-text-muted">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
