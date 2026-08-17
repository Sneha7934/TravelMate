package com.travelmate.backend.repository;

import com.travelmate.backend.entity.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttractionRepository
        extends JpaRepository<Attraction, Long> {

    List<Attraction> findByDestinationIdOrderByIdAsc(
            Long destinationId
    );
}