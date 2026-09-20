# 🎭 Mayura Grand Cinemas & Multiplex (Indian Theatres Edition)

A complete, production-grade Indian Cinema & Theatre booking web application built with **React (Vite)**, **Tailwind CSS**, **Axios**, **Node.js**, **Express**, and **MongoDB**. Designed with a regal, cinematic **Light Theme with Red Accent** (velvet red, ruby glow, warm ivory canvas, and sleek typography).

---

## 🌟 Indian Cinema & Multiplex Highlights

### 1. 🇮🇳 Indian Blockbusters & Multilingual Catalogue
- **All-India Releases**: *Pushpa 2: The Rule (Telugu, Hindi, Tamil)*, *Kalki 2898 AD (3D IMAX)*, *Stree 2 (Hindi)*, *GOAT (Tamil, Hindi, Telugu)*, *Aavesham (Malayalam)*, *Deadpool & Wolverine (Hindi/Tamil 3D)*, and *Mughal-E-Azam: The Grand Musical Stage*.
- **CBFC Certification Badges**: Official Central Board of Film Certification badges displayed across movies (`U`, `UA 13+`, `UA 16+`, `A`).
- **Language Filters**: One-click filtering for **Hindi**, **Telugu**, **Tamil**, **Malayalam**, and **English**.

### 2. 💺 Realistic Indian Multiplex Audi Layout & Tiers (INR ₹)
- **Audi Screens**:
  - **Audi 1**: IMAX 3D Laser (Main Screen)
  - **Audi 2**: Dolby Atmos 4K Laser (128-channel spatial sound)
  - **Audi 3**: LUXE Insignia VIP Lounge (Plush motorized leather recliners)
- **Seating Tiers in INR (`₹`)**:
  - **Row H**: **RECLINER VIP** (₹420 – ₹480)
  - **Rows E–G**: **PRIME / EXECUTIVE** (₹250 – ₹280)
  - **Rows B–D**: **CLASSIC / STANDARD** (₹180 – ₹220)
  - **Row A**: **ACCESSIBLE / FRONT** (₹150)
- **Screen Indicator**: "SCREEN THIS WAY ⬇️ (ALL EYES FRONT)".

### 3. 🥟 Authentic Desi Concessions & Interval Combos (INR ₹)
- *Crispy Punjabi Paneer & Corn Samosas (2 pcs with Imli & Mint Chutney)* — ₹140
- *Large Cheese & Caramel Popcorn Tub with Spicy PVR-Style Seasoning* — ₹280
- *The Blockbuster Desi Couple Combo (Popcorn + 2 Thums Up + 2 Samosas)* — ₹490
- *Madras Special Masala Filter Kaapi / Elaichi Cutting Chai* — ₹90
- *Thums Up / Coke Large Fountain Soda (750ml)* — ₹140
- *Fiery Loaded Nachos with Hot Jalapeño Cheese Sauce* — ₹210
- *Sizzling Dark Chocolate Brownie with Ice Cream* — ₹180

### 4. 🎟️ In-Person Cash / UPI at Box Office Booking
- **No Online Card Payment Required**: Seats are locked immediately with zero pre-booking fees.
- **Pay at Counter**: Settle in **Cash**, **UPI (GPay / PhonePe / Paytm / BHIM)**, or Card at Box Office Counter #1–4 before showtime.
- **10-Digit Indian Mobile Number Verification**: Instant digital pass generation with Booking ID (e.g. `LUM-84920`) and Scannable QR Code.

### 5. 🔍 Ticket Lookup & Box Office Staff Controller
- **Search Booking**: Enter booking reference code or 10-digit mobile number to reprint pass or cancel with instant seat release.
- **Box Office Staff Mode**: Real-time Audi occupancy manager with 1-click toggle for walk-in counter cash/UPI patrons.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Axios, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express, MongoDB, Mongoose, Dotenv, Cors, Nodemon |
| **Resilience** | Built-in Auto-Seeding Database Engine with in-memory fallback (works instantly with or without a running MongoDB service) |
| **Theme & Currency** | Light Theme with Ruby Red Accents (`#DC2626`, `#991B1B`), Indian Rupee (`₹ INR`) |

---

## ⚙️ Environment Configuration

Both the client and server include ready-to-use `.env` and `.env.example` files:

### Backend Server (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mayura_cinemas
CLIENT_URL=http://localhost:5173
THEATRE_NAME="Mayura Grand Cinemas"
THEATRE_CITY="Bengaluru"
THEATRE_LOCATION="MG Road, Bengaluru, Karnataka 560001"
CURRENCY=INR
CURRENCY_SYMBOL=₹
```

### Frontend Client (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_THEATRE_NAME="Mayura Grand Cinemas"
VITE_THEATRE_CITY="Bengaluru"
VITE_THEATRE_LOCATION="MG Road, Bengaluru, Karnataka 560001"
VITE_THEATRE_TAGLINE="Luxury Indian Cinematic Experience"
VITE_CURRENCY_SYMBOL="₹"
VITE_SUPPORT_PHONE="+91 80 2558 9900"
VITE_SUPPORT_EMAIL="boxoffice@mayuracinemas.in"
```

---

## 🚀 How to Run Locally

### 1. Start Backend Server (port 5000)
```bash
cd server
npm run dev
```

### 2. Start Frontend Client (port 5173)
```bash
cd client
npm run dev
```

---

## 📡 REST API Summary

- `GET /api/movies` - Get all movies (supports `language`, `category`, `hallType`, `search` query params)
- `GET /api/movies/:id` - Movie details with upcoming showtimes
- `GET /api/dates` - Available screening dates (Today, Tomorrow, etc.)
- `GET /api/showtimes` - Filter showtimes by date, movie, or hall
- `GET /api/showtimes/:id` - Audi seat matrix with live occupancy in INR
- `POST /api/bookings` - Reserve seats (Cash / UPI at Box Office)
- `GET /api/bookings/lookup?q=...` - Lookup booking by reference code or Indian mobile number
- `POST /api/bookings/:id/cancel` - Cancel booking and release held seats
- `POST /api/showtimes/:id/toggle-seat` - Box office staff toggle seat status
- `GET /api/concessions` - Desi snack bar menu items
- `GET /api/stats` - Multiplex box office revenue and occupancy stats
