const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String },
  category: { type: String, enum: ['Movie', 'Theatre Play', 'Musical', 'Regional Special'], default: 'Movie' },
  genre: [{ type: String }],
  duration: { type: String, required: true }, // e.g. "2h 45m"
  rating: { type: Number, default: 4.8 }, // e.g. 4.9
  ageRating: { type: String, enum: ['U', 'UA 13+', 'UA 16+', 'A'], default: 'UA 13+' },
  cbfcCertificate: { type: String, default: 'CBFC: UA' },
  language: { type: String, default: 'Hindi (Dolby Atmos)' }, // e.g. "Tamil (Eng Sub)", "Telugu (3D)", "Hindi"
  languagesAvailable: [{ type: String }],
  director: { type: String },
  cast: [{ type: String }],
  synopsis: { type: String, required: true },
  posterUrl: { type: String, required: true },
  backdropUrl: { type: String, required: true },
  trailerUrl: { type: String },
  hallType: { type: String, default: 'Audi 1 - IMAX 3D Laser' },
  featured: { type: Boolean, default: false },
  nowPlaying: { type: Boolean, default: true },
  badge: { type: String }, // e.g. "Blockbuster #1", "All India Release", "Housefull Trend"
  ticketPriceBase: { type: Number, default: 180 }, // INR
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
