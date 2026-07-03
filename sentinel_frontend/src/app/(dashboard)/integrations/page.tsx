"use client";

import { useDashboardSummary } from "@/lib/queries";
import { Cloud, Server, GitBranch, Lock, Plus, CheckCircle2, ShieldAlert } from "lucide-react";
import CloudTrailDropzone from "@/components/dashboard/CloudTrailDropzone";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function IntegrationsPage() {
  const { data: summary } = useDashboardSummary();
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [provider, setProvider] = useState("AWS");
  const [name, setName] = useState("");

  const fetchIntegrations = async () => {
    try {
      const data = await api.get('/integrations');
      setIntegrations(data);
    } catch (e) {
      console.error("Failed to fetch integrations", e);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleAdd = async () => {
    try {
      await api.post('/integrations', { provider, name });
      setIsAdding(false);
      setName("");
      fetchIntegrations();
    } catch (e) {
      console.error("Failed to add integration", e);
    }
  };

  const identitiesCount = summary?.identities_count || 32;

  const accounts = [
    ...integrations,
    // Add placeholders if none exist just for visual empty state
    ...(integrations.length === 0 ? [
       { id: "aws-prod", provider: "AWS", name: "AWS Production (Demo)", status: "Pending", created_at: "--", upload: true }
    ] : [])
  ];

  const getProviderIcon = (p: string) => {
    switch (p) {
      case "AWS": return <Cloud className="w-5 h-5 text-[#f97316]" />;
      case "Azure": return <Cloud className="w-5 h-5 text-[#06b6d4]" />;
      default: return <Server className="w-5 h-5 text-[#3b82f6]" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Cloud className="w-6 h-6 text-indigo-600" />
            Cloud Accounts
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage your connected cloud platforms, security audit logs, sync state, and demo ingestion configurations.
          </p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary flex items-center gap-2 text-sm shadow-md shadow-indigo-100">
          <Plus className="w-4 h-4" />
          Connect Cloud Account
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm max-w-md">
          <h3 className="font-bold">Add Cloud Account</h3>
          <input className="input-field h-10" placeholder="Account Name" value={name} onChange={e => setName(e.target.value)} />
          <select className="input-field h-10" value={provider} onChange={e => setProvider(e.target.value)}>
            <option value="AWS">AWS</option>
            <option value="Azure">Azure</option>
            <option value="GCP">GCP</option>
          </select>
          <button onClick={handleAdd} className="btn btn-primary h-10">Add Account</button>
        </div>
      )}

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  {getProviderIcon(acc.provider)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{acc.name}</h3>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                acc.status === "Connected" 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {acc.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs leading-normal py-2 border-y border-slate-100">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Created At</span>
                <span className="text-slate-800 font-semibold">{acc.created_at ? new Date(acc.created_at).toLocaleDateString() : "--"}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Identities</span>
                <span className="text-slate-800 font-semibold">{identitiesCount} monitored</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Risk Level</span>
                <span className={`font-semibold text-emerald-600`}>
                  Healthy
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Telemetry Stream</span>
                <span className="text-slate-800 font-semibold">{acc.status === "Connected" ? "Active Stream" : "No stream"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold pt-1">
              <span className="text-slate-400">Demo Ingestion Available</span>
              <span className="text-slate-800 font-bold">{acc.upload ? "Yes" : "No"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Upload Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 text-indigo-600" />
          Ingest Demo Logs to Connected Accounts
        </h2>
        <p className="text-xs text-slate-500">
          Upload static CloudTrail JSON audit files to update the risk models and identity graphs of your active accounts immediately.
        </p>
        <CloudTrailDropzone />
      </div>
    </div>
  );
}
