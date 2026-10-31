import axios from 'axios';

// Determine API base URL dynamically:
// 1. If explicit REACT_APP_API_URL is configured (e.g. Render/Railway backend URL in Vercel), use it.
// 2. If running on public domain (e.g. travelindia-rosy.vercel.app), use relative '/api' to avoid loopback/CORS blocks.
// 3. If running locally on development computer, use http://localhost:5005/api.
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/$/, "");
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "/api";
  }
  return "http://localhost:5005/api";
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with LONGER timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,  // CHANGE FROM 30000 TO 120000 (2 minutes)
  headers: {
    'Content-Type': 'application/json',
  }
});

// Rest of your api.js remains the same...
// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor with detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.url}`, response.data);
    return response.data; // <-- FIXED HERE
  },
  (error) => {
    console.error("❌ API Error Details:", {
      URL: error.config?.url,
      Method: error.config?.method,
      Status: error.response?.status,
      StatusText: error.response?.statusText,
      ErrorMessage: error.message,
      ResponseData: error.response?.data,
    });

    if (error.code === "ECONNREFUSED") {
      console.error("💡 Backend is not running!");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject({
      success: false,
      error: error.response?.data?.error || error.message || "Network error",
    });
  },
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),
  updateProfile: (profileData) => api.put("/auth/profile", profileData),
};

// AI API
export const aiAPI = {
  generateItinerary: (data) => api.post('/ai/generate-itinerary', data, {
    timeout: 120000  // 2 minutes specifically for AI generation
  }),
};

// Trips API
export const tripsAPI = {
  getMyTrips: () => api.get("/trips/my-trips"),
  getTrip: (tripId) => api.get(`/trips/${tripId}`),
  deleteTrip: (tripId) => api.delete(`/trips/${tripId}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: () => api.get("/admin/users"),
};

export default api;
