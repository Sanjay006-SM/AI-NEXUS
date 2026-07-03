"use client";

import { useState } from "react";
import { useUploadCloudTrail } from "@/lib/queries";
import { useGlobalStore } from "@/lib/store";
import { ShieldCheck, Building, LayoutGrid, Users, Cloud, FileCode, CheckCircle2, ChevronRight, UploadCloud, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [companySize, setCompanySize] = useState("10-50");
  const [country, setCountry] = useState("United States");

  const [workspaceName, setWorkspaceName] = useState("");
  const [environment, setEnvironment] = useState("Development");

  const [teamMembers, setTeamMembers] = useState([
    { email: "", role: "Analyst" },
    { email: "", role: "Viewer" }
  ]);

  const [provider, setProvider] = useState("aws");
  const [mode, setMode] = useState<'prod' | 'demo'>('demo');

  const { mutateAsync: uploadFile } = useUploadCloudTrail();
  const { isUploading, setUploading } = useGlobalStore();
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTeamEmailChange = (idx: number, email: string) => {
    const updated = [...teamMembers];
    updated[idx].email = email;
    setTeamMembers(updated);
  };

  const handleTeamRoleChange = (idx: number, role: string) => {
    const updated = [...teamMembers];
    updated[idx].role = role;
    setTeamMembers(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('idle');
    try {
      await uploadFile(file);
      setUploadStatus('success');
      // Go to setup complete step on success
      setTimeout(() => {
        setStep(6);
      }, 1000);
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-[580px] bg-white border border-slate-200 rounded-[24px] shadow-xl p-8 md:p-10 flex flex-col">
        
        {/* Progress header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-[family-name:var(--font-jakarta)] text-slate-900 font-bold text-base">
              SentinelAI
            </span>
          </div>
          {step <= 5 && (
            <div className="text-xs font-semibold text-slate-400">
              STEP {step} OF 5
            </div>
          )}
        </div>

        {/* STEP 1: ORGANIZATION */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <Building className="w-5.5 h-5.5 text-indigo-600" />
                Initialize your Organization
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                SentinelAI sets up dedicated tenant boundaries to isolate workspace calculations.
              </p>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Company Name</label>
              <input 
                type="text" 
                required
                placeholder="Acme Corp" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="input-field h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Industry</label>
                <select 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="input-field h-10 text-sm"
                >
                  <option>Technology</option>
                  <option>Financial Services</option>
                  <option>Healthcare</option>
                  <option>Retail</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Company Size</label>
                <select 
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="input-field h-10 text-sm"
                >
                  <option>1-10 employees</option>
                  <option>10-50 employees</option>
                  <option>50-250 employees</option>
                  <option>250+ employees</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Country</label>
              <input 
                type="text" 
                required
                placeholder="United States" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-field h-10 text-sm"
              />
            </div>

            <button 
              onClick={nextStep}
              disabled={!companyName}
              className="mt-2 w-full h-10 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: WORKSPACE */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <LayoutGrid className="w-5.5 h-5.5 text-indigo-600" />
                Configure Workspace
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Configure directories and environment profiles to scope risks.
              </p>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Workspace Name</label>
              <input 
                type="text" 
                required
                placeholder="Production Workspace" 
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="input-field h-10 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Environment Profile</label>
              <div className="grid grid-cols-3 gap-2">
                {["Production", "Staging", "Development"].map(env => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => setEnvironment(env)}
                    className={`h-10 text-xs font-semibold rounded-lg border transition-all ${
                      environment === env 
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" 
                        : "border-slate-200 text-slate-600 bg-white hover:border-slate-300"
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                onClick={prevStep}
                className="flex-1 h-10 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                disabled={!workspaceName}
                className="flex-1 h-10 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INVITE TEAM */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <Users className="w-5.5 h-5.5 text-indigo-600" />
                Invite Security Team
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Collaborate with other security operators in this workspace. You can skip this.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="flex gap-2">
                  <input 
                    type="email"
                    placeholder={`colleague-${idx + 1}@company.com`}
                    value={member.email}
                    onChange={(e) => handleTeamEmailChange(idx, e.target.value)}
                    className="input-field h-10 text-sm flex-1"
                  />
                  <select
                    value={member.role}
                    onChange={(e) => handleTeamRoleChange(idx, e.target.value)}
                    className="input-field h-10 text-sm w-28 shrink-0"
                  >
                    <option>Owner</option>
                    <option>Admin</option>
                    <option>Analyst</option>
                    <option>Viewer</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                onClick={nextStep}
                className="flex-1 h-10 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                Skip
              </button>
              <button 
                onClick={nextStep}
                className="flex-1 h-10 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CHOOSE CLOUD */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <Cloud className="w-5.5 h-5.5 text-indigo-600" />
                Cloud Accounts Setup
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Choose your primary cloud infrastructure providers.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "aws", name: "AWS", active: true },
                { id: "azure", name: "Azure", active: false, label: "Coming Soon" },
                { id: "gcp", name: "GCP", active: false, label: "Coming Soon" }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  disabled={!p.active}
                  onClick={() => setProvider(p.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center h-24 relative ${
                    provider === p.id 
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold" 
                      : "border-slate-200 text-slate-600 bg-white hover:border-slate-300 disabled:opacity-50"
                  }`}
                >
                  <span className="text-xs font-semibold">{p.name}</span>
                  {p.label && (
                    <span className="absolute bottom-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                      {p.label}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-2">
              <button 
                onClick={prevStep}
                className="flex-1 h-10 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                Back
              </button>
              <button 
                onClick={nextStep}
                className="flex-1 h-10 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SETUP CHOOSE EXPERIENCE */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
                <FileCode className="w-5.5 h-5.5 text-indigo-600" />
                Select Operation Experience
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Choose between connecting a production account or uploading demo CloudTrail JSON data.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setMode('demo')}
                className={`p-4 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  mode === 'demo'
                    ? "border-indigo-600 bg-indigo-50/30 text-indigo-900"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Demo Mode (Upload CloudTrail JSON)</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[8px] font-bold">RECOMMENDED</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Upload an AWS CloudTrail JSON log file manually. Analyzes access anomalies, maps graph paths, and exposes machine risk values immediately.
                </p>
              </button>

              <button
                type="button"
                disabled
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-left flex flex-col gap-1 opacity-60 cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">Production (Connect AWS)</span>
                  <span className="bg-slate-200 text-slate-500 px-2 py-0.5 rounded text-[8px] font-bold">COMING SOON</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Configure continuous cloud infrastructure monitoring using IAM cross-account access profiles.
                </p>
              </button>
            </div>

            {mode === 'demo' && (
              <div className="mt-1">
                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-all text-center">
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">Click to select CloudTrail JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                
                {isUploading && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-600">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Analyzing identity nodes and risk scores...
                  </div>
                )}
                {uploadStatus === 'success' && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ingestion successful! Opening dashboard...
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="mt-3 text-center text-xs font-semibold text-rose-600">
                    Parsing failed. Please verify the CloudTrail JSON structure.
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button 
                onClick={prevStep}
                className="flex-1 h-10 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                Back
              </button>
              <button 
                onClick={() => setStep(6)}
                className="flex-1 h-10 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
              >
                Skip Setup
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SETUP COMPLETE */}
        {step === 6 && (
          <div className="flex flex-col items-center text-center py-4 gap-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Setup Complete!
              </h1>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                SentinelAI has initialized your tenant workspace. Directing you to your Security Dashboard.
              </p>
            </div>
            <Link 
              href="/dashboard"
              className="w-full h-11 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-md shadow-indigo-100"
            >
              Go to Command Center
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
