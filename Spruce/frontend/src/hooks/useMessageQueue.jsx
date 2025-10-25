import React, { createContext, useContext, useState, useEffect } from 'react'

const MessageQueueContext = createContext()

export function MessageQueueProvider({ children }) {
  const [failedMessages, setFailedMessages] = useState([])
  const [retryCount, setRetryCount] = useState({})

  // Load failed messages from localStorage on mount
  useEffect(() => {
    const savedFailedMessages = localStorage.getItem('spruce_failed_messages')
    if (savedFailedMessages) {
      try {
        const messages = JSON.parse(savedFailedMessages)
        setFailedMessages(messages)
      } catch (error) {
        console.error('Failed to parse saved failed messages:', error)
        localStorage.removeItem('spruce_failed_messages')
      }
    }
  }, [])

  // Save failed messages to localStorage
  useEffect(() => {
    if (failedMessages.length > 0) {
      localStorage.setItem('spruce_failed_messages', JSON.stringify(failedMessages))
    } else {
      localStorage.removeItem('spruce_failed_messages')
    }
  }, [failedMessages])

  const addFailedMessage = (messagePacket, error) => {
    const failedMessage = {
      id: Date.now().toString(),
      packet: messagePacket,
      error: error.message,
      timestamp: new Date().toISOString(),
      retryCount: retryCount[messagePacket.messageId] || 0
    }
    
    setFailedMessages(prev => [...prev, failedMessage])
    setRetryCount(prev => ({
      ...prev,
      [messagePacket.messageId]: (prev[messagePacket.messageId] || 0) + 1
    }))
  }

  const retryFailedMessage = async (failedMessageId, decryptFunction) => {
    const failedMessage = failedMessages.find(msg => msg.id === failedMessageId)
    if (!failedMessage) return false

    try {
      const decryptedMessage = await decryptFunction(failedMessage.packet)
      
      // Remove from failed messages on successful decryption
      setFailedMessages(prev => prev.filter(msg => msg.id !== failedMessageId))
      setRetryCount(prev => {
        const newRetryCount = { ...prev }
        delete newRetryCount[failedMessage.packet.messageId]
        return newRetryCount
      })
      
      return decryptedMessage
    } catch (error) {
      console.error('Retry decryption failed:', error)
      return false
    }
  }

  const clearFailedMessages = () => {
    setFailedMessages([])
    setRetryCount({})
    localStorage.removeItem('spruce_failed_messages')
  }

  const getRetryableMessages = () => {
    return failedMessages.filter(msg => msg.retryCount < 3) // Max 3 retries
  }

  const value = {
    failedMessages,
    retryCount,
    addFailedMessage,
    retryFailedMessage,
    clearFailedMessages,
    getRetryableMessages
  }

  return (
    <MessageQueueContext.Provider value={value}>
      {children}
    </MessageQueueContext.Provider>
  )
}

export function useMessageQueue() {
  const context = useContext(MessageQueueContext)
  if (!context) {
    throw new Error('useMessageQueue must be used within a MessageQueueProvider')
  }
  return context
}
