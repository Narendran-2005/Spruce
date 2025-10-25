import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const apiService = {
  // Authentication endpoints
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  async register(username, password, publicKeys) {
    try {
      const response = await api.post('/auth/register', {
        username,
        password,
        x25519PublicKey: publicKeys.x25519PublicKey,
        kyberPublicKey: publicKeys.kyberPublicKey,
        dilithiumPublicKey: publicKeys.dilithiumPublicKey,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  async checkUsername(username) {
    try {
      const response = await api.get(`/auth/check-username/${username}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Username check failed')
    }
  },

  // Key management endpoints
  async getPublicKeys(username) {
    try {
      const response = await api.get(`/keys/${username}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get public keys')
    }
  },

  async verifyUser(username) {
    try {
      const response = await api.get(`/keys/verify/${username}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'User verification failed')
    }
  },

  // Message endpoints
  async sendMessage(messagePacket) {
    try {
      const response = await api.post('/messages/send', messagePacket)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message')
    }
  },

  async receiveMessages(username) {
    try {
      const response = await api.get(`/messages/receive/${username}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to receive messages')
    }
  },

  async clearMessages(username) {
    try {
      const response = await api.delete(`/messages/clear/${username}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear messages')
    }
  },

  async sendHandshake(handshakePacket) {
    try {
      const response = await api.post('/messages/handshake', handshakePacket)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send handshake')
    }
  },

  async receiveHandshake(username) {
    try {
      const response = await api.get(`/messages/handshake/${username}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to receive handshake')
    }
  },

  // Admin endpoints
  async getLogs(count = 100) {
    try {
      const response = await api.get(`/admin/logs?count=${count}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get logs')
    }
  },

  async getStats() {
    try {
      const response = await api.get('/admin/stats')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get stats')
    }
  },

  async resetSystem() {
    try {
      const response = await api.post('/admin/reset')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset system')
    }
  },
}


