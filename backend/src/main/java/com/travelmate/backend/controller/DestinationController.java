package com.travelmate.backend.controller;

import com.travelmate.backend.entity.Destination;
import com.travelmate.backend.repository.DestinationRepository;
import com.travelmate.backend.service.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = "http://localhost:5173")
public class DestinationController {

    private final DestinationRepository destinationRepository;
    private final AdminService adminService;

    public DestinationController(
            DestinationRepository destinationRepository,
            AdminService adminService) {

        this.destinationRepository = destinationRepository;
        this.adminService = adminService;
    }

    // ==========================================
    // GET ALL DESTINATIONS
    // ==========================================

    @GetMapping
    public List<Destination> getAllDestinations() {

        return destinationRepository.findAll();
    }


    // ==========================================
    // GET DESTINATION BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getDestinationById(
            @PathVariable Long id) {

        return destinationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // ==========================================
    // ADD DESTINATION - ADMIN ONLY
    // ==========================================

    @PostMapping
    public ResponseEntity<?> addDestination(
            @RequestHeader("userId") Long userId,
            @RequestBody Destination destination) {

        // Check whether the logged-in user is an admin
        if (!adminService.isAdmin(userId)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied. Admin only.");
        }

        Destination savedDestination =
                destinationRepository.save(destination);

        return ResponseEntity.ok(savedDestination);
    }


    // ==========================================
    // UPDATE DESTINATION - ADMIN ONLY
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDestination(
            @RequestHeader("userId") Long userId,
            @PathVariable Long id,
            @RequestBody Destination updatedDestination) {

        // Check whether the logged-in user is an admin
        if (!adminService.isAdmin(userId)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied. Admin only.");
        }

        return destinationRepository.findById(id)
                .map(destination -> {

                    destination.setName(
                            updatedDestination.getName()
                    );

                    destination.setState(
                            updatedDestination.getState()
                    );

                    destination.setDescription(
                            updatedDestination.getDescription()
                    );

                    destination.setBudget(
                            updatedDestination.getBudget()
                    );

                    destination.setBestTime(
                            updatedDestination.getBestTime()
                    );

                    destination.setImageUrl(
                            updatedDestination.getImageUrl()
                    );

                    Destination savedDestination =
                            destinationRepository.save(destination);

                    return ResponseEntity.ok(savedDestination);

                })
                .orElse(ResponseEntity.notFound().build());
    }


    // ==========================================
    // DELETE DESTINATION - ADMIN ONLY
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDestination(
            @RequestHeader("userId") Long userId,
            @PathVariable Long id) {

        // Check whether the logged-in user is an admin
        if (!adminService.isAdmin(userId)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied. Admin only.");
        }

        if (!destinationRepository.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        destinationRepository.deleteById(id);

        return ResponseEntity.ok(
                "Destination deleted successfully."
        );
    }
}