package com.hospital.pharmacy.repository;

import com.hospital.pharmacy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUserId(String userId);

    List<User> findByRole(String role);

    boolean existsByEmail(String email);

    // Method to find users by role and isActive status
    List<User> findByRoleAndIsActive(String role, Boolean isActive);

    // Method to find active users by role
    List<User> findByRoleAndIsActiveTrue(String role);

    // Method to find users by firstName, lastName, or email containing search term
    @Query("SELECT u FROM User u WHERE " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:isActive IS NULL OR u.isActive = :isActive) AND " +
           "(:searchTerm IS NULL OR " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    List<User> findByFilters(@Param("role") String role, 
                           @Param("isActive") Boolean isActive, 
                           @Param("searchTerm") String searchTerm);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") String role);
}