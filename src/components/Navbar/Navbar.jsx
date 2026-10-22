import React, { useState } from "react";
import { FaBars, FaTimes, FaGithub, FaCode } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-nav w-full fixed top-0 left-0 z-50">
      <div className="nav-inner max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <a className="brand" href="/" aria-label="ValuneX home">
          <span className="brand-mark"><i className="fa-solid fa-arrow-right-arrow-left" /></span>
          <span>Valune<span className="brand-accent">X</span></span>
        </a>

        {/* Desktop Menu */}
        <div className="nav-actions hidden md:flex items-center gap-4 text-sm font-medium">
          <a
            href="https://github.com/amitkumarpatra99"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link flex items-center gap-2 px-5 py-2.5 rounded-full"
          >
            <FaGithub className="text-lg" />
            <span>GitHub</span>
          </a>
          <a
            href="https://mrpatra.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta flex items-center gap-2 px-5 py-2.5 rounded-full"
          >
            <FaCode className="text-lg" />
            <span>Meet the developer</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle md:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="mobile-menu md:hidden absolute top-full left-0 w-full">
          <div className="flex flex-col p-6 gap-3">
            <a
              href="https://github.com/amitkumarpatra99"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link mobile-nav-link flex items-center justify-center gap-3 px-4 py-3 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <FaGithub className="text-xl" />
              GitHub
            </a>

            <a
              href="https://mrpatra.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-cta mobile-nav-link flex items-center justify-center gap-3 px-4 py-3 rounded-xl"
              onClick={() => setOpen(false)}
            >
              <FaCode className="text-xl" />
              Meet the developer
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}