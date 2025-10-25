/**
 * WebSocket Service for Real-time Communication
 * This is a future enhancement to replace polling with WebSocket connections
 */

class WebSocketService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000
    this.listeners = new Map()
  }

  connect(url = 'ws://localhost:8080/ws') {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url)
        
        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }
        
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }
        
        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.attemptReconnect()
        }
        
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }
        
      } catch (error) {
        reject(error)
      }
    })
  }

  handleMessage(data) {
    const { type, payload } = data
    
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        try {
          callback(payload)
        } catch (error) {
          console.error(`Error in ${type} listener:`, error)
        }
      })
    }
  }

  subscribe(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }
    this.listeners.get(type).push(callback)
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(type)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.warn('WebSocket not connected, message not sent')
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnection failed, will try again
        })
      }, this.reconnectInterval)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.listeners.clear()
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }
}

export const websocketService = new WebSocketService()
