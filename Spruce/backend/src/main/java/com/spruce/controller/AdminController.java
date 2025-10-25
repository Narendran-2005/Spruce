package com.spruce.controller;

import com.spruce.service.LogService;
import com.spruce.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for admin operations and system monitoring.
 * Provides access to system logs and statistics for the demo.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final LogService logService;
    private final MessageService messageService;
    
    /**
     * Get recent system logs for admin console display.
     */
    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> getLogs(@RequestParam(defaultValue = "100") int count) {
        try {
            List<String> logs = logService.getRecentLogs(count);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("logs", logs);
            response.put("count", logs.size());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to retrieve logs", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve logs: " + e.getMessage());
            response.put("logs", List.of());
            response.put("count", 0);
            
            return ResponseEntity.ok(response);
        }
    }
    
    /**
     * Get system statistics for monitoring.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Integer> messageStats = messageService.getMessageQueueStats();
            Map<String, Integer> handshakeStats = messageService.getHandshakeQueueStats();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("messageQueues", messageStats);
            response.put("handshakeQueues", handshakeStats);
            response.put("totalMessages", messageStats.values().stream().mapToInt(Integer::intValue).sum());
            response.put("totalHandshakes", handshakeStats.values().stream().mapToInt(Integer::intValue).sum());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to retrieve system statistics", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve statistics: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Clear all system data (for demo reset).
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetSystem() {
        try {
            // Clear all message queues
            messageService.clearMessages("all");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "System reset successfully");
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to reset system", e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to reset system: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
