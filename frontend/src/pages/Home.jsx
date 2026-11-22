
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Code2,
  Users,
  MessageSquare,
  Terminal,
  ShieldCheck,
  ArrowUpRight,
  Play,
  Check,
  Sparkles,
  GitBranch,
  Zap,
  Globe,
  Monitor,
  
  Braces,
  
  Radio,
  Layers,
  Command,
} from "lucide-react";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Work on the same codebase with your teammates. See changes instantly without refreshing or switching tools.",
    tag: "LIVE SYNC",
  },
  {
    icon: Code2,
    title: "Multi-Language Editor",
    description:
      "Write and experiment with code in multiple programming languages using a powerful developer-focused editor.",
    tag: "MULTI LANGUAGE",
  },
  {
    icon: MessageSquare,
    title: "Built-In Communication",
    description:
      "Discuss logic, share ideas, and solve problems together without leaving your coding workspace.",
    tag: "TEAM CHAT",
  },
  {
    icon: Terminal,
    title: "Code Execution",
    description:
      "Run your code and inspect the output directly inside your collaborative coding environment.",
    tag: "INSTANT RUN",
  },
  {
    icon: ShieldCheck,
    title: "Secure Workspaces",
    description:
      "Create private coding rooms and collaborate with invited teammates in a controlled environment.",
    tag: "SECURE",
  },
  {
    icon: GitBranch,
    title: "Organized Projects",
    description:
      "Keep your coding sessions structured and make it easier to manage your collaborative development workflow.",
    tag: "WORKSPACE",
  },
];

const codeLines = [
  { number: "01", code: 'const workspace = "CodeSync";', color: "text-purple-300" },
  { number: "02", code: "const team = [", color: "text-gray-300" },
  { number: "03", code: '  "Developer 1",', color: "text-emerald-300" },
  { number: "04", code: '  "Developer 2",', color: "text-emerald-300" },
  { number: "05", code: '  "Developer 3"', color: "text-emerald-300" },
  { number: "06", code: "];", color: "text-gray-300" },
  { number: "07", code: "", color: "text-gray-300" },
  { number: "08", code: "function buildTogether() {", color: "text-purple-300" },
  { number: "09", code: "  return team.map(developer => {", color: "text-gray-300" },
  { number: "10", code: "    return developer.create();", color: "text-gray-300" },
  { number: "11", code: "  });", color: "text-gray-300" },
  { number: "12", code: "}", color: "text-purple-300" },
];

function useReveal() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll(".reveal");

    if (!elements?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return sectionRef;
}

