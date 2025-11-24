
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // --- Auth Endpoints ---
  
  sendOtp: async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      return data;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      return data;
    } catch (error) {
      throw error;
    }
  },

  adminLogin: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  // --- Request Endpoints ---

  createRequest: async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      return data;
    } catch (error) {
      throw error;
    }
  },

  getRequests: async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/requests`, {
        method: 'GET',
        headers: { 
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch requests');
      return data;
    } catch (error) {
      throw error;
    }
  }
};
