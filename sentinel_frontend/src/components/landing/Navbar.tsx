"use client";

import Link from "next/link";
import { ShieldCheck, ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="landing-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-[64px] px-6 md:px-12 bg-white border-b border-slate-200">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-[family-name:var(--font-jakarta)] text-slate-900 font-bold text-lg">
            SentinelAI
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {["Platform", "Solutions", "Resources", "Pricing", "Security", "Documentation", "Company"].map((item) => (
            <button
              key={item}
              className="text-slate-500 font-medium text-sm transition-colors duration-150 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              {item}
              {(item === "Platform" || item === "Solutions" || item === "Resources" || item === "Company") && (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="px-4 py-2 text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/login?redirect=onboarding"
          className="px-5 py-2 text-white bg-indigo-600 font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
        >
          Start Free Trial
        </Link>
      </div>
    </nav>
  );
}
