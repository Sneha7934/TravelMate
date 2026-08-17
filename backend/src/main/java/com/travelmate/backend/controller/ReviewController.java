package com.travelmate.backend.controller;
import com.travelmate.backend.entity.Destination;
import com.travelmate.backend.entity.Review;
import com.travelmate.backend.entity.User;
import com.travelmate.backend.repository.DestinationRepository;
import com.travelmate.backend.repository.ReviewRepository;
import com.travelmate.backend.repository.UserRepository;
import com.travelmate.backend.service.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final AdminService adminService;

    public ReviewController(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            DestinationRepository destinationRepository,
            AdminService adminService) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.adminService = adminService;
    }


    // ==========================================
    // GET REVIEWS FOR A DESTINATION
    // PUBLIC
    // ==========================================

    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<?> getReviewsByDestination(
            @PathVariable Long destinationId) {

        Destination destination = destinationRepository
                .findById(destinationId)
                .orElse(null);

        if (destination == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Destination not found");
        }

        return ResponseEntity.ok(
                reviewRepository.findByDestination(destination)
        );
    }


    // ==========================================
    // GET REVIEW SUMMARY
    // PUBLIC
    // ==========================================

    @GetMapping("/destination/{destinationId}/summary")
    public ResponseEntity<?> getReviewSummary(
            @PathVariable Long destinationId) {

        Destination destination = destinationRepository
                .findById(destinationId)
                .orElse(null);

        if (destination == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Destination not found");
        }

        long reviewCount =
                reviewRepository.countByDestination(destination);

        Double averageRating =
                reviewRepository.getAverageRating(destination);

        if (averageRating == null) {
            averageRating = 0.0;
        }

        return ResponseEntity.ok(
                new ReviewSummary(
                        averageRating,
                        reviewCount
                )
        );
    }


    // ==========================================
    // ADD REVIEW
    // USER
    // ==========================================

    @PostMapping("/user/{userId}/destination/{destinationId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long userId,
            @PathVariable Long destinationId,
            @RequestBody Review review) {

        // ======================================
        // FIND USER
        // ======================================

        User user = userRepository
                .findById(userId)
                .orElse(null);

        // ======================================
        // FIND DESTINATION
        // ======================================

        Destination destination = destinationRepository
                .findById(destinationId)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        if (destination == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Destination not found");
        }


        // ======================================
        // VALIDATE RATING
        // ======================================

        if (review.getRating() == null ||
                review.getRating() < 1 ||
                review.getRating() > 5) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Rating must be between 1 and 5"
                    );
        }


        // ======================================
        // VALIDATE COMMENT
        // ======================================

        if (review.getComment() == null ||
                review.getComment().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Comment cannot be empty"
                    );
        }


        // ======================================
        // CHECK DUPLICATE REVIEW
        // ======================================

        if (reviewRepository
                .existsByUserAndDestination(
                        user,
                        destination
                )) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "You have already reviewed this destination."
                    );
        }


        // ======================================
        // SAVE REVIEW
        // ======================================

        review.setUser(user);
        review.setDestination(destination);

        Review savedReview =
                reviewRepository.save(review);

        return ResponseEntity.ok(savedReview);
    }


    // ==========================================
    // GET REVIEWS BY USER
    // USER
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReviewsByUser(
            @PathVariable Long userId) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        return ResponseEntity.ok(
                reviewRepository.findByUser(user)
        );
    }


    // ==========================================
    // EDIT OWN REVIEW
    // USER
    // ==========================================

    @PutMapping("/{reviewId}/user/{userId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @PathVariable Long userId,
            @RequestBody Review updatedReview) {

        Optional<Review> reviewOptional =
                reviewRepository.findById(reviewId);

        if (reviewOptional.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Review not found");
        }

        Review existingReview =
                reviewOptional.get();


        // ======================================
        // FIND USER
        // ======================================

        Optional<User> userOptional =
                userRepository.findById(userId);

        if (userOptional.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        User user = userOptional.get();


        // ======================================
        // CHECK OWNERSHIP
        // ======================================

        if (!existingReview
                .getUser()
                .getId()
                .equals(user.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "You can only edit your own review"
                    );
        }


        // ======================================
        // VALIDATE RATING
        // ======================================

        if (updatedReview.getRating() == null ||
                updatedReview.getRating() < 1 ||
                updatedReview.getRating() > 5) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Rating must be between 1 and 5"
                    );
        }


        // ======================================
        // VALIDATE COMMENT
        // ======================================

        if (updatedReview.getComment() == null ||
                updatedReview
                        .getComment()
                        .trim()
                        .isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Comment cannot be empty"
                    );
        }


        // ======================================
        // UPDATE ONLY RATING + COMMENT
        // ======================================

        existingReview.setRating(
                updatedReview.getRating()
        );

        existingReview.setComment(
                updatedReview
                        .getComment()
                        .trim()
        );


        Review savedReview =
                reviewRepository.save(existingReview);

        return ResponseEntity.ok(savedReview);
    }


    // ==========================================
    // DELETE OWN REVIEW
    // USER
    // ==========================================

    @DeleteMapping("/{reviewId}/user/{userId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            @PathVariable Long userId) {

        Optional<Review> reviewOptional =
                reviewRepository.findById(reviewId);

        if (reviewOptional.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Review not found");
        }

        Review review =
                reviewOptional.get();


        // ======================================
        // FIND USER
        // ======================================

        Optional<User> userOptional =
                userRepository.findById(userId);

        if (userOptional.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        User user =
                userOptional.get();


        // ======================================
        // CHECK OWNERSHIP
        // ======================================

        if (!review
                .getUser()
                .getId()
                .equals(user.getId())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "You can only delete your own review"
                    );
        }


        // ======================================
        // DELETE REVIEW
        // ======================================

        reviewRepository.delete(review);

        return ResponseEntity.ok(
                "Review deleted successfully"
        );
    }


    // ==========================================
    // GET ALL REVIEWS
    // ADMIN ONLY
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAllReviews(
            @RequestHeader("userId") Long userId) {

        // ======================================
        // CHECK ADMIN
        // ======================================

        if (!adminService.isAdmin(userId)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Access denied. Admin only."
                    );
        }


        // ======================================
        // GET ALL REVIEWS
        // ======================================

        List<Review> reviews =
                reviewRepository.findAll();

        return ResponseEntity.ok(reviews);
    }


    // ==========================================
    // DELETE ANY REVIEW
    // ADMIN ONLY
    // ==========================================

    @DeleteMapping("/admin/{reviewId}")
    public ResponseEntity<?> deleteReviewAsAdmin(
            @RequestHeader("userId") Long userId,
            @PathVariable Long reviewId) {

        // ======================================
        // CHECK ADMIN
        // ======================================

        if (!adminService.isAdmin(userId)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Access denied. Admin only."
                    );
        }


        // ======================================
        // CHECK REVIEW EXISTS
        // ======================================

        Optional<Review> reviewOptional =
                reviewRepository.findById(reviewId);

        if (reviewOptional.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // ======================================
        // DELETE REVIEW
        // ======================================

        reviewRepository.deleteById(reviewId);

        return ResponseEntity.ok(
                "Review deleted successfully."
        );
    }


    // ==========================================
    // REVIEW SUMMARY DTO
    // ==========================================

    public static class ReviewSummary {

        private Double averageRating;
        private long reviewCount;

        public ReviewSummary(
                Double averageRating,
                long reviewCount) {

            this.averageRating = averageRating;
            this.reviewCount = reviewCount;
        }

        public Double getAverageRating() {
            return averageRating;
        }

        public long getReviewCount() {
            return reviewCount;
        }
    }
}

