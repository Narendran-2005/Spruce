package com.spruce.service;

import com.spruce.model.MessagePacket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for managing encrypted message transmission.
 * Handles message storage and retrieval for the demo.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {
    
    private final LogService logService;
    
    // In-memory storage for demo (in production, use database)
    private final Map<String, List<MessagePacket>> messageQueues = new ConcurrentHashMap<>();
    private final Map<String, List<MessagePacket>> handshakeData = new ConcurrentHashMap<>();
    
    /**
     * Store a message packet for a recipient.
     */
    public void storeMessage(MessagePacket messagePacket) {
        String recipient = messagePacket.getRecipient();
        messageQueues.computeIfAbsent(recipient, k -> new ArrayList<>()).add(messagePacket);
        
        logService.logMessage("Encrypted message relayed", String.format("From %s → %s", 
            messagePacket.getSender(), recipient));
    }
    
    /**
     * Retrieve messages for a user.
     */
    public List<MessagePacket> getMessages(String username) {
        List<MessagePacket> messages = messageQueues.getOrDefault(username, new ArrayList<>());
        
        if (!messages.isEmpty()) {
            logService.logMessage("Retrieved messages", String.format("User: %s, Count: %d", 
                username, messages.size()));
        }
        
        return messages;
    }
    
    /**
     * Clear messages for a user after retrieval.
     */
    public void clearMessages(String username) {
        if ("all".equalsIgnoreCase(username)) {
            messageQueues.clear();
            handshakeData.clear();
            logService.logMessage("Cleared all queues", "Admin reset invoked");
            return;
        }
        messageQueues.remove(username);
        logService.logMessage("Cleared message queue", String.format("User: %s", username));
    }
    
    /**
     * Store handshake data.
     */
    public void storeHandshakeData(String recipient, MessagePacket handshakePacket) {
        handshakeData.computeIfAbsent(recipient, k -> new ArrayList<>()).add(handshakePacket);
        
        logService.logHandshake("Handshake data stored", 
            String.format("Recipient: %s, Sender: %s", recipient, handshakePacket.getSender()));
    }
    
    /**
     * Retrieve handshake data for a user.
     */
    public List<MessagePacket> getHandshakeData(String username) {
        List<MessagePacket> handshakes = handshakeData.getOrDefault(username, new ArrayList<>());
        
        if (!handshakes.isEmpty()) {
            logService.logHandshake("Handshake data retrieved", 
                String.format("User: %s, Count: %d", username, handshakes.size()));
        }
        
        return handshakes;
    }
    
    /**
     * Clear handshake data for a user.
     */
    public void clearHandshakeData(String username) {
        handshakeData.remove(username);
        logService.logHandshake("Handshake data cleared", String.format("User: %s", username));
    }
    
    /**
     * Get all active message queues (for admin monitoring).
     */
    public Map<String, Integer> getMessageQueueStats() {
        Map<String, Integer> stats = new HashMap<>();
        messageQueues.forEach((user, messages) -> stats.put(user, messages.size()));
        return stats;
    }
    
    /**
     * Get all active handshake queues (for admin monitoring).
     */
    public Map<String, Integer> getHandshakeQueueStats() {
        Map<String, Integer> stats = new HashMap<>();
        handshakeData.forEach((user, handshakes) -> stats.put(user, handshakes.size()));
        return stats;
    }
}
