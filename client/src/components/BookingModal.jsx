import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Popcorn, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Sparkles, 
  Plus, 
  Minus, 
  Ticket, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  IndianRupee,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createBooking, getConcessions } from '../services/api';

export default function BookingModal({
  isOpen,
  onClose,
  showtime,
  movie,
  selectedSeats = [],
  onBookingSuccess
}) {
  const [step, setStep] = useState(1);
  const [concessionsList, setConcessionsList] = useState([]);
  const [selectedConcessions, setSelectedConcessions] = useState({});
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setErrorMessage('');
      getConcessions()
        .then(res => {
          if (res.success && res.data) setConcessionsList(res.data);
        })
        .catch(err => console.error('Concessions error:', err));
    }
  }, [isOpen]);

  if (!isOpen || !showtime) return null;

  // Pricing calculations in INR
  const ticketsTotal = selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  
  const concessionsTotal = Object.entries(selectedConcessions).reduce((sum, [id, qty]) => {
    const item = concessionsList.find(c => (c._id || c.name) === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const grandTotal = ticketsTotal + concessionsTotal;

  const handleConcessionChange = (id, delta) => {
    setSelectedConcessions(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage('');
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.customerEmail.trim()) {
      setErrorMessage('Please provide your Name, 10-digit Mobile Number, and Email Address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const finalConcessions = Object.entries(selectedConcessions).map(([id, qty]) => {
        const item = concessionsList.find(c => (c._id || c.name) === id);
        return {
          id,
          name: item?.name || id,
          price: item?.price || 0,
          quantity: qty,
          emoji: item?.emoji || '🍿'
        };
      });

      const payload = {
        showtimeId: showtime._id,
        seats: selectedSeats,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        specialRequests: formData.specialRequests,
        concessions: finalConcessions
      };

      const res = await createBooking(payload);

      if (res.success && res.data) {
        confetti({
          particleCount: 140,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#ef4444', '#f59e0b', '#fbbf24', '#ffffff']
        });

        onBookingSuccess(res.data);
      } else {
        setErrorMessage(res.message || 'Failed to complete booking. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error || err.message || 'Could not connect to cineplex booking server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-theatre-950 via-theatre-800 to-theatre-900 text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pay at Box Office • Cash & UPI Accepted</span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-white">
            {step === 1 ? 'Add Snacks & Review Tickets' : 'Patron Details & Confirmation'}
          </h2>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-theatre-100 mt-1.5">
            <span className="font-black text-amber-300">{showtime.movieTitle}</span>
            <span>•</span>
            <span>{showtime.hallName}</span>
            <span>•</span>
            <span>{showtime.date} at {showtime.time}</span>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-3">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-10 bg-amber-400' : 'w-4 bg-white/30'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-10 bg-amber-400' : 'w-4 bg-white/30'}`} />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: SNACKS & SEAT REVIEW */}
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Selected Seats Review */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-theatre-600" />
                    Selected Seats ({selectedSeats.length})
                  </h3>
                  <span className="text-xs font-black text-theatre-700">₹{ticketsTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {selectedSeats.map(s => (
                    <span 
                      key={s.id || s.seatId}
                      className="px-3 py-1 bg-white border border-slate-300 text-slate-800 font-bold rounded-xl text-xs shadow-xs"
                    >
                      Row {s.row}-{s.number} <span className="text-theatre-600 font-normal">({s.tier} • ₹{s.price})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Indian Snack Bar & Combos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
                    <Popcorn className="w-4 h-4 text-amber-500" />
                    Add Popcorn, Samosas & Beverages (Optional)
                  </h3>
                  <span className="text-xs text-slate-500 font-bold">Pay in cash / UPI at counter</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {concessionsList.slice(0, 4).map(item => {
                    const id = item._id || item.name;
                    const qty = selectedConcessions[id] || 0;

                    return (
                      <div
                        key={id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          qty > 0 
                            ? 'bg-amber-50/70 border-amber-300 shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.emoji || '🍿'}</span>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</h4>
                            <p className="text-xs font-black text-theatre-700">₹{item.price}</p>
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
                          <button
                            type="button"
                            onClick={() => handleConcessionChange(id, -1)}
                            disabled={qty === 0}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                              qty === 0 ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-xs font-black text-slate-900">{qty}</span>
                          <button
                            type="button"
                            onClick={() => handleConcessionChange(id, 1)}
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-slate-700 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total summary bar */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Estimated Amount Due at Counter:</span>
                  <p className="font-black text-2xl text-theatre-700 font-display">₹{grandTotal.toLocaleString('en-IN')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-theatre-600 hover:bg-theatre-700 text-white font-black rounded-2xl flex items-center gap-2 shadow-md shadow-theatre-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Continue to Patron Info</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: GUEST CONTACT & CASH / UPI CONFIRMATION */}
          {step === 2 && (
            <form onSubmit={handleConfirmReservation} className="space-y-6">
              
              {/* Payment Method Notice */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <strong className="font-bold text-emerald-950">Payment on Arrival (Cash, UPI - GPay / PhonePe / Paytm, or Card)</strong>
                  <p>
                    No payment is needed online right now. Your seats are blocked immediately. Present your Booking Code at the Mayura Cineplex Box Office 15 minutes before showtime.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Patron Full Name <span className="text-theatre-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="customerName"
                      required
                      placeholder="e.g. Aarav Sharma / Rajesh Kumar"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-theatre-500 focus:bg-white text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* Mobile Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Mobile Number (for SMS & Ticket Pass) <span className="text-theatre-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-theatre-500 focus:bg-white text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address (for E-Ticket) <span className="text-theatre-600">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="customerEmail"
                        required
                        placeholder="e.g. aarav.sharma@example.in"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-theatre-500 focus:bg-white text-slate-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Special Requests / Wheelchair Note (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <textarea
                      name="specialRequests"
                      rows="2"
                      placeholder="Wheelchair assistance, Audi entry guidance, celebratory greetings..."
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-theatre-500 focus:bg-white text-slate-900 resize-none font-medium"
                    ></textarea>
                  </div>
                </div>

              </div>

              {/* Order Summary breakdown in INR */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Tickets ({selectedSeats.length} seats)</span>
                  <span className="font-bold text-slate-900">₹{ticketsTotal.toLocaleString('en-IN')}</span>
                </div>
                {concessionsTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Snacks & Refreshments</span>
                    <span className="font-bold text-slate-900">₹{concessionsTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Convenience Fee:</span>
                  <span>₹0.00 (Waived)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm">
                  <span className="font-black text-slate-900">Total Cash / UPI Due at Box Office:</span>
                  <span className="font-black text-lg text-theatre-700 font-display">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="px-5 py-3 rounded-2xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 text-xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-theatre-600 to-theatre-700 hover:from-theatre-700 hover:to-theatre-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-red-glow hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Locking Seats...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Confirm Reservation (Pay ₹ at Box Office)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
