package com.travelmate.backend.controller;

import com.travelmate.backend.entity.Destination;
import com.travelmate.backend.entity.Favorite;
import com.travelmate.backend.entity.User;
import com.travelmate.backend.repository.DestinationRepository;
import com.travelmate.backend.repository.FavoriteRepository;
import com.travelmate.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public FavoriteController(
            FavoriteRepository favoriteRepository,
            UserRepository userRepository,
            DestinationRepository destinationRepository) {

        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
    }


    // ==========================================
    // ADD FAVORITE
    // ==========================================

    @PostMapping("/user/{userId}/destination/{destinationId}")
    public ResponseEntity<?> addFavorite(
            @PathVariable Long userId,
            @PathVariable Long destinationId) {

        User user = userRepository
                .findById(userId)
                .orElse(null);

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


        // Check whether already favorited

        if (favoriteRepository
                .findByUserAndDestination(user, destination)
                .isPresent()) {

            return ResponseEntity
                    .badRequest()
                    .body("Destination already added to favorites");

        }


        Favorite favorite = new Favorite();

        favorite.setUser(user);
        favorite.setDestination(destination);


        Favorite savedFavorite =
                favoriteRepository.save(favorite);


        return ResponseEntity.ok(savedFavorite);
    }


    // ==========================================
    // GET USER FAVORITES
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserFavorites(
            @PathVariable Long userId) {

        User user = userRepository
                .findById(userId)
                .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");

        }


        List<Favorite> favorites =
                favoriteRepository.findByUser(user);


        return ResponseEntity.ok(favorites);
    }


    // ==========================================
    // REMOVE FAVORITE
    // ==========================================

    @DeleteMapping("/user/{userId}/destination/{destinationId}")
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long userId,
            @PathVariable Long destinationId) {


        User user = userRepository
                .findById(userId)
                .orElse(null);


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


        // Find the actual favorite

        Optional<Favorite> favorite =
                favoriteRepository
                        .findByUserAndDestination(
                                user,
                                destination
                        );


        if (favorite.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Favorite not found");

        }


        // Delete the actual favorite

        favoriteRepository.delete(
                favorite.get()
        );


        return ResponseEntity.ok(
                "Favorite removed successfully"
        );
    }
}