"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Network, Sparkles, ShieldCheck, Plug } from "lucide-react";

const MotionDiv = motion.div;

export default function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="features" className="w-full py-24 relative z-10 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[#c8f135] text-[13px] font-semibold tracking-[0.04em] bg-[rgba(200,241,53,0.10)] border border-[rgba(200,241,53,0.25)] mb-4">
            PLATFORM CAPABILITIES
          </div>
          <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-4xl md:text-5xl landing-text-primary mb-4">
            Everything your SOC needs.
          </h2>
          <p className="landing-text-secondary text-lg max-w-2xl mx-auto">
            From log ingestion to AI investigation &mdash; one platform, zero blind spots.
          </p>
        </div>

        {/* Bento Grid */}
        <MotionDiv 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {/* Tile 1: Ingestion (8 cols) */}
          <MotionDiv 
            variants={cardVariants}
            className="landing-glass md:col-span-8 p-8 flex flex-col justify-between group transition-all duration-300 rounded-[20px]"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[rgba(200,241,53,0.10)] flex items-center justify-center mb-6">
                <Terminal className="w-6 h-6 text-[#c8f135]" />
              </div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold landing-text-primary mb-3">
                Real-Time CloudTrail Ingestion
              </h3>
              <p className="landing-text-secondary text-base leading-relaxed max-w-md">
                Connect any AWS account in 60 seconds. SentryIQ streams events at 12,000+/min with zero performance impact on your infrastructure.
              </p>
            </div>
            
            <div className="mt-8 bg-black/40 rounded-xl p-4 font-[family-name:var(--font-mono)] text-xs shadow-inner overflow-hidden border border-white/10">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 mb-2">
                14:30:00 &nbsp;<span className="text-blue-400">AssumeRole</span> &nbsp;&nbsp;&nbsp;arn:aws:iam::4129::role/payments-svc
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-slate-400 mb-2">
                14:30:05 &nbsp;<span className="text-green-400">CreateAccessKey</span> &nbsp;arn:aws:iam::4129::user/ci-runner
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-red-300 bg-red-950/50 p-1 -mx-1 rounded">
                14:30:09 &nbsp;<span className="text-red-400">DeleteTrail</span> &nbsp;&nbsp;&nbsp;&nbsp;arn:aws:iam::log-bucket &nbsp;&larr; ALERT
              </motion.div>
            </div>
          </MotionDiv>

          {/* Right Column for Tile 2 & 3 */}
          <div className="md:col-span-4 flex flex-col gap-4">
            {/* Tile 2: Risk Scoring */}
            <MotionDiv 
              variants={cardVariants}
              className="landing-glass flex-1 p-7 flex flex-col group transition-all duration-300 relative overflow-hidden rounded-[20px]"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold landing-text-primary mb-2 z-10">
                ML Risk Scoring
              </h3>
              <p className="landing-text-secondary text-sm leading-relaxed z-10">
                Every identity scored 0&ndash;100 in real time across 47 behavioral signals.
              </p>
              {/* Score Donut */}
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <svg width="140" height="140" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="12" strokeDasharray="180 250" />
                  <text x="50" y="55" fontSize="24" fontWeight="bold" fill="#f97316" textAnchor="middle">73</text>
                </svg>
              </div>
            </MotionDiv>

            {/* Tile 3: Attack Path */}
            <MotionDiv 
              variants={cardVariants}
              className="landing-glass flex-1 p-7 flex flex-col group transition-all duration-300 rounded-[20px]"
            >
              <div className="w-10 h-10 rounded-lg bg-[rgba(200,241,53,0.10)] flex items-center justify-center mb-4">
                <Network className="w-5 h-5 text-[#c8f135]" />
              </div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold landing-text-primary mb-2">
                Attack Path Visualization
              </h3>
              <p className="landing-text-secondary text-sm leading-relaxed mb-4">
                See exactly how an attacker moves through your identity graph.
              </p>
              {/* Connected dots */}
              <div className="flex items-center gap-2 mt-auto">
                <div className="w-3 h-3 rounded-full bg-slate-400/50 group-hover:bg-[#c8f135] transition-colors" />
                <div className="h-0.5 flex-1 bg-slate-400/30 group-hover:bg-[rgba(200,241,53,0.5)] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-slate-400/70 group-hover:bg-[#c8f135] transition-colors" />
                <div className="h-0.5 flex-1 bg-slate-400/30 group-hover:bg-[rgba(200,241,53,0.5)] transition-colors" />
                <div className="w-3 h-3 rounded-full bg-red-500/80 group-hover:bg-red-500 transition-colors shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              </div>
            </MotionDiv>
          </div>

          {/* Bottom Row */}
          
          {/* Tile 4: AI Investigation */}
          <MotionDiv 
            variants={cardVariants}
            className="landing-glass md:col-span-4 p-7 flex flex-col group transition-all duration-300 rounded-[20px]"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold landing-text-primary mb-2">
              AI-Powered Investigation
            </h3>
            <p className="landing-text-secondary text-sm leading-relaxed mb-6">
              Ask SentryIQ AI anything. Get a structured incident report in seconds.
            </p>
            {/* AI Bubble */}
            <div className="mt-auto flex flex-col gap-3">
              <div className="self-end bg-black/20 text-white/70 text-xs px-3 py-2 rounded-xl rounded-tr-sm border border-white/10">
                Why is root-admin flagged?
              </div>
              <div className="self-start bg-[rgba(200,241,53,0.10)] landing-text-primary text-xs px-3 py-2 rounded-xl rounded-tl-sm border border-[rgba(200,241,53,0.30)] border-l-2 border-l-[#c8f135] shadow-sm leading-relaxed">
                root-admin assumed 3 roles in 4 minutes and accessed secretsmanager outside its normal pattern. Risk score elevated to 87. Recommend immediate review.
              </div>
            </div>
          </MotionDiv>

          {/* Tile 5: Policies */}
          <MotionDiv 
            variants={cardVariants}
            className="landing-glass md:col-span-4 p-7 flex flex-col group transition-all duration-300 rounded-[20px]"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold landing-text-primary mb-2">
              Custom Policy Rules
            </h3>
            <p className="landing-text-secondary text-sm leading-relaxed">
              Define what normal looks like. Get alerted the instant something deviates from the baseline.
            </p>
          </MotionDiv>

          {/* Tile 6: Integrations */}
          <MotionDiv 
            variants={cardVariants}
            className="landing-glass md:col-span-4 p-7 flex flex-col group transition-all duration-300 rounded-[20px]"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
              <Plug className="w-5 h-5 text-sky-500" />
            </div>
            <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold landing-text-primary mb-2">
              Native Integrations
            </h3>
            <p className="landing-text-secondary text-sm leading-relaxed mb-6">
              Connects seamlessly with your existing tech stack.
            </p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {['AWS', 'GCP', 'Azure', 'Slack', 'PagerDuty', 'Splunk'].map(tool => (
                <span key={tool} className="text-xs font-semibold px-2 py-1 rounded bg-black/20 landing-text-secondary border border-white/10">
                  {tool}
                </span>
              ))}
            </div>
          </MotionDiv>

        </MotionDiv>
      </div>
    </section>
  );
}
