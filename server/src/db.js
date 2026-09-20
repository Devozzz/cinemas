const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');
const Concession = require('./models/Concession');
const { sampleMovies, sampleConcessions, generateSeedShowtimes, sampleSeedBookings } = require('./data/seedData');

let isConnectedToMongo = false;

// In-memory store fallback if MongoDB isn't running locally
const memStore = {
  movies: JSON.parse(JSON.stringify(sampleMovies)),
  showtimes: generateSeedShowtimes(),
  bookings: JSON.parse(JSON.stringify(sampleSeedBookings)),
  concessions: JSON.parse(JSON.stringify(sampleConcessions))
};

async function initDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grand_lumina_theatre';
  
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnectedToMongo = true;
    console.log('✨ Connected successfully to MongoDB:', MONGO_URI);

    // Auto-seed database if empty
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('🌱 Seeding MongoDB with Indian Theatre dataset...');
      await Movie.insertMany(sampleMovies);
      await Concession.insertMany(sampleConcessions);
      const generatedShowtimes = generateSeedShowtimes();
      await Showtime.insertMany(generatedShowtimes);
      await Booking.insertMany(sampleSeedBookings);
      console.log('✅ Seeding complete!');
    }
  } catch (err) {
    console.log('ℹ️ Running with Indian Theatre in-memory resilient data engine.');
    console.log('⚡ All Indian Cinema Shows, Real-time Audi Seat Map, INR In-Person Bookings, and Lookup active!');
    isConnectedToMongo = false;
  }
}

