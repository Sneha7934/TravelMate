package com.travelmate.backend.controller;

import com.travelmate.backend.entity.Attraction;
import com.travelmate.backend.repository.AttractionRepository;
import com.travelmate.backend.service.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attractions")
@CrossOrigin(origins = "http://localhost:5173")
public class AttractionController {

    private final AttractionRepository attractionRepository;
    private final AdminService adminService;

    public AttractionController(
            AttractionRepository attractionRepository,
            AdminService adminService) {

        this.attractionRepository = attractionRepository;
        this.adminService = adminService;
    }


    // ==========================================
    // GET ALL ATTRACTIONS
    // PUBLIC
    // ==========================================

    @GetMapping
    public List<Attraction> getAllAttractions() {

        return attractionRepository.findAll();
    }


    // ==========================================
    // GET ATTRACTIONS BY DESTINATION
    // PUBLIC
    //
    // Sorted by attraction ID.
    // This order will be used for the tour plan.
    // ==========================================

    @GetMapping("/destination/{destinationId}")
    public List<Attraction> getAttractionsByDestination(
            @PathVariable Long destinationId) {

        return attractionRepository
                .findByDestinationIdOrderByIdAsc(destinationId);
    }


    // ==========================================
    // GET ATTRACTION BY ID
    // PUBLIC
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttractionById(
            @PathVariable Long id) {

        return attractionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // ==========================================
    // ADD ATTRACTION
    // ADMIN ONLY
    // ==========================================

    @PostMapping
    public ResponseEntity<?> addAttraction(
            @RequestHeader("userId") Long userId,
            @RequestBody Attraction attraction) {

        if (!adminService.isAdmin(userId)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied. Admin only.");
        }

        Attraction savedAttraction =
                attractionRepository.save(attraction);

        return ResponseEntity.ok(savedAttraction);
    }


    // ==========================================
    // UPDATE ATTRACTION
    // ADMIN ONLY
    // ==========================================

    @PutMapping("/{id}")
public ResponseEntity<?> updateAttraction(
        @RequestHeader("userId") Long userId,
        @PathVariable Long id,
        @RequestBody Attraction updatedAttraction) {

    // Check whether the logged-in user is an admin
    if (!adminService.isAdmin(userId)) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Access denied. Admin only.");
    }

    return attractionRepository.findById(id)
            .map(attraction -> {

                // NAME
                attraction.setName(
                        updatedAttraction.getName()
                );

                // DESCRIPTION
                attraction.setDescription(
                        updatedAttraction.getDescription()
                );

                // LOCATION
                attraction.setLocation(
                        updatedAttraction.getLocation()
                );

                // ENTRY FEE
                attraction.setEntryFee(
                        updatedAttraction.getEntryFee()
                );

                // IMAGE
                attraction.setImageUrl(
                        updatedAttraction.getImageUrl()
                );

                // LATITUDE
                attraction.setLatitude(
                        updatedAttraction.getLatitude()
                );

                // LONGITUDE
                attraction.setLongitude(
                        updatedAttraction.getLongitude()
                );

                // DESTINATION
                attraction.setDestination(
                        updatedAttraction.getDestination()
                );

                Attraction savedAttraction =
                        attractionRepository.save(attraction);

                return ResponseEntity.ok(savedAttraction);

            })
            .orElse(ResponseEntity.notFound().build());
}


    // ==========================================
    // DELETE ATTRACTION
    // ADMIN ONLY
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttraction(
            @RequestHeader("userId") Long userId,
            @PathVariable Long id) {

        if (!adminService.isAdmin(userId)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Access denied. Admin only.");
        }

        if (!attractionRepository.existsById(id)) {

            return ResponseEntity.notFound().build();
        }

        attractionRepository.deleteById(id);

        return ResponseEntity.ok(
                "Attraction deleted successfully."
        );
    }
}

