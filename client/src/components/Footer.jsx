import React from 'react';
import { Film, Heart } from 'lucide-react';

export default function Footer({ onOpenLookup }) {
  return (
    <footer className="bg-white border-t border-slate-100 mt-16 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-theatre-600 flex items-center justify-center text-white">
            <Film className="w-3.5 h-3.5" />
          </div>
          <span className="font-display font-black text-sm text-slate-800 tracking-tight">
            MAYURA GRAND CINEMAS
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">Audi 1–3</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a href="#shows" className="hover:text-slate-900 transition-colors">Shows</a>
          <a href="#snacks" className="hover:text-slate-900 transition-colors">Snacks</a>
          <button onClick={onOpenLookup} className="text-theatre-600 font-semibold hover:underline">
            Find Ticket
          </button>
        </div>

        {/* Copyright */}
        <p className="text-slate-400">
          © 2026 Mayura Grand. Cash / UPI at Box Office.
        </p>
      </div>
    </footer>
  );
}
