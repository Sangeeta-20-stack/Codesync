
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Code2,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname, location.hash]);

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "About", href: "/#about" },
  ];

  return (
    <header className="fixed left-0 top-0 z-50 w-full">

      {/* Ambient glow behind navbar */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-40 w-[65%] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[90px]" />

      {/* Navbar surface */}
      <nav className="relative border-b border-violet-400/20 bg-[#080610] shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

        {/* Top highlight */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

        <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/25 to-purple-700/10 text-violet-300 shadow-[0_0_22px_rgba(139,92,246,0.18)] transition-all duration-300 group-hover:scale-105 group-hover:border-violet-400/70 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]">
              <Code2 size={24} strokeWidth={2.2} />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-[3px] border-[#080610] bg-fuchsia-400 shadow-[0_0_12px_rgba(232,121,249,0.8)]" />
            </div>

            <div className="flex flex-col">
              <span className="text-[22px] font-bold tracking-tight text-white transition-colors group-hover:text-violet-100">
                Code<span className="text-violet-400">Sync</span>
                <span className="text-violet-300">.</span>
              </span>

              <span className="mt-[-3px] text-[9px] font-semibold uppercase tracking-[2.5px] text-zinc-500 transition-colors group-hover:text-violet-300/70">
                Build together
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] p-1.5 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group relative rounded-full px-5 py-2.5 text-sm font-medium text-zinc-400 transition-all duration-300 hover:bg-violet-500/10 hover:text-violet-200"
              >
                {link.name}

                <span className="absolute bottom-1 left-5 right-5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm font-semibold transition duration-300 ${
                  isActive
                    ? "text-violet-300"
                    : "text-zinc-400 hover:text-white"
                }`
              }
            >
              Log in
            </NavLink>

            <Link
              to="/register"
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-violet-400/30 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_22px_rgba(139,92,246,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/60 hover:shadow-[0_0_32px_rgba(139,92,246,0.45)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <Sparkles size={15} />
              <span className="relative">Get Started</span>

              <ArrowUpRight
                size={16}
                className="relative transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-xl border border-violet-400/20 bg-violet-500/10 p-2.5 text-zinc-300 transition-all duration-300 hover:border-violet-400/50 hover:bg-violet-500/20 hover:text-violet-300 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Purple separator */}
      <div className="relative h-[2px] w-full bg-gradient-to-r from-transparent via-violet-500/70 to-transparent shadow-[0_0_15px_rgba(139,92,246,0.45)]" />

      {/* Mobile navigation */}
      <div
        className={`absolute left-0 top-full w-full origin-top border-b border-violet-400/20 bg-[#080610] shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-300 md:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6">

          <p className="mb-1 text-[10px] font-bold uppercase tracking-[2.5px] text-zinc-600">
            Navigation
          </p>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-violet-400/10 hover:bg-violet-500/10 hover:text-violet-200"
            >
              {link.name}
              <ArrowUpRight
                size={16}
                className="text-violet-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          ))}

          <div className="my-2 h-px bg-gradient-to-r from-violet-500/30 to-transparent" />

          <Link
            to="/login"
            onClick={closeMenu}
            className="rounded-xl px-3 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
          >
            Log in
          </Link>

          <Link
            to="/register"
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(139,92,246,0.2)] transition duration-300 hover:shadow-[0_0_35px_rgba(139,92,246,0.4)]"
          >
            <Sparkles size={16} />
            Get Started
            <ArrowUpRight size={16} />
          </Link>

          <p className="pt-2 text-center text-[10px] uppercase tracking-[2px] text-zinc-600">
            Code together. Build better.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
