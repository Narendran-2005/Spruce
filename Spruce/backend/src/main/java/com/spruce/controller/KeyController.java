package com.spruce.controller;

import com.spruce.dto.PublicKeySet;
import com.spruce.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for public key management.
 * Handles retrieval of user public keys for handshake operations.
 */
@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class KeyController {
    
    private final UserService userService;
    
    /**
     * Get public keys for a specific user.
     */
    @GetMapping("/{username}")
    public ResponseEntity<Map<String, Object>> getPublicKeys(@PathVariable String username) {
        try {
            PublicKeySet publicKeys = userService.getUserPublicKeys(username);
            
            if (publicKeys == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found: " + username);
                return ResponseEntity.status(404).body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("username", publicKeys.getUsername());
            response.put("x25519PublicKey", publicKeys.getX25519PublicKey());
            response.put("kyberPublicKey", publicKeys.getKyberPublicKey());
            response.put("dilithiumPublicKey", publicKeys.getDilithiumPublicKey());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to retrieve public keys for user: {}", username, e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error retrieving keys: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Verify if a user exists and has registered keys.
     */
    @GetMapping("/verify/{username}")
    public ResponseEntity<Map<String, Object>> verifyUser(@PathVariable String username) {
        try {
            boolean exists = userService.userExists(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            response.put("username", username);
            
            if (exists) {
                response.put("message", "User found with registered keys");
            } else {
                response.put("message", "User not found");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to verify user: {}", username, e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", false);
            response.put("message", "Error verifying user: " + e.getMessage());
            
            return ResponseEntity.ok(response);
        }
    }
}
