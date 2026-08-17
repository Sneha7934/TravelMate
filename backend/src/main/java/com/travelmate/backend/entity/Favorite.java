package com.travelmate.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "favorites",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"user_id", "destination_id"}
        )
    }
)
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;


    // Constructor
    public Favorite() {
    }


    public Favorite(User user, Destination destination) {
        this.user = user;
        this.destination = destination;
    }


    // Getters and Setters

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Destination getDestination() {
        return destination;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
    }
}