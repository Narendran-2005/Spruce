import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService } from '../services/apiService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('spruce_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('spruce_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await apiService.login(username, password)
      if (response.success) {
        const userData = { username, ...response }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('spruce_user', JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Login failed: ' + error.message }
    }
  }

  const register = async (username, password, publicKeys) => {
    try {
      const response = await apiService.register(username, password, publicKeys)
      if (response.success) {
        const userData = { username, ...response }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('spruce_user', JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, message: 'Registration failed: ' + error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('spruce_user')
    localStorage.removeItem('spruce_private_keys')
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
