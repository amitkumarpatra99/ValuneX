import React, { useState } from "react";
import { FaBars, FaTimes, FaGithub, FaCode } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-[#0f172a]/30 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-500/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent tracking-wide">
            ValuneX
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          
          {/* GitHub Button (Glass Style - Secondary) */}
          <a
            href="https://github.com/amitkumarpatra99"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200 transition-all"
          >
            <FaGithub className="text-lg" />
            <span>GitHub</span>
          </a>

          {/* Developer Button (Gradient Style - Primary) */}
          <a
            href="https://mrpatra.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
          >
            <FaCode className="text-lg" />
            <span>Developer</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 animate-in slide-in-from-top-5 fade-in duration-200 shadow-2xl">
          <div className="flex flex-col p-6 gap-4">
            
            <a
              href="https://github.com/amitkumarpatra99"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium active:scale-95 transition-all"
              onClick={() => setOpen(false)}
            >
              <FaGithub className="text-xl" />
              GitHub
            </a>

            <a
              href="https://mrpatra.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
              onClick={() => setOpen(false)}
            >
              <FaCode className="text-xl" />
              Visit Developer
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}