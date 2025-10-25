package com.spruce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * User entity representing a registered user in the Spruce system.
 * Stores only public keys - private keys remain on client devices.
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String passwordHash;
    
    // X25519 Public Key (Base64 encoded)
    @Column(name = "x25519_public_key", columnDefinition = "TEXT")
    private String x25519PublicKey;
    
    // Kyber Public Key (Base64 encoded)
    @Column(name = "kyber_public_key", columnDefinition = "TEXT")
    private String kyberPublicKey;
    
    // Dilithium Public Key (Base64 encoded)
    @Column(name = "dilithium_public_key", columnDefinition = "TEXT")
    private String dilithiumPublicKey;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}


