/**
 * Cryptographic service for client-side operations.
 * Implements hybrid post-quantum cryptography.
 */

import { x25519 } from '@noble/curves/ed25519'
import { sha256 } from '@noble/hashes/sha256'
import { apiService } from './apiService'

export const cryptoService = {
  /**
   * Generate a complete key pair set (X25519, Kyber, Dilithium).
   */
  async generateKeyPair() {
    try {
      // Generate X25519 key pair
      const x25519Keys = await this.generateX25519KeyPair()
      
      // Generate Kyber key pair (simulated for demo)
      const kyberKeys = await this.generateKyberKeyPair()
      
      // Generate Dilithium key pair (simulated for demo)
      const dilithiumKeys = await this.generateDilithiumKeyPair()
      
      return {
        x25519PrivateKey: x25519Keys.privateKey,
        x25519PublicKey: x25519Keys.publicKey,
        kyberPrivateKey: kyberKeys.privateKey,
        kyberPublicKey: kyberKeys.publicKey,
        dilithiumPrivateKey: dilithiumKeys.privateKey,
        dilithiumPublicKey: dilithiumKeys.publicKey,
      }
    } catch (error) {
      console.error('Key pair generation failed:', error)
      throw error
    }
  },

  /**
   * Generate X25519 key pair (using @noble/curves for broad browser support).
   */
  async generateX25519KeyPair() {
    try {
      const priv = x25519.utils.randomPrivateKey()
      const pub = x25519.getPublicKey(priv)
      return {
        privateKey: this.bytesToBase64(priv),
        publicKey: this.bytesToBase64(pub),
      }
    } catch (error) {
      console.error('X25519 key generation failed:', error)
      throw error
    }
  },

  /**
   * Perform X25519 key agreement.
   */
  async x25519Agreement(privateKeyBase64, publicKeyBase64) {
    try {
      const priv = this.base64ToBytes(privateKeyBase64)
      const pub = this.base64ToBytes(publicKeyBase64)
      const shared = x25519.getSharedSecret(priv, pub)
      return this.bytesToBase64(shared)
    } catch (error) {
      console.error('X25519 agreement failed:', error)
      throw error
    }
  },

  /**
   * Generate Kyber key pair (simulated for demo).
   */
  async generateKyberKeyPair() {
    try {
      // Simulate Kyber key generation for demo
      const privateKey = this.bytesToBase64(this.generateRandomBytes(32))
      const publicKey = this.bytesToBase64(this.generateRandomBytes(32))
      
      return {
        privateKey: privateKey,
        publicKey: publicKey
      }
    } catch (error) {
      console.error('Kyber key generation failed:', error)
      throw error
    }
  },

  /**
   * Kyber encapsulation (simulated for demo).
   */
  async kyberEncapsulate(publicKeyBase64) {
    try {
      // Simulate Kyber encapsulation for demo
      const sharedSecret = this.bytesToBase64(this.generateRandomBytes(32))
      const ciphertext = this.bytesToBase64(this.generateRandomBytes(1088)) // Kyber-768 ciphertext size
      
      return {
        sharedSecret: sharedSecret,
        ciphertext: ciphertext,
      }
    } catch (error) {
      console.error('Kyber encapsulation failed:', error)
      throw error
    }
  },

  /**
   * Kyber decapsulation (simulated for demo).
   */
  async kyberDecapsulate(ciphertextBase64, privateKeyBase64) {
    try {
      // Simulate Kyber decapsulation for demo
      const sharedSecret = this.bytesToBase64(this.generateRandomBytes(32))
      return sharedSecret
    } catch (error) {
      console.error('Kyber decapsulation failed:', error)
      throw error
    }
  },

  /**
   * Generate Dilithium key pair (simulated for demo).
   */
  async generateDilithiumKeyPair() {
    try {
      // Simulate Dilithium key generation for demo
      const privateKey = this.bytesToBase64(this.generateRandomBytes(32))
      const publicKey = this.bytesToBase64(this.generateRandomBytes(32))
      
      return {
        privateKey: privateKey,
        publicKey: publicKey,
      }
    } catch (error) {
      console.error('Dilithium key generation failed:', error)
      throw error
    }
  },

  /**
   * Dilithium signature generation (simulated for demo).
   */
  async dilithiumSign(message, privateKeyBase64) {
    try {
      // Simulate Dilithium signing for demo
      const signature = this.bytesToBase64(this.generateRandomBytes(2420)) // Dilithium-3 signature size
      return signature
    } catch (error) {
      console.error('Dilithium signing failed:', error)
      throw error
    }
  },

  /**
   * Dilithium signature verification (simulated for demo).
   */
  async dilithiumVerify(message, signatureBase64, publicKeyBase64) {
    try {
      // Simulate Dilithium verification for demo (always returns true)
      return true
    } catch (error) {
      console.error('Dilithium verification failed:', error)
      return false
    }
  },

  /**
   * Derive session key using HKDF.
   */
  async deriveSessionKey(x25519SharedSecretBase64, kyberSharedSecretBase64) {
    try {
      const x25519Secret = this.base64ToBytes(x25519SharedSecretBase64)
      const kyberSecret = this.base64ToBytes(kyberSharedSecretBase64)
      
      // Combine secrets
      const combinedSecret = new Uint8Array(x25519Secret.length + kyberSecret.length)
      combinedSecret.set(x25519Secret, 0)
      combinedSecret.set(kyberSecret, x25519Secret.length)
      
      // Hash the combined secret
      const sessionSeed = sha256(combinedSecret)
      
      // Derive session key using HKDF
      const salt = new TextEncoder().encode('Spruce-Hybrid-Session')
      const info = new TextEncoder().encode('Spruce-Hybrid-Session')
      
      // Derive 32-byte key via HKDF using SubtleCrypto for interop
      const seedKey = await crypto.subtle.importKey(
        'raw',
        sessionSeed,
        { name: 'HKDF' },
        false,
        ['deriveKey']
      )
      const derivedKey = await crypto.subtle.deriveKey(
        { name: 'HKDF', salt, info, hash: 'SHA-256' },
        seedKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      )
      return derivedKey
    } catch (error) {
      console.error('Session key derivation failed:', error)
      throw error
    }
  },

  /**
   * Encrypt message using AES-GCM.
   */
  async encryptMessage(message, sessionKey) {
    try {
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encodedMessage = new TextEncoder().encode(message)
      
      const ciphertext = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        sessionKey,
        encodedMessage
      )
      
      return {
        ciphertext: this.bytesToBase64(new Uint8Array(ciphertext)),
        iv: this.bytesToBase64(iv),
      }
    } catch (error) {
      console.error('Message encryption failed:', error)
      throw error
    }
  },

  /**
   * Decrypt message using AES-GCM.
   */
  async decryptMessage(encryptedData, sessionKey) {
    try {
      const ciphertext = this.base64ToBytes(encryptedData.ciphertext)
      const iv = this.base64ToBytes(encryptedData.iv)
      
      const plaintext = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        sessionKey,
        ciphertext
      )
      
      return new TextDecoder().decode(plaintext)
    } catch (error) {
      console.error('Message decryption failed:', error)
      throw error
    }
  },

  // Utility functions
  bytesToBase64(bytes) {
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    return btoa(binary)
  },

  base64ToBytes(base64) {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  },

  generateRandomBytes(length) {
    return crypto.getRandomValues(new Uint8Array(length))
  },
}
