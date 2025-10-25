package com.spruce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Spruce - Hybrid Post-Quantum Secure Messaging Demo
 * 
 * Main Spring Boot application class that initializes the backend server
 * for the three-laptop demo setup.
 */
@SpringBootApplication
@EnableAsync
public class SpruceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpruceApplication.class, args);
        System.out.println("Spruce Backend Server Started Successfully!");
        System.out.println("Server running on: http://localhost:8080");
        System.out.println("Hybrid Post-Quantum Cryptography Demo Ready");
        System.out.println("Admin logs available at: http://localhost:8080/api/admin/logs");
    }
}
