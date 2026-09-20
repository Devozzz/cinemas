import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Film, Search, Star, Play, ChevronRight, Globe } from 'lucide-react';

export default function TodayShows({
  movies = [],
  showtimes = [],
  dates = [],
  selectedDate,
  setSelectedDate,
  onSelectShowtime,
  onWatchTrailer
}) {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const languages = ['All', 'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'English'];
  const categories = ['All', 'Movie', 'Theatre Play', 'Musical'];

  // Filter movies based on language, category, and search query
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchCategory = selectedCategory === 'All' || movie.category === selectedCategory;
      
      const langLower = selectedLanguage.toLowerCase();
      const matchLanguage = selectedLanguage === 'All' || 
        movie.language.toLowerCase().includes(langLower) ||
        (movie.languagesAvailable && movie.languagesAvailable.some(l => l.toLowerCase() === langLower));

      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        movie.title.toLowerCase().includes(q) ||
        movie.synopsis.toLowerCase().includes(q) ||
        movie.genre.some(g => g.toLowerCase().includes(q)) ||
        (movie.director && movie.director.toLowerCase().includes(q)) ||
        (movie.cast && movie.cast.some(c => c.toLowerCase().includes(q)))
      );
      return matchCategory && matchLanguage && matchSearch;
    });
  }, [movies, selectedCategory, selectedLanguage, searchQuery]);

  // Group showtimes by movie ID for the selected date
  const showtimesByMovie = useMemo(() => {
    const map = {};
    showtimes.forEach(st => {
      if (st.date === selectedDate) {
        if (!map[st.movieId]) {
          map[st.movieId] = [];
        }
        map[st.movieId].push(st);
      }
    });
    return map;
  }, [showtimes, selectedDate]);

  return (
    <div className="space-y-6">
      
      {/* Minimal Header & Date Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Now Showing
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select any movie or time slot to check seat availability.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {dates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>{d.label}</span>
                <span className="text-[10px] font-normal opacity-70 ml-1">
                  ({d.dayName ? d.dayName.slice(0, 3) : ''})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Minimal Search & Language Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search movie, star cast, director..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-theatre-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedLanguage === lang
                  ? 'bg-theatre-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Cards Grid */}
      {filteredMovies.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
          <Film className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-medium">No movies match your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMovies.map((movie) => {
            const movieShowtimes = showtimesByMovie[movie._id] || [];

            return (
              <div
                key={movie._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  
                  {/* Poster Thumbnail */}
                  <div 
                    onClick={() => onSelectShowtime(movie, movieShowtimes[0] || null)}
                    className="w-24 sm:w-28 h-36 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer group/poster relative"
                  >
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover/poster:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-1 left-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-slate-950">
                        {movie.cbfcCertificate || movie.ageRating || 'UA'}
                      </span>
                    </div>
                  </div>

                  {/* Movie Info & Showtimes */}
                  <div className="flex-1 space-y-2.5 w-full">
                    
                    <div>
                      {/* Meta line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{movie.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {movie.rating}
                        </span>
                        <span>•</span>
                        <span>{movie.duration}</span>
                        <span>•</span>
                        <span className="text-theatre-600 font-bold">{movie.language}</span>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => onSelectShowtime(movie, movieShowtimes[0] || null)}
                        className="font-display font-black text-lg text-slate-900 hover:text-theatre-600 cursor-pointer transition-colors mt-0.5"
                      >
                        {movie.title}
                      </h3>

                      {/* Synopsis */}
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {movie.synopsis}
                      </p>
                    </div>

                    {/* Showtimes Row */}
                    <div className="pt-2 border-t border-slate-50 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Times:</span>
                      
                      {movieShowtimes.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No scheduled showtimes for this date.</span>
                      ) : (
                        movieShowtimes.map((st) => (
                          <button
                            key={st._id}
                            onClick={() => onSelectShowtime(movie, st)}
                            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-theatre-50 border border-slate-200 hover:border-theatre-300 text-left transition-all group/btn"
                          >
                            <span className="text-xs font-black text-slate-800 group-hover/btn:text-theatre-600 mr-1.5">
                              {st.time}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 group-hover/btn:text-theatre-700">
                              {st.format}
                            </span>
                          </button>
                        ))
                      )}

                      <button
                        onClick={() => onSelectShowtime(movie, movieShowtimes[0] || null)}
                        className="ml-auto text-xs font-bold text-theatre-600 hover:text-theatre-700 flex items-center gap-0.5 py-1"
                      >
                        <span>Check Seats</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
