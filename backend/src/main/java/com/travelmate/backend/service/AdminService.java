package com.travelmate.backend.service;

import com.travelmate.backend.entity.User;
import com.travelmate.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean isAdmin(Long userId) {

        if (userId == null) {
            return false;
        }

        return userRepository.findById(userId)
                .map(user ->
                        "ADMIN".equalsIgnoreCase(user.getRole())
                )
                .orElse(false);
    }
}