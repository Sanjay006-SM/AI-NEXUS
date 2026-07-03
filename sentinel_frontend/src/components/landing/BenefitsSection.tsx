"use client";

import { Clock, Eye, AlertCircle, Zap, ShieldCheck } from "lucide-react";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
      title: "Reduce Triage Time",
      desc: "SentinelAI automates threat path parsing, dropping Mean Time to Investigate (MTTI) from hours to seconds using Gemini's security logic."
    },
    {
      icon: <Eye className="w-5 h-5 text-indigo-600" />,
      title: "Improve Cloud Visibility",
      desc: "Discover shadow identities, inactive keys, and unmanaged roles. Keep a real-time, context-rich catalog of all machine entities."
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-indigo-600" />,
      title: "Prioritize Critical Risks",
      desc: "Stop chasing low-level noise. Our engine scores vulnerabilities based on actual path context, helping you focus resources where they matter most."
    },
    {
      icon: <Zap className="w-5 h-5 text-indigo-600" />,
      title: "Accelerate Remediation",
      desc: "AI Copilot generates tailored JSON permission updates and least-privilege policy changes to safely resolve exposures."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      title: "Enhance Security Posture",
      desc: "Continuously audit configuration values, mapping them to compliance policies to guarantee zero configuration drift."
    }
  ];

  return (
    <section className="w-full py-24 bg-white border-b border-slate-200 relative z-10">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-indigo-700 text-[13px] font-semibold tracking-[0.04em] bg-indigo-50 border border-indigo-100 mb-4">
            BUSINESS METRICS
          </div>
          <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-3xl md:text-5xl text-slate-900 mb-4">
            Quantifiable Enterprise Benefits
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            SentinelAI empowers security teams with clear, measurable improvements in cloud governance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                {b.icon}
              </div>
              <h3 className="font-[family-name:var(--font-jakarta)] text-base font-bold text-slate-900">
                {b.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
