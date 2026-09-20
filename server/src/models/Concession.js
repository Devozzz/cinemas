const mongoose = require('mongoose');

const concessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Popcorn', 'Combos', 'Beverages', 'Snacks', 'Desserts'], default: 'Snacks' },
  description: { type: String },
  price: { type: Number, required: true },
  calories: { type: String },
  image: { type: String },
  emoji: { type: String, default: '🍿' },
  popular: { type: Boolean, default: false },
  badge: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Concession', concessionSchema);
