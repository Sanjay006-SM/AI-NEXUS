"use client";

import { useRecentFindings } from "@/lib/queries";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentFindingsWidget() {
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const { data: findings, isLoading } = useRecentFindings();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'Critical': return "border-critical bg-critical/5";
      case 'High': return "border-high bg-high/5";
      case 'Medium': return "border-warning bg-warning/5";
      default: return "border-success bg-success/5";
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return "light-finding-sev-critical text-critical border-critical/20 bg-critical/10";
      case 'High': return "light-finding-sev-high text-high border-high/20 bg-high/10";
      case 'Medium': return "light-finding-sev-medium text-warning border-warning/20 bg-warning/10";
      default: return "light-finding-sev-tag text-success border-success/20 bg-success/10";
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-1 py-2.5 flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-critical animate-pulse shadow-[0_0_8px_var(--color-critical)]"></span>
            Live Risk Findings
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">Real-time policy violations and anomalies</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-1 flex flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div key="loading" exit={{ opacity: 0 }} className="flex items-center justify-center h-32">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </motion.div>
          ) : !findings || findings.length === 0 ? (
            <motion.div key="empty" exit={{ opacity: 0 }} className="text-center text-text-muted text-xs py-8">
              No active findings.
            </motion.div>
          ) : (
            findings.map((f, index) => (
              <motion.div 
                key={f.id}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.15, delay: prefersReducedMotion ? 0 : index * 0.03 }}
                className={`group relative rounded-lg border-l-[3px] ${getSeverityStyle(f.severity)} hover:bg-elevated cursor-pointer light-finding-row`}
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h3 className="light-finding-title group-hover:text-primary transition-colors line-clamp-1">
                    {f.description}
                  </h3>
                  <span className="light-finding-time whitespace-nowrap font-mono mt-0.5 flex-shrink-0">
                    {f.created_at ? formatDistanceToNow(new Date(f.created_at), { addSuffix: true }).replace('about ', '') : 'Just now'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-[1px] rounded text-[9px] font-bold uppercase tracking-widest border ${getSeverityBadge(f.severity)}`}>
                      {f.severity}
                    </span>
                    <span className="light-finding-id-tag truncate max-w-[150px] md:max-w-[220px]" title={f.identity_arn}>
                      {f.identity_arn.split('/').pop() || f.identity_arn}
                    </span>
                  </div>
                  <span className="light-badge-open-sm uppercase tracking-widest">
                    Open
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
