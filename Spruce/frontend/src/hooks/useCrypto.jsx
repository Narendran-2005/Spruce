import React, { createContext, useContext, useState, useEffect } from 'react'
import { cryptoService } from '../services/cryptoService'

const CryptoContext = createContext()

export function CryptoProvider({ children }) {
  const [privateKeys, setPrivateKeys] = useState(null)
  const [sessionKey, setSessionKey] = useState(null)
  const [sessionKeyComponents, setSessionKeyComponents] = useState(null)
  const [sessionKeyVersion, setSessionKeyVersion] = useState(null)
  const [sessionTimeout, setSessionTimeout] = useState(null)
  const [handshakeStatus, setHandshakeStatus] = useState('disconnected')
  const [currentChatUser, setCurrentChatUser] = useState(null)

  useEffect(() => {
    const loadSessionComponents = async () => {
      // Load private keys from localStorage
      const savedKeys = localStorage.getItem('spruce_private_keys')
      if (savedKeys) {
        try {
          const keys = JSON.parse(savedKeys)
          setPrivateKeys(keys)
        } catch (error) {
          console.error('Failed to parse saved private keys:', error)
          localStorage.removeItem('spruce_private_keys')
        }
      }
      
      // Load session key components from localStorage
      const savedSessionComponents = localStorage.getItem('spruce_session_components')
      if (savedSessionComponents) {
        try {
          const components = JSON.parse(savedSessionComponents)
          setSessionKeyComponents(components)
          // Regenerate session key from components
          await regenerateSessionKey(components) // ✅ Await async operation
        } catch (error) {
          console.error('Failed to parse saved session components:', error)
          localStorage.removeItem('spruce_session_components')
        }
      }
    }
    
    loadSessionComponents()
  }, []) // ✅ No dependencies to prevent loops

  const regenerateSessionKey = async (components) => {
    try {
      const sessionKey = await cryptoService.deriveSessionKey(
        components.x25519SharedSecret,
        components.kyberSharedSecret
      )
      setSessionKey(sessionKey)
      // ✅ Add session key validation
      if (sessionKey) {
        console.log('Session key regenerated successfully')
      }
    } catch (error) {
      console.error('Failed to regenerate session key:', error)
      // ✅ Clear invalid session components
      setSessionKeyComponents(null)
      localStorage.removeItem('spruce_session_components')
    }
  }

  const generateKeyPair = async () => {
    try {
      const keys = await cryptoService.generateKeyPair()
      setPrivateKeys(keys)
      localStorage.setItem('spruce_private_keys', JSON.stringify(keys))
      return keys
    } catch (error) {
      console.error('Failed to generate key pair:', error)
      throw error
    }
  }

  const initiateHandshake = async (recipientUsername, recipientPublicKeys) => {
    try {
      setHandshakeStatus('initiating')
      
      // Generate ephemeral X25519 key
      const ephemeralKeys = await cryptoService.generateX25519KeyPair()
      
      // Perform Kyber encapsulation
      const kyberResult = await cryptoService.kyberEncapsulate(recipientPublicKeys.kyberPublicKey)
      
      // Compute X25519 shared secret
      const x25519SharedSecret = await cryptoService.x25519Agreement(
        ephemeralKeys.privateKey, 
        recipientPublicKeys.x25519PublicKey
      )
      
      // Derive session key
      const derivedSessionKey = await cryptoService.deriveSessionKey(
        x25519SharedSecret, 
        kyberResult.sharedSecret
      )
      
      // Store session key components for persistence with versioning
      const components = {
        x25519SharedSecret,
        kyberSharedSecret: kyberResult.sharedSecret,
        version: Date.now() // ✅ Add versioning
      }
      setSessionKeyComponents(components)
      setSessionKeyVersion(components.version)
      localStorage.setItem('spruce_session_components', JSON.stringify(components))
      
      setSessionKey(derivedSessionKey)
      setCurrentChatUser(recipientUsername)
      setHandshakeStatus('completed')
      
      // ✅ Set session timeout
      setSessionTimeoutHandler()
      
      // Create handshake data
      const handshakeData = {
        ephemeralX25519PublicKey: ephemeralKeys.publicKey,
        kyberCiphertext: kyberResult.ciphertext,
        timestamp: Date.now()
      }
      
      // Sign handshake data
      const signature = await cryptoService.dilithiumSign(
        JSON.stringify(handshakeData),
        privateKeys.dilithiumPrivateKey
      )
      
      return {
        ...handshakeData,
        signature,
        success: true
      }
    } catch (error) {
      console.error('Handshake initiation failed:', error)
      setHandshakeStatus('failed')
      throw error
    }
  }

  const completeHandshake = async (senderUsername, handshakeData, senderPublicKeys) => {
    try {
      setHandshakeStatus('completing')
      
      // Verify signature
      const isValidSignature = await cryptoService.dilithiumVerify(
        JSON.stringify({
          ephemeralX25519PublicKey: handshakeData.ephemeralX25519PublicKey,
          kyberCiphertext: handshakeData.kyberCiphertext,
          timestamp: handshakeData.timestamp
        }),
        handshakeData.signature,
        senderPublicKeys.dilithiumPublicKey
      )
      
      if (!isValidSignature) {
        throw new Error('Invalid signature')
      }
      
      // Decapsulate Kyber
      const kyberSharedSecret = await cryptoService.kyberDecapsulate(
        handshakeData.kyberCiphertext,
        privateKeys.kyberPrivateKey
      )
      
      // Compute X25519 shared secret
      const x25519SharedSecret = await cryptoService.x25519Agreement(
        privateKeys.x25519PrivateKey,
        handshakeData.ephemeralX25519PublicKey
      )
      
      // Derive session key
      const derivedSessionKey = await cryptoService.deriveSessionKey(
        x25519SharedSecret,
        kyberSharedSecret
      )
      
      // Store session key components for persistence with versioning
      const components = {
        x25519SharedSecret,
        kyberSharedSecret,
        version: Date.now() // ✅ Add versioning
      }
      setSessionKeyComponents(components)
      setSessionKeyVersion(components.version)
      localStorage.setItem('spruce_session_components', JSON.stringify(components))
      
      setSessionKey(derivedSessionKey)
      setCurrentChatUser(senderUsername)
      setHandshakeStatus('completed')
      
      // ✅ Set session timeout
      setSessionTimeoutHandler()
      
      return { success: true }
    } catch (error) {
      console.error('Handshake completion failed:', error)
      setHandshakeStatus('failed')
      throw error
    }
  }

  const encryptMessage = async (message) => {
    if (!sessionKey) {
      throw new Error('No session key available')
    }
    
    try {
      return await cryptoService.encryptMessage(message, sessionKey)
    } catch (error) {
      console.error('Message encryption failed:', error)
      throw error
    }
  }

  const decryptMessage = async (encryptedData) => {
    if (!sessionKey) {
      throw new Error('No session key available')
    }
    
    try {
      return await cryptoService.decryptMessage(encryptedData, sessionKey)
    } catch (error) {
      console.error('Message decryption failed:', error)
      throw error
    }
  }

  const resetSession = () => {
    setSessionKey(null)
    setSessionKeyComponents(null)
    setSessionKeyVersion(null)
    setHandshakeStatus('disconnected')
    setCurrentChatUser(null)
    localStorage.removeItem('spruce_session_components')
    
    // ✅ Clear session timeout
    if (sessionTimeout) {
      clearTimeout(sessionTimeout)
      setSessionTimeout(null)
    }
  }

  const setSessionTimeoutHandler = (timeoutMs = 30 * 60 * 1000) => { // 30 minutes default
    if (sessionTimeout) {
      clearTimeout(sessionTimeout)
    }
    
    const timeout = setTimeout(() => {
      console.log('Session timeout - clearing session')
      resetSession()
    }, timeoutMs)
    
    setSessionTimeout(timeout)
  }

  const value = {
    privateKeys,
    sessionKey,
    sessionKeyVersion,
    handshakeStatus,
    currentChatUser,
    generateKeyPair,
    initiateHandshake,
    completeHandshake,
    encryptMessage,
    decryptMessage,
    resetSession,
    setSessionTimeoutHandler
  }

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  )
}

export function useCrypto() {
  const context = useContext(CryptoContext)
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider')
  }
  return context
}
