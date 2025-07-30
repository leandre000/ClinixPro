package com.hospital.pharmacy.service;

import com.hospital.pharmacy.model.User;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for user management operations.
 * Provides business logic for user CRUD operations and role-based filtering.
 * 
 * @author Leandre
 * @version 1.0.0
 * @since 2024
 */
public interface UserService {
    
    /**
     * Find users by applying multiple filters
     * @param role User role filter (ADMIN, DOCTOR, PHARMACIST, RECEPTIONIST)
     * @param isActive Active status filter
     * @param search Search term for name or email
     * @return List of filtered users
     */
    List<User> findByFilters(String role, Boolean isActive, String search);
    
    /**
     * Find user by ID
     * @param id User ID
     * @return Optional containing user if found
     */
    Optional<User> findById(Long id);
    
    /**
     * Save a new user
     * @param user User entity to save
     * @return Saved user with generated ID
     */
    User save(User user);
    
    /**
     * Update existing user
     * @param id User ID to update
     * @param updatedUser Updated user data
     * @return Updated user entity
     */
    User update(Long id, User updatedUser);
    
    /**
     * Delete user (soft delete by setting isActive to false)
     * @param user User to delete
     */
    void delete(User user);
    
    /**
     * Count users by role
     * @param role User role to count
     * @return Number of users with specified role
     */
    long countByRole(String role);
    
    /**
     * Find user by email
     * @param email User email
     * @return Optional containing user if found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Check if user exists by email
     * @param email User email
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);
} 