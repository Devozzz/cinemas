// Helper to build realistic seat matrix (8 rows: A-H, 12 seats each = 96 seats)
function generateSeatMatrix(pricing = { ReclinerVIP: 420, Prime: 250, Classic: 180, Accessible: 150 }, occupiedRatio = 0.35) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seats = [];

  rows.forEach(row => {
    let tier = 'Classic';
    let price = pricing.Classic;

    if (row === 'H') {
      tier = 'Recliner VIP';
      price = pricing.ReclinerVIP;
    } else if (['E', 'F', 'G'].includes(row)) {
      tier = 'Prime';
      price = pricing.Prime;
    }

    for (let num = 1; num <= 12; num++) {
      const isAccessible = (row === 'A' && [1, 2, 11, 12].includes(num));
      const seatTier = isAccessible ? 'Accessible' : tier;
      const seatPrice = isAccessible ? pricing.Accessible : price;

      // Realistic occupancy distribution in Indian cinemas (Prime and Recliners fill fastest)
      let occupiedThreshold = occupiedRatio;
      if (row === 'H') {
        occupiedThreshold += 0.25; // Recliners book quickly
      } else if (['E', 'F', 'G'].includes(row) && num >= 4 && num <= 9) {
        occupiedThreshold += 0.3; // Prime center sweet spot fills fast
      } else if (row === 'A') {
        occupiedThreshold -= 0.2; // Front row fills last
      }

      const isOccupied = Math.random() < Math.max(0.08, Math.min(0.88, occupiedThreshold));

      seats.push({
        id: `${row}-${num}`,
        row,
        number: num,
        tier: seatTier,
        price: seatPrice,
        status: isOccupied ? 'occupied' : 'available',
        isAccessible
      });
    }
  });

  return seats;
}

