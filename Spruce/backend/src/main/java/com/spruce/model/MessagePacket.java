package com.spruce.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/**
 * Message packet for encrypted message transmission.
 * Contains encrypted content and metadata for secure messaging.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessagePacket {
    
    private String sender;
    private String recipient;
    private String encryptedContent;
    private String nonce;
    private String aad;
    private LocalDateTime timestamp;
    private String messageId;
    
    public MessagePacket(String sender, String recipient, String encryptedContent, 
                        String nonce, String aad) {
        this.sender = sender;
        this.recipient = recipient;
        this.encryptedContent = encryptedContent;
        this.nonce = nonce;
        this.aad = aad;
        this.timestamp = LocalDateTime.now();
        this.messageId = java.util.UUID.randomUUID().toString();
    }
}


