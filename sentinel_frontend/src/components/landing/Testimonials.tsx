"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const testimonials = [
    {
      quote: "SentryIQ caught a privilege escalation chain we had missed for 3 weeks. The AI investigation saved us 6 hours of forensic work.",
      name: "Sarah K.",
      role: "Lead Security Engineer, Series B Fintech"
    },
    {
      quote: "We went from zero machine identity visibility to full coverage in an afternoon. The CloudTrail ingestion just works.",
      name: "Marcus T.",
      role: "CISO, 800-person SaaS company"
    },
    {
      quote: "The attack path graph is unlike anything else in the market. We now use it in every security review.",
      name: "Priya M.",
      role: "DevSecOps Lead, Cloud-Native Startup"
    }
  ];

  return (
    <section id="testimonials" className="w-full py-24 relative z-10 overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-4xl landing-text-primary">
            Trusted by security teams.
          </h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="landing-glass p-7 flex flex-col group transition-all duration-300 rounded-[20px]"
            >
              <div className="flex items-center gap-1 mb-6">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className="w-4 h-4 fill-[#c8f135] text-[#c8f135]" />
                ))}
              </div>
              <p className="landing-text-primary text-[15px] italic leading-[1.6] mb-8 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="landing-text-primary font-bold text-[15px]">{t.name}</div>
                <div className="landing-text-secondary text-[13px]">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