const sampleMovies = [
  {
    _id: "66e000000000000000000001",
    title: "Pushpa 2: The Rule",
    tagline: "Rule nahi, Raaj karega!",
    category: "Movie",
    genre: ["Action", "Crime", "Drama", "Thriller"],
    duration: "3h 15m",
    rating: 4.9,
    ageRating: "UA 16+",
    cbfcCertificate: "CBFC: UA 16+",
    language: "Telugu • Hindi • Tamil (Dolby Atmos)",
    languagesAvailable: ["Hindi", "Telugu", "Tamil", "Malayalam", "Kannada"],
    director: "Sukumar",
    cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil", "Sunil"],
    synopsis: "The clash between Pushpa Raj and SP Bhanwar Singh Shekhawat escalates into an all-out battle for supremacy across the national and international red sandalwood syndicate.",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/g3JUbgZXbno",
    hallType: "Audi 1 - IMAX 3D Laser",
    featured: true,
    nowPlaying: true,
    badge: "All-India #1 • Housefull Trend",
    ticketPriceBase: 250
  },
  {
    _id: "66e000000000000000000002",
    title: "Kalki 2898 AD (3D IMAX)",
    tagline: "The Future of Indian Cinema is Here.",
    category: "Movie",
    genre: ["Sci-Fi", "Mythology", "Action", "Epic"],
    duration: "3h 01m",
    rating: 4.9,
    ageRating: "UA 13+",
    cbfcCertificate: "CBFC: UA 13+",
    language: "Hindi • Telugu • Tamil (IMAX 3D Laser)",
    languagesAvailable: ["Hindi", "Telugu", "Tamil"],
    director: "Nag Ashwin",
    cast: ["Amitabh Bachchan", "Prabhas", "Deepika Padukone", "Kamal Haasan", "Disha Patani"],
    synopsis: "Set in a post-apocalyptic world in the year 2898 AD, the immortal Ashwatthama rises to protect the divine child of destiny against Supreme Yaskin's totalitarian complex.",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/kQDd1AhGIHk",
    hallType: "Audi 1 - IMAX 3D Laser",
    featured: true,
    nowPlaying: true,
    badge: "IMAX 3D Blockbuster",
    ticketPriceBase: 280
  },
  {
    _id: "66e000000000000000000003",
    title: "Stree 2: Sarkate Ka Aatank",
    tagline: "O Stree, Raksha Karna!",
    category: "Movie",
    genre: ["Comedy", "Horror", "Mystery"],
    duration: "2h 27m",
    rating: 4.8,
    ageRating: "UA 13+",
    cbfcCertificate: "CBFC: UA 13+",
    language: "Hindi (Dolby Atmos)",
    languagesAvailable: ["Hindi"],
    director: "Amar Kaushik",
    cast: ["Shraddha Kapoor", "Rajkummar Rao", "Pankaj Tripathi", "Abhishek Banerjee", "Aparshakti Khurana"],
    synopsis: "The town of Chanderi is haunted once again, this time by a terrifying headless monster known as Sarkata, forcing the beloved gang to team up with the enigmatic Stree.",
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/KVnheBRwvBQ",
    hallType: "Audi 2 - Dolby Atmos 4K",
    featured: true,
    nowPlaying: true,
    badge: "Superhit Comedy",
    ticketPriceBase: 220
  },
  {
    _id: "66e000000000000000000004",
    title: "GOAT: The Greatest of All Time",
    tagline: "A Venkat Prabhu Hero Spectacle.",
    category: "Movie",
    genre: ["Action", "Sci-Fi", "Espionage"],
    duration: "2h 59m",
    rating: 4.8,
    ageRating: "UA 13+",
    cbfcCertificate: "CBFC: UA 13+",
    language: "Tamil (Eng Subtitles) • Hindi • Telugu",
    languagesAvailable: ["Tamil", "Hindi", "Telugu"],
    director: "Venkat Prabhu",
    cast: ["Thalapathy Vijay", "Prashanth", "Prabhu Deva", "Sneha", "Mohan"],
    synopsis: "A seasoned elite anti-terrorist agent of the Special Anti-Terrorist Squad faces a blast from his buried past when a rogue operative with uncanny ties resurfaces with lethal technology.",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/Jx_eR0gD1pE",
    hallType: "Audi 2 - Dolby Atmos 4K",
    featured: false,
    nowPlaying: true,
    badge: "Kollywood Mega Premiere",
    ticketPriceBase: 250
  },
  {
    _id: "66e000000000000000000005",
    title: "Mughal-E-Azam: The Grand Musical Stage",
    tagline: "India's Biggest Broadway-Scale Theatrical Production.",
    category: "Theatre Play",
    genre: ["Musical", "Historical Drama", "Kathak Live"],
    duration: "2h 35m",
    rating: 5.0,
    ageRating: "U",
    cbfcCertificate: "CBFC: U (All Ages)",
    language: "Hindi & Urdu (Live Classical Orchestra)",
    languagesAvailable: ["Hindi", "Urdu"],
    director: "Feroz Abbas Khan",
    cast: ["Pooja Pant (Anarkali)", "Nissar Khan (Akbar)", "Dhanveer Singh (Salim)", "Grand Ensemble of 40 Kathak Dancers"],
    synopsis: "The legendary tale of prince Salim and courtesan Anarkali recreated on a majestic theatrical stage with Manish Malhotra's exquisite royal costumes, live singing, and mesmerizing Kathak choreography.",
    posterUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1469488865564-c2de10f69f96?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    hallType: "Audi 3 - LUXE VIP Recliners",
    featured: false,
    nowPlaying: true,
    badge: "Live Stage Musical Special",
    ticketPriceBase: 350
  },
  {
    _id: "66e000000000000000000006",
    title: "Aavesham (The Fan Celebration Cut)",
    tagline: "Eda Mone! Welcome to Bangalore Underworld.",
    category: "Movie",
    genre: ["Action", "Comedy", "Cult"],
    duration: "2h 38m",
    rating: 4.9,
    ageRating: "UA 16+",
    cbfcCertificate: "CBFC: UA 16+",
    language: "Malayalam (Eng Subtitles) • Hindi Dub",
    languagesAvailable: ["Malayalam", "Hindi"],
    director: "Jithu Madhavan",
    cast: ["Fahadh Faasil (Ranga)", "Hipzster", "Mithun Jai Shankar", "Sajin Gopu"],
    synopsis: "Three college students in Bengaluru get bullied by seniors and end up befriending Ranga, a quirky, white-clad local gangster who treats them like his younger brothers with uncontrollable energy.",
    posterUrl: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/L0yEMl8PXnw",
    hallType: "Audi 2 - Dolby Atmos 4K",
    featured: false,
    nowPlaying: true,
    badge: "Mollywood Blockbuster",
    ticketPriceBase: 200
  },
  {
    _id: "66e000000000000000000007",
    title: "Deadpool & Wolverine (Hindi & English 3D)",
    tagline: "Come together for maximum chaos.",
    category: "Movie",
    genre: ["Action", "Comedy", "Superhero"],
    duration: "2h 08m",
    rating: 4.8,
    ageRating: "A",
    cbfcCertificate: "CBFC: A (18+)",
    language: "Hindi Dubbed • English (Dolby Atmos)",
    languagesAvailable: ["Hindi", "English", "Tamil", "Telugu"],
    director: "Shawn Levy",
    cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Matthew Macfadyen"],
    synopsis: "A listless Wade Wilson toils away in civilian life when the Time Variance Authority pulls him into a mission that requires him to team up with an alternate Wolverine.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/73_1biulkYk",
    hallType: "Audi 1 - IMAX 3D Laser",
    featured: false,
    nowPlaying: true,
    badge: "Hollywood Dub Premiere",
    ticketPriceBase: 240
  },
  {
    _id: "66e000000000000000000008",
    title: "Ponniyin Selvan: The Live Stage Epic",
    tagline: "The Chola Dynasty returns to the stage.",
    category: "Theatre Play",
    genre: ["Historical Drama", "Live Stage", "Classic"],
    duration: "2h 45m",
    rating: 4.9,
    ageRating: "U",
    cbfcCertificate: "CBFC: U",
    language: "Tamil (Live Stage)",
    languagesAvailable: ["Tamil"],
    director: "Magic Lantern Theatre Troupe",
    cast: ["K. Kumar (Vanthiyathevan)", "Malavika S. (Kundavai)", "R. Balaji (Aditha Karikalan)"],
    synopsis: "The grandeur, political intrigue, and wartime chivalry of the Chola empire presented as an epic live theatrical drama with authentic period music and martial arts.",
    posterUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop",
    trailerUrl: "https://www.youtube.com/embed/D4qAQYLGZVM",
    hallType: "Audi 3 - LUXE VIP Recliners",
    featured: false,
    nowPlaying: true,
    badge: "Chola Heritage Play",
    ticketPriceBase: 300
  }
];

