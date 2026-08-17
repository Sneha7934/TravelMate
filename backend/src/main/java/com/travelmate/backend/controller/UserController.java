
package com.travelmate.backend.controller;

import com.travelmate.backend.dto.UserResponse;
import com.travelmate.backend.entity.User;
import com.travelmate.backend.repository.ReviewRepository;
import com.travelmate.backend.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // ==========================================
    // REGISTER
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user) {

        if (user.getEmail() == null ||
                user.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is required.");
        }

        if (user.getPassword() == null ||
                user.getPassword().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Password is required.");
        }

        String email =
                user.getEmail()
                        .trim()
                        .toLowerCase();

        // Check whether email already exists
        if (userRepository
                .findByEmail(email)
                .isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            "User already has an account with this email."
                    );
        }

        user.setEmail(email);

        // ======================================
        // ALWAYS REGISTER AS USER
        // ======================================

        user.setRole("USER");

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        return ResponseEntity.ok(
                new UserResponse(
                        savedUser.getId(),
                        savedUser.getName(),
                        savedUser.getEmail(),
                        savedUser.getRole()
                )
        );
    }


    // ==========================================
    // CHECK EMAIL
    // ==========================================

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(
            @RequestBody User user) {

        if (user.getEmail() == null ||
                user.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is required.");
        }

        String email =
                user.getEmail()
                        .trim()
                        .toLowerCase();

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "No account exists with this email."
                    );
        }

        return ResponseEntity.ok(
                "Email verified."
        );
    }


    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user) {

        if (user.getEmail() == null ||
                user.getPassword() == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid email or password."
                    );
        }

        String email =
                user.getEmail()
                        .trim()
                        .toLowerCase();

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid email or password."
                    );
        }

        User foundUser =
                existingUser.get();

        // Check password
        if (!passwordEncoder.matches(
                user.getPassword(),
                foundUser.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid email or password."
                    );
        }

        UserResponse response =
                new UserResponse(
                        foundUser.getId(),
                        foundUser.getName(),
                        foundUser.getEmail(),
                        foundUser.getRole()
                );

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // GET ALL USERS
    // ADMIN ONLY
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestHeader("userId") Long userId) {

        Optional<User> adminOptional =
                userRepository.findById(userId);

        if (adminOptional.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "User not found."
                    );
        }

        User admin =
                adminOptional.get();

        // Check admin role
        if (!"ADMIN".equalsIgnoreCase(
                admin.getRole())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Access denied. Admin only."
                    );
        }

        List<UserResponse> users =
                userRepository
                        .findAll()
                        .stream()
                        .map(user ->
                                new UserResponse(
                                        user.getId(),
                                        user.getName(),
                                        user.getEmail(),
                                        user.getRole()
                                )
                        )
                        .toList();

        return ResponseEntity.ok(users);
    }


    // ==========================================
    // GET USER PROFILE
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(
            @PathVariable Long id) {

        User user =
                userRepository
                        .findById(id)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "User not found."
                    );
        }

        return ResponseEntity.ok(
                new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                )
        );
    }


    // ==========================================
    // UPDATE USER PROFILE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User user =
                userRepository
                        .findById(id)
                        .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "User not found."
                    );
        }

        // ======================================
        // UPDATE NAME
        // ======================================

        if (updatedUser.getName() != null &&
                !updatedUser.getName()
                        .trim()
                        .isEmpty()) {

            user.setName(
                    updatedUser
                            .getName()
                            .trim()
            );
        }

        // ======================================
        // UPDATE EMAIL
        // ======================================

        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail()
                        .trim()
                        .isEmpty()) {

            String newEmail =
                    updatedUser
                            .getEmail()
                            .trim()
                            .toLowerCase();

            Optional<User> existingEmail =
                    userRepository
                            .findByEmail(newEmail);

            // Prevent another user from
            // taking this email
            if (existingEmail.isPresent() &&
                    !existingEmail.get()
                            .getId()
                            .equals(id)) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(
                                "Another account already uses this email."
                        );
            }

            user.setEmail(newEmail);
        }

        User savedUser =
                userRepository.save(user);

        return ResponseEntity.ok(
                new UserResponse(
                        savedUser.getId(),
                        savedUser.getName(),
                        savedUser.getEmail(),
                        savedUser.getRole()
                )
        );
    }


    // ==========================================
    // DELETE USER
    // ADMIN ONLY
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @RequestHeader("userId") Long userId,
            @PathVariable Long id) {

        // ======================================
        // FIND CURRENT ADMIN
        // ======================================

        Optional<User> adminOptional =
                userRepository.findById(userId);

        if (adminOptional.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Admin user not found."
                    );
        }

        User admin =
                adminOptional.get();

        // ======================================
        // CHECK ADMIN ROLE
        // ======================================

        if (!"ADMIN".equalsIgnoreCase(
                admin.getRole())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Access denied. Admin only."
                    );
        }

        // ======================================
        // PREVENT ADMIN SELF-DELETION
        // ======================================

        if (admin.getId().equals(id)) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "You cannot delete your own admin account."
                    );
        }

        // ======================================
        // FIND USER TO DELETE
        // ======================================

        Optional<User> userOptional =
                userRepository.findById(id);

        if (userOptional.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            "User not found."
                    );
        }

        User user =
                userOptional.get();

        // ======================================
        // PREVENT DELETING ANOTHER ADMIN
        // ======================================

        if ("ADMIN".equalsIgnoreCase(
                user.getRole())) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                            "Admin accounts cannot be deleted from user management."
                    );
        }

        // ======================================
        // DELETE USER'S REVIEWS FIRST
        // ======================================
        //
        // Review has:
        // @JoinColumn(name = "user_id",
        //              nullable = false)
        //
        // Therefore the reviews must be
        // removed before deleting the user.

        reviewRepository
                .deleteAll(
                        reviewRepository
                                .findByUser(user)
                );

        // ======================================
        // DELETE USER
        // ======================================

        userRepository.delete(user);

        return ResponseEntity.ok(
                "User deleted successfully."
        );
    }
}

