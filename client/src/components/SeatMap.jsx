import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  Info, 
  Ticket, 
  Armchair, 
  Accessibility, 
  ChevronRight, 
  Clock, 
  RotateCcw,
  IndianRupee,
  ChevronLeft
} from 'lucide-react';

export default function SeatMap({
  showtime,
  movie,
  allShowtimes = [],
  onSelectShowtime,
  onBackToShows,
  selectedSeats = [],
  setSelectedSeats,
  onProceedToBooking
}) {
  const [hoveredSeat, setHoveredSeat] = useState(null);

  if (!showtime) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 space-y-3">
        <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="font-display font-bold text-lg text-slate-800">No Screening Selected</h3>
        <p className="text-xs text-slate-500">Please select a movie to view seat availability.</p>
        {onBackToShows && (
          <button
            onClick={onBackToShows}
            className="px-4 py-2 bg-theatre-600 text-white font-bold rounded-xl text-xs"
          >
            ← Back to Shows
          </button>
        )}
      </div>
    );
  }

  // Rows from Back (Recliner VIP) to Front (Screen)
  const rows = ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
  
  const seatsByRow = useMemo(() => {
    const map = {};
    rows.forEach(r => map[r] = []);
    if (showtime.seats) {
      showtime.seats.forEach(s => {
        if (!map[s.row]) map[s.row] = [];
        map[s.row].push(s);
      });
      Object.keys(map).forEach(r => {
        map[r].sort((a, b) => a.number - b.number);
      });
    }
    return map;
  }, [showtime]);

  const totalSeats = showtime.seats?.length || 0;
  const occupiedCount = showtime.seats?.filter(s => s.status === 'occupied').length || 0;
  const availableCount = totalSeats - occupiedCount;

  const handleSeatClick = (seat) => {
    if (seat.status === 'occupied' || seat.status === 'maintenance') return;

    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id || s.seatId === seat.id);

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter(s => (s.id || s.seatId) !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum 8 seats allowed per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, {
        seatId: seat.id,
        id: seat.id,
        row: seat.row,
        number: seat.number,
        tier: seat.tier,
        price: seat.price
      }]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);

  const relatedShowtimes = allShowtimes.filter(s => 
    s.movieId === showtime.movieId && s.date === showtime.date
  );

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToShows}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Shows</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="text-slate-700 font-semibold">{showtime.movieTitle}</span>
          <span>•</span>
          <span className="text-theatre-600 font-bold">{showtime.hallName.split(' - ')[0] || showtime.hallName} ({showtime.time})</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase text-theatre-600">
              {showtime.hallName}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {availableCount} seats left
            </span>
          </div>
          <h2 className="font-display font-black text-xl text-slate-900 leading-tight">
            {showtime.movieTitle}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{showtime.date}</span>
            <span>•</span>
            <span className="font-bold text-slate-700">{showtime.time}</span>
            <span>•</span>
            <span>{showtime.language}</span>
          </div>
        </div>

        {/* Showtime Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {relatedShowtimes.map((st) => (
            <button
              key={st._id}
              onClick={() => onSelectShowtime(movie, st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                st._id === showtime._id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.time}
            </button>
          ))}
        </div>
      </div>

      {/* Main Seat Visualizer & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Minimal Auditorium Grid */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 overflow-hidden">
          
          {/* Curved Cinema Screen */}
          <div className="mb-10 flex flex-col items-center">
            <div className="theatre-screen-curve w-3/4 max-w-sm mb-1.5 opacity-80"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              SCREEN
            </span>
          </div>

          {/* Seat Layout */}
          <div className="space-y-3 max-w-xl mx-auto overflow-x-auto pb-2">
            {rows.map((rowLetter) => {
              const rowSeats = seatsByRow[rowLetter] || [];

              return (
                <div key={rowLetter} className="flex items-center justify-center gap-2 min-w-[480px]">
                  <span className="w-5 text-center text-xs font-bold text-slate-300 select-none">{rowLetter}</span>

                  <div className="flex items-center gap-1.5">
                    {rowSeats.slice(0, 3).map((seat) => (
                      <SeatTile
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.some(s => (s.id || s.seatId) === seat.id)}
                        onClick={() => handleSeatClick(seat)}
                        onHover={() => setHoveredSeat(seat)}
                        onLeave={() => setHoveredSeat(null)}
                      />
                    ))}
                  </div>

                  <div className="w-4 text-center text-slate-200 text-xs select-none">•</div>

                  <div className="flex items-center gap-1.5">
                    {rowSeats.slice(3, 9).map((seat) => (
                      <SeatTile
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.some(s => (s.id || s.seatId) === seat.id)}
                        onClick={() => handleSeatClick(seat)}
                        onHover={() => setHoveredSeat(seat)}
                        onLeave={() => setHoveredSeat(null)}
                      />
                    ))}
                  </div>

                  <div className="w-4 text-center text-slate-200 text-xs select-none">•</div>

                  <div className="flex items-center gap-1.5">
                    {rowSeats.slice(9, 12).map((seat) => (
                      <SeatTile
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.some(s => (s.id || s.seatId) === seat.id)}
                        onClick={() => handleSeatClick(seat)}
                        onHover={() => setHoveredSeat(seat)}
                        onLeave={() => setHoveredSeat(null)}
                      />
                    ))}
                  </div>

                  <span className="w-5 text-center text-xs font-bold text-slate-300 select-none">{rowLetter}</span>
                </div>
              );
            })}
          </div>

          {/* Hover indicator */}
          <div className="h-5 mt-3 text-center">
            {hoveredSeat ? (
              <span className="text-xs font-bold text-slate-700">
                Seat {hoveredSeat.id} • {hoveredSeat.tier} • <span className="text-theatre-600">₹{hoveredSeat.price}</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400">Select seats to continue</span>
            )}
          </div>

          {/* Minimal Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-slate-50 border border-slate-200"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-theatre-600 text-white flex items-center justify-center text-[10px]">✓</div>
              <span className="text-slate-800 font-bold">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">✕</div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-amber-50 border border-amber-400 text-amber-800 flex items-center justify-center text-[10px]">★</div>
              <span>Recliner (₹{showtime.pricing?.ReclinerVIP || 420})</span>
            </div>
          </div>

        </div>

        {/* Right Column: Minimalist Reservation Summary */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Booking ({selectedSeats.length} seats)
            </h3>
            {selectedSeats.length > 0 && (
              <button
                onClick={() => setSelectedSeats([])}
                className="text-xs text-slate-400 hover:text-theatre-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Selected Seat tags */}
          {selectedSeats.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Click seats on the map to add them</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {selectedSeats.map(s => (
                <span
                  key={s.id || s.seatId}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  {s.row}-{s.number} <span className="text-theatre-600 font-normal">₹{s.price}</span>
                </span>
              ))}
            </div>
          )}

          {/* Pricing breakdown */}
          {selectedSeats.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Tickets:</span>
                <span className="font-bold text-slate-900">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-100">
                <span>Total Due at Counter:</span>
                <span className="text-theatre-600 font-black">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Minimalist CTA */}
          <button
            disabled={selectedSeats.length === 0}
            onClick={onProceedToBooking}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              selectedSeats.length > 0
                ? 'bg-theatre-600 hover:bg-theatre-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Proceed to Reserve (Pay at Counter)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

function SeatTile({ seat, isSelected, onClick, onHover, onLeave }) {
  const isOccupied = seat.status === 'occupied' || seat.status === 'maintenance';
  const isVIP = seat.tier === 'Recliner VIP' || seat.tier === 'VIP';
  const isAccessible = seat.isAccessible;

  let btnClass = "w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold transition-all select-none ";

  if (isOccupied) {
    btnClass += "bg-slate-100 text-slate-300 cursor-not-allowed";
  } else if (isSelected) {
    btnClass += "bg-theatre-600 text-white shadow-xs scale-105";
  } else if (isVIP) {
    btnClass += "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100";
  } else if (isAccessible) {
    btnClass += "bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100";
  } else {
    btnClass += "bg-slate-50 text-slate-700 border border-slate-200 hover:border-theatre-500 hover:bg-theatre-50";
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      disabled={isOccupied}
      className={btnClass}
      title={`Seat ${seat.id} (${seat.tier}) - ₹${seat.price}`}
    >
      {isSelected ? '✓' : isOccupied ? '✕' : seat.number}
    </button>
  );
}
