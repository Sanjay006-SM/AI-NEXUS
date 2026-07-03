"use client";

import { motion, Variants } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { num: "01", name: "Organization", desc: "Initialize your secure SaaS tenant" },
    { num: "02", name: "AWS", desc: "Select target cloud environments" },
    { num: "03", name: "CloudTrail", desc: "Ingest security audit trail logs" },
    { num: "04", name: "Identity Discovery", desc: "Discover machine roles & service users" },
    { num: "05", name: "Graph Intelligence", desc: "Map active relationship links in Neo4j" },
    { num: "06", name: "Risk Engine", desc: "Evaluate risk factor weights" },
    { num: "07", name: "AI Copilot", desc: "Query machine profiles with natural AI reasoning" },
    { num: "08", name: "Executive Dashboard", desc: "Monitor live metrics & blast radius graphs" },
    { num: "09", name: "Remediation", desc: "Apply least privilege controls" }
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="how-it-works" className="w-full py-24 relative z-10 bg-slate-50">
      <div className="max-w-[1100px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-indigo-700 text-[13px] font-semibold tracking-[0.04em] bg-indigo-50 border border-indigo-100 mb-4">
            INGESTION TO RESOLUTION
          </div>
          <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-3xl md:text-5xl text-slate-900">
            How SentinelAI Works
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mt-4">
            A pipeline engineered to transform raw API log events into real-time threat intelligence.
          </p>
        </div>

        {/* Stepper workflow list */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((s, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="bg-white border border-slate-200 rounded-[20px] p-6 flex flex-col justify-between hover:border-indigo-200 transition-all shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-2.5 py-1">
                    STEP {s.num}
                  </span>
                  <CheckCircle className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="font-[family-name:var(--font-jakarta)] text-base font-bold text-slate-900 mb-2">
                  {s.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
