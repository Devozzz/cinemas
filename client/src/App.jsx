import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import TodayShows from './components/TodayShows';
import SeatMap from './components/SeatMap';
import BookingModal from './components/BookingModal';
import DigitalTicket from './components/DigitalTicket';
import MyBookingsModal from './components/MyBookingsModal';
import BoxOfficeAdmin from './components/BoxOfficeAdmin';
import ConcessionsMenu from './components/ConcessionsMenu';
import TrailerModal from './components/TrailerModal';
import Footer from './components/Footer';
import { getMovies, getDates, getShowtimes, getShowtimeById, getStats } from './services/api';
import { Sparkles, Ticket, Film, ShieldCheck, Popcorn, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('shows'); // 'shows' | 'seatmap' | 'snacks' | 'admin'
  const [movies, setMovies] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Modals
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch dates
      const datesRes = await getDates();
      if (datesRes.success && datesRes.dates?.length > 0) {
        setDates(datesRes.dates);
        setSelectedDate(datesRes.dates[0].dateStr);
      }

      // 2. Fetch movies
      const moviesRes = await getMovies();
      if (moviesRes.success && moviesRes.data) {
        setMovies(moviesRes.data);
      }

      // 3. Fetch showtimes
      const showtimesRes = await getShowtimes();
      if (showtimesRes.success && showtimesRes.data) {
        setShowtimes(showtimesRes.data);
        if (showtimesRes.data.length > 0) {
          const firstSt = showtimesRes.data[0];
          setSelectedShowtime(firstSt);
          const foundMovie = moviesRes.data?.find(m => String(m._id) === String(firstSt.movieId));
          if (foundMovie) setSelectedMovie(foundMovie);
        }
      }
    } catch (err) {
      console.error('Error initializing app data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch showtimes whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      getShowtimes({ date: selectedDate })
        .then(res => {
          if (res.success && res.data) {
            setShowtimes(res.data);
          }
        })
        .catch(err => console.error(err));
    }
  }, [selectedDate]);

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select a showtime to view seat map
  const handleSelectShowtime = async (movie, showtime) => {
    setSelectedMovie(movie);
    setSelectedSeats([]);

    if (showtime) {
      try {
        const res = await getShowtimeById(showtime._id);
        if (res.success && res.data) {
          setSelectedShowtime(res.data);
        } else {
          setSelectedShowtime(showtime);
        }
      } catch (err) {
        setSelectedShowtime(showtime);
      }
    } else {
      // Pick first showtime for this movie
      const found = showtimes.find(s => String(s.movieId) === String(movie._id));
      if (found) {
        handleSelectShowtime(movie, found);
        return;
      }
    }

    setActiveTab('seatmap');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Booking Flow Triggers
  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat on the map.');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (booking) => {
    setIsBookingModalOpen(false);
    setCurrentBooking(booking);
    setIsTicketModalOpen(true);
    setSelectedSeats([]);
    showToast(`Booking ${booking.bookingCode} confirmed! Pay via Cash or UPI at Box Office.`, 'success');

    // Refresh current showtime seat occupancy map
    if (selectedShowtime) {
      getShowtimeById(selectedShowtime._id).then(res => {
        if (res.success && res.data) setSelectedShowtime(res.data);
      });
    }
  };

  const handleViewTicketFromLookup = (booking) => {
    setCurrentBooking(booking);
    setIsTicketModalOpen(true);
  };

  const handleQuickBookCTA = () => {
    setActiveTab('shows');
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-theatre-surface font-sans text-slate-800 antialiased">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{toastMessage.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLookup={() => setIsLookupModalOpen(true)}
        onOpenQuickBook={handleQuickBookCTA}
        totalBookingsCount={showtimes.length}
      />

      {/* Hero Banner Showcase (Shown on 'shows' tab) */}
      {activeTab === 'shows' && (
        <HeroBanner
          movies={movies}
          onSelectShowtime={(movie, st) => handleSelectShowtime(movie, st)}
          onWatchTrailer={(movie) => setTrailerMovie(movie)}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-12 h-12 text-theatre-600 animate-spin" />
            <p className="font-display font-bold text-lg text-slate-700">Connecting to Mayura Grand Box Office...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: Today's Shows */}
            {activeTab === 'shows' && (
              <TodayShows
                movies={movies}
                showtimes={showtimes}
                dates={dates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onSelectShowtime={handleSelectShowtime}
                onWatchTrailer={(movie) => setTrailerMovie(movie)}
              />
            )}

            {/* TAB 2: Interactive Seat Map */}
            {activeTab === 'seatmap' && (
              <SeatMap
                showtime={selectedShowtime}
                movie={selectedMovie}
                allShowtimes={showtimes}
                onSelectShowtime={handleSelectShowtime}
                onBackToShows={() => {
                  setActiveTab('shows');
                  window.scrollTo({ top: 450, behavior: 'smooth' });
                }}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                onProceedToBooking={handleProceedToBooking}
              />
            )}

            {/* TAB 3: Snack Bar & Concessions */}
            {activeTab === 'snacks' && (
              <ConcessionsMenu
                onQuickBook={handleQuickBookCTA}
              />
            )}

            {/* TAB 4: Box Office Staff Mode */}
            {activeTab === 'admin' && (
              <BoxOfficeAdmin
                movies={movies}
                showtimes={showtimes}
                onRefreshData={() => {
                  getShowtimes().then(res => { if (res.success) setShowtimes(res.data); });
                }}
              />
            )}
          </>
        )}

      </main>

      {/* Footer */}
      <Footer onOpenLookup={() => setIsLookupModalOpen(true)} />

      {/* MODALS */}
      
      {/* 1. Trailer Player Modal */}
      <TrailerModal
        isOpen={Boolean(trailerMovie)}
        onClose={() => setTrailerMovie(null)}
        movie={trailerMovie}
      />

      {/* 2. In-Person Cash Reservation Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        showtime={selectedShowtime}
        movie={selectedMovie}
        selectedSeats={selectedSeats}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* 3. Confirmed Digital Ticket Pass Modal */}
      <DigitalTicket
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        booking={currentBooking}
        onOpenLookup={() => { setIsTicketModalOpen(false); setIsLookupModalOpen(true); }}
      />

      {/* 4. Find Ticket / My Bookings Modal */}
      <MyBookingsModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        onViewTicket={handleViewTicketFromLookup}
      />

    </div>
  );
}
