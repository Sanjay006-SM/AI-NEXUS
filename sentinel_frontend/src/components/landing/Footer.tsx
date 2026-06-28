"use client";

import { Shield, Code, MessageCircle, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="landing-stats-bar w-full relative z-10 pt-16 pb-12 px-6 border-b-0"
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
        
        {/* Col 1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-[#c8f135]" />
            <span className="font-[family-name:var(--font-jakarta)] landing-text-primary font-bold text-xl">
              SentryIQ
            </span>
          </div>
          <p className="landing-text-secondary text-sm mb-4">
            Machine identity security for the cloud era.
          </p>
          <div className="flex items-center gap-4 landing-text-secondary opacity-80">
            <a href="#" className="hover:text-[#c8f135] transition-colors"><Code className="w-5 h-5" /></a>
            <a href="#" className="hover:text-[#c8f135] transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="#" className="hover:text-[#c8f135] transition-colors"><Globe className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold landing-text-primary mb-2">Product</h4>
          {['Dashboard', 'Features', 'Pricing', 'Changelog', 'Roadmap'].map(link => (
            <Link key={link} href="#" className="landing-text-secondary text-sm hover:text-[#e2e8f0] transition-colors">
              {link}
            </Link>
          ))}
        </div>

        {/* Col 3 */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold landing-text-primary mb-2">Company</h4>
          {['About', 'Blog', 'Careers', 'Press', 'Contact'].map(link => (
            <Link key={link} href="#" className="landing-text-secondary text-sm hover:text-[#e2e8f0] transition-colors">
              {link}
            </Link>
          ))}
        </div>

        {/* Col 4 */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold landing-text-primary mb-2">Legal</h4>
          {['Privacy Policy', 'Terms of Service', 'Security', 'SOC 2'].map(link => (
            <Link key={link} href="#" className="landing-text-secondary text-sm hover:text-[#e2e8f0] transition-colors">
              {link}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="landing-text-secondary text-[13px] opacity-80">
          &copy; 2025 SentryIQ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
