package com.travelmate.backend.repository;

import com.travelmate.backend.entity.Favorite;
import com.travelmate.backend.entity.User;
import com.travelmate.backend.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUser(User user);

    Optional<Favorite> findByUserAndDestination(
            User user,
            Destination destination
    );

}