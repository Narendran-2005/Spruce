package com.spruce.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Handshake data for hybrid post-quantum key exchange.
 * Contains ephemeral X25519 key, Kyber ciphertext, and Dilithium signature.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HandshakeData {
    
    private String sender;
    private String recipient;
    private String ephemeralX25519PublicKey;  // Base64 encoded
    private String kyberCiphertext;           // Base64 encoded
    private String dilithiumSignature;        // Base64 encoded
    private long timestamp;
    private String handshakeId;
    
    public HandshakeData(String sender, String recipient, String ephemeralX25519PublicKey,
                        String kyberCiphertext, String dilithiumSignature) {
        this.sender = sender;
        this.recipient = recipient;
        this.ephemeralX25519PublicKey = ephemeralX25519PublicKey;
        this.kyberCiphertext = kyberCiphertext;
        this.dilithiumSignature = dilithiumSignature;
        this.timestamp = System.currentTimeMillis();
        this.handshakeId = java.util.UUID.randomUUID().toString();
    }
}


