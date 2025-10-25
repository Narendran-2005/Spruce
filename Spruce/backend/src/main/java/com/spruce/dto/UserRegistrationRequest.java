package com.spruce.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for user registration request.
 * Contains username, password, and public keys.
 */
@Data
public class UserRegistrationRequest {
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "X25519 public key is required")
    private String x25519PublicKey;
    
    @NotBlank(message = "Kyber public key is required")
    private String kyberPublicKey;
    
    @NotBlank(message = "Dilithium public key is required")
    private String dilithiumPublicKey;
}


