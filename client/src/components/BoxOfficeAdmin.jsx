import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Film, 
  Clock, 
  Calendar, 
  Ticket, 
  Check, 
  X, 
  Info,
  ChevronRight,
  Armchair,
  Sparkles
} from 'lucide-react';
import { getStats, toggleSeatStatus, getShowtimeById } from '../services/api';

export default function BoxOfficeAdmin({ movies = [], showtimes = [], onRefreshData }) {
  const [stats, setStats] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedShowtimeId, setSelectedShowtimeId] = useState('');
  const [currentShowtime, setCurrentShowtime] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Extract unique movie list from movies prop or showtimes
  const uniqueMovies = useMemo(() => {
    if (movies && movies.length > 0) return movies;
    const map = new Map();
    showtimes.forEach(st => {
      if (!map.has(st.movieId)) {
        map.set(st.movieId, {
          _id: st.movieId,
          title: st.movieTitle,
          language: st.language,
          hallType: st.hallType
        });
      }
    });
    return Array.from(map.values());
  }, [movies, showtimes]);

  // Default first movie on load
  useEffect(() => {
    if (uniqueMovies.length > 0 && !selectedMovieId) {
      setSelectedMovieId(String(uniqueMovies[0]._id));
    }
  }, [uniqueMovies, selectedMovieId]);

  // Timings for the currently selected movie
  const movieShowtimes = useMemo(() => {
    if (!selectedMovieId) return [];
    return showtimes.filter(st => String(st.movieId) === String(selectedMovieId));
  }, [showtimes, selectedMovieId]);

  // Auto-select first showtime when movie changes if current selection doesn't belong to this movie
  useEffect(() => {
    if (movieShowtimes.length > 0) {
      const stillValid = movieShowtimes.some(st => String(st._id) === String(selectedShowtimeId));
      if (!stillValid) {
        setSelectedShowtimeId(String(movieShowtimes[0]._id));
      }
    } else {
      setSelectedShowtimeId('');
      setCurrentShowtime(null);
    }
  }, [selectedMovieId, movieShowtimes]);

  // Load stats
  useEffect(() => {
    loadStats();
  }, []);

  // Fetch full details of the active showtime
  useEffect(() => {
    if (selectedShowtimeId) {
      loadShowtimeDetails(selectedShowtimeId);
    }
  }, [selectedShowtimeId]);

  const loadStats = async () => {
    try {
      const res = await getStats();
      if (res.success) setStats(res.data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const loadShowtimeDetails = async (id) => {
    try {
      const res = await getShowtimeById(id);
      if (res.success) setCurrentShowtime(res.data);
    } catch (err) {
      console.error('Showtime detail error:', err);
    }
  };

  const handleToggleSeat = async (seat) => {
    if (!currentShowtime) return;
    setIsUpdating(true);
    setActionNotice('');

    try {
      const newStatus = seat.status === 'occupied' ? 'available' : 'occupied';
      const res = await toggleSeatStatus(currentShowtime._id, seat.id, newStatus);
      if (res.success) {
        setActionNotice(`Seat ${seat.id} marked as ${newStatus.toUpperCase()}`);
        setCurrentShowtime(prev => ({
          ...prev,
          seats: prev.seats.map(s => s.id === seat.id ? { ...s, status: newStatus } : s)
        }));
        loadStats();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      alert('Error updating seat: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const rows = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];

  // Calculate current showtime stats
  const activeTotalSeats = currentShowtime?.seats?.length || 0;
  const activeOccupied = currentShowtime?.seats?.filter(s => s.status === 'occupied').length || 0;
  const activeAvailable = activeTotalSeats - activeOccupied;
  const activeOccupancyPct = Math.round((activeOccupied / (activeTotalSeats || 1)) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-display font-black text-2xl text-slate-900 tracking-tight">
            Box Office Controller
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a movie on the left, pick a screen timing on the right, and manage real-time seat occupancy.
          </p>
        </div>

        <button
          onClick={() => { loadStats(); if (selectedShowtimeId) loadShowtimeDetails(selectedShowtimeId); }}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stats</span>
        </button>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Screenings</span>
          <p className="font-display font-black text-xl text-slate-900 mt-0.5">{stats?.showtimesCount || showtimes.length}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Seats Booked</span>
          <p className="font-display font-black text-xl text-slate-900 mt-0.5">{stats?.totalSeatsOccupied || 0}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Reservations</span>
          <p className="font-display font-black text-xl text-slate-900 mt-0.5">{stats?.bookingsCount || 0}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Est. Revenue</span>
          <p className="font-display font-black text-xl text-theatre-600 mt-0.5">₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString('en-IN') : '0'}</p>
        </div>
      </div>

      {/* TWO-COLUMN BUBBLE SELECTION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Movie Selection Bubbles */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-theatre-600" />
              1. Select Movie
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {uniqueMovies.length} Titles
            </span>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {uniqueMovies.map((movie) => {
              const isSelected = String(movie._id) === String(selectedMovieId);
              const count = showtimes.filter(s => String(s.movieId) === String(movie._id)).length;

              return (
                <button
                  key={movie._id}
                  onClick={() => setSelectedMovieId(String(movie._id))}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between gap-3 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-9 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs truncate leading-snug">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] mt-0.5 opacity-80">
                        <span>{movie.language || 'Hindi / Tamil'}</span>
                        {movie.cbfcCertificate && (
                          <>
                            <span>•</span>
                            <span className="font-extrabold">{movie.cbfcCertificate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}>
                      {count} {count === 1 ? 'Show' : 'Shows'}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Screen & Timings Bubbles */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-theatre-600" />
              2. Select Screen & Timing
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {movieShowtimes.length} Screenings
            </span>
          </div>

          {movieShowtimes.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic">
              No scheduled showtimes found for this title.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {movieShowtimes.map((st) => {
                const isSelected = String(st._id) === String(selectedShowtimeId);
                const occupiedCount = st.seats?.filter(s => s.status === 'occupied').length || 0;
                const total = st.seats?.length || 96;
                const available = total - occupiedCount;

                return (
                  <button
                    key={st._id}
                    onClick={() => setSelectedShowtimeId(String(st._id))}
                    className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-theatre-600 text-white border-theatre-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-theatre-50/50 hover:border-theatre-200 text-slate-800 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-display font-black text-sm">
                        {st.time}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {st.format}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-[10px]">
                      <p className={`font-semibold truncate ${isSelected ? 'text-theatre-100' : 'text-slate-600'}`}>
                        {st.hallName.split(' - ')[0] || st.hallName}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-black/5">
                        <span className={`font-medium ${isSelected ? 'text-theatre-100' : 'text-slate-400'}`}>
                          {st.date}
                        </span>
                        <span className={`font-bold ${isSelected ? 'text-white' : available < 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {available} seats open
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* SEAT CONTROLLER SECTION (Appears when timing is selected) */}
      {currentShowtime && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-2xs space-y-5 animate-slide-up">
          
          {/* Header of Active Screening */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-black uppercase text-theatre-600">
                  {currentShowtime.hallName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-700">
                  {currentShowtime.date} at {currentShowtime.time}
                </span>
              </div>
              <h3 className="font-display font-black text-lg text-slate-900">
                {currentShowtime.movieTitle}
              </h3>
            </div>

            {/* Quick Occupancy Badges & Action Notice */}
            <div className="flex flex-wrap items-center gap-3">
              {actionNotice && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{actionNotice}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-500">Live Status:</span>
                <span className="font-bold text-emerald-600">{activeAvailable} Open</span>
                <span>/</span>
                <span className="font-bold text-theatre-600">{activeOccupied} Occupied ({activeOccupancyPct}%)</span>
              </div>
            </div>
          </div>

          {/* Controller Hint & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span className="italic">
              💡 Click any seat on the grid to toggle <strong>Available ⇄ Occupied</strong> for counter walk-ins.
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-slate-50 border border-slate-300 rounded-xs"></span> Available</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-theatre-600 rounded-xs"></span> Occupied (Walk-in)</span>
            </div>
          </div>

          {/* Curved Screen Visualizer */}
          <div className="theatre-screen-curve w-1/2 max-w-xs mx-auto mb-4 opacity-70"></div>

          {/* Interactive Seating Matrix */}
          <div className="space-y-2 max-w-lg mx-auto overflow-x-auto pb-3">
            {rows.map(r => {
              const rowSeats = (currentShowtime.seats || []).filter(s => s.row === r).sort((a,b) => a.number - b.number);

              return (
                <div key={r} className="flex items-center justify-center gap-1.5 min-w-[420px]">
                  <span className="w-4 text-center text-xs font-bold text-slate-300 select-none">{r}</span>
                  
                  {/* Left wing (1-3) */}
                  <div className="flex items-center gap-1">
                    {rowSeats.slice(0, 3).map(seat => (
                      <StaffSeatButton
                        key={seat.id}
                        seat={seat}
                        isUpdating={isUpdating}
                        onClick={() => handleToggleSeat(seat)}
                      />
                    ))}
                  </div>

                  <div className="w-3 text-center text-slate-200 text-xs select-none">•</div>

                  {/* Center Prime (4-9) */}
                  <div className="flex items-center gap-1">
                    {rowSeats.slice(3, 9).map(seat => (
                      <StaffSeatButton
                        key={seat.id}
                        seat={seat}
                        isUpdating={isUpdating}
                        onClick={() => handleToggleSeat(seat)}
                      />
                    ))}
                  </div>

                  <div className="w-3 text-center text-slate-200 text-xs select-none">•</div>

                  {/* Right wing (10-12) */}
                  <div className="flex items-center gap-1">
                    {rowSeats.slice(9, 12).map(seat => (
                      <StaffSeatButton
                        key={seat.id}
                        seat={seat}
                        isUpdating={isUpdating}
                        onClick={() => handleToggleSeat(seat)}
                      />
                    ))}
                  </div>

                  <span className="w-4 text-center text-xs font-bold text-slate-300 select-none">{r}</span>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}

function StaffSeatButton({ seat, isUpdating, onClick }) {
  const isOccupied = seat.status === 'occupied';

  return (
    <button
      disabled={isUpdating}
      onClick={onClick}
      className={`w-6 h-6 rounded text-[9px] font-bold transition-all flex items-center justify-center ${
        isOccupied
          ? 'bg-theatre-600 text-white shadow-2xs hover:bg-theatre-700'
          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-theatre-500 hover:bg-theatre-50'
      }`}
      title={`Seat ${seat.id} (${seat.tier}) - ₹${seat.price}: Click to toggle`}
    >
      {isOccupied ? '✕' : seat.number}
    </button>
  );
}
