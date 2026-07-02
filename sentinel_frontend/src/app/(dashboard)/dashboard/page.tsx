"use client";

import { useDashboardSummary, useRecentFindings, useRecentEvents, useTopAttackPaths, useIdentities } from "@/lib/queries";
import { ShieldCheck, ShieldAlert, GitBranch, Cloud, Users, Activity, BrainCircuit, ArrowRight, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import CloudTrailDropzone from "@/components/dashboard/CloudTrailDropzone";

export default function CommandCenter() {
  const { data: summary } = useDashboardSummary();
  const { data: findings } = useRecentFindings();
  const { data: events } = useRecentEvents();
  const { data: attackPaths } = useTopAttackPaths();
  const { data: identities } = useIdentities();

  // 1. Posture Calculation
  const totalIdentities = summary?.identities_count || identities?.length || 0;
  const criticalFindings = summary?.critical_risk_count || findings?.filter(f => f.severity === "Critical").length || 0;
  const highFindings = findings?.filter(f => f.severity === "High").length || 0;
  const attackPathsCount = summary?.attack_path_count || attackPaths?.length || 0;

  // Posture Score formula: 100 - (critical * 10) - (high * 5) capped between 10 and 100
  const postureScore = Math.max(10, Math.min(100, 100 - (criticalFindings * 10) - (highFindings * 5)));
  
  const getPostureRating = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (score >= 70) return { label: "Good", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { label: "Critical", color: "text-rose-600 bg-rose-50 border-rose-100" };
  };

  const rating = getPostureRating(postureScore);

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Executive Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Security Operations Command Center</h1>
        <p className="text-slate-500 text-sm mt-1">
          Global view of machine identity exposures, attack paths, and automated remediation actions.
        </p>
      </div>

      {/* 1. TOP SECTION: Posture overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Posture Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Posture Score</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-[family-name:var(--font-jakarta)] font-bold text-slate-900">{postureScore}</span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${rating.color}`}>
            {rating.label}
          </span>
        </div>

        {/* Critical Identities */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Identities</span>
            <Users className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-4xl font-[family-name:var(--font-jakarta)] font-bold text-slate-900">
            {identities?.filter(id => id.risk_score >= 80).length || 0}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Identities scored &gt; 80</span>
        </div>

        {/* High Risk Findings */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical Findings</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-4xl font-[family-name:var(--font-jakarta)] font-bold text-slate-900">
            {criticalFindings}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Active security exposures</span>
        </div>

        {/* Attack Paths */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attack Paths</span>
            <GitBranch className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-4xl font-[family-name:var(--font-jakarta)] font-bold text-slate-900">
            {attackPathsCount}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Chained paths mapped</span>
        </div>

        {/* Cloud Accounts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cloud Accounts</span>
            <Cloud className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-4xl font-[family-name:var(--font-jakarta)] font-bold text-slate-900">
            {summary?.cloud_accounts_count || 0}
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Active accounts mapped</span>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Activity</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-[family-name:var(--font-jakarta)] font-bold text-slate-900 truncate">
            {events?.length || 0} events
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">Processed logs stream</span>
        </div>
      </section>

      {/* 2. SECOND SECTION: Today's Changes */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Active Identities */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Recently Active Identities</span>
            <Link href="/identities" className="text-xs text-indigo-600 hover:underline">View All</Link>
          </h2>
          <div className="flex flex-col gap-3 flex-1">
            {identities?.slice(0, 4).map(id => (
              <div key={id.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-900 truncate">{(id.arn.split("/").pop() || id.arn).split(":").pop()}</span>
                  <span className="text-[10px] text-slate-400 truncate">{id.arn.slice(0, 30)}...</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  id.risk_score >= 80 
                    ? "bg-rose-50 text-rose-700" 
                    : id.risk_score >= 50 
                    ? "bg-amber-50 text-amber-700" 
                    : "bg-emerald-50 text-emerald-700"
                }`}>
                  {id.risk_score}
                </span>
              </div>
            ))}
            {(!identities || identities.length === 0) && (
              <span className="text-xs text-slate-400 my-auto text-center">No active identities</span>
            )}
          </div>
        </div>

        {/* Newest Critical Findings */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Newest Critical Findings</span>
            <Link href="/risk-findings" className="text-xs text-indigo-600 hover:underline">View All</Link>
          </h2>
          <div className="flex flex-col gap-3 flex-1">
            {findings?.filter(f => f.severity === "Critical" || f.severity === "High").slice(0, 3).map(f => (
              <div key={f.id} className="flex flex-col gap-1 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{f.finding_type}</span>
                  <span className="bg-rose-50 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-rose-100 uppercase">
                    {f.severity}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 leading-normal">{f.description}</span>
              </div>
            ))}
            {(!findings || findings.length === 0) && (
              <span className="text-xs text-slate-400 my-auto text-center">No critical findings</span>
            )}
          </div>
        </div>

        {/* SentinelAI Copilot Summary */}
        <div className="bg-indigo-900/5 border border-indigo-900/10 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">SentinelAI Copilot Summary</h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Our risk engine analyzed {totalIdentities} cloud identities from the last event log stream. We detected {criticalFindings} critical vulnerabilities and {attackPathsCount} potential privilege escalation paths. 
            </p>
            <div className="p-3 bg-white border border-indigo-100 rounded-lg text-[11px] text-indigo-800 leading-normal font-semibold">
              {findings && findings.length > 0 
                ? `✦ Recommendation: Investigate ${findings[0].finding_type.toLowerCase()} related to ${findings[0].identity_arn.split('/').pop()} first.`
                : "✦ Recommendation: Your cloud environment is secure. Continue monitoring for new risks."}
            </div>
          </div>

          <Link
            href="/ai-investigation"
            className="w-full mt-4 h-9 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5 text-xs"
          >
            Start AI Investigation
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. THIRD SECTION: Recommended Actions */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Actions / Risks */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2 flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Top Identity Access Path Risks</h2>
          <div className="flex flex-col gap-3 flex-1 justify-center">
            {attackPaths?.slice(0, 2).map((path, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">Chained Privilege Path Detected</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {path.nodes?.[0]?.name || "identity-svc"} &rarr; {path.nodes?.[path.nodes.length - 1]?.name || "admin-policy"}
                  </span>
                </div>
                <Link
                  href={`/attack-graph`}
                  className="text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  Inspect Path
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
            {(!attackPaths || attackPaths.length === 0) && (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <span className="text-xs text-slate-500 font-semibold">Zero critical attack paths mapped. You are protected.</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Report & Actions */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-900">Workspace Operations</h2>
            <p className="text-xs text-slate-500">
              Run manual audit logs reporting or export compliance postures.
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Link
              href="/reports"
              className="h-10 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              Generate Compliance Report
            </Link>
            <Link
              href="/identities"
              className="h-10 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Users className="w-4 h-4 text-slate-400" />
              Search All Identities
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FOURTH SECTION: Threat Timeline */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-800">Threat Ingestion Activity Stream</h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
            Live Stream Connected
          </span>
        </div>
        <div className="p-6">
          <CloudTrailDropzone />
        </div>
      </section>

    </div>
  );
}
