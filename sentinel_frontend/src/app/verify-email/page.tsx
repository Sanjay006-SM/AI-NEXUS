"use client";

import { motion } from "framer-motion";
import { MailOpen, ShieldCheck, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/onboarding";
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6 bg-slate-50">
      
      {/* Verify Email Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] p-8 md:p-10 rounded-[24px] flex flex-col bg-white border border-slate-200 shadow-xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-sm">
            <MailOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-slate-900 mb-2">
            Verify Work Email
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We sent a verification code to your email. Enter the code below to complete setup and start onboarding.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-center gap-2">
            {code.map((val, idx) => (
              <input
                key={idx}
                id={`code-${idx}`}
                type="text"
                required
                maxLength={1}
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-12 text-center text-lg font-bold border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 bg-slate-50 text-slate-900"
              />
            ))}
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-indigo-100 gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue Onboarding
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Link */}
        <div className="mt-6 text-center">
          <span className="text-slate-400 text-sm">Didn&apos;t receive code? </span>
          <button type="button" className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors">
            Resend Code
          </button>
        </div>
      </motion.div>
    </div>
  );
}
