package com.spruce.repository;

import com.spruce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for User entity.
 * Provides database operations for user management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by username.
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Check if user exists by username.
     */
    boolean existsByUsername(String username);
}







