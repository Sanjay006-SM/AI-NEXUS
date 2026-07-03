"use client";

import { useDashboardSummary } from "@/lib/queries";
import { Building2, Plus, CheckCircle2, Shield, Users, Cloud, Receipt, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function OrganizationPage() {
  const { data: summary } = useDashboardSummary();
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    api.get('/organizations/me').then(setOrg).catch(console.error);
  }, []);

  const identitiesCount = summary?.identities_count || 0;
  const eventsCount = summary?.total_findings_count ? summary.total_findings_count * 100 : 0;
  const workspacesCount = org?.workspaces?.length || 0;

  const kpis = [
    { label: "Active Workspaces", val: `${workspacesCount} workspaces`, desc: "Total environments" },
    { label: "Connected Cloud Accounts", val: "1 account", desc: "Active providers" },
    { label: "Machine Identities Monitored", val: `${identitiesCount} identities`, desc: "AWS IAM Roles and IAM Users" },
    { label: "Cloud Events Processed", val: `${eventsCount.toLocaleString()} events`, desc: "Real-time stream parser logs" },
    { label: "Last Analysis Time", val: "Just now", desc: "Security graph sync completed" },
    { label: "Security Posture Trend", val: "+14.2%", desc: "Exposures fixed this week" }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Organization Center
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage organization workspaces, billing subscriptions, and tenant boundary telemetry.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2 hover:border-slate-300 transition-all">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{kpi.label}</span>
            <div className="text-2xl font-[family-name:var(--font-jakarta)] font-bold text-slate-900">{kpi.val}</div>
            <span className="text-xs text-slate-500">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* Detail Profiles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-900">Tenant Identity Profile</h2>
          <div className="flex flex-col gap-3 text-xs leading-normal">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Organization Name</span>
              <span className="text-slate-800 font-semibold">{org?.name || "Loading..."}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Industry Scope</span>
              <span className="text-slate-800 font-semibold">Technology & Cloud Infrastructure</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Contract Plan</span>
              <span className="text-slate-800 font-semibold">Enterprise SaaS Pro</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Created Date</span>
              <span className="text-slate-800 font-semibold">November 14, 2025</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Organization Status</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Enterprise Health Index</span>
              <span className="text-slate-800 font-semibold">Excellent (94%)</span>
            </div>
          </div>
        </div>

        {/* Directory Workspaces Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800">Tenant Workspace Directories</h2>
            <button className="btn btn-primary text-xs px-3 h-8 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              Add Workspace
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="p-4">Workspace Name</th>
                  <th className="p-4">Environment</th>
                  <th className="p-4">Connected Provider</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(org?.workspaces || []).map((w: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{w.name}</td>
                    <td className="p-4 text-xs font-semibold text-slate-500">{w.environment}</td>
                    <td className="p-4 text-xs text-slate-600 font-mono">AWS IAM</td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Usage Summary & Billing Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4.5 h-4.5 text-indigo-600" />
            Usage Summary
          </h2>
          <p className="text-xs text-slate-500">
            Tenant consumption log limits and data indices.
          </p>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Log Ingestion Bandwidth</span>
              <span className="font-semibold text-slate-800">4.7 GB of 100 GB</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: "4.7%" }} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-indigo-600" />
              Log Retention Policy
            </h2>
            <p className="text-xs text-slate-500">
              Your organization retains parsed security telemetries and threat graphs for compliance review.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded w-fit mt-4">
            90 Days Ingestion Retention Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
