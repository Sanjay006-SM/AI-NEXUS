"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  ShieldAlert,
  FileJson,
  BrainCircuit,
  ChartColumn,
  FileBarChart,
  Settings,
  ShieldCheck
} from "lucide-react";

const MotionLink = motion.create(Link);

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Identities", href: "/identities", icon: Users },
  { name: "Attack Graph", href: "/attack-graph", icon: GitBranch },
  { name: "Risk Findings", href: "/risk-findings", icon: ShieldAlert },
  { name: "CloudTrail", href: "/cloudtrail", icon: FileJson },
  { name: "AI Analyst", href: "/ai-investigation", icon: BrainCircuit },
  { name: "Analytics", href: "/analytics", icon: ChartColumn },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const sidebarVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" as const }
    }
  };

  return (
    <motion.aside 
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="w-[310px] shrink-0 h-[calc(100vh-48px)] sticky top-6 flex flex-col z-50 glass-premium rounded-[28px] overflow-hidden"
    >
      {/* Premium Logo Area */}
      <div className="h-24 flex items-center px-6 shrink-0 border-b border-glass-subtle/50 relative overflow-hidden">
        {/* Subtle glow behind logo */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-12 h-12 bg-blue-500/20 blur-xl rounded-full" />
        
        <Link href="/" className="flex items-center gap-4 relative z-10 w-full hover:opacity-90 transition-opacity">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center border border-blue-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-text-primary drop-shadow-sm leading-tight">
              SentinelAI
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-500/80">
              Security Operations
            </span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2.5 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <MotionLink
              key={item.name}
              href={item.href}
              whileHover={{ y: prefersReducedMotion ? 0 : -2, scale: prefersReducedMotion ? 1 : 1.02 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-[20px] text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "nav-pill-active"
                  : "text-text-muted hover:bg-white/40 hover:shadow-sm"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-white/20 text-white shadow-inner' : 'bg-glass-subtle text-text-muted shadow-sm'}`}>
                 <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : ''}`} />
              </div>
              
              <span className={`tracking-wide ${isActive ? 'text-white' : ''}`}>{item.name}</span>
            </MotionLink>
          );
        })}
      </div>
    </motion.aside>
  );
}