const sampleConcessions = [
  {
    name: "Crispy Punjabi Paneer & Corn Samosas (2 Pcs)",
    category: "Snacks",
    description: "Golden fried crust stuffed with spicy seasoned paneer, sweet corn, served with sweet Imli & spicy Mint chutney.",
    price: 140,
    calories: "320 kcal",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop",
    emoji: "🥟",
    popular: true,
    badge: "All-Time Desi Favourite"
  },
  {
    name: "Cheese & Caramel Duo Popcorn Tub (Large)",
    category: "Popcorn",
    description: "Iconic multiplex combo of rich cheddar cheese and crunchy slow-glazed golden caramel popcorn with peri-peri seasoning.",
    price: 280,
    calories: "620 kcal",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=600&auto=format&fit=crop",
    emoji: "🍿",
    popular: true,
    badge: "Bestseller Tub"
  },
  {
    name: "The Blockbuster Desi Couple Combo",
    category: "Combos",
    description: "1 Large Popcorn Tub + 2 Large Fountain Thums Up / Coke (650ml) + 2 Crispy Hot Samosas with Dips.",
    price: 490,
    calories: "1150 kcal",
    image: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?q=80&w=600&auto=format&fit=crop",
    emoji: "🎟️",
    popular: true,
    badge: "Save ₹120"
  },
  {
    name: "Fiery Loaded Nachos with Hot Jalapeño Cheese",
    category: "Snacks",
    description: "Crispy stone-ground Mexican tortilla nachos served with warm melted spiced cheese sauce and sliced jalapeño peppers.",
    price: 210,
    calories: "480 kcal",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=600&auto=format&fit=crop",
    emoji: "🧀",
    popular: false,
    badge: "Cheesy Crunch"
  },
  {
    name: "Madras Special Masala Filter Kaapi / Elaichi Chai",
    category: "Beverages",
    description: "Freshly brewed aromatic South Indian chicory filter coffee or hot steamed cardamom masala cutting chai.",
    price: 90,
    calories: "110 kcal",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    emoji: "☕",
    popular: true,
    badge: "Hot Brew"
  },
  {
    name: "Thums Up / Coca-Cola Large Fountain (750ml)",
    category: "Beverages",
    description: "Ice-cold sparkling fountain beverage served in a commemorative cinema cup.",
    price: 140,
    calories: "180 kcal",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop",
    emoji: "🥤",
    popular: true,
    badge: "Charged Up"
  },
  {
    name: "Sizzling Dark Chocolate Brownie with Vanilla Ice Cream",
    category: "Desserts",
    description: "Warm Belgian chocolate walnut brownie served on a hot skillet with rich chocolate fudge sauce and vanilla scoop.",
    price: 180,
    calories: "510 kcal",
    image: "https://images.unsplash.com/photo-1624300629298-e9de39c13be5?q=80&w=600&auto=format&fit=crop",
    emoji: "🍨",
    popular: true,
    badge: "Sweet Indulgence"
  }
];

function generateDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 4; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    let label = 'Today';
    if (i === 1) label = 'Tomorrow';
    else if (i === 2) label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    else if (i === 3) label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

    dates.push({ dateStr, label, dayName: d.toLocaleDateString('en-IN', { weekday: 'long' }) });
  }
  return dates;
}

function generateSeedShowtimes() {
  const dates = generateDates();
  const showtimes = [];

  const timeSlots = [
    { time: "11:15 AM", hallName: "Audi 1 - IMAX 3D Laser", hallType: "Audi 1 - IMAX 3D Laser", format: "IMAX 3D" },
    { time: "02:45 PM", hallName: "Audi 1 - IMAX 3D Laser", hallType: "Audi 1 - IMAX 3D Laser", format: "IMAX 3D" },
    { time: "06:30 PM", hallName: "Audi 1 - IMAX 3D Laser", hallType: "Audi 1 - IMAX 3D Laser", format: "IMAX 3D" },
    { time: "10:00 PM", hallName: "Audi 1 - IMAX 3D Laser", hallType: "Audi 1 - IMAX 3D Laser", format: "IMAX 3D" },

    { time: "01:00 PM", hallName: "Audi 2 - Dolby Atmos 4K", hallType: "Audi 2 - Dolby Atmos 4K", format: "Dolby Atmos" },
    { time: "04:30 PM", hallName: "Audi 2 - Dolby Atmos 4K", hallType: "Audi 2 - Dolby Atmos 4K", format: "Dolby Atmos" },
    { time: "08:15 PM", hallName: "Audi 2 - Dolby Atmos 4K", hallType: "Audi 2 - Dolby Atmos 4K", format: "Dolby Atmos" },

    { time: "03:30 PM", hallName: "Audi 3 - LUXE VIP Recliners", hallType: "Audi 3 - LUXE VIP Recliners", format: "LUXE VIP" },
    { time: "07:45 PM", hallName: "Audi 3 - LUXE VIP Recliners", hallType: "Audi 3 - LUXE VIP Recliners", format: "LUXE VIP" }
  ];

  let idCounter = 100;

  dates.forEach((d, dateIdx) => {
    sampleMovies.forEach((movie, movieIdx) => {
      const slotsForMovie = [];
      if (movie.hallType === 'Audi 1 - IMAX 3D Laser') {
        slotsForMovie.push(timeSlots[0], timeSlots[2]);
        if (dateIdx === 0) slotsForMovie.push(timeSlots[3]);
      } else if (movie.hallType === 'Audi 3 - LUXE VIP Recliners') {
        slotsForMovie.push(timeSlots[7], timeSlots[8]);
      } else {
        slotsForMovie.push(timeSlots[4], timeSlots[6]);
        if (dateIdx < 2) slotsForMovie.push(timeSlots[5]);
      }

      slotsForMovie.forEach((slot, slotIdx) => {
        idCounter++;
        const customPricing = {
          ReclinerVIP: slot.hallType === 'Audi 3 - LUXE VIP Recliners' ? 480 : 420,
          Prime: slot.hallType === 'Audi 1 - IMAX 3D Laser' ? 280 : 250,
          Classic: movie.ticketPriceBase || 180,
          Accessible: 150
        };

        const seats = generateSeatMatrix(customPricing, 0.20 + (slotIdx * 0.1) + (dateIdx === 0 ? 0.2 : 0));

        showtimes.push({
          _id: `66e000000000000000000${idCounter}`,
          movieId: movie._id,
          movieTitle: movie.title,
          hallName: slot.hallName,
          hallType: slot.hallType,
          date: d.dateStr,
          time: slot.time,
          format: slot.format,
          language: movie.language,
          pricing: customPricing,
          seats
        });
      });
    });
  });

  return showtimes;
}

