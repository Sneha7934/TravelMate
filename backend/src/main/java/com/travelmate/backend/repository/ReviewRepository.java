package com.travelmate.backend.repository;

import com.travelmate.backend.entity.Review;
import com.travelmate.backend.entity.Destination;
import com.travelmate.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    // ==========================================
    // GET REVIEWS BY DESTINATION
    // ==========================================

    List<Review> findByDestination(
            Destination destination
    );


    // ==========================================
    // GET REVIEWS BY USER
    // ==========================================

    List<Review> findByUser(
            User user
    );


    // ==========================================
    // FIND REVIEW BY USER + DESTINATION
    // ==========================================

    Optional<Review> findByUserAndDestination(
            User user,
            Destination destination
    );


    // ==========================================
    // CHECK DUPLICATE REVIEW
    // ==========================================

    boolean existsByUserAndDestination(
            User user,
            Destination destination
    );


    // ==========================================
    // COUNT REVIEWS
    // ==========================================

    long countByDestination(
            Destination destination
    );


    // ==========================================
    // AVERAGE RATING
    // ==========================================

    @Query("""
        SELECT AVG(r.rating)
        FROM Review r
        WHERE r.destination = :destination
    """)
    Double getAverageRating(
            @Param("destination")
            Destination destination
    );


    // ==========================================
    // DELETE ALL REVIEWS BY USER
    // ==========================================

    void deleteByUser(
            User user
    );
}