// Unified Repository Service
const dbService = {
  isConnected: () => isConnectedToMongo,

  // MOVIES
  async getMovies(query = {}) {
    if (isConnectedToMongo) {
      let filter = {};
      if (query.category && query.category !== 'All') filter.category = query.category;
      if (query.hallType && query.hallType !== 'All') filter.hallType = query.hallType;
      if (query.language && query.language !== 'All') {
        filter.$or = [
          { language: { $regex: query.language, $options: 'i' } },
          { languagesAvailable: { $in: [query.language] } }
        ];
      }
      if (query.search) {
        filter.$or = [
          { title: { $regex: query.search, $options: 'i' } },
          { genre: { $regex: query.search, $options: 'i' } },
          { cast: { $regex: query.search, $options: 'i' } },
          { director: { $regex: query.search, $options: 'i' } }
        ];
      }
      return await Movie.find(filter).sort({ featured: -1, rating: -1 });
    } else {
      let list = [...memStore.movies];
      if (query.category && query.category !== 'All') {
        list = list.filter(m => m.category === query.category);
      }
      if (query.hallType && query.hallType !== 'All') {
        list = list.filter(m => m.hallType === query.hallType);
      }
      if (query.language && query.language !== 'All') {
        const langLower = query.language.toLowerCase();
        list = list.filter(m => 
          m.language.toLowerCase().includes(langLower) ||
          (m.languagesAvailable && m.languagesAvailable.some(l => l.toLowerCase() === langLower))
        );
      }
      if (query.search) {
        const q = query.search.toLowerCase();
        list = list.filter(m => 
          m.title.toLowerCase().includes(q) || 
          m.genre.some(g => g.toLowerCase().includes(q)) ||
          (m.cast && m.cast.some(c => c.toLowerCase().includes(q))) ||
          (m.director && m.director.toLowerCase().includes(q))
        );
      }
      return list;
    }
  },

  async getMovieById(id) {
    if (isConnectedToMongo) {
      return await Movie.findById(id);
    } else {
      return memStore.movies.find(m => String(m._id) === String(id)) || null;
    }
  },

  // SHOWTIMES
  async getShowtimes(query = {}) {
    if (isConnectedToMongo) {
      let filter = {};
      if (query.date) filter.date = query.date;
      if (query.movieId) filter.movieId = query.movieId;
      if (query.hallType && query.hallType !== 'All') filter.hallType = query.hallType;
      return await Showtime.find(filter).sort({ time: 1 });
    } else {
      let list = [...memStore.showtimes];
      if (query.date) list = list.filter(s => s.date === query.date);
      if (query.movieId) list = list.filter(s => String(s.movieId) === String(query.movieId));
      if (query.hallType && query.hallType !== 'All') list = list.filter(s => s.hallType === query.hallType);
      return list;
    }
  },

  async getShowtimeById(id) {
    if (isConnectedToMongo) {
      return await Showtime.findById(id);
    } else {
      return memStore.showtimes.find(s => String(s._id) === String(id)) || null;
    }
  },

  // SEAT OCCUPATION & BOOKINGS
  async createBooking(bookingData) {
    const { showtimeId, seats: selectedSeats, customerName, customerPhone, customerEmail, concessions = [], specialRequests = '' } = bookingData;

    let showtime = await this.getShowtimeById(showtimeId);
    if (!showtime) {
      throw new Error('Showtime not found');
    }

    const seatIds = selectedSeats.map(s => s.seatId || s.id);
    const occupiedAlready = showtime.seats.filter(s => seatIds.includes(s.id) && s.status === 'occupied');
    if (occupiedAlready.length > 0) {
      throw new Error(`Seats already reserved: ${occupiedAlready.map(s => s.id).join(', ')}`);
    }

    // Generate unique reference code LUM-XXXXX
    const randomCode = 'LUM-' + Math.floor(10000 + Math.random() * 90000);

    // Calculate amounts in INR
    const ticketsAmount = selectedSeats.reduce((sum, s) => sum + (Number(s.price) || 180), 0);
    const concessionsAmount = concessions.reduce((sum, c) => sum + ((Number(c.price) || 0) * (Number(c.quantity) || 1)), 0);
    const totalAmount = ticketsAmount + concessionsAmount;

    if (isConnectedToMongo) {
      await Showtime.updateOne(
        { _id: showtimeId },
        { 
          $set: { 
            "seats.$[elem].status": "occupied" 
          } 
        },
        { 
          arrayFilters: [{ "elem.id": { $in: seatIds } }] 
        }
      );

      const newBooking = new Booking({
        bookingCode: randomCode,
        showtimeId: showtime._id,
        movieId: showtime.movieId,
        movieTitle: showtime.movieTitle,
        hallName: showtime.hallName,
        date: showtime.date,
        time: showtime.time,
        format: showtime.format,
        customerName,
        customerPhone,
        customerEmail,
        specialRequests,
        seats: selectedSeats.map(s => ({
          seatId: s.seatId || s.id,
          row: s.row,
          number: s.number,
          tier: s.tier,
          price: s.price
        })),
        concessions,
        currency: 'INR',
        ticketsAmount,
        concessionsAmount,
        totalAmount,
        paymentMethod: 'Cash / UPI at Box Office Counter',
        paymentNotes: 'Payment will be collected via Cash, UPI (GPay, PhonePe, Paytm) or Card upon arrival at the Theatre Box Office',
        status: 'Confirmed (Pay at Box Office)',
        qrData: `LUMINA-${randomCode}-${seatIds.join('')}-INR${totalAmount}`
      });

      return await newBooking.save();
    } else {
      showtime.seats.forEach(s => {
        if (seatIds.includes(s.id)) {
          s.status = 'occupied';
        }
      });

      const newBooking = {
        _id: '66e00000000000000000' + Math.floor(1000 + Math.random() * 9000),
        bookingCode: randomCode,
        showtimeId: showtime._id,
        movieId: showtime.movieId,
        movieTitle: showtime.movieTitle,
        hallName: showtime.hallName,
        date: showtime.date,
        time: showtime.time,
        format: showtime.format,
        customerName,
        customerPhone,
        customerEmail,
        specialRequests,
        seats: selectedSeats.map(s => ({
          seatId: s.seatId || s.id,
          row: s.row,
          number: s.number,
          tier: s.tier,
          price: s.price
        })),
        concessions,
        currency: 'INR',
        ticketsAmount,
        concessionsAmount,
        totalAmount,
        paymentMethod: 'Cash / UPI at Box Office Counter',
        paymentNotes: 'Payment will be collected via Cash, UPI (GPay, PhonePe, Paytm) or Card upon arrival at the Theatre Box Office',
        status: 'Confirmed (Pay at Box Office)',
        qrData: `LUMINA-${randomCode}-${seatIds.join('')}-INR${totalAmount}`,
        createdAt: new Date().toISOString()
      };

      memStore.bookings.unshift(newBooking);
      return newBooking;
    }
  },

  // LOOKUP BOOKING
  async lookupBooking(idOrCodeOrPhone) {
    const q = idOrCodeOrPhone.trim();
    if (isConnectedToMongo) {
      return await Booking.find({
        $or: [
          { bookingCode: { $regex: `^${q}$`, $options: 'i' } },
          { customerPhone: { $regex: q, $options: 'i' } },
          { customerEmail: { $regex: `^${q}$`, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 });
    } else {
      const qLower = q.toLowerCase();
      const qDigits = q.replace(/[^0-9]/g, '');
      return memStore.bookings.filter(b => 
        b.bookingCode.toLowerCase() === qLower ||
        (qDigits && b.customerPhone.replace(/[^0-9]/g, '').includes(qDigits)) ||
        b.customerEmail.toLowerCase() === qLower
      );
    }
  },

  // CANCEL RESERVATION
  async cancelBooking(bookingIdOrCode) {
    let booking;
    if (isConnectedToMongo) {
      booking = await Booking.findOne({
        $or: [{ _id: bookingIdOrCode }, { bookingCode: bookingIdOrCode }]
      });
      if (!booking) throw new Error('Booking not found');

      booking.status = 'Cancelled';
      await booking.save();

      const seatIds = booking.seats.map(s => s.seatId);
      await Showtime.updateOne(
        { _id: booking.showtimeId },
        { 
          $set: { 
            "seats.$[elem].status": "available" 
          } 
        },
        { 
          arrayFilters: [{ "elem.id": { $in: seatIds } }] 
        }
      );

      return booking;
    } else {
      booking = memStore.bookings.find(b => 
        String(b._id) === String(bookingIdOrCode) || 
        b.bookingCode.toLowerCase() === bookingIdOrCode.toLowerCase()
      );
      if (!booking) throw new Error('Booking not found');

      booking.status = 'Cancelled';

      const showtime = memStore.showtimes.find(s => String(s._id) === String(booking.showtimeId));
      if (showtime) {
        const seatIds = booking.seats.map(s => s.seatId);
        showtime.seats.forEach(s => {
          if (seatIds.includes(s.id)) {
            s.status = 'available';
          }
        });
      }

      return booking;
    }
  },

  // STAFF / BOX OFFICE: TOGGLE SEAT STATUS
  async toggleSeatStatus(showtimeId, seatId, targetStatus) {
    if (isConnectedToMongo) {
      const showtime = await Showtime.findById(showtimeId);
      if (!showtime) throw new Error('Showtime not found');

      const seat = showtime.seats.find(s => s.id === seatId);
      if (!seat) throw new Error('Seat not found');

      const newStatus = targetStatus || (seat.status === 'occupied' ? 'available' : 'occupied');
      seat.status = newStatus;
      await showtime.save();
      return { showtimeId, seatId, status: newStatus };
    } else {
      const showtime = memStore.showtimes.find(s => String(s._id) === String(showtimeId));
      if (!showtime) throw new Error('Showtime not found');

      const seat = showtime.seats.find(s => s.id === seatId);
      if (!seat) throw new Error('Seat not found');

      const newStatus = targetStatus || (seat.status === 'occupied' ? 'available' : 'occupied');
      seat.status = newStatus;
      return { showtimeId, seatId, status: newStatus };
    }
  },

  // CONCESSIONS
  async getConcessions() {
    if (isConnectedToMongo) {
      return await Concession.find({}).sort({ popular: -1, price: 1 });
    } else {
      return memStore.concessions;
    }
  },

  // THEATRE STATS IN INR
  async getStats() {
    let moviesCount = 0;
    let showtimesCount = 0;
    let bookingsCount = 0;
    let totalSeatsOccupied = 0;
    let totalRevenue = 0;

    if (isConnectedToMongo) {
      moviesCount = await Movie.countDocuments();
      showtimesCount = await Showtime.countDocuments();
      const allBookings = await Booking.find({ status: { $ne: 'Cancelled' } });
      bookingsCount = allBookings.length;
      totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      
      const showtimes = await Showtime.find({});
      showtimes.forEach(st => {
        totalSeatsOccupied += st.seats.filter(s => s.status === 'occupied').length;
      });
    } else {
      moviesCount = memStore.movies.length;
      showtimesCount = memStore.showtimes.length;
      const validBookings = memStore.bookings.filter(b => b.status !== 'Cancelled');
      bookingsCount = validBookings.length;
      totalRevenue = validBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      memStore.showtimes.forEach(st => {
        totalSeatsOccupied += st.seats.filter(s => s.status === 'occupied').length;
      });
    }

    return {
      moviesCount,
      showtimesCount,
      bookingsCount,
      totalSeatsOccupied,
      currency: '₹ (INR)',
      totalRevenue: Math.round(totalRevenue),
      theatreHalls: 3,
      halls: [
        { name: "Audi 1 - IMAX 3D Laser", type: "IMAX 3D Laser", capacity: 96 },
        { name: "Audi 2 - Dolby Atmos 4K", type: "Dolby Atmos 4K", capacity: 96 },
        { name: "Audi 3 - LUXE VIP Recliners", type: "LUXE VIP Recliners", capacity: 96 }
      ]
    };
  }
};

module.exports = {
  initDB,
  dbService
};
