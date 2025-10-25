package com.spruce.controller;

import com.spruce.dto.LoginRequest;
import com.spruce.dto.UserRegistrationRequest;
import com.spruce.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for user authentication and registration.
 * Handles login, registration, and user management endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserService userService;
    
    /**
     * Register a new user with their cryptographic keys.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            // Check if user already exists
            if (userService.userExists(request.getUsername())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Register the user
            userService.registerUser(
                request.getUsername(),
                request.getPassword(),
                request.getX25519PublicKey(),
                request.getKyberPublicKey(),
                request.getDilithiumPublicKey()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("username", request.getUsername());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Registration failed for user: {}", request.getUsername(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Authenticate user login.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            boolean isAuthenticated = userService.authenticateUser(request.getUsername(), request.getPassword());
            
            Map<String, Object> response = new HashMap<>();
            
            if (isAuthenticated) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("username", request.getUsername());
            } else {
                response.put("success", false);
                response.put("message", "Invalid username or password");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Check if username is available.
     */
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Map<String, Object>> checkUsername(@PathVariable String username) {
        boolean exists = userService.userExists(username);
        
        Map<String, Object> response = new HashMap<>();
        response.put("available", !exists);
        response.put("username", username);
        
        return ResponseEntity.ok(response);
    }
}
