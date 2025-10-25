package com.spruce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO for public key set containing all three public keys.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicKeySet {
    
    private String username;
    private String x25519PublicKey;
    private String kyberPublicKey;
    private String dilithiumPublicKey;
}


