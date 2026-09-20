import React, { useState, useEffect } from 'react';
import { Play, Ticket, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroBanner({ movies = [], onSelectShowtime, onWatchTrailer }) {
  const featuredMovies = movies.filter(m => m.featured).length > 0 
    ? movies.filter(m => m.featured) 
    : movies.slice(0, 3);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!featuredMovies.length) return null;

  const currentMovie = featuredMovies[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white py-10 md:py-14 border-b border-slate-900">
      
      {/* Subtle Backdrop */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden opacity-25">
        <img
          src={currentMovie.backdropUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Movie Details */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="px-2 py-0.5 rounded bg-theatre-600 text-white font-bold">
                {currentMovie.badge || "Featured"}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200">
                {currentMovie.cbfcCertificate || currentMovie.ageRating || 'UA'}
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {currentMovie.rating}
              </span>
              <span>•</span>
              <span>{currentMovie.duration}</span>
              <span>•</span>
              <span className="text-slate-400">{currentMovie.genre?.join(', ')}</span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                {currentMovie.title}
              </h1>
              {currentMovie.tagline && (
                <p className="text-sm text-slate-400 italic">
                  "{currentMovie.tagline}"
                </p>
              )}
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl leading-relaxed">
              {currentMovie.synopsis}
            </p>

            {/* Language & Screen info */}
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 pt-1">
              <span><strong>Screen:</strong> {currentMovie.hallType}</span>
              <span>•</span>
              <span><strong>Audio:</strong> {currentMovie.language}</span>
            </div>

            {/* Clean Minimalist Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectShowtime(currentMovie)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theatre-600 hover:bg-theatre-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>Select Seats (Pay at Counter)</span>
              </button>

              <button
                onClick={() => onWatchTrailer(currentMovie)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Trailer</span>
              </button>
            </div>

          </div>

          {/* Minimalist Poster Card */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 max-w-[220px] w-full bg-slate-900 group">
              <img
                src={currentMovie.posterUrl}
                alt={currentMovie.title}
                className="w-full h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handlePrev}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {featuredMovies.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? 'w-5 bg-theatre-500' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
