import React, { useState, useEffect } from 'react';
import { getConcessions } from '../services/api';

export default function ConcessionsMenu({ onQuickBook }) {
  const [concessions, setConcessions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getConcessions()
      .then(res => {
        if (res.success && res.data) setConcessions(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', 'Combos', 'Popcorn', 'Snacks', 'Beverages', 'Desserts'];

  const filteredItems = activeCategory === 'All' 
    ? concessions 
    : concessions.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Cinema Cafe & Snacks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Samosas, popcorn tubs, and beverages available at the concession counter or during interval.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Concessions in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <div
            key={item._id || item.name}
            className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {item.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-theatre-600 text-white">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-2 right-2 text-lg bg-white/90 backdrop-blur-md w-7 h-7 rounded-full flex items-center justify-center shadow-xs">
                  {item.emoji}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">{item.category}</span>
                  {item.calories && <span>{item.calories}</span>}
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-theatre-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Counter Price</span>
                <span className="font-display font-black text-lg text-slate-900">
                  ₹{item.price}
                </span>
              </div>

              <button
                onClick={onQuickBook}
                className="px-3 py-1.5 bg-slate-50 hover:bg-theatre-50 border border-slate-200 hover:border-theatre-300 text-slate-800 hover:text-theatre-700 text-xs font-bold rounded-lg transition-all"
              >
                Add with Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
