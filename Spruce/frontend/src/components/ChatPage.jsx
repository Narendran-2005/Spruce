import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCrypto } from '../hooks/useCrypto'
import { useMessageQueue } from '../hooks/useMessageQueue'
import { apiService } from '../services/apiService'
import { 
  Send, 
  Users, 
  Shield, 
  Key, 
  MessageSquare, 
  LogOut,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'

function ChatPage() {
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [handshakeInProgress, setHandshakeInProgress] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  
  const { user, logout } = useAuth()
  const { 
    sessionKey, 
    handshakeStatus, 
    currentChatUser, 
    initiateHandshake, 
    completeHandshake, 
    encryptMessage, 
    decryptMessage,
    resetSession 
  } = useCrypto()
  
  const { 
    failedMessages, 
    addFailedMessage, 
    retryFailedMessage, 
    clearFailedMessages 
  } = useMessageQueue()
  
  const messagesEndRef = useRef(null)
  const pollIntervalRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!user?.username) return
    
    // Poll for messages and handshakes
    const poll = async () => {
      try {
        // Check for handshake data
        const handshakeResponse = await apiService.receiveHandshake(user.username)
        if (handshakeResponse.success && handshakeResponse.handshakes.length > 0) {
          const handshake = handshakeResponse.handshakes[0]
          await handleIncomingHandshake(handshake)
        }

        // Check for messages
        const messageResponse = await apiService.receiveMessages(user.username)
        if (messageResponse.success && messageResponse.messages.length > 0) {
          await handleIncomingMessages(messageResponse.messages)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }

    pollIntervalRef.current = setInterval(poll, 2000)
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [user?.username]) // ✅ Only depend on username, not sessionKey

  const handleIncomingHandshake = async (handshakePacket) => {
    try {
      setHandshakeInProgress(true)
      setConnectionStatus('handshake')
      
      // ✅ Validate handshake packet structure
      if (!handshakePacket.encryptedContent) {
        throw new Error('Invalid handshake packet: missing encryptedContent')
      }
      
      // ✅ Safe JSON parsing with validation
      let payload
      try {
        payload = JSON.parse(handshakePacket.encryptedContent)
      } catch (parseError) {
        throw new Error('Invalid handshake data format')
      }
      
      // ✅ Validate required fields
      if (!payload.ephemeralX25519PublicKey || !payload.kyberCiphertext) {
        throw new Error('Invalid handshake data: missing required fields')
      }
      
      const senderUsername = handshakePacket.sender
      
      // Get sender's public keys
      const senderKeys = await apiService.getPublicKeys(senderUsername)
      
      // Complete handshake
      await completeHandshake(senderUsername, payload, senderKeys)
      
      setConnectionStatus('connected')
      setRecipient(senderUsername)
      
    } catch (error) {
      console.error('Handshake completion failed:', error)
      setError('Handshake failed: ' + error.message)
      setConnectionStatus('failed')
    } finally {
      setHandshakeInProgress(false)
    }
  }

  const handleIncomingMessages = async (messagePackets) => {
    if (!sessionKey) {
      console.warn('No session key available for decryption')
      return
    }

    try {
      for (const packet of messagePackets) {
        // ✅ Validate packet structure
        if (!packet.encryptedContent || !packet.nonce) {
          console.error('Invalid message packet structure')
          continue
        }
        
        try {
          const decryptedMessage = await decryptMessage({
            ciphertext: packet.encryptedContent,
            iv: packet.nonce
          }, sessionKey)
          
          setMessages(prev => [...prev, {
            id: packet.messageId,
            sender: packet.sender,
            content: decryptedMessage,
            timestamp: packet.timestamp,
            isEncrypted: false
          }])
        } catch (decryptError) {
          console.error('Failed to decrypt message:', decryptError)
          // ✅ Add to failed messages queue for retry
          addFailedMessage(packet, decryptError)
        }
      }
      
      // Clear messages after processing
      await apiService.clearMessages(user.username)
    } catch (error) {
      console.error('Message processing failed:', error)
      setError('Failed to process messages: ' + error.message)
    }
  }

  const startChat = async () => {
    if (!recipient.trim()) {
      setError('Please enter a recipient username')
      return
    }

    if (recipient === user.username) {
      setError('Cannot chat with yourself')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check if recipient exists
      const userCheck = await apiService.verifyUser(recipient)
      if (!userCheck.exists) {
        setError('User not found: ' + recipient)
        setLoading(false)
        return
      }

      // Get recipient's public keys
      const recipientKeys = await apiService.getPublicKeys(recipient)
      
      // Initiate handshake
      setHandshakeInProgress(true)
      setConnectionStatus('handshake')
      
      const handshakeData = await initiateHandshake(recipient, recipientKeys)
      
      // Send handshake data
      await apiService.sendHandshake({
        sender: user.username,
        recipient: recipient,
        encryptedContent: JSON.stringify(handshakeData),
        nonce: '',
        aad: '',
        timestamp: new Date().toISOString()
      })
      
      setConnectionStatus('connected')
      setRecipient(recipient)
      
    } catch (error) {
      console.error('Chat initiation failed:', error)
      setError('Failed to start chat: ' + error.message)
      setConnectionStatus('failed')
    } finally {
      setLoading(false)
      setHandshakeInProgress(false)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !sessionKey || !currentChatUser) {
      setError('No active session or message content')
      return
    }

    try {
      // Encrypt message
      const encryptedData = await encryptMessage(message, sessionKey)
      
      // Send encrypted message
      await apiService.sendMessage({
        sender: user.username,
        recipient: currentChatUser,
        encryptedContent: encryptedData.ciphertext,
        nonce: encryptedData.iv,
        aad: '',
        timestamp: new Date().toISOString()
      })
      
      // Add to local messages
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: user.username,
        content: message,
        timestamp: new Date().toISOString(),
        isEncrypted: false
      }])
      
      setMessage('')
    } catch (error) {
      console.error('Message sending failed:', error)
      setError('Failed to send message: ' + error.message)
    }
  }

  const handleLogout = () => {
    resetSession()
    clearFailedMessages()
    logout()
  }

  const retryFailedDecryption = async (failedMessageId) => {
    try {
      const decryptedMessage = await retryFailedMessage(failedMessageId, async (packet) => {
        return await decryptMessage({
          ciphertext: packet.encryptedContent,
          iv: packet.nonce
        }, sessionKey)
      })
      
      if (decryptedMessage) {
        // Add successfully decrypted message to UI
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'System',
          content: `Retried: ${decryptedMessage}`,
          timestamp: new Date().toISOString(),
          isEncrypted: false
        }])
      }
    } catch (error) {
      console.error('Retry failed:', error)
      setError('Failed to retry decryption: ' + error.message)
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'handshake':
        return <Clock className="h-4 w-4 text-yellow-400" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <WifiOff className="h-4 w-4 text-quantum-400" />
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Session Established'
      case 'handshake':
        return 'Handshake in Progress'
      case 'failed':
        return 'Connection Failed'
      default:
        return 'Disconnected'
    }
  }

  return (
    <div className="min-h-screen bg-quantum-900">
      {/* Header */}
      <div className="bg-quantum-800 border-b border-quantum-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-spruce-400" />
            <div>
              <h1 className="text-xl font-bold text-quantum-100">Spruce Chat</h1>
              <p className="text-sm text-quantum-400">Welcome, {user?.username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm text-quantum-300">{getStatusText()}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-quantum-800 border-r border-quantum-700 p-6">
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="card">
              <h3 className="text-lg font-semibold text-quantum-100 mb-4 flex items-center">
                <Wifi className="h-5 w-5 mr-2" />
                Connection Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-quantum-300">Session Key:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    sessionKey ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {sessionKey ? 'Established' : 'Not Available'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-quantum-300">Handshake:</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    handshakeStatus === 'completed' ? 'bg-green-900 text-green-300' : 
                    handshakeStatus === 'initiating' || handshakeStatus === 'completing' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {handshakeStatus === 'completed' ? 'Completed' :
                     handshakeStatus === 'initiating' ? 'Initiating' :
                     handshakeStatus === 'completing' ? 'Completing' : 'Not Started'}
                  </span>
                </div>
                
                {currentChatUser && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-quantum-300">Chatting with:</span>
                    <span className="text-sm text-spruce-400 font-medium">{currentChatUser}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Failed Messages */}
            {failedMessages.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-quantum-100 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Failed Messages ({failedMessages.length})
                </h3>
                <div className="space-y-2">
                  {failedMessages.slice(0, 3).map((failedMsg) => (
                    <div key={failedMsg.id} className="bg-red-900/20 border border-red-700 rounded p-2">
                      <p className="text-xs text-red-300">
                        Failed to decrypt message from {failedMsg.packet.sender}
                      </p>
                      <button
                        onClick={() => retryFailedDecryption(failedMsg.id)}
                        className="text-xs text-red-400 hover:text-red-300 mt-1"
                      >
                        Retry ({failedMsg.retryCount}/3)
                      </button>
                    </div>
                  ))}
                  {failedMessages.length > 3 && (
                    <p className="text-xs text-quantum-500">
                      +{failedMessages.length - 3} more failed messages
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Start Chat */}
            <div className="card">
              <h3 className="text-lg font-semibold text-quantum-100 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Start Chat
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-quantum-200 mb-2">
                    Recipient Username
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter username"
                    disabled={handshakeInProgress || connectionStatus === 'connected'}
                  />
                </div>
                
                <button
                  onClick={startChat}
                  disabled={loading || handshakeInProgress || connectionStatus === 'connected'}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Start Secure Chat'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-quantum-600 mx-auto mb-4" />
                  <p className="text-quantum-400">No messages yet</p>
                  <p className="text-quantum-500 text-sm">Start a secure chat to begin messaging</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === user.username 
                      ? 'bg-spruce-600 text-white' 
                      : 'bg-quantum-700 text-quantum-100'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {connectionStatus === 'connected' && currentChatUser && (
            <div className="border-t border-quantum-700 p-6">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="input-field flex-1"
                  placeholder={`Message ${currentChatUser}...`}
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 mx-6 mb-4 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