function Home() {
  const pageRef = useReveal();

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#080610] text-white selection:bg-violet-500/30 selection:text-white"
    >
      <Navbar />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }

        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(16px); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: .35; }
          50% { opacity: .8; }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        @keyframes shine {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }

        @keyframes gridMove {
          from { background-position: 0 0; }
          to { background-position: 0 40px; }
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(139,92,246,.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,.055) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
          animation: gridMove 8s linear infinite;
        }

        .gradient-text {
          background: linear-gradient(90deg, #c4b5fd, #a78bfa, #e879f9, #c4b5fd);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradientMove 5s linear infinite;
        }

        .float-one { animation: float 6s ease-in-out infinite; }
        .float-two { animation: floatReverse 7s ease-in-out infinite; }
        .pulse-glow { animation: pulseGlow 4s ease-in-out infinite; }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .75s ease, transform .75s ease;
        }

        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .typing-cursor {
          animation: blink 1s steps(2, start) infinite;
        }

        .shine-effect {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .shine-effect::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 35%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.12), transparent);
          transform: translateX(-150%);
        }

        .group:hover .shine-effect::after {
          animation: shine .8s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen overflow-hidden border-b border-violet-500/10 bg-[#080610] pt-[86px]">

        {/* Background effects */}
        <div className="hero-grid pointer-events-none absolute inset-0" />

        <div className="pointer-events-none absolute -left-48 top-20 h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-[140px] pulse-glow" />

        <div className="pointer-events-none absolute -right-48 top-48 h-[500px] w-[500px] rounded-full bg-fuchsia-700/10 blur-[140px] pulse-glow" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/[0.06]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:pb-32 lg:pt-24">

          {/* Hero content */}
          <div className="reveal relative z-10 text-center lg:text-left">

            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium tracking-wide text-violet-200 shadow-[0_0_25px_rgba(139,92,246,0.08)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
              </span>
              THE FUTURE OF COLLABORATIVE CODING
              <ArrowUpRight size={13} />
            </div>

            <h1 className="text-5xl font-black leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-[68px]">
              Build Together.
              <br />
              <span className="gradient-text">Code Smarter.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg lg:mx-0">
              A collaborative coding workspace built for developers.
              Write code, share ideas, and build projects together
              in real time — all in one place.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

              <Link
                to="/register"
                className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(124,58,237,0.5)]"
              >
                <span className="shine-effect" />
                <Sparkles size={17} />
                Get Started Free
                <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="group flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-7 py-4 text-sm font-semibold text-gray-300 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/[0.08] hover:text-white"
              >
                <Play size={16} className="fill-current text-violet-300" />
                Explore Features
              </a>
            </div>

            {/* Quick benefits */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500 lg:justify-start">
              {[
                "Real-time collaboration",
                "Multiple languages",
                "Developer focused",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} className="text-violet-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Editor illustration */}
          <div className="reveal relative mx-auto w-full max-w-[590px] lg:ml-auto">

            {/* Floating badges */}
            <div className="float-one absolute -left-5 top-12 z-20 hidden items-center gap-2 rounded-xl border border-violet-400/20 bg-[#151023]/95 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15">
                <Users size={16} className="text-violet-300" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Collaborators</p>
                <p className="text-xs font-bold text-white">3 Online</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />
            </div>

            <div className="float-two absolute -right-3 bottom-16 z-20 hidden items-center gap-2 rounded-xl border border-violet-400/20 bg-[#151023]/95 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Radio size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Workspace</p>
                <p className="text-xs font-bold text-white">Connected</p>
              </div>
            </div>

            {/* Editor glow */}
            <div className="absolute -inset-5 rounded-[30px] bg-gradient-to-br from-violet-600/20 via-purple-500/5 to-fuchsia-500/15 blur-2xl" />

            {/* Editor card */}
            <div className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-[#0e0b18] shadow-[0_25px_100px_rgba(0,0,0,0.55)] transition duration-500 hover:-translate-y-2 hover:border-violet-400/40 hover:shadow-[0_30px_100px_rgba(124,58,237,0.15)]">

              {/* Editor header */}
              <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#151020] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Code2 size={14} className="text-violet-400" />
                  collaborative.js
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  LIVE
                </div>
              </div>

              {/* Editor body */}
              <div className="flex min-h-[335px]">

                {/* Line numbers */}
                <div className="hidden w-12 shrink-0 flex-col items-end gap-[11px] border-r border-white/[0.05] bg-[#0b0913] py-6 pr-3 text-[11px] text-gray-700 sm:flex">
                  {codeLines.map((line) => (
                    <span key={line.number}>{line.number}</span>
                  ))}
                </div>

                {/* Code */}
                <div className="min-w-0 flex-1 overflow-hidden px-5 py-6 font-mono text-[11px] leading-[22px] sm:text-xs sm:leading-[22px]">
                  {codeLines.map((line) => (
                    <div key={line.number} className="whitespace-pre">
                      <span className={line.color}>{line.code}</span>
                      {line.number === "08" && (
                        <span className="typing-cursor ml-1 inline-block h-4 w-[2px] translate-y-[3px] bg-violet-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Collaborator avatars */}
                <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-l border-white/[0.05] bg-[#0b0913] py-6 sm:flex">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/30 bg-violet-500/20 text-[10px] font-bold text-violet-200">S</div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/20 text-[10px] font-bold text-fuchsia-200">A</div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-500/20 text-[10px] font-bold text-cyan-200">R</div>
                </div>
              </div>

              {/* Editor footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-[#151020] px-5 py-3">
                <div className="flex items-center gap-4 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <GitBranch size={12} className="text-violet-400" />
                    main
                  </span>
                  <span>JavaScript</span>
                </div>

                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <Check size={12} />
                  All changes saved
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-10 -right-5 h-32 w-32 rounded-full bg-purple-600/20 blur-[70px]" />
          </div>
        </div>

        {/* Bottom transition */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      </section>

      {/* ================= TRUST STRIP ================= */}
      <section className="relative border-b border-white/[0.06] bg-[#0b0814]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-5 px-6 py-8 text-xs font-medium uppercase tracking-[0.16em] text-gray-500 sm:justify-between lg:px-12">
          <span className="flex items-center gap-2">
            <Globe size={16} className="text-violet-400" />
            One workspace
          </span>
          <span className="flex items-center gap-2">
            <Zap size={16} className="text-violet-400" />
            Instant updates
          </span>
          <span className="flex items-center gap-2">
            <Braces size={16} className="text-violet-400" />
            Multiple languages
          </span>
          <span className="flex items-center gap-2">
            <Monitor size={16} className="text-violet-400" />
            Built for developers
          </span>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="relative overflow-hidden bg-[#080610] px-6 py-28 lg:px-12"
      >
        <div className="pointer-events-none absolute -left-48 top-20 h-96 w-96 rounded-full bg-violet-700/10 blur-[130px]" />
        <div className="pointer-events-none absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-fuchsia-700/10 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">

          <div className="reveal mx-auto mb-16 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
              <Sparkles size={14} />
              Powerful features
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Everything you need to
              <span className="gradient-text"> code together.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-400 sm:text-base">
              A focused development environment that brings your team,
              code, and conversations together.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="reveal group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#151020] to-[#0c0915] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/30 hover:shadow-[0_20px_60px_rgba(124,58,237,0.12)]"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-600/0 blur-3xl transition duration-500 group-hover:bg-violet-600/20" />

                  <div className="relative">
                    <div className="mb-7 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300 transition-all duration-300 group-hover:scale-110 group-hover:border-violet-400/40 group-hover:bg-violet-500/20 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]">
                        <Icon size={22} />
                      </div>

                      <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[9px] font-semibold tracking-[0.12em] text-gray-500 transition-colors group-hover:border-violet-400/20 group-hover:text-violet-300">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="mb-3 text-lg font-bold text-white transition-colors group-hover:text-violet-200">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-7 text-gray-400">
                      {feature.description}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-violet-400 opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      Explore capability
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="relative overflow-hidden border-y border-white/[0.06] bg-[#0c0915] px-6 py-28 lg:px-12"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-[140px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          <div className="reveal">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
              <Command size={14} />
              Why CodeSync?
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Great code is built
              <span className="gradient-text"> together.</span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-gray-400 sm:text-base">
              Development is better when ideas can flow freely.
              CodeSync aims to make collaboration feel natural by
              bringing coding, communication, and teamwork into
              one connected workspace.
            </p>

            <div className="mt-9 space-y-5">
              {[
                "Work together in a shared coding environment",
                "Keep conversations close to your code",
                "Organize collaborative coding sessions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
                    <Check size={14} />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="group mt-10 inline-flex items-center gap-3 text-sm font-semibold text-violet-300 transition hover:text-white"
            >
              Start building with CodeSync
              <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* About visual */}
          <div className="reveal relative">
            <div className="absolute -inset-5 rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-[#100c1b] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.4)] sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                    <Layers size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Your workspace</p>
                    <p className="text-xs text-gray-500">One place. Your entire team.</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] text-emerald-400">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Code2, name: "Code Editor", detail: "Write and edit code", color: "text-violet-300", bg: "bg-violet-500/10" },
                  { icon: Users, name: "Team Members", detail: "Collaborate together", color: "text-fuchsia-300", bg: "bg-fuchsia-500/10" },
                  { icon: MessageSquare, name: "Team Chat", detail: "Discuss your ideas", color: "text-cyan-300", bg: "bg-cyan-500/10" },
                  { icon: Terminal, name: "Output Console", detail: "Inspect program results", color: "text-emerald-300", bg: "bg-emerald-500/10" },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.name}
                      className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all duration-300 hover:translate-x-1 hover:border-violet-400/20 hover:bg-violet-500/[0.05]"
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-200">{item.name}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                      </div>
                      <ArrowUpRight size={16} className="text-gray-600 transition group-hover:text-violet-300" />
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl border border-violet-400/15 bg-violet-500/[0.06] p-4">
                <div>
                  <p className="text-xs font-semibold text-white">Made for collaboration</p>
                  <p className="mt-1 text-[10px] text-gray-500">Your workflow, connected.</p>
                </div>
                <Sparkles size={21} className="text-violet-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative overflow-hidden bg-[#080610] px-6 py-28 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/15 blur-[150px]" />

        <div className="reveal relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#1a1030] via-[#100c1c] to-[#160d23] px-6 py-16 text-center shadow-[0_20px_100px_rgba(124,58,237,0.12)] sm:px-12 sm:py-20">

          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-violet-400/10" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-violet-400/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-violet-300 shadow-[0_0_35px_rgba(139,92,246,0.2)]">
              <Code2 size={27} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to build
              <span className="gradient-text"> together?</span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Bring your team into one workspace and make collaborative
              coding a part of your development journey.
            </p>

            <Link
              to="/register"
              className="group relative mt-9 inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(124,58,237,0.5)]"
            >
              <span className="shine-effect" />
              Create Your Account
              <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/[0.07] bg-[#06040c] px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 sm:flex-row">

          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/25 bg-violet-500/10 text-violet-300 transition group-hover:bg-violet-500/20">
              <Code2 size={19} />
            </div>
            <span className="text-lg font-bold text-white">
              Code<span className="text-violet-400">Sync</span>
            </span>
          </Link>

          <p className="text-center text-xs text-gray-600">
            © {new Date().getFullYear()} CodeSync. Built for developers.
          </p>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            <a href="#features" className="transition hover:text-violet-300">Features</a>
            <a href="#about" className="transition hover:text-violet-300">About</a>
            <Link to="/login" className="transition hover:text-violet-300">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
