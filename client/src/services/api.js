import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

export const getDates = async () => {
  const response = await apiClient.get('/dates');
  return response.data;
};

export const getMovies = async (params = {}) => {
  const response = await apiClient.get('/movies', { params });
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await apiClient.get(`/movies/${id}`);
  return response.data;
};

export const getShowtimes = async (params = {}) => {
  const response = await apiClient.get('/showtimes', { params });
  return response.data;
};

export const getShowtimeById = async (id) => {
  const response = await apiClient.get(`/showtimes/${id}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data;
};

export const lookupBooking = async (query) => {
  const response = await apiClient.get('/bookings/lookup', { params: { q: query } });
  return response.data;
};

export const cancelBooking = async (idOrCode) => {
  const response = await apiClient.post(`/bookings/${idOrCode}/cancel`);
  return response.data;
};

export const toggleSeatStatus = async (showtimeId, seatId, status) => {
  const response = await apiClient.post(`/showtimes/${showtimeId}/toggle-seat`, { seatId, status });
  return response.data;
};

export const getConcessions = async () => {
  const response = await apiClient.get('/concessions');
  return response.data;
};

export const getStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export default apiClient;