const sampleSeedBookings = [
  {
    _id: "66e000000000000000000999",
    bookingCode: "LUM-84920",
    showtimeId: "66e000000000000000000101",
    movieId: "66e000000000000000000001",
    movieTitle: "Pushpa 2: The Rule",
    moviePoster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    hallName: "Audi 1 - IMAX 3D Laser",
    date: new Date().toISOString().split('T')[0],
    time: "06:30 PM",
    format: "IMAX 3D",
    customerName: "Aarav Sharma",
    customerPhone: "+91 98765 43210",
    customerEmail: "aarav.sharma@example.in",
    specialRequests: "Audi 1 Center Recliner booking",
    seats: [
      { seatId: "H-6", row: "H", number: 6, tier: "Recliner VIP", price: 420 },
      { seatId: "H-7", row: "H", number: 7, tier: "Recliner VIP", price: 420 }
    ],
    concessions: [
      { id: "c1", name: "Cheese & Caramel Duo Popcorn Tub (Large)", price: 280, quantity: 1, emoji: "🍿" },
      { id: "c5", name: "Crispy Punjabi Paneer & Corn Samosas (2 Pcs)", price: 140, quantity: 1, emoji: "🥟" },
      { id: "c6", name: "Thums Up Large Fountain (750ml)", price: 140, quantity: 2, emoji: "🥤" }
    ],
    currency: "INR",
    ticketsAmount: 840,
    concessionsAmount: 700,
    totalAmount: 1540,
    paymentMethod: "Cash / UPI at Box Office Counter",
    paymentNotes: "Pay via Cash, GPay, PhonePe, Paytm, or Card at Counter before 06:15 PM",
    status: "Confirmed (Pay at Box Office)",
    cbfcCertificate: "UA 16+",
    qrData: "LUMINA-RES-84920-H6H7-INR1540",
    createdAt: new Date()
  }
];

module.exports = {
  sampleMovies,
  sampleConcessions,
  generateDates,
  generateSeedShowtimes,
  sampleSeedBookings,
  generateSeatMatrix
};
