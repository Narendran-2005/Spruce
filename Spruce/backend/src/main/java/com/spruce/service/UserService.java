package com.spruce.service;

import com.spruce.model.User;
import com.spruce.repository.UserRepository;
import com.spruce.dto.PublicKeySet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LogService logService;

    public User registerUser(String username, String password, String x25519PublicKey, String kyberPublicKey, String dilithiumPublicKey) {
        logService.logMessage("USER", "Registering user: " + username);
        
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(password); // In production, hash this
        user.setX25519PublicKey(x25519PublicKey);
        user.setKyberPublicKey(kyberPublicKey);
        user.setDilithiumPublicKey(dilithiumPublicKey);
        
        User savedUser = userRepository.save(user);
        logService.logMessage("USER", "User registered successfully: " + username);
        return savedUser;
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public PublicKeySet getPublicKeys(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return new PublicKeySet(
                username,
                user.get().getX25519PublicKey(),
                user.get().getKyberPublicKey(),
                user.get().getDilithiumPublicKey()
            );
        }
        return null;
    }

    public boolean authenticateUser(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            // In production, use proper password hashing
            boolean authenticated = user.get().getPasswordHash().equals(password);
            logService.logMessage("USER", "Authentication " + (authenticated ? "successful" : "failed") + " for: " + username);
            return authenticated;
        }
        logService.logMessage("USER", "User not found: " + username);
        return false;
    }

    public boolean userExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public PublicKeySet getUserPublicKeys(String username) {
        return getPublicKeys(username);
    }
}
