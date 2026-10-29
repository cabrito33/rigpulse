"use client";

import { useState } from "react";
import Link from "next/link";
import { Cpu, Menu, X, Globe } from "lucide-react";
import { type Region } from "@/config/monetization";

interface NavbarProps {
  region: Region;
  onRegionChange: (r: Region) => void;
}

export default function Navbar({ region, onRegionChange }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Rig<span className="text-emerald-400">Pulse</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
              Calculator
            </Link>
            <Link href="/#popular" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
              Popular Combos
            </Link>

            {/* Region toggle */}
            <button
              onClick={() => onRegionChange(region === "global" ? "iberia" : "global")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className={region === "global" ? "text-slate-100" : "text-slate-400"}>EN</span>
              <span className="text-slate-600">/</span>
              <span className={region === "iberia" ? "text-slate-100" : "text-slate-400"}>PT-ES</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-slate-800 pt-4">
            <Link href="/" className="block text-sm text-slate-400 hover:text-slate-100 transition-colors">
              Calculator
            </Link>
            <Link href="/#popular" className="block text-sm text-slate-400 hover:text-slate-100 transition-colors">
              Popular Combos
            </Link>
            <button
              onClick={() => onRegionChange(region === "global" ? "iberia" : "global")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              {region === "global" ? "Switch to PT-ES (Amazon.es)" : "Switch to EN (Amazon.com)"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
