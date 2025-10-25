import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ChatPage from './components/ChatPage'
import AdminPage from './components/AdminPage'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { CryptoProvider } from './hooks/useCrypto'
import { MessageQueueProvider } from './hooks/useMessageQueue'
import CryptoErrorBoundary from './components/CryptoErrorBoundary'

function App() {
  return (
    <CryptoErrorBoundary>
      <CryptoProvider>
        <MessageQueueProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-quantum-900">
                <Routes>
                  <Route path="/" element={<Navigate to="/login" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </MessageQueueProvider>
      </CryptoProvider>
    </CryptoErrorBoundary>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-quantum-900 flex items-center justify-center">
        <div className="text-quantum-300">Loading...</div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default App








