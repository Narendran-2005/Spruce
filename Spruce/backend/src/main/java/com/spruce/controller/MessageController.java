package com.spruce.controller;

import com.spruce.model.MessagePacket;
import com.spruce.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for encrypted message transmission.
 * Handles sending and receiving encrypted messages between users.
 */
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class MessageController {
    
    private final MessageService messageService;
    
    /**
     * Send an encrypted message to a recipient.
     */
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody MessagePacket messagePacket) {
        try {
            // Store the encrypted message
            messageService.storeMessage(messagePacket);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message sent successfully");
            response.put("messageId", messagePacket.getMessageId());
            response.put("timestamp", messagePacket.getTimestamp());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to send message from {} to {}", 
                messagePacket.getSender(), messagePacket.getRecipient(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send message: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Receive messages for a specific user.
     */
    @GetMapping("/receive/{username}")
    public ResponseEntity<Map<String, Object>> receiveMessages(@PathVariable String username) {
        try {
            List<MessagePacket> messages = messageService.getMessages(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messages", messages);
            response.put("count", messages.size());
            response.put("username", username);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to receive messages for user: {}", username, e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to receive messages: " + e.getMessage());
            response.put("messages", List.of());
            response.put("count", 0);
            
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * Clear messages for a user after they've been retrieved.
     */
    @DeleteMapping("/clear/{username}")
    public ResponseEntity<Map<String, Object>> clearMessages(@PathVariable String username) {
        try {
            messageService.clearMessages(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Messages cleared for user: " + username);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to clear messages for user: {}", username, e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to clear messages: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Send handshake data to initiate secure communication.
     */
    @PostMapping("/handshake")
    public ResponseEntity<Map<String, Object>> sendHandshake(@RequestBody MessagePacket handshakePacket) {
        try {
            messageService.storeHandshakeData(handshakePacket.getRecipient(), handshakePacket);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Handshake data sent successfully");
            response.put("handshakeId", handshakePacket.getMessageId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to send handshake from {} to {}", 
                handshakePacket.getSender(), handshakePacket.getRecipient(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send handshake: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Receive handshake data for a user.
     */
    @GetMapping("/handshake/{username}")
    public ResponseEntity<Map<String, Object>> receiveHandshake(@PathVariable String username) {
        try {
            List<MessagePacket> handshakes = messageService.getHandshakeData(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("handshakes", handshakes);
            response.put("count", handshakes.size());
            response.put("username", username);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to receive handshake for user: {}", username, e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to receive handshake: " + e.getMessage());
            response.put("handshakes", List.of());
            response.put("count", 0);
            
            return ResponseEntity.ok(response);
        }
    }
}
