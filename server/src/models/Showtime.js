const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., 'F-7'
  row: { type: String, required: true }, // 'A' through 'H'
  number: { type: Number, required: true }, // 1 through 12
  tier: { type: String, enum: ['Classic', 'Prime', 'Recliner VIP', 'Accessible'], default: 'Classic' },
  price: { type: Number, required: true }, // INR
  status: { type: String, enum: ['available', 'occupied', 'reserved', 'maintenance'], default: 'available' },
  isAccessible: { type: Boolean, default: false }
}, { _id: false });

const showtimeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  movieTitle: { type: String, required: true },
  hallName: { type: String, required: true }, // e.g. "Audi 1 - IMAX 3D Laser"
  hallType: { type: String, enum: ['Audi 1 - IMAX 3D Laser', 'Audi 2 - Dolby Atmos 4K', 'Audi 3 - LUXE VIP Recliners'], default: 'Audi 1 - IMAX 3D Laser' },
  date: { type: String, required: true }, // 'YYYY-MM-DD' e.g. "2026-09-20"
  time: { type: String, required: true }, // e.g. "11:15 AM", "02:45 PM", "06:30 PM", "10:00 PM"
  format: { type: String, default: 'IMAX 3D' }, // '2D', '3D', 'IMAX 3D', 'Dolby Atmos', 'LUXE 2D'
  language: { type: String, default: 'Hindi (Dolby Atmos)' },
  seats: [seatSchema],
  pricing: {
    ReclinerVIP: { type: Number, default: 420 }, // INR
    Prime: { type: Number, default: 250 },        // INR
    Classic: { type: Number, default: 180 },      // INR
    Accessible: { type: Number, default: 150 }    // INR
  }
}, { timestamps: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
