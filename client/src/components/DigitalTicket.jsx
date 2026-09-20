import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  X, 
  Calendar, 
  Clock, 
  Film, 
  Sparkles, 
  QrCode,
  MapPin,
  Check
} from 'lucide-react';

export default function DigitalTicket({ booking, isOpen, onClose, onOpenLookup }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col animate-slide-up print:shadow-none print:border-none print:m-0 print:max-h-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-slate-950 via-theatre-950 to-slate-900 text-white p-5 text-center relative flex-shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Mayura Grand Cineplex • Admit Pass</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold mb-2">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed (Pay at Box Office)</span>
          </div>

          <h2 className="font-display font-black text-xl text-white tracking-tight leading-tight line-clamp-1">
            {booking.movieTitle}
          </h2>

          <p className="text-[11px] text-slate-300 mt-0.5 flex items-center justify-center gap-1.5 font-medium">
            <span className="font-bold text-amber-300">{booking.format || 'IMAX 3D'}</span>
            <span>•</span>
            <span>{booking.hallName}</span>
          </p>

          {/* Booking Reference Code Box */}
          <div className="mt-3 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/15 flex items-center justify-between gap-2">
            <div className="text-left">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Booking ID</span>
              <p className="font-mono font-black text-lg text-amber-300 tracking-widest leading-none mt-0.5">{booking.bookingCode}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white flex items-center gap-1 transition-colors print:hidden"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Realistic Ticket Perforated Divider */}
        <div className="relative h-5 bg-slate-100 flex items-center justify-between overflow-hidden border-y border-dashed border-slate-300 flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-slate-950 -ml-2.5"></div>
          <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
            • • • ADMIT TICKET • • •
          </div>
          <div className="w-5 h-5 rounded-full bg-slate-950 -mr-2.5"></div>
        </div>

        {/* Ticket Details Scrollable Body */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-white overflow-y-auto flex-1">
          
          {/* Showtime Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-bold text-[9px] block">Show Date</span>
              <p className="font-black text-slate-900 text-xs mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-theatre-600" /> {booking.date}
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-bold text-[9px] block">Showtime & Audi</span>
              <p className="font-black text-slate-900 text-xs mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-theatre-600" /> {booking.time}
              </p>
            </div>
          </div>

          {/* Reserved Seats List */}
          <div className="p-3 bg-theatre-50/70 rounded-xl border border-theatre-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-theatre-900">
                Reserved Seats ({booking.seats?.length})
              </span>
              <span className="text-xs font-black text-theatre-700">
                ₹{booking.ticketsAmount?.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {booking.seats?.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-theatre-200 text-theatre-800 text-[11px] font-black"
                >
                  {s.row}-{s.number}
                </span>
              ))}
            </div>
          </div>

          {/* Concessions list if any */}
          {booking.concessions && booking.concessions.length > 0 && (
            <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                Snack Bar Add-ons
              </span>
              <div className="space-y-0.5 text-[11px]">
                {booking.concessions.map((c, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>{c.emoji} {c.quantity}x {c.name}</span>
                    <span className="font-bold text-slate-900">₹{((c.price || 0) * (c.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Amount Due at Counter */}
          <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Total Cash / UPI Due</span>
              <p className="text-[11px] text-amber-300 font-semibold">Pay at Box Office Counter</p>
            </div>
            <p className="font-display font-black text-xl text-amber-300">
              ₹{booking.totalAmount?.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Guest name & instructions */}
          <div className="text-[11px] text-slate-500 text-center space-y-0.5">
            <p>Patron: <strong className="text-slate-800">{booking.customerName}</strong> ({booking.customerPhone})</p>
            <p className="text-[10px] text-slate-400">
              💡 Arrive 15 mins before showtime. Pay via Cash, GPay, PhonePe, Paytm, or Card at Counter #1–4.
            </p>
          </div>

          {/* QR Code visual */}
          <div className="flex flex-col items-center justify-center text-center pt-1">
            <div className="p-2 bg-white border border-slate-200 rounded-xl shadow-xs inline-block">
              <div className="w-20 h-20 bg-slate-900 p-1.5 rounded-lg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-white" />
              </div>
            </div>
            <p className="font-mono text-[9px] tracking-widest text-slate-400 mt-1">
              *MAYURA-{booking.bookingCode}*
            </p>
          </div>

        </div>

        {/* Action Buttons Sticky Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2 flex-shrink-0 print:hidden">
          <button
            onClick={handlePrint}
            className="py-2 px-3 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-theatre-600" />
            <span>Print Pass</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 px-3 rounded-xl bg-theatre-600 hover:bg-theatre-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all"
          >
            <span>Done</span>
          </button>
        </div>

      </div>
    </div>
  );
}
