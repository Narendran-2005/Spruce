import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Shield, Lock, User, ArrowRight } from 'lucide-react'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(username, password)
      if (result.success) {
        navigate('/chat')
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-quantum-900 via-quantum-800 to-spruce-900">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-spruce-400" />
          </div>
          <h1 className="text-3xl font-bold text-quantum-100 mb-2">Spruce</h1>
          <p className="text-quantum-400">Hybrid Post-Quantum Secure Messaging</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-quantum-200 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-quantum-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-quantum-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-quantum-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-quantum-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-spruce-400 hover:text-spruce-300 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-8 text-center">
          <p className="text-quantum-500 text-sm">
            Demo: Three-laptop setup with hybrid post-quantum cryptography
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage








