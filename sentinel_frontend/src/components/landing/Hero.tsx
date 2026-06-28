"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Play } from "lucide-react";
import Link from "next/link";

const Counter = ({ end, duration }: { end: number; duration: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endValue = end;
    const incrementTime = (duration * 1000) / endValue;
    
    if (endValue === 0) return;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === endValue) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}</span>;
};

export default function Hero() {
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Shape definitions — neon glowing symbols floating left to right
    const SHAPES = [
      { type: 'cross',    x: -120, y: 0.25, size: 52, speed: 0.28, color: '#c8f135', phase: 0    },
      { type: 'circle',   x: -80,  y: 0.55, size: 64, speed: 0.22, color: 'rgba(200,241,53,0.7)', phase: 1.2  },
      { type: 'star4',    x: -200, y: 0.35, size: 58, speed: 0.35, color: '#6366f1', phase: 0.6  },
      { type: 'arrow',    x: -160, y: 0.65, size: 48, speed: 0.30, color: '#c8f135', phase: 2.1  },
      { type: 'ring',     x: -90,  y: 0.20, size: 56, speed: 0.18, color: 'rgba(200,241,53,0.5)', phase: 3.4  },
      { type: 'cross',    x: -250, y: 0.75, size: 44, speed: 0.40, color: '#22d3ee', phase: 1.8  },
      { type: 'star4',    x: -180, y: 0.45, size: 70, speed: 0.25, color: '#c8f135', phase: 4.2  },
      { type: 'circle',   x: -300, y: 0.15, size: 50, speed: 0.32, color: '#6366f1', phase: 2.7  },
      { type: 'ring',     x: -140, y: 0.60, size: 60, speed: 0.20, color: 'rgba(200,241,53,0.6)', phase: 0.9  },
      { type: 'arrow',    x: -220, y: 0.82, size: 46, speed: 0.38, color: '#c8f135', phase: 3.1  },
    ];

    // Initialize x positions spread across the canvas
    SHAPES.forEach((s, i) => {
      s.x = (canvas.width / SHAPES.length) * i - 80;
    });

    let time = 0;

    function drawGlowShape(ctx: CanvasRenderingContext2D, shape: any, x: number, y: number) {
      const { type, size, color } = shape;
      ctx.save();
      ctx.translate(x, y);

      // Glow layers — draw 3 times with increasing blur and decreasing opacity (reduced overall opacity by 30%)
      [
        { blur: 32, alpha: 0.126, scale: 1.8 },
        { blur: 16, alpha: 0.21, scale: 1.3 },
        { blur: 0,  alpha: 0.63, scale: 1.0 },
      ].forEach(({ blur, alpha, scale }) => {
        ctx.save();
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = color;
        ctx.fillStyle = 'none';
        ctx.lineWidth = blur === 0 ? 2.5 : 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (blur > 0) ctx.filter = `blur(${blur}px)`;

        ctx.beginPath();
        const s = size / 2;

        if (type === 'cross') {
          const t = s * 0.32;
          ctx.moveTo(-t, -s); ctx.lineTo(t, -s);
          ctx.lineTo(t, -t); ctx.lineTo(s, -t);
          ctx.lineTo(s, t);  ctx.lineTo(t, t);
          ctx.lineTo(t, s);  ctx.lineTo(-t, s);
          ctx.lineTo(-t, t); ctx.lineTo(-s, t);
          ctx.lineTo(-s, -t); ctx.lineTo(-t, -t);
          ctx.closePath();
          ctx.stroke();
        } else if (type === 'circle') {
          ctx.arc(0, 0, s * 0.75, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
          ctx.stroke();
        } else if (type === 'star4') {
          const outer = s * 0.85;
          const inner = s * 0.22;
          ctx.moveTo(0, -outer);
          ctx.bezierCurveTo(inner, -inner, inner, -inner, outer, 0);
          ctx.bezierCurveTo(inner, inner, inner, inner, 0, outer);
          ctx.bezierCurveTo(-inner, inner, -inner, inner, -outer, 0);
          ctx.bezierCurveTo(-inner, -inner, -inner, -inner, 0, -outer);
          ctx.closePath();
          ctx.stroke();
        } else if (type === 'arrow') {
          ctx.arc(0, 0, s * 0.65, -Math.PI * 0.7, Math.PI * 0.5);
          ctx.stroke();
          ctx.beginPath();
          const ax = s * 0.65 * Math.cos(Math.PI * 0.5);
          const ay = s * 0.65 * Math.sin(Math.PI * 0.5);
          ctx.moveTo(ax - 10, ay - 6);
          ctx.lineTo(ax, ay + 2);
          ctx.lineTo(ax + 8, ay - 8);
          ctx.stroke();
        } else if (type === 'ring') {
          ctx.arc(0, 0, s * 0.80, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.fill();
        }

        ctx.restore();
      });

      ctx.restore();
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      SHAPES.forEach(shape => {
        shape.x += shape.speed;
        if (shape.x > canvas.width + 120) {
          shape.x = -120;
        }

        const floatY = Math.sin(time + shape.phase) * 18;
        const y = canvas.height * shape.y + floatY;

        let alpha = 1;
        if (shape.x < 80) alpha = Math.max(0, shape.x / 80);
        if (shape.x > canvas.width - 80) alpha = Math.max(0, (canvas.width - shape.x) / 80);

        ctx!.globalAlpha = alpha;
        drawGlowShape(ctx!, shape, shape.x, y);
        ctx!.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      animate();
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Start animation if it isn't running
        // Note: simplified logic here, normally we track if it's running
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <section className="min-h-screen pt-[120px] pb-24 px-6 flex flex-col items-center justify-start relative z-10">
      <canvas id="hero-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[900px] w-full flex flex-col items-center text-center relative z-[2]"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[#c8f135] text-[12px] font-semibold tracking-[0.04em] bg-[rgba(200,241,53,0.10)] border border-[rgba(200,241,53,0.25)]">
            ✦ AI-Powered Machine Identity Security
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 variants={itemVariants} className="font-[family-name:var(--font-jakarta)] font-extrabold text-[clamp(48px,7vw,88px)] leading-[1.05] tracking-[-0.03em] mb-6">
          <div className="landing-text-primary">Every Identity.</div>
          <div 
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #c8f135 0%, #6366f1 50%, #22d3ee 100%)" }}
          >
            Every Risk. Instantly.
          </div>
        </motion.h1>

        {/* Subheadline */}
        <motion.p variants={itemVariants} className="landing-text-secondary text-lg font-normal max-w-[580px] leading-[1.65] mb-10">
          SentryIQ ingests your CloudTrail logs, scores machine identity risk in real time,
          maps attack paths before they&apos;re exploited, and lets AI investigate threats for you.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <motion.div whileHover={{ translateY: -1 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[#c8f135] text-[#0d1117] text-base font-bold rounded-xl hover:bg-[#d4f54a] transition-all duration-200"
              style={{ boxShadow: "0 4px 16px rgba(200, 241, 53, 0.25)" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 24px rgba(200, 241, 53, 0.35)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(200, 241, 53, 0.25)"}
            >
              Start Free Trial &rarr;
            </Link>
          </motion.div>
          <motion.div whileHover={{ translateY: -1 }} whileTap={{ scale: 0.97 }}>
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl transition-all duration-200 text-[#e2e8f0] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.25)]"
            >
              Watch Demo <Play className="w-4 h-4 fill-current" />
            </button>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
          <span className="landing-text-secondary text-[13px] uppercase tracking-wider font-medium">Trusted by security teams at</span>
          <div className="flex flex-wrap justify-center gap-3">
            {["Stripe", "Cloudflare", "Notion", "Vercel"].map(company => (
              <div 
                key={company}
                className="px-3.5 py-1 text-[13px] font-semibold rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.10)] text-[#94a3b8] hover:border-[rgba(200,241,53,0.30)] hover:text-[#c8f135] transition-all duration-200"
              >
                {company}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : 0.3 }}
          className="w-full mt-16"
        >
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes heroFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes livePulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.4); }
            }
          `}} />
          <div 
            className="landing-hero-preview w-full rounded-[24px] p-6 mx-auto text-left"
            style={{
              animation: prefersReducedMotion ? "none" : "heroFloat 6s ease-in-out infinite"
            }}
          >
            {/* Row 1: KPI Tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {[
                { title: "Identities", num: 32, badge: "MONITORING", badgeBg: "rgba(59,130,246,0.15)", badgeCol: "#60a5fa" },
                { title: "Critical Risks", num: 0, badge: "HEALTHY", badgeBg: "rgba(200,241,53,0.12)", badgeCol: "#c8f135" },
                { title: "Attack Paths", num: 1, badge: "ATTENTION", badgeBg: "rgba(234,179,8,0.15)", badgeCol: "#fbbf24" },
                { title: "Findings", num: 17, badge: "PROCESSING", badgeBg: "rgba(139,92,246,0.15)", badgeCol: "#a78bfa" }
              ].map((kpi, i) => (
                <div key={i} className="bg-[#161b22] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[#64748b] text-[11px] font-medium uppercase tracking-wider">{kpi.title}</span>
                  </div>
                  <div className="text-3xl font-[family-name:var(--font-jakarta)] font-bold text-[#e2e8f0]">
                    <Counter end={kpi.num} duration={1.2} />
                  </div>
                  <div className="inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: kpi.badgeBg, color: kpi.badgeCol }}>
                    {kpi.badge}
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: Chart & Threat Feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Fake Chart */}
              <div className="bg-[#161b22] border border-[rgba(255,255,255,0.08)] md:col-span-2 p-5 rounded-xl flex flex-col">
                <h3 className="text-[#64748b] text-[11px] font-medium uppercase tracking-wider mb-4">Risk Over Time — Last 30 Days</h3>
                <div className="flex-1 flex items-end gap-2 h-32 pt-2">
                  {[20, 35, 15, 50, 40, 60, 25, 45, 30, 55, 70, 40].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm flex flex-col justify-end gap-[1px]">
                      {h > 50 && <div className="w-full bg-red-400 opacity-80" style={{ height: `${(h-50)/2}%` }} />}
                      {h > 30 && <div className="w-full bg-orange-400 opacity-80" style={{ height: `${(Math.min(h,50)-30)/2}%` }} />}
                      <div className="w-full bg-yellow-400 opacity-80" style={{ height: `${Math.min(h,30)/2}%` }} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Threat Feed */}
              <div className="bg-[#161b22] border border-[rgba(255,255,255,0.08)] md:col-span-1 p-5 rounded-xl flex flex-col gap-4">
                <h3 className="text-[#64748b] text-[11px] font-medium uppercase tracking-wider mb-1">Live Threat Feed</h3>
                {[
                  { text: "Privilege escalation — root-admin", time: "just now", dot: "#ef4444" },
                  { text: "Stale API key — payments-svc", time: "2m ago", dot: "#f97316" },
                  { text: "Unusual access — lambda-exec", time: "14m ago", dot: "#fbbf24" }
                ].map((feed, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: feed.dot }} />
                    <div className="flex flex-col">
                      <span className="text-[#e2e8f0] text-sm font-medium leading-tight">{feed.text}</span>
                      <span className="text-[#94a3b8] text-xs">{feed.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Live Bar */}
            <div className="bg-[#161b22] border border-[rgba(255,255,255,0.08)] w-full p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-[family-name:var(--font-mono)] text-xs text-[#94a3b8]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" style={{ animation: "livePulse 2s ease-in-out infinite" }} />
                <span>LIVE &middot; 14,239 identities protected &middot; 12.4k events/min</span>
              </div>
              <div>
                <span>38s MTTD &bull; 1,284 paths mapped &bull; 612 auto-remediated</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
