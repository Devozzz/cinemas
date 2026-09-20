const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingCode: { type: String, required: true, unique: true }, // e.g. "LUM-94821"
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  movieTitle: { type: String, required: true },
  moviePoster: { type: String },
  hallName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  format: { type: String, default: 'IMAX 3D' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  specialRequests: { type: String, default: '' },
  seats: [{
    seatId: { type: String, required: true },
    row: { type: String, required: true },
    number: { type: Number, required: true },
    tier: { type: String, required: true },
    price: { type: Number, required: true } // in INR
  }],
  concessions: [{
    id: { type: String },
    name: { type: String },
    price: { type: Number }, // in INR
    quantity: { type: Number },
    emoji: { type: String }
  }],
  currency: { type: String, default: 'INR' },
  ticketsAmount: { type: Number, required: true },
  concessionsAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash / UPI at Box Office Counter' },
  paymentNotes: { type: String, default: 'Pay at the Box Office with Cash, GPay, PhonePe, Paytm or Card upon arrival' },
  status: { 
    type: String, 
    enum: ['Confirmed (Pay at Box Office)', 'Checked-In / Paid', 'Cancelled'],
    default: 'Confirmed (Pay at Box Office)'
  },
  cbfcCertificate: { type: String, default: 'UA' },
  qrData: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
