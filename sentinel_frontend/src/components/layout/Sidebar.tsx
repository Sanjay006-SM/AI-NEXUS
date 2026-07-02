"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  GitBranch, 
  ShieldAlert, 
  Terminal, 
  BrainCircuit, 
  FileBarChart, 
  Settings, 
  ShieldCheck,
  ClipboardCheck,
  Building2,
  ScrollText,
  Cloud
} from "lucide-react";
import { useOrganization } from "@/lib/queries";

const navItems = [
  { name: "Executive Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Identity Center", href: "/identities", icon: Users },
  { name: "Investigations", href: "/attack-graph", icon: GitBranch },
  { name: "Risk Center", href: "/risk-findings", icon: ShieldAlert },
  { name: "Cloud Accounts", href: "/integrations", icon: Cloud },
  { name: "Data Sources", href: "/cloudtrail", icon: Terminal },
  { name: "SentinelAI Copilot", href: "/ai-investigation", icon: BrainCircuit },

  { name: "Organization", href: "/organization", icon: Building2 },
  { name: "Audit Logs", href: "/audit-logs", icon: ScrollText },
  { name: "Reports", href: "/reports", icon: FileBarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: orgData } = useOrganization();
  const orgName = orgData?.name || "Loading Workspace...";

  return (
    <aside className="w-[280px] shrink-0 h-[calc(100vh-48px)] sticky top-6 flex flex-col z-50 bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
      {/* Premium Logo Area */}
      <div className="h-20 flex items-center px-6 shrink-0 border-b border-slate-100 relative">
        <Link href="/" className="flex items-center gap-2.5 w-full">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-[family-name:var(--font-jakarta)] text-slate-900 font-bold text-lg">
            SentinelAI
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                  : "text-slate-500 border border-transparent hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Workspace</span>
          <span className="text-xs font-bold text-slate-800">{orgName}</span>
        </div>
      </div>
    </aside>
  );
}
