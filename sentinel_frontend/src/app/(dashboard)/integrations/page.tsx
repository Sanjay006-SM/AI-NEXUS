"use client";

import { useDashboardSummary } from "@/lib/queries";
import { Cloud, Server, Plus, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);

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

  const getProviderIcon = (p: string) => {
    switch (p.toLowerCase()) {
      case "aws": return <Cloud className="w-5 h-5 text-[#f97316]" />;
      case "azure": return <Cloud className="w-5 h-5 text-[#06b6d4]" />;
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
            Integrations
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage live cloud integrations to automatically ingest and analyze events.
          </p>
        </div>
      </div>

      {/* Grid of Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(acc => (
          <div key={acc.provider} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  {getProviderIcon(acc.provider)}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{acc.name}</h3>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                acc.status === "available" || acc.status === "coming_soon"
                  ? "bg-slate-100 text-slate-500 border-slate-200" 
                  : acc.status === "error"
                  ? "bg-rose-50 text-rose-700 border-rose-100"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}>
                {acc.status.replace(/_/g, " ")}
              </span>
            </div>

            <div className="text-xs text-slate-500 h-8">
              {acc.status === 'coming_soon' && "This integration is coming soon."}
              {acc.status === 'available' && "Ready to be configured."}
              {acc.status !== 'coming_soon' && acc.status !== 'available' && (
                <div className="flex flex-col gap-1">
                  <div><span className="font-semibold text-slate-700">Events Retreived:</span> {acc.events_retrieved || 0}</div>
                  <div><span className="font-semibold text-slate-700">Last Sync:</span> {acc.last_sync_time ? new Date(acc.last_sync_time).toLocaleString() : 'Never'}</div>
                </div>
              )}
            </div>
            
            {acc.status === "error" && (
              <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded truncate" title={acc.error_message}>
                {acc.error_message}
              </div>
            )}

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              {acc.provider === 'aws' ? (
                <Link href="/integrations/aws" className="btn btn-primary text-xs py-1.5 px-3">
                  {acc.status === 'available' ? 'Configure' : 'Manage'}
                </Link>
              ) : (
                <button disabled className="btn border border-slate-200 bg-slate-50 text-slate-400 text-xs py-1.5 px-3 cursor-not-allowed">
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
