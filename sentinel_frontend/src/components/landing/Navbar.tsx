"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="landing-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[64px] px-6 md:px-12"
    >
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-[#c8f135]" />
        <span className="font-[family-name:var(--font-jakarta)] landing-text-primary font-bold text-xl">
          SentryIQ
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {["Product", "Features", "Pricing", "Docs", "Blog"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[#94a3b8] font-medium transition-colors duration-150 hover:text-[#e2e8f0]"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hidden md:inline-flex px-4 py-2 text-[#e2e8f0] font-medium border border-[rgba(255,255,255,0.15)] rounded-lg bg-transparent hover:border-[rgba(255,255,255,0.30)] hover:bg-[rgba(255,255,255,0.05)] transition-all"
        >
          Sign In
        </Link>
        <Link
          href="/dashboard"
          className="hidden md:inline-flex px-4 py-2 text-[#94a3b8] font-medium hover:text-[#e2e8f0] transition-colors"
        >
          Go to Dashboard &rarr;
        </Link>
        <Link
          href="/signup"
          className="px-5 py-2 text-[#0d1117] bg-[#c8f135] font-bold rounded-lg hover:bg-[#d4f54a] transition-all hover:-translate-y-[1px]"
          style={{ boxShadow: "0 4px 16px rgba(200, 241, 53, 0.25)" }}
        >
          Start Free Trial
        </Link>
      </div>
    </motion.nav>
  );
}
