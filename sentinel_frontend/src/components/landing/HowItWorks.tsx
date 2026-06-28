"use client";

import { motion } from "framer-motion";
import { Cloud, BrainCircuit, ShieldCheck } from "lucide-react";

export default function HowItWorks() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section id="how-it-works" className="w-full py-24 relative z-10">
      <div className="max-w-[1100px] mx-auto px-6">
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[#c8f135] text-[13px] font-semibold tracking-[0.04em] bg-[rgba(200,241,53,0.10)] border border-[rgba(200,241,53,0.25)] mb-4">
            SETUP IN MINUTES
          </div>
          <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-4xl md:text-5xl landing-text-primary">
            From zero to protected in 3 steps.
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative flex flex-col md:flex-row gap-6 md:gap-8"
        >
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[100px] left-[10%] right-[10%] border-t-2 border-dashed border-[rgba(200,241,53,0.25)] z-0" />

          {/* Step 1 */}
          <motion.div variants={itemVariants} className="flex-1 relative z-10">
            <div className="landing-glass relative overflow-hidden p-8 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 h-full rounded-[20px]">
              {/* Watermark */}
              <div className="absolute -right-4 -bottom-8 font-[family-name:var(--font-jakarta)] font-extrabold text-[120px] text-[rgba(200,241,53,0.08)] leading-none select-none pointer-events-none">
                01
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-[rgba(200,241,53,0.10)] border border-[rgba(200,241,53,0.20)] flex items-center justify-center mb-6 shadow-sm relative z-10">
                <Cloud className="w-7 h-7 text-[#c8f135]" />
              </div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-bold landing-text-primary mb-3 relative z-10">
                Connect CloudTrail
              </h3>
              <p className="landing-text-secondary text-base leading-relaxed relative z-10">
                Point SentryIQ to your AWS account. We start streaming events immediately with zero agents.
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants} className="flex-1 relative z-10">
            <div className="landing-glass relative overflow-hidden p-8 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 h-full rounded-[20px]">
              {/* Watermark */}
              <div className="absolute -right-4 -bottom-8 font-[family-name:var(--font-jakarta)] font-extrabold text-[120px] text-[rgba(200,241,53,0.08)] leading-none select-none pointer-events-none">
                02
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-[rgba(200,241,53,0.10)] border border-[rgba(200,241,53,0.20)] flex items-center justify-center mb-6 shadow-sm relative z-10">
                <BrainCircuit className="w-7 h-7 text-[#c8f135]" />
              </div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-bold landing-text-primary mb-3 relative z-10">
                AI Scores Every Identity
              </h3>
              <p className="landing-text-secondary text-base leading-relaxed relative z-10">
                Our risk engine analyzes 47 behavioral signals and scores each machine identity in real time.
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={itemVariants} className="flex-1 relative z-10">
            <div className="landing-glass relative overflow-hidden p-8 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 h-full rounded-[20px]">
              {/* Watermark */}
              <div className="absolute -right-4 -bottom-8 font-[family-name:var(--font-jakarta)] font-extrabold text-[120px] text-[rgba(200,241,53,0.08)] leading-none select-none pointer-events-none">
                03
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-[rgba(200,241,53,0.10)] border border-[rgba(200,241,53,0.20)] flex items-center justify-center mb-6 shadow-sm relative z-10">
                <ShieldCheck className="w-7 h-7 text-[#c8f135]" />
              </div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-xl font-bold landing-text-primary mb-3 relative z-10">
                Investigate & Remediate
              </h3>
              <p className="landing-text-secondary text-base leading-relaxed relative z-10">
                Get alerted on anomalies, visualize attack paths, and let AI write your incident reports.
              </p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
