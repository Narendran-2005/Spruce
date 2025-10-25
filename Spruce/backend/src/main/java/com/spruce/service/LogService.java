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

@Service
@Slf4j
@RequiredArgsConstructor
public class LogService {

    private static final String LOG_FILE = "logs/spruce-demo.log";
    private final List<String> logBuffer = new CopyOnWriteArrayList<>();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    private final LogRepository logRepository;

    private void log(String level, String category, String message) {
        String timestamp = LocalDateTime.now().format(formatter);
        String logEntry = String.format("[%s] [%s] [%s] %s", timestamp, level, category, message);

        log.info(logEntry);
        logBuffer.add(logEntry);
        writeToFile(logEntry);
        persistToDatabase(level, category, message);

        if (logBuffer.size() > 1000) {
            logBuffer.remove(0);
        }
    }

    public void logInfo(String message) {
        log("INFO", "GENERAL", message);
    }

    public void logHandshake(String event, String details) {
        log("INFO", "HANDSHAKE", String.format("%s | %s", event, details));
    }

    public void logSignature(String event, String details) {
        log("INFO", "SIGNATURE", String.format("%s | %s", event, details));
    }

    public void logSession(String event, String details) {
        log("INFO", "SESSION", String.format("%s | %s", event, details));
    }

    public void logMessage(String event, String details) {
        log("INFO", "MESSAGE", String.format("%s | %s", event, details));
    }

    public void logCrypto(String operation, String details) {
        log("INFO", "CRYPTO", String.format("%s | %s", operation, details));
    }

    public List<String> getRecentLogs(int count) {
        try {
            List<LogEntry> recent = logRepository.findRecent(PageRequest.of(0, count));
            if (!recent.isEmpty()) {
                List<String> lines = new ArrayList<>();
                for (LogEntry e : recent) {
                    String ts = e.getCreatedAt() != null ? e.getCreatedAt().format(formatter) : "";
                    lines.add(String.format("[%s] [%s] [%s] %s", ts, e.getLevel(), e.getCategory(), e.getMessage()));
                }
                return lines;
            }
        } catch (Exception ignored) {
            // fallback to in-memory
        }
        int startIndex = Math.max(0, logBuffer.size() - count);
        return new ArrayList<>(logBuffer.subList(startIndex, logBuffer.size()));
    }

    private void writeToFile(String logEntry) {
        try (FileWriter writer = new FileWriter(LOG_FILE, true)) {
            writer.write(logEntry + System.lineSeparator());
        } catch (IOException e) {
            log.error("Failed to write to log file: {}", e.getMessage());
        }
    }

    private void persistToDatabase(String level, String category, String message) {
        try {
            LogEntry entry = LogEntry.builder()
                .level(level)
                .category(category)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();
            logRepository.save(entry);
        } catch (Exception ignored) {
            // DB may be H2 memory or MySQL not configured; ignore persist errors for demo
        }
    }
}
