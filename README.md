# Mayura Grand Cinemas

A modern cinema and theatre booking web application featuring real-time interactive seat selection, in-person Cash/UPI reservations, and digital ticket pass generation.

## Features

- **Movie Showcase**: Browse now-showing movies with language filters, trailers, and CBFC ratings.
- **Interactive Seat Map**: Live seat availability with tiered pricing (VIP Recliner, Prime, Classic).
- **Counter / UPI Booking**: Reserve seats without upfront online payment (pay at counter via Cash or UPI).
- **Digital Ticket Pass**: Instant digital pass with QR code, booking reference, and print capability.
- **Ticket Lookup**: Search, retrieve, and cancel bookings via reference code or mobile number.
- **Box Office Staff Controller**: 2-column bubble selection interface for staff to manage seat occupancy in real time.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (with auto in-memory fallback)

## Getting Started

### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```

Example `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/cinemas
CLIENT_URL=http://localhost:5173
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Example `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/movies` | List movies with filters |
| `GET` | `/api/showtimes` | List screening times |
| `GET` | `/api/showtimes/:id` | Screen seat map & occupancy |
| `POST` | `/api/bookings` | Reserve seats (Cash / UPI) |
| `GET` | `/api/bookings/lookup` | Search booking by code or phone |
| `POST` | `/api/bookings/:id/cancel` | Cancel reservation |
| `POST` | `/api/showtimes/:id/toggle-seat` | Toggle seat occupancy |
| `GET` | `/api/concessions` | Snacks & cafe menu |
| `GET` | `/api/stats` | Multiplex statistics |
