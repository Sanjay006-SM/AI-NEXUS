"use client";

import { Users, Clock } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
          <Users className="w-6 h-6 text-indigo-600" />
          Team Management
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage your tenant workspace team, console access roles, MFA enforcements, and permission boundaries.
        </p>
      </div>

      {/* Premium Coming Soon Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm min-h-[400px]">
        <div className="p-4 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">RBAC Role Matrices & Operator Management</h2>
        <p className="text-slate-400 text-sm max-w-md leading-relaxed">
          Invite-only workspace settings, multi-factor authentication (MFA) enforcement policies, and permission boundary matrices are coming in the next security console release.
        </p>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
          Coming Soon
        </span>
      </div>
    </div>
  );
}
