import React, { useState } from 'react';
import { Film, Ticket, Popcorn, ShieldCheck, Menu, X, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenLookup, onOpenQuickBook }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'shows', label: "Shows" },
    { id: 'snacks', label: "Snacks & Cafe" },
    { id: 'admin', label: "Box Office" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Minimal Brand Logo */}
          <div 
            onClick={() => setActiveTab('shows')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-theatre-600 flex items-center justify-center text-white shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg tracking-tight text-slate-900 group-hover:text-theatre-600 transition-colors">
                MAYURA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-theatre-600"></span>
              <span className="text-xs font-semibold text-slate-400 tracking-wider">
                CINEMAS
              </span>
            </div>
          </div>

          {/* Minimalist Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-theatre-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-theatre-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenLookup}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Find Ticket
            </button>

            <button
              onClick={onOpenQuickBook}
              className="px-4 py-2 rounded-xl bg-theatre-600 hover:bg-theatre-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              Book Seats
            </button>
          </div>

          {/* Mobile menu hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenLookup}
              className="p-2 text-slate-600 hover:text-slate-900"
              title="Find Ticket"
            >
              <Ticket className="w-4 h-4 text-theatre-600" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3 shadow-sm animate-slide-up">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2 text-sm font-semibold ${
                  isActive ? 'text-theatre-600' : 'text-slate-700'
                }`}
              >
                {link.label}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenLookup();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-slate-600"
            >
              Find My Ticket
            </button>

            <button
              onClick={() => {
                onOpenQuickBook();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-theatre-600 text-white text-xs font-bold"
            >
              Book Seats
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
