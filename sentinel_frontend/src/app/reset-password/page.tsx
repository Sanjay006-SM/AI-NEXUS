"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 p-6 bg-slate-50">
      
      {/* Reset Password Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] p-8 md:p-10 rounded-[24px] flex flex-col bg-white border border-slate-200 shadow-xl"
      >
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-slate-900 mb-2">
                Reset Password
              </h1>
              <p className="text-slate-500 text-sm">
                Set a strong, new password for your console account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-semibold ml-1">New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="input-field h-11"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-sm font-semibold ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="input-field h-11"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 h-11 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-indigo-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h1 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-slate-900 mb-2">
              Password Reset Complete
            </h1>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Your password has been changed successfully. You can now log back in.
            </p>
            <Link 
              href="/login" 
              className="w-full h-11 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center shadow-md shadow-indigo-100"
            >
              Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
