"use client";

import { motion, Variants } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="pricing" className="w-full py-24 relative z-10 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[#c8f135] text-[13px] font-semibold tracking-[0.04em] bg-[rgba(200,241,53,0.10)] border border-[rgba(200,241,53,0.25)] mb-4">
            SIMPLE PRICING
          </div>
          <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-4xl md:text-5xl landing-text-primary">
            No per-seat pricing. No surprises.
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-8"
        >
          {/* Starter */}
          <motion.div 
            variants={itemVariants}
            className="landing-glass w-full max-w-sm p-8 flex flex-col transition-all duration-300 rounded-[24px]"
          >
            <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold landing-text-primary mb-2">Starter</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-extrabold landing-text-primary tracking-tight">$0</span>
              <span className="landing-text-secondary font-medium">/ month</span>
            </div>
            <p className="landing-text-secondary text-sm mb-8">Up to 500 identities</p>
            
            <div className="flex flex-col gap-4 mb-10 flex-1">
              {[
                "CloudTrail ingestion",
                "Risk scoring",
                "7-day log retention",
                "Email alerts"
              ].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#c8f135] shrink-0" />
                  <span className="landing-text-secondary text-[15px]">{f}</span>
                </div>
              ))}
            </div>
            
            <Link
              href="/signup"
              className="landing-btn-ghost w-full py-3.5 text-center font-semibold rounded-xl transition-colors"
            >
              Start Free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div 
            variants={itemVariants}
            className="landing-glass w-full max-w-sm p-8 flex flex-col relative z-10 scale-100 md:scale-[1.03] transition-all duration-300 rounded-[24px] !bg-[#1c2128] !border-t-[2px] !border-t-[#c8f135]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center justify-center px-4 py-1 rounded-full text-white text-xs font-bold tracking-[0.04em] bg-[#6366f1] shadow-md">
                MOST POPULAR
              </div>
            </div>

            <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold landing-text-primary mb-2 mt-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-extrabold landing-text-primary tracking-tight">$299</span>
              <span className="landing-text-secondary font-medium">/ month</span>
            </div>
            <p className="landing-text-secondary text-sm mb-8">Up to 10,000 identities</p>
            
            <div className="flex flex-col gap-4 mb-10 flex-1">
              {[
                "Everything in Starter",
                "AI Investigation panel",
                "Attack path visualization",
                "90-day retention",
                "Slack + PagerDuty alerts",
                "API access"
              ].map((f, i) => (
                <div key={f} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 shrink-0 ${i === 0 ? "opacity-50 text-[#c8f135]" : "text-[#c8f135]"}`} />
                  <span className="landing-text-secondary text-[15px]">{f}</span>
                </div>
              ))}
            </div>
            
            <Link
              href="/signup"
              className="w-full py-3.5 text-center text-[#0d1117] bg-[#c8f135] font-bold rounded-xl hover:bg-[#d4f54a] transition-all hover:-translate-y-[1px]"
              style={{ boxShadow: "0 4px 16px rgba(200, 241, 53, 0.25)" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 24px rgba(200, 241, 53, 0.35)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(200, 241, 53, 0.25)"}
            >
              Start Free Trial
            </Link>
          </motion.div>

          {/* Enterprise */}
          <motion.div 
            variants={itemVariants}
            className="landing-glass w-full max-w-sm p-8 flex flex-col transition-all duration-300 rounded-[24px]"
          >
            <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold landing-text-primary mb-2">Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-extrabold landing-text-primary tracking-tight">Custom</span>
            </div>
            <p className="landing-text-secondary text-sm mb-8">Unlimited identities</p>
            
            <div className="flex flex-col gap-4 mb-10 flex-1">
              {[
                "Everything in Pro",
                "SSO / SAML",
                "Custom retention",
                "Dedicated support",
                "SLA guarantee",
                "On-prem option"
              ].map((f, i) => (
                <div key={f} className="flex items-start gap-3">
                  <Check className={`w-5 h-5 shrink-0 ${i === 0 ? "opacity-50 text-[#c8f135]" : "text-[#c8f135]"}`} />
                  <span className="landing-text-secondary text-[15px]">{f}</span>
                </div>
              ))}
            </div>
            
            <Link
              href="/contact"
              className="landing-btn-ghost w-full py-3.5 text-center font-semibold rounded-xl transition-colors"
            >
              Contact Sales
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
