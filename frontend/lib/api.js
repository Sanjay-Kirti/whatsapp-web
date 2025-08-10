import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const conversationsAPI = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/api/conversations');
    return response.data;
  },

  // Get messages for a conversation
  getMessages: async (wa_id, { limit = 50, skip = 0 } = {}) => {
    const response = await api.get(`/api/conversations/${wa_id}/messages`, {
      params: { limit, skip }
    });
    return response.data;
  },

  // Send a new message
  sendMessage: async (wa_id, { text, media }) => {
    const response = await api.post(`/api/conversations/${wa_id}/messages`, {
      text,
      media
    });
    return response.data;
  },
};

export const messagesAPI = {
  // Update message status
  updateStatus: async (messageId, status) => {
    const response = await api.put(`/api/messages/${messageId}/status`, {
      state: status
    });
    return response.data;
  },

  // Get specific message
  getMessage: async (messageId) => {
    const response = await api.get(`/api/messages/${messageId}`);
    return response.data;
  },
};

export default api;
