package com.spruce.service;

import com.spruce.model.LogEntry;
import com.spruce.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Centralized logging service for Spruce demo.
 * Logs all cryptographic operations, handshakes, and message exchanges.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class LogService {
    
    private static final String LOG_FILE = "logs/spruce-demo.log";
    private final List<String> logBuffer = new CopyOnWriteArrayList<>();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    private final LogRepository logRepository;
    
    /**
     * Log an info message with timestamp.
     */
    public void logInfo(String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logEntry = String.format("[%s] [INFO] %s", timestamp, message);
        
        log.info(logEntry);
        logBuffer.add(logEntry);
        writeToFile(logEntry);
        persistToDatabase("INFO", message);
        
        // Keep only last 1000 entries in memory
        if (logBuffer.size() > 1000) {
            logBuffer.remove(0);
        }
    }
    
    /**
     * Log a handshake event.
     */
    public void logHandshake(String event, String details) {
        String message = String.format("[HANDSHAKE] %s | %s", event, details);
        logInfo(message);
    }
    
    /**
     * Log a signature verification event.
     */
    public void logSignature(String event, String details) {
        String message = String.format("[SIGNATURE] %s | %s", event, details);
        logInfo(message);
    }
    
    /**
     * Log a session establishment event.
     */
    public void logSession(String event, String details) {
        String message = String.format("[SESSION] %s | %s", event, details);
        logInfo(message);
    }
    
    /**
     * Log a message encryption/decryption event.
     */
    public void logMessage(String event, String details) {
        String message = String.format("[MESSAGE] %s | %s", event, details);
        logInfo(message);
    }
    
    /**
     * Log a cryptographic operation.
     */
    public void logCrypto(String operation, String details) {
        String message = String.format("[CRYPTO] %s | %s", operation, details);
        logInfo(message);
    }
    
    /**
     * Get the last N log entries for admin console.
     */
    public List<String> getRecentLogs(int count) {
        // Try reading from DB first
        try {
            List<LogEntry> recent = logRepository.findRecent(PageRequest.of(0, Math.max(1, count)));
            if (!recent.isEmpty()) {
                List<String> lines = new ArrayList<>(recent.size());
                for (LogEntry e : recent) {
                    String ts = e.getCreatedAt() != null ? e.getCreatedAt().format(formatter) : LocalDateTime.now().format(formatter);
                    String lvl = e.getLevel() != null ? e.getLevel() : "INFO";
                    lines.add(String.format("[%s] [%s] %s", ts, lvl, e.getMessage()));
                }
                return lines;
            }
        } catch (Exception ignored) {
            // fall back to in-memory buffer
        }
        int startIndex = Math.max(0, logBuffer.size() - count);
        return new ArrayList<>(logBuffer.subList(startIndex, logBuffer.size()));
    }
    
    /**
     * Write log entry to file.
     */
    private void writeToFile(String logEntry) {
        try (FileWriter writer = new FileWriter(LOG_FILE, true)) {
            writer.write(logEntry + System.lineSeparator());
        } catch (IOException e) {
            log.error("Failed to write to log file: {}", e.getMessage());
        }
    }

    private void persistToDatabase(String level, String message) {
        try {
            LogEntry entry = LogEntry.builder()
                .level(level)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();
            logRepository.save(entry);
        } catch (Exception ignored) {
            // DB may be H2 memory or MySQL not configured; ignore persist errors for demo
        }
    }
}
