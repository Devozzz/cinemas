const express = require('express');
const router = express.Router();
const { dbService } = require('../db');
const { generateDates } = require('../data/seedData');

// GET Available Dates
router.get('/dates', (req, res) => {
  try {
    const dates = generateDates();
    res.json({ success: true, dates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Movies / Shows
router.get('/movies', async (req, res) => {
  try {
    const movies = await dbService.getMovies(req.query);
    res.json({ success: true, count: movies.length, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Single Movie
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await dbService.getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    // Also fetch upcoming showtimes for this movie
    const showtimes = await dbService.getShowtimes({ movieId: movie._id });
    res.json({ success: true, data: movie, showtimes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Showtimes with filtering
router.get('/showtimes', async (req, res) => {
  try {
    const showtimes = await dbService.getShowtimes(req.query);
    res.json({ success: true, count: showtimes.length, data: showtimes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Specific Showtime & Seat Map
router.get('/showtimes/:id', async (req, res) => {
  try {
    const showtime = await dbService.getShowtimeById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }
    
    // Compute seat occupancy stats
    const totalSeats = showtime.seats.length;
    const occupiedSeats = showtime.seats.filter(s => s.status === 'occupied').length;
    const availableSeats = totalSeats - occupiedSeats;
    
    res.json({ 
      success: true, 
      data: showtime,
      occupancy: {
        total: totalSeats,
        occupied: occupiedSeats,
        available: availableSeats,
        percentage: Math.round((occupiedSeats / totalSeats) * 100)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Create Booking (Cash on Arrival / In-Person Payment)
router.post('/bookings', async (req, res) => {
  try {
    const { showtimeId, seats, customerName, customerPhone, customerEmail, concessions, specialRequests } = req.body;

    if (!showtimeId || !seats || !seats.length) {
      return res.status(400).json({ success: false, message: 'Please select at least one seat.' });
    }

    if (!customerName || !customerPhone || !customerEmail) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, and email are required for ticket reservation.' });
    }

    const booking = await dbService.createBooking({
      showtimeId,
      seats,
      customerName,
      customerPhone,
      customerEmail,
      concessions: concessions || [],
      specialRequests: specialRequests || ''
    });

    res.status(201).json({
      success: true,
      message: 'Seats reserved successfully! Present booking code at the box office.',
      data: booking
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET Lookup Booking by Reference Code, Phone, or Email
router.get('/bookings/lookup', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter q is required.' });
    }

    const bookings = await dbService.lookupBooking(q);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE / POST Cancel Booking
router.post('/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await dbService.cancelBooking(req.params.id);
    res.json({ success: true, message: 'Booking cancelled and seats released.', data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST Staff / Box Office: Toggle Seat Status
router.post('/showtimes/:id/toggle-seat', async (req, res) => {
  try {
    const { seatId, status } = req.body;
    if (!seatId) {
      return res.status(400).json({ success: false, message: 'seatId is required' });
    }

    const result = await dbService.toggleSeatStatus(req.params.id, seatId, status);
    res.json({ success: true, message: `Seat ${seatId} updated.`, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET Concessions Menu
router.get('/concessions', async (req, res) => {
  try {
    const concessions = await dbService.getConcessions();
    res.json({ success: true, count: concessions.length, data: concessions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET Theatre Overview Stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await dbService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
