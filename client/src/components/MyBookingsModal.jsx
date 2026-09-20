import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Ticket, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  Loader2,
  Sparkles,
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import { lookupBooking, cancelBooking } from '../services/api';

export default function MyBookingsModal({
  isOpen,
  onClose,
  onViewTicket
}) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cancelStatus, setCancelStatus] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setCancelStatus('');

    try {
      const res = await lookupBooking(query.trim());
      if (res.success) {
        setSearchResults(res.data || []);
      } else {
        setErrorMessage(res.message || 'Error looking up reservation.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'No booking found matching this code or 10-digit mobile number.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? The reserved seats will be released back to the auditorium immediately.')) {
      return;
    }

    try {
      const res = await cancelBooking(bookingId);
      if (res.success) {
        setCancelStatus('Booking cancelled successfully. Seats released back to the theatre.');
        setSearchResults(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b));
      }
    } catch (err) {
      alert('Failed to cancel reservation: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-theatre-950 via-theatre-800 to-theatre-900 text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 mb-1">
            <Ticket className="w-4 h-4" />
            <span>Ticket Lookup & Self-Service Desk</span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-white">
            Find Your Reservation
          </h2>
          <p className="text-xs text-theatre-200 mt-0.5">
            Enter your Booking Reference (e.g. LUM-84920) or 10-digit Mobile Number to view ticket or cancel.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Booking Code (LUM-XXXXX) or 10-digit Mobile..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-theatre-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-6 py-3 bg-theatre-600 hover:bg-theatre-700 disabled:bg-slate-200 text-white font-black text-sm rounded-2xl flex items-center gap-2 shadow-xs transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search</span>}
              </button>
            </div>

            {/* Quick Demo Search Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Quick demo shortcuts:</span>
              <button
                type="button"
                onClick={() => { setQuery('LUM-84920'); }}
                className="px-2.5 py-0.5 rounded-lg bg-theatre-50 text-theatre-700 font-black border border-theatre-200 hover:bg-theatre-100"
              >
                LUM-84920
              </button>
              <button
                type="button"
                onClick={() => { setQuery('98765'); }}
                className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              >
                Mobile (98765)
              </button>
            </div>
          </form>

          {/* Cancellation Alert */}
          {cancelStatus && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{cancelStatus}</span>
            </div>
          )}

          {/* Results List */}
          {searchResults && (
            <div className="space-y-4">
              <h3 className="font-display font-black text-sm text-slate-700 uppercase tracking-wider">
                Matching Bookings ({searchResults.length})
              </h3>

              {searchResults.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                  No reservations found for "{query}". Please check the booking reference or phone number.
                </div>
              ) : (
                searchResults.map(booking => {
                  const isCancelled = booking.status === 'Cancelled';

                  return (
                    <div
                      key={booking._id || booking.bookingCode}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCancelled
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 shadow-xs hover:border-theatre-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-black text-base text-theatre-700">
                              {booking.bookingCode}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isCancelled 
                                ? 'bg-rose-100 text-rose-700' 
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <h4 className="font-display font-black text-base text-slate-900">
                            {booking.movieTitle}
                          </h4>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-medium">Total Cash / UPI Due</span>
                          <p className="font-display font-black text-xl text-slate-900">
                            ₹{booking.totalAmount?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Info Row */}
                      <div className="py-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-bold block">Screen & Date</span>
                          <span className="font-semibold text-slate-800">{booking.date} at {booking.time}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-bold block">Reserved Seats</span>
                          <span className="font-black text-theatre-800">
                            {booking.seats?.map(s => `${s.row}-${s.number}`).join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-bold block">Patron</span>
                          <span className="font-medium text-slate-800">{booking.customerName}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(booking._id || booking.bookingCode)}
                            className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel Booking</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            onViewTicket(booking);
                            onClose();
                          }}
                          className="px-4 py-1.5 rounded-xl bg-theatre-600 hover:bg-theatre-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Digital Pass</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
