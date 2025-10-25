import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCrypto } from '../hooks/useCrypto'
import { Shield, Lock, User, Key, CheckCircle, AlertCircle } from 'lucide-react'

function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyGenerationStatus, setKeyGenerationStatus] = useState('idle')
  
  const { register } = useAuth()
  const { generateKeyPair, privateKeys } = useCrypto()
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-generate keys when component mounts
    generateKeys()
  }, [])

  const generateKeys = async () => {
    setKeyGenerationStatus('generating')
    try {
      await generateKeyPair()
      setKeyGenerationStatus('completed')
    } catch (error) {
      setKeyGenerationStatus('failed')
      setError('Failed to generate cryptographic keys: ' + error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (keyGenerationStatus !== 'completed') {
      setError('Please wait for key generation to complete')
      setLoading(false)
      return
    }

    try {
      const publicKeys = {
        x25519PublicKey: privateKeys?.x25519PublicKey,
        kyberPublicKey: privateKeys?.kyberPublicKey,
        dilithiumPublicKey: privateKeys?.dilithiumPublicKey,
      }
      const result = await register(username, password, publicKeys)
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
          <h1 className="text-3xl font-bold text-quantum-100 mb-2">Register</h1>
          <p className="text-quantum-400">Create your secure messaging account</p>
        </div>

        {/* Registration Form */}
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
                  placeholder="Choose a username"
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
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-quantum-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-quantum-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Key Generation Status */}
            <div className="bg-quantum-800 border border-quantum-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-spruce-400" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-quantum-200">Cryptographic Keys</h3>
                  <p className="text-xs text-quantum-400 mt-1">
                    Generating X25519, Kyber, and Dilithium key pairs...
                  </p>
                </div>
                <div className="flex items-center">
                  {keyGenerationStatus === 'generating' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-spruce-400"></div>
                  )}
                  {keyGenerationStatus === 'completed' && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                  {keyGenerationStatus === 'failed' && (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              </div>
              
              {keyGenerationStatus === 'completed' && (
                <div className="mt-3 text-xs text-green-300">
                  ✓ X25519 key pair generated<br/>
                  ✓ Kyber key pair generated<br/>
                  ✓ Dilithium key pair generated
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || keyGenerationStatus !== 'completed'}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-quantum-400">
              Already have an account?{' '}
              <Link to="/login" className="text-spruce-400 hover:text-spruce-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 text-center">
          <p className="text-quantum-500 text-sm">
            Your private keys are stored locally and never transmitted
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
