import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Static data outside component (no re-render) ──────────────────────────────

const FEATURES = [
  { title: "Side-by-Side Comparison", desc: "View Figma reference and live implementation simultaneously. Spot differences instantly.", color: "text-purple-400", bg: "bg-purple-500/10" },
  { title: "AI-Powered Detection",    desc: "OpenCV detects diff regions. AI analyses every section for color, spacing, typography mismatches.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Visual Annotations",      desc: "Every issue is annotated on screen with bounding boxes, severity badges and exact positions.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { title: "Severity Prioritization", desc: "Issues ranked High, Medium and Low so engineers know exactly what to fix first.", color: "text-pink-400",   bg: "bg-pink-500/10" },
  { title: "One-Click CSS Fix",       desc: "Each issue includes a CSS declaration you can copy and apply immediately.", color: "text-sky-400",    bg: "bg-sky-500/10" },
  { title: "Slider Overlay Mode",     desc: "Drag a slider to compare both screens pixel-by-pixel with a single gesture.", color: "text-purple-400", bg: "bg-purple-500/10" },
]

const STEPS = [
  { num: "01", title: "Upload Both Screens",     desc: "Drop your Figma export and live screenshot. No setup or plugins needed.", color: "text-purple-400", border: "border-purple-500/40", activeBg: "bg-purple-500/10" },
  { num: "02", title: "AI Scans & Detects",      desc: "OpenCV finds pixel diff regions. AI analyses every section — header, cards, charts, buttons.", color: "text-emerald-400", border: "border-emerald-500/40", activeBg: "bg-emerald-500/10" },
  { num: "03", title: "Review Annotated Issues", desc: "Get bounding box annotations with severity, expected vs actual values and CSS fix.", color: "text-orange-400", border: "border-orange-500/40", activeBg: "bg-orange-500/10" },
]

const ISSUES = [
  { label: "Primary Button Color", severity: "high",   expected: "#6c63ff", actual: "#3b82f6", css: "background-color: #6c63ff;" },
  { label: "Card Border Radius",   severity: "medium", expected: "12px",    actual: "8px",     css: "border-radius: 12px;" },
  { label: "Active Users Font",    severity: "low",    expected: "26px",    actual: "22px",    css: "font-size: 26px;" },
]

const STATS = [
  { value: "9+", label: "Issue types detected" },
  { value: "AI", label: "Vision-powered analysis" },
  { value: "< 10s", label: "Review time per screen" },
];

const BARS = [
  { label: "Color mismatches",     pct: 92, color: "bg-purple-500" },
  { label: "Spacing issues",       pct: 87, color: "bg-emerald-500" },
  { label: "Typography diffs",     pct: 83, color: "bg-orange-400" },
  { label: "Border radius errors", pct: 79, color: "bg-pink-500" },
]

// ── Small reusable component ──────────────────────────────────────────────────

function SeverityBadge({ severity }) {
  const style = {
    high:   "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-orange-400/20 text-orange-400 border-orange-400/30",
    low:    "bg-blue-400/20 text-blue-400 border-blue-400/30",
  }
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${style[severity]}`}>
      {severity.toUpperCase()}
    </span>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled,   setScrolled]   = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  // Show border on nav when user scrolls down
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Auto-cycle the 3 step cards every 2.8s
  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 3), 3000)
    return () => clearInterval(t)
  }, [])

  // Smooth scroll to a section by id
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <div className="min-h-screen bg-[#080810] text-slate-200 overflow-x-hidden">
      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#080810]/90 backdrop-blur-md border-b border-[#1e1e2e]"
            : ""
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-xs font-bold text-white font-mono">
            PC
          </div>
          <span className="text-white font-bold text-base">PixelCheck</span>
        </div>
        <div className="hidden md:flex items-center text-center gap-8">
          <button
            onClick={() => scrollTo("features")}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo("how")}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => scrollTo("preview")}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Preview
          </button>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm text-slate-400 border border-[#2d2d3d] rounded-lg hover:border-purple-500/50 hover:text-white transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-[250px] h-[250px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
            AI-Assisted UI Review Tool
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Catch UI Bugs
            <br />
            <span className="text-purple-500">Before Users Do</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            PixelCheck compares your Figma design against the live
            implementation using AI vision. Get annotated diffs, severity-ranked
            issues, and one-click CSS fixes — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 text-sm"
            >
              Start Reviewing Free →
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3.5 border border-[#2d2d3d] hover:border-purple-500/50 text-slate-300 hover:text-white rounded-xl transition-all text-sm"
            >
              Sign In to Dashboard
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* LIVE PREVIEW */}
      <section id="preview" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
            Live Preview
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            See It In Action
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
            This is what your review screen looks like after AI analysis
          </p>
        </div>

        <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden">
          {/* Mock topbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1e1e1e]">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 font-mono">
                Project X
              </span>
              <span className="text-slate-700">›</span>
              <span className="text-xs text-slate-400 font-mono">
                Home Screen
              </span>
              <span className="text-[11px] bg-[#252525] text-slate-400 border border-[#333] px-2 py-0.5 rounded font-mono">
                V1.2
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-xs text-slate-500">
                Side by Side
              </div>
              <div className="px-4 py-1.5 bg-purple-600 rounded-lg text-xs text-white font-semibold">
                Re-scan with AI
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 p-4 grid grid-cols-2 gap-4">
              {/* Figma panel */}
              <div>
                <div className="text-[10px] font-mono text-slate-600 border border-[#2a2a2a] px-2 py-0.5 rounded inline-block mb-2">
                  Figma Reference
                </div>
                <div className="bg-[#141414] rounded-xl border border-[#1e1e1e] h-52 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-4 w-48 shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-purple-600 rounded" />
                      <span className="text-[10px] font-bold text-gray-800">
                        Dashboard
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {["$84k", "3,842", "4.6%", "3m42s"].map((v, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-1.5">
                          <div className="text-[8px] text-gray-400">Metric</div>
                          <div className="text-[11px] font-bold text-gray-800">
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-1.5">
                      <div className="text-[8px] text-gray-400 mb-1">
                        Revenue
                      </div>
                      {["78%", "55%", "45%"].map((w, i) => (
                        <div key={i} className="flex items-center gap-1 mb-0.5">
                          <div className="w-8 text-[7px] text-gray-400">
                            Ch {i + 1}
                          </div>
                          <div className="flex-1 h-1 bg-gray-200 rounded">
                            <div
                              className="h-1 bg-purple-500 rounded"
                              style={{ width: w }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live panel with annotations */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-[10px] font-mono text-slate-600 border border-[#2a2a2a] px-2 py-0.5 rounded inline-block">
                    Live Implementation
                  </div>
                  <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                    3 Issues
                  </span>
                </div>
                <div className="bg-[#141414] rounded-xl border border-[#1e1e1e] h-52 flex items-center justify-center relative overflow-hidden">
                  <div className="bg-white rounded-xl p-4 w-48 shadow relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-blue-500 rounded" />
                      <span className="text-[10px] font-bold text-gray-800">
                        Dashboard
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-2">
                      {["$84k", "3,842", "4.6%", "3m42s"].map((v, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-1.5 ${i === 2 ? "bg-blue-50" : "bg-gray-50"}`}
                          style={{ borderRadius: i === 0 ? "6px" : "4px" }}
                        >
                          <div className="text-[8px] text-gray-400">Metric</div>
                          <div
                            className={`font-bold text-gray-800 ${i === 1 ? "text-[9px]" : "text-[11px]"}`}
                          >
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-1.5">
                      <div className="text-[8px] text-gray-400 mb-1">
                        Revenue
                      </div>
                      {["78%", "55%", "45%"].map((w, i) => (
                        <div key={i} className="flex items-center gap-1 mb-0.5">
                          <div className="w-8 text-[7px] text-gray-400">
                            Ch {i + 1}
                          </div>
                          <div className="flex-1 h-1 bg-gray-200 rounded">
                            <div
                              className="h-1 bg-blue-500 rounded"
                              style={{ width: w }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Annotation overlays */}
                    <div
                      className="absolute border-2 border-red-500 bg-red-500/10 rounded"
                      style={{
                        top: "2px",
                        left: "2px",
                        width: "22px",
                        height: "22px",
                      }}
                    >
                      <span className="absolute -top-4 left-0 text-[8px] bg-red-500 text-white px-1 rounded whitespace-nowrap">
                        Button Color
                      </span>
                    </div>
                    <div
                      className="absolute border-2 border-orange-400 bg-orange-400/10 rounded"
                      style={{
                        top: "38px",
                        left: "2px",
                        width: "90px",
                        height: "52px",
                      }}
                    >
                      <span className="absolute -top-4 left-0 text-[8px] bg-orange-400 text-black px-1 rounded whitespace-nowrap">
                        Border Radius
                      </span>
                    </div>
                    <div
                      className="absolute border-2 border-blue-400 bg-blue-400/10 rounded"
                      style={{
                        top: "38px",
                        right: "2px",
                        width: "44px",
                        height: "24px",
                      }}
                    >
                      <span className="absolute -top-4 left-0 text-[8px] bg-blue-400 text-black px-1 rounded whitespace-nowrap">
                        Font Size
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Inspector */}
            <div className="w-60 border-l border-[#1e1e1e] bg-[#0a0a0a] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">
                  Issue Inspector
                </span>
                <span className="text-[10px] text-slate-500">3 issues</span>
              </div>
              <div className="flex gap-1 mb-3">
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">
                  1 High
                </span>
                <span className="text-[10px] bg-orange-400/20 text-orange-400 border border-orange-400/30 px-1.5 py-0.5 rounded-full">
                  1 Med
                </span>
                <span className="text-[10px] bg-blue-400/20 text-blue-400 border border-blue-400/30 px-1.5 py-0.5 rounded-full">
                  1 Low
                </span>
              </div>
              <div className="space-y-2">
                {ISSUES.map((issue, i) => (
                  <div
                    key={i}
                    className="bg-[#141414] border border-[#1e1e1e] rounded-lg p-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-slate-300">
                        {issue.label}
                      </span>
                      <SeverityBadge severity={issue.severity} />
                    </div>
                    <div className="flex items-center gap-1 text-[9px] mb-1.5">
                      <span className="text-emerald-400 font-mono">
                        {issue.expected}
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="text-red-400 font-mono">
                        {issue.actual}
                      </span>
                    </div>
                    <div className="bg-[#0d0d0d] rounded px-2 py-1 text-[9px] font-mono text-slate-500">
                      {issue.css}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FEATURES */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Everything You Need to Review UI
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Built for designers, developers and reviewers who want fast,
            accurate UI quality checks.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-6 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 ${f.bg} ${f.color} rounded-xl flex items-center justify-center mb-4 font-bold text-sm`}
              >
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section id="how" className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            3 Steps to a Perfect Review
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              className={`rounded-2xl p-7 border cursor-pointer transition-all duration-300 ${
                activeStep === i
                  ? `${step.activeBg} ${step.border}`
                  : "bg-[#0f0f1a] border-[#1e1e2e] hover:border-[#2e2e3e]"
              }`}
            >
              <div
                className={`text-2xl font-black ${step.color} mb-4 font-family-system-ui`}
              >
                {step.num}
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.desc}
              </p>
              {activeStep === i && (
                <div
                  className={`mt-4 h-0.5 ${step.color.replace("text-", "bg-")} rounded-full`}
                />
              )}
            </div>
          ))}
        </div>
      </section>
      {/* WHY PIXELCHECK */}
      <section id="why" className="px-6 py-20 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-[#130f22] to-[#0f0f1a] border border-purple-500/20 rounded-3xl p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
                Why PixelCheck
              </div>
              <h2 className="text-3xl font-black text-white mb-5 leading-tight">
                Manual UI review is slow and inconsistent
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Every screen designed in Figma goes through an engineer. Small
                gaps in spacing, color, typography and sizing creep in. Manual
                review catches maybe 60% — and takes hours.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                PixelCheck uses OpenCV for pixel-level diff detection and AI
                vision to categorise, annotate and prioritise every mismatch in
                seconds.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="px-7 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Try It Now - It's Free
              </button>
            </div>
            <div className="space-y-4">
              {BARS.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-500">
                      {item.pct}% detection rate
                    </span>
                  </div>
                  <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-600/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Ready to ship <span className="text-purple-500">pixel-perfect</span>{" "}
            UI?
          </h2>
          <p className="text-slate-400 mb-10 text-sm leading-relaxed">
            Upload your Figma export and live screenshot. Get a full AI-powered
            review with annotated issues, severity ranking and CSS fixes in
            seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-9 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 text-sm"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-9 py-4 border border-[#2d2d3d] hover:border-purple-500/50 text-slate-300 hover:text-white rounded-xl transition-all text-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="border-t border-[#1e1e2e] px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-between w-full">
          {/* Left */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-[11px] font-bold text-white font-mono">
              PC
            </div>
            <span className="text-white font-bold text-sm">PixelCheck</span>
            <span className="text-slate-600 text-xs ml-1">
              AI-Powered UI Review
            </span>
          </div>

          {/* Center */}
          <p className="absolute left-1/2 -translate-x-1/2 text-slate-500 text-xs">
            Ship beautiful, pixel-perfect UI with confidence
          </p>

          {/* Right */}
          <div className="flex gap-6 shrink-0">
            <button
              onClick={() => navigate("/login")}
              className="text-xs text-slate-500 hover:text-white transition"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="text-xs text-slate-500 hover:text-white transition"
            >
              Register
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
