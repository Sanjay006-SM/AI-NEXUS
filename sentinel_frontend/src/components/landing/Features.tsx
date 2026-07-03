"use client";

import { motion, Variants } from "framer-motion";
import { Users, GitBranch, ShieldAlert, BrainCircuit, ClipboardCheck, FileBarChart, Cloud } from "lucide-react";

const MotionDiv = motion.div;

export default function Features() {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  const modules = [
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      title: "Identity Center",
      value: "Central Inventory",
      desc: "Automatically map and profile all active machine identities, IAM roles, and compute service accounts across your cloud environment."
    },
    {
      icon: <GitBranch className="w-5 h-5 text-indigo-600" />,
      title: "Threat Graph",
      value: "Attack Paths",
      desc: "Visualize chained privilege escalation paths. Locate exactly how an attacker can hop from a compute instance to critical data stores."
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-indigo-600" />,
      title: "Risk Center",
      value: "Prioritize Vulnerabilities",
      desc: "Evaluate risks in real time based on usage, misconfigurations, and external exposure. Prioritize fixing critical anomalies first."
    },
    {
      icon: <BrainCircuit className="w-5 h-5 text-indigo-600" />,
      title: "SentinelAI Copilot",
      value: "AI Investigation",
      desc: "Query machine identities and cloud activities in natural language. Generates executive reports and incident triage details instantly."
    },
    {
      icon: <ClipboardCheck className="w-5 h-5 text-indigo-600" />,
      title: "Compliance Monitor",
      value: "Continuous Audits",
      desc: "Track cloud posture compliance metrics against industry frameworks (SOC 2, ISO 27001, HIPAA, and CIS benchmarks) automatically."
    },
    {
      icon: <FileBarChart className="w-5 h-5 text-indigo-600" />,
      title: "Reports Hub",
      value: "Export Data",
      desc: "Create and schedule executive summaries, audits, and compliance mappings. Share security posture details with team leaders and CISOs."
    },
    {
      icon: <Cloud className="w-5 h-5 text-indigo-600" />,
      title: "Cloud Integrations",
      value: "Unified Operations",
      desc: "Connect AWS, GCP, and Azure accounts. Sync with Slack, PagerDuty, Splunk, or SIEM tools for real-time security alerts."
    }
  ];

  return (
    <section id="features" className="w-full py-24 relative z-10 overflow-hidden bg-white border-y border-slate-200">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-indigo-700 text-[13px] font-semibold tracking-[0.04em] bg-indigo-50 border border-indigo-100 mb-4">
            PLATFORM MODULES
          </div>
          <h2 className="font-[family-name:var(--font-jakarta)] font-extrabold text-3xl md:text-5xl text-slate-900 mb-4">
            Enterprise Security Architecture
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            A comprehensive suite of modules designed to deliver full visibility and control over cloud identity access.
          </p>
        </div>

        {/* Bento Grid */}
        <MotionDiv 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((m, idx) => (
            <MotionDiv 
              key={idx}
              variants={cardVariants}
              className={`landing-glass p-7 flex flex-col justify-between group transition-all duration-300 rounded-[20px] bg-slate-50 border border-slate-200 shadow-sm ${
                idx === 3 ? "md:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    {m.icon}
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5">
                    {m.value}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-jakarta)] text-lg font-bold text-slate-900 mb-2">
                  {m.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </section>
  );
}
