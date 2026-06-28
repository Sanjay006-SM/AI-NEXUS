"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="w-full py-24 relative z-10 overflow-hidden px-6">
      <motion.div 
        initial={{ scale: 0.96, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="landing-cta w-full max-w-[800px] mx-auto text-center px-6 py-[80px] md:px-12 flex flex-col items-center rounded-[24px]"
      >
        <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-4xl md:text-5xl landing-text-primary mb-4">
          Start protecting your identities today.
        </h2>
        <p className="landing-text-secondary text-lg mb-10">
          Free forever for up to 500 identities. No credit card required.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3.5 text-[#0d1117] bg-[#c8f135] text-base font-bold rounded-xl hover:bg-[#d4f54a] transition-all hover:-translate-y-[2px]"
            style={{ boxShadow: "0 4px 16px rgba(200, 241, 53, 0.25)" }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 24px rgba(200, 241, 53, 0.35)"}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(200, 241, 53, 0.25)"}
          >
            Start Free Trial &rarr;
          </Link>
          <Link
            href="/demo"
            className="landing-btn-ghost w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-xl transition-colors hover:-translate-y-[2px]"
          >
            Book a Demo
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
