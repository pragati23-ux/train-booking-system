import axios from 'axios';


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Auto attach token to every request
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');

// Temples
export const getAllTemples = () => API.get('/temples');
export const getTempleById = (id) => API.get(`/temples/${id}`);
export const createTemple = (data) => API.post('/temples', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateTemple = (id, data) => API.put(`/temples/${id}`, data);
export const deleteTemple = (id) => API.delete(`/temples/${id}`);

// Slots
export const getSlotsByTemple = (templeId) => API.get(`/slots/${templeId}`);
export const createSlot = (data) => API.post('/slots', data);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getAllBookings = () => API.get('/bookings/all');
export const cancelBooking = (id) => API.put(`/bookings/cancel/${id}`);

// Donations
export const createDonation = (data) => API.post('/donations', data);
export const getMyDonations = () => API.get('/donations/my');
export const getAllDonations = () => API.get('/donations/all');