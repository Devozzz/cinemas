import React from 'react';
import { X, Play, Film } from 'lucide-react';

export default function TrailerModal({ isOpen, onClose, movie }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-theatre-600 flex items-center justify-center text-white">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white truncate max-w-md">
                {movie.title}
              </h3>
              <p className="text-xs text-slate-400">Official Trailer • {movie.category || 'Movie'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black">
          {movie.trailerUrl ? (
            <iframe
              src={`${movie.trailerUrl}?autoplay=1&rel=0`}
              title={`${movie.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Film className="w-16 h-16 mb-2 text-slate-600" />
              <p className="text-sm">Trailer stream preview currently unavailable.</p>
            </div>
          )}
        </div>

        {/* Modal Footer info */}
        <div className="px-6 py-4 bg-slate-800/50 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-theatre-400">{movie.duration}</span>
            <span>•</span>
            <span>{movie.genre?.join(', ')}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-bold">{movie.ageRating}</span>
          </div>
          <p className="text-slate-400 italic max-w-md line-clamp-1">{movie.tagline}</p>
        </div>
      </div>
    </div>
  );
}
